import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';

const DEPARTMENTS = ['Cardiology', 'Orthopedics', 'Pediatrics', 'Surgery', 'General', 'ENT', 'Dermatology'];
const SPECIALIZATIONS = ['Cardiologist', 'Orthopedic Surgeon', 'Pediatrician', 'Surgeon', 'General Physician', 'ENT Specialist', 'Dermatologist'];
const ROLES = ['Doctor', 'Head of Department', 'Consultant'];
const GENDERS = ['Male', 'Female', 'Other'];

const initialDoctors = [
  {
    id: 'D001',
    name: 'Dr. Sarah Wilson',
    department: 'Cardiology',
    specialization: 'Cardiologist',
    phone: '+1-555-1001',
    email: 'sarah.wilson@hospital.com',
    status: 'Active',
    role: 'Doctor',
    weeklyAvailability: {
      Mon: '9am-5pm', Tue: '9am-5pm', Wed: '9am-5pm', Thu: '9am-5pm', Fri: '9am-5pm', Sat: 'Off', Sun: 'Off'
    },
    appointments: 32,
    rating: 4.7
  },
  {
    id: 'D002',
    name: 'Dr. Michael Brown',
    department: 'Orthopedics',
    specialization: 'Orthopedic Surgeon',
    phone: '+1-555-1002',
    email: 'michael.brown@hospital.com',
    status: 'Inactive',
    role: 'Consultant',
    weeklyAvailability: {
      Mon: '10am-4pm', Tue: '10am-4pm', Wed: '10am-4pm', Thu: '10am-4pm', Fri: '10am-4pm', Sat: 'Off', Sun: 'Off'
    },
    appointments: 18,
    rating: 4.2
  }
];

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [showExportMsg, setShowExportMsg] = useState(false);

  const [form, setForm] = useState({
    name: '',
    department: '',
    specialization: '',
    phone: '',
    email: '',
    gender: '',
    status: 'Active',
    role: 'Doctor',
    weeklyAvailability: { Mon: '', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: '' },
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error('Error fetching doctors:', err));
    axios.get('http://localhost:5000/api/appointments')
      .then(res => setAppointments(res.data))
      .catch(err => console.error('Error fetching appointments:', err));
  }, []);

  // Add or Edit Doctor
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const safeWeeklyAvailability = form.weeklyAvailability || { Mon: '', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: '' };
    if (editDoctor) {
      // Update doctor
      try {
        const res = await axios.put(`http://localhost:5000/api/doctors/${editDoctor._id}`, { ...form, weeklyAvailability: safeWeeklyAvailability });
        setDoctors(doctors.map(d => d._id === editDoctor._id ? res.data : d));
      } catch (err) {
        console.error('Error updating doctor:', err);
      }
    } else {
      // Add doctor
      try {
        const res = await axios.post('http://localhost:5000/api/doctors', { ...form, weeklyAvailability: safeWeeklyAvailability });
        setDoctors([...doctors, res.data]);
      } catch (err) {
        console.error('Error adding doctor:', err);
      }
    }
    setShowAddEditForm(false);
    setEditDoctor(null);
    setForm({
      name: '', department: '', specialization: '', phone: '', email: '', gender: '', status: 'Active', role: 'Doctor',
      weeklyAvailability: { Mon: '', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: '' },
    });
  };

  // Open Edit
  const openEdit = (doctor) => {
    setEditDoctor(doctor);
    setForm({ ...doctor, weeklyAvailability: { ...doctor.weeklyAvailability } });
    setShowAddEditForm(true);
  };

  // Deactivate/Activate
  const toggleStatus = async (id) => {
    const doctor = doctors.find(d => d._id === id);
    if (!doctor) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/doctors/${id}`, {
        ...doctor,
        status: doctor.status === 'Active' ? 'Inactive' : 'Active',
      });
      setDoctors(doctors.map(d => d._id === id ? res.data : d));
    } catch (err) {
      console.error('Error toggling doctor status:', err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${id}`);
      setDoctors(doctors.filter(d => d._id !== id));
    } catch (err) {
      console.error('Error deleting doctor:', err);
    }
  };

  // Export to CSV
  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Department', 'Specialization', 'Phone', 'Email', 'Status', 'Role'].join(','),
      ...doctors.map(d => [d._id, d.name, d.department, d.specialization, d.phone, d.email, d.status, d.role].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'doctors.csv';
    a.click();
    setShowExportMsg(true);
    setTimeout(() => setShowExportMsg(false), 2000);
  };

  // Filtered doctors
  const filteredDoctors = doctors.filter(d =>
    (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.specialization || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Doctors Management</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-primary" onClick={() => { setShowAddEditForm(true); setEditDoctor(null); }}>+ Add Doctor</button>
          <button className="btn-secondary" onClick={handleExport}>Export CSV</button>
        </div>
      </div>
      {showExportMsg && <div className="export-msg">Doctor list exported!</div>}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by name, department, or specialization..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      {showAddEditForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editDoctor ? 'Edit Doctor' : 'Add Doctor'}</h2>
              <button onClick={() => setShowAddEditForm(false)}>×</button>
            </div>
            <form onSubmit={handleFormSubmit} className="patient-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required>
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Specialization *</label>
                  <select value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} required>
                    <option value="">Select Specialization</option>
                    {SPECIALIZATIONS.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gender *</label>
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} required>
                    <option value="">Select Gender</option>
                    {GENDERS.map(gender => <option key={gender} value={gender}>{gender}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required>
                    {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ minWidth: 220 }}>
                  <label>Weekly Availability & Shifts</label>
                  <div className="doctor-availability-grid">
                    {Object.keys(form.weeklyAvailability).map(day => (
                      <div key={day} className="doctor-availability-row">
                        <span>{day}:</span>
                        <input
                          type="text"
                          value={form.weeklyAvailability[day]}
                          onChange={e => setForm({
                            ...form,
                            weeklyAvailability: { ...form.weeklyAvailability, [day]: e.target.value }
                          })}
                          placeholder="e.g., 9am-5pm or Off"
                          style={{ width: 90 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddEditForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editDoctor ? 'Save Changes' : 'Add Doctor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="doctors-grid">
        {filteredDoctors.map(doctor => {
          // Count appointments for this doctor
          const doctorAppointmentCount = appointments.filter(a => a.doctor && (a.doctor._id === doctor._id)).length;
          // Optionally, get upcoming appointments for this doctor
          // const upcoming = appointments.filter(a => a.doctor && (a.doctor._id === doctor._id) && new Date(a.date) >= new Date());
          return (
            <div key={doctor._id} className="doctor-card">
              <div className="doctor-header">
                <div>
                  <h3>{doctor.name}</h3>
                  <span className={`status-badge ${doctor.status.toLowerCase()}`}>{doctor.status}</span>
                </div>
                <div className="doctor-actions">
                  <button className="btn-secondary" onClick={() => openEdit(doctor)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(doctor._id)}>Delete</button>
                  <button className="btn-warning" onClick={() => toggleStatus(doctor._id)}>{doctor.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                </div>
              </div>
              <div className="doctor-info">
                <p><strong>Department:</strong> {doctor.department}</p>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Role:</strong> {doctor.role}</p>
                <p><strong>Phone:</strong> {doctor.phone}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Appointments:</strong> <span className="doctor-appointment-count">{doctorAppointmentCount}</span></p>
                <p><strong>Rating:</strong> {doctor.rating} ⭐</p>
              </div>
              {/* Optionally, show upcoming appointments here */}
              {/* <div className="doctor-appointments-list">
                <strong>Upcoming Appointments:</strong>
                {upcoming.length === 0 ? <p>No upcoming appointments.</p> : (
                  <ul>
                    {upcoming.slice(0, 3).map(a => (
                      <li key={a._id}>{a.date?.slice(0,10)} {a.time} - {a.patient?.name || 'N/A'}</li>
                    ))}
                  </ul>
                )}
              </div> */}
              <div className="doctor-availability">
                <strong>Availability:</strong>
                <div className="doctor-availability-grid">
                  {Object.entries(doctor.weeklyAvailability || {}).map(([day, time]) => (
                    <div key={day} className="doctor-availability-row">
                      <span>{day}:</span> <span>{time || 'Off'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Doctors; 