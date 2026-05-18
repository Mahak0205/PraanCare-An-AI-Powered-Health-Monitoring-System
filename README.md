# 🩺 PraanCare – An AI Powered Health Monitoring System

PraanCare is an AI-integrated web-based health monitoring platform designed to empower users with accessible, AI-driven assessments for cardiac, eye, sleep, and mental health conditions.

The platform enables users to input health-related parameters, after which trained Machine Learning and Deep Learning models perform real-time analysis to predict potential health risks. By integrating modern web technologies, robust backend architecture, and advanced AI models, PraanCare delivers personalized predictions, AI-generated insights, progress tracking, and report generation.

> ⚠️ PraanCare is not a replacement for professional medical consultation. It serves as an early detection and awareness tool to encourage timely medical attention and preventive healthcare.

---

# 🚀 Features

## 🔐 Authentication & Security
- Email & Password Authentication
- Google OAuth Login
- JWT-based Authorization
- Secure User Sessions

## ❤️ Cardiac Health Prediction
- Predicts potential cardiac risks
- Uses clinically relevant health parameters
- Powered by LightGBM-based ML model

## 🧠 Mental Health Assessment
- Depression Detection
- Anxiety Detection
- Stress Analysis
- Questionnaire-based prediction system

## 👁️ Eye Health Analysis
- Predicts eye-related health risks
- Uses ML pipeline with health & vision metrics

## 😴 Sleep Disorder Prediction
- Analyzes sleep patterns
- Predicts possible sleep disturbances

## 📊 Progress Tracking
- Historical prediction records
- Interactive charts and graphs
- Health trend monitoring

## 📄 Report Generation
- Downloadable PDF reports
- AI-generated health insights
- Personalized summaries

## 🤖 AI Assistant
- Powered using Groq API
- Uses `llama-3.3-70b-versatile`
- Provides AI-based health insights

---

# 🛠️ Tech Stack

## Frontend
- React + Vite
- HTML/CSS
- JavaScript

## Backend
- Node.js
- Express.js

## Database
- MongoDB (Local)

## Machine Learning / AI
- TensorFlow
- Scikit-learn
- Ensemble Learning
- LightGBM

## APIs & Services
- Groq API
- Brevo SMTP API
- Google OAuth API

## Authentication
- JWT Authentication
- Google OAuth

---

# 📁 Project Structure

```bash
PraanCare/
│
├── client/                 # React + Vite Frontend
│
├── server/                 # Express Backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── python_codes/       # ML Models & Python Scripts
│   └── index.js
│
└── README.md
```

---

# ⚙️ Environment Variables

## Client `.env`

```env
VITE_CLIENT_ID=your_google_client_id
```

---

## Server `.env`

```env
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

DB_URL=your_mongodb_url

JWT_SECRET=your_jwt_secret
JWT_TIMEOUT=your_jwt_timeout

BREVO_SMTP_USER=your_brevo_email
BREVO_SMTP_PASS=your_brevo_password
SUPPORT_EMAIL=your_support_email

GROQ_API_KEY=your_groq_api_key
```

---

# 🧪 Backend Setup

## 1️⃣ Clone Repository

```bash
git clone <your_repo_url>
cd PraanCare
```

---

## 2️⃣ Setup Python Virtual Environment

Navigate to Python ML folder:

```bash
cd server/python_codes
```

Create virtual environment:

```bash
py -3.10 -m venv venv
```

Activate virtual environment:

### Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

Install Python dependencies:

```bash
pip install tensorflow numpy pandas scikit-learn joblib flask
```

---

## 3️⃣ Setup Node Backend

Navigate to server folder:

```bash
cd ..
```

Install dependencies:

```bash
npm install
```

Start backend server:

```bash
npm start
```

---

# 💻 Frontend Setup

Navigate to frontend folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

---

# 🤖 Machine Learning Models

PraanCare integrates multiple AI/ML models for disease prediction and health analysis, including:

- Ensemble Learning Models
- TensorFlow-based Models
- LightGBM Models
- Scikit-learn Pipelines

The models are used for:
- Cardiac Health Prediction
- Eye Health Prediction
- Mental Health Assessment
- Sleep Disorder Analysis

# 📦 ML Model Files Setup

Due to large file sizes, the trained Machine Learning model files are not included in this repository.

Download all required model files from the following Google Drive link:

https://drive.google.com/drive/folders/1dtBl0YKfDh-SiEcIfe-bSJ_e1E4LOjuI

After downloading, place the files in the following structure exactly as shown below:

```bash
server/
└── python_codes/
    ├── Cardiac/
    │   ├── lgbm_heart_disease_model.pkl
    │   └── scaler_heart_disease.pkl
    │
    ├── Sleep/
    │   └── sleep_model.pkl
    │
    ├── Eye/
    │   └── trained_models/
    │       └── (place the complete folder exactly as downloaded)
    │
    └── Mental/
        ├── anx_model.pkl
        ├── dep_model.pkl
        └── stress_model.pkl
```

> ⚠️ Important:
> - Do not rename any files or folders.
> - Ensure the `trained_models` folder inside `Eye/` is copied exactly as provided in the Drive.
> - The backend prediction modules will not function correctly if the file structure is altered.

---

# 📈 Key Functionalities

- Real-time health prediction
- Historical health tracking
- AI-generated insights
- Report generation
- Interactive dashboards
- Secure authentication
- Personalized user profiles

---

# 🔒 Security Features

- JWT Authentication
- OAuth 2.0 Login
- Protected Routes
- Environment Variable Protection
- Secure API Handling

---

# 🎯 Future Scope

- Wearable Device Integration
- Real-time Monitoring
- Cloud Deployment
- Mobile Application
- Advanced AI-based Recommendations
- Doctor Consultation Integration

---

# 👥 Target Users

- Elderly Individuals
- Working Professionals
- Health-conscious Users
- Preventive Healthcare Monitoring

---

# 📜 Disclaimer

PraanCare is intended solely for educational, awareness, and early detection purposes. It does not provide professional medical diagnosis or treatment recommendations.

Users are advised to consult qualified healthcare professionals for medical concerns.

---

# 📷 Screenshots

_Add screenshots of:_
- Login Page
- Dashboard
- Prediction Modules
- Progress Tracker
- AI Reports

---

# 🌟 Acknowledgements

- TensorFlow
- Scikit-learn
- Groq API
- MongoDB
- React
- Node.js
- Express.js

---

# 📄 License

This project is intended for educational and research purposes.