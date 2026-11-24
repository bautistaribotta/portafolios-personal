import { useRef, useState } from "react"

import { IconoPausa, IconoReproducir } from "@/components/iconos"
import { TituloSeccion } from "@/components/secciones/titulo-seccion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { habilidades } from "@/data/contenido"
import { gsap, MEDIOS, ScrollTrigger, useGSAP } from "@/lib/animaciones"
import { cn } from "@/lib/utils"

const principales = habilidades.flatMap((g) => g.principales)
const aprendiendo = habilidades.flatMap((g) => g.aprendiendo)

/** Porcentaje del ancho de una copia que avanza cada segundo a velocidad base */
const VELOCIDAD_BASE = 2.2

function Marquee({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className="overflow-hidden py-2" aria-hidden="true">
      <div className="marquee-pista flex w-max will-change-transform">
        {[0, 1].map((copia) => (
          <div key={copia} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span
                key={item}
                className={cn(
                  "font-display flex items-center text-5xl font-semibold tracking-tighter whitespace-nowrap md:text-7xl",
                  className
                )}
              >
                {item}
                <span className="mx-6 inline-block size-2 rounded-full bg-highlight md:mx-10 md:size-3" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Habilidades() {
  const raiz = useRef<HTMLElement>(null)
  // Los marquees se mueven solos y sin fin: tiene que existir una forma de frenarlos (WCAG 2.2.2)
  const [pausado, setPausado] = useState(false)
  const pausadoRef = useRef(pausado)
  pausadoRef.current = pausado

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ escritorio: MEDIOS.escritorio, movil: MEDIOS.movil }, () => {
        const pistas = gsap.utils.toArray<HTMLElement>(".marquee-pista")
        const mover = pistas.map((p) => gsap.quickSetter(p, "xPercent"))
        const envolver = gsap.utils.wrap(-50, 0)
        // La primera fila va hacia la izquierda y la segunda hacia la derecha
        const x = [0, -50]
        const sentido = [-1, 1]
        const estado = { velocidad: 1 }
        let visible = false

        const tick = (_t: number, dt: number) => {
          if (!visible || pausadoRef.current) return
          const paso = (dt / 1000) * VELOCIDAD_BASE * estado.velocidad
          pistas.forEach((_, i) => {
            x[i] = envolver(x[i] + paso * sentido[i])
            mover[i](x[i])
          })
        }
        gsap.ticker.add(tick)

        // La velocidad del scroll acelera las filas (y las invierte al subir); después vuelven solas
        ScrollTrigger.create({
          trigger: raiz.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (visible = self.isActive),
          onUpdate: (self) => {
            const factor = gsap.utils.clamp(1, 7, 1 + Math.abs(self.getVelocity()) / 350)
            gsap.to(estado, {
              velocidad: factor * self.direction,
              duration: 0.25,
              overwrite: true,
              onComplete: () => {
                gsap.to(estado, { velocidad: 1, duration: 1.4, ease: "power2.out" })
              },
            })
          },
        })

        gsap.from(".habilidades-tarjeta", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".habilidades-grilla", start: "top 85%", once: true },
        })

        return () => gsap.ticker.remove(tick)
      })

      return () => mm.revert()
    },
    { scope: raiz }
  )

  return (
    <section ref={raiz} id="skills" tabIndex={-1} className="scroll-mt-16 outline-none overflow-hidden border-t py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <TituloSeccion numero="02" titulo="Habilidades" />
      </div>

      <div className="mb-4 space-y-2 motion-reduce:mb-16 md:motion-reduce:mb-24">
        <Marquee items={principales} className="text-foreground" />
        <Marquee items={aprendiendo} className="texto-contorno" />
      </div>

      <div className="mx-auto mb-16 flex max-w-6xl justify-end px-6 motion-reduce:hidden md:mb-24">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setPausado((p) => !p)}
          className="text-muted-foreground"
        >
          {pausado ? <IconoReproducir /> : <IconoPausa />}
          {pausado ? "Reanudar animación" : "Pausar animación"}
        </Button>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-highlight" />
            Stack principal
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full border border-muted-foreground" />
            Sumando experiencia
          </span>
        </div>

        <div className="habilidades-grilla grid gap-4 md:grid-cols-2">
          {habilidades.map((grupo) => (
            <Card key={grupo.titulo} className="habilidades-tarjeta gap-4 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-xs font-normal tracking-wider text-muted-foreground uppercase">
                  {grupo.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {grupo.principales.map((h) => (
                  <Badge key={h} variant="secondary" className="gap-1.5 rounded-full px-3 py-1 text-sm font-normal">
                    <span className="size-1.5 rounded-full bg-highlight" />
                    {h}
                  </Badge>
                ))}
                {grupo.aprendiendo.map((h) => (
                  <Badge
                    key={h}
                    variant="outline"
                    className="rounded-full px-3 py-1 text-sm font-normal text-muted-foreground"
                  >
                    {h}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
