import { useEffect, useRef } from "react"

import { useMedia } from "@/hooks/use-media"
import { MEDIOS } from "@/lib/animaciones"

const PUNTERO_FINO = "(hover: hover) and (pointer: fine)"

const INTERACTIVOS = 'a[href], button:not(:disabled), [role="button"], label[for], summary, select'

const NO_TEXTO = ["button", "submit", "reset", "image", "checkbox", "radio", "range", "color", "file", "hidden"]
const CAMPOS = [
  `input${NO_TEXTO.map((tipo) => `:not([type="${tipo}"])`).join("")}:not(:disabled)`,
  "textarea:not(:disabled)",
  '[contenteditable]:not([contenteditable="false"])',
].join(", ")

/** Cuánto del camino que falta recorre en cada cuadro */
const SUAVIZADO = 0.3
/** Margen después de la última tecla antes de dejar de parpadear */
const PAUSA_ESCRITURA = 700

function estadoSobre(objetivo: EventTarget | null) {
  if (!(objetivo instanceof Element)) return "reposo"
  if (objetivo.closest(CAMPOS)) return "texto"
  if (objetivo.closest(INTERACTIVOS)) return "enlace"
  return "reposo"
}

/** Segundo cursor, decorativo, que sigue al mouse. Solo se monta con un puntero fino. */
export function CursorAcompanante() {
  const punteroFino = useMedia(PUNTERO_FINO)
  return punteroFino ? <Cursor /> : null
}

function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const reducido = useMedia(MEDIOS.reducido)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof el.showPopover !== "function") return

    const control = new AbortController()
    const { signal } = control
    let x = 0
    let y = 0
    let destinoX = 0
    let destinoY = 0
    let visible = false
    let cuadro = 0
    let temporizador = 0

    const ubicar = () => {
      el.style.setProperty("--x", `${x}px`)
      el.style.setProperty("--y", `${y}px`)
    }

    const saltar = () => {
      x = destinoX
      y = destinoY
      ubicar()
    }

    const seguir = () => {
      cuadro = 0
      x += (destinoX - x) * SUAVIZADO
      y += (destinoY - y) * SUAVIZADO
      if (Math.abs(destinoX - x) < 0.1 && Math.abs(destinoY - y) < 0.1) {
        saltar()
        return
      }
      ubicar()
      cuadro = requestAnimationFrame(seguir)
    }

    const mostrar = (valor: boolean) => {
      visible = valor
      el.toggleAttribute("data-visible", valor)
    }
    const presionar = (valor: boolean) => el.toggleAttribute("data-presionado", valor)

    const alMover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      destinoX = e.clientX
      destinoY = e.clientY
      el.dataset.estado = estadoSobre(e.target)
      // Con buttons se corrige solo si el pointerup se perdió fuera de la ventana
      presionar(e.buttons !== 0)

      // Al aparecer (o reaparecer) va directo al mouse, sin viajar desde otro lado
      if (!visible || reducido) saltar()
      else if (!cuadro) cuadro = requestAnimationFrame(seguir)
      if (!visible) mostrar(true)
    }

    const alSoltar = () => presionar(false)

    const alSalir = () => {
      mostrar(false)
      presionar(false)
    }

    const alEscribir = (e: Event) => {
      if (!(e.target instanceof Element) || !e.target.closest(CAMPOS)) return
      el.toggleAttribute("data-escribiendo", true)
      clearTimeout(temporizador)
      temporizador = window.setTimeout(() => el.removeAttribute("data-escribiendo"), PAUSA_ESCRITURA)
    }

    // La top layer se apila por orden de apertura: si se abre otra cosa, vuelvo a quedar arriba.
    // <details> también emite toggle, pero no usa la top layer.
    const alAbrirOtro = (e: Event) => {
      if (e.target === el || e.target instanceof HTMLDetailsElement) return
      if ((e as ToggleEvent).newState !== "open") return
      el.hidePopover()
      el.showPopover()
    }

    const opciones = { capture: true, passive: true, signal }
    el.showPopover()
    document.addEventListener("pointermove", alMover, opciones)
    // Al hacer scroll cambia lo que hay debajo aunque el mouse esté quieto
    document.addEventListener("pointerover", alMover, opciones)
    document.addEventListener("pointerdown", alMover, opciones)
    document.addEventListener("pointerup", alSoltar, opciones)
    document.addEventListener("pointercancel", alSoltar, opciones)
    document.addEventListener("input", alEscribir, opciones)
    document.addEventListener("toggle", alAbrirOtro, opciones)
    // Sin captura: solo interesa salir del documento, no de cada hijo
    document.documentElement.addEventListener("pointerleave", alSalir, { passive: true, signal })
    window.addEventListener("blur", alSoltar, { signal })

    return () => {
      control.abort()
      cancelAnimationFrame(cuadro)
      clearTimeout(temporizador)
      mostrar(false)
      presionar(false)
      el.removeAttribute("data-escribiendo")
      if (el.matches(":popover-open")) el.hidePopover()
    }
  }, [reducido])

  return (
    <div ref={ref} popover="manual" aria-hidden="true" className="cursor-acompanante print:hidden">
      <div className="cursor-forma" />
    </div>
  )
}
