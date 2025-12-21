import styles from './JobCardSkeleton.module.css';

const JobCardSkeleton = () => {
  return (
    <div className={styles.jobCardSkeleton}>
      <div className={styles.logoApplyContainer}>
        <div className={styles.logo}></div>
        <div className={styles.applyButton}></div>
      </div>
      <div className={styles.primaryDetails}>
        <div className={styles.jobTitle}></div>
      </div>
      <div className={styles.location}></div>
      <div className={styles.salary}></div>
    </div>
  );
};

export default JobCardSkeleton;

