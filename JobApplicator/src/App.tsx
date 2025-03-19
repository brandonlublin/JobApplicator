import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Modal from '../Modal/Modal';
import JobSearch from '../JobSearch/JobSearch';
import axios from 'axios';
import MyJobs from '../MyJobs/MyJobs';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [error, setError] = useState('');
  const job = { job_id: 1, job_name: 'Software Engineer' };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/applied-jobs', {
        jobId: job.job_id,
        jobData: job,
      });
      setIsApplied(true);
      setIsModalOpen(false); 
    } catch (err) {
      setError('Error applying for job');
    }
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Job Listings</h1>
                <button onClick={() => setIsModalOpen(true)}>Add a Job</button>
                <JobSearch />
                <Link to="/my-jobs">Go to My Jobs</Link>
              </div>
            }
          />
          <Route path="/my-jobs" element={
            <div className="myJobsContainer">
              <Link to="/">Job Listings</Link>
              <button className="addJobButton" onClick={() => setIsModalOpen(true)}>Add a Job</button>
              <MyJobs />
            </div>
          } />
        </Routes>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApply={handleApply}
        />
      </div>
    </Router>
  );
};

export default App;
