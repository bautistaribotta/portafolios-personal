import { lazy, Suspense, useRef, useState, type CSSProperties, type FocusEvent } from "react"
import { ArrowUpRight, Code2, ExternalLink, Maximize2 } from "lucide-react"

import { Dispositivo, HUECO, RECORTE } from "@/components/dispositivo"
import { IconoGithub } from "@/components/iconos"
import { TituloSeccion } from "@/components/secciones/titulo-seccion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { proyectos, redes, type Proyecto } from "@/data/contenido"
import { useMedia } from "@/hooks/use-media"
import { deslizarA, gsap, MEDIOS, saltarA, ScrollTrigger, useGSAP } from "@/lib/animaciones"
import { cn } from "@/lib/utils"

const cargarVisor = () => import("@/components/secciones/visor-captura")
const VisorCaptura = lazy(cargarVisor)

const total = proyectos.length
const dosCifras = (n: number) => String(n).padStart(2, "0")

/** Captura ubicada en la pantalla del dispositivo que le corresponde al proyecto */
function Captura({ p, cargar, prioridad }: { p: Proyecto; cargar: boolean; prioridad?: boolean }) {
  const celular = p.dispositivo === "celular" && p.imagenVertical
  return (
    <div className="captura absolute bg-muted" style={HUECO[celular ? "celular" : "laptop"]}>
      {cargar &&
        (celular ? (
          <img
            src={`/img/${p.imagenVertical}.webp`}
            alt={`Captura de ${p.nombre}`}
            width={420}
            height={910}
            loading={prioridad ? "eager" : "lazy"}
            decoding="async"
            className="size-full object-cover object-top"
          />
        ) : (
          <img
            src={`/img/miniaturas/${p.imagen}-720.webp`}
            srcSet={`/img/miniaturas/${p.imagen}-720.webp 720w, /img/${p.imagen}.webp 1600w`}
            sizes="(min-width: 1024px) 50vw, 90vw"
            alt={`Captura de ${p.nombre}`}
            width={p.ancho}
            height={p.alto}
            loading={prioridad ? "eager" : "lazy"}
            decoding="async"
            className="size-full object-cover object-top"
          />
        ))}
    </div>
  )
}

/** Número, nombre, descripción, tecnologías y enlaces. Cada bloque .anim entra por separado. */
function TextoProyecto({ p, i }: { p: Proyecto; i: number }) {
  return (
    <>
      <p className="anim font-mono text-xs tracking-wider text-muted-foreground">
        {dosCifras(i + 1)} / {dosCifras(total)}
      </p>
      <h3 className="anim font-display mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl xl:text-5xl">
        <a
          href={p.enlace}
          target="_blank"
          rel="noopener noreferrer"
          className="group/titulo inline-flex items-center gap-2 transition-colors hover:text-highlight"
        >
          {p.nombre}
          <ArrowUpRight className="size-6 text-muted-foreground transition-transform group-hover/titulo:translate-x-0.5 group-hover/titulo:-translate-y-0.5" />
        </a>
      </h3>
      {p.enDesarrollo && (
        <div className="anim mt-3">
          <Badge variant="outline" className="font-mono text-[10px] text-highlight">
            En desarrollo
          </Badge>
        </div>
      )}
      <p className="anim mt-4 leading-relaxed text-muted-foreground">{p.descripcion}</p>
      <div className="anim mt-5 flex flex-wrap gap-1.5">
        {p.tecnologias.map((t) => (
          <Badge key={t} variant="secondary" className="font-mono font-normal">
            {t}
          </Badge>
        ))}
      </div>
      {(p.enVivo || p.codigo) && (
        <div className="anim mt-6 flex flex-wrap gap-2">
          {p.enVivo && (
            <Button asChild size="sm" variant="outline">
              <a href={p.enVivo} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Ver en vivo
              </a>
            </Button>
          )}
          {p.codigo && (
            <Button asChild size="sm" variant="ghost">
              <a href={p.codigo} target="_blank" rel="noopener noreferrer">
                <Code2 />
                Código
              </a>
            </Button>
          )}
        </div>
      )}
    </>
  )
}

/* ------------------------------------------------------------------------------------------ */
/* Escritorio: escena fijada con un solo dispositivo que cambia de captura y de forma           */
/* ------------------------------------------------------------------------------------------ */

function ProyectosEscritorio({ onAmpliar }: { onAmpliar: (p: Proyecto) => void }) {
  const escena = useRef<HTMLDivElement>(null)
  const disparador = useRef<ScrollTrigger>(null)
  const [activo, setActivo] = useState(0)
  // Capturas montadas: la activa y la siguiente, para precargar antes de llegar
  const [hasta, setHasta] = useState(1)

  useGSAP(
    () => {
      const raiz = escena.current!
      const textos = gsap.utils.toArray<HTMLElement>(".proyecto-texto", raiz)
      const capturas = gsap.utils.toArray<HTMLElement>(".captura", raiz)
      let actual = 0

      const activar = (i: number) => {
        actual = i
        raiz.style.setProperty("--tinte", proyectos[i].tinte)
        textos.forEach((t, j) => (t.style.pointerEvents = j === i ? "auto" : "none"))
        setActivo(i)
        setHasta((h) => Math.max(h, i + 2))
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: raiz,
          start: "top top",
          end: () => `+=${(total - 1) * window.innerHeight}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.round(self.progress * (total - 1))
            if (i !== actual) activar(i)
          },
        },
      })
      const st = tl.scrollTrigger!
      disparador.current = st

      // Snap propio: el snap de ScrollTrigger se pelea con Lenis y deja la escena entre dos
      // proyectos. Cuando el scroll se detiene, se desliza hasta el proyecto más cercano.
      const alDetenerse = () => {
        const y = window.scrollY
        if (y <= st.start || y >= st.end) return
        const paso = (st.end - st.start) / (total - 1)
        const destino = st.start + Math.round((y - st.start) / paso) * paso
        if (Math.abs(destino - y) > 2) deslizarA(destino)
      }
      ScrollTrigger.addEventListener("scrollEnd", alDetenerse)

      tl.addLabel("p0")
      for (let i = 1; i < total; i++) {
        const desde = `p${i - 1}`
        const anterior = proyectos[i - 1]
        const siguiente = proyectos[i]

        tl.to(
          textos[i - 1].querySelectorAll(".anim"),
          { y: -36, opacity: 0, duration: 0.35, stagger: 0.03 },
          `${desde}+=0.1`
        )
          .fromTo(
            textos[i].querySelectorAll(".anim"),
            { y: 48, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 },
            `${desde}+=0.45`
          )
          .to(capturas[i - 1], { opacity: 0, scale: 0.97, duration: 0.4 }, `${desde}+=0.25`)
          .fromTo(
            capturas[i],
            { opacity: 0, scale: 1.08 },
            { opacity: 1, scale: 1, duration: 0.5 },
            `${desde}+=0.35`
          )
          .to(".progreso-relleno", { scaleY: i / (total - 1), duration: 1, ease: "none" }, desde)

        // Morph laptop <-> celular: se interpolan los recortes, no el tamaño.
        // fromTo explícito porque el navegador abrevia inset() y los valores dejan de coincidir.
        if (anterior.dispositivo !== siguiente.dispositivo) {
          const tipo = siguiente.dispositivo
          const previo = anterior.dispositivo
          const aCelular = tipo === "celular"
          const morph = { duration: 0.55, immediateRender: false }
          tl.fromTo(
            ".disp-cuerpo",
            { clipPath: RECORTE[previo].cuerpo },
            { clipPath: RECORTE[tipo].cuerpo, ...morph },
            `${desde}+=0.2`
          )
            .fromTo(
              ".disp-pantalla",
              { clipPath: RECORTE[previo].pantalla },
              { clipPath: RECORTE[tipo].pantalla, ...morph },
              `${desde}+=0.2`
            )
            .to(
              ".disp-base",
              { opacity: aCelular ? 0 : 1, scaleY: aCelular ? 0 : 1, duration: 0.3 },
              `${desde}+=${aCelular ? 0.15 : 0.45}`
            )
            .to(".disp-isla", { opacity: aCelular ? 1 : 0, duration: 0.2 }, `${desde}+=${aCelular ? 0.6 : 0.15}`)
        }
        tl.addLabel(`p${i}`, `${desde}+=1`)
      }

      return () => ScrollTrigger.removeEventListener("scrollEnd", alDetenerse)
    },
    { scope: escena }
  )

  // Al tabular hasta un proyecto que no está a la vista, el scroll salta a ese proyecto
  const alEnfocar = (e: FocusEvent<HTMLDivElement>) => {
    const bloque = (e.target as HTMLElement).closest<HTMLElement>("[data-indice]")
    const st = disparador.current
    if (!bloque || !st) return
    const i = Number(bloque.dataset.indice)
    if (i === activo) return
    saltarA(st.start + ((st.end - st.start) * i) / (total - 1))
  }

  const tipoInicial = proyectos[0].dispositivo

  return (
    <div
      ref={escena}
      className="relative h-svh overflow-hidden"
      style={{ "--tinte": proyectos[0].tinte } as CSSProperties}
    >
      <div className="fondo-tinte pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid h-full max-w-7xl grid-cols-[minmax(0,24rem)_minmax(0,1fr)_auto] items-center gap-10 px-6 pt-16 xl:gap-16">
        <div className="grid" onFocus={alEnfocar}>
          {proyectos.map((p, i) => (
            <div
              key={p.nombre}
              data-indice={i}
              className="proyecto-texto [grid-area:1/1]"
              style={{ pointerEvents: i === 0 ? "auto" : "none" }}
            >
              <TextoProyecto p={p} i={i} />
            </div>
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-[min(100%,108svh)]">
          <Dispositivo tipo={tipoInicial}>
            {proyectos.map((p, i) => (
              <Captura key={p.nombre} p={p} cargar={i <= hasta} />
            ))}
          </Dispositivo>
          <button
            type="button"
            onClick={() => onAmpliar(proyectos[activo])}
            onPointerEnter={cargarVisor}
            onFocus={cargarVisor}
            aria-label={`Ampliar captura: ${proyectos[activo].nombre}`}
            className="absolute right-[7.5%] bottom-[18%] flex size-9 items-center justify-center rounded-md border bg-background/80 text-foreground backdrop-blur-sm transition-colors outline-none hover:bg-background focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4" aria-hidden="true">
          <span className="font-mono text-xs text-foreground tabular-nums">{dosCifras(activo + 1)}</span>
          <div className="relative h-48 w-px bg-border">
            <div className="progreso-relleno absolute inset-0 origin-top scale-y-0 bg-highlight" />
          </div>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">{dosCifras(total)}</span>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------ */
/* Móvil y movimiento reducido: una escena por proyecto, sin pin ni snap                       */
/* ------------------------------------------------------------------------------------------ */

function ProyectosEscenas({ onAmpliar }: { onAmpliar: (p: Proyecto) => void }) {
  const raiz = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIOS.movil, () => {
        for (const escena of gsap.utils.toArray<HTMLElement>(".proyecto-escena")) {
          gsap.fromTo(
            escena.querySelector(".dispositivo"),
            { yPercent: 14 },
            {
              yPercent: -8,
              ease: "none",
              scrollTrigger: { trigger: escena, start: "top bottom", end: "bottom top", scrub: true },
            }
          )
          gsap.from(escena.querySelectorAll(".anim"), {
            y: 32,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: escena.querySelector(".proyecto-texto"), start: "top 88%", once: true },
          })
        }
      })
      return () => mm.revert()
    },
    { scope: raiz }
  )

  return (
    <div ref={raiz} className="mx-auto max-w-2xl px-6">
      {proyectos.map((p, i) => (
        <article
          key={p.nombre}
          className="proyecto-escena relative flex min-h-[90svh] flex-col justify-center gap-8 py-12"
          style={{ "--tinte": p.tinte } as CSSProperties}
        >
          <div className="fondo-tinte pointer-events-none absolute inset-x-[-1.5rem] inset-y-0" aria-hidden="true" />
          <div className="relative">
            <Dispositivo tipo={p.dispositivo === "celular" && p.imagenVertical ? "celular" : "laptop"}>
              <Captura p={p} cargar prioridad={i === 0} />
            </Dispositivo>
            <button
              type="button"
              onClick={() => onAmpliar(p)}
              onPointerEnter={cargarVisor}
              onFocus={cargarVisor}
              aria-label={`Ampliar captura: ${p.nombre}`}
              className="absolute right-[7.5%] bottom-[18%] flex size-8 items-center justify-center rounded-md border bg-background/80 text-foreground backdrop-blur-sm"
            >
              <Maximize2 className="size-3.5" />
            </button>
          </div>
          <div className="proyecto-texto relative">
            <TextoProyecto p={p} i={i} />
          </div>
        </article>
      ))}
    </div>
  )
}

export function Proyectos() {
  const [ampliado, setAmpliado] = useState<Proyecto | null>(null)
  const [visorPedido, setVisorPedido] = useState(false)
  const escritorio = useMedia(MEDIOS.escritorio)

  const ampliar = (proyecto: Proyecto) => {
    setVisorPedido(true)
    setAmpliado(proyecto)
  }

  return (
    <section id="projects" className="scroll-mt-16 border-t pt-24 pb-24 md:pt-32 md:pb-32">
      <div className="mx-auto max-w-6xl px-6">
        <TituloSeccion
          numero="03"
          titulo="Proyectos"
          descripcion="Aplicaciones web, mobile y de escritorio en las que trabajé."
        />
      </div>

      {escritorio ? (
        <ProyectosEscritorio onAmpliar={ampliar} />
      ) : (
        <ProyectosEscenas onAmpliar={ampliar} />
      )}

      <div className={cn("flex justify-center px-6", escritorio ? "mt-16" : "mt-6")}>
        <Button asChild variant="outline" className="rounded-full">
          <a href={redes.github} target="_blank" rel="noopener noreferrer">
            <IconoGithub />
            Ver todos los proyectos en GitHub
            <ArrowUpRight />
          </a>
        </Button>
      </div>

      {visorPedido && (
        <Suspense fallback={null}>
          <VisorCaptura proyecto={ampliado} onCerrar={() => setAmpliado(null)} />
        </Suspense>
      )}
    </section>
  )
}
