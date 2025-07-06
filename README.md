# Weather Forecast API

This is a full-stack weather application built with Next.js, featuring real-time forecasts, user authentication with role-based access control, and a high-performance caching layer.

---

## Features

* **User Authentication**: Secure sign-in system with JWT sessions via NextAuth.js.
* **Role-Based Access Control (RBAC)**: Distinct `ADMIN` and `USER` roles.
    * **Admins** can create new users and view all weather query history.
    * **Users** can query for weather and view their own history.
* **Real-time & Forecast Data**: Fetches current weather and a 5-day forecast from the **OpenWeather API**.
* **Caching**: Uses **Redis** to cache API responses, improving performance and reducing external API calls.
* **Database**: Uses **PostgreSQL** with **Prisma ORM** for type-safe database interactions.
* **Modern UI**: A responsive, dark-themed UI built with Tailwind CSS.
* **Testing**: Includes unit and integration tests with Jest.
* **CI/CD**: A basic Continuous Integration pipeline with GitHub Actions to run tests automatically.

---

## Tech Stack

* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Caching**: Redis
* **Authentication**: NextAuth.js
* **Testing**: Jest

---

## Default Users

This application is seeded with a default admin user to allow for initial setup and testing.

* **Admin User**
    * **Email**: `rabia_admin@gmail.com`
    * **Password**: `admin123`

* **Example User**
    * An example user with the email `rabia_user@gmail.com` and password `user123` created for example. Also more user can be created after deploying the application. Log in as the admin, navigate to the **Admin Panel**, and use the "Create New User" form.

---

## Local Development Setup

### Prerequisites

* Node.js
* Docker and Docker Compose
* An API key from [OpenWeatherMap](https://openweathermap.org/)

### 1. Clone & Install

```bash
git clone https://github.com/rabiayrk/ready-to-weather/
cd ready-to-weather
npm install
```

### 2. Configure Environment Variables

Create your local environment file by copying the example file.

```bash
cp .env.example .env
```

Now, open the newly created `.env` file and fill in your secret values for the database, Redis, NextAuth, and the OpenWeather API key.

### 3. Run Local Services & Database Setup

This will start the PostgreSQL and Redis containers defined in `docker-compose.yml` and set up your database.

```bash
docker compose up -d

npx prisma migrate dev

npm run build:seed
npx prisma db seed
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---
## Deployment

This application is ready to be deployed to platforms like Vercel. When deploying:

1.  Import your Git repository into Vercel.
2.  Use Vercel's integrations to create production **Postgres** and **KV (Redis)** stores.
3.  Add all the necessary environment variables from your `.env.example` file to your Vercel project's settings, using the connection strings provided by Vercel's storage integrations.