import { Link, useLocation, useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  onAddJob: () => void;
}

const AppHeader = ({ onAddJob }: AppHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMyJobs = location.pathname === '/my-jobs';
  const isHome = location.pathname === '/';
  
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHome) {
      window.location.reload();
    } else {
      navigate('/');
    }
  };
  
  return (
    <header className="appHeader">
      <div className="appTitleContainer">
        <button className="appName" onClick={handleHomeClick}>
          JobApplicator
        </button>
        <h1>{isMyJobs ? 'My Applied Jobs' : 'Job Listings'}</h1>
      </div>
      <nav className="appNav">
        <Link to={isMyJobs ? '/' : '/my-jobs'} className="navLink">
          {isMyJobs ? 'Job Listings' : 'My Jobs'}
        </Link>
        <button className="addJobButton" onClick={onAddJob}>
          Add a Job
        </button>
      </nav>
    </header>
  );
};

export default AppHeader;

