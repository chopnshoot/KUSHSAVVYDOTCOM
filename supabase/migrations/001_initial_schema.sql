-- KushSavvy Platform Schema V1
-- Evidence-based cannabis intelligence platform

-- ─── Users ───────────────────────────────────────────────────────────────────

CREATE TABLE users (
  user_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  locale               TEXT,
  anonymous_device_id  TEXT UNIQUE,  -- installationId from extension (random UUID)
  consent_capture_enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  consent_personalization_enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_profile (
  user_id                  UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  experience_level         TEXT CHECK (experience_level IN ('new', 'casual', 'weekly', 'daily')),
  tolerance_level          INT CHECK (tolerance_level BETWEEN 1 AND 5),
  preferred_categories     JSONB DEFAULT '[]',   -- ["flower", "vape"]
  avoid_list               JSONB DEFAULT '[]',   -- ["paranoia", "couch_lock"]
  preferred_effects        JSONB DEFAULT '{}',   -- { focus: 0.34, calm: 0.33 }
  terpene_preferences      JSONB DEFAULT '{}',   -- { myrcene: 0.5, limonene: 0.3 }
  preferred_flavors        JSONB DEFAULT '[]',
  typical_consumption_time TEXT CHECK (typical_consumption_time IN ('day', 'night', 'both', 'weekends')),
  potency_target           FLOAT CHECK (potency_target BETWEEN 0 AND 1),  -- 0=light, 1=max
  budget_range             JSONB,                -- { min, max, currency }
  profile_version          TEXT NOT NULL DEFAULT '1.0',
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Sources ─────────────────────────────────────────────────────────────────

CREATE TABLE sources (
  source_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain       TEXT UNIQUE NOT NULL,
  source_type  TEXT NOT NULL CHECK (source_type IN ('marketplace', 'review_site', 'brand_site', 'lab', 'forum', 'other')),
  base_weight  FLOAT NOT NULL CHECK (base_weight BETWEEN 0 AND 1),
  notes        TEXT
);

-- Pre-seed source weights
INSERT INTO sources (domain, source_type, base_weight, notes) VALUES
  ('coa.lab',          'lab',           1.00, 'COA lab results — highest trust'),
  ('dutchie.com',      'marketplace',   0.80, 'Dispensary verified menus'),
  ('iheartjane.com',   'marketplace',   0.80, 'Verified dispensary menus'),
  ('brand.official',   'brand_site',    0.75, 'Brand official site product pages'),
  ('leafly.com',       'review_site',   0.60, 'Leafly product + strain pages'),
  ('weedmaps.com',     'marketplace',   0.60, 'Weedmaps product pages'),
  ('allbud.com',       'review_site',   0.50, 'User reviews'),
  ('reddit.com',       'forum',         0.30, 'Community discussion'),
  ('generic.blog',     'other',         0.15, 'SEO blogs and affiliate content');

-- ─── Captured Pages ───────────────────────────────────────────────────────────

CREATE TABLE captured_pages (
  captured_page_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(user_id),
  source_id        UUID REFERENCES sources(source_id),
  url              TEXT NOT NULL,
  page_type        TEXT NOT NULL CHECK (page_type IN ('product', 'strain', 'review', 'menu')),
  captured_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  dom_snapshot_hash TEXT,          -- sha256 of url+name+thc (no full DOM)
  extracted_json   JSONB          -- full PageCaptureEvent.extracted
);

CREATE INDEX idx_captured_pages_url ON captured_pages(url);
CREATE INDEX idx_captured_pages_user ON captured_pages(user_id);

-- ─── Product Candidates (raw, pre-canonicalization) ───────────────────────────

CREATE TABLE product_candidates (
  product_candidate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  captured_page_id     UUID REFERENCES captured_pages(captured_page_id),
  product_name         TEXT NOT NULL,
  brand_name           TEXT,
  strain_display_name  TEXT,
  category             TEXT,
  subcategory          TEXT,
  potency_json         JSONB,   -- { thc_percent, cbd_percent }
  terpenes_json        JSONB,   -- [{ name, percent }]
  site_tags_json       JSONB,   -- { effects: [], flavors: [] }
  description_text     TEXT,
  lab_report_url       TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  canonicalization_status TEXT DEFAULT 'pending' CHECK (canonicalization_status IN ('pending', 'processing', 'done', 'failed')),
  canonical_product_id UUID     -- set after canonicalization
);

-- ─── Canonical Entities ───────────────────────────────────────────────────────

CREATE TABLE canonical_strains (
  canonical_strain_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name      TEXT NOT NULL,
  normalized_name     TEXT NOT NULL UNIQUE,   -- lowercase, no punctuation
  strain_type_most_likely TEXT CHECK (strain_type_most_likely IN ('indica', 'sativa', 'hybrid', 'unknown')),
  lineage_claims      JSONB DEFAULT '{}',
  terpene_signature   JSONB DEFAULT '[]',     -- [{ name, mean_pct, std_dev, sample_count }]
  effect_tags         JSONB DEFAULT '[]',     -- [{ tag, support_weight }]
  warning_tags        JSONB DEFAULT '[]',     -- [{ tag, support_weight }]
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE canonical_products (
  canonical_product_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_strain_id   UUID REFERENCES canonical_strains(canonical_strain_id),
  canonical_product_name TEXT NOT NULL,
  brand_canonical       TEXT,
  category              TEXT NOT NULL,
  subcategory           TEXT,
  form_factor           TEXT,
  typical_unit_size     JSONB,               -- { value, unit }
  potency_distribution  JSONB DEFAULT '{}',  -- { thc_mean, thc_std, cbd_mean, sample_count }
  terpene_distribution  JSONB DEFAULT '[]',  -- [{ name, mean_pct, std_dev }]
  effect_tags           JSONB DEFAULT '[]',  -- [{ tag, support_weight, confidence }]
  warning_tags          JSONB DEFAULT '[]',
  overall_confidence    FLOAT DEFAULT 0.0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_aliases (
  product_alias_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_product_id  UUID NOT NULL REFERENCES canonical_products(canonical_product_id),
  alias_text            TEXT NOT NULL,
  normalized_alias      TEXT NOT NULL,        -- for fuzzy lookup
  source_id             UUID REFERENCES sources(source_id),
  confidence            FLOAT NOT NULL DEFAULT 0.0,
  evidence_refs         JSONB DEFAULT '[]',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_product_aliases_unique ON product_aliases(normalized_alias, canonical_product_id);
CREATE INDEX idx_product_aliases_lookup ON product_aliases(normalized_alias);

CREATE TABLE strain_aliases (
  strain_alias_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_strain_id   UUID NOT NULL REFERENCES canonical_strains(canonical_strain_id),
  alias_text            TEXT NOT NULL,
  normalized_alias      TEXT NOT NULL,
  source_id             UUID REFERENCES sources(source_id),
  confidence            FLOAT NOT NULL DEFAULT 0.0,
  evidence_refs         JSONB DEFAULT '[]',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_strain_aliases_unique ON strain_aliases(normalized_alias, canonical_strain_id);

-- ─── Evidence Items (audit trail) ─────────────────────────────────────────────

CREATE TABLE evidence_items (
  evidence_item_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_type      TEXT NOT NULL CHECK (evidence_type IN ('description', 'terp_table', 'coa_link', 'review', 'menu_price', 'image', 'site_tags')),
  source_id          UUID REFERENCES sources(source_id),
  url                TEXT,
  captured_page_id   UUID REFERENCES captured_pages(captured_page_id),
  canonical_product_id UUID REFERENCES canonical_products(canonical_product_id),
  extracted_json     JSONB,
  reliability_weight FLOAT NOT NULL DEFAULT 0.5,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Reviews ─────────────────────────────────────────────────────────────────

CREATE TABLE reviews (
  review_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id              UUID REFERENCES sources(source_id),
  canonical_product_id   UUID REFERENCES canonical_products(canonical_product_id),
  canonical_strain_id    UUID REFERENCES canonical_strains(canonical_strain_id),
  rating_value           FLOAT,
  rating_scale           FLOAT,              -- 5.0 means 1-5 scale
  review_text            TEXT NOT NULL,
  extracted_effect_tags  JSONB DEFAULT '[]',
  extracted_outcome_tags JSONB DEFAULT '[]',
  sentiment_score        FLOAT,              -- 0-1, computed
  captured_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_product ON reviews(canonical_product_id);
CREATE INDEX idx_reviews_strain ON reviews(canonical_strain_id);

-- ─── Scores ───────────────────────────────────────────────────────────────────

CREATE TABLE scores_consensus (
  canonical_product_id UUID PRIMARY KEY REFERENCES canonical_products(canonical_product_id),
  consensus_score      FLOAT NOT NULL CHECK (consensus_score BETWEEN 0 AND 100),
  confidence           FLOAT NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  sample_size          INT NOT NULL DEFAULT 0,
  last_computed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  score_components     JSONB DEFAULT '{}'    -- breakdown for explainability
);

CREATE TABLE scores_personalized (
  user_id              UUID NOT NULL REFERENCES users(user_id),
  canonical_product_id UUID NOT NULL REFERENCES canonical_products(canonical_product_id),
  personalized_score   FLOAT NOT NULL CHECK (personalized_score BETWEEN 0 AND 100),
  confidence           FLOAT NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  match_explanation    JSONB DEFAULT '{}',   -- { why_it_matches, watch_out_for, components }
  last_computed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, canonical_product_id)
);

-- ─── Feedback Sessions ────────────────────────────────────────────────────────

CREATE TABLE sessions_feedback (
  session_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(user_id),
  canonical_product_id UUID NOT NULL REFERENCES canonical_products(canonical_product_id),
  consumed_at          TIMESTAMPTZ,
  context_json         JSONB DEFAULT '{}',  -- { goal, time_of_day, setting }
  dosage_estimate      JSONB,               -- { method, puffs, mg_estimate }
  user_rating          INT CHECK (user_rating BETWEEN 1 AND 5),
  outcomes_json        JSONB DEFAULT '{}',  -- { focus: 0.8, relaxation: 0.4, anxiety: 0.0 }
  notes_text           TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_feedback_user ON sessions_feedback(user_id);
CREATE INDEX idx_sessions_feedback_product ON sessions_feedback(canonical_product_id);
