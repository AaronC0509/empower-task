import { loadCharacters } from './characters';

describe('loadCharacters', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests filtered characters and maps the API response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        results: [
          {
            id: 7,
            name: 'Abradolf Lincler',
            image: 'https://example.com/abradolf.png',
            status: 'unknown'
          }
        ]
      })
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      loadCharacters({
        name: 'ab',
        status: 'unknown'
      })
    ).resolves.toEqual([
      {
        id: 7,
        name: 'Abradolf Lincler',
        image: 'https://example.com/abradolf.png',
        status: 'Unknown'
      }
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character?name=ab&status=unknown',
      expect.objectContaining({
        signal: undefined
      })
    );
  });

  it('returns an empty array when the API reports no matching characters', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404
      })
    );

    await expect(loadCharacters({ name: 'nobody', status: '' })).resolves.toEqual([]);
  });

  it('throws a readable error for other failed responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500
      })
    );

    await expect(loadCharacters({ name: '', status: '' })).rejects.toThrow(
      /unable to load characters/i
    );
  });
});
