import Link from "next/link";
import Logo from "@/components/ui/Logo";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Tools",
    links: [
      { label: "Strain Recommender", href: "/tools/strain-recommender" },
      { label: "Dosage Calculator", href: "/tools/edible-dosage-calculator" },
      { label: "Strain Comparison", href: "/tools/strain-compare" },
      { label: "Terpene Guide", href: "/tools/terpene-guide" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Learn", href: "/learn" },
      { label: "Is It Legal?", href: "/tools/is-it-legal" },
      { label: "Cost Calculator", href: "/tools/cost-calculator" },
      { label: "Tolerance Planner", href: "/tools/tolerance-break-planner" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "State Laws", href: "/legal" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "All Tools", href: "/tools" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      {/* Newsletter Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 rounded-card bg-tag-bg px-6 py-8 sm:px-10 sm:py-10">
          <NewsletterSignup />
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-heading text-sm font-semibold text-text-primary">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-text-secondary hover:text-accent-green transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-8 flex flex-col items-center gap-4">
          <Logo size="sm" />
          <p className="font-body text-sm text-text-secondary text-center">
            &copy; {currentYear} KushSavvy. All rights reserved. For
            educational purposes only. Not medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
