import { useState } from 'react'
import { KANTO_ROUTES, MAP_NODES } from '../data/kanto_routes'
import PokemonSprite from '../components/PokemonSprite'

// ── Color scheme for node kinds ─────────────────────────────────────────────
const KIND_STYLE = {
  route:   { bg: '#122012', border: '#1c3a1c', hover: '#22c55e', text: '#6ee7b7' },
  dungeon: { bg: '#1a1208', border: '#3a2a0a', hover: '#f59e0b', text: '#fcd34d' },
  water:   { bg: '#0a1a2a', border: '#0c3a6a', hover: '#3b82f6', text: '#93c5fd' },
}

const METHOD_CONFIG = {
  grass:   { label: 'Grass',       icon: '🌿', color: '#22c55e' },
  surf:    { label: 'Surfing',      icon: '🌊', color: '#3b82f6' },
  fishing: { label: 'Fishing',      icon: '🎣', color: '#f59e0b' },
}

const GAME_BADGE = {
  FR: { label: 'FR', bg: '#7f1d1d', text: '#fca5a5' },
  LG: { label: 'LG', bg: '#1e3a1e', text: '#86efac' },
}

// ── Small Pokémon row ────────────────────────────────────────────────────────
function MonRow({ mon }) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b last:border-0"
         style={{ borderColor: '#1c3a1c' }}>
      <PokemonSprite id={mon.id} size={28} />
      <span className="flex-1 text-sm" style={{ color: '#d1fae5' }}>{mon.name}</span>
      <span className="text-xs font-mono" style={{ color: '#6ee7b7' }}>Lv.{mon.levels}</span>
      {mon.game && (
        <span className="text-xs font-bold px-1.5 py-0.5 rounded"
              style={{ background: GAME_BADGE[mon.game].bg, color: GAME_BADGE[mon.game].text }}>
          {mon.game}
        </span>
      )}
    </div>
  )
}

// ── Encounter section (grass / surf / fishing rod) ───────────────────────────
function EncounterSection({ title, icon, color, mons }) {
  if (!mons || mons.length === 0) return null
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>{title}</span>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ background: '#0a160a', border: '1px solid #1c3a1c' }}>
        {mons.map((m, i) => <MonRow key={i} mon={m} />)}
      </div>
    </div>
  )
}

// ── Fishing section (three rod tiers) ────────────────────────────────────────
function FishingSection({ fishing }) {
  if (!fishing) return null
  const { old: oldRod = [], good = [], super: superRod = [] } = fishing
  if (oldRod.length + good.length + superRod.length === 0) return null

  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-base">🎣</span>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#f59e0b' }}>Fishing</span>
      </div>
      {[
        { label: 'Old Rod', mons: oldRod },
        { label: 'Good Rod', mons: good },
        { label: 'Super Rod', mons: superRod },
      ].filter(t => t.mons.length > 0).map(tier => (
        <div key={tier.label} className="mb-2">
          <div className="text-xs mb-1 font-medium" style={{ color: '#92400e' }}>{tier.label}</div>
          <div className="rounded-lg overflow-hidden" style={{ background: '#0a160a', border: '1px solid #1c3a1c' }}>
            {tier.mons.map((m, i) => <MonRow key={i} mon={m} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Encounter panel (sidebar or bottom sheet) ─────────────────────────────────
function EncounterPanel({ nodeId, onClose }) {
  const node = MAP_NODES.find(n => n.id === nodeId)
  const data = KANTO_ROUTES[nodeId]
  if (!node || !data) return null

  const hasAny = (data.grass?.length ?? 0) + (data.surf?.length ?? 0) +
    ((data.fishing?.old?.length ?? 0) + (data.fishing?.good?.length ?? 0) + (data.fishing?.super?.length ?? 0)) > 0

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b" style={{ borderColor: '#1c3a1c' }}>
        <div>
          <h2 className="font-bold text-lg" style={{ color: '#d1fae5' }}>{data.name}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#166534' }}>{data.desc}</p>
        </div>
        <button onClick={onClose}
                className="text-xl leading-none ml-4 mt-0.5"
                style={{ color: '#166534' }}>
          ×
        </button>
      </div>

      {/* Encounters */}
      <div className="flex-1 overflow-y-auto p-4">
        {!hasAny ? (
          <p className="text-sm text-center py-8" style={{ color: '#166534' }}>No wild encounters here.</p>
        ) : (
          <>
            <EncounterSection title="Grass" icon="🌿" color="#22c55e" mons={data.grass} />
            <EncounterSection title="Surfing" icon="🌊" color="#3b82f6" mons={data.surf} />
            <FishingSection fishing={data.fishing} />
          </>
        )}
      </div>
    </div>
  )
}

// ── Map node button ───────────────────────────────────────────────────────────
function MapNode({ node, selected, onClick }) {
  const style = KIND_STYLE[node.kind] ?? KIND_STYLE.route
  const isSelected = selected === node.id
  return (
    <button
      onClick={() => onClick(node.id)}
      title={node.label}
      style={{
        position: 'absolute',
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: 'translate(-50%, -50%)',
        background: isSelected ? style.hover : style.bg,
        border: `1px solid ${isSelected ? style.hover : style.border}`,
        color: isSelected ? '#060d06' : style.text,
        borderRadius: 6,
        padding: '2px 6px',
        fontSize: '0.55rem',
        fontWeight: isSelected ? 700 : 500,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        zIndex: isSelected ? 10 : 1,
        transition: 'all 0.1s',
        lineHeight: 1.5,
        boxShadow: isSelected ? `0 0 8px ${style.hover}60` : 'none',
      }}
    >
      {node.label}
    </button>
  )
}

// ── Kanto map SVG background lines ───────────────────────────────────────────
// Simple lines connecting adjacent areas to give a map feel.
const MAP_CONNECTIONS = [
  ['route1',        'route22'],
  ['route2',        'viridian_forest'],
  ['viridian_forest','route3'],
  ['route3',        'mt_moon'],
  ['mt_moon',       'route4'],
  ['route4',        'route5'],
  ['route5',        'route6'],
  ['route6',        'route11'],
  ['route7',        'route8'],
  ['route8',        'route12'],
  ['route9',        'rock_tunnel'],
  ['rock_tunnel',   'route10'],
  ['route10',       'power_plant'],
  ['route11',       'route12'],
  ['route12',       'route13'],
  ['route13',       'route14'],
  ['route14',       'route15'],
  ['route15',       'safari_zone'],
  ['route16',       'route17'],
  ['route17',       'route18'],
  ['route18',       'safari_zone'],
  ['safari_zone',   'route19'],
  ['route19',       'route20'],
  ['route20',       'seafoam_islands'],
  ['route20',       'pokemon_mansion'],
  ['pokemon_mansion','route21'],
  ['route21',       'route1'],
  ['route22',       'victory_road'],
  ['route24',       'route25'],
  ['route24',       'cerulean_cave'],
  ['cerulean_cave', 'route9'],
]

function nodePos(id) {
  const n = MAP_NODES.find(n => n.id === id)
  return n ? { x: n.x, y: n.y } : null
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RouteMap() {
  const [selected, setSelected] = useState(null)

  function handleSelect(id) {
    setSelected(prev => prev === id ? null : id)
  }

  return (
    <div className="flex flex-col md:flex-row h-full" style={{ minHeight: 'calc(100vh - 7rem)' }}>
      {/* ── Map panel ─────────────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden" style={{ minHeight: 360, background: '#060d06' }}>
        {/* Legend */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1"
             style={{ background: 'rgba(6,13,6,0.85)', border: '1px solid #1c3a1c', borderRadius: 8, padding: '6px 10px' }}>
          {Object.entries(KIND_STYLE).map(([k, s]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="rounded" style={{ width: 10, height: 10, background: s.border, border: `1px solid ${s.hover}`, display: 'inline-block' }} />
              <span className="text-xs capitalize" style={{ color: s.text, fontSize: '0.55rem' }}>{k}</span>
            </div>
          ))}
        </div>

        {/* Title */}
        <div className="absolute top-3 right-3 z-20 font-pixel text-right"
             style={{ color: '#22c55e', fontSize: '0.45rem', lineHeight: 2 }}>
          KANTO<br />
          <span style={{ color: '#166534', fontSize: '0.4rem' }}>FR / LG</span>
        </div>

        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          {MAP_CONNECTIONS.map(([a, b], i) => {
            const pa = nodePos(a), pb = nodePos(b)
            if (!pa || !pb) return null
            return (
              <line key={i}
                x1={`${pa.x}%`} y1={`${pa.y}%`}
                x2={`${pb.x}%`} y2={`${pb.y}%`}
                stroke="#1c3a1c" strokeWidth="1" strokeDasharray="3 4"
              />
            )
          })}
        </svg>

        {/* Map nodes */}
        {MAP_NODES.map(node => (
          <MapNode key={node.id} node={node} selected={selected} onClick={handleSelect} />
        ))}

        {/* Tap hint */}
        {!selected && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <span className="text-xs px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(13,26,13,0.9)', color: '#166534', border: '1px solid #1c3a1c' }}>
              Tap any route to see encounters
            </span>
          </div>
        )}
      </div>

      {/* ── Encounter panel (side on desktop, bottom sheet on mobile) ─────── */}
      {selected ? (
        <>
          {/* Desktop: side panel */}
          <div className="hidden md:flex flex-col border-l"
               style={{ width: 320, background: '#0d1a0d', borderColor: '#1c3a1c', flexShrink: 0 }}>
            <EncounterPanel nodeId={selected} onClose={() => setSelected(null)} />
          </div>

          {/* Mobile: bottom sheet */}
          <div className="md:hidden fixed inset-x-0 bottom-0 z-30 flex flex-col rounded-t-2xl border-t"
               style={{ background: '#0d1a0d', borderColor: '#1c3a1c', maxHeight: '55vh' }}>
            <div className="w-8 h-1 rounded-full mx-auto mt-2 mb-1" style={{ background: '#1c3a1c' }} />
            <EncounterPanel nodeId={selected} onClose={() => setSelected(null)} />
          </div>
          {/* Mobile backdrop */}
          <div className="md:hidden fixed inset-0 z-20 bg-black/50"
               onClick={() => setSelected(null)} />
        </>
      ) : null}
    </div>
  )
}
