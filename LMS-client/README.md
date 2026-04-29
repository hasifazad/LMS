# Futura LMS Frontend

The **Futura LMS Frontend** is a responsive web application built using **ReactJS** to provide a seamless interface for students, trainers, and administrators.  
It connects with the **Futura LMS Backend API** to manage learning modules, attendance, assignments, and project evaluations efficiently.

---

## 🧠 Tech Stack

- **Framework:** React.js (with Hooks & Context API)
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **State Management:** React Context / useReducer
- **HTTP Client:** Axios
- **File Uploads:** Multer integrated via backend
- **Authentication:** JWT-based auth flow
- **Deployment:** Vercel / Netlify (depending on environment)

---

## ⚙️ Features

- 🔐 **Authentication System** — Secure login for Admin, Trainer, and Student roles  
- 🎓 **Course Dashboard** — Displays assigned modules, course progress, and evaluation marks  
- 🧾 **Assignments Section** — Submit, update, and view assignment results  
- 🗓️ **Attendance Tracker** — View attendance history and daily logs  
- 💬 **Project Reviews** — Add project details and view feedback from trainers  
- 🧠 **Role-Based Access** — Conditional rendering of features for different user roles  
- 🌗 **Responsive UI** — Optimized for desktop, tablet, and mobile devices  

---

## 🧩 Project Structure

Futura-LMS-Client/
│
├── src/
│ ├── api/ # Axios instance and API calls
│ ├── components/ # Reusable UI components
│ ├── context/ # Auth and global state management
│ ├── pages/ # Route-level components (Dashboard, Login etc.)
│ ├── routes/ # Route definitions
│ ├── styles/ # Tailwind & custom styles
│ ├── utils/ # Helper functions
│ ├── App.js # Root component
│ └── main.jsx # Application entry point
│
├── public/ # Static assets
├── package.json
└── tailwind.config.js