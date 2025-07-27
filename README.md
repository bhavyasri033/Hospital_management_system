# Hospital Management System (HMS)

A comprehensive Hospital Management System built with React.js frontend and Node.js backend with MongoDB database.

## 🏥 Features

- **Patient Management**: Add, view, edit, and delete patient records
- **Doctor Management**: Manage doctor profiles and schedules
- **Appointment Scheduling**: Book and manage patient appointments
- **Inventory Management**: Track medical supplies and equipment
- **User Authentication**: Secure login and registration system
- **Dashboard Analytics**: Visual charts and statistics
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- React.js 19.1.0
- TypeScript
- React Router DOM
- Chart.js & React-Chartjs-2
- Axios for API calls
- Tailwind CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs for password hashing
- CORS enabled

## 📁 Project Structure

```
hmsys/
├── backend/                 # Node.js backend
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── hmsys/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   └── api/          # API configuration
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhavyasri033/Hospital_management_system.git
   cd Hospital_management_system
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../hmsys
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

5. **Run the Application**

   **Backend:**
   ```bash
   cd backend
   npm start
   ```

   **Frontend:**
   ```bash
   cd hmsys
   npm start
   ```

   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add new inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: Create React App
     - Build Command: `cd hmsys && npm run build`
     - Output Directory: `hmsys/build`
     - Install Command: `cd hmsys && npm install`

2. **Environment Variables**
   Add your environment variables in Vercel dashboard:
   - `REACT_APP_API_URL`: Your backend API URL
   - `MONGODB_URI`: Your MongoDB connection string

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch
   - Your app will be available at the provided Vercel URL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Bhavya Sri**
- GitHub: [@bhavyasri033](https://github.com/bhavyasri033)

## 🙏 Acknowledgments

- React.js team for the amazing framework
- MongoDB team for the database
- All contributors and supporters

---

⭐ If you find this project helpful, please give it a star! 