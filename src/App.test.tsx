import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';
import { loadCharacters } from './api/characters';

vi.mock('./api/characters', () => ({
  loadCharacters: vi.fn()
}));

const mockedLoadCharacters = vi.mocked(loadCharacters);

describe('App', () => {
  beforeEach(() => {
    mockedLoadCharacters.mockReset();
  });

  it('loads and displays characters, then refetches when search and status change', async () => {
    mockedLoadCharacters
      .mockResolvedValueOnce([
        {
          id: 1,
          name: 'Rick Sanchez',
          image: 'https://example.com/rick.png',
          status: 'Alive'
        },
        {
          id: 2,
          name: 'Birdperson',
          image: 'https://example.com/birdperson.png',
          status: 'Dead'
        }
      ])
      .mockResolvedValueOnce([
        {
          id: 1,
          name: 'Rick Sanchez',
          image: 'https://example.com/rick.png',
          status: 'Alive'
        }
      ])
      .mockResolvedValueOnce([
        {
          id: 1,
          name: 'Rick Sanchez',
          image: 'https://example.com/rick.png',
          status: 'Alive'
        }
      ]);

    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText(/loading characters/i)).toBeInTheDocument();

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Birdperson')).toBeInTheDocument();
    expect(mockedLoadCharacters).toHaveBeenCalledWith({
      name: '',
      status: '',
      signal: expect.any(AbortSignal)
    });

    await user.type(screen.getByLabelText(/search by name/i), 'rick');

    await waitFor(() =>
      expect(mockedLoadCharacters).toHaveBeenLastCalledWith({
        name: 'rick',
        status: '',
        signal: expect.any(AbortSignal)
      })
    );

    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'alive');

    await waitFor(() =>
      expect(mockedLoadCharacters).toHaveBeenLastCalledWith({
        name: 'rick',
        status: 'alive',
        signal: expect.any(AbortSignal)
      })
    );
  });

  it('renders an error state when the API request fails', async () => {
    mockedLoadCharacters.mockRejectedValueOnce(new Error('API unavailable'));

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/api unavailable/i);
  });
});
