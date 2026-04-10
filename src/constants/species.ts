import { MonsterStats } from '../types';

export interface SpeciesDefinition {
  id: string;
  name: string;
  spriteColor: string;
  lifespan: number; // real days
  baseStats: MonsterStats;
  description: string;
  unlockWins: number; // tournament wins required to unlock
}

export const SPECIES: SpeciesDefinition[] = [
  {
    id: 'golem',
    name: 'Golem',
    spriteColor: '#7C6F5A',
    lifespan: 10,
    baseStats: { life: 80, power: 70, defense: 80, speed: 30, intelligence: 30, skill: 40 },
    description: 'A rocky creature of immense strength. Slow but nearly unbreakable.',
    unlockWins: 0,
  },
  {
    id: 'wyvern',
    name: 'Wyvern',
    spriteColor: '#2E7D32',
    lifespan: 8,
    baseStats: { life: 60, power: 75, defense: 50, speed: 80, intelligence: 50, skill: 60 },
    description: 'A swift aerial predator. Fragile but devastating in quick strikes.',
    unlockWins: 0,
  },
  {
    id: 'fenrir',
    name: 'Fenrir',
    spriteColor: '#1A237E',
    lifespan: 9,
    baseStats: { life: 70, power: 65, defense: 60, speed: 75, intelligence: 60, skill: 55 },
    description: 'A lupine beast that hunts in calculated bursts.',
    unlockWins: 3,
  },
  {
    id: 'basilisk',
    name: 'Basilisk',
    spriteColor: '#4A148C',
    lifespan: 12,
    baseStats: { life: 75, power: 55, defense: 65, speed: 55, intelligence: 90, skill: 75 },
    description: 'An ancient serpent whose cunning surpasses its brawn.',
    unlockWins: 5,
  },
  {
    id: 'titan',
    name: 'Titan',
    spriteColor: '#B71C1C',
    lifespan: 14,
    baseStats: { life: 100, power: 90, defense: 90, speed: 20, intelligence: 40, skill: 30 },
    description: 'A legendary behemoth. Training it is a warden\'s greatest challenge.',
    unlockWins: 10,
  },
];

export function getSpecies(id: string): SpeciesDefinition | undefined {
  return SPECIES.find((s) => s.id === id);
}

export function getUnlockedSpecies(totalWins: number): SpeciesDefinition[] {
  return SPECIES.filter((s) => s.unlockWins <= totalWins);
}
