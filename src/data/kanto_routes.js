// FR/LG Wild Pokémon encounter data for Kanto routes.
// game: 'FR' = FireRed only, 'LG' = LeafGreen only, undefined = both games

export const KANTO_ROUTES = {
  route1: {
    name: 'Route 1',
    desc: 'Pallet Town ↔ Viridian City',
    grass: [
      { id: 16, name: 'Pidgey',   levels: '3–4' },
      { id: 19, name: 'Rattata',  levels: '3–4' },
    ],
    surf: [],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 60, name: 'Poliwag', levels: '10' }, { id: 118, name: 'Goldeen', levels: '10' }],
      super: [{ id: 60, name: 'Poliwag', levels: '15–25' }, { id: 118, name: 'Goldeen', levels: '15–25' }],
    },
  },

  route2: {
    name: 'Route 2',
    desc: 'Viridian City ↔ Pewter City',
    grass: [
      { id: 16, name: 'Pidgey',    levels: '3–5' },
      { id: 19, name: 'Rattata',   levels: '3–5' },
      { id: 29, name: 'NidoranF',  levels: '3–5' },
      { id: 32, name: 'NidoranM',  levels: '3–5' },
    ],
    surf: [],
    fishing: {},
  },

  viridian_forest: {
    name: 'Viridian Forest',
    desc: 'Interior of Route 2 — Bug-type hotspot',
    grass: [
      { id: 16, name: 'Pidgey',   levels: '3–5' },
      { id: 10, name: 'Caterpie', levels: '3–5', game: 'FR' },
      { id: 11, name: 'Metapod',  levels: '3–5', game: 'FR' },
      { id: 13, name: 'Weedle',   levels: '3–5', game: 'LG' },
      { id: 14, name: 'Kakuna',   levels: '3–5', game: 'LG' },
      { id: 25, name: 'Pikachu',  levels: '3–5' },
    ],
    surf: [],
    fishing: {},
  },

  route3: {
    name: 'Route 3',
    desc: 'Pewter City → Mt. Moon',
    grass: [
      { id: 21, name: 'Spearow',  levels: '6–8' },
      { id: 29, name: 'NidoranF', levels: '7–9' },
      { id: 32, name: 'NidoranM', levels: '7–9' },
      { id: 39, name: 'Jigglypuff', levels: '8–10' },
      { id: 56, name: 'Mankey',   levels: '8–10', game: 'FR' },
      { id: 52, name: 'Meowth',   levels: '8–10', game: 'LG' },
    ],
    surf: [],
    fishing: {},
  },

  mt_moon: {
    name: 'Mt. Moon',
    desc: 'Cave between Routes 3 & 4',
    grass: [
      { id: 41, name: 'Zubat',    levels: '8–12' },
      { id: 74, name: 'Geodude',  levels: '8–12' },
      { id: 46, name: 'Paras',    levels: '8–12' },
      { id: 35, name: 'Clefairy', levels: '8–15' },
    ],
    surf: [],
    fishing: {},
  },

  route4: {
    name: 'Route 4',
    desc: 'Mt. Moon ↔ Cerulean City',
    grass: [
      { id: 21, name: 'Spearow',  levels: '13–15' },
      { id: 19, name: 'Rattata',  levels: '13–15' },
      { id: 23, name: 'Ekans',    levels: '13–15', game: 'FR' },
      { id: 27, name: 'Sandshrew',levels: '13–15', game: 'LG' },
      { id: 56, name: 'Mankey',   levels: '13–15', game: 'FR' },
      { id: 52, name: 'Meowth',   levels: '13–15', game: 'LG' },
    ],
    surf: [],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 60, name: 'Poliwag', levels: '10' }, { id: 118, name: 'Goldeen', levels: '10' }],
      super: [{ id: 60, name: 'Poliwag', levels: '15–25' }, { id: 118, name: 'Goldeen', levels: '15–25' }],
    },
  },

  route5: {
    name: 'Route 5',
    desc: 'South of Cerulean → Underground Path',
    grass: [
      { id: 43, name: 'Oddish',    levels: '13–15', game: 'FR' },
      { id: 69, name: 'Bellsprout',levels: '13–15', game: 'LG' },
      { id: 56, name: 'Mankey',    levels: '13–15', game: 'FR' },
      { id: 52, name: 'Meowth',    levels: '13–15', game: 'LG' },
      { id: 63, name: 'Abra',      levels: '13–15' },
      { id: 39, name: 'Jigglypuff',levels: '13–15' },
      { id: 16, name: 'Pidgey',    levels: '13–15' },
    ],
    surf: [],
    fishing: {},
  },

  route6: {
    name: 'Route 6',
    desc: 'Underground Path → Vermilion City',
    grass: [
      { id: 43, name: 'Oddish',    levels: '13–17', game: 'FR' },
      { id: 69, name: 'Bellsprout',levels: '13–17', game: 'LG' },
      { id: 56, name: 'Mankey',    levels: '13–15', game: 'FR' },
      { id: 52, name: 'Meowth',    levels: '13–15', game: 'LG' },
      { id: 63, name: 'Abra',      levels: '13–17' },
      { id: 39, name: 'Jigglypuff',levels: '13–15' },
      { id: 16, name: 'Pidgey',    levels: '13–15' },
    ],
    surf: [
      { id: 54, name: 'Psyduck',  levels: '20–30' },
      { id: 55, name: 'Golduck',  levels: '25–35' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 60, name: 'Poliwag', levels: '10' }, { id: 118, name: 'Goldeen', levels: '10' }],
      super: [{ id: 60, name: 'Poliwag', levels: '15–25' }, { id: 118, name: 'Goldeen', levels: '15–25' }],
    },
  },

  route7: {
    name: 'Route 7',
    desc: 'Celadon City ↔ Saffron City',
    grass: [
      { id: 43, name: 'Oddish',    levels: '18–22', game: 'FR' },
      { id: 69, name: 'Bellsprout',levels: '18–22', game: 'LG' },
      { id: 44, name: 'Gloom',     levels: '22–24', game: 'FR' },
      { id: 70, name: 'Weepinbell',levels: '22–24', game: 'LG' },
      { id: 58, name: 'Growlithe', levels: '22–24', game: 'FR' },
      { id: 37, name: 'Vulpix',    levels: '22–24', game: 'LG' },
      { id: 56, name: 'Mankey',    levels: '18–22', game: 'FR' },
      { id: 52, name: 'Meowth',    levels: '18–22', game: 'LG' },
    ],
    surf: [],
    fishing: {},
  },

  route8: {
    name: 'Route 8',
    desc: 'Saffron City ↔ Lavender Town',
    grass: [
      { id: 58, name: 'Growlithe', levels: '18–22', game: 'FR' },
      { id: 37, name: 'Vulpix',    levels: '18–22', game: 'LG' },
      { id: 96, name: 'Drowzee',   levels: '18–22' },
      { id: 56, name: 'Mankey',    levels: '18–22', game: 'FR' },
      { id: 52, name: 'Meowth',    levels: '18–22', game: 'LG' },
      { id: 16, name: 'Pidgey',    levels: '18–22' },
      { id: 23, name: 'Ekans',     levels: '18–22', game: 'FR' },
      { id: 27, name: 'Sandshrew', levels: '18–22', game: 'LG' },
    ],
    surf: [],
    fishing: {},
  },

  route9: {
    name: 'Route 9',
    desc: 'East of Cerulean → Rock Tunnel',
    grass: [
      { id: 21, name: 'Spearow',  levels: '13–18' },
      { id: 23, name: 'Ekans',    levels: '13–18', game: 'FR' },
      { id: 27, name: 'Sandshrew',levels: '13–18', game: 'LG' },
      { id: 29, name: 'NidoranF', levels: '13–18' },
      { id: 30, name: 'Nidorina', levels: '18–22' },
      { id: 32, name: 'NidoranM', levels: '13–18' },
      { id: 33, name: 'Nidorino', levels: '18–22' },
    ],
    surf: [],
    fishing: {},
  },

  rock_tunnel: {
    name: 'Rock Tunnel',
    desc: 'Cave between Routes 9 & 10',
    grass: [
      { id: 41, name: 'Zubat',   levels: '15–22' },
      { id: 74, name: 'Geodude', levels: '15–22' },
      { id: 66, name: 'Machop',  levels: '15–22' },
      { id: 95, name: 'Onix',    levels: '15–22' },
      { id: 56, name: 'Mankey',  levels: '15–22', game: 'FR' },
      { id: 52, name: 'Meowth',  levels: '15–22', game: 'LG' },
    ],
    surf: [],
    fishing: {},
  },

  route10: {
    name: 'Route 10',
    desc: 'South of Rock Tunnel → Lavender Town',
    grass: [
      { id: 100, name: 'Voltorb',   levels: '18–25' },
      { id: 81,  name: 'Magnemite', levels: '18–25' },
      { id: 96,  name: 'Drowzee',   levels: '18–25' },
      { id: 21,  name: 'Spearow',   levels: '18–22' },
      { id: 23,  name: 'Ekans',     levels: '18–22', game: 'FR' },
      { id: 27,  name: 'Sandshrew', levels: '18–22', game: 'LG' },
    ],
    surf: [
      { id: 54, name: 'Psyduck', levels: '20–30' },
      { id: 55, name: 'Golduck', levels: '25–35' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 60, name: 'Poliwag', levels: '10' }],
      super: [{ id: 60, name: 'Poliwag', levels: '15–25' }],
    },
  },

  power_plant: {
    name: 'Power Plant',
    desc: 'Route 10 area (access via Surf)',
    grass: [
      { id: 81,  name: 'Magnemite', levels: '22–28' },
      { id: 82,  name: 'Magneton',  levels: '28–35' },
      { id: 100, name: 'Voltorb',   levels: '22–35' },
      { id: 101, name: 'Electrode', levels: '28–38' },
      { id: 125, name: 'Electabuzz',levels: '32–38' },
    ],
    surf: [],
    fishing: {},
  },

  route11: {
    name: 'Route 11',
    desc: 'East of Vermilion City',
    grass: [
      { id: 21, name: 'Spearow',  levels: '13–20' },
      { id: 23, name: 'Ekans',    levels: '13–20', game: 'FR' },
      { id: 27, name: 'Sandshrew',levels: '13–20', game: 'LG' },
      { id: 96, name: 'Drowzee',  levels: '13–20' },
      { id: 19, name: 'Rattata',  levels: '13–20' },
    ],
    surf: [
      { id: 86, name: 'Seel',      levels: '20–30' },
      { id: 87, name: 'Dewgong',   levels: '25–35' },
      { id: 72, name: 'Tentacool', levels: '5–40' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 116, name: 'Horsea', levels: '10' }, { id: 98, name: 'Krabby', levels: '10' }],
      super: [{ id: 117, name: 'Seadra', levels: '20–35' }, { id: 99, name: 'Kingler', levels: '25–35' }],
    },
  },

  route12: {
    name: 'Route 12',
    desc: 'South of Lavender Town / Route 11 (Snorlax area)',
    grass: [
      { id: 43, name: 'Oddish',    levels: '22–27', game: 'FR' },
      { id: 69, name: 'Bellsprout',levels: '22–27', game: 'LG' },
      { id: 44, name: 'Gloom',     levels: '25–30', game: 'FR' },
      { id: 70, name: 'Weepinbell',levels: '25–30', game: 'LG' },
      { id: 96, name: 'Drowzee',   levels: '22–27' },
      { id: 23, name: 'Ekans',     levels: '22–27', game: 'FR' },
      { id: 27, name: 'Sandshrew', levels: '22–27', game: 'LG' },
      { id: 16, name: 'Pidgey',    levels: '22–27' },
    ],
    surf: [
      { id: 72, name: 'Tentacool',  levels: '5–40' },
      { id: 73, name: 'Tentacruel', levels: '30–40' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 116, name: 'Horsea', levels: '10' }, { id: 98, name: 'Krabby', levels: '10' }],
      super: [{ id: 117, name: 'Seadra', levels: '20–35' }, { id: 99, name: 'Kingler', levels: '25–35' }],
    },
  },

  route13: {
    name: 'Route 13',
    desc: 'Between Routes 12 & 14',
    grass: [
      { id: 43, name: 'Oddish',    levels: '22–27', game: 'FR' },
      { id: 69, name: 'Bellsprout',levels: '22–27', game: 'LG' },
      { id: 44, name: 'Gloom',     levels: '25–30', game: 'FR' },
      { id: 70, name: 'Weepinbell',levels: '25–30', game: 'LG' },
      { id: 48, name: 'Venonat',   levels: '22–27' },
      { id: 49, name: 'Venomoth',  levels: '25–30' },
      { id: 16, name: 'Pidgey',    levels: '22–27' },
    ],
    surf: [
      { id: 72, name: 'Tentacool',  levels: '5–40' },
      { id: 73, name: 'Tentacruel', levels: '30–40' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 116, name: 'Horsea', levels: '10' }, { id: 98, name: 'Krabby', levels: '10' }],
      super: [{ id: 117, name: 'Seadra', levels: '20–35' }, { id: 99, name: 'Kingler', levels: '25–35' }],
    },
  },

  route14: {
    name: 'Route 14',
    desc: 'Between Routes 13 & 15',
    grass: [
      { id: 43, name: 'Oddish',    levels: '27–33', game: 'FR' },
      { id: 69, name: 'Bellsprout',levels: '27–33', game: 'LG' },
      { id: 44, name: 'Gloom',     levels: '30–35', game: 'FR' },
      { id: 70, name: 'Weepinbell',levels: '30–35', game: 'LG' },
      { id: 48, name: 'Venonat',   levels: '27–33' },
      { id: 49, name: 'Venomoth',  levels: '28–33' },
      { id: 17, name: 'Pidgeotto', levels: '27–33' },
    ],
    surf: [],
    fishing: {},
  },

  route15: {
    name: 'Route 15',
    desc: 'Between Route 14 & Fuchsia City',
    grass: [
      { id: 43, name: 'Oddish',    levels: '27–33', game: 'FR' },
      { id: 69, name: 'Bellsprout',levels: '27–33', game: 'LG' },
      { id: 44, name: 'Gloom',     levels: '30–35', game: 'FR' },
      { id: 70, name: 'Weepinbell',levels: '30–35', game: 'LG' },
      { id: 48, name: 'Venonat',   levels: '27–33' },
      { id: 49, name: 'Venomoth',  levels: '28–33' },
      { id: 17, name: 'Pidgeotto', levels: '27–33' },
    ],
    surf: [],
    fishing: {},
  },

  route16: {
    name: 'Route 16',
    desc: 'West of Celadon — Cycling Road (north, Snorlax)',
    grass: [
      { id: 19, name: 'Rattata',   levels: '20–27' },
      { id: 21, name: 'Spearow',   levels: '20–27' },
      { id: 23, name: 'Ekans',     levels: '20–27', game: 'FR' },
      { id: 27, name: 'Sandshrew', levels: '20–27', game: 'LG' },
      { id: 84, name: 'Doduo',     levels: '20–27' },
    ],
    surf: [],
    fishing: {},
  },

  route17: {
    name: 'Route 17',
    desc: 'Cycling Road (main stretch)',
    grass: [
      { id: 19, name: 'Rattata',   levels: '20–27' },
      { id: 21, name: 'Spearow',   levels: '20–27' },
      { id: 23, name: 'Ekans',     levels: '20–27', game: 'FR' },
      { id: 27, name: 'Sandshrew', levels: '20–27', game: 'LG' },
      { id: 84, name: 'Doduo',     levels: '20–27' },
    ],
    surf: [],
    fishing: {},
  },

  route18: {
    name: 'Route 18',
    desc: 'South end of Cycling Road → Fuchsia City',
    grass: [
      { id: 19, name: 'Rattata',   levels: '20–27' },
      { id: 21, name: 'Spearow',   levels: '20–27' },
      { id: 23, name: 'Ekans',     levels: '20–27', game: 'FR' },
      { id: 27, name: 'Sandshrew', levels: '20–27', game: 'LG' },
      { id: 84, name: 'Doduo',     levels: '20–27' },
    ],
    surf: [],
    fishing: {},
  },

  route19: {
    name: 'Route 19',
    desc: 'Ocean south of Fuchsia City',
    grass: [],
    surf: [
      { id: 72, name: 'Tentacool',  levels: '5–40' },
      { id: 73, name: 'Tentacruel', levels: '30–40' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 116, name: 'Horsea', levels: '10' }, { id: 98, name: 'Krabby', levels: '10' }],
      super: [{ id: 117, name: 'Seadra', levels: '20–35' }, { id: 99, name: 'Kingler', levels: '25–35' }, { id: 120, name: 'Staryu', levels: '20–35' }, { id: 121, name: 'Starmie', levels: '25–35' }],
    },
  },

  route20: {
    name: 'Route 20',
    desc: 'Ocean west of Cinnabar Island (passes Seafoam)',
    grass: [],
    surf: [
      { id: 72, name: 'Tentacool',  levels: '5–40' },
      { id: 73, name: 'Tentacruel', levels: '30–40' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 116, name: 'Horsea', levels: '10' }, { id: 98, name: 'Krabby', levels: '10' }],
      super: [{ id: 117, name: 'Seadra', levels: '20–35' }, { id: 99, name: 'Kingler', levels: '25–35' }],
    },
  },

  route21: {
    name: 'Route 21',
    desc: 'Ocean between Pallet Town & Cinnabar Island',
    grass: [],
    surf: [
      { id: 72, name: 'Tentacool',  levels: '5–40' },
      { id: 73, name: 'Tentacruel', levels: '30–40' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 118, name: 'Goldeen', levels: '10' }, { id: 116, name: 'Horsea', levels: '10' }],
      super: [{ id: 118, name: 'Goldeen', levels: '20–35' }, { id: 119, name: 'Seaking', levels: '25–35' }, { id: 117, name: 'Seadra', levels: '20–35' }],
    },
  },

  route22: {
    name: 'Route 22',
    desc: 'West of Viridian City → Victory Road entrance',
    grass: [
      { id: 16, name: 'Pidgey',    levels: '3–5' },
      { id: 19, name: 'Rattata',   levels: '3–5' },
      { id: 29, name: 'NidoranF',  levels: '3–5' },
      { id: 32, name: 'NidoranM',  levels: '3–5' },
      { id: 56, name: 'Mankey',    levels: '5–7', game: 'FR' },
      { id: 52, name: 'Meowth',    levels: '5–7', game: 'LG' },
    ],
    surf: [
      { id: 54, name: 'Psyduck',  levels: '20–30' },
      { id: 55, name: 'Golduck',  levels: '25–35' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 60, name: 'Poliwag', levels: '10' }],
      super: [{ id: 60, name: 'Poliwag', levels: '15–25' }, { id: 61, name: 'Poliwhirl', levels: '20–35' }],
    },
  },

  victory_road: {
    name: 'Victory Road',
    desc: 'Route 23 — cave before Indigo Plateau',
    grass: [
      { id: 41, name: 'Zubat',    levels: '22–46' },
      { id: 42, name: 'Golbat',   levels: '35–46' },
      { id: 74, name: 'Geodude',  levels: '22–46' },
      { id: 75, name: 'Graveler', levels: '28–46' },
      { id: 66, name: 'Machop',   levels: '22–46' },
      { id: 67, name: 'Machoke',  levels: '28–46' },
      { id: 95, name: 'Onix',     levels: '22–46' },
      { id: 24, name: 'Arbok',    levels: '28–46', game: 'FR' },
      { id: 28, name: 'Sandslash',levels: '28–46', game: 'LG' },
      { id: 57, name: 'Primeape', levels: '28–46', game: 'FR' },
      { id: 53, name: 'Persian',  levels: '28–46', game: 'LG' },
      { id: 49, name: 'Venomoth', levels: '25–46' },
    ],
    surf: [
      { id: 54, name: 'Psyduck', levels: '20–30' },
      { id: 55, name: 'Golduck', levels: '25–35' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 60, name: 'Poliwag', levels: '10' }],
      super: [{ id: 61, name: 'Poliwhirl', levels: '20–35' }],
    },
  },

  route24: {
    name: 'Route 24',
    desc: 'North of Cerulean City — Nugget Bridge',
    grass: [
      { id: 43, name: 'Oddish',    levels: '13–15', game: 'FR' },
      { id: 69, name: 'Bellsprout',levels: '13–15', game: 'LG' },
      { id: 63, name: 'Abra',      levels: '13–15' },
      { id: 60, name: 'Poliwag',   levels: '13–15' },
    ],
    surf: [
      { id: 54, name: 'Psyduck', levels: '20–30' },
      { id: 55, name: 'Golduck', levels: '25–35' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 60, name: 'Poliwag', levels: '10' }],
      super: [{ id: 60, name: 'Poliwag', levels: '15–25' }, { id: 61, name: 'Poliwhirl', levels: '20–35' }],
    },
  },

  route25: {
    name: 'Route 25',
    desc: "Northeast Cerulean — Bill's house",
    grass: [
      { id: 43, name: 'Oddish',    levels: '13–15', game: 'FR' },
      { id: 69, name: 'Bellsprout',levels: '13–15', game: 'LG' },
      { id: 63, name: 'Abra',      levels: '13–15' },
      { id: 60, name: 'Poliwag',   levels: '13–15' },
    ],
    surf: [
      { id: 54, name: 'Psyduck', levels: '20–30' },
      { id: 55, name: 'Golduck', levels: '25–35' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 60, name: 'Poliwag', levels: '10' }],
      super: [{ id: 60, name: 'Poliwag', levels: '15–25' }],
    },
  },

  safari_zone: {
    name: 'Safari Zone',
    desc: 'Fuchsia City — special Safari rules apply',
    grass: [
      { id: 29, name: 'NidoranF',  levels: '22–26' },
      { id: 30, name: 'Nidorina',  levels: '24–29' },
      { id: 32, name: 'NidoranM',  levels: '22–26' },
      { id: 33, name: 'Nidorino',  levels: '24–29' },
      { id: 102, name: 'Exeggcute',levels: '22–29' },
      { id: 111, name: 'Rhyhorn',  levels: '22–29' },
      { id: 113, name: 'Chansey',  levels: '22–29' },
      { id: 123, name: 'Scyther',  levels: '23–28', game: 'FR' },
      { id: 127, name: 'Pinsir',   levels: '23–28', game: 'LG' },
      { id: 46,  name: 'Paras',    levels: '22–27' },
      { id: 47,  name: 'Parasect', levels: '25–30' },
      { id: 84,  name: 'Doduo',    levels: '22–27' },
      { id: 115, name: 'Kangaskhan',levels: '25–30' },
      { id: 128, name: 'Tauros',   levels: '25–30' },
    ],
    surf: [
      { id: 54, name: 'Psyduck',  levels: '20–30' },
      { id: 55, name: 'Golduck',  levels: '25–35' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 60, name: 'Poliwag', levels: '10' }],
      super: [{ id: 61, name: 'Poliwhirl', levels: '20–35' }],
    },
  },

  seafoam_islands: {
    name: 'Seafoam Islands',
    desc: 'Cave in Route 20 — home of Articuno',
    grass: [
      { id: 86, name: 'Seel',     levels: '30–35' },
      { id: 87, name: 'Dewgong',  levels: '35–40' },
      { id: 41, name: 'Zubat',    levels: '30–35' },
      { id: 42, name: 'Golbat',   levels: '33–39' },
      { id: 74, name: 'Geodude',  levels: '30–35' },
      { id: 75, name: 'Graveler', levels: '33–39' },
      { id: 90, name: 'Shellder', levels: '30–35' },
    ],
    surf: [
      { id: 86, name: 'Seel',    levels: '25–35' },
      { id: 87, name: 'Dewgong', levels: '30–40' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 116, name: 'Horsea', levels: '10' }],
      super: [{ id: 117, name: 'Seadra', levels: '20–35' }, { id: 91, name: 'Cloyster', levels: '25–35' }],
    },
  },

  pokemon_mansion: {
    name: 'Pokémon Mansion',
    desc: 'Cinnabar Island — abandoned lab',
    grass: [
      { id: 58, name: 'Growlithe', levels: '30–36', game: 'FR' },
      { id: 37, name: 'Vulpix',    levels: '30–36', game: 'LG' },
      { id: 109, name: 'Koffing',  levels: '30–36' },
      { id: 110, name: 'Weezing',  levels: '33–39' },
      { id: 88,  name: 'Grimer',   levels: '30–36' },
      { id: 89,  name: 'Muk',      levels: '33–39' },
      { id: 19,  name: 'Rattata',  levels: '30–36' },
      { id: 20,  name: 'Raticate', levels: '33–39' },
    ],
    surf: [],
    fishing: {},
  },

  cerulean_cave: {
    name: 'Cerulean Cave',
    desc: 'Requires all 8 badges + Pokémon League — Mewtwo lives here',
    grass: [
      { id: 64,  name: 'Kadabra',  levels: '46–48' },
      { id: 93,  name: 'Haunter',  levels: '46–48' },
      { id: 42,  name: 'Golbat',   levels: '46–49' },
      { id: 47,  name: 'Parasect', levels: '46–48' },
      { id: 57,  name: 'Primeape', levels: '46–49', game: 'FR' },
      { id: 53,  name: 'Persian',  levels: '46–49', game: 'LG' },
      { id: 108, name: 'Lickitung',levels: '46–48' },
      { id: 112, name: 'Rhydon',   levels: '46–48' },
      { id: 132, name: 'Ditto',    levels: '46–49' },
      { id: 202, name: 'Wobbuffet',levels: '46–48', game: 'LG' },
      { id: 101, name: 'Electrode',levels: '46–48', game: 'FR' },
      { id: 82,  name: 'Magneton', levels: '46–48', game: 'FR' },
    ],
    surf: [
      { id: 79, name: 'Slowpoke', levels: '20–30' },
      { id: 80, name: 'Slowbro',  levels: '25–40' },
    ],
    fishing: {
      old:   [{ id: 129, name: 'Magikarp', levels: '5' }],
      good:  [{ id: 60, name: 'Poliwag', levels: '10' }],
      super: [{ id: 61, name: 'Poliwhirl', levels: '20–35' }, { id: 62, name: 'Poliwrath', levels: '35–40' }],
    },
  },
}

// Node positions calibrated to plot-kanto-1.png (1344×960).
// x%, y% are percentages of the image width/height from the top-left corner.
export const MAP_NODES = [
  // ── West spine: Pewter → Viridian → Pallet ─────────────────
  { id: 'route2',          label: 'Route 2',         x: 14, y: 28, kind: 'route' },
  { id: 'viridian_forest', label: 'Viridian Forest', x: 14, y: 22, kind: 'dungeon' },
  { id: 'route1',          label: 'Route 1',         x: 14, y: 47, kind: 'route' },

  // ── Victory Road / Route 22 ────────────────────────────────
  { id: 'victory_road',    label: 'Victory Road',    x:  7, y: 22, kind: 'dungeon' },
  { id: 'route22',         label: 'Route 22',        x:  7, y: 40, kind: 'route' },

  // ── Pewter → Cerulean top corridor ────────────────────────
  { id: 'route3',          label: 'Route 3',         x: 34, y:  9, kind: 'route' },
  { id: 'mt_moon',         label: 'Mt. Moon',        x: 44, y:  9, kind: 'dungeon' },
  { id: 'route4',          label: 'Route 4',         x: 56, y:  9, kind: 'route' },

  // ── Cerulean north ────────────────────────────────────────
  { id: 'cerulean_cave',   label: 'Cerulean Cave',   x: 58, y:  3, kind: 'dungeon' },
  { id: 'route24',         label: 'Route 24',        x: 65, y:  3, kind: 'route' },
  { id: 'route25',         label: 'Route 25',        x: 75, y:  3, kind: 'route' },

  // ── East cave chain ────────────────────────────────────────
  { id: 'route9',          label: 'Route 9',         x: 75, y: 17, kind: 'route' },
  { id: 'rock_tunnel',     label: 'Rock Tunnel',     x: 75, y: 24, kind: 'dungeon' },
  { id: 'route10',         label: 'Route 10',        x: 75, y: 31, kind: 'route' },
  { id: 'power_plant',     label: 'Power Plant',     x: 84, y: 29, kind: 'dungeon' },

  // ── Routes 5/6 (Cerulean → Vermilion) ─────────────────────
  { id: 'route5',          label: 'Route 5',         x: 65, y: 22, kind: 'route' },
  { id: 'route6',          label: 'Route 6',         x: 65, y: 41, kind: 'route' },

  // ── Central corridor (Celadon ↔ Saffron ↔ Lavender) ───────
  { id: 'route7',          label: 'Route 7',         x: 44, y: 35, kind: 'route' },
  { id: 'route8',          label: 'Route 8',         x: 67, y: 35, kind: 'route' },

  // ── Cycling Road ───────────────────────────────────────────
  { id: 'route16',         label: 'Route 16',        x: 27, y: 42, kind: 'route' },
  { id: 'route17',         label: 'Route 17',        x: 27, y: 51, kind: 'route' },
  { id: 'route18',         label: 'Route 18',        x: 37, y: 58, kind: 'route' },

  // ── East routes (Vermilion / Lavender south) ───────────────
  { id: 'route11',         label: 'Route 11',        x: 75, y: 48, kind: 'route' },
  { id: 'route12',         label: 'Route 12',        x: 81, y: 36, kind: 'route' },
  { id: 'route13',         label: 'Route 13',        x: 81, y: 44, kind: 'route' },
  { id: 'route14',         label: 'Route 14',        x: 81, y: 51, kind: 'route' },
  { id: 'route15',         label: 'Route 15',        x: 71, y: 57, kind: 'route' },

  // ── Fuchsia / Safari ───────────────────────────────────────
  { id: 'safari_zone',     label: 'Safari Zone',     x: 45, y: 57, kind: 'dungeon' },

  // ── South ocean ────────────────────────────────────────────
  { id: 'route19',         label: 'Route 19',        x: 50, y: 67, kind: 'water' },
  { id: 'seafoam_islands', label: 'Seafoam Islands', x: 38, y: 74, kind: 'dungeon' },
  { id: 'route20',         label: 'Route 20',        x: 31, y: 71, kind: 'water' },
  { id: 'route21',         label: 'Route 21',        x: 14, y: 65, kind: 'water' },

  // ── Cinnabar ───────────────────────────────────────────────
  { id: 'pokemon_mansion', label: 'Pokémon Mansion', x: 14, y: 77, kind: 'dungeon' },
]
