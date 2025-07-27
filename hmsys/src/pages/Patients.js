import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Pages.css';

const Patients = () => {
  const location = useLocation();
  const [patients, setPatients] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    bloodGroup: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    status: 'Active',
  });

  useEffect(() => {
    // Fetch patients from backend API
    axios.get('http://localhost:5000/api/patients')
      .then(res => setPatients(res.data))
      .catch(err => console.error('Error fetching patients:', err));
    if (location.state && location.state.showAdd) {
      setShowAddForm(true);
    }
  }, [location.state]);

  // Add patient
  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/patients', newPatient);
      setPatients([...patients, res.data]); // Add the patient returned from backend
      setNewPatient({ name: '', age: '', gender: '', phone: '', bloodGroup: '', address: '', emergencyContact: '', emergencyPhone: '', medicalHistory: '', allergies: '', currentMedications: '', status: 'Active' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding patient:', err);
    }
  };

  // Delete patient
  const handleDeletePatient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`);
      setPatients(patients.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error deleting patient:', err);
    }
  };

  // Sort patients
  const sortedPatients = [...patients].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    } else {
      return new Date(b.lastVisit) - new Date(a.lastVisit);
    }
  });

  // Filtered patients
  const filteredPatients = sortedPatients.filter(patient =>
    ((patient.name || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
    ((patient.id || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Patient Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Patient
        </button>
      </div>

      <div className="search-section" style={{ display: 'flex', gap: 16 }}>
        <input
          type="text"
          placeholder="Search patients by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-dropdown">
          <option value="name">Sort by Name</option>
          <option value="lastVisit">Sort by Last Visit</option>
        </select>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Patient</h2>
              <button onClick={() => setShowAddForm(false)}>×</button>
            </div>
            <form onSubmit={handleAddPatient} className="patient-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={newPatient.status}
                    onChange={(e) => setNewPatient({...newPatient, status: e.target.value})}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    value={newPatient.bloodGroup}
                    onChange={(e) => setNewPatient({...newPatient, bloodGroup: e.target.value})}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                    rows="2"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Emergency Contact</label>
                  <input
                    type="text"
                    value={newPatient.emergencyContact}
                    onChange={(e) => setNewPatient({...newPatient, emergencyContact: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Phone</label>
                  <input
                    type="tel"
                    value={newPatient.emergencyPhone}
                    onChange={(e) => setNewPatient({...newPatient, emergencyPhone: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Medical History (comma separated)</label>
                  <input
                    type="text"
                    value={newPatient.medicalHistory}
                    onChange={(e) => setNewPatient({...newPatient, medicalHistory: e.target.value})}
                    placeholder="e.g., Hypertension, Diabetes"
                  />
                </div>
                <div className="form-group">
                  <label>Allergies (comma separated)</label>
                  <input
                    type="text"
                    value={newPatient.allergies}
                    onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                    placeholder="e.g., Penicillin, Dairy"
                  />
                </div>
                <div className="form-group">
                  <label>Current Medications (comma separated)</label>
                  <input
                    type="text"
                    value={newPatient.currentMedications}
                    onChange={(e) => setNewPatient({...newPatient, currentMedications: e.target.value})}
                    placeholder="e.g., Metformin, Lisinopril"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Patient Details</h2>
              <button onClick={() => setSelectedPatient(null)}>×</button>
            </div>
            <div style={{padding: '0 0 12px 24px'}}>
              <div style={{fontSize: '1.2rem', fontWeight: 700, color: '#3498db', marginBottom: 4}}>{selectedPatient.name}</div>
              <hr style={{border: 'none', borderTop: '1px solid #e1e8ed', margin: '0 0 12px 0'}} />
            </div>
            <div className="patient-details-modal">
              <p><strong>ID:</strong> {selectedPatient.id}</p>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Phone:</strong> {selectedPatient.phone}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${(selectedPatient.status || '').toLowerCase()}`}>{selectedPatient.status}</span></p>
              <p><strong>Last Visit:</strong> {selectedPatient.lastVisit}</p>
            </div>
          </div>
        </div>
      )}

      <div className="patients-grid">
        {filteredPatients.map(patient => (
          <div key={patient._id} className="patient-card">
            <div className="patient-header">
              <h3>{patient.name}</h3>
              <span className={`status-badge ${(patient.status || '').toLowerCase()}`}>{patient.status}</span>
            </div>
            <div className="patient-info">
              <p><strong>ID:</strong> {patient.id}</p>
              <p><strong>Age:</strong> {patient.age} years ({patient.gender})</p>
              <p><strong>Phone:</strong> {patient.phone}</p>
              <p><strong>Last Visit:</strong> {patient.lastVisit}</p>
            </div>
            <div className="patient-actions">
              <button className="btn-secondary" onClick={() => setSelectedPatient(patient)}>View Details</button>
              <button className="btn-danger" onClick={() => handleDeletePatient(patient._id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patients; 