import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import './Pages.css';
import axios from 'axios';

Chart.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const recentLabResults = [
  { patient: 'Alice Brown', test: 'CBC', result: 'Normal', status: 'Reviewed' },
  { patient: 'Bob Lee', test: 'ECG', result: 'Abnormal', status: 'Pending Review' },
  { patient: 'Charlie Kim', test: 'X-Ray', result: 'Normal', status: 'Reviewed' },
  { patient: 'Diana Patel', test: 'Blood Sugar', result: 'High', status: 'Pending Review' }
];

const Dashboard = ({ userRole = 'admin', userData = {} }) => {
  const navigate = useNavigate();
  // Move all hooks to the top
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [selectedLabResult, setSelectedLabResult] = useState(null);
  const [labResults, setLabResults] = useState(recentLabResults); // Use state for updates

  // Real data state
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/patients').then(res => setPatients(res.data));
    axios.get('http://localhost:5000/api/doctors').then(res => setDoctors(res.data));
    axios.get('http://localhost:5000/api/appointments').then(res => setAppointments(res.data));
    axios.get('http://localhost:5000/api/inventory').then(res => setInventory(res.data));
  }, []);

  // Calculate today's appointments
  const today = new Date().toISOString().slice(0, 10);
  const appointmentsToday = appointments.filter(a => a.date && a.date.slice(0, 10) === today);

  // Prepare upcoming appointments (next 5 by time)
  const upcomingAppointments = appointments
    .filter(a => a.date && a.date.slice(0, 10) === today)
    .sort((a, b) => (a.time > b.time ? 1 : -1))
    .slice(0, 5)
    .map(a => ({
      time: a.time,
      patient: a.patient?.name || 'N/A',
      doctor: a.doctor?.name || 'N/A',
      dept: a.doctor?.specialization || 'N/A',
      room: a.room || 'N/A',
    }));

  // Doctor-specific data
  const doctorSummary = {
    totalPatients: 156,
    appointmentsToday: 8,
    appointmentsCompleted: 5,
    pendingReports: 3,
    criticalPatients: 2,
    upcomingSurgeries: 1,
    labResultsPending: 4,
    emergencyCalls: 1
  };
  const patientCareMetrics = {
    averageConsultationTime: 25,
    patientSatisfaction: 4.7,
    followUpRate: 92,
    emergencyResponseTime: 8
  };
  const todaysAppointments = [
    { time: '09:00', patient: 'Alice Brown', type: 'Follow-up', status: 'Completed', room: '101' },
    { time: '10:30', patient: 'Bob Lee', type: 'Consultation', status: 'In Progress', room: '102' },
    { time: '11:15', patient: 'Charlie Kim', type: 'Emergency', status: 'Scheduled', room: 'ER' },
    { time: '14:00', patient: 'Diana Patel', type: 'Surgery Prep', status: 'Scheduled', room: 'OR1' },
    { time: '15:30', patient: 'Ethan Clark', type: 'Lab Review', status: 'Scheduled', room: '103' },
    { time: '16:00', patient: 'Fiona Garcia', type: 'Consultation', status: 'Scheduled', room: '104' }
  ];
  const criticalPatients = [
    { name: 'John Smith', condition: 'Post-op monitoring', ward: 'ICU', priority: 'High' },
    { name: 'Sarah Johnson', condition: 'Fever spike', ward: 'General', priority: 'Medium' }
  ];
  const medicalAlerts = [
    'Patient John Smith in ICU requires hourly monitoring.',
    'Lab results for Bob Lee need immediate review.',
    'Emergency surgery scheduled for 2:00 PM today.'
  ];
  const doctorActivityFeed = [
    { time: '08:30', type: 'consultation', message: 'Completed morning rounds in ICU.' },
    { time: '09:15', type: 'surgery', message: 'Performed appendectomy on Patient P003.' },
    { time: '10:00', type: 'lab', message: 'Reviewed lab results for Patient P004.' },
    { time: '10:45', type: 'emergency', message: 'Responded to emergency call in ER.' },
    { time: '11:30', type: 'consultation', message: 'Follow-up consultation with Patient P005.' },
    { time: '12:00', type: 'report', message: 'Completed patient discharge summary.' }
  ];
  const doctorActivityFeedToShow = showAllActivity ? doctorActivityFeed : doctorActivityFeed.slice(0, 4);
  const satisfactionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Patient Satisfaction Score',
        data: [4.5, 4.6, 4.7, 4.8, 4.7, 4.7],
        fill: true,
        borderColor: '#27ae60',
        backgroundColor: 'rgba(39,174,96,0.1)',
        tension: 0.3,
        pointRadius: 4
      }
    ]
  };
  const appointmentTypes = {
    labels: ['Consultations', 'Follow-ups', 'Emergency', 'Surgery', 'Lab Review'],
    datasets: [
      {
        data: [40, 25, 15, 10, 10],
        backgroundColor: ['#3498db', '#27ae60', '#e74c3c', '#f39c12', '#9b59b6'],
        borderWidth: 1
      }
    ]
  };
  const doctorSweetNote = "Dedicated to healing, committed to care.";

  // Admin dashboard data
  const summary = {
    patients: 1234,
    doctors: 45,
    appointmentsToday: 28,
    inventoryItems: 543,
    revenue: 125000,
    bedsAvailable: 32,
    bedsOccupied: 118,
    emergencies: 3
  };
  const criticalAlerts = [
    'Critical inventory: Morphine 10mg below minimum stock.',
    'Emergency: Patient in ICU requires immediate attention.'
  ];
  const activityFeed = [
    { time: '09:10', type: 'admission', message: 'Patient John Smith admitted to Cardiology.' },
    { time: '09:22', type: 'discharge', message: 'Patient Sarah Johnson discharged from Pediatrics.' },
    { time: '09:30', type: 'alert', message: 'Critical inventory: Morphine 10mg below minimum stock.' },
    { time: '09:35', type: 'appointment', message: 'New appointment scheduled for Dr. Wilson.' },
    { time: '09:40', type: 'lab', message: 'Lab result: Abnormal CBC for Patient P004.' },
    { time: '09:45', type: 'surgery', message: 'Surgery started: Appendectomy for Patient P003.' },
    { time: '10:00', type: 'admission', message: 'Patient Ethan Clark admitted to Surgery.' },
    { time: '10:10', type: 'alert', message: 'Critical inventory: Insulin Regular below minimum stock.' },
    { time: '10:15', type: 'appointment', message: 'New appointment scheduled for Dr. Singh.' },
    { time: '10:20', type: 'lab', message: 'Lab result: Normal ECG for Patient P005.' },
    { time: '10:25', type: 'discharge', message: 'Patient Diana Patel discharged from General.' },
  ];
  const adminActivityFeedToShow = showAllActivity ? activityFeed : activityFeed.slice(0, 6);
  const bedOccupancy = {
    labels: ['Occupied', 'Available'],
    datasets: [
      {
        data: [summary.bedsOccupied, summary.bedsAvailable],
        backgroundColor: ['#e67e22', '#27ae60'],
        borderWidth: 1
      }
    ]
  };
  const revenueTrend = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [90000, 95000, 100000, 110000, 120000, 125000, 130000, 128000, 135000, 140000, 145000, 150000],
        fill: true,
        borderColor: '#2980b9',
        backgroundColor: 'rgba(41,128,185,0.08)',
        tension: 0.3,
        pointRadius: 4
      }
    ]
  };
  const wardsWithBeds = [
    { ward: 'General', available: 8 },
    { ward: 'ICU', available: 5 },
    { ward: 'Pediatrics', available: 4 },
    { ward: 'Surgery', available: 3 },
    { ward: 'Maternity', available: 2 }
  ];
  const sweetNote = "Empowering care, every day.";

  // Handler to mark as reviewed
  const handleMarkReviewed = (idx) => {
    setLabResults(labResults => labResults.map((r, i) => i === idx ? { ...r, status: 'Reviewed' } : r));
    setSelectedLabResult({ ...labResults[idx], status: 'Reviewed' });
  };
  // Handler to download lab result (dummy for now)
  const handleDownloadLab = (result) => {
    alert('Download for ' + result.patient + ' - ' + result.test);
  };
  // Handler to view patient profile (dummy for now)
  const handleViewPatient = (patientName) => {
    alert('Open profile for ' + patientName);
  };

  // Render doctor dashboard
  if (userRole === 'doctor') {
    // Get doctor's name from userData
    const doctorId = userData?.doctorId;
    // Filter appointments for this doctor
    const myAppointments = appointments.filter(a => a.doctor && (a.doctor._id === doctorId || a.doctor === doctorId));
    const myAppointmentsToday = myAppointments.filter(a => a.date && a.date.slice(0, 10) === today);
    const completedToday = myAppointmentsToday.filter(a => a.status === 'Completed');
    // Unique patients for this doctor
    const myPatientIds = new Set(myAppointments.map(a => a.patient?._id || a.patient));
    const myPatients = patients.filter(p => myPatientIds.has(p._id));
    // Critical patients (example: status === 'Critical' or custom logic)
    const myCriticalPatients = myPatients.filter(p => p.status === 'Critical' || p.condition === 'Critical');
    // Pending reports (example: appointments with status 'Pending Report')
    const pendingReports = myAppointments.filter(a => a.status === 'Pending Report');
    // Upcoming surgeries (example: appointments with type/specialty 'Surgery' and date >= today)
    const upcomingSurgeries = myAppointments.filter(a => (a.type === 'Surgery' || a.reason?.toLowerCase().includes('surgery')) && a.date && a.date.slice(0, 10) >= today);
    // Lab results pending (example: appointments with status 'Lab Pending' or similar)
    const labResultsPending = myAppointments.filter(a => a.status === 'Lab Pending' || a.labStatus === 'Pending');
    // Emergency calls (example: appointments with type/reason 'Emergency')
    const emergencyCalls = myAppointments.filter(a => (a.type === 'Emergency' || a.reason?.toLowerCase().includes('emergency')));
    return (
      <div className="page dashboard-page">
        {/* Doctor Dashboard Header */}
        <div className="dashboard-header-bar simple">
          <div className="dashboard-header-title-group">
            <div className="dashboard-header-title">Doctor Dashboard</div>
            <div className="dashboard-header-note">Dedicated to healing, committed to care.</div>
          </div>
          <div className="dashboard-header-user">
            <span className="dashboard-header-welcome">Welcome, Dr. {userData?.name || userData?.displayName || userData?.username || ''}</span>
            <span className="dashboard-header-avatar">👨‍⚕️</span>
          </div>
        </div>

        {/* Medical Alerts Banner */}
        {medicalAlerts.length > 0 && (
          <div className="critical-alerts-banner">
            <span role="img" aria-label="alert">⚠️</span>
            {medicalAlerts.map((alert, idx) => (
              <span key={idx} className="critical-alert-msg">{alert}</span>
            ))}
          </div>
        )}

        {/* Dynamic Summary Cards */}
        <div className="dashboard-summary-grid">
          <div className="summary-card">
            <span className="summary-icon" role="img" aria-label="Patients">👥</span>
            <div>
              <h3>Total Patients</h3>
              <p className="summary-number">{myPatients.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon" role="img" aria-label="Appointments">📅</span>
            <div>
              <h3>Today's Appointments</h3>
              <p className="summary-number">{myAppointmentsToday.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon" role="img" aria-label="Completed">✅</span>
            <div>
              <h3>Completed Today</h3>
              <p className="summary-number">{completedToday.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon" role="img" aria-label="Critical">🚨</span>
            <div>
              <h3>Critical Patients</h3>
              <p className="summary-number">{myCriticalPatients.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon" role="img" aria-label="Reports">📋</span>
            <div>
              <h3>Pending Reports</h3>
              <p className="summary-number">{pendingReports.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon" role="img" aria-label="Surgery">🔪</span>
            <div>
              <h3>Upcoming Surgeries</h3>
              <p className="summary-number">{upcomingSurgeries.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon" role="img" aria-label="Lab">🧪</span>
            <div>
              <h3>Lab Results Pending</h3>
              <p className="summary-number">{labResultsPending.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon" role="img" aria-label="Emergency">🚑</span>
            <div>
              <h3>Emergency Calls</h3>
              <p className="summary-number">{emergencyCalls.length}</p>
            </div>
          </div>
        </div>

        {/* Doctor's Advanced Analytics */}
        <div className="dashboard-advanced-grid">
          {/* Today's Appointments */}
          <div className="dashboard-chart-card">
            <h4>Today's Appointments</h4>
            <div className="appointments-list-mini">
              {myAppointmentsToday.length === 0 ? (
                <div className="no-appointments">No appointments for today.</div>
              ) : myAppointmentsToday.map((apt, idx) => (
                <div key={idx} className={`appointment-mini ${apt.status?.toLowerCase().replace(' ', '-')}`}>
                  <div className="appointment-time">{apt.time}</div>
                  <div className="appointment-details">
                    <div className="patient-name">{apt.patient?.name || 'N/A'}</div>
                    <div className="appointment-type">{apt.type || apt.reason || ''}</div>
                    <div className="appointment-room">Room {apt.room || ''}</div>
                  </div>
                  <div className="appointment-status">{apt.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Patients */}
          <div className="dashboard-chart-card">
            <h4>Critical Patients</h4>
            <div className="critical-patients-list">
              {myCriticalPatients.map((patient, idx) => (
                <div key={idx} className={`critical-patient ${patient.priority.toLowerCase()}`}>
                  <div className="patient-info">
                    <div className="patient-name">{patient.name}</div>
                    <div className="patient-condition">{patient.condition}</div>
                    <div className="patient-ward">{patient.ward}</div>
                  </div>
                  <div className="priority-badge">{patient.priority}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Lab Results */}
          <div className="dashboard-chart-card">
            <h4>Recent Lab Results</h4>
            <div className="lab-results-list">
              {labResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`lab-result ${result.status.toLowerCase().replace(' ', '-')}`}
                  tabIndex={0}
                  role="button"
                  onClick={() => setSelectedLabResult(result)}
                  onKeyPress={e => { if (e.key === 'Enter') setSelectedLabResult(result); }}
                  style={{ cursor: 'pointer', outline: 'none' }}
                >
                  <div className="result-info">
                    <div className="result-patient" onClick={e => { e.stopPropagation(); handleViewPatient(result.patient); }} style={{ color: '#2980b9', textDecoration: 'underline', cursor: 'pointer' }}>{result.patient}</div>
                    <div className="result-test">{result.test}</div>
                    <div className="result-value">{result.result}</div>
                  </div>
                  <div className="result-actions">
                    <span className={`lab-status-badge ${result.status.toLowerCase().replace(' ', '-')}`}>{result.status}</span>
                    <button className="lab-download-btn" onClick={e => { e.stopPropagation(); handleDownloadLab(result); }} title="Download"><span role="img" aria-label="download">⬇️</span></button>
                    {result.status === 'Pending Review' && (
                      <button className="lab-review-btn" onClick={e => { e.stopPropagation(); handleMarkReviewed(idx); }}>Mark as Reviewed</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Lab Result Modal */}
            {selectedLabResult && (
              <div className="modal-overlay" onClick={() => setSelectedLabResult(null)}>
                <div className="modal lab-modal" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Lab Result: {selectedLabResult.test}</h2>
                    <button onClick={() => setSelectedLabResult(null)}>×</button>
                  </div>
                  <div className="lab-modal-content">
                    <p><strong>Patient:</strong> {selectedLabResult.patient}</p>
                    <p><strong>Test:</strong> {selectedLabResult.test}</p>
                    <p><strong>Result:</strong> {selectedLabResult.result}</p>
                    <p><strong>Status:</strong> {selectedLabResult.status}</p>
                    {/* Add more details as needed */}
                  </div>
                  <div className="modal-actions">
                    <button className="lab-download-btn" onClick={() => handleDownloadLab(selectedLabResult)}><span role="img" aria-label="download">⬇️</span> Download</button>
                    {selectedLabResult.status === 'Pending Review' && (
                      <button className="lab-review-btn" onClick={() => handleMarkReviewed(labResults.findIndex(r => r === selectedLabResult))}>Mark as Reviewed</button>
                    )}
                    <button className="btn-secondary" onClick={() => setSelectedLabResult(null)}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Doctor's Activity Feed */}
          <div className="dashboard-activity-feed">
            <h4>Your Activity Today</h4>
            <ul>
              {doctorActivityFeedToShow.map((item, idx) => (
                <li key={idx} className={`activity-${item.type}`}>
                  <span className="activity-time">{item.time}</span>
                  <span className="activity-message">{item.message}</span>
                </li>
              ))}
            </ul>
            {doctorActivityFeed.length > 4 && (
              <button className="show-more-btn" onClick={() => setShowAllActivity(v => !v)}>
                {doctorActivityFeedToShow.length === doctorActivityFeed.length ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>

          {/* Patient Satisfaction Chart */}
          <div className="dashboard-chart-card">
            <h4>Patient Satisfaction Trend</h4>
            <Line data={satisfactionData} options={{ 
              plugins: { legend: { display: false } },
              scales: { y: { min: 4, max: 5 } }
            }} />
          </div>

          {/* Appointment Types */}
          <div className="dashboard-chart-card">
            <h4>Appointment Types Distribution</h4>
            <Doughnut data={appointmentTypes} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        {/* Patient Care Metrics */}
        <div className="patient-care-metrics">
          <h4>Patient Care Metrics</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">{patientCareMetrics.averageConsultationTime} min</div>
              <div className="metric-label">Avg. Consultation Time</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{patientCareMetrics.patientSatisfaction}/5.0</div>
              <div className="metric-label">Patient Satisfaction</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{patientCareMetrics.followUpRate}%</div>
              <div className="metric-label">Follow-up Rate</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{patientCareMetrics.emergencyResponseTime} min</div>
              <div className="metric-label">Emergency Response Time</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render pharmaceutical admin dashboard
  if (userRole === 'pharma' || userRole === 'pharmaceutical_admin') {
    // Calculate metrics from real inventory data
    const now = new Date();
    const totalInventory = inventory.length;
    const lowStockAlerts = inventory.filter(item => item.quantity < item.minStock);
    const expiringMedicines = inventory.filter(item => {
      if (!item.expiry) return false;
      const expiryDate = new Date(item.expiry);
      const diffDays = (expiryDate - now) / (1000 * 60 * 60 * 24);
      return diffDays <= 30 && diffDays >= 0;
    });
    const inventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0);
    const mostUsed = inventory.reduce((max, item) => (item.usage > (max?.usage || 0) ? item : max), null);
    const criticalShortages = inventory.filter(item => item.quantity < (item.criticalLevel || 5));
    // Placeholder for supplier delays, recent orders, reorder pending
    const supplierDelays = 0;
    const recentOrders = [];
    const reorderPending = 0;
    const usageTrends = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Medicine Usage',
        data: [120, 140, 135, 150, 160, 170],
        fill: true,
        borderColor: '#8e44ad',
        backgroundColor: 'rgba(142,68,173,0.08)',
        tension: 0.3,
        pointRadius: 4
      }]
    };
    const reorderStatus = [
      { name: 'Insulin Regular', status: 'Pending Approval' },
      { name: 'Morphine 10mg', status: 'Ordered' }
    ];
    const supplierPerformance = [
      { name: 'PharmaCorp Ltd', onTime: 95, delays: 1 },
      { name: 'MediSupply Co', onTime: 88, delays: 2 }
    ];
    const inventoryTransactions = [
      { type: 'Added', item: 'Paracetamol 500mg', qty: 200, date: '2024-07-10' },
      { type: 'Dispensed', item: 'Amoxicillin 250mg', qty: 20, date: '2024-07-11' },
      { type: 'Returned', item: 'Insulin Regular', qty: 5, date: '2024-07-12' }
    ];
    const consumptionByDept = {
      labels: ['ICU', 'General', 'Pediatrics', 'Surgery', 'Maternity'],
      datasets: [{
        label: 'Consumption',
        data: [40, 30, 20, 25, 15],
        backgroundColor: ['#3498db', '#27ae60', '#e74c3c', '#f39c12', '#9b59b6'],
        borderWidth: 1
      }]
    };
    const procurementRequests = [
      { item: 'Surgical Gloves', status: 'Pending Approval' },
      { item: 'IV Sets', status: 'Pending Approval' }
    ];
    const pharmaNote = "Ensuring safe, timely, and efficient medication supply.";

    return (
      <div className="page dashboard-page">
        {/* Pharma Dashboard Header */}
        <div className="dashboard-header-bar simple">
          <div className="dashboard-header-title-group">
            <div className="dashboard-header-title">Pharmaceutical Admin Dashboard</div>
            <div className="dashboard-header-note">Ensuring safe, timely, and efficient medication supply.</div>
          </div>
          <div className="dashboard-header-user">
            <span className="dashboard-header-welcome">Welcome, Pharma Admin</span>
            <span className="dashboard-header-avatar">💊</span>
          </div>
        </div>

        {/* Critical Alerts Banner */}
        {criticalShortages.length > 0 && (
          <div className="critical-alerts-banner">
            <span role="img" aria-label="alert">⚠️</span>
            {criticalShortages.map((alert, idx) => (
              <span key={idx} className="critical-alert-msg">Critical shortage: {alert.name} (Qty: {alert.quantity})</span>
            ))}
          </div>
        )}

        {/* Pharma Summary Cards */}
        <div className="dashboard-summary-grid">
          <div className="summary-card"><span className="summary-icon" role="img" aria-label="Inventory">📦</span><div><h3>Total Inventory Items</h3><p className="summary-number">{totalInventory}</p></div></div>
          <div className="summary-card"><span className="summary-icon" role="img" aria-label="Low Stock">⚠️</span><div><h3>Low-Stock Alerts</h3><p className="summary-number">{lowStockAlerts.length}</p></div></div>
          <div className="summary-card"><span className="summary-icon" role="img" aria-label="Expiring">⏳</span><div><h3>Expiring Medicines</h3><p className="summary-number">{expiringMedicines.length}</p></div></div>
          <div className="summary-card"><span className="summary-icon" role="img" aria-label="Orders">📝</span><div><h3>Recent Stock Orders</h3><p className="summary-number">{recentOrders.length}</p></div></div>
          <div className="summary-card"><span className="summary-icon" role="img" aria-label="Reorder">🔄</span><div><h3>Reorder Pending</h3><p className="summary-number">{reorderPending}</p></div></div>
          <div className="summary-card"><span className="summary-icon" role="img" aria-label="Value">💰</span><div><h3>Inventory Value</h3><p className="summary-number">₹{inventoryValue.toLocaleString()}</p></div></div>
          <div className="summary-card"><span className="summary-icon" role="img" aria-label="Most Used">🔥</span><div><h3>Most-Used Medication</h3><p className="summary-most-used-medication">{mostUsed ? mostUsed.name : 'N/A'}</p></div></div>
          <div className="summary-card"><span className="summary-icon" role="img" aria-label="Supplier">🚚</span><div><h3>Supplier Delays</h3><p className="summary-number">{supplierDelays}</p></div></div>
        </div>

        {/* Advanced Analytics & Tables */}
        <div className="dashboard-advanced-grid">
          {/* Low Stock Alerts */}
          <div className="dashboard-chart-card">
            <h4>Low-Stock Alerts</h4>
            <div className="dashboard-chart-card-table-wrapper">
              <table><thead><tr><th>Medicine</th><th>Qty</th><th>Min Stock</th></tr></thead><tbody>
                {lowStockAlerts.map((item, idx) => (
                  <tr key={idx}><td>{item.name}</td><td>{item.quantity}</td><td>{item.minStock}</td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
          {/* Expiring Medicines */}
          <div className="dashboard-chart-card">
            <h4>Expiring Medicines</h4>
            <div className="dashboard-chart-card-table-wrapper">
              <table><thead><tr><th>Medicine</th><th>Expiry Date</th></tr></thead><tbody>
                {expiringMedicines.map((item, idx) => (
                  <tr key={idx}><td>{item.name}</td><td>{item.expiry}</td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
          {/* Recent Stock Orders */}
          <div className="dashboard-chart-card">
            <h4>Recent Stock Orders</h4>
            <div className="dashboard-chart-card-table-wrapper">
              <table><thead><tr><th>Order ID</th><th>Item</th><th>Qty</th><th>Status</th><th>Date</th></tr></thead><tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan="5">No recent orders.</td></tr>
                ) : recentOrders.map((order, idx) => (
                  <tr key={idx}><td>{order.id}</td><td>{order.item}</td><td>{order.qty}</td><td>{order.status}</td><td>{order.date}</td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
          {/* Medicine Usage Trends */}
          <div className="dashboard-chart-card">
            <h4>Medicine Usage Trends</h4>
            <Line data={usageTrends} options={{ plugins: { legend: { display: false } } }} />
          </div>
          {/* Reorder Status */}
          <div className="dashboard-chart-card">
            <h4>Reorder Status</h4>
            <div className="dashboard-chart-card-table-wrapper">
              <table><thead><tr><th>Medicine</th><th>Status</th></tr></thead><tbody>
                {reorderStatus.map((item, idx) => (
                  <tr key={idx}><td>{item.name}</td><td>{item.status}</td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
          {/* Supplier Performance */}
          <div className="dashboard-chart-card">
            <h4>Supplier Performance</h4>
            <div className="dashboard-chart-card-table-wrapper">
              <table><thead><tr><th>Supplier</th><th>On-Time (%)</th><th>Delays</th></tr></thead><tbody>
                {supplierPerformance.map((item, idx) => (
                  <tr key={idx}><td>{item.name}</td><td>{item.onTime}%</td><td>{item.delays}</td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
          {/* Inventory Value & Most Used */}
          <div className="dashboard-chart-card">
            <h4>Inventory Value & Most-Used</h4>
            <div className="kpi-row">
              <div className="kpi-block">
                <span className="kpi-icon" role="img" aria-label="Value">💰</span>
                <div className="kpi-label">Value</div>
                <div className="kpi-value">₹{inventoryValue.toLocaleString()}</div>
              </div>
              <div className="kpi-divider"></div>
              <div className="kpi-block">
                <span className="kpi-icon" role="img" aria-label="Most Used">🔥</span>
                <div className="kpi-label">Most-Used</div>
                <div className="kpi-value">{mostUsed ? mostUsed.name : 'N/A'}</div>
              </div>
            </div>
          </div>
          {/* Recent Inventory Transactions */}
          <div className="dashboard-chart-card">
            <h4>Recent Inventory Transactions</h4>
            <div className="dashboard-chart-card-table-wrapper">
              <table><thead><tr><th>Type</th><th>Item</th><th>Qty</th><th>Date</th></tr></thead><tbody>
                {inventoryTransactions.map((tx, idx) => (
                  <tr key={idx}><td>{tx.type}</td><td>{tx.item}</td><td>{tx.qty}</td><td>{tx.date}</td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
          {/* Inventory Consumption by Department */}
          <div className="dashboard-chart-card">
            <h4>Inventory Consumption by Department</h4>
            <Doughnut data={consumptionByDept} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
          {/* Pending Procurement Requests */}
          <div className="dashboard-chart-card">
            <h4>Pending Procurement Requests</h4>
            <div className="dashboard-chart-card-table-wrapper">
              <table><thead><tr><th>Item</th><th>Status</th></tr></thead><tbody>
                {procurementRequests.map((req, idx) => (
                  <tr key={idx}><td>{req.item}</td><td>{req.status}</td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="page dashboard-page">
      {/* Dashboard Header */}
      <div className="dashboard-header-bar simple">
        <div className="dashboard-header-title-group">
          <div className="dashboard-header-title">Dashboard Overview</div>
          <div className="dashboard-header-note">{sweetNote}</div>
        </div>
        <div className="dashboard-header-user">
          <span className="dashboard-header-welcome">Welcome, {userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
          <span className="dashboard-header-avatar">
            {userRole.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="critical-alerts-banner">
          <span role="img" aria-label="alert">⚠️</span>
          {criticalAlerts.map((alert, idx) => (
            <span key={idx} className="critical-alert-msg">{alert}</span>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="dashboard-quick-actions">
        <button className="btn-primary" onClick={() => navigate('/patients', { state: { showAdd: true } })}>+ Add Patient</button>
        <button className="btn-primary" onClick={() => navigate('/appointments', { state: { showAdd: true } })}>+ Schedule Appointment</button>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-summary-grid">
        <div className="summary-card">
          <span className="summary-icon" role="img" aria-label="Patients">👥</span>
          <div>
            <h3>Patients</h3>
            <p className="summary-number">{patients.length}</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon" role="img" aria-label="Doctors">🩺</span>
          <div>
            <h3>Doctors</h3>
            <p className="summary-number">{doctors.length}</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon" role="img" aria-label="Appointments">📅</span>
          <div>
            <h3>Appointments Today</h3>
            <p className="summary-number">{appointmentsToday.length}</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon" role="img" aria-label="Inventory">💊</span>
          <div>
            <h3>Inventory Items</h3>
            <p className="summary-number">{inventory.length}</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon" role="img" aria-label="Revenue">💰</span>
          <div>
            <h3>Revenue (₹)</h3>
            <p className="summary-number">{(125000).toLocaleString()}</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon" role="img" aria-label="Beds">🛏️</span>
          <div>
            <h3>Beds Available</h3>
            <p className="summary-number">32</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon" role="img" aria-label="Emergencies">🚑</span>
          <div>
            <h3>Emergencies</h3>
            <p className="summary-number">3</p>
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="dashboard-advanced-grid">
        <div className="dashboard-activity-feed">
          <h4>Live Activity Feed</h4>
          <ul>
            {adminActivityFeedToShow.map((item, idx) => (
              <li key={idx} className={`activity-${item.type}`}>
                <span className="activity-time">{item.time}</span>
                <span className="activity-message">{item.message}</span>
              </li>
            ))}
          </ul>
          {activityFeed.length > 6 && (
            <button className="show-more-btn" onClick={() => setShowAllActivity(v => !v)}>
              {adminActivityFeedToShow.length === activityFeed.length ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
        <div className="dashboard-chart-card">
          <h4>Bed Occupancy</h4>
          <Doughnut data={bedOccupancy} options={{ plugins: { legend: { position: 'bottom' } } }} />
        </div>
        <div className="dashboard-chart-card">
          <h4>Revenue Trend</h4>
          <Line data={revenueTrend} options={{ plugins: { legend: { display: false } } }} />
        </div>
        <div className="dashboard-chart-card">
          <h4>Upcoming Appointments</h4>
          <div className="dashboard-chart-card-table-wrapper">
            <div className="upcoming-appointments">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Dept</th>
                    <th>Room</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((apt, idx) => (
                    <tr key={idx}>
                      <td>{apt.time}</td>
                      <td>{apt.patient}</td>
                      <td>{apt.doctor}</td>
                      <td>{apt.dept}</td>
                      <td>{apt.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="dashboard-chart-card">
          <h4>Wards with Available Beds</h4>
          <div className="wards-with-beds">
            <table>
              <thead>
                <tr>
                  <th>Ward</th>
                  <th>Available Beds</th>
                </tr>
              </thead>
              <tbody>
                {wardsWithBeds.map((ward, idx) => (
                  <tr key={idx}>
                    <td>{ward.ward}</td>
                    <td>{ward.available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 