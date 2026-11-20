import { useEffect, useRef, useState, type FormEvent } from "react"
import { Check, Loader2, Mail, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { gsap, MEDIOS, SplitText, useGSAP } from "@/lib/animaciones"

const ENDPOINT = "https://formspree.io/f/xreagbrb"

type Estado = "inicial" | "enviando" | "enviado" | "error"

export function Contacto() {
  const [estado, setEstado] = useState<Estado>("inicial")
  const raiz = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add([MEDIOS.escritorio, MEDIOS.movil], () => {
        // El titular se arma letra por letra al llegar al final de la página
        SplitText.create(".contacto-titular", {
          type: "words,chars",
          mask: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 110,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.025,
              scrollTrigger: { trigger: ".contacto-titular", start: "top 85%", once: true },
            }),
        })
        gsap.from(".contacto-entra", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".contacto-grilla", start: "top 85%", once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: raiz }
  )

  useEffect(() => {
    if (estado !== "enviado" && estado !== "error") return
    const t = setTimeout(() => setEstado("inicial"), estado === "enviado" ? 5000 : 3000)
    return () => clearTimeout(t)
  }, [estado])

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setEstado("enviando")
    try {
      const respuesta = await fetch(ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
      if (!respuesta.ok) throw new Error(String(respuesta.status))
      form.reset()
      setEstado("enviado")
    } catch {
      setEstado("error")
    }
  }

  return (
    <section ref={raiz} id="contact" className="scroll-mt-16 border-t py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">04 / Contacto</p>
        <h2 className="contacto-titular font-display mt-4 mb-16 text-6xl leading-[0.95] font-semibold tracking-tighter text-foreground sm:text-7xl md:mb-20 lg:text-9xl">
          ¿Construimos <span className="text-primary">algo?</span>
        </h2>

        <div className="contacto-grilla grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="contacto-entra">
            <p className="mb-6 max-w-sm text-muted-foreground">
              Estoy abierto a nuevas oportunidades y colaboraciones. No dudes en contactarme.
            </p>
            <a
              href="mailto:bautistaribotta@hotmail.com"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4 text-highlight" />
              bautistaribotta@hotmail.com
            </a>
          </div>

          <Card className="contacto-entra bg-card/50">
            <CardContent>
              <form onSubmit={enviar} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" name="nombre" required placeholder="Tu nombre" autoComplete="name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="tu@email.com"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensaje">Mensaje</Label>
                  <Textarea
                    id="mensaje"
                    name="mensaje"
                    required
                    rows={6}
                    placeholder="Tu mensaje..."
                    className="min-h-36 resize-none"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={estado !== "inicial"}>
                    {estado === "enviando" && <Loader2 className="animate-spin" />}
                    {estado === "enviado" && <Check />}
                    {(estado === "inicial" || estado === "error") && <Send />}
                    {estado === "inicial" && "Enviar mensaje"}
                    {estado === "enviando" && "Enviando..."}
                    {estado === "enviado" && "Mensaje enviado"}
                    {estado === "error" && "Error, intentá de nuevo"}
                  </Button>
                  <p aria-live="polite" className="sr-only">
                    {estado === "enviado" && "Mensaje enviado"}
                    {estado === "error" && "Hubo un error al enviar el mensaje"}
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
