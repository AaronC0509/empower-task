type StatusFilter = '' | 'alive' | 'dead' | 'unknown';

interface FilterControlsProps {
  searchValue: string;
  statusValue: StatusFilter;
  statusOptions: Array<{ label: string; value: StatusFilter }>;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
}

export function FilterControls({
  searchValue,
  statusValue,
  statusOptions,
  onSearchChange,
  onStatusChange
}: FilterControlsProps) {
  return (
    <form className="filters-card" onSubmit={(event) => event.preventDefault()}>
      <div className="field-group">
        <label htmlFor="character-search">Search by name</label>
        <input
          id="character-search"
          name="character-search"
          type="search"
          placeholder="Try Rick, Summer, or Morty"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="field-group">
        <label htmlFor="character-status">Filter by status</label>
        <select
          id="character-status"
          name="character-status"
          value={statusValue}
          onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
        >
          {statusOptions.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
