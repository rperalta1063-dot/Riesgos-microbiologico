import { Country } from '../types';

export const COUNTRY_GROUPS: { group: string; countries: Country[] }[] = [
  {
    group: 'América del Norte',
    countries: [
      { id: 'mx', flag: '🇲🇽', name: 'México', sub: 'América del Norte', pop: 130000000, vsl: 2200000, costHosp: 5500, costAmb: 120, costAbs: 85, servings: 52 },
      { id: 'us', flag: '🇺🇸', name: 'EE.UU.', sub: 'América del Norte', pop: 335000000, vsl: 12500000, costHosp: 25000, costAmb: 550, costAbs: 380, servings: 52 },
      { id: 'ca', flag: '🇨🇦', name: 'Canadá', sub: 'América del Norte', pop: 38900000, vsl: 8500000, costHosp: 12000, costAmb: 280, costAbs: 220, servings: 52 },
      { id: 'jm', flag: '🇯🇲', name: 'Jamaica', sub: 'Caribe', pop: 2800000, vsl: 1200000, costHosp: 2500, costAmb: 65, costAbs: 45, servings: 52 },
      { id: 'bz', flag: '🇧🇿', name: 'Belice', sub: 'América Central', pop: 410000, vsl: 850000, costHosp: 1800, costAmb: 45, costAbs: 32, servings: 52 },
    ]
  },
  {
    group: 'América Central y Caribe',
    countries: [
      { id: 'gt', flag: '🇬🇹', name: 'Guatemala', sub: 'América Central', pop: 17600000, vsl: 680000, costHosp: 1400, costAmb: 35, costAbs: 22, servings: 52 },
      { id: 'hn', flag: '🇭🇳', name: 'Honduras', sub: 'América Central', pop: 10400000, vsl: 550000, costHosp: 1100, costAmb: 30, costAbs: 18, servings: 52 },
      { id: 'sv', flag: '🇸🇻', name: 'El Salvador', sub: 'América Central', pop: 6300000, vsl: 720000, costHosp: 1300, costAmb: 40, costAbs: 25, servings: 52 },
      { id: 'ni', flag: '🇳🇮', name: 'Nicaragua', sub: 'América Central', pop: 6700000, vsl: 450000, costHosp: 950, costAmb: 20, costAbs: 12, servings: 52 },
      { id: 'cr', flag: '🇨🇷', name: 'Costa Rica', sub: 'América Central', pop: 5200000, vsl: 2600000, costHosp: 4800, costAmb: 140, costAbs: 110, servings: 52 },
      { id: 'pa', flag: '🇵🇦', name: 'Panamá', sub: 'América Central', pop: 4400000, vsl: 3200000, costHosp: 5500, costAmb: 160, costAbs: 125, servings: 52 },
      { id: 'cu', flag: '🇨🇺', name: 'Cuba', sub: 'Caribe', pop: 11300000, vsl: 650000, costHosp: 900, costAmb: 15, costAbs: 10, servings: 52 },
      { id: 'do', flag: '🇩🇴', name: 'Rep. Dominicana', sub: 'Caribe', pop: 11000000, vsl: 1600000, costHosp: 3200, costAmb: 85, costAbs: 60, servings: 52 },
      { id: 'ht', flag: '🇭🇹', name: 'Haití', sub: 'Caribe', pop: 11700000, vsl: 250000, costHosp: 550, costAmb: 12, costAbs: 8, servings: 52 },
      { id: 'pr', flag: '🇵🇷', name: 'Puerto Rico', sub: 'Caribe', pop: 3200000, vsl: 8500000, costHosp: 18000, costAmb: 450, costAbs: 320, servings: 52 },
      { id: 'bs', flag: '🇧🇸', name: 'Bahamas', sub: 'Caribe', pop: 410000, vsl: 5200000, costHosp: 9500, costAmb: 280, costAbs: 220, servings: 52 },
      { id: 'tt', flag: '🇹🇹', name: 'Trinidad y Tobago', sub: 'Caribe', pop: 1400000, vsl: 2800000, costHosp: 4500, costAmb: 110, costAbs: 85, servings: 52 },
      { id: 'bb', flag: '🇧🇧', name: 'Barbados', sub: 'Caribe', pop: 282000, vsl: 3200000, costHosp: 5200, costAmb: 125, costAbs: 95, servings: 52 },
    ]
  },
  {
    group: 'América del Sur',
    countries: [
      { id: 'co', flag: '🇨🇴', name: 'Colombia', sub: 'América del Sur', pop: 52000000, vsl: 1600000, costHosp: 3500, costAmb: 85, costAbs: 55, servings: 52 },
      { id: 've', flag: '🇻🇪', name: 'Venezuela', sub: 'América del Sur', pop: 28000000, vsl: 720000, costHosp: 1100, costAmb: 20, costAbs: 12, servings: 52 },
      { id: 'ec', flag: '🇪🇨', name: 'Ecuador', sub: 'América del Sur', pop: 18000000, vsl: 1100000, costHosp: 2200, costAmb: 55, costAbs: 38, servings: 52 },
      { id: 'pe', flag: '🇵🇪', name: 'Perú', sub: 'América del Sur', pop: 33000000, vsl: 1400000, costHosp: 2800, costAmb: 70, costAbs: 45, servings: 52 },
      { id: 'bo', flag: '🇧🇴', name: 'Bolivia', sub: 'América del Sur', pop: 12000000, vsl: 850000, costHosp: 1600, costAmb: 35, costAbs: 22, servings: 52 },
      { id: 'cl', flag: '🇨🇱', name: 'Chile', sub: 'América del Sur', pop: 19500000, vsl: 4200000, costHosp: 7500, costAmb: 180, costAbs: 140, servings: 52 },
      { id: 'ar', flag: '🇦🇷', name: 'Argentina', sub: 'América del Sur', pop: 46000000, vsl: 2500000, costHosp: 4800, costAmb: 120, costAbs: 85, servings: 52 },
      { id: 'py', flag: '🇵🇾', name: 'Paraguay', sub: 'América del Sur', pop: 7500000, vsl: 980000, costHosp: 1800, costAmb: 42, costAbs: 28, servings: 52 },
      { id: 'uy', flag: '🇺🇾', name: 'Uruguay', sub: 'América del Sur', pop: 3500000, vsl: 3600000, costHosp: 6200, costAmb: 150, costAbs: 115, servings: 52 },
      { id: 'br', flag: '🇧🇷', name: 'Brasil', sub: 'América del Sur', pop: 215000000, vsl: 2500000, costHosp: 4500, costAmb: 105, costAbs: 75, servings: 52 },
      { id: 'gy', flag: '🇬🇾', name: 'Guyana', sub: 'América del Sur', pop: 810000, vsl: 1200000, costHosp: 2100, costAmb: 45, costAbs: 32, servings: 52 },
      { id: 'sr', flag: '🇸🇷', name: 'Surinam', sub: 'América del Sur', pop: 620000, vsl: 1100000, costHosp: 1900, costAmb: 40, costAbs: 28, servings: 52 },
    ]
  },
  {
    group: 'Europa',
    countries: [
      { id: 'es', flag: '🇪🇸', name: 'España', sub: 'Europa', pop: 48000000, vsl: 4800000, costHosp: 8500, costAmb: 180, costAbs: 150, servings: 52 },
      { id: 'de', flag: '🇩🇪', name: 'Alemania', sub: 'Europa', pop: 84000000, vsl: 5500000, costHosp: 9500, costAmb: 220, costAbs: 180, servings: 52 },
      { id: 'fr', flag: '🇫🇷', name: 'Francia', sub: 'Europa', pop: 68000000, vsl: 5200000, costHosp: 9200, costAmb: 210, costAbs: 175, servings: 52 },
      { id: 'gb', flag: '🇬🇧', name: 'Reino Unido', sub: 'Europa', pop: 67000000, vsl: 4500000, costHosp: 8000, costAmb: 190, costAbs: 160, servings: 52 },
      { id: 'it', flag: '🇮🇹', name: 'Italia', sub: 'Europa', pop: 59000000, vsl: 4200000, costHosp: 7800, costAmb: 180, costAbs: 150, servings: 52 },
      { id: 'pt', flag: '🇵🇹', name: 'Portugal', sub: 'Europa', pop: 10300000, vsl: 3200000, costHosp: 5500, costAmb: 130, costAbs: 110, servings: 52 },
      { id: 'nl', flag: '🇳🇱', name: 'Países Bajos', sub: 'Europa', pop: 17500000, vsl: 5800000, costHosp: 11000, costAmb: 250, costAbs: 210, servings: 52 },
      { id: 'ch', flag: '🇨🇭', name: 'Suiza', sub: 'Europa', pop: 8800000, vsl: 9500000, costHosp: 18000, costAmb: 420, costAbs: 350, servings: 52 },
      { id: 'se', flag: '🇸🇪', name: 'Suecia', sub: 'Europa', pop: 10500000, vsl: 5600000, costHosp: 10500, costAmb: 240, costAbs: 200, servings: 52 },
      { id: 'no', flag: '🇳🇴', name: 'Noruega', sub: 'Europa', pop: 5500000, vsl: 8500000, costHosp: 15000, costAmb: 320, costAbs: 270, servings: 52 },
      { id: 'dk', flag: '🇩🇰', name: 'Dinamarca', sub: 'Europa', pop: 5900000, vsl: 6200000, costHosp: 12000, costAmb: 260, costAbs: 220, servings: 52 },
      { id: 'be', flag: '🇧🇪', name: 'Bélgica', sub: 'Europa', pop: 11700000, vsl: 4800000, costHosp: 8800, costAmb: 195, costAbs: 165, servings: 52 },
      { id: 'gr', flag: '🇬🇷', name: 'Grecia', sub: 'Europa', pop: 10400000, vsl: 2500000, costHosp: 4200, costAmb: 95, costAbs: 80, servings: 52 },
      { id: 'ie', flag: '🇮🇪', name: 'Irlanda', sub: 'Europa', pop: 5200000, vsl: 6800000, costHosp: 12500, costAmb: 290, costAbs: 240, servings: 52 },
      { id: 'pl', flag: '🇵🇱', name: 'Polonia', sub: 'Europa', pop: 38000000, vsl: 2200000, costHosp: 3500, costAmb: 85, costAbs: 65, servings: 52 },
      { id: 'at', flag: '🇦🇹', name: 'Austria', sub: 'Europa', pop: 9000000, vsl: 5200000, costHosp: 8800, costAmb: 210, costAbs: 175, servings: 52 },
      { id: 'fi', flag: '🇫🇮', name: 'Finlandia', sub: 'Europa', pop: 5500000, vsl: 5400000, costHosp: 9200, costAmb: 220, costAbs: 180, servings: 52 },
    ]
  },
  {
    group: 'África y Medio Oriente',
    countries: [
      { id: 'ng', flag: '🇳🇬', name: 'Nigeria', sub: 'África Occidental', pop: 220000000, vsl: 750000, costHosp: 1600, costAmb: 40, costAbs: 25, servings: 52 },
      { id: 'et', flag: '🇪🇹', name: 'Etiopía', sub: 'África Oriental', pop: 126000000, vsl: 380000, costHosp: 700, costAmb: 15, costAbs: 10, servings: 52 },
      { id: 'za', flag: '🇿🇦', name: 'Sudáfrica', sub: 'África Austral', pop: 60000000, vsl: 2100000, costHosp: 3800, costAmb: 95, costAbs: 70, servings: 52 },
      { id: 'eg', flag: '🇪🇬', name: 'Egipto', sub: 'África del Norte', pop: 110000000, vsl: 1200000, costHosp: 1900, costAmb: 50, costAbs: 35, servings: 52 },
      { id: 'ma', flag: '🇲🇦', name: 'Marruecos', sub: 'África del Norte', pop: 37000000, vsl: 1400000, costHosp: 2200, costAmb: 60, costAbs: 45, servings: 52 },
      { id: 'tr', flag: '🇹🇷', name: 'Turquía', sub: 'Medio Oriente', pop: 85000000, vsl: 2500000, costHosp: 4500, costAmb: 110, costAbs: 85, servings: 52 },
      { id: 'il', flag: '🇮🇱', name: 'Israel', sub: 'Medio Oriente', pop: 9500000, vsl: 5200000, costHosp: 8800, costAmb: 195, costAbs: 170, servings: 52 },
      { id: 'sa', flag: '🇸🇦', name: 'Arabia Saudita', sub: 'Medio Oriente', pop: 36000000, vsl: 3800000, costHosp: 7500, costAmb: 170, costAbs: 140, servings: 52 },
      { id: 'ae', flag: '🇦🇪', name: 'EUA', sub: 'Medio Oriente', pop: 9500000, vsl: 6800000, costHosp: 12000, costAmb: 280, costAbs: 240, servings: 52 },
      { id: 'ke', flag: '🇰🇪', name: 'Kenia', sub: 'África Oriental', pop: 55000000, vsl: 520000, costHosp: 1100, costAmb: 25, costAbs: 18, servings: 52 },
      { id: 'dz', flag: '🇩🇿', name: 'Argelia', sub: 'África del Norte', pop: 45000000, vsl: 1300000, costHosp: 2100, costAmb: 55, costAbs: 40, servings: 52 },
      { id: 'gh', flag: '🇬🇭', name: 'Ghana', sub: 'África Occidental', pop: 33000000, vsl: 850000, costHosp: 1400, costAmb: 35, costAbs: 22, servings: 52 },
      { id: 'ao', flag: '🇦🇴', name: 'Angola', sub: 'África Austral', pop: 35000000, vsl: 750000, costHosp: 1200, costAmb: 30, costAbs: 20, servings: 52 },
    ]
  },
  {
    group: 'Asia y Oceanía',
    countries: [
      { id: 'in', flag: '🇮🇳', name: 'India', sub: 'Asia Meridional', pop: 1430000000, vsl: 1100000, costHosp: 2100, costAmb: 50, costAbs: 35, servings: 104 },
      { id: 'cn', flag: '🇨🇳', name: 'China', sub: 'Asia Oriental', pop: 1410000000, vsl: 3200000, costHosp: 5800, costAmb: 140, costAbs: 110, servings: 104 },
      { id: 'jp', flag: '🇯🇵', name: 'Japón', sub: 'Asia Oriental', pop: 125000000, vsl: 5800000, costHosp: 9500, costAmb: 210, costAbs: 180, servings: 52 },
      { id: 'kr', flag: '🇰🇷', name: 'Corea del Sur', sub: 'Asia Oriental', pop: 51500000, vsl: 4500000, costHosp: 7500, costAmb: 175, costAbs: 150, servings: 52 },
      { id: 'id', flag: '🇮🇩', name: 'Indonesia', sub: 'Asia Sudoriental', pop: 275000000, vsl: 1100000, costHosp: 2200, costAmb: 55, costAbs: 40, servings: 52 },
      { id: 'ph', flag: '🇵🇭', name: 'Filipinas', sub: 'Asia Sudoriental', pop: 115000000, vsl: 950000, costHosp: 1800, costAmb: 45, costAbs: 32, servings: 52 },
      { id: 'au', flag: '🇦🇺', name: 'Australia', sub: 'Oceanía', pop: 26000000, vsl: 7500000, costHosp: 12500, costAmb: 290, costAbs: 240, servings: 52 },
      { id: 'nz', flag: '🇳🇿', name: 'Nueva Zelanda', sub: 'Oceanía', pop: 5100000, vsl: 5800000, costHosp: 9200, costAmb: 210, costAbs: 180, servings: 52 },
      { id: 'th', flag: '🇹🇭', name: 'Tailandia', sub: 'Asia Sudoriental', pop: 71000000, vsl: 2500000, costHosp: 3800, costAmb: 90, costAbs: 65, servings: 52 },
      { id: 'vn', flag: '🇻🇳', name: 'Vietnam', sub: 'Asia Sudoriental', pop: 98000000, vsl: 1800000, costHosp: 2800, costAmb: 70, costAbs: 50, servings: 52 },
      { id: 'sg', flag: '🇸🇬', name: 'Singapur', sub: 'Asia Sudoriental', pop: 5900000, vsl: 9800000, costHosp: 15000, costAmb: 350, costAbs: 300, servings: 52 },
      { id: 'my', flag: '🇲🇾', name: 'Malasia', sub: 'Asia Sudoriental', pop: 33000000, vsl: 2800000, costHosp: 4200, costAmb: 115, costAbs: 85, servings: 52 },
      { id: 'pk', flag: '🇵🇰', name: 'Pakistán', sub: 'Asia Meridional', pop: 235000000, vsl: 650000, costHosp: 1200, costAmb: 30, costAbs: 20, servings: 52 },
      { id: 'bd', flag: '🇧🇩', name: 'Bangladesh', sub: 'Asia Meridional', pop: 170000000, vsl: 580000, costHosp: 1100, costAmb: 25, costAbs: 15, servings: 52 },
      { id: 'tw', flag: '🇹🇼', name: 'Taiwán', sub: 'Asia Oriental', pop: 235000000, vsl: 5200000, costHosp: 8500, costAmb: 195, costAbs: 165, servings: 52 },
    ]
  },
];

export const COUNTRIES = COUNTRY_GROUPS.flatMap(g => g.countries);
