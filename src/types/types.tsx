export type PlanetProps = {
  name: string,
  rotation_period: string,
  orbital_period: string,
  diameter: string,
  climate: string,
  gravity: string,
  terrain: string,
  surface_water: string,
  population: string,
  films: string [],
  created: string,
  edited: string,
  url: string
};

export type PlanetKey = 'population' | 'orbital_period' | 'diameter'
| 'rotation_period' | 'surface_water';
