import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { templates } from "@/lib/templates";

export const metadata = {
  title: "Sjablonen | Casa Nomada",
  description:
    "Ontdek 19 prachtige sjablonen voor digitale trouwuitnodigingen. Van romantisch botanisch tot minimale couture — vind jouw stijl.",
};

export default function TemplatesPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9f5f1",
      }}
    >
      <Nav />

      <style>{`
        .tpl-card {
          background-color: #FFFFFF;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid #E8E6E3;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        .tpl-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(89,38,47,0.10);
        }
      `}</style>

      <main style={{ flex: 1 }}>
        {/* Header */}
        <section
          style={{
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E8E6E3",
            padding: "4rem 1.5rem 3rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8B2635",
              fontFamily: "system-ui, sans-serif",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            19 ontwerpen
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 600,
              color: "#16161D",
              marginBottom: "1.25rem",
              lineHeight: 1.1,
            }}
          >
            Kies je stijl
          </h1>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "#6B6B76",
              maxWidth: "34rem",
              margin: "0 auto 2rem",
              lineHeight: 1.65,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Elk sjabloon is een afgewerkte uitnodiging — geen schets. Klik om hem te
            bekijken en begin gratis te personaliseren.
          </p>
          <Link
            href="/register"
            style={{
              display: "inline-block",
              backgroundColor: "#8B2635",
              color: "#FFFFFF",
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              textDecoration: "none",
              fontSize: "0.8125rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Maak je uitnodiging — gratis
          </Link>
        </section>

        {/* Grid */}
        <section
          style={{
            maxWidth: "90rem",
            margin: "0 auto",
            padding: "3rem 1.5rem 5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
              gap: "1.75rem",
            }}
          >
            {templates.map((tpl) => (
              <Link
                key={tpl.slug}
                href={`/templates/${tpl.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article className="tpl-card">
                  {/* Template image */}
                  <div
                    style={{
                      aspectRatio: "4/3",
                      overflow: "hidden",
                      backgroundColor: "#F5EDE8",
                      position: "relative",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tpl.img}
                      alt={tpl.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top",
                        display: "block",
                      }}
                      loading="lazy"
                    />
                    {/* Price badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        right: "0.75rem",
                        backgroundColor: "rgba(22,22,29,0.75)",
                        backdropFilter: "blur(4px)",
                        color: "#FFFFFF",
                        fontSize: "0.75rem",
                        fontFamily: "system-ui, sans-serif",
                        fontWeight: 500,
                        padding: "0.25rem 0.625rem",
                        borderRadius: "9999px",
                      }}
                    >
                      €{tpl.price}
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "1.125rem 1.25rem 1.25rem" }}>
                    <p
                      style={{
                        fontSize: "0.625rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#8B2635",
                        fontFamily: "system-ui, sans-serif",
                        fontWeight: 600,
                        marginBottom: "0.375rem",
                      }}
                    >
                      {tpl.tagline}
                    </p>
                    <h2
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "1.3125rem",
                        fontWeight: 600,
                        color: "#16161D",
                        marginBottom: "0.375rem",
                      }}
                    >
                      {tpl.name}
                    </h2>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "#6B6B76",
                        fontFamily: "system-ui, sans-serif",
                        lineHeight: 1.55,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {tpl.description}
                    </p>

                    <div
                      style={{
                        marginTop: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.8125rem",
                          color: "#8B2635",
                          fontFamily: "system-ui, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        Bekijk sjabloon →
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#9CA3AF",
                          fontFamily: "system-ui, sans-serif",
                        }}
                      >
                        {tpl.colors.length} kleur{tpl.colors.length !== 1 ? "en" : ""}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            style={{
              marginTop: "4rem",
              textAlign: "center",
              padding: "3rem 1.5rem",
              backgroundColor: "#FFFFFF",
              borderRadius: "1.5rem",
              border: "1px solid #E8E6E3",
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 600,
                color: "#16161D",
                marginBottom: "0.75rem",
              }}
            >
              Geen van deze sjablonen past precies?
            </h2>
            <p
              style={{
                fontSize: "0.9375rem",
                color: "#6B6B76",
                fontFamily: "system-ui, sans-serif",
                marginBottom: "1.75rem",
                lineHeight: 1.65,
              }}
            >
              We ontwerpen een uniek sjabloon speciaal voor jullie bruiloft — €249, klaar in 7 werkdagen.
            </p>
            <Link
              href="/register"
              style={{
                display: "inline-block",
                backgroundColor: "#16161D",
                color: "#FFFFFF",
                padding: "0.75rem 2rem",
                borderRadius: "9999px",
                textDecoration: "none",
                fontSize: "0.8125rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Op maat laten maken
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
