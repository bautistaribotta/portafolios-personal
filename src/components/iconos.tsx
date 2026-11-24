import type { SVGProps } from "react"

/*
  Set propio de iconos, en grilla de 24: trazo de 2px, extremos rectos, esquinas en inglete,
  cortes a 45 grados y un bloque macizo como acento (el cursor de una terminal).
*/
function Icono({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeMiterlimit="10"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

const Macizo = ({ d }: { d: string }) => <path d={d} fill="currentColor" stroke="none" />

export function IconoMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <path d="M3 7h18M3 17h10" />
      <Macizo d="M16 15h5v4h-5z" />
    </Icono>
  )
}

export function IconoCerrar(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <path d="m4.5 4.5 15 15M19.5 4.5 14 10M10 14l-5.5 5.5" />
    </Icono>
  )
}

export function IconoTilde(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <Macizo d="m3 12.5 2.8-2.5 3.7 3.8L19 4.5 21.5 7l-12 12.5z" />
    </Icono>
  )
}

export function IconoCorreo(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <path d="M3 5h18v10l-4 4H3zM3 7l9 6.5L21 7" />
    </Icono>
  )
}

export function IconoEnviar(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <Macizo d="m3 4 18 8H7z" />
      <path d="m6.5 12-3 7L20 12" />
    </Icono>
  )
}

export function IconoReproducir(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <Macizo d="M6 3.5 19 11v2L6 20.5z" />
    </Icono>
  )
}

export function IconoPausa(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <Macizo d="M5 4h5v16H5zM14 4h5v16h-5z" />
    </Icono>
  )
}

export function IconoFlechaAbajo(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <path d="M12 3v10" />
      <Macizo d="M5 12h14l-7 9z" />
    </Icono>
  )
}

export function IconoFlechaDiagonal(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <path d="m5 19 9-9" />
      <Macizo d="M8 5h11v11z" />
    </Icono>
  )
}

export function IconoDescargarArchivo(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <path d="M5 3h14v13l-5 5H5zM12 6v5" />
      <Macizo d="M8 10.5h8l-4 5z" />
    </Icono>
  )
}

export function IconoUbicacion(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <path d="M5 3h14v9.5l-7 8.5-7-8.5z" />
      <Macizo d="M10 7h4v4h-4z" />
    </Icono>
  )
}

export function IconoEnlaceExterno(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <path d="M10 4H4v16h12l4-4v-2M10 14l6-6" />
      <Macizo d="M12 3h9v9z" />
    </Icono>
  )
}

export function IconoCodigo(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <path d="m8 5-6 7 6 7M16 5l6 7-6 7" />
      <Macizo d="M10 10h4v4h-4z" />
    </Icono>
  )
}

export function IconoAmpliar(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <path d="M7 17 17 7" />
      <Macizo d="M13 3h8v8zM3 13v8h8z" />
    </Icono>
  )
}

export function IconoBirrete(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <Macizo d="m12 3 11 6-11 6L1 9z" />
      <path d="M6 13.5V19h12v-5.5M22 9.5V17" />
    </Icono>
  )
}

export function IconoObjetivo(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <path d="m12 2.5 9.5 9.5-9.5 9.5L2.5 12z" />
      <Macizo d="m12 8 4 4-4 4-4-4z" />
    </Icono>
  )
}

export function IconoHoja(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <path d="M21 3h-9L6 9v9h9l6-6zM2.5 21.5 6 18" />
      <Macizo d="M21 3v9l-6 6H6z" />
    </Icono>
  )
}

export function IconoLuna(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <Macizo d="M13 3H8L3 8v8l5 5h8l5-5v-5l-4 4h-4l-4-4V7z" />
    </Icono>
  )
}

export function IconoCargando(props: SVGProps<SVGSVGElement>) {
  return (
    <Icono {...props}>
      <Macizo d="M10 2h4v4h-4z" />
      <g opacity="0.65">
        <Macizo d="M18 10h4v4h-4z" />
      </g>
      <g opacity="0.4">
        <Macizo d="M10 18h4v4h-4z" />
      </g>
      <g opacity="0.2">
        <Macizo d="M2 10h4v4H2z" />
      </g>
    </Icono>
  )
}

// Marcas: conservan su logo oficial

export function IconoGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export function IconoLinkedin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
