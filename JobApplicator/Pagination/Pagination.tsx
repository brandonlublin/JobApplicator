import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={styles.pagination}>
      <button onClick={handlePrev} disabled={currentPage === 1} className={styles.arrow}>
        &#8592; Prev
      </button>
      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={handleNext} disabled={currentPage === totalPages} className={styles.arrow}>
        Next &#8594;
      </button>
    </div>
  );
};

export default Pagination;
