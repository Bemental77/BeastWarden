import { Tournament } from '../types';

export const TOURNAMENTS: Tournament[] = [
  {
    id: 'bronze',
    name: 'Bronze Cup',
    tier: 1,
    opponents: [
      {
        name: 'Dustpaw',
        species: 'golem',
        spriteColor: '#9E9E9E',
        stats: { life: 50, power: 40, defense: 40, speed: 30, intelligence: 20, skill: 20 },
      },
      {
        name: 'Gravel',
        species: 'golem',
        spriteColor: '#795548',
        stats: { life: 55, power: 45, defense: 45, speed: 25, intelligence: 25, skill: 25 },
      },
      {
        name: 'Rimrock',
        species: 'golem',
        spriteColor: '#607D8B',
        stats: { life: 60, power: 50, defense: 50, speed: 30, intelligence: 30, skill: 30 },
      },
    ],
  },
  {
    id: 'silver',
    name: 'Silver Cup',
    tier: 2,
    opponents: [
      {
        name: 'Vex',
        species: 'wyvern',
        spriteColor: '#388E3C',
        stats: { life: 60, power: 60, defense: 45, speed: 70, intelligence: 40, skill: 50 },
      },
      {
        name: 'Shriek',
        species: 'wyvern',
        spriteColor: '#1B5E20',
        stats: { life: 65, power: 65, defense: 50, speed: 72, intelligence: 45, skill: 55 },
      },
      {
        name: 'Fangmaw',
        species: 'fenrir',
        spriteColor: '#283593',
        stats: { life: 70, power: 65, defense: 55, speed: 70, intelligence: 55, skill: 50 },
      },
    ],
    statRequirement: { power: 50 },
  },
  {
    id: 'gold',
    name: 'Gold Cup',
    tier: 3,
    opponents: [
      {
        name: 'Hexbane',
        species: 'basilisk',
        spriteColor: '#4527A0',
        stats: { life: 80, power: 65, defense: 70, speed: 60, intelligence: 85, skill: 80 },
      },
      {
        name: 'Mordecai',
        species: 'basilisk',
        spriteColor: '#311B92',
        stats: { life: 85, power: 70, defense: 75, speed: 65, intelligence: 90, skill: 85 },
      },
      {
        name: 'IRONWALL',
        species: 'titan',
        spriteColor: '#B71C1C',
        stats: { life: 120, power: 100, defense: 100, speed: 25, intelligence: 50, skill: 40 },
      },
    ],
    statRequirement: { power: 75, speed: 60 },
  },
];
