# TasinmazProje – Full Stack Real Estate Management System

This is a **full-stack web application** for real estate (property) management.  
It provides secure user authentication, CRUD operations for properties, and a PostgreSQL database backend.  
The project follows a **layered architecture** with a **.NET Core API backend**, an **Angular frontend**, and **PostgreSQL** as the database.

---

## What This Project Does

TasinmazProje offers a **user-facing portal** for customers to add and manage their properties, and an **admin portal** to operate and supervise the application.

- **Customer UI (Self-Service)**
  - Register/Login and obtain a JWT-based session
  - Create/Read/Update/Delete their own properties
  - Enter structured address data (City → District → Neighborhood) and property attributes
  - Review their property list and details

- **Admin UI (Operations)**
  - Manage users (list/add/edit)
  - Moderate and manage all properties
  - Inspect application **activity logs** (who did what, when, from which IP)
  - Maintain reference data (cities, districts, neighborhoods via API)
  - Enforce role-based access (admin vs. regular users)

**Roles & Permissions**
- **User**: Full CRUD on **own** properties, read-only access to reference data.
- **Admin**: Full CRUD on users and properties, can view audit logs and maintain reference data.

---

## Tech Stack

### Backend – ASP.NET Core (.NET 8)
- **Layered Architecture**
  - **Entities** → Domain models (City, District, Neighborhood, Property, User, Log)
  - **DataAccess** → Entity Framework Core + PostgreSQL, Repository Pattern
  - **Business** → Services, validation, and business logic
  - **Presentation (API)** → RESTful Controllers
- **Authentication & Authorization** → JWT-based login and role management
- **Logging** → All user activities (IP, timestamp, status) are recorded
- **Database** → PostgreSQL with EF Core Migrations (migrations live inside `backend`)

### Frontend – Angular
- **Component-based structure** with modular pages: Login, User Management, Property Management, Logs
- **Routing** using Angular Router
- **Services** for API communication via HttpClient
- **Auth Guard & Interceptor** for secure routing and JWT injection
- **UI** built with Bootstrap + Bootstrap Icons

### Database – PostgreSQL
- Managed via **EF Core Migrations**
- Relationships:
  - City → Districts
  - District → Neighborhoods
  - User → Properties
- **Seed Data**: Turkish city/district/neighborhood data imported from JSON files at first run (via `DataSeeder`)

---

## Project Structure
TasinmazProje/
│── backend/ # .NET Core Backend (API, Business, DataAccess, Entities, EF Core Migrations)
└── frontend/ # Angular Frontend (Components, Services, Pages)

---

## Features

- JWT-based authentication and authorization  
- CRUD operations for Properties, Users, Cities, Districts, Neighborhoods  
- Logging system (who did what, when, and from which IP)  
- Angular SPA with responsive UI  
- PostgreSQL database with migrations and seed data  
- Scalable, testable, and maintainable layered architecture  

---

### Summary

This project is a full-stack real estate management system built with modern technologies:

- **Backend**: ASP.NET Core RESTful API  
- **Frontend**: Angular Single-Page Application  
- **Database**: PostgreSQL  

It delivers secure authentication, structured data management, and a clean layered architecture ready for production.


## How to Run

📌 To run this project, make sure you have **.NET 8 SDK**, **Node.js**, and **PostgreSQL** installed.

1) Backend (.NET Core)

cd backend/TasinmazProje.Presentation
# 1) Update appsettings.json with your PostgreSQL connection string and JWT key
# 2) Apply EF Core migrations (creates tables)
dotnet ef database update
# 3) Run the API
dotnet run

**Sample appsettings.json (template):**
```json
{
  "Logging": { "LogLevel": { "Default": "Information", "Microsoft.AspNetCore": "Warning" } },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=TasinmazDb;Username=postgres;Password=YOUR_PASSWORD"
  },
  "Jwt": {
    "Key": "REPLACE_WITH_YOUR_32_CHAR_SECRET_KEY",
    "Issuer": "TasinmazAPI",
    "Audience": "TasinmazClient",
    "ExpireMinutes": 60
  }
}
### 2) Frontend (Angular)
```bash
cd frontend
npm install
ng serve -o

### 3) Database (PostgreSQL)
- Install and run PostgreSQL  
- Put your connection string into `backend/TasinmazProje.Presentation/appsettings.json`  
- Run migrations:  
```bash
cd backend/TasinmazProje.Presentation
dotnet ef database update

## Deployment Notes

✅ **Can someone run this from GitHub as-is?**  
Yes. They can clone the repo and:  

1. Edit `backend/appsettings.json` with their PostgreSQL credentials and JWT key  
2. Ensure PostgreSQL is installed and running  
3. Run `dotnet ef database update` to create tables (migrations are included inside backend)  
4. In `frontend/`, run `npm install` and `ng serve -o`  

That’s it — the system will be up with both API and SPA.  

---

