# CampusExchange

CampusExchange is a full-stack marketplace platform designed for college communities, allowing students to securely buy, sell, and exchange used academic and personal items. The application implements JWT-based authentication, role-based authorization, REST APIs, and scalable backend architecture using Spring Boot.

Students can:

- Register/Login
- Upload products
- Search products
- View product details
- Report listings
- Manage their own products

## Tech Stacks

- Backend:
  - Java
  - Spring Boot
  - Spring Security
  - Spring Data JPA & Hibernate
  - MySQL Database
  - Maven Build System

- Frontend:
  - React
  - Material UI
  - Axios

-Others

- REST APIs
- Git
- GitHub

## Features

### Authentication & Security

- Secure user registration and login using JWT authentication.
- Role-based authentication with protected routes for students.
- Input validation and global exception handling for reliable API responses.
- Secure file upload handling for product and profile images.

### Product Management

- Create, edit, and delete product listings.
- Upload multiple images for a single product.
- Browse products posted by other students.
- View detailed product information.
- Mark products as "Available" or "Sold".
- Manage personal product listings.

### Search & Discovery

- Search products using keywords.
- Dynamic search with multiple filters.
- Filter products by category, price range, college, Availability and location.
- Sort products based on different criteria.
- Pagination for product listings.
- Recently added products section.

### User Features

- View and update user profile information.
- Upload and manage profile pictures.
- Add and remove products from the wishlist.
- View and manage wishlist items.
- Report inappropriate or fraudulent product listings.
- Receive and manage in-app notifications.
- Mark notifications as read.

### Technical Features

- Responsive and mobile-friendly user interface.
- Clean UI built using React and Material UI.
- Fast single-page application (SPA) experience.
- RESTful APIs developed using Spring Boot.
- MySQL database integration using Spring Data JPA and Hibernate.
- Layered backend architecture (Controller → Service → Repository).
- DTO-based request and response handling.

## Project Structure

The application is divided into two parts:

- **Backend**: Developed with Spring Boot, responsible for user authentication, product management, business logic, and database interactions.
- **Frontend**: Developed with React and Material UI, providing a clean and responsive interface for browsing, buying, and selling products.

CampusExchange/

├── backend/

│ ├── controller/

│ ├── service/

│ ├── repository/

│ ├── entity/

│ └── security/


├── frontend/

│ ├── components/

│ ├── pages/

│ ├── services/

│ └── utils/


## Backend Architecture

The backend follows a layered architecture:

Controller Layer:

- Handles HTTP requests and responses.
- Exposes REST APIs.

Service Layer:

- Contains business logic.
- Handles product and user operations.

Repository Layer:

- Communicates with MySQL database using Spring Data JPA.

Security Layer:

- JWT authentication.
- Role-based authorization.
- Protected API endpoints.

# Installation

## Backend

cd backend

./mvnw spring-boot:run

## Frontend

cd frontend

npm install

npm run dev

## API endpoints

POST /api/auth/register

POST /api/auth/login

GET /api/products

POST /api/products

PUT /api/products/{id}

DELETE /api/products/{id}

## Future Improvements

-Real-time Chat Between Buyers and Sellers

-Product Ratings & Reviews

-Recently Viewed Products

-Email Notifications

-AI-Based Recommendations
