import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import JobSearch from '../JobSearch/JobSearch';
import JobForm from '../JobForm/JobForm';
import JobList from '../JobList/JobList';
import { Job } from '../types';

const App: React.FC = () => {
  const [jobs, setJobs] = React.useState<Job[]>([]);

  const addJob = (job: Job) => {
    setJobs([...jobs, job]);
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  return (
    <Router>
      <div className="app">
        <Routes>
        <Route path="/" element={
            <div>
              <h1>Job Listings</h1>
              <Link to="/new-job">Add a Job</Link>
              <JobSearch />
            </div>
          } />
          <Route
            path="/new-job"
            element={
              <div>
                <h1>Add Job</h1>
                <Link to="/">Back to Job Search</Link>
                <JobForm onSubmit={addJob} />
                <JobList jobs={jobs} onDelete={deleteJob} />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
