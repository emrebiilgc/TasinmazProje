# 🏠 TasinmazProje – Full Stack Real Estate Management System  

This is a **full-stack web application** for real estate (property) management.  
It provides secure user authentication, CRUD operations for properties, and a PostgreSQL database backend.  
The project follows a **layered architecture** with a **.NET Core API backend**, an **Angular frontend**, and **PostgreSQL** as the database.  

---

## ⚙️ Tech Stack  

### 🔹 Backend – ASP.NET Core (.NET 8)  
- **Layered Architecture**  
  - **Entities** → Domain models (City, District, Neighborhood, Property, User, Log)  
  - **DataAccess** → Entity Framework Core + PostgreSQL, Repository Pattern  
  - **Business** → Services, validation, and business logic  
  - **Presentation (API)** → RESTful Controllers  
- **Authentication & Authorization** → JWT-based login and role management  
- **Logging** → All user activities (IP, timestamp, status) are recorded  
- **Database** → PostgreSQL with EF Core Migrations  

### 🔹 Frontend – Angular  
- **Component-based structure** with modular pages: Login, User Management, Property Management, Logs  
- **Routing** using Angular Router  
- **Services** for API communication via HttpClient  
- **Auth Guard & Interceptor** for secure routing and JWT injection  
- **UI** built with Bootstrap + Bootstrap Icons  

### 🔹 Database – PostgreSQL  
- Managed via **EF Core Migrations**  
- Relationships:  
  - City → Districts  
  - District → Neighborhoods  
  - User → Properties  
- **Seed Data**: Turkish city/district/neighborhood data imported from JSON files  

---

## 📂 Project Structure  

TasinmazProje/
│── backend/ # .NET Core Backend (API, Business, DataAccess, Entities)
│── frontend/ # Angular Frontend (Components, Services, Pages)
└── database/ # PostgreSQL (migrations, seed data)


---

## 🚀 Features  

✅ JWT-based authentication and authorization  
✅ CRUD operations for Properties, Users, Cities, Districts, Neighborhoods  
✅ Logging system (who did what, when, and from which IP)  
✅ Angular SPA with responsive UI  
✅ PostgreSQL database with migrations and seed data  
✅ Scalable, testable, and maintainable layered architecture  

---

## ▶️ How to Run  

### Backend (.NET Core)  
```bash
cd backend/TasinmazProje.Presentation
dotnet run

###  Frontend (Angular)
cd frontend
npm install
ng serve -o

###Database (PostgreSQL)
# Connection string is in appsettings.json
dotnet ef database update

💡 Summary

This project is a full-stack real estate management system built with modern technologies:

Backend: ASP.NET Core RESTful API

Frontend: Angular Single-Page Application

Database: PostgreSQL

It delivers secure authentication, structured data management, and a clean layered architecture ready for production.
---
