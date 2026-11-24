import { lazy, Suspense, useRef } from "react"

import { IconoDescargarArchivo, IconoFlechaAbajo, IconoGithub, IconoLinkedin, IconoUbicacion } from "@/components/iconos"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { redes } from "@/data/contenido"
import { useMedia } from "@/hooks/use-media"
import { gsap, SplitText, useGSAP } from "@/lib/animaciones"

// Solo se descarga en escritorio, aparte del bundle principal
const FondoHero = lazy(() => import("@/components/secciones/fondo-hero"))

export function Hero() {
  const escritorio = useMedia("(min-width: 1024px)")
  const raiz = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrada: el nombre se arma letra por letra. Nunca arranca invisible del todo,
        // así el texto ya cuenta como pintado para el LCP. El h1 ya tiene su aria-label,
        // así que las letras sueltas se ocultan a los lectores de pantalla.
        SplitText.create(".hero-nombre", {
          type: "chars",
          autoSplit: true,
          aria: "none",
          onSplit: (self) => {
            self.chars.forEach((letra) => letra.setAttribute("aria-hidden", "true"))
            return gsap.from(self.chars, {
              yPercent: 90,
              opacity: 0.08,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.035,
            })
          },
        })
        gsap.from(".hero-entra", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.35,
        })
        gsap.from(".hero-foto", {
          scale: 0.92,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
        })
      })

      return () => mm.revert()
    },
    { scope: raiz }
  )

  return (
    <section ref={raiz} className="relative flex min-h-svh items-center overflow-hidden">
      <div
        className="brillo pointer-events-none absolute lg:hidden -top-40 left-1/2 size-[48rem] -translate-x-1/2"
        aria-hidden="true"
      />

      {escritorio && (
        <Suspense fallback={null}>
          <FondoHero />
        </Suspense>
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-28 md:py-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="space-y-8">
            <h1
              aria-label="Bautista Ribotta"
              className="hero-nombre font-display text-6xl font-semibold tracking-tighter text-foreground md:text-8xl">
              Bautista
              <br />
              <span className="text-primary">Ribotta</span>
            </h1>

            <p className="hero-entra max-w-md text-lg leading-relaxed text-muted-foreground">
              Finalizando la carrera de Ingeniería en Software. Desarrollador full-stack de
              aplicaciones web y mobile.
            </p>

            <div className="hero-entra flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg" className="rounded-full">
                <a
                  href="/archivos/cv_bautista_ribotta.pdf"
                  download="Bautista_Ribotta_CV.pdf"
                  target="_blank"
                >
                  <IconoDescargarArchivo />
                  Descargar CV
                </a>
              </Button>

              <Tooltip texto="LinkedIn">
                <Button asChild variant="outline" size="icon" className="size-10 rounded-full">
                  <a href={redes.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <IconoLinkedin />
                  </a>
                </Button>
              </Tooltip>

              <Tooltip texto="GitHub">
                <Button asChild variant="outline" size="icon" className="size-10 rounded-full">
                  <a href={redes.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <IconoGithub />
                  </a>
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="-order-1 flex lg:order-none lg:justify-center">
            <div className="hero-foto group relative">
              <div className="relative overflow-hidden rounded-xl border bg-card p-1.5 shadow-2xl lg:p-2">
                <div className="h-40 w-32 overflow-hidden rounded-lg bg-muted lg:h-96 lg:w-80">
                  <img
                    width={720}
                    height={1280}
                    fetchPriority="high"
                    src="/img/imagen-personal-640.webp"
                    srcSet="/img/imagen-personal-320.webp 320w, /img/imagen-personal-640.webp 640w"
                    sizes="(min-width: 1024px) 320px, 128px"
                    alt="Bautista Ribotta"
                    className="size-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="absolute -bottom-5 -left-8 hidden items-center gap-3 rounded-lg border bg-background/90 px-4 py-3 shadow-lg backdrop-blur-md lg:flex">
                <IconoUbicacion className="size-4 text-highlight" />
                <div>
                  <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                    Viviendo en
                  </p>
                  <p className="text-sm font-medium text-foreground">Córdoba, Argentina</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
        <IconoFlechaAbajo className="size-4 motion-safe:animate-bounce" />
      </a>
    </section>
  )
}
