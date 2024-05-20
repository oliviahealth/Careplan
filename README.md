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

## Environment Variables
Contact @sumitnalavade for details

**Frontend:** `VITE_API_URL`

**Backend:** `SQLALCHEMY_DATABASE_URI` `SECRET_KEY`


## Run Locally  
Clone the project  
~~~bash  
  git clone https://github.com/oliviahealth/Careplan.git
~~~

Go to the project directory  
~~~bash  
  cd Careplan
~~~

Install frontend dependencies  
~~~bash  
cd frontend
~~~

~~~bash  
npm install
~~~

Add frontend environment Variables
~~~bash  
touch .env
~~~

~~~bash  
VITE_API_URL
~~~

Start frontend client
~~~bash  
npm run dev
~~~

Install backend dependencies
~~~bash  
cd backend
~~~

~~~bash  
pip install -r requirements.txt
~~~

Add backend environment variables
~~~bash  
touch .env
~~~

~~~bash  
SQLALCHEMY_DATABASE_URI

SECRET_KEY
~~~

Start the server  
~~~bash  
python wsgi.py
~~~  

