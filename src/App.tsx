import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Modal from './components/Modal/Modal';
import JobSearch from './components/JobSearch/JobSearch';
import MyJobs from './components/MyJobs/MyJobs';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import NotFound from './components/NotFound/NotFound';
import AppHeader from './components/AppHeader/AppHeader';

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
