import React from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch }) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        className={styles.searchInput}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for jobs"
      />
      <button className={styles.searchButton} onClick={onSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
