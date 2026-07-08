import Link from "next/link";
import Image from "next/image";

const APPLY_URL = "https://forms.gle/pdaLG1936wXXB2ui7";
const INSTAGRAM_URL = "https://www.instagram.com/nexura_rgpv";
const LINKEDIN_URL = "https://www.linkedin.com/company/nexura-rgpv";

const socialLinkClass =
  "mb-3 inline-flex items-center gap-2 rounded-xl border border-nx-purple/25 px-4 py-2 text-sm text-nx-muted transition-all hover:border-nx-orchid/50 hover:text-nx-orchid";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const quickLinks = [
  { label: "Home", href: "/#home", external: false },
  { label: "Domains", href: "/#domains", external: false },
  { label: "Team", href: "/team", external: false },
  { label: "Events", href: "/events", external: false },
  { label: "Apply", href: APPLY_URL, external: true },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-nx-purple/15 bg-nx-surface/40 px-4 py-8 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div>
            <Image
              src="/images/LOGO NEXURA 1.png"
              alt="Nexura logo"
              width={48}
              height={48}
              className="mb-3 object-contain"
            />
            <p className="text-nx-orchid font-outfit text-lg font-bold tracking-widest">
              NEXURA
            </p>
            <p className="text-nx-muted mt-1 text-sm">
              Creation Leads, Victory Follows
            </p>
            <a
              href="mailto:nexurargpv@gmail.com"
              className="text-nx-muted mt-1 block text-xs transition-colors hover:text-nx-orchid"
            >
              nexurargpv@gmail.com
            </a>
          </div>

          <div>
            <h3 className="text-nx-text mb-4 text-sm font-semibold">
              Quick Links
            </h3>
            {quickLinks.map(({ label, href, external }) =>
              external ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nx-muted mb-2 block text-sm transition-colors hover:text-nx-orchid"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  href={href}
                  className="text-nx-muted mb-2 block text-sm transition-colors hover:text-nx-orchid"
                >
                  {label}
                </Link>
              )
            )}
          </div>

          <div>
            <h3 className="text-nx-text mb-4 text-sm font-semibold">
              Follow Us
            </h3>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={socialLinkClass}
            >
              <InstagramIcon size={16} />
              Instagram
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={socialLinkClass}
            >
              <LinkedinIcon size={16} />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="text-nx-muted mt-8 border-t border-nx-purple/10 pt-6 text-center text-xs">
          © 2025 Nexura Club · UIT-RGPV, Bhopal
        </div>
      </div>
    </footer>
  );
}
