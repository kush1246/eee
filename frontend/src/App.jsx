import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Users, UserPlus, SearchCheck } from 'lucide-react';
import CandidateForm from './components/CandidateForm';
import CandidateList from './components/CandidateList';
import MatchPage from './components/MatchPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div>
            <h1>Candidate AI Match</h1>
          </div>
          <div className="nav-links">
            <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Users size={18} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
              All Candidates
            </NavLink>
            <NavLink to="/add" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <UserPlus size={18} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
              Add Candidate
            </NavLink>
            <NavLink to="/match" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <SearchCheck size={18} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
              Shortlist Candidates
            </NavLink>
          </div>
        </nav>

        <main className="animate-fade-in">
          <Routes>
            <Route path="/" element={<CandidateList />} />
            <Route path="/add" element={<CandidateForm />} />
            <Route path="/match" element={<MatchPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
