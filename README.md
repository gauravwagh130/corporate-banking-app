# Corporate Banking Client & Credit Management System

A full-stack corporate banking application designed to digitize **client onboarding** and **credit request management** for Corporate & Investment Banks.

---

## 📌 Project Overview

Corporate banks handle hundreds of corporate clients requesting various credit facilities such as **working capital loans, term loans, and refinancing**.  
Traditional manual and spreadsheet-driven processes are **slow, error-prone, and difficult to audit**.

This system provides a **secure, scalable, and auditable platform** where:

- **Relationship Managers (RMs)** onboard corporate clients and submit credit requests.
- **Analysts** review, approve, or reject credit requests.
- **Admins** manage users and system access.

---

## 🛠️ Tech Stack

### Frontend

- Angular 18
- Angular Material
- Reactive Forms
- JWT Authentication
- Jasmine & Karma

### Backend

- Spring Boot
- Spring Security (JWT)
- Spring Data MongoDB
- Apache Kafka
- JUnit 5 & Mockito

### Database & DevOps

- MongoDB
- Docker & Docker Compose
- Nginx
- AWS (EC2, ECR)
- SonarQube, JaCoCo

---

## 🎯 Project Objectives

- Secure authentication & authorization
- Role-based access control
- Corporate client onboarding
- Credit request lifecycle management
- Kafka-based event publishing
- Cloud-ready deployment

---

## 🔐 Feature 1 — Authentication & Authorization

### Roles

- **ADMIN** – Manage users and system access
- **RELATIONSHIP_MANAGER (RM)** – Onboard clients, submit credit requests
- **ANALYST** – Review and approve/reject requests

### REST Endpoints

| Method | Endpoint                     | Description         |
| ------ | ---------------------------- | ------------------- |
| POST   | /api/auth/login              | Login & JWT         |
| POST   | /api/auth/register           | Create user (Admin) |
| GET    | /api/users/me                | Current user        |
| PUT    | /api/admin/users/{id}/status | Activate/Deactivate |

---

## 🏢 Feature 2 — Corporate Client Onboarding

Relationship Managers can:

- Add/update clients
- View assigned clients only
- Search/filter clients

---

## 💳 Feature 3 — Credit Request Management

- RM submits credit requests
- Analyst reviews and updates status
- Kafka events published on create/update

---

## 📣 Kafka Integration

- Topic: `credit-request-events`
- Events:
  - Credit Request Created
  - Credit Request Status Updated
- Consumer logs events to console

---

## 🧩 Angular Modules

- Auth Module
- RM Module
- Analyst Module
- Admin Module

---

## 🧪 Testing

- Frontend: ≥75% coverage (Jasmine + Karma)
- Backend: ≥80% coverage (JUnit + Mockito)

---

## 📦 Docker Setup

Services:

- Angular (Nginx)
- Spring Boot
- MongoDB
- Kafka

Run locally:

```bash
docker-compose up -d
```

---

## ☁️ AWS Deployment

- Docker images → Amazon ECR
- Deployment on EC2
- Public URL access

---
