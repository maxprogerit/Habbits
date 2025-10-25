# Habit Tracker - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Java Spring Boot habit tracker application with the following technology stack:
- **Backend**: Java Spring Boot with JPA/Hibernate
- **Database**: H2 (in-memory for development)
- **Frontend**: HTML, CSS, JavaScript with Tailwind CSS
- **Charts**: Chart.js for data visualization
- **Features**: Dark mode support, responsive design

## Code Style Guidelines
- Use consistent Java naming conventions (camelCase for variables/methods, PascalCase for classes)
- Follow Spring Boot best practices for controllers, services, and repositories
- Use proper error handling with try-catch blocks and meaningful error messages
- Write clean, readable JavaScript with ES6+ features
- Maintain responsive design principles with Tailwind CSS classes

## Architecture Patterns
- **MVC Pattern**: Controllers handle HTTP requests, Services contain business logic, Repositories handle data access
- **RESTful API**: All endpoints follow REST conventions
- **Frontend State Management**: JavaScript classes manage application state
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Key Features to Maintain
1. **Habit Management**: CRUD operations for habits
2. **Daily Logging**: Toggle habit completion for any date
3. **Analytics**: Weekly and monthly progress charts
4. **Dark Mode**: Theme persistence with localStorage
5. **Data Persistence**: H2 database with JPA entities

## Development Notes
- The application uses H2 in-memory database for development
- Sample data is loaded automatically on startup
- All API endpoints are under `/api/habits`
- Frontend uses fetch API for backend communication
- Charts are rendered using Chart.js with theme-aware colors

When making changes, ensure:
- Backend changes include proper error handling and validation
- Frontend updates maintain dark mode compatibility
- New features follow the existing architecture patterns
- API changes are reflected in both backend and frontend code
