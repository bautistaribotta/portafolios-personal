import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

export type TipoDispositivo = "laptop" | "celular"

/*
  El mockup es un solo bloque de proporción 16:11. La pantalla de la laptop es 16:9,
  igual que las capturas, y queda centrada en vertical. Laptop y celular son dos recortes
  (clip-path) del mismo bloque: pasar de uno a otro es interpolar los insets, sin
  tocar width ni height. Los radios van en cqw para que escalen con el mockup.
*/
export const RECORTE: Record<TipoDispositivo, { cuerpo: string; pantalla: string }> = {
  laptop: {
    cuerpo: "inset(9.12% 4% 13.57% 4% round 2.4cqw)",
    pantalla: "inset(11.45% 5.6% 15.9% 5.6% round 0.9cqw)",
  },
  celular: {
    cuerpo: "inset(0% 33.5% 0% 33.5% round 6.4cqw)",
    pantalla: "inset(2.04% 34.9% 2.04% 34.9% round 5.2cqw)",
  },
}

/** Zona visible de la pantalla de cada dispositivo, para ubicar las capturas */
export const HUECO: Record<TipoDispositivo, CSSProperties> = {
  laptop: { top: "11.45%", left: "5.6%", width: "88.8%", height: "72.65%" },
  celular: { top: "2.04%", left: "34.9%", width: "30.2%", height: "95.92%" },
}

type Props = {
  tipo: TipoDispositivo
  className?: string
  /** Capturas: cada una se ubica con HUECO según su dispositivo */
  children?: ReactNode
}

/**
 * Mockup de laptop o celular hecho con CSS. Las clases disp-* son los ganchos
 * que usa GSAP para transformarlo de un dispositivo al otro.
 */
export function Dispositivo({ tipo, className, children }: Props) {
  const laptop = tipo === "laptop"

  return (
    <div className={cn("dispositivo @container w-full", className)}>
      <div className="relative aspect-[16/11] w-full">
        <div
          className="disp-cuerpo absolute inset-0 bg-[linear-gradient(160deg,oklch(0.34_0_0),oklch(0.16_0_0)_45%,oklch(0.24_0_0))]"
          style={{ clipPath: RECORTE[tipo].cuerpo }}
        />
        <div
          className="disp-pantalla absolute inset-0 overflow-hidden bg-black"
          style={{ clipPath: RECORTE[tipo].pantalla }}
        >
          {children}
        </div>
        {/* Isla del celular */}
        <div
          className="disp-isla absolute top-[3.6%] left-1/2 h-[2.8%] w-[8%] -translate-x-1/2 rounded-full bg-black"
          style={{ opacity: laptop ? 0 : 1 }}
        />
        {/* Base de la laptop */}
        <div
          className="disp-base absolute top-[86.43%] left-0 h-[4.4%] w-full origin-top rounded-b-[2.4cqw] bg-[linear-gradient(to_bottom,oklch(0.42_0_0),oklch(0.22_0_0))]"
          style={{ opacity: laptop ? 1 : 0 }}
        >
          <div className="mx-auto h-[45%] w-[14%] rounded-b-[1cqw] bg-black/40" />
        </div>
      </div>
    </div>
  )
}
