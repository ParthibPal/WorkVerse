# WorkVerse - Job Portal Platform

![WorkVerse Logo](https://img.shields.io/badge/WorkVerse-Job%20Portal-blue?style=for-the-badge&logo=react)

A modern, full-stack job portal platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that connects job seekers with employers.

## 🚀 Features

### For Job Seekers
- **Advanced Job Search**: Search by title, location, company, and job type
- **Real-time Job Listings**: Browse thousands of active job opportunities
- **User Authentication**: Secure login and registration system
- **Personalized Dashboard**: Track applications and saved jobs
- **Job Categories**: Explore opportunities across different industries
- **Mobile Responsive**: Access from any device

### For Employers
- **Job Posting**: Easy-to-use interface to post job opportunities
- **Admin Dashboard**: Manage job listings and applications
- **Company Profiles**: Showcase your organization
- **Application Management**: Track and manage candidate applications
- **Analytics**: View job performance metrics

### For Administrators
- **User Management**: Manage all users and their roles
- **Job Moderation**: Review and approve job postings
- **System Analytics**: Monitor platform usage and performance
- **Content Management**: Manage categories and platform content

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations
- **CSS3** - Custom styling with modern design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
WorkVerse/
├── Backend/                 # Server-side code
│   ├── config/             # Database configuration
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   └── server.js           # Main server file
├── FrontEnd/               # Client-side code
│   ├── src/
│   │   ├── Components/     # Reusable components
│   │   ├── Pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── Css/            # Stylesheets
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ParthibPal/WorkVerse.git
   cd WorkVerse
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../FrontEnd
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the Backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. **Start the Development Servers**

   **Backend (Terminal 1):**
   ```bash
   cd Backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd FrontEnd
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📋 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm run dev:clean    # Kill port 5000 and start dev server
npm start            # Start production server
npm run start:clean  # Kill port 5000 and start production server
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔧 Configuration

### Database Setup
1. Create a MongoDB database (local or MongoDB Atlas)
2. Update the `MONGODB_URI` in your `.env` file
3. The application will automatically create necessary collections

### Admin User Setup
Run the admin creation script:
```bash
cd Backend
node scripts/createAdmin.js
```

## 📱 Features Overview

### Homepage
- Hero section with job search functionality
- Featured jobs display
- Statistics and testimonials
- Job categories browsing

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Role-based access control

### Job Management
- Create, read, update, delete jobs
- Job search and filtering
- Application tracking
- Salary range management

### Admin Panel
- User management
- Job moderation
- System analytics
- Content management

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Protected API endpoints

## 🎨 UI/UX Features

- Modern, responsive design
- Smooth animations with Framer Motion
- Intuitive navigation
- Mobile-first approach
- Loading states and error handling
- Beautiful iconography with Lucide React

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Parthib Pal**
- GitHub: [@ParthibPal](https://github.com/ParthibPal)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the database solution
- Express.js for the backend framework
- All the open-source contributors whose libraries made this possible

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainer.

---

**Made with ❤️ by Parthib Pal** 