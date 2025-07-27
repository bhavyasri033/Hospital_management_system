const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Most permissive CORS configuration for debugging
app.use(cors());

app.use(express.json());
connectDB();

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const inventoryRoutes = require('./routes/inventory');
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/inventory', inventoryRoutes);

app.get('/', (req, res) => {
  res.send('HMS Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 