import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.message}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.button}>
            Go to Job Listings
          </Link>
          <Link to="/my-jobs" className={styles.buttonSecondary}>
            View My Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

