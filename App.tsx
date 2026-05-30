export interface PlanetLayer {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  focusStats: { label: string; value: string }[];
  visualSettings: {
    targetZoom: number;
    showAtmosphere: boolean;
    showCrust: boolean;
    showInternal: boolean;
    cutawayRotation: number;
    rotationSpeedFactor: number;
    ambientIntensity: number;
  };
  theories?: { title: string; desc: string }[];
}

export interface CelestialObject {
  id: string;
  name: string;
  type: 'planet' | 'star';
  class: string; // e.g. "Terrestrial Planet", "Gas Giant", "Red Dwarf", "Main Sequence A1"
  radius: number; // relative size
  distFromSun: number; // orbital distance
  color: string;
  secondaryColor?: string;
  rotationSpeed: number; // angular rotation increment
  orbitSpeed: number; // orbital angular speed
  mass: string;
  gravity: string;
  distanceLabel: string;
  orbitalPeriod: string;
  temperature: string;
  moons: number;
  composition: { name: string; percentage: number; color: string }[];
  layers: PlanetLayer[];
}

export const celestialObjects: CelestialObject[] = [
  {
    id: 'sun',
    name: 'The Sun',
    type: 'star',
    class: 'Yellow Dwarf (G2V)',
    radius: 5.5,
    distFromSun: 0,
    color: '#ffaa00',
    secondaryColor: '#ff3300',
    rotationSpeed: 0.002,
    orbitSpeed: 0,
    mass: '1.989 × 10³⁰ kg',
    gravity: '274 m/s²',
    distanceLabel: '0 AU (Center of System)',
    orbitalPeriod: 'N/A (Galactic Center)',
    temperature: '5,500 °C (Surface) - 15,000,000 °C (Core)',
    moons: 8,
    composition: [
      { name: 'Hydrogen', percentage: 74, color: '#3b82f6' },
      { name: 'Helium', percentage: 24, color: '#eab308' },
      { name: 'Oxygen & Carbon', percentage: 2, color: '#ef4444' }
    ],
    layers: [
      {
        id: 0,
        title: 'Heliosphere & Helios View',
        subtitle: 'Our Home Star',
        description: 'The Sun holds 99.8% of all matter in the Solar System. Its massive gravitational pull keeps the planets locked in stable orbits, driving life, warmth, and seasons across the planets.',
        focusStats: [
          { label: 'Spectral Class', value: 'G2V Main Sequence' },
          { label: 'Diameter', value: '1.39 Million km' },
          { label: 'Luminosity', value: '3.8 × 10²⁶ Watts' }
        ],
        visualSettings: {
          targetZoom: 10,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 1,
          ambientIntensity: 0.8
        }
      },
      {
        id: 1,
        title: 'The Solar Corona',
        subtitle: 'The Ultra-Hot Outer Atmosphere',
        description: 'An aura of plasma that extends millions of kilometers. Mysteriously, the corona is hundreds of times hotter than the surface, reaching over 1 million Kelvin. It whips out solar wind into space.',
        focusStats: [
          { label: 'Corona Temp', value: '1,000,000 °C' },
          { label: 'Solar Wind Speed', value: '400 km/s' },
          { label: 'Atmosphere Thickness', value: 'Extends millions of km' }
        ],
        visualSettings: {
          targetZoom: 8,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0.5,
          rotationSpeedFactor: 1.5,
          ambientIntensity: 1.2
        }
      },
      {
        id: 2,
        title: 'The Photosphere & Flares',
        subtitle: 'The Visible Surface Outer Shell',
        description: 'A 500-km thick plasma layer emitting the light we receive on Earth. Granulated convection cells rise and fall, punctuated by intense magnetic disturbances known as sunspots and solar flares.',
        focusStats: [
          { label: 'Surface Pressure', value: '0.0001 Bar' },
          { label: 'Convection Cell Size', value: '~1,000 km wide' },
          { label: 'Sunspot Lifespans', value: 'Days to Weeks' }
        ],
        visualSettings: {
          targetZoom: 7,
          showAtmosphere: false,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 0.8,
          ambientIntensity: 1.5
        }
      },
      {
        id: 3,
        title: 'Internal Zones',
        subtitle: 'Radiative & Convective Transport Slices',
        description: 'Underneath the surface lies the Convection Zone (where thermal currents boil upward) and the Radiative Zone, where photons from nuclear fusion struggle for over 100,000 years just to escape!',
        focusStats: [
          { label: 'Radiative Zone Temp', value: '7,000,000 °C' },
          { label: 'Energy Speed', value: 'Takes millennia to transit' },
          { label: 'Convective Thickness', value: '200,000 km' }
        ],
        visualSettings: {
          targetZoom: 6,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 0.8,
          rotationSpeedFactor: 0.4,
          ambientIntensity: 1.2
        }
      },
      {
        id: 4,
        title: 'Annihilation Core & Fusion Engine',
        subtitle: 'Quantum Tunneling Nuclear Forge',
        description: 'At the ultimate core, crushing pressures fuse 600 million tons of Hydrogen into Helium every single second. This continuous hydrogen-burning lifecycle fuels the star, battling gravity to maintain mechanical equilibrium.',
        focusStats: [
          { label: 'Core Temperature', value: '15,000,000 °C' },
          { label: 'Density', value: '150 g/cm³ (10x Lead)' },
          { label: 'Fusion Standard', value: 'Proton-Proton Chain' }
        ],
        visualSettings: {
          targetZoom: 5,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 1.2,
          rotationSpeedFactor: 0.2,
          ambientIntensity: 1.5
        },
        theories: [
          { title: 'Stars Lifespan Theory', desc: 'The Sun is currently in its stable main-sequence stage. In 5 billion years, it will expend its core hydrogen, expand into a Red Giant swallowing Mercury and Venus, and collapse into a Carbon-Oxygen White Dwarf.' }
        ]
      }
    ]
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    class: 'Rocky Planet (Silicates)',
    radius: 1.1,
    distFromSun: 9,
    color: '#8c8c8c',
    secondaryColor: '#5c5c5c',
    rotationSpeed: 0.005,
    orbitSpeed: 0.024,
    mass: '3.285 × 10²³ kg',
    gravity: '3.7 m/s²',
    distanceLabel: '0.39 AU from Sun',
    orbitalPeriod: '88 Earth Days',
    temperature: '-180 °C to 430 °C',
    moons: 0,
    composition: [
      { name: 'Metallic Iron', percentage: 70, color: '#fca5a5' },
      { name: 'Silicate Crust', percentage: 30, color: '#9ca3af' }
    ],
    layers: [
      {
        id: 0,
        title: 'Extreme Orbit View',
        subtitle: 'The Sunward Scorched Messenger',
        description: 'Mercury is the smallest planet in solar system and is closest to the Sun. It experiences the most extreme temperature swings due to its lack of a thick heat-trapping atmosphere.',
        focusStats: [
          { label: 'Orbital Eccentricity', value: '0.205 (Highest)' },
          { label: 'Solar Day', value: '176 Earth Days' },
          { label: 'Velocity', value: '47.4 km/s' }
        ],
        visualSettings: {
          targetZoom: 3,
          showAtmosphere: false,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 1,
          ambientIntensity: 0.5
        }
      },
      {
        id: 1,
        title: 'Exosphere Boundary',
        subtitle: 'A Non-Trapping Solar Breeze Shield',
        description: 'Mercury has a near-vacuum "exosphere" containing atoms blasted off the surface by the solar wind. Lacking a safety envelope, solar rays collide straight with the barren surface.',
        focusStats: [
          { label: 'Pressure', value: '10⁻¹⁴ Bar' },
          { label: 'Components', value: 'Oxygen, Sodium, Hydrogen' },
          { label: 'Magnetic Strength', value: '1% of Earth\'s' }
        ],
        visualSettings: {
          targetZoom: 2.5,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 1.2,
          ambientIntensity: 0.6
        }
      },
      {
        id: 2,
        title: 'Cratered Desert Terrain',
        subtitle: 'Volcanic Plains & Scarp Slices',
        description: 'The iron-rich surface is peppered with thousands of impact craters, resembling our Moon. Gigantic cliff scars (lobate scarps) wrinkle the surface, signaling that Mercury shrank as its molten core cooled.',
        focusStats: [
          { label: 'Caloris Basin', value: '1,550 km wide ring' },
          { label: 'Scarp Cliffs', value: 'Up to 3 km high' },
          { label: 'Surface Composition', value: 'Plagioclase-rich silicates' }
        ],
        visualSettings: {
          targetZoom: 2.2,
          showAtmosphere: false,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0.2,
          rotationSpeedFactor: 0.8,
          ambientIntensity: 0.8
        }
      },
      {
        id: 3,
        title: 'Giant Core Cutaway',
        subtitle: 'An Unusually Dense Liquid Core',
        description: 'Mercury’s metallic core is enormous, occupying about 85% of the planet\'s total radius. In contrast to Earth, its basaltic crust is extremely thin, hinting at a dramatic stellar history.',
        focusStats: [
          { label: 'Core Radius', value: '2,020 km (85% of planet)' },
          { label: 'Mantle Thickness', value: '400 km silicate layer' },
          { label: 'Core State', value: 'Partially molten iron' }
        ],
        visualSettings: {
          targetZoom: 2.0,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 0.6,
          rotationSpeedFactor: 0.5,
          ambientIntensity: 0.7
        }
      },
      {
        id: 4,
        title: 'Stellar Evaporative Origin',
        subtitle: 'The Accretion stripping hypothesis',
        description: 'Scientists theorize that Mercury was originally double its current mass with a larger rocky mantle, but a giant collision or intense solar radiation boiled or blasted away the outer rocky layers early on.',
        focusStats: [
          { label: 'Iron-to-Rock ratio', value: '70% / 30%' },
          { label: 'Shrinkage over time', value: 'Approx. 5-10 km radius' },
          { label: 'Birth State', value: 'Denser hot nebula zone' }
        ],
        visualSettings: {
          targetZoom: 1.8,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 1,
          rotationSpeedFactor: 0.3,
          ambientIntensity: 0.8
        },
        theories: [
          { title: 'The Giant Stripping Theory', desc: 'A Proto-Mercury was struck by a planetesimal 1/6 its mass. The high-energy collision melted the crust, spraying outer silicates into orbit while the heavy metal core merged into a dense sphere.' }
        ]
      }
    ]
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    class: 'Rocky Planet (Runaway Greenhouse)',
    radius: 1.6,
    distFromSun: 13,
    color: '#e5c158',
    secondaryColor: '#b56d25',
    rotationSpeed: -0.003, // Retrograde
    orbitSpeed: 0.016,
    mass: '4.867 × 10²⁴ kg',
    gravity: '8.87 m/s²',
    distanceLabel: '0.72 AU from Sun',
    orbitalPeriod: '224.7 Earth Days',
    temperature: '462 °C (Constant)',
    moons: 0,
    composition: [
      { name: 'Carbon Dioxide', percentage: 96.5, color: '#eab308' },
      { name: 'Nitrogen', percentage: 3.5, color: '#3b82f6' }
    ],
    layers: [
      {
        id: 0,
        title: 'Retrograde Orbital View',
        subtitle: 'Earth\'s Toxic Twin Sister',
        description: 'Venus is roughly the same mass and diameter as Earth but runs spinning in reverse (retrograde). This hostile world experiences scorching conditions under thick carbon gas shroud.',
        focusStats: [
          { label: 'Rotation Sense', value: 'Retrograde (Clockwise)' },
          { label: 'Sideral Day', value: '243 Earth Days' },
          { label: 'Equator Tilt', value: '177.3 Degrees' }
        ],
        visualSettings: {
          targetZoom: 3.2,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 1,
          ambientIntensity: 0.6
        }
      },
      {
        id: 1,
        title: 'Atmospheric Furnace',
        subtitle: 'Acid Rain & Super-Rotating Clouds',
        description: 'The dense atmosphere features sulfuric acid cloud bands swirling at 360 km/h. This extreme CO2 concentration acts like a thermal blanket, trapping every ounce of solar heat to cause runaway greenhouse effects.',
        focusStats: [
          { label: 'Surface Pressure', value: '92 Bar (92x Earth)' },
          { label: 'CO2 Greenhouse Intensity', value: 'Extremely critical' },
          { label: 'Cloud Content', value: 'H₂SO₄ Aerosols' }
        ],
        visualSettings: {
          targetZoom: 2.8,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0.4,
          rotationSpeedFactor: 1.4,
          ambientIntensity: 0.7
        }
      },
      {
        id: 2,
        title: 'Volcanic Crust Surface',
        subtitle: 'Crushed and Melted Tectonic Plains',
        description: 'Stripped of clouds via radar, the surface consists of wide basaltic lava fields, shields of volcanoes, and rugged "tessera" highlands. The intense air pressure turns gaseous ambient CO2 into supercritical fluid.',
        focusStats: [
          { label: 'Shield Volcanoes', value: 'Over 100,000 active/dormant' },
          { label: 'Highest Peak', value: 'Maxwell Montes (11 km)' },
          { label: 'Ecosystem', value: 'Scorched hyper-acidic desert' }
        ],
        visualSettings: {
          targetZoom: 2.5,
          showAtmosphere: false,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 0.7,
          ambientIntensity: 0.9
        }
      },
      {
        id: 3,
        title: 'Interior Spheres',
        subtitle: 'crust, semi-molten mantle, liquid iron-nickel core',
        description: 'The internal structure of Venus is very similar to Earth: a basaltic crust (30 km), a silicate rocky mantle (3,000 km), and a metallic iron-nickel core (3,200 km) that surprisingly generates no global magnetic field due to slow rotation.',
        focusStats: [
          { label: 'Core Diameter', value: 'Approx. 6,000 km' },
          { label: 'Mantle State', value: 'Sluggish hot rocky flow' },
          { label: 'Dynamo Effect', value: 'Absent - no core convection' }
        ],
        visualSettings: {
          targetZoom: 2.2,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 0.6,
          rotationSpeedFactor: 0.4,
          ambientIntensity: 0.8
        }
      },
      {
        id: 4,
        title: 'The Core & Resurfacing Event',
        subtitle: 'Global Meltdown Volcanism Theories',
        description: 'Unlike Earth, Venus lacks plate tectonics. Without plate cooling, excess heat builds up inside the mantle until the planet undergoes a catastrophic, cyclic "resurfacing event" where the crust completely melts and rejuvenates every 500 million years.',
        focusStats: [
          { label: 'Crust Age', value: 'Estim. 300 - 600 Million years' },
          { label: 'Mantle Trapped Heat', value: 'Extreme levels' },
          { label: 'Thermodynamics', value: 'Cyclic volcanic purge' }
        ],
        visualSettings: {
          targetZoom: 2.0,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 1,
          rotationSpeedFactor: 0.2,
          ambientIntensity: 1.0
        },
        theories: [
          { title: 'The Catastrophic Resurfacing Theory', desc: 'Venus traps internal heat because there water-lubricated subduction zones are absent. Heat cooks the crust until the lithosphere liquefies, venting all heat in a colossal period of global sub-meltdown volcanism.' }
        ]
      }
    ]
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    class: 'Rocky Planet (Humid / Ocean)',
    radius: 1.8,
    distFromSun: 18,
    color: '#3490dc',
    secondaryColor: '#38c172',
    rotationSpeed: 0.008,
    orbitSpeed: 0.012,
    mass: '5.972 × 10²⁴ kg',
    gravity: '9.81 m/s²',
    distanceLabel: '1.0 AU from Sun',
    orbitalPeriod: '365.25 Days',
    temperature: '-89 °C to 58 °C',
    moons: 1,
    composition: [
      { name: 'Nitrogen', percentage: 78, color: '#3b82f6' },
      { name: 'Oxygen', percentage: 21, color: '#10b981' },
      { name: 'Argon & CO2', percentage: 1, color: '#9ca3af' }
    ],
    layers: [
      {
        id: 0,
        title: 'Orbital View',
        subtitle: 'The Blue Oasis of Life',
        description: 'Earth is the third planet from the Sun and the only known celestial body to harbor complex life. Framed and buffered by an orbit within the sun\'s habitable zone, Earth supports liquid oceans and dynamic biodiversity.',
        focusStats: [
          { label: 'Mean Radius', value: '6,371 km' },
          { label: 'Surface Water', value: '70.8 %' },
          { label: 'Axial Tilt', value: '23.44 Degrees' }
        ],
        visualSettings: {
          targetZoom: 3.5,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 1,
          ambientIntensity: 0.7
        }
      },
      {
        id: 1,
        title: 'The Atmosphere Shield',
        subtitle: 'Troposphere to Exosphere Protect',
        description: 'Earth is wrapped in a multi-layered gas envelope. The ozone layer filters harmful solar ultraviolet radiation, while the atmosphere burns up millions of incoming meteoroids daily, managing moisture and wind currents.',
        focusStats: [
          { label: 'Atmospheric Mass', value: '5.15 × 10¹⁸ kg' },
          { label: 'Composition', value: 'Nitrogen/Oxygen balance' },
          { label: 'Protection', value: 'UVA/B & Asteroid shield' }
        ],
        visualSettings: {
          targetZoom: 3.0,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0.4,
          rotationSpeedFactor: 1.3,
          ambientIntensity: 0.8
        }
      },
      {
        id: 2,
        title: 'Surface Biosphere Layer',
        subtitle: 'Continents, Oceans & Human Expansion',
        description: 'Earth boasts diverse terrain: mountain systems, abyssal trenches, and lush vegetation. Liquid water cycles between the global ocean and climate cells and tectonic plates raft slowly across the mantle.',
        focusStats: [
          { label: 'Ocean Volume', value: '1.3 Billion km³' },
          { label: 'Plate Count', value: '15 Principal lithospheric plates' },
          { label: 'Velocity of Plates', value: '2.5 to 15 cm per year' }
        ],
        visualSettings: {
          targetZoom: 2.5,
          showAtmosphere: false,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 0.7,
          ambientIntensity: 1.0
        }
      },
      {
        id: 3,
        title: 'Crust to Inner Core Cutaway',
        subtitle: 'Silicate Mantle & Liquid Outer Core Slices',
        description: 'The planetary anatomy of Earth. The thin, solid Crust (5-70 km) wraps around a viscous silicate Mantle (2,900 km, convective flow). Below that sits the churning Liquid Iron Outer Core (generating magnetic fields), and the solid core.',
        focusStats: [
          { label: 'Crust Thickness', value: '5 km (Oceanic) - 40 km (Continental)' },
          { label: 'Mantle Temperature', value: '1000 °C to 3700 °C' },
          { label: 'Outer Core Depth', value: '2,900 km to 5,150 km' }
        ],
        visualSettings: {
          targetZoom: 2.2,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 0.7,
          rotationSpeedFactor: 0.4,
          ambientIntensity: 0.9
        }
      },
      {
        id: 4,
        title: 'Solid Iron Inner Core & Magnetosphere',
        subtitle: 'The Dynamo Core Theories',
        description: 'At the inner edge, gravity and pressure are so intense that iron-nickel freezes into a solid, white-hot, crystallizing sphere. Crushed by 3.6 million atmospheres, the core spins slightly faster than the rest of the planet.',
        focusStats: [
          { label: 'Core Temp', value: '5,400 °C (As hot as Sun Surface)' },
          { label: 'Composition', value: 'Iron (85%), Nickel (15%)' },
          { label: 'Core Crystallization', value: 'Rate: ~1mm per year' }
        ],
        visualSettings: {
          targetZoom: 2.0,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 1,
          rotationSpeedFactor: 0.2,
          ambientIntensity: 1.1
        },
        theories: [
          { title: 'The Accretion Theory', desc: '4.5 billion years ago, solid protoplanet dust collided, causing extreme heating. Iron sank to the center in the "Iron Catastrophe", forming the core.' },
          { title: 'The Giant Impact Hypothesis (Theia)', desc: 'A Mars-sized body named Theia collided with Earth. The vaporization launched debris that quickly accreted into our Moon while the metallic cores merged.' }
        ]
      }
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    class: 'Rocky Planet (Desert / Rust)',
    radius: 1.3,
    distFromSun: 24,
    color: '#e25c38',
    secondaryColor: '#cc4b21',
    rotationSpeed: 0.007,
    orbitSpeed: 0.008,
    mass: '6.39 × 10²³ kg',
    gravity: '3.72 m/s²',
    distanceLabel: '1.52 AU from Sun',
    orbitalPeriod: '687 Earth Days',
    temperature: '-143 °C to 35 °C',
    moons: 2,
    composition: [
      { name: 'Carbon Dioxide', percentage: 95.3, color: '#fca5a5' },
      { name: 'Nitrogen', percentage: 2.7, color: '#3b82f6' },
      { name: 'Argon', percentage: 1.6, color: '#9ca3af' }
    ],
    layers: [
      {
        id: 0,
        title: 'Desert Orbit View',
        subtitle: 'The Red Oxidized Desert',
        description: 'Mars is the fourth planet from the Sun. Its red tint comes from iron oxide rust in its dust and soil. It features ice polar caps, ancient river valleys, and dormant giant shield volcanoes.',
        focusStats: [
          { label: 'Diameter', value: '6,779 km (Half of Earth)' },
          { label: 'Solar Day (Sol)', value: '24 hrs, 39 mins' },
          { label: 'Axial Tilt', value: '25.19 Degrees (Seasons!)' }
        ],
        visualSettings: {
          targetZoom: 3.0,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 1,
          ambientIntensity: 0.6
        }
      },
      {
        id: 1,
        title: 'Rarefied CO2 Atmosphere',
        subtitle: 'Thin Insulating Window',
        description: 'Mars’ atmosphere is extremely thin – less than 1% of Earth’s pressure. Composed mainly of carbon dioxide, it creates a weak greenhouse effect, unable to retain solar energy and prone to global dust storms.',
        focusStats: [
          { label: 'Surface Pressure', value: '0.006 Bar' },
          { label: 'Dust Storm Length', value: 'Can envelop entire planet' },
          { label: 'Ozone Shield', value: 'Extremely sparse' }
        ],
        visualSettings: {
          targetZoom: 2.6,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0.4,
          rotationSpeedFactor: 1.3,
          ambientIntensity: 0.7
        }
      },
      {
        id: 2,
        title: 'Volcanic and Ice Surface',
        subtitle: 'The Rusty Valleys & Olympus Mons',
        description: 'Mars is home to Olympus Mons, the largest volcano in the solar system, and Valles Marineris, a network of canyons that dwarfs the Grand Canyon. Polar ice caps contain both liquid CO2 dry ice and frozen water.',
        focusStats: [
          { label: 'Olympus Mons Height', value: '22 km (3x Everest)' },
          { label: 'Valles Marineris', value: '4,000 km long, 7 km deep' },
          { label: 'Water Resources', value: 'Bound in ground ice & ice sheets' }
        ],
        visualSettings: {
          targetZoom: 2.2,
          showAtmosphere: false,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 0.7,
          ambientIntensity: 0.9
        }
      },
      {
        id: 3,
        title: 'Internal Crust & Iron Mantle',
        subtitle: 'Thick Rocky Husk Slices',
        description: 'Mars’ solid silicate mantle is rich in iron, feeding its surface coloring. Since Mars is smaller than Earth, its core cooled much faster, freezing its dynamo and turning off its global magnetic shield.',
        focusStats: [
          { label: 'Crust Thickness', value: '50 km (uniform and inactive)' },
          { label: 'Mantle State', value: 'Solidified and non-convective' },
          { label: 'Core Inactivity', value: 'Cooled completely' }
        ],
        visualSettings: {
          targetZoom: 2.0,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 0.5,
          rotationSpeedFactor: 0.4,
          ambientIntensity: 0.8
        }
      },
      {
        id: 4,
        title: 'Frozen Core & Dynamos',
        subtitle: 'Magnetic Extinction Theories',
        description: 'As Mars\' core solidified, the convection current generated by liquid iron stopped. Without a dynamo, its protective magnetic shield collapsed, allowing solar winds to strip its ancient wet ocean and atmosphere into deep space.',
        focusStats: [
          { label: 'Core State', value: 'Partially frozen iron-nickel-sulfur' },
          { label: 'Atmosphere Loss', value: 'Stripped over 3 billion years' },
          { label: 'Magnetic Clues', value: 'Magnetized crust spots persist' }
        ],
        visualSettings: {
          targetZoom: 1.8,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 1,
          rotationSpeedFactor: 0.2,
          ambientIntensity: 1.0
        },
        theories: [
          { title: 'The Stellar Wind Stripping Theory', desc: 'Mars once had a warm, liquid ocean. When the internal core cooled and lost its global magnetosphere, the solar winds systematically eroded molecules, drying the planet into an arid shell.' }
        ]
      }
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    class: 'Gas Giant (Storm King)',
    radius: 3.2,
    distFromSun: 34,
    color: '#d4a373',
    secondaryColor: '#bc6c25',
    rotationSpeed: 0.015, // Spins very fast!
    orbitSpeed: 0.002,
    mass: '1.898 × 10²⁷ kg',
    gravity: '24.79 m/s²',
    distanceLabel: '5.20 AU from Sun',
    orbitalPeriod: '11.86 Earth Years',
    temperature: '-108 °C (Cloud tops)',
    moons: 95,
    composition: [
      { name: 'Hydrogen', percentage: 89.8, color: '#3b82f6' },
      { name: 'Helium', percentage: 10.2, color: '#eab308' }
    ],
    layers: [
      {
        id: 0,
        title: 'Giant Gas System View',
        subtitle: 'The Vacuum Cleaner of the System',
        description: 'Jupiter is larger than all other planets combined. Its massive gravity acts like a cosmic shield, absorbing or deflecting rogue comets and asteroids, thereby protecting inner orbital worlds.',
        focusStats: [
          { label: 'Equator Radius', value: '71,492 km (11x Earth)' },
          { label: 'Day Period', value: '9 hrs, 56 mins' },
          { label: 'Magnetic Field Strength', value: '20,000x stronger than Earth\'s' }
        ],
        visualSettings: {
          targetZoom: 5.0,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 1,
          ambientIntensity: 0.7
        }
      },
      {
        id: 1,
        title: 'The Great Red Spot & Belts',
        subtitle: 'The Churning Ammonia Clouds',
        description: 'Jupiter\'s bands are formed by ammonium hydrosulfide cloud decks rotating in opposite directions. The Great Red Spot is a persistent hurricane larger than Earth, raging for at least 350 years.',
        focusStats: [
          { label: 'Red Spot Width', value: '16,000 km' },
          { label: 'Wind Belt Velocity', value: 'Up to 540 km/h' },
          { label: 'Storm Heights', value: '8 km above clouds' }
        ],
        visualSettings: {
          targetZoom: 4.2,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0.4,
          rotationSpeedFactor: 1.5,
          ambientIntensity: 0.8
        }
      },
      {
        id: 2,
        title: 'Supercritical Hydrogen Ocean',
        subtitle: 'The Shifting State Phase',
        description: 'Jupiter lacks a solid surface. As density and temperature rise coordinates under the massive gas columns, atmospheric hydrogen turns into a supercritical fluid state, forming a boundless continuous global ocean.',
        focusStats: [
          { label: 'Transition Depth', value: '1,000 km deep' },
          { label: 'Fluid Pressure', value: '10,000 Bar' },
          { label: 'Viscosity', value: 'Resembles warm tar fluid' }
        ],
        visualSettings: {
          targetZoom: 3.5,
          showAtmosphere: false,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 0.8,
          ambientIntensity: 1.0
        }
      },
      {
        id: 3,
        title: 'Metallic Hydrogen Mantle Slices',
        subtitle: 'Liquid Metal Dynamo',
        description: 'Deeper inside, pressure reaches 2 million atmospheres. At these extreme levels, individual hydrogen molecules disintegrate and act like liquid metal, conducting electricity and generating its magnetic field.',
        focusStats: [
          { label: 'Conductive Depth', value: 'Starting at 15,000 km' },
          { label: 'Electrical conductivity', value: 'Similar to molten Iron' },
          { label: 'Heat Generation', value: 'Radiates 1.6x energy received' }
        ],
        visualSettings: {
          targetZoom: 3.2,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 0.6,
          rotationSpeedFactor: 0.4,
          ambientIntensity: 0.9
        }
      },
      {
        id: 4,
        title: 'The Dissolving Core Theories',
        subtitle: 'Crushed Rock & Shifting Accretions',
        description: 'Jupiter\'s center holds a highly compressed, dissolving core of rock, iron, and exotic water ice. Under enormous thermal pressure, the dense core may be slowly dissolving into the wrapping metallic metallic envelope.',
        focusStats: [
          { label: 'Core Temp', value: '20,000 °C' },
          { label: 'Core Mass', value: '12 to 25 Earth Masses' },
          { label: 'Core State', value: 'Exotic supercritical mineral soup' }
        ],
        visualSettings: {
          targetZoom: 3.0,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 1,
          rotationSpeedFactor: 0.2,
          ambientIntensity: 1.1
        },
        theories: [
          { title: 'The Dissolving Core Theory', desc: 'The thermal energy at Jupiter\'s core is so intense that the boundaries between rock, iron, and liquid hydrogen dissolve, creating a diluted core zone rather than a sharp rock-hydrogen boundary.' }
        ]
      }
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    class: 'Gas Giant (Ring Lord)',
    radius: 2.8,
    distFromSun: 44,
    color: '#e2cf92',
    secondaryColor: '#ccb670',
    rotationSpeed: 0.012,
    orbitSpeed: 0.001,
    mass: '5.68 × 10² kg',
    gravity: '10.44 m/s²',
    distanceLabel: '9.58 AU from Sun',
    orbitalPeriod: '29.45 Earth Years',
    temperature: '-139 °C (Average)',
    moons: 146,
    composition: [
      { name: 'Hydrogen', percentage: 96, color: '#3b82f6' },
      { name: 'Helium', percentage: 3, color: '#eab308' },
      { name: 'Methane', percentage: 1, color: '#10b981' }
    ],
    layers: [
      {
        id: 0,
        title: 'Ring System Vista',
        subtitle: 'The Jewel of the Solar System',
        description: 'Saturn is the second-largest planet in the solar system, widely recognizable for its spectacular, expansive ring system consisting of chunks of space water ice and comet particles.',
        focusStats: [
          { label: 'Ring Diameter', value: '282,000 km wide' },
          { label: 'Ring Thickness', value: 'Only 10 meters on average' },
          { label: 'Density', value: '0.69 g/cm³ (Floats in water)' }
        ],
        visualSettings: {
          targetZoom: 4.8,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 1,
          ambientIntensity: 0.7
        }
      },
      {
        id: 1,
        title: 'The Great Ring Structure',
        subtitle: 'Particles of Ice & Cosmic Debris',
        description: 'Saturn\'s major rings are designated alphabetically. Ring particles range from tiny water micro-droplets to boulder-sized ice blocks. Shepherding moons clear gaps like the Cassini Division.',
        focusStats: [
          { label: 'Ring Composition', value: '99% Pure Water Ice' },
          { label: 'Cassini Division Gap', value: '4,800 km wide' },
          { label: 'Moons Shepherds', value: 'Daphnis, Pan, Prometheus' }
        ],
        visualSettings: {
          targetZoom: 4.0,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0.4,
          rotationSpeedFactor: 1.4,
          ambientIntensity: 0.8
        }
      },
      {
        id: 2,
        title: 'Atmospheric Winds & Hexagon',
        subtitle: 'Polar Jets and Golden Bands',
        description: 'At Saturn\'s north pole, a permanent hexagonal jet stream pattern rages. The wind bands of Saturn are extremely fierce, second only to Neptune, exceeding speeds of 1,800 km/h.',
        focusStats: [
          { label: 'Hexagon Jet Diameter', value: '30,000 km wide' },
          { label: 'Hexagon Wave Speed', value: '320 km/h' },
          { label: 'Equator Winds', value: 'Up to 500 m/s' }
        ],
        visualSettings: {
          targetZoom: 3.5,
          showAtmosphere: false,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 0.8,
          ambientIntensity: 0.9
        }
      },
      {
        id: 3,
        title: 'Helium Rain & Liquid Mantle',
        subtitle: 'Crust and Compressed Gas Slices',
        description: 'As temperature and pressure rise under Saturn\'s thick atmosphere, helium condenses into liquid droplets. This dense "Helium Rain" falls through the lighter hydrogen mantle, generating extra gravitational heat.',
        focusStats: [
          { label: 'Helium Depletion', value: 'Upper atmosphere lacks Helium' },
          { label: 'Mantle Core Temp', value: 'Approx. 11,000 °C' },
          { label: 'Thermal Output', value: 'Radiates 2.5x Sun\'s energy' }
        ],
        visualSettings: {
          targetZoom: 3.2,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 0.6,
          rotationSpeedFactor: 0.4,
          ambientIntensity: 0.8
        }
      },
      {
        id: 4,
        title: 'The Solid Core Theories',
        subtitle: 'The Ring Gravity Clues',
        description: 'Measurements of Saturn\'s ring oscillations (seismology) reveal that Saturn\'s core is not a tight rocky ball but an icy-rocky "fuzzy core" spanning up to 60% of the planet\'s entire volume, layered in liquid water mud.',
        focusStats: [
          { label: 'fuzzy Core Size', value: '17 Earth Masses' },
          { label: 'Core Water Ratio', value: 'Mainly ice-silicate blend' },
          { label: 'Tidal Distortions', value: 'Distorts surrounding ring paths' }
        ],
        visualSettings: {
          targetZoom: 3.0,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 1,
          rotationSpeedFactor: 0.2,
          ambientIntensity: 1.0
        },
        theories: [
          { title: 'The Ring Seismology Theory', desc: 'Astrophysicists used wave patterns in Saturn\'s C-ring as a seismograph. This proved the core is expanded (fuzzy), having a continuous transition out into surrounding metallic envelopes.' }
        ]
      }
    ]
  },
  {
    id: 'sirius',
    name: 'Sirius A',
    type: 'star',
    class: 'Main Sequence (A1V)',
    radius: 3.5,
    distFromSun: 60, // Sparsed layout distance
    color: '#90e0ef',
    secondaryColor: '#caf0f8',
    rotationSpeed: 0.004,
    orbitSpeed: 0, // Placed far
    mass: '4.02 × 10³⁰ kg (2.02 Solar Masses)',
    gravity: '350 m/s²',
    distanceLabel: '8.6 Light Years from Earth',
    orbitalPeriod: 'Binary Sirius B (50 Year Orbit)',
    temperature: '9,940 °C (Surface)',
    moons: 0,
    composition: [
      { name: 'Hydrogen', percentage: 72, color: '#3b82f6' },
      { name: 'Helium', percentage: 26, color: '#eab308' },
      { name: 'Heavy Elements', percentage: 2, color: '#a855f7' }
    ],
    layers: [
      {
        id: 0,
        title: 'Double Star System Orbit',
        subtitle: 'The Dog Star of Canis Major',
        description: 'Sirius is the brightest star in Earth\'s night sky. It is actually a binary star system containing a brilliant white main-sequence star (Sirius A) and a tiny white dwarf companion companion (Sirius B).',
        focusStats: [
          { label: 'Brilliance Scale', value: '25x Sun Luminosity' },
          { label: 'Sirius B Type', value: 'White Dwarf (Sinks in gravity)' },
          { label: 'Discovery Year', value: '1844 (Bessel orbital wobble)' }
        ],
        visualSettings: {
          targetZoom: 5.5,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 1,
          ambientIntensity: 0.9
        }
      },
      {
        id: 1,
        title: 'The Blue-White Photosphere',
        subtitle: 'Intense Ultraviolet Engine',
        description: 'Burning at nearly 10,000 Kelvins, Sirius emits a signature electric blue light. It drains its hydrogen core at a rapid rate, leading to a much shorter lifetime than cooler orange dwarfs.',
        focusStats: [
          { label: 'Emission Profile', value: 'Spectral Type A1V' },
          { label: 'Ultraviolet flux', value: 'High intensity UV emitter' },
          { label: 'Stellar Wind', value: 'Vigorously active mass loss' }
        ],
        visualSettings: {
          targetZoom: 4.5,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0.4,
          rotationSpeedFactor: 1.4,
          ambientIntensity: 1.1
        }
      },
      {
        id: 2,
        title: 'Sirius B Dwarf Influence',
        subtitle: 'The companion gravic shift',
        description: 'Sirius B exerts a massive, tight gravitational drag on Sirius A, warping physical space. Sirius B was once a supermassive star that burned fast and shed its layers, leaving behind a carbon-oxygen core.',
        focusStats: [
          { label: 'Sirius B Mass', value: '1.02 Solar Masses' },
          { label: 'Sirius B Volume', value: 'Approx. size of Earth' },
          { label: 'Density of Dwarf', value: '2.5 Metric Tons per cm³' }
        ],
        visualSettings: {
          targetZoom: 4.0,
          showAtmosphere: false,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 0.7,
          ambientIntensity: 1.2
        }
      },
      {
        id: 3,
        title: 'CNO Cycle Fusion Core Slices',
        subtitle: 'Carbon-Nitrogen-Oxygen Reactor',
        description: 'Unlike the Sun which fuses hydrogen via the proton-proton chain, Sirius’ extreme core temperature triggers the high-luminosity CNO Cycle. In this CNO cycle, Carbon atoms catalyze hydrogen fusion.',
        focusStats: [
          { label: 'Core Target Temp', value: '22,000,000 °C' },
          { label: 'CNO Core Density', value: '110 g/cm³' },
          { label: 'Energy Transport', value: 'Stellar Convective core' }
        ],
        visualSettings: {
          targetZoom: 3.5,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 0.6,
          rotationSpeedFactor: 0.4,
          ambientIntensity: 1.0
        }
      },
      {
        id: 4,
        title: 'lifecycle stage',
        subtitle: 'The Carbon White Dwarf Destination',
        description: 'Having a lifetime of only 1 billion years (due to rapid mass consumption), Sirius A will expand in 700 million years into a Red Giant, shedding its outer envelop, forming a glowing nebula, and leaving a white dwarf binary.',
        focusStats: [
          { label: 'Current Core Age', value: 'Approx. 230 Million years' },
          { label: 'Remaining Life', value: 'Approx. 750 Million years' },
          { label: 'Binary Evolution', value: 'Expected double degenerate dwarf' }
        ],
        visualSettings: {
          targetZoom: 3.0,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 1,
          rotationSpeedFactor: 0.1,
          ambientIntensity: 1.2
        },
        theories: [
          { title: 'The Binary Mass Transfer Theory', desc: 'When Sirius A expands into a Red Giant, its outer gas envelope will overflow its Roche-lobe limit, transferring millions of tons of hot mass onto the white dwarf Sirius B, potentially triggering a thermonuclear explosion (Type Ia Supernova) if it exceeds the Chandrasekhar limit (1.44 solar masses).' }
        ]
      }
    ]
  },
  {
    id: 'proxima',
    name: 'Proxima Centauri',
    type: 'star',
    class: 'Red Dwarf (M5.5Ve)',
    radius: 1.5,
    distFromSun: 50,
    color: '#ff4d4d',
    secondaryColor: '#cc0000',
    rotationSpeed: 0.002,
    orbitSpeed: 0,
    mass: '2.44 × 10²⁹ kg (0.12 Solar Masses)',
    gravity: '1,800 m/s²',
    distanceLabel: '4.24 Light Years from Earth',
    orbitalPeriod: 'Orbiting Alpha Centauri AB (550,000 year period)',
    temperature: '2,770 °C (Surface)',
    moons: 2, // Centauri planets Proxima b and c!
    composition: [
      { name: 'Hydrogen', percentage: 75.5, color: '#3b82f6' },
      { name: 'Helium', percentage: 24, color: '#eab308' },
      { name: 'Metals', percentage: 0.5, color: '#10b981' }
    ],
    layers: [
      {
        id: 0,
        title: 'Deep Crimson View',
        subtitle: 'Our Nearest Stellar Neighbor',
        description: 'Proxima Centauri is the closest star to the Sun. It is a dim red dwarf invisible to the naked eye. It hosts Proxima b, an Earth-sized exoplanet residing in the star habitable orbital range.',
        focusStats: [
          { label: 'Distance', value: '40 Trillion km' },
          { label: 'Host Planet', value: 'Proxima b (Habitable slot)' },
          { label: 'Spectral Class', value: 'M5.5Ve Red Dwarf' }
        ],
        visualSettings: {
          targetZoom: 3.2,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 1,
          ambientIntensity: 0.5
        }
      },
      {
        id: 1,
        title: 'Frequent Flare Storms',
        subtitle: 'The Violent Hostile Corona',
        description: 'Proxima is a "Flare Star". Due to aggressive magnetic convection, it experiences giant thermal eruptions that double the star brightness in minutes, bathing its solar orbit space with lethal radiation.',
        focusStats: [
          { label: 'Flare Energy', value: '100x stronger than Sun flares' },
          { label: 'Radio Emissions', value: 'Extremely high counts' },
          { label: 'Magnetic Flux Density', value: '600 Gauss' }
        ],
        visualSettings: {
          targetZoom: 2.8,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0.3,
          rotationSpeedFactor: 1.6,
          ambientIntensity: 0.7
        }
      },
      {
        id: 2,
        title: 'Dim Chromosphere Surface',
        subtitle: 'Cool Dark Convection Channels',
        description: 'Its surface is surprisingly cool, averaging about 3000 K. Deeply granulated with large starspots, it glows primarily in the near infra-red spectrum, requiring highly sensitive scientific instruments to observe.',
        focusStats: [
          { label: 'Total Luminosity', value: '0.17 % of our Sun' },
          { label: 'Near-Infrared band', value: 'Approx 85% emissions' },
          { label: 'Starspots Area', value: 'Covers up to 20% surface' }
        ],
        visualSettings: {
          targetZoom: 2.4,
          showAtmosphere: false,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 0.8,
          ambientIntensity: 0.9
        }
      },
      {
        id: 3,
        title: 'Fully Convective Interior Slices',
        subtitle: 'No Radiative Transit Zone',
        description: 'Unlike the Sun, Proxima Centauri is fully convective from its core to surface. Heated plasma rises directly from the fusion core, cools at the surface, and sinks back down. This keeps the star perfectly mixed.',
        focusStats: [
          { label: 'Convection Style', value: 'Global continuous churning' },
          { label: 'Core Temp', value: '4,000,000 °C' },
          { label: 'Radiative Boundary', value: 'Absent' }
        ],
        visualSettings: {
          targetZoom: 2.2,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 0.5,
          rotationSpeedFactor: 0.4,
          ambientIntensity: 0.8
        }
      },
      {
        id: 4,
        title: 'Trillion Year Lifecycle',
        subtitle: 'Continuous Fuel Recycle Core',
        description: 'Because helium is constantly cycled out and fresh hydrogen is ferried into the core, Proxima consumes its fuel extremely slowly. Proxima Centauri is projected to burn for up to 4 trillion years.',
        focusStats: [
          { label: 'Star Age', value: '4.85 Billion years' },
          { label: 'Expected Burn time', value: 'Approx. 4,000,000,000,000 years' },
          { label: 'Ending Fate', value: 'Helium White Dwarf' }
        ],
        visualSettings: {
          targetZoom: 2.0,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 1,
          rotationSpeedFactor: 0.2,
          ambientIntensity: 1.0
        },
        theories: [
          { title: 'The Helium Dwarf Theory', desc: 'As the hydrogen is completely fused into Helium over trillions of years, Proxima will never expand into a Red Giant (due to small mass limits). It will slowly contract, heating up into a Blue Dwarf, then fade peacefully into a Helium White Dwarf.' }
        ]
      }
    ]
  },
  {
    id: 'alpha',
    name: 'Alpha Centauri A',
    type: 'star',
    class: 'Yellow Dwarf (G2V)',
    radius: 3.6,
    distFromSun: -55,
    color: '#ffc107',
    secondaryColor: '#fd7e14',
    rotationSpeed: 0.003,
    orbitSpeed: 0,
    mass: '2.19 × 10³⁰ kg (1.1 Solar Masses)',
    gravity: '310 m/s²',
    distanceLabel: '4.37 Light Years from Earth',
    orbitalPeriod: 'AB binary orbit (79.9 Earth Years)',
    temperature: '5,520 °C (Surface)',
    moons: 1,
    composition: [
      { name: 'Hydrogen', percentage: 73.4, color: '#3b82f6' },
      { name: 'Helium', percentage: 25.4, color: '#eab308' },
      { name: 'Metals', percentage: 1.2, color: '#10b981' }
    ],
    layers: [
      {
        id: 0,
        title: 'Binary Star Orbit System',
        subtitle: 'Our Nearest Sun-Like Cousin',
        description: 'Alpha Centauri A is the primary component of our nearest stellar system. It is extraordinarily similar to our Sun, making it a prime target for future interstellar travel probes.',
        focusStats: [
          { label: 'Spectral Twin', value: 'G2V Dwarf Sister' },
          { label: 'Primary Companion', value: 'Alpha Centauri B (Spectral K1V)' },
          { label: 'Distance Ratio', value: '1.5x Sun\'s output' }
        ],
        visualSettings: {
          targetZoom: 5.6,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 1,
          ambientIntensity: 0.8
        }
      },
      {
        id: 1,
        title: 'Corona Wind Transport',
        subtitle: 'Solar Twins Mass Exchange',
        description: 'Alpha Centauri A features a coronal structure very similar to our Sun. Periodic coronal mass ejections sweep across the binary sector, occasionally colliding with companion star B\'s outer orbits.',
        focusStats: [
          { label: 'Corona Temp', value: '1,500,000 °C' },
          { label: 'Stellar Wind Mass loss', value: '2 × 10⁻¹⁴ solar mass/yr' },
          { label: 'Activity Cycle', value: 'Approx. 11 Years' }
        ],
        visualSettings: {
          targetZoom: 4.6,
          showAtmosphere: true,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0.4,
          rotationSpeedFactor: 1.3,
          ambientIntensity: 1.0
        }
      },
      {
        id: 2,
        title: 'Chromosphere Radiance',
        subtitle: 'High Metal Concentration (Metallicity)',
        description: 'Alpha Centauri A has a high chemical metallicity (meaning it contains more iron than our Sun). This points to an age slightly older than our solar system, born in a rich stellar dust nursery.',
        focusStats: [
          { label: 'Metallicity [Fe/H]', value: '60% richer than Sun' },
          { label: 'Stellar Radius', value: '1.22 Solar Radii' },
          { label: 'Chromospheric flux', value: 'Calm emitting standard' }
        ],
        visualSettings: {
          targetZoom: 4.2,
          showAtmosphere: false,
          showCrust: true,
          showInternal: false,
          cutawayRotation: 0,
          rotationSpeedFactor: 0.7,
          ambientIntensity: 1.1
        }
      },
      {
        id: 3,
        title: 'Incline Deep Core Slices',
        subtitle: 'Proton-Proton Nucleosynthesis',
        description: 'Just like our Sun, energy at the core is exported outward through the radiative layer, then boils through the active convective mantle. Nuclear fusion convert hydrogen at tremendous rates.',
        focusStats: [
          { label: 'Core Temp', value: '15,600,000 °C' },
          { label: 'Radiative Mass fraction', value: '70%' },
          { label: 'Convective Envelope', value: '30%' }
        ],
        visualSettings: {
          targetZoom: 3.6,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 0.6,
          rotationSpeedFactor: 0.4,
          ambientIntensity: 0.9
        }
      },
      {
        id: 4,
        title: 'System Lifecycle future',
        subtitle: 'Interstellar Probe Destination',
        description: 'Alpha Centauri A is older than our Sun, sitting at 5.5 billion years old. Within 4 billion years, it will expand into a red giant and eject its envelope, creating a spectacular stellar nebula wrapping its carbon core.',
        focusStats: [
          { label: 'System Age', value: 'Approx. 5.5 Billion Years' },
          { label: 'Target Voyage distance', value: '270,000 Astronomical Units' },
          { label: 'Travel Time (0.1c Probe)', value: 'Approx. 43 Years' }
        ],
        visualSettings: {
          targetZoom: 3.2,
          showAtmosphere: false,
          showCrust: false,
          showInternal: true,
          cutawayRotation: 1,
          rotationSpeedFactor: 0.2,
          ambientIntensity: 1.1
        },
        theories: [
          { title: 'The Binary Habitability limits', desc: 'Gravitational math indicates complex orbits within binary systems can warp planet paths. Probes like Breakthrough Starshot are designed to fly pass at relativistic speeds to determine planetary atmospheric profiles and search for liquid water.' }
        ]
      }
    ]
  }
];
