# AyurSutra Panchkarma - Therapy Scheduler Platform

A comprehensive web-based therapy scheduling platform for Ayurvedic Panchkarma treatments with MongoDB database integration.

## Features

- **Dashboard**: Real-time statistics showing today's appointments, pending reports, and new patients
- **Patient Management**: Complete CRUD operations (Create, Read, Update, Delete) for patient records
- **Appointment Scheduling**: Easy-to-use form for adding new appointments
- **Patient Editing**: Edit patient details including name, age, treatment, and status
- **Chat Assistant**: Built-in chatbot for quick help and navigation
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Custom CSS with Poppins font

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Steps

1. **Clone or download the project files**

2. **Install dependencies**
```bash
npm install express mongoose cors body-parser
```

3. **Start MongoDB**
```bash
mongod
```

4. **Start the server**
```bash
npm start
```
or for development with auto-reload:
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

## Project Structure

```
ayursutra-scheduler/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Frontend JavaScript
├── server.js           # Backend server with API routes
├── package.json        # Dependencies and scripts
└── README.md          # Documentation
```

## API Endpoints

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get single patient
- `POST /api/patients` - Create new patient/appointment
- `PUT /api/patients/:id` - Update patient details
- `DELETE /api/patients/:id` - Delete patient

### Chat
- `GET /api/chat` - Get chat history
- `POST /api/chat` - Send chat message

## Usage

### Adding a New Appointment
1. Navigate to the "Appointments" section
2. Fill in patient name, age, date, treatment, and status
3. Click "Add Appointment"

### Editing Patient Details
1. Go to the "Patients" section
2. Click the "Edit" button next to the patient
3. Modify the details in the modal
4. Click "Update Patient"

### Deleting a Patient
1. Go to the "Patients" section
2. Click the "Delete" button next to the patient
3. Confirm the deletion

## Database Schema

### Patient Model
```javascript
{
  name: String (required),
  age: Number (required),
  date: Date (default: current date),
  treatment: String (required),
  status: String (default: 'Scheduled'),
  createdAt: Date (default: current date)
}
```

### Chat Model
```javascript
{
  message: String (required),
  sender: String (required),
  timestamp: Date (default: current date)
}
```

## Treatments Available

- Abhyanga (Ayurvedic oil massage)
- Shirodhara (Oil therapy for head)
- Virechana (Therapeutic purgation)
- Nasya (Nasal therapy)

## Future Enhancements

- User authentication and authorization
- Email notifications for appointments
- Patient medical history tracking
- Treatment progress reports
- Analytics and reporting dashboard
- Integration with payment gateway
- SMS reminders for appointments

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in server.js
- Default: `mongodb://localhost:27017/ayursutra`

### Port Already in Use
- Change PORT in server.js (default: 3000)
- Kill existing process: `lsof -ti:3000 | xargs kill`

### CORS Issues
- Ensure cors middleware is properly configured
- Check API_URL in script.js matches server URL

## License

ISC

## Support

For issues and questions, please open an issue in the project repository.
