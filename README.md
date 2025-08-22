🎓 Topamine - E-Learning Platform

Topamine is a modern educational platform that connects students with qualified teachers. It provides features such as secure registration, role-based dashboards, real-time messaging, and integrated payment for purchasing courses. Built using **React**, **Firebase**, **Cloudinary**, and **Paymob**.

🚀 Features

- 🔐 **Role-Based Authentication**
  - Students, teachers, and admins have dedicated dashboards with custom permissions.
  - Teachers require admin approval before joining.

- 🎥 **Course Management**
  - Teachers can create courses with multiple videos and files.
  - Each video has a start and end date for controlled access.

- 💳 **Payment Integration**
  - Students can purchase courses via **Paymob payment gateway**.
  - Teachers can view earnings and student purchase stats.

- 🧠 **AI Chatbot (Gemini)**
  - Smart assistant to help users navigate the platform.

- 💬 **Social Interactions**
  - Students can follow teachers and receive notifications for new courses.
  - Real-time chat between followed students and teachers.

- 🛠️ **Admin Dashboard**
  - View analytics: number of students, teachers, revenue, and more.
  - Manage users: approve, reject, or ban teachers and students.
  - Control course visibility and content.

📦 Tech Stack
- **Frontend**: React, Material UI, Formik, Yup
- **Backend**: Firebase Firestore, Firebase Auth, Cloudinary (media), Paymob (payments)
- **AI Integration**: Gemini chatbot.

- 📂 Folder Structure
  /src
├── components # Reusable UI components
├── pages # Route-based pages (Dashboard, Login, Courses, etc.)
├── firebase # Firebase config and services
├── utils # Helper functions (API, validation, etc.)
└── assets # Images and static files


## 🛠️ Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/topamine.git

2. Navigate to the project folder:
   cd topamine
   
3. Install dependencies:
   npm install

4. Add your .env file:
  REACT_APP_FIREBASE_API_KEY=...
  REACT_APP_CLOUDINARY_PRESET=...
  REACT_APP_PAYMOB_API_KEY=...

5. Run the development server:
   npm start

🧪 Features In Progress

Course rating and reviews

Zoom/Google Meet integration for live sessions

Certificate generation on course completion

📄 License

This project is licensed under the MIT License.


