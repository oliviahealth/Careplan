# Olivia - Careplan

Olivia Careplan is a digitized implementation of the Plan Of Safe Care.

The original Plan Of Safe Care is a collection of documents designed by the Texas A&M School of Nursing to address the social and health concerns of families and is intended to be completed by the family in collaboration with relevant providers.

The Olivia Careplan project aims to make the Plan of Safe Care more accessible and user friendly for the families we serve.

- Implements all forms in the original Plan Of Safe Care in a digital format
- Ensures full CRUD functionality of data in a user friendly manner
- Ability to create user accounts to electronically store and revisit past data
- Future plans include fine grained access controls to allow families to share data

## Screenshots
<img src="https://github.com/oliviahealth/Careplan/assets/48499839/8793da7c-ea37-4fbb-b4df-cbe2566d1d5f" />

<img src="https://github.com/oliviahealth/Careplan/assets/48499839/5f1e9f65-ee94-42b6-b746-b65b7174c2aa" />

<img src="https://github.com/oliviahealth/Careplan/assets/48499839/8d0c07c6-47d2-48c7-be40-cc1828dfbf9d" />

## Tech Stack  
**Client:** TypeScript, React, React Query, Zod, Zustand, TailwindCSS

**Server:** Python, Flask, Flask-JWT, PostgreSQL, SQLAlchemy

## Careplan Local Development Guide
This guide covers the necessary dependencies and steps to run the Careplan application locally.

The application runs using two Docker containers:
- Frontend: React application
- Backend: Flask application

### Prerequisites
You must have the following installed:
- Docker
- Git

### Step 1: Clone the Repository
``` bash
git clone https://github.com/oliviahealth/Careplan.git
cd Careplan
```

### Step 2: Create Environment Variables
#### Backend
In the `backend` subdirectory, create a file named:
``` bash
.env
```
Add the following contents:
``` bash
SECRET_KEY=super-secret-dev-key
SQLALCHEMY_DATABASE_URI=postgresql+psycopg2://careplan:careplan@db:5432/careplan
```

#### Frontend
In the `frontend` subdirectory, create a file named:
``` bash
.env
```
Add the following contents:
``` bash
VITE_API_URL='http://localhost:8000'
```

### Step 3: Build and Run Containers
From the root directory, run:
``` bash
docker compose up
```

### Step 4: Access application
#### Frontend
``` bash
http://localhost:5174/careplan/
```

#### Backend
``` bash
http://localhost:5000/
```
### Step 5: Stop the Application
``` bash
docker compose down
```
