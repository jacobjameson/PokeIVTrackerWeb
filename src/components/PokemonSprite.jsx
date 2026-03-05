import { useState } from 'react'

export default function PokemonSprite({ id, size = 64, className = '' }) {
  const [errored, setErrored] = useState(false)

  if (!id || errored) {
    return (
      <div
        className={`flex items-center justify-center text-gray-700 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.45 }}
      >
        ?
      </div>
    )
  }

  return (
    <img
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
      alt=""
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className={className}
      style={{ imageRendering: 'pixelated', width: size, height: size }}
      draggable={false}
    />
  )
}
