import { useSyncExternalStore } from "react"

/** true mientras la media query se cumple; se actualiza al cambiar el tamaño o las preferencias */
export function useMedia(consulta: string) {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(consulta)
      mq.addEventListener("change", avisar)
      return () => mq.removeEventListener("change", avisar)
    },
    () => window.matchMedia(consulta).matches
  )
}
