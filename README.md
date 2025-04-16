# Learning Academy Platform

A comprehensive online learning management system (LMS) designed to facilitate course delivery, student enrollment, teacher management, and seamless content interaction. This platform supports multilingual experiences (Arabic & English) and is compatible with all device types.

---

## 🌐 Features Overview

### 📊 Dashboard & Analytics
- Real-time statistics on:
  - Registered students & active users
  - Teachers and their courses
  - Enrolled students per course
  - Lessons and exams delivered
  - Total revenue from course purchases
- System & device analytics for user sessions
- Active accounts breakdown

### 🛠 User & Role Management
- Roles: Admin, Teacher, Student
- Full CRUD operations for users
- Role-based access control (RBAC)
- Admin privileges to approve/reject user requests
- Password management per role

### 📦 Course & Content Management
- Add/edit/delete courses, assign categories and pricing
- Control over course details (title, description, media, teacher)
- Course material management: lessons, chapters, and exams
- Visibility of students per course and their progress

### 📚 Categories Management
- Organize courses under editable categories
- Display all available classifications

### 🧾 Requests & Approvals
- View and approve course registration requests
- Display full student request details (phone, course, date)
- Manage confirmed requests

### 📺 Live Interaction & Messaging
- Integrated live streaming for teachers
- In-app chat between students and teachers (1-on-1 and class-based)
- Admin control to mute users per course
- Support inbox for admin-student communication

### 💸 Promotions & Discounts
- Create and manage promo codes
- Control discount logic and student usage limits

### 🛒 Shopping Cart
- Course preview and promotional code application
- Direct registration request submission from cart

### 🎓 Student Learning Experience
- Course follow-up with lessons, materials, and assignments
- Interactive tests with:
  - Multiple question types
  - Media attachments for questions/answers
  - Hints and timer enforcement
  - Randomized question delivery
  - IP/device restriction options

---

## 🧪 Technical Stack

### Frontend
- **Framework**: React
- **Libraries**:
  - ngx-translate for multilingual support
  - Real-time updates with SignalR/WebSockets

### Backend
- **Framework**: ASP.NET Core
- **Architecture**: Clean Architecture + SOLID Principles
- **Authentication**: JWT with Role-Based Authorization
- **Database**: SQL Server
- **ORM**: Entity Framework Core
- **Unit of Work & Repository Pattern**


### Integrations
- **Video Hosting**: [Vimeo](https://vimeo.com/) API integration for secure streaming
- **Real-Time Chat**: SignalR 
- **File Storage**: Local

---

## 🧩 Key Highlights
- Admin panel for full system control without direct code interaction
- Modular, scalable architecture suitable for SaaS deployment
- Supports bilingual UI: Arabic (RTL) and English (LTR)
- Secure file/video streaming with upload restrictions
- Adaptive layout across desktop, tablet, and mobile devices

---
