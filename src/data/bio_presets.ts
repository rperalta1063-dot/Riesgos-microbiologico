
export interface BioPreset {
  id: string;
  name: string;
  pathogen: string;
  drModel: 'beta-poisson' | 'exponential';
  alpha?: number;
  beta?: number;
  k?: number;
  illnessProb: number;
  hospRate: number;
  mortalityRate: number;
  source: string;
}

export const BIO_PRESETS: BioPreset[] = [
  {
    id: 'sal_who',
    name: 'Salmonella (FAO/WHO)',
    pathogen: 'Salmonella spp.',
    drModel: 'beta-poisson',
    alpha: 0.3126,
    beta: 2885,
    illnessProb: 0.25,
    hospRate: 0.18,
    mortalityRate: 0.002,
    source: 'FAO/WHO MRA 2'
  },
  {
    id: 'sal_fda',
    name: 'Salmonella (FDA-iRISK)',
    pathogen: 'Salmonella spp.',
    drModel: 'beta-poisson',
    alpha: 0.132,
    beta: 51.45,
    illnessProb: 0.30,
    hospRate: 0.22,
    mortalityRate: 0.003,
    source: 'FDA-iRISK 4.0'
  },
  {
    id: 'cam_who',
    name: 'Campylobacter (FAO/WHO)',
    pathogen: 'Campylobacter jejuni',
    drModel: 'beta-poisson',
    alpha: 0.145,
    beta: 7.59,
    illnessProb: 0.33,
    hospRate: 0.05,
    mortalityRate: 0.0001,
    source: 'FAO/WHO MRA 4'
  },
  {
    id: 'lis_efsa',
    name: 'Listeria (EFSA)',
    pathogen: 'Listeria monocytogenes',
    drModel: 'exponential',
    k: 1.06e-12,
    illnessProb: 0.15,
    hospRate: 0.91,
    mortalityRate: 0.18,
    source: 'EFSA Scientific Opinion'
  },
  {
    id: 'lis_who',
    name: 'Listeria (WHO Susceptible)',
    pathogen: 'Listeria monocytogenes',
    drModel: 'exponential',
    k: 1.06e-10,
    illnessProb: 0.18,
    hospRate: 0.95,
    mortalityRate: 0.25,
    source: 'FAO/WHO MRA 19'
  },
  {
    id: 'eco_who',
    name: 'STEC O157:H7 (WHO)',
    pathogen: 'E. coli O157:H7 (STEC)',
    drModel: 'beta-poisson',
    alpha: 0.22,
    beta: 560000,
    illnessProb: 0.40,
    hospRate: 0.24,
    mortalityRate: 0.008,
    source: 'FAO/WHO MRA 36'
  },
  {
    id: 'noro_who',
    name: 'Norovirus (WHO)',
    pathogen: 'Norovirus (GI y GII)',
    drModel: 'beta-poisson',
    alpha: 0.04,
    beta: 0.055,
    illnessProb: 0.65,
    hospRate: 0.01,
    mortalityRate: 0.00005,
    source: 'FAO/WHO MRA 26'
  }
];
