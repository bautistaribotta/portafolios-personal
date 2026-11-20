import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export { gsap, ScrollTrigger, SplitText, useGSAP }

/**
 * Los tres contextos de gsap.matchMedia(). Escritorio y móvil excluyen a quien
 * pidió menos movimiento, así que con "reducido" no corre ninguna animación de scroll.
 */
export const MEDIOS = {
  escritorio: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  movil: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  reducido: "(prefers-reduced-motion: reduce)",
} as const

let lenis: Lenis | null = null

/** Smooth scroll con Lenis, sincronizado con ScrollTrigger. Devuelve la limpieza. */
export function iniciarScrollSuave() {
  lenis = new Lenis({ anchors: true, autoRaf: false })
  lenis.on("scroll", ScrollTrigger.update)

  const tick = (tiempo: number) => lenis?.raf(tiempo * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    gsap.ticker.lagSmoothing(500, 33)
    lenis?.destroy()
    lenis = null
  }
}

/** Salta a una posición de scroll sin animación, con o sin Lenis activo */
export function saltarA(y: number) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo({ top: y, behavior: "instant" })
}

/** Desliza suavemente hasta una posición; con Lenis activo lo hace Lenis para no pelearse con él */
export function deslizarA(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 0.7, easing: (t) => 1 - Math.pow(1 - t, 3) })
  else window.scrollTo({ top: y, behavior: "smooth" })
}

/** Recalcula las posiciones de ScrollTrigger cuando terminan de cargar fuentes e imágenes */
export function refrescarAlCargar() {
  let activo = true
  const refrescar = () => activo && ScrollTrigger.refresh()

  document.fonts?.ready.then(refrescar)
  if (document.readyState !== "complete") window.addEventListener("load", refrescar, { once: true })

  return () => {
    activo = false
    window.removeEventListener("load", refrescar)
  }
}
