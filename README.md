## What I Implemented

I have proceed to go for option A for this task.

The repo now includes:

- A React functional component web app that loads Rick and Morty characters from the public API.
- Search by name and filter by status.
- Loading, empty, and error states.
- Task 2 written my own guidance for how to build the same app in Flutter.
- Task 3 code answers for the utility functions plus the written SQL and performance answers.
- Tests for the API client, utility functions, and core app behavior.

Key files:

- `src/App.tsx`
- `src/components/FilterControls.tsx`
- `src/components/CharacterGrid.tsx`
- `src/api/characters.ts`
- `src/lib/task3.ts`

## My Plan Approach

### Task 1: React App

I split the React solution into a thin data layer plus focused UI components:

- `src/api/characters.ts` owns remote fetching and response normalization.
- `src/App.tsx` owns search/filter state, request lifecycles, and loading/error handling.
- `src/components/*` owns the presentation layer.

The API client is intentionally small and predictable:

- It accepts the current UI filters: `name`, `status`, and an optional `AbortSignal`.
- It builds the Rick and Morty API query string only from active filters.
- It maps the external API response into the repo’s shared `Character` shape from `src/types.ts`.
- It normalizes API statuses into the app-level union: `Alive | Dead | Unknown`.
- It treats HTTP `404` as "no matching characters" and returns an empty array.
- It throws a readable error for other failed HTTP responses.

On the frontend, I used:

- React functional components only.
- Accessible labels for the search and status controls.
- A deferred and debounced search flow so typing does not constantly trigger unnecessary fetches.
- A small component split to keep the UI readable and maintainable.

This keeps the app easy to reason about while still handling the user-facing states the brief asked for.

### Task 3 Utilities

I kept both utility functions dependency-free and easy to read, it's currently located at `src/lib/task3.ts`:

- `sortNumbersAscending` uses insertion sort on a copied array, which satisfies the requirement to avoid the built-in `sort()` method and preserves the original input.
- `findLongestWord` extracts words while ignoring punctuation, then returns the longest match or an empty string for blank input.

## Tradeoffs

- I did not add a heavier data-fetching library such as React Query. For this task, a thin `fetch` wrapper keeps the dependency surface smaller and the behavior explicit.
- The sort implementation is insertion sort, which is simple and correct for the task, but not the best choice for very large arrays.
- The API client focuses on the current app needs. If the app grew, I would likely add request retries, richer error typing, response validation, and pagination support.

## What I Would Improve With More Time

- Add API response validation with a schema library to harden the client against malformed payloads.
- Add integration tests around the React data flow once the UI layer is finalized.
- Support pagination from the Rick and Morty API instead of loading only a single filtered page.
- Introduce request caching and stale-response protection patterns if the app becomes more interactive.
- Expand utility test coverage with more edge cases such as ties, apostrophes, and already-sorted arrays.

## Run The Project

```bash
npm install
npm run dev
```

Verification commands used for this task:

```bash
npm run test:run
npm run build
```

## Task 2 Full Details

### Recommended Project Structure

I would keep Flutter split by feature plus a small shared core:

```text
lib/
  main.dart
  app/
    app.dart
    routes.dart
  core/
    constants/
      api_constants.dart
    network/
      api_client.dart
    error/
      app_exception.dart
  features/
    characters/
      data/
        models/
          character_dto.dart
        repositories/
          character_repository_impl.dart
        sources/
          character_remote_data_source.dart
      domain/
        entities/
          character.dart
        repositories/
          character_repository.dart
      presentation/
        controllers/
          character_list_controller.dart
        screens/
          character_list_screen.dart
        widgets/
          character_card.dart
          character_filters.dart
```

This structure keeps API models, business entities, and presentation concerns separate. It also makes the app easier to test because the UI depends on abstractions instead of raw HTTP code.

### State Management Approach

I would use `flutter_riverpod`.

The reason that I will use `flutter_riverpod`:

- Async loading, error, and success states are first-class.
- Providers are easy to test in isolation.
- Search text and status filters can be modeled cleanly as provider state.
- It scales well from a small task app to a larger production app.

Recommended flow:

1. A `StateProvider<String>` holds the current search text.
2. A `StateProvider<String>` holds the selected status filter.
3. A `FutureProvider.autoDispose` or `AsyncNotifier` loads characters from the repository whenever those filters change.
4. The UI watches the provider and renders loading, error, or data states.

This mirrors the React version conceptually: the screen owns filter state, and a dedicated data layer owns remote fetching.

### API Handling

I would keep API access behind a repository:

- `CharacterRemoteDataSource` performs the HTTP request.
- `CharacterRepository` converts DTOs into domain entities.
- The presentation layer only depends on repository output.

Implementation details:

- Use `Dio` if I want better interceptors, cancellation, and future extensibility.
- Use `http` if I want the smallest possible dependency set.
- Map the Rick and Morty JSON into a typed DTO, then into a domain `Character`.
- Treat `404` as an empty list, just like the React version.
- Surface all other failures as domain-friendly exceptions/messages.

Example request flow:

1. User changes search text or status.
2. Provider invalidates and requests fresh data.
3. Repository calls remote data source with query params.
4. Response is parsed and normalized.
5. UI rebuilds from `AsyncValue<List<Character>>`.

## Task 3 Details

If the product list has 10,000+ items, the main goal is to make filtering a derived computation that only runs when its true inputs change.

Recommended approach:

1. Keep the raw product list stable.
   Do not recreate the full array on every render if the data has not changed.

2. Normalize the search input once.
   For example, trim and lowercase the query before filtering.

3. Use memoization for the filtered result.
   Example: compute `filteredProducts` with `useMemo` using only `[products, normalizedQuery, selectedStatus]` as dependencies.
   That prevents unrelated re-renders from re-running the expensive filter.

4. Defer urgent typing from expensive rendering.
   Use `useDeferredValue` so the input stays responsive while React renders the filtered list.

5. Debounce network-backed or very expensive searches.
   If filtering triggers API requests or expensive preprocessing, debounce the query update.

6. Render fewer DOM nodes.
   Use virtualization such as `react-window` so the browser only renders visible rows.

7. Move heavier preprocessing out of render.
   If matching logic is expensive, pre-index searchable fields once when data loads instead of recalculating them during every filter pass.

The key idea is that filtering should be recalculated only when the dataset or the actual filter inputs change, not on every parent render.

## Task 3: SQL Query

```sql
SELECT
  c.customer_id AS CustomerID,
  c.customer_name AS CustomerName,
  COALESCE(SUM(o.total_amount), 0) AS TotalAmount
FROM Customers AS c
LEFT JOIN Orders AS o
  ON o.customer_id = c.customer_id
GROUP BY
  c.customer_id,
  c.customer_name
ORDER BY
  c.customer_id;
```
