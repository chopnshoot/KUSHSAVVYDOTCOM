import Link from "next/link";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Tools",
    links: [
      { label: "Strain Finder", href: "/tools/strain-finder" },
      { label: "Dosage Calculator", href: "/tools/dosage-calculator" },
      { label: "Tolerance Guide", href: "/tools/tolerance-guide" },
      { label: "Terpene Explorer", href: "/tools/terpene-explorer" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Strain Library", href: "/strains" },
      { label: "Learn", href: "/learn" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "State Laws", href: "/legal" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
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
        <div className="mt-12 border-t border-border pt-8">
          <p className="font-body text-sm text-text-secondary text-center">
            &copy; {currentYear} KushSavvy. All rights reserved. For
            educational purposes only. Not medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
