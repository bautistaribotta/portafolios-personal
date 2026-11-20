import { useRef } from "react"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { navegacion } from "@/data/contenido"
import { cn } from "@/lib/utils"

type Props = {
  abierto: boolean
  onCambiar: (abierto: boolean) => void
  onCerrado: () => void
  activa: string
}

/** Se carga recien cuando hace falta, junto con el codigo del panel lateral */
export default function MenuMovil({ abierto, onCambiar, onCerrado, activa }: Props) {
  // Sección elegida en el menú: al cerrarse el panel, el foco va ahí y no al botón del menú
  const elegida = useRef<string | null>(null)

  return (
    <Sheet open={abierto} onOpenChange={onCambiar}>
      <SheetContent
        side="right"
        className="w-64"
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          const destino = elegida.current && document.getElementById(elegida.current)
          elegida.current = null
          if (destino) destino.focus({ preventScroll: true })
          else onCerrado()
        }}
      >
        <SheetHeader>
          <SheetTitle>Navegación</SheetTitle>
          <SheetDescription className="sr-only">Secciones del portafolio</SheetDescription>
        </SheetHeader>
        <ul className="flex flex-col gap-1 px-4">
          {navegacion.map(({ id, etiqueta }) => (
            <li key={id}>
              <SheetClose asChild>
                <a
                  href={`#${id}`}
                  onClick={() => (elegida.current = id)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-foreground",
                    activa === id ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {etiqueta}
                </a>
              </SheetClose>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  )
}
