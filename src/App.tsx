import { Encabezado } from "@/components/encabezado"
import { Contacto } from "@/components/secciones/contacto"
import { Habilidades } from "@/components/secciones/habilidades"
import { Hero } from "@/components/secciones/hero"
import { Pie } from "@/components/secciones/pie"
import { Proyectos } from "@/components/secciones/proyectos"
import { SobreMi } from "@/components/secciones/sobre-mi"
import { useTema } from "@/hooks/use-tema"
import { gsap, iniciarScrollSuave, MEDIOS, refrescarAlCargar, useGSAP } from "@/lib/animaciones"

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
