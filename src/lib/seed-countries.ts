export interface CountryLaw {
  country: string;
  code: string;
  legalStatus: "Fully Legal" | "Medical Only" | "Decriminalized" | "Partially Legal";
  recreational: boolean;
  medical: boolean;
  summary: string;
  recentChanges: string;
}

export const seedCountryLaws: CountryLaw[] = [
  // ─── FULLY LEGAL (Recreational + Medical) ─────────────────────────────────────
  {
    country: "Canada",
    code: "CA",
    legalStatus: "Fully Legal",
    recreational: true,
    medical: true,
    summary:
      "Legalized nationwide in October 2018 under the Cannabis Act. Adults 18+ (19+ in some provinces) may purchase from licensed retailers, possess up to 30g in public, and grow up to 4 plants per household.",
    recentChanges:
      "Edible and extract markets matured; provinces continue expanding retail licensing; federal Cannabis Act review completed in 2024",
  },
  {
    country: "Germany",
    code: "DE",
    legalStatus: "Fully Legal",
    recreational: true,
    medical: true,
    summary:
      "Adults 18+ may possess up to 25g in public and 50g at home. Home cultivation of up to 3 plants per adult allowed. Cannabis social clubs authorized to grow and distribute to members.",
    recentChanges:
      "Partial legalization law (CanG) took effect April 1, 2024; cannabis social clubs launched July 2024; commercial retail model under consideration",
  },
  {
    country: "Malta",
    code: "MT",
    legalStatus: "Fully Legal",
    recreational: true,
    medical: true,
    summary:
      "First EU country to legalize personal recreational cannabis in December 2021. Adults 18+ may possess up to 7g and grow up to 4 plants at home. No commercial sales — distribution through cannabis associations only.",
    recentChanges:
      "Cannabis associations authorized and licensing underway; medical program continues through pharmacies",
  },
  {
    country: "South Africa",
    code: "ZA",
    legalStatus: "Fully Legal",
    recreational: true,
    medical: true,
    summary:
      "Constitutional Court ruled in 2018 that private use, possession, and cultivation by adults is legal. No legal framework for commercial sales yet. Public consumption remains prohibited.",
    recentChanges:
      "Cannabis for Private Purposes Bill progressing through Parliament to formalize decriminalization; medical licensing system operational",
  },
  {
    country: "Thailand",
    code: "TH",
    legalStatus: "Fully Legal",
    recreational: true,
    medical: true,
    summary:
      "Removed cannabis from the narcotics list in June 2022. Cannabis can be grown, sold, and consumed, though regulations focus on health and tourism use. Recreational smoking in public is discouraged.",
    recentChanges:
      "Cannabis control bill debated since 2024 to regulate recreational use; medical and wellness tourism driving market growth",
  },
  {
    country: "Uruguay",
    code: "UY",
    legalStatus: "Fully Legal",
    recreational: true,
    medical: true,
    summary:
      "First country to fully legalize cannabis in 2013. Residents can buy from pharmacies (up to 40g/month), join cannabis clubs, or grow up to 6 plants at home. Foreigners cannot purchase.",
    recentChanges:
      "Market growth steady; pharmacy availability expanded; cannabis club regulations updated",
  },

  // ─── PARTIALLY LEGAL ──────────────────────────────────────────────────────────
  {
    country: "Australia",
    code: "AU",
    legalStatus: "Partially Legal",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legal nationwide since 2016 via prescription. ACT (Australian Capital Territory) legalized personal use and home grow for adults in 2020. Other states remain medical-only.",
    recentChanges:
      "ACT personal use law expanded; TGA medical cannabis prescriptions surpassed 1 million; Senate inquiry into recreational legalization ongoing",
  },
  {
    country: "Mexico",
    code: "MX",
    legalStatus: "Partially Legal",
    recreational: false,
    medical: true,
    summary:
      "Supreme Court declared prohibition of personal recreational use unconstitutional in 2021. Medical cannabis legalized in 2017. Federal regulation for recreational market has stalled in Congress.",
    recentChanges:
      "Multiple Supreme Court rulings granted individual permits for recreational use; comprehensive regulatory framework still pending in legislature",
  },
  {
    country: "Netherlands",
    code: "NL",
    legalStatus: "Partially Legal",
    recreational: false,
    medical: true,
    summary:
      "Cannabis sale is tolerated in licensed coffee shops (up to 5g per transaction). Technically illegal but not enforced under the gedoogbeleid (tolerance policy). Medical cannabis available via pharmacies.",
    recentChanges:
      "Closed supply chain pilot ('wietexperiment') launched in 10 municipalities to test regulated cultivation for coffee shops; results expected to inform national policy",
  },
  {
    country: "Spain",
    code: "ES",
    legalStatus: "Partially Legal",
    recreational: false,
    medical: false,
    summary:
      "Personal use and cultivation at home is decriminalized. Cannabis social clubs operate in a legal grey area, especially in Catalonia and the Basque Country. No commercial sales or formal medical program.",
    recentChanges:
      "Cannabis social club regulation advanced in several autonomous communities; national medical cannabis legislation under parliamentary discussion",
  },

  // ─── MEDICAL ONLY ─────────────────────────────────────────────────────────────
  {
    country: "Argentina",
    code: "AR",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legalized in 2017 for epilepsy and expanded conditions. Patients may grow at home or join cultivation cooperatives. Personal possession decriminalized by court rulings.",
    recentChanges:
      "2022 regulations created framework for industrial cultivation and export; REPROCANN patient registry expanded",
  },
  {
    country: "Brazil",
    code: "BR",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis products can be imported or purchased at pharmacies with a prescription from ANVISA. Personal cultivation has been granted in limited court rulings. Recreational use is illegal.",
    recentChanges:
      "ANVISA expanded approved medical products; STF (Supreme Court) ruled personal possession of up to 40g is not a crime (2024); domestic cultivation legislation under debate",
  },
  {
    country: "Chile",
    code: "CL",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legal with a prescription. Personal cultivation of small amounts is tolerated. Recreational use remains illegal but small-quantity possession has been decriminalized.",
    recentChanges:
      "Expanded medical cannabis cultivation licenses; recreational legalization bill introduced but not yet passed",
  },
  {
    country: "Colombia",
    code: "CO",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis and industrial hemp legalized in 2016. Personal possession of up to 20g and cultivation of up to 20 plants decriminalized. Robust export-oriented cultivation industry.",
    recentChanges:
      "Cannabis export market growing; recreational legalization bill debated in Congress; regulatory framework streamlined for licensed producers",
  },
  {
    country: "Costa Rica",
    code: "CR",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis and hemp legalized in March 2022. Industrial cultivation, processing, and sale for medicinal use authorized. Recreational use remains illegal.",
    recentChanges:
      "Law 10113 signed 2022; licensing framework for cultivation and manufacturing being implemented; first medical products reaching market",
  },
  {
    country: "Croatia",
    code: "HR",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis available through pharmacies with a doctor's prescription since 2015. Recreational use is illegal but small-quantity possession is generally treated leniently.",
    recentChanges:
      "Medical program expanded to include additional qualifying conditions; domestic cultivation for medical supply authorized",
  },
  {
    country: "Cyprus",
    code: "CY",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legalized in 2019 for specific conditions. Patients must obtain from licensed pharmacies. Recreational use remains illegal.",
    recentChanges:
      "First medical cannabis prescriptions issued; cultivation licenses granted to domestic producers",
  },
  {
    country: "Czech Republic",
    code: "CZ",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legal since 2013 with a prescription. Personal possession of small amounts (up to 10g) is decriminalized as a misdemeanor. Home cultivation of up to 5 plants tolerated.",
    recentChanges:
      "Amendment expanded list of qualifying conditions; cannabis partially covered by health insurance; recreational legalization bill under parliamentary debate",
  },
  {
    country: "Denmark",
    code: "DK",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis available through a pilot program since 2018, made permanent in 2021. Patients access via pharmacies with a doctor's prescription. Recreational use is illegal.",
    recentChanges:
      "Medical cannabis pilot program made permanent; domestic cultivation expanded to reduce import dependence",
  },
  {
    country: "Ecuador",
    code: "EC",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical and therapeutic use of cannabis legalized in 2019. Small-quantity possession decriminalized. Recreational use remains prohibited.",
    recentChanges:
      "Regulatory framework for medical cannabis production and distribution developed; first cultivation licenses issued",
  },
  {
    country: "Finland",
    code: "FI",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis available on a case-by-case basis with a special permit from Fimea. Very restricted — typically only after other treatments have failed. Recreational use is illegal.",
    recentChanges:
      "Slight expansion of medical access; citizen initiatives for decriminalization discussed but not advanced",
  },
  {
    country: "France",
    code: "FR",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis experiment launched in 2021 for patients with specific conditions who haven't responded to other treatments. Recreational use is illegal with a fixed fine for possession.",
    recentChanges:
      "Medical cannabis experimentation extended and expanded; fixed fine of €200 for recreational possession implemented; full medical legalization bill under consideration",
  },
  {
    country: "Greece",
    code: "GR",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legalized in 2017. Pharmaceutical-grade products available with a prescription. Industrial cultivation for export authorized. Recreational use remains illegal.",
    recentChanges:
      "Cultivation licenses for pharmaceutical production expanded; export market growing; medical access broadened",
  },
  {
    country: "Ireland",
    code: "IE",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical Cannabis Access Programme (MCAP) launched in 2019 for specific conditions including spasticity, chemotherapy side effects, and treatment-resistant epilepsy. Recreational use is illegal.",
    recentChanges:
      "MCAP made permanent; Citizens' Assembly recommended decriminalization of personal possession; legislation under review",
  },
  {
    country: "Israel",
    code: "IL",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "One of the most advanced medical cannabis programs globally. Over 100,000 patients registered. Possession of small amounts partially decriminalized. Recreational use remains illegal.",
    recentChanges:
      "Medical cannabis reform expanded access and reduced bureaucracy; export market launched; recreational decriminalization advanced with on-the-spot fines replacing criminal charges",
  },
  {
    country: "Italy",
    code: "IT",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis available since 2013 via prescription, partly supplied by military pharmaceutical facilities. Personal use is decriminalized but remains an administrative offense.",
    recentChanges:
      "Referendum on recreational legalization deemed inadmissible by Constitutional Court; domestic medical production increased; CBD market regulations clarified",
  },
  {
    country: "Jamaica",
    code: "JM",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Possession of up to 2 oz decriminalized in 2015. Medical cannabis and sacramental use (Rastafari) legally protected. Home cultivation of up to 5 plants allowed. No commercial recreational market.",
    recentChanges:
      "Cannabis Licensing Authority expanded licensing; medical and export-oriented cultivation growing; tourism-linked consumption experiences emerging",
  },
  {
    country: "Lebanon",
    code: "LB",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "First Arab country to legalize medical cannabis cultivation in April 2020. Law allows licensed growing for medical and industrial purposes. Personal recreational use remains illegal.",
    recentChanges:
      "Medical cultivation law passed but implementation delayed due to economic and political challenges",
  },
  {
    country: "Luxembourg",
    code: "LU",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis available since 2018 through pharmacies. Home cultivation of up to 4 plants per household legalized in 2023 for personal use. Public consumption remains illegal.",
    recentChanges:
      "Home cultivation law enacted 2023; commercial recreational sales framework shelved in favor of personal-use model; medical program expanded",
  },
  {
    country: "New Zealand",
    code: "NZ",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legalized in 2018 under the Medicinal Cannabis Scheme. Recreational legalization referendum narrowly failed in 2020 (48.4% yes). Recreational use remains illegal.",
    recentChanges:
      "Medicinal Cannabis Scheme expanded with more products approved; domestic cultivation licenses issued; recreational reform not currently on the agenda",
  },
  {
    country: "North Macedonia",
    code: "MK",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legalized in 2016, one of the first countries in Europe to do so. Licensed cultivation and export authorized. Recreational use remains illegal.",
    recentChanges:
      "Export market established; additional cultivation licenses issued; regulatory framework refined",
  },
  {
    country: "Norway",
    code: "NO",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis available on a case-by-case basis through special prescription. Very limited access. Government proposed drug reform toward a health-based approach for personal use.",
    recentChanges:
      "Drug reform proposal debated but not fully enacted; medical access slightly expanded; harm-reduction approach endorsed",
  },
  {
    country: "Panama",
    code: "PA",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legalized in 2021 for patients with qualifying conditions. Regulated production and distribution framework established. Recreational use remains illegal.",
    recentChanges:
      "Law 242 signed October 2021; regulatory implementation underway; first medical products becoming available",
  },
  {
    country: "Peru",
    code: "PE",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legalized in 2017. Patients can access cannabis oil and related products through licensed pharmacies. Personal cultivation for medical purposes authorized in 2021.",
    recentChanges:
      "Regulations updated to allow personal medical cultivation; domestic production licensing expanded; import market growing",
  },
  {
    country: "Poland",
    code: "PL",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legal since 2017 with a prescription. Products imported from approved international sources. Recreational use is illegal with relatively strict enforcement.",
    recentChanges:
      "Government coalition proposed decriminalization of personal possession; medical cannabis prescriptions increased significantly; domestic cultivation under discussion",
  },
  {
    country: "Portugal",
    code: "PT",
    legalStatus: "Decriminalized",
    recreational: false,
    medical: true,
    summary:
      "All drugs decriminalized for personal use since 2001 (up to 25g of cannabis). Medical cannabis legalized in 2018. Users may face administrative penalties (fines, treatment referral) but not criminal charges.",
    recentChanges:
      "Medical cannabis market launched with pharmacy sales; decriminalization model continues as global reference; licensed cultivation for medical export authorized",
  },
  {
    country: "Rwanda",
    code: "RW",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis cultivation and export legalized in 2021. Domestic use remains restricted. Focus on becoming an export hub for medical cannabis products.",
    recentChanges:
      "Cabinet approved medical cannabis regulations; cultivation licenses issued to select companies; export-oriented industry developing",
  },
  {
    country: "San Marino",
    code: "SM",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legalized for therapeutic use. Small microstate with limited domestic market. Products imported from licensed suppliers.",
    recentChanges:
      "Medical access program established; patient registration system operational",
  },
  {
    country: "Sri Lanka",
    code: "LK",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Cabinet approved cultivation of cannabis for medical and scientific purposes in 2023. Export-oriented cultivation authorized. Personal recreational use remains strictly illegal.",
    recentChanges:
      "Cabinet approval for medical cannabis cultivation granted; Ayurvedic medical use under traditional medicine framework; export regulations under development",
  },
  {
    country: "Switzerland",
    code: "CH",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis available with a prescription since 2022 (previously required special authorization). Possession of up to 10g is decriminalized with a fine. CBD products with under 1% THC are legal.",
    recentChanges:
      "Prescription-based medical access replaced special authorization in 2022; pilot trials for regulated recreational cannabis sales launched in multiple cities including Zurich and Basel",
  },
  {
    country: "United Kingdom",
    code: "GB",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legalized in November 2018. Specialist doctors can prescribe for conditions where other treatments have failed. Private clinics drive most prescriptions. Recreational use is illegal (Class B drug).",
    recentChanges:
      "Medical cannabis prescriptions growing rapidly through private clinics; NHS access remains very limited; police deprioritization of personal possession in some forces",
  },
  {
    country: "Vanuatu",
    code: "VU",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical cannabis legalized for therapeutic and export purposes. Focus on developing a cultivation and export industry. Recreational use remains illegal.",
    recentChanges:
      "Medical cannabis legislation enacted; export-oriented cultivation framework under development",
  },
  {
    country: "Zimbabwe",
    code: "ZW",
    legalStatus: "Medical Only",
    recreational: false,
    medical: true,
    summary:
      "Medical and scientific cannabis cultivation legalized in 2018. Licensed producers can grow for domestic medical use and export. Personal and recreational use remains illegal.",
    recentChanges:
      "Cultivation licenses expanded; export market developing; government promoting cannabis as an economic crop",
  },

  // ─── DECRIMINALIZED ───────────────────────────────────────────────────────────
  {
    country: "Belgium",
    code: "BE",
    legalStatus: "Decriminalized",
    recreational: false,
    medical: false,
    summary:
      "Personal possession of up to 3g and cultivation of one plant is tolerated for adults (lowest police priority). No formal medical cannabis program, though magistrate-issued permissions exist.",
    recentChanges:
      "Tolerance policy unchanged; discussion of formal regulation increased; medical cannabis pilot proposals discussed in parliament",
  },
  {
    country: "Estonia",
    code: "EE",
    legalStatus: "Decriminalized",
    recreational: false,
    medical: false,
    summary:
      "Small-quantity personal possession is treated as a misdemeanor with a fine rather than criminal prosecution. No medical cannabis program. Sale and distribution remain criminal offenses.",
    recentChanges:
      "No major legislative changes; harm-reduction approach maintained",
  },
  {
    country: "Moldova",
    code: "MD",
    legalStatus: "Decriminalized",
    recreational: false,
    medical: false,
    summary:
      "Personal possession of small amounts decriminalized (administrative fine). No medical cannabis program. Cultivation and sale remain criminal offenses.",
    recentChanges:
      "Decriminalization of personal use maintained; no movement toward medical or recreational legalization",
  },
  {
    country: "Nepal",
    code: "NP",
    legalStatus: "Decriminalized",
    recreational: false,
    medical: false,
    summary:
      "Cannabis was prohibited in 1973 but enforcement is lax. Bills to legalize cannabis for medical and industrial use have been introduced. Traditional and cultural use has deep historical roots.",
    recentChanges:
      "Legalization bill introduced in parliament in 2024; growing advocacy for regulated cannabis to boost economy and tourism",
  },
  {
    country: "Slovenia",
    code: "SI",
    legalStatus: "Decriminalized",
    recreational: false,
    medical: false,
    summary:
      "Personal possession of small amounts treated as a misdemeanor (fine, no jail). No formal medical cannabis program, though CBD products are available. Cultivation remains illegal.",
    recentChanges:
      "No major changes; CBD market growing; occasional parliamentary discussion of reform",
  },
] satisfies CountryLaw[];

seedCountryLaws.sort((a, b) => a.country.localeCompare(b.country));
