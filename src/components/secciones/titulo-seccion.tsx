type Props = {
  titulo: string
  descripcion?: string
}

export function TituloSeccion({ titulo, descripcion }: Props) {
  return (
    <div className="mb-12 max-w-2xl space-y-3">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {titulo}
      </h2>
      {descripcion && <p className="text-muted-foreground">{descripcion}</p>}
    </div>
  )
}
