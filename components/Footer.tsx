import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#16161D",
        color: "#FFFFFF",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "4rem 1.5rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "3rem",
          }}
          className="md:grid-cols-4"
        >
          {/* Brand */}
          <div style={{ gridColumn: "span 2" }} className="md:col-span-2">
            <Link
              href="/"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.125rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                color: "#FFFFFF",
                textDecoration: "none",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              CASA NOMADA
            </Link>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                maxWidth: "18rem",
              }}
            >
              Elegante digitale trouwkaarten. Personaliseer in minuten, publiceer met één klik en laat elke gast antwoorden in zijn eigen taal.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#6B7280",
                marginBottom: "1rem",
                fontFamily: "system-ui, sans-serif",
                fontWeight: 600,
              }}
            >
              Product
            </h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Sjablonen", href: "/templates" },
                { label: "Hoe het werkt", href: "/#werkwijze" },
                { label: "Voordelen", href: "/#voordelen" },
                { label: "Prijzen", href: "/#prijzen" },
                { label: "FAQ", href: "/#faq" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{
                    fontSize: "0.875rem",
                    color: "#9CA3AF",
                    textDecoration: "none",
                    transition: "color 0.15s",
                    fontFamily: "system-ui, sans-serif",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Account */}
          <div>
            <h3
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#6B7280",
                marginBottom: "1rem",
                fontFamily: "system-ui, sans-serif",
                fontWeight: 600,
              }}
            >
              Account
            </h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Inloggen", href: "/login" },
                { label: "Registreren", href: "/register" },
                { label: "Mijn dashboard", href: "/dashboard" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{
                    fontSize: "0.875rem",
                    color: "#9CA3AF",
                    textDecoration: "none",
                    transition: "color 0.15s",
                    fontFamily: "system-ui, sans-serif",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #374151",
            marginTop: "3rem",
            paddingTop: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
          className="md:flex-row"
        >
          <p
            style={{
              fontSize: "0.75rem",
              color: "#6B7280",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            © {new Date().getFullYear()} Casa Nomada. Alle rechten voorbehouden.
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#6B7280",
              fontFamily: "system-ui, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            Gemaakt met{" "}
            <Heart
              size={11}
              style={{ color: "#8B2635", fill: "#8B2635", display: "inline" }}
            />{" "}
            in België
          </p>
        </div>
      </div>
    </footer>
  );
}
