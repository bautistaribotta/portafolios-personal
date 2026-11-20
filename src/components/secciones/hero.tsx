import { useRef } from "react"
import { ArrowDown, FileDown, MapPin } from "lucide-react"

import { Dispositivo, HUECO } from "@/components/dispositivo"
import { IconoGithub, IconoLinkedin } from "@/components/iconos"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { redes } from "@/data/contenido"
import { gsap, MEDIOS, SplitText, useGSAP } from "@/lib/animaciones"

export function Hero() {
  const raiz = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ escritorio: MEDIOS.escritorio, movil: MEDIOS.movil }, (ctx) => {
        const { escritorio } = ctx.conditions as { escritorio: boolean }

        // Entrada: el nombre se arma letra por letra. Nunca arranca invisible del todo,
        // así el texto ya cuenta como pintado para el LCP.
        SplitText.create(".hero-nombre", {
          type: "chars",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 90,
              opacity: 0.08,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.035,
            }),
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

        if (!escritorio) return

        // Al scrollear la foto vuela hasta la pantalla de la laptop
        const foto = raiz.current!.querySelector<HTMLElement>(".hero-foto")!
        const pantalla = raiz.current!.querySelector<HTMLElement>(".hero-pantalla")!
        const delta = () => {
          const a = foto.getBoundingClientRect()
          const b = pantalla.getBoundingClientRect()
          return {
            x: b.left + b.width / 2 - (a.left + a.width / 2),
            y: b.top + b.height / 2 - (a.top + a.height / 2),
            escala: (b.height * 0.92) / a.height,
          }
        }

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: raiz.current,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })

        tl.to(".hero-texto", { x: -120, opacity: 0, duration: 0.5 }, 0)
          .to(".hero-chip, .hero-scroll", { opacity: 0, duration: 0.25 }, 0)
          .to(
            ".hero-foto",
            {
              x: () => delta().x,
              y: () => delta().y,
              scale: () => delta().escala,
              duration: 0.7,
            },
            0.05
          )
          .fromTo(
            ".hero-laptop",
            { opacity: 0, scale: 0.9, y: 40 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6 },
            0.2
          )
          .to(".hero-foto", { opacity: 0, duration: 0.2 }, 0.7)
          .fromTo(".hero-captura", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.65)
      })

      return () => mm.revert()
    },
    { scope: raiz }
  )

  return (
    <section ref={raiz} className="relative flex min-h-svh items-center overflow-hidden">
      <div className="fondo-cuadricula pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="brillo pointer-events-none absolute -top-40 left-1/2 size-[48rem] -translate-x-1/2"
        aria-hidden="true"
      />

      {/* Laptop de destino: aparece al scrollear, solo en escritorio */}
      <div
        className="pointer-events-none absolute inset-0 hidden items-center justify-center px-6 lg:flex"
        aria-hidden="true"
      >
        <Dispositivo tipo="laptop" className="hero-laptop w-[min(58vw,98svh)] opacity-0">
          <div className="hero-pantalla absolute" style={HUECO.laptop}>
            <div className="hero-captura absolute inset-0 flex items-center justify-center gap-[6%] bg-[radial-gradient(circle_at_30%_40%,var(--glow),transparent_60%),var(--background)] opacity-0">
              <img
                src="/img/imagen-personal-640.webp"
                alt=""
                width={720}
                height={1280}
                loading="lazy"
                decoding="async"
                className="h-[78%] w-auto rounded-[1cqw] object-cover"
              />
              <div className="space-y-[0.8cqw]">
                <p className="font-mono text-[1.3cqw] tracking-widest text-muted-foreground uppercase">
                  bautista.dev
                </p>
                <p className="font-display text-[4.4cqw] leading-none font-semibold tracking-tighter text-foreground">
                  Bautista
                  <br />
                  <span className="text-primary">Ribotta</span>
                </p>
                <p className="text-[1.5cqw] text-muted-foreground">Full-stack · web y mobile</p>
              </div>
            </div>
          </div>
        </Dispositivo>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-28 md:py-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="hero-texto space-y-8">
            <Badge
              variant="outline"
              className="hero-entra gap-2 rounded-full px-3 py-1 font-mono text-muted-foreground"
            >
              <span className="size-1.5 rounded-full bg-highlight" />
              Software Engineering Student
            </Badge>

            <h1 className="hero-nombre font-display text-6xl font-semibold tracking-tighter text-foreground md:text-8xl">
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
                  <FileDown />
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
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="hero-chip absolute -bottom-5 -left-8 hidden items-center gap-3 rounded-lg border bg-background/90 px-4 py-3 shadow-lg backdrop-blur-md lg:flex">
                <MapPin className="size-4 text-highlight" />
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
        className="hero-scroll absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
        <ArrowDown className="size-4 animate-bounce" />
      </a>
    </section>
  )
}
