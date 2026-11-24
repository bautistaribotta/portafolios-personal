import { useState, useSyncExternalStore } from "react"

import GradientASCII from "@/components/gradiente-ascii"
import { IconoPausa, IconoReproducir } from "@/components/iconos"
import { Button } from "@/components/ui/button"
import { useMedia } from "@/hooks/use-media"
import { MEDIOS } from "@/lib/animaciones"

// Tokens de cada tema, del borde de la sombra al punto más claro
const TOKENS = {
  verde: ["--card", "--primary-solid", "--primary", "--highlight"],
  negro: ["--muted", "--input", "--ring", "--muted-foreground"],
}

const leerTema = () => (document.documentElement.dataset.theme === "verde" ? "verde" : "negro")

function observarTema(avisar: () => void) {
  const observador = new MutationObserver(avisar)
  observador.observe(document.documentElement, { attributeFilter: ["data-theme"] })
  return () => observador.disconnect()
}

/** Fondo del hero en escritorio: degradado de caracteres con los colores del tema */
export default function FondoHero() {
  const tema = useSyncExternalStore(observarTema, leerTema)
  const reducido = useMedia(MEDIOS.reducido)
  const [pausado, setPausado] = useState(false)

  const estilos = getComputedStyle(document.documentElement)
  const colores = TOKENS[tema].map((token) => estilos.getPropertyValue(token).trim())

  return (
    <>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <GradientASCII
          key={String(reducido)}
          colors={colores}
          shape="horizon"
          characters=" ./<>{}=#"
          gradientOpacity={0.22}
          glyphOpacity={0.5}
          glow={0.1}
          scrambleRadius={0.06}
          clickEffect="none"
          intro={!reducido}
          paused={pausado}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setPausado((p) => !p)}
        className="absolute right-6 bottom-6 z-10 text-muted-foreground motion-reduce:hidden"
      >
        {pausado ? <IconoReproducir /> : <IconoPausa />}
        {pausado ? "Reanudar fondo" : "Pausar fondo"}
      </Button>
    </>
  )
}
