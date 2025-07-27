import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';

const getStatusColor = (status) => {
  switch(status) {
    case 'Scheduled': return 'scheduled';
    case 'In Progress': return 'in-progress';
    case 'Completed': return 'completed';
    case 'Cancelled': return 'cancelled';
    default: return 'scheduled';
  }
};

const Appointments = ({ userRole = 'admin', userData = {} }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newAppointment, setNewAppointment] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
    status: 'Scheduled',
  });

  useEffect(() => {
    // Fetch appointments
    axios.get('http://localhost:5000/api/appointments')
      .then(res => setAppointments(res.data))
      .catch(err => console.error('Error fetching appointments:', err));
    // Fetch patients
    axios.get('http://localhost:5000/api/patients')
      .then(res => setPatients(res.data))
      .catch(err => console.error('Error fetching patients:', err));
    // Fetch doctors
    axios.get('http://localhost:5000/api/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error('Error fetching doctors:', err));
  }, []);

  // Add appointment
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/appointments', newAppointment);
      const refreshed = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(refreshed.data);
      setNewAppointment({ patient: '', doctor: '', date: '', time: '', reason: '', status: 'Scheduled' });
      setShowAddForm(false);
    } catch (err) {
      alert('Error scheduling appointment: ' + (err.response?.data?.error || err.message));
    }
  };

  // Edit appointment
  const handleEditAppointment = (appointment) => {
    setEditingAppointment({ ...appointment, patient: appointment.patient?._id || '', doctor: appointment.doctor?._id || '' });
    setShowEditForm(true);
  };

  // Update appointment
  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/appointments/${editingAppointment._id}`, editingAppointment);
      const refreshed = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(refreshed.data);
      setEditingAppointment(null);
      setShowEditForm(false);
    } catch (err) {
      alert('Error updating appointment: ' + (err.response?.data?.error || err.message));
    }
  };

  // Update status
  const updateAppointmentStatus = async (id, newStatus) => {
    const apt = appointments.find(a => a._id === id);
    if (!apt) return;
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}`, { ...apt, status: newStatus });
      const refreshed = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(refreshed.data);
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.error || err.message));
    }
  };

  // Add delete handler
  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      setAppointments(appointments.filter(a => a._id !== id));
    } catch (err) {
      alert('Error deleting appointment: ' + (err.response?.data?.error || err.message));
    }
  };

  // Filtered appointments for doctor
  const doctorId = userRole === 'doctor' ? userData?.id || userData?._id : null;
  const doctorAppointments = appointments.filter(apt =>
    (apt.doctor && (apt.doctor._id === doctorId || apt.doctor === doctorId)) &&
    (selectedDate === '' || apt.date === selectedDate) &&
    (filterStatus === 'all' || apt.status === filterStatus) &&
    (searchTerm === '' || (apt.patient?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (apt.patient?._id || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Summary counts
  const summary = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'].reduce((acc, status) => {
    acc[status] = doctorAppointments.filter(apt => apt.status === status).length;
    return acc;
  }, {});

  if (userRole === 'doctor') {
    return (
      <div className="page">
        <div className="page-header">
          <h1>My Appointments</h1>
        </div>
        <div className="appointments-summary-bar">
          <div className="summary-item">Total: <b>{doctorAppointments.length}</b></div>
          <div className="summary-item scheduled">Scheduled: <b>{summary['Scheduled']}</b></div>
          <div className="summary-item in-progress">In Progress: <b>{summary['In Progress']}</b></div>
          <div className="summary-item completed">Completed: <b>{summary['Completed']}</b></div>
          <div className="summary-item cancelled">Cancelled: <b>{summary['Cancelled']}</b></div>
        </div>
        <div className="appointments-controls">
          <div className="date-selector">
            <label>Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="status-filter">
            <label>Status:</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="appointments-list">
          <h3>Appointments for {selectedDate || 'All Dates'}</h3>
          {doctorAppointments.length === 0 ? (
            <div className="no-appointments">
              <p>No appointments found for the selected filters.</p>
            </div>
          ) : (
            doctorAppointments.map(appointment => (
              <div key={appointment._id} className="appointment-card read-only">
                <div className="appointment-header">
                  <div className="appointment-time">
                    <span className="time">{appointment.time}</span>
                    <span className="duration">({appointment.duration} min)</span>
                  </div>
                  <span className={`status ${appointment.status.replace(' ', '-').toLowerCase()}`}>{appointment.status}</span>
                </div>
                <div className="appointment-details">
                  <div className="patient-info">
                    <h4>{appointment.patient?.name || 'N/A'}</h4>
                    <p><strong>ID:</strong> {appointment.patient?._id || 'N/A'}</p>
                  </div>
                  <div className="appointment-info">
                    <p><strong>Type:</strong> {appointment.type}</p>
                    <p><strong>Room:</strong> {appointment.room}</p>
                    {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Appointment Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          + Schedule Appointment
        </button>
      </div>

      <div className="appointments-controls">
        <div className="date-selector">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="status-filter">
          <label>Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Schedule New Appointment</h2>
              <button onClick={() => setShowAddForm(false)}>×</button>
            </div>
            <form onSubmit={handleAddAppointment} className="appointment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Patient Name *</label>
                  <select
                    value={newAppointment.patient}
                    onChange={(e) => setNewAppointment({...newAppointment, patient: e.target.value})}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient._id} value={patient._id}>{patient.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Doctor *</label>
                  <select
                    value={newAppointment.doctor}
                    onChange={(e) => setNewAppointment({...newAppointment, doctor: e.target.value})}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <select
                    value={newAppointment.duration}
                    onChange={(e) => setNewAppointment({...newAppointment, duration: parseInt(e.target.value)})}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Reason</label>
                <textarea
                  value={newAppointment.reason}
                  onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
                  rows="3"
                  placeholder="Reason for the appointment..."
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && editingAppointment && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Appointment</h2>
              <button onClick={() => {
                setShowEditForm(false);
                setEditingAppointment(null);
              }}>×</button>
            </div>
            <form onSubmit={handleUpdateAppointment} className="appointment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Patient Name *</label>
                  <select
                    value={editingAppointment.patient}
                    onChange={(e) => setEditingAppointment({...editingAppointment, patient: e.target.value})}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient._id} value={patient._id}>{patient.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Doctor *</label>
                  <select
                    value={editingAppointment.doctor}
                    onChange={(e) => setEditingAppointment({...editingAppointment, doctor: e.target.value})}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={editingAppointment.date}
                    onChange={(e) => setEditingAppointment({...editingAppointment, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    value={editingAppointment.time}
                    onChange={(e) => setEditingAppointment({...editingAppointment, time: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <select
                    value={editingAppointment.duration}
                    onChange={(e) => setEditingAppointment({...editingAppointment, duration: parseInt(e.target.value)})}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Reason</label>
                <textarea
                  value={editingAppointment.reason}
                  onChange={(e) => setEditingAppointment({...editingAppointment, reason: e.target.value})}
                  rows="3"
                  placeholder="Reason for the appointment..."
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingAppointment.status}
                  onChange={(e) => setEditingAppointment({...editingAppointment, status: e.target.value})}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingAppointment(null);
                  }} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="appointments-list">
        <h3>Appointments for {selectedDate}</h3>
        {appointments.filter(apt => {
          const dateMatch = apt.date && selectedDate && apt.date.slice(0, 10) === selectedDate;
          const statusMatch = filterStatus === 'all' || apt.status === filterStatus;
          return dateMatch && statusMatch;
        }).length === 0 ? (
          <div className="no-appointments">
            <p>No appointments found for the selected date and status.</p>
          </div>
        ) : (
          appointments.filter(apt => {
            const dateMatch = apt.date && selectedDate && apt.date.slice(0, 10) === selectedDate;
            const statusMatch = filterStatus === 'all' || apt.status === filterStatus;
            return dateMatch && statusMatch;
          }).map(appointment => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <div className="appointment-time">
                  <span className="time">{appointment.time}</span>
                  <span className="duration">({appointment.duration} min)</span>
                </div>
                <span className={`status ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
              
              <div className="appointment-details">
                <div className="patient-info">
                  <h4>{appointment.patient?.name || 'N/A'}</h4>
                  <p><strong>ID:</strong> {appointment.patient?._id || 'N/A'}</p>
                </div>
                
                <div className="appointment-info">
                  <p><strong>Doctor:</strong> {appointment.doctor?.name || 'N/A'}</p>
                  <p><strong>Type:</strong> {appointment.type}</p>
                  <p><strong>Room:</strong> {appointment.room}</p>
                  {appointment.notes && (
                    <p><strong>Notes:</strong> {appointment.notes}</p>
                  )}
                </div>
              </div>

              <div className="appointment-actions">
                {appointment.status === 'Scheduled' && (
                  <>
                    <button 
                      className="btn-success"
                      onClick={() => updateAppointmentStatus(appointment._id, 'In Progress')}
                    >
                      Start
                    </button>
                    <button 
                      className="btn-warning"
                      onClick={() => updateAppointmentStatus(appointment._id, 'Cancelled')}
                    >
                      Cancel
                    </button>
                  </>
                )}
                {appointment.status === 'In Progress' && (
                  <button 
                    className="btn-success"
                    onClick={() => updateAppointmentStatus(appointment._id, 'Completed')}
                  >
                    Complete
                  </button>
                )}
                <button 
                  className="btn-secondary"
                  onClick={() => handleEditAppointment(appointment)}
                >
                  Edit
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => handleDeleteAppointment(appointment._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments; 