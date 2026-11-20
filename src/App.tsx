import { useEffect } from "react"

import { Encabezado } from "@/components/encabezado"
import { Contacto } from "@/components/secciones/contacto"
import { Habilidades } from "@/components/secciones/habilidades"
import { Hero } from "@/components/secciones/hero"
import { Pie } from "@/components/secciones/pie"
import { Proyectos } from "@/components/secciones/proyectos"
import { SobreMi } from "@/components/secciones/sobre-mi"
import { useTema } from "@/hooks/use-tema"
import {
  gsap,
  iniciarScrollSuave,
  irASeccion,
  MEDIOS,
  refrescarAlCargar,
  useGSAP,
} from "@/lib/animaciones"

export default function App() {
  const { tema, setTema } = useTema()

  // Smooth scroll solo en escritorio y sin preferencia de movimiento reducido
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MEDIOS.escritorio, () => iniciarScrollSuave())
    const cancelar = refrescarAlCargar()
    return () => {
      cancelar()
      mm.revert()
    }
  })

  // Los enlaces internos (#seccion) llevan el scroll y también el foco a la sección destino
  useEffect(() => {
    const alClic = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const enlace = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!enlace) return
      const hash = enlace.getAttribute("href")!
      const destino = hash === "#" ? null : document.getElementById(hash.slice(1))
      if (hash !== "#" && !destino) return
      e.preventDefault()
      history.pushState(null, "", hash === "#" ? location.pathname : hash)
      irASeccion(destino)
    }
    document.addEventListener("click", alClic)
    return () => document.removeEventListener("click", alClic)
  }, [])

  return (
    <>
      <Encabezado tema={tema} onCambiarTema={setTema} />
      <main>
        <Hero />
        <SobreMi />
        <Habilidades />
        <Proyectos />
        <Contacto />
      </main>
      <Pie />
    </>
  )
}
