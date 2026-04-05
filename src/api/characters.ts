import type { Character, CharacterStatus } from '../types';

const CHARACTERS_ENDPOINT = 'https://rickandmortyapi.com/api/character';

interface CharacterFilters {
  name: string;
  status: string;
  signal?: AbortSignal;
}

interface RickAndMortyCharacter {
  id: number;
  name: string;
  image: string;
  status: string;
}

interface RickAndMortyResponse {
  results: RickAndMortyCharacter[];
}

const normalizeStatus = (status: string): CharacterStatus => {
  switch (status.toLowerCase()) {
    case 'alive':
      return 'Alive';
    case 'dead':
      return 'Dead';
    default:
      return 'Unknown';
  }
};

const mapCharacter = (character: RickAndMortyCharacter): Character => ({
  id: character.id,
  name: character.name,
  image: character.image,
  status: normalizeStatus(character.status)
});

export const loadCharacters = async ({
  name,
  status,
  signal
}: CharacterFilters): Promise<Character[]> => {
  const query = new URLSearchParams();

  if (name) {
    query.set('name', name);
  }

  if (status) {
    query.set('status', status);
  }

  const url = query.size > 0 ? `${CHARACTERS_ENDPOINT}?${query.toString()}` : CHARACTERS_ENDPOINT;
  const response = await fetch(url, { signal });

  if (response.ok) {
    const data = (await response.json()) as RickAndMortyResponse;
    return data.results.map(mapCharacter);
  }

  if (response.status === 404) {
    return [];
  }

  throw new Error('Unable to load characters right now.');
};
