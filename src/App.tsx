import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Modal from './components/Modal/Modal';
import JobSearch from './components/JobSearch/JobSearch';
import MyJobs from './components/MyJobs/MyJobs';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import NotFound from './components/NotFound/NotFound';

const AppHeader = ({ onAddJob }: { onAddJob: () => void }) => {
  const location = useLocation();
  const isMyJobs = location.pathname === '/my-jobs';
  
  return (
    <header className="appHeader">
      <div className="appTitleContainer">
        <span className="appName">JobApplicator</span>
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

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = () => {
    setIsModalOpen(false);
  };

  return (
    <Router>
      <ThemeToggle />
      <div className="app">
        <AppHeader onAddJob={() => setIsModalOpen(true)} />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <JobSearch />
              </div>
            }
          />
          <Route
            path="/my-jobs"
            element={
              <div className="myJobsContainer">
                <MyJobs />
              </div>
            }
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onApply={handleApply} />
      </div>
    </Router>
  );
};

export default App;
