import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className={styles.icon}>
        {theme === 'light' ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3V1M10 19V17M17 10H19M1 10H3M15.657 15.657L17.071 17.071M2.929 2.929L4.343 4.343M15.657 4.343L17.071 2.929M2.929 17.071L4.343 15.657M14 10C14 12.2091 12.2091 14 10 14C7.79086 14 6 12.2091 6 10C6 7.79086 7.79086 6 10 6C12.2091 6 14 7.79086 14 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.293 13.293C16.3785 14.2075 15.3052 14.9146 14.1266 15.4144C12.948 15.9142 11.6875 16.2 10.4142 16.2583C9.1409 16.3166 7.87752 16.1464 6.69078 15.7574C5.50404 15.3684 4.41482 14.7681 3.5 13.8533C2.58518 12.9385 1.98493 11.8493 1.59593 10.6625C1.20693 9.47578 1.03672 8.21241 1.09505 6.93908C1.15338 5.66575 1.43916 4.40525 1.93896 3.22666C2.43876 2.04807 3.14586 0.974805 4.06036 0.0603047C4.97486 -0.854195 6.06408 -1.45445 7.25082 -1.84345C8.43756 -2.23245 9.70093 -2.40266 10.9743 -2.34433C12.2476 -2.286 13.5081 -2.00022 14.6867 -1.50042C15.8653 -1.00062 16.9385 -0.293525 17.853 0.620976C18.7675 1.53548 19.3677 2.6247 19.7567 3.81144C20.1457 4.99818 20.3159 6.26155 20.2576 7.53488C20.1993 8.80821 19.9135 10.0687 19.4137 11.2473C18.9139 12.4259 18.2068 13.4992 17.2923 14.4137L17.293 13.293Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span className={styles.label}>{theme === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  );
};

export default ThemeToggle;


