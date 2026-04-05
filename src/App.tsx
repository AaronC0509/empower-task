import { useDeferredValue, useEffect, useMemo, useState } from 'react';

import { loadCharacters } from './api/characters';
import { CharacterGrid } from './components/CharacterGrid';
import { FilterControls } from './components/FilterControls';
import type { Character } from './types';

type StatusFilter = '' | 'alive' | 'dead' | 'unknown';

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'All statuses', value: '' },
  { label: 'Alive', value: 'alive' },
  { label: 'Dead', value: 'dead' },
  { label: 'Unknown', value: 'unknown' }
];

export default function App() {
  const [searchValue, setSearchValue] = useState('');
  const [statusValue, setStatusValue] = useState<StatusFilter>('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const deferredSearchValue = useDeferredValue(searchValue);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchValue(deferredSearchValue);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [deferredSearchValue]);

  const query = useMemo(
    () => ({
      name: debouncedSearchValue.trim().toLowerCase(),
      status: statusValue
    }),
    [debouncedSearchValue, statusValue]
  );

  useEffect(() => {
    const abortController = new AbortController();
    let active = true;

    const fetchCharacters = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const nextCharacters = await loadCharacters({
          ...query,
          signal: abortController.signal
        });

        if (!active) {
          return;
        }

        setCharacters(Array.isArray(nextCharacters) ? nextCharacters : []);
      } catch (error) {
        if (!active) {
          return;
        }

        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setCharacters([]);
        setErrorMessage(error instanceof Error ? error.message : 'Unexpected error loading data.');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchCharacters();

    return () => {
      active = false;
      abortController.abort();
    };
  }, [query]);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <div>
            <h1>Rick and Morty Explorer</h1>
            <p className="hero-text">
              Simple application that using Rick and Morty API
            </p>
          </div>
          <div className="hero-stat-card">
            <span className="hero-stat-label">No of characters found</span>
            <strong>{characters.length}</strong>
            <span className="hero-stat-detail">
              {query.name || query.status ? 'Current filter applied' : 'Initial directory'}
            </span>
          </div>
        </div>
      </section>

      <section className="content-panel">
        <FilterControls
          searchValue={searchValue}
          statusValue={statusValue}
          statusOptions={statusOptions}
          onSearchChange={setSearchValue}
          onStatusChange={(value) => setStatusValue(value)}
        />

        {isLoading ? <p className="status-banner">Loading characters...</p> : null}

        {errorMessage ? (
          <p className="status-banner error-banner" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {!isLoading && !errorMessage && characters.length === 0 ? (
          <p className="status-banner empty-banner">No characters matched the current filters.</p>
        ) : null}

        {!errorMessage && characters.length > 0 ? <CharacterGrid characters={characters} /> : null}
      </section>
    </main>
  );
}
