# BridgeHub Spaces - Backend API

A production-grade RESTful API for Coworking Space Management System, built with **Node.js**, **Express**, **Prisma ORM**, and **Supabase (PostgreSQL)**.

---

* **Live Base API:** `https://bridgehubspaces.duckdns.org/v1`
* **Interactive Swagger Docs:** `https://bridgehubspaces.duckdns.org/v1/docs`

---

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database & ORM:** PostgreSQL (Supabase) with Prisma ORM
* **Authentication:** JWT & Passport.js
* **Validation & Security:** Joi / Express-validation, Helmet, Cors, XSS-Clean, Express Rate Limit
* **Documentation:** Swagger UI 
* **Server Infrastructure:** Oracle Cloud VPS (Ubuntu), Nginx Reverse Proxy, Certbot (Let's Encrypt SSL), PM2 Process Manager

---

## Features

* **Authentication & Authorization:** Register, Login, Refresh Tokens, Email Verification, and Role-Based Access Control (RBAC for `CUSTOMER`, `VENDOR`, `ADMIN`).
* **Space & Amenity Management:** Catalog management, pricing, capacity filters, and amenity tagging.
* **Reservation System:** Booking workflows with time-overlap validation and status management (`PENDING`, `CONFIRMED`, `CANCELLED`).
* **Dashboard Analytics:** Aggregated statistics for vendors and administrators.
* **Production Security:** HTTPS enforcement, rate limiting on auth endpoints, CORS protection, and secure HTTP headers.

---

## Repository Structure

```text
src/
├── config/         # App, database, passport, and logger configs
├── controllers/    # Request handlers & logic forwarding
├── middlewares/   # Auth, error handling, rate limiting, and validation
├── routes/v1/      # RESTful route definitions and Swagger JSDoc
├── services/       # Core business logic & database interactions
├── validations/    # Request body and query validation schemas
├── utils/          # Helper classes (ApiError, catchAsync)
├── app.js          # Express app configuration
└── index.js        # Server entry point & database connection

```

---

## ENV

Create a `.env` file in the root directory and configure the following variables:

```
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL="postgresql://user:password@db.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@db.supabase.co:5432/postgres"

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30

# SMTP / Email Configuration (Ethereal / Nodemailer)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=noreply@bridgehubspaces.com

```

---

## Local Development Setup

**Clone the repository:**
```
git clone [https://github.com/r3belchain/backend-coworkingspace.git](https://github.com/r3belchain/backend-coworkingspace.git)
cd backend-coworkingspace

```


**Install dependencies:**
```
npm install

```


**Generate Prisma Client & Sync Database:**
```
npx prisma generate
npx prisma db push

```


**Run the development server:**
```
npm run dev

```

---

## API Endpoints Overview

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| **POST** | `/v1/auth/register` | Register new user account | Public |
| **POST** | `/v1/auth/login` | Authenticate user & receive tokens | Public |
| **GET** | `/v1/spaces` | Browse coworking spaces with filters | Public |
| **GET** | `/v1/spaces/:spaceId` | Get detailed space information | Public |
| **POST** | `/v1/spaces` | Create new space | Vendor / Admin |
| **POST** | `/v1/reservations` | Create a space booking | Authenticated |
| **GET** | `/v1/dashboard/stats` | Retrieve platform analytics | Vendor / Admin |

*Refer to `/v1/docs` for the complete request/response schemas and parameters.*

---

## Deployment Architecture

The backend is deployed on an **Oracle Cloud VPS** with the following production architecture:

* **Nginx:** Configured as a Reverse Proxy redirecting HTTP (Port 80) and HTTPS (Port 443) traffic to internal Port `5000`.
* **Certbot:** Manages automated SSL certificate issuance and renewals via Let's Encrypt.
* **PM2:** Keeps the Node.js process running 24/7 with automatic restart policies.
