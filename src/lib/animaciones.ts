import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import type Lenis from "lenis"

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

/**
 * Smooth scroll con Lenis, sincronizado con ScrollTrigger. Lenis solo se usa en escritorio,
 * así que se descarga recién acá y no viaja en el bundle principal. Devuelve la limpieza.
 */
export function iniciarScrollSuave() {
  let cancelado = false
  let limpiar = () => {}

  import("lenis").then(({ default: Lenis }) => {
    if (cancelado) return
    lenis = new Lenis({ autoRaf: false })
    lenis.on("scroll", ScrollTrigger.update)

    const tick = (tiempo: number) => lenis?.raf(tiempo * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    limpiar = () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis?.destroy()
      lenis = null
    }
  })

  return () => {
    cancelado = true
    limpiar()
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

/**
 * Lleva a una sección (o arriba de todo si no hay destino) y le pasa el foco, para que
 * quien navega con teclado siga desde ahí. Respeta scroll-margin y el movimiento reducido.
 */
export function irASeccion(destino: HTMLElement | null) {
  const enfocar = () => destino?.focus({ preventScroll: true })

  if (lenis) {
    lenis.scrollTo(destino ?? 0, { onComplete: enfocar })
    return
  }
  // Sin Lenis, el scroll-behavior de html decide si es suave (y ya respeta movimiento reducido)
  if (destino) destino.scrollIntoView()
  else window.scrollTo({ top: 0 })
  enfocar()
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
