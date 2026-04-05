import type { Character } from '../types';

interface CharacterGridProps {
  characters: Character[];
}

export function CharacterGrid({ characters }: CharacterGridProps) {
  return (
    <ul className="character-grid">
      {characters.map((character) => (
        <li className="character-card" key={character.id}>
          <img className="character-image" src={character.image} alt={character.name} />
          <div className="character-card-body">
            <span className={`status-pill status-${character.status.toLowerCase()}`}>
              {character.status}
            </span>
            <h2>{character.name}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}
