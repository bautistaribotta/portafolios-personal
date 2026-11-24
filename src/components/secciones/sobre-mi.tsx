import { useRef } from "react"

import { IconoBirrete, IconoObjetivo } from "@/components/iconos"
import { TituloSeccion } from "@/components/secciones/titulo-seccion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { estadisticas } from "@/data/contenido"
import { gsap, MEDIOS, SplitText, useGSAP } from "@/lib/animaciones"

const tarjetas = [
  {
    titulo: "Educación",
    Icono: IconoBirrete,
    texto:
      "Estoy finalizando la carrera de Ingeniería en Software y complemento esa base con cursos en plataformas como Platzi y Udemy. Aplico lo que aprendo en proyectos propios y para clientes, y busco sumarme a un equipo donde seguir creciendo junto a otros profesionales.",
  },
  {
    titulo: "Enfoque",
    Icono: IconoObjetivo,
    texto:
      "Desarrollo aplicaciones web y mobile de punta a punta. Trabajo el backend con Python y Django, el frontend con React, TypeScript y Tailwind, y las apps mobile con React Native y Expo. Sumo herramientas de IA como Claude Code a mi flujo de trabajo para desarrollar más rápido.",
  },
]

/** Separa "+10" en prefijo y número para poder contarlo */
function partir(valor: string) {
  const [, prefijo = "", numero = "0"] = valor.match(/^(\D*)(\d+)$/) ?? []
  return { prefijo, numero: Number(numero) }
}

export function SobreMi() {
  const raiz = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ escritorio: MEDIOS.escritorio, movil: MEDIOS.movil }, (ctx) => {
        const { escritorio } = ctx.conditions as { escritorio: boolean }
        const parrafo = raiz.current!.querySelector(".sobre-mi-parrafo")!
        // aria "none": un <p> no admite aria-label, así que las palabras quedan legibles tal cual
        const { words } = SplitText.create(parrafo, { type: "words", aria: "none" })

        // Cada palabra se ilumina a medida que se scrollea (escritorio) o de una vez (móvil)
        if (escritorio) {
          gsap.fromTo(
            words,
            { opacity: 0.15 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: parrafo, start: "top 80%", end: "bottom 45%", scrub: true },
            }
          )
        } else {
          gsap.fromTo(
            words,
            { opacity: 0.15 },
            {
              opacity: 1,
              duration: 0.6,
              stagger: 0.025,
              scrollTrigger: { trigger: parrafo, start: "top 80%", toggleActions: "play none none reverse" },
            }
          )
        }

        // Las estadísticas cuentan desde 0, una sola vez
        for (const el of gsap.utils.toArray<HTMLElement>(".sobre-mi-cifra")) {
          const { prefijo, numero } = partir(el.dataset.valor!)
          const contador = { n: 0 }
          gsap.to(contador, {
            n: numero,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = prefijo + Math.round(contador.n)
            },
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          })
        }

        gsap.from(".sobre-mi-tarjeta", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".sobre-mi-tarjetas", start: "top 85%", once: true },
        })
      })

      return () => mm.revert()
    },
    { scope: raiz }
  )

  return (
    <section ref={raiz} id="about" tabIndex={-1} className="scroll-mt-16 outline-none border-t py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <TituloSeccion numero="01" titulo="Sobre mí" />

        <p className="sobre-mi-parrafo font-display max-w-5xl text-3xl leading-tight font-medium tracking-tight text-foreground md:text-5xl">
          Soy desarrollador de software y construyo aplicaciones completas, de la base de datos a la
          interfaz: desde sistemas de gestión para el sector apícola hasta apps mobile y sitios web
          para clientes.
        </p>

        <div className="sobre-mi-tarjetas mt-16 grid gap-4 md:grid-cols-2">
          {tarjetas.map(({ titulo, Icono, texto }) => (
            <Card key={titulo} className="sobre-mi-tarjeta bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Icono className="size-4 text-highlight" />
                  {titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{texto}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 divide-x overflow-hidden rounded-xl border">
          {estadisticas.map(({ valor, etiqueta }) => (
            <div key={etiqueta} className="p-6 md:p-8">
              <p
                data-valor={valor}
                className="sobre-mi-cifra font-display text-3xl font-semibold tracking-tight text-primary tabular-nums md:text-5xl"
              >
                {valor}
              </p>
              <p className="mt-2 text-xs text-muted-foreground md:text-sm">{etiqueta}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
