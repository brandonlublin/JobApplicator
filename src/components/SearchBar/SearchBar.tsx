import styles from './SearchBar.module.css';

interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  onSearch: () => void;
}

const SearchBar = ({ query, setQuery, onSearch }: SearchBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        className={styles.searchInput}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for jobs"
      />
      <button className={styles.searchButton} onClick={onSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;

