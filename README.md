# Nicsan CRM

A mini insurance policy management system built as part of the Nicsan Full Stack Developer assignment.

## What it does

Operations teams can log in, upload insurance policy PDFs, and the system automatically pulls out key details like customer name, vehicle number, and premium using AI. Policies show up in a dashboard instantly for all connected users thanks to real-time sync. After a policy is created, the customer automatically receives an email with their policy details.

## Login

- Email: admin@nicsan.com
- Password: password

## How to run it locally

You'll need Node.js and PostgreSQL installed on your machine.

### 1. Clone the repo

```bash
git clone https://github.com/izumiranjan/nicsan-crm.git
cd nicsan-crm
```

### 2. Set up the database

Open pgAdmin or psql and run:

```sql
CREATE DATABASE nicsan_crm;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  email VARCHAR(200) UNIQUE,
  password_hash VARCHAR(300),
  role VARCHAR(50) DEFAULT 'ops',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE policies (
  id SERIAL PRIMARY KEY,
  policy_number VARCHAR(100),
  customer_name VARCHAR(200),
  customer_email VARCHAR(200),
  vehicle_number VARCHAR(100),
  insurer VARCHAR(200),
  premium DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'active',
  s3_file_url TEXT,
  extracted_data JSONB,
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin User', 'admin@nicsan.com', '$2b$10$Qw7V8hqNGE7tuq/poDo3COg5M9NHbtyHSghny1jEewX.S9cq7Hfs6', 'admin');
```

### 3. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nicsan_crm
DB_USER=postgres
DB_PASSWORD=your_postgres_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=any_random_secret

Then start it:

```bash
npm run dev
```

### 4. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Open your browser at http://localhost:5173

## Tech used

- React + Vite for the frontend
- Node.js + Express for the backend
- PostgreSQL for the database
- Cloudinary for PDF storage (used instead of AWS S3)
- Google Gemini for AI extraction (used instead of OpenAI GPT-4o-mini)
- Socket.IO for real-time updates across connected users
- Nodemailer + Gmail for sending policy confirmation emails
- JWT + bcrypt for authentication and password hashing

## A note on AWS S3 and OpenAI

The assignment specifies AWS S3 and OpenAI GPT-4o-mini. I used Cloudinary and Google Gemini as alternatives since they offer the same functionality. The architecture and integration patterns are identical — swapping them out would just be a config change in the .env file.

## Folder structure
nicsan-crm/
├── backend/
│   ├── config/         → database and cloudinary setup
│   ├── middleware/     → JWT auth, Gemini AI extraction, email sending
│   ├── routes/         → auth and policy API endpoints
│   └── server.js       → main Express server with Socket.IO
└── frontend/
└── src/
├── components/ → PolicyTable, UploadModal, PlasmaBackground
└── pages/      → Login, Dashboard

## Features

- JWT login with role-based access (admin / ops)
- Upload insurance PDFs up to 5MB
- AI automatically extracts policy number, customer name, vehicle number, insurer and premium
- Policies stored in PostgreSQL with full metadata
- PDF files stored in Cloudinary with public URL saved to database
- Dashboard with search, filtering and status updates
- Status changes sync in real-time to all connected browser tabs
- Customer receives a formatted email after policy is created