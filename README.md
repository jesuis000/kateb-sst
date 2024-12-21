# Kateb STT (Speech-to-Text) Service

A web application that provides Arabic speech-to-text transcription services with user authentication and quota management.

## Project Structure

```
kateb-stt/
├── backend/         # Django backend
└── frontend/        # React frontend
```

## Features

- User authentication (login/register)
- Audio recording and file upload
- Arabic speech-to-text transcription
- Real-time word highlighting during playback
- User quota management
- Admin interface for managing users and quotas

## Prerequisites

Before running the project, make sure you have the following installed:
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn
- Git

## Backend Setup (Django)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Apply database migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Start the development server:
```bash
python manage.py runserver
```

The backend will be available at http://localhost:8000

## Frontend Setup (React)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

## Usage

1. Register a new user account or login with existing credentials
2. Upload an audio file or record audio directly in the browser
3. Click "Transcribe" to process the audio
4. Play the audio to see synchronized word highlighting
5. Monitor your quota usage in the dashboard

## Admin Interface

Access the admin interface at http://localhost:8000/admin to:
- Manage user accounts
- Set and adjust user quotas
- View transcription history
- Monitor system usage

## API Endpoints

- `POST /api/register/`: User registration
- `POST /api/login/`: User authentication
- `GET /api/quota/`: Get user quota information
- `POST /api/transcribe/`: Submit audio for transcription

## Development

### Backend Development

- Models are defined in `models.py`
- Views are defined in `views.py`
- URLs are configured in `urls.py`
- Admin interface is configured in `admin.py`

### Frontend Development

- Components are in `frontend/src/components/`
- Authentication context is in `frontend/src/context/`
- API configuration is in `frontend/src/config/`