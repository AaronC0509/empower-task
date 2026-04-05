export type CharacterStatus = 'Alive' | 'Dead' | 'Unknown';

export interface Character {
  id: number;
  name: string;
  image: string;
  status: CharacterStatus;
}
