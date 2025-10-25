# Habit Tracker

A comprehensive habit tracking application built with Java Spring Boot, featuring daily habit logging, progress analytics, and a modern responsive interface with dark mode support.

## 🚀 Features

- **Daily Habit Management**: Create, edit, and delete habits with customizable names and icons
- **Simple Toggle Interface**: Easy one-click habit completion tracking
- **Progress Analytics**: 
  - Weekly progress visualization with bar charts
  - Monthly overview with line charts
  - Success rate calculations and statistics
- **Dark Mode Support**: Persistent theme switching with smooth transitions
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Data Persistence**: Local H2 database with automatic sample data loading

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 3.2.0, Spring Data JPA
- **Database**: H2 (in-memory for development)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome
- **Build Tool**: Maven

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

## 🏃‍♂️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker
```

### 2. Build and Run

```bash
# Build the application
mvn clean compile

# Run the application
mvn spring-boot:run
```

### 3. Access the Application

- **Main Dashboard**: http://localhost:8080
- **Analytics Page**: http://localhost:8080/analytics
- **H2 Database Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: `password`

## 📊 API Endpoints

### Habits
- `GET /api/habits` - Get all active habits
- `POST /api/habits` - Create a new habit
- `PUT /api/habits/{id}` - Update a habit
- `DELETE /api/habits/{id}` - Delete a habit (soft delete)
- `GET /api/habits/{id}/stats` - Get habit statistics

### Habit Logs
- `POST /api/habits/{id}/toggle` - Toggle habit completion for today (or specified date)
- `GET /api/habits/{id}/logs` - Get habit logs for date range
- `GET /api/habits/today` - Get today's habit logs
- `GET /api/habits/dashboard/stats` - Get dashboard statistics

## 🎨 Features in Detail

### Dashboard
- Overview of all active habits
- Today's progress statistics
- Quick habit creation form
- One-click habit completion toggles

### Analytics
- Habit selection dropdown
- Weekly progress bar chart
- Monthly trend line chart
- Detailed statistics (completion rates, streaks)

### Dark Mode
- Automatic theme detection
- Persistent theme storage
- Smooth color transitions
- Chart theme adaptation

## 🏗️ Architecture

```
src/main/java/com/habittracker/
├── entity/          # JPA entities (Habit, HabitLog)
├── repository/      # Data access layer
├── service/         # Business logic layer
├── controller/      # REST controllers and web controllers
├── config/          # Configuration and data loading
└── HabitTrackerApplication.java

src/main/resources/
├── static/
│   ├── css/         # Custom styles and dark mode
│   └── js/          # Frontend JavaScript
├── templates/       # Thymeleaf templates
└── application.properties
```

## 🔄 Data Model

### Habit Entity
- `id` (Long) - Primary key
- `name` (String) - Habit name
- `description` (String) - Optional description
- `icon` (String) - Font Awesome icon class
- `createdDate` (LocalDate) - Creation date
- `isActive` (Boolean) - Soft delete flag

### HabitLog Entity
- `id` (Long) - Primary key
- `habit` (Habit) - Reference to habit
- `logDate` (LocalDate) - Date of log entry
- `completed` (Boolean) - Completion status
- `notes` (String) - Optional notes

## 🎯 Learning Objectives

This project demonstrates:
- **State Management**: Frontend JavaScript state handling
- **Data Persistence**: JPA/Hibernate with H2 database
- **Chart Integration**: Chart.js for data visualization
- **REST API Design**: RESTful endpoint patterns
- **Responsive Design**: Mobile-first CSS with Tailwind
- **Theme Management**: Dark mode implementation

## 🚀 Deployment

### Production Configuration

For production deployment, update `application.properties`:

```properties
# Use persistent database
spring.datasource.url=jdbc:h2:file:./data/habittracker
spring.jpa.hibernate.ddl-auto=update

# Disable H2 console in production
spring.h2.console.enabled=false
```

### Docker Deployment

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/habit-tracker-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 🤝 Contributing

This project is perfect for open-source contributions! Here are some ideas:

### Beginner-Friendly Features
- Add habit categories/tags
- Implement habit streaks calculation
- Create habit reminders/notifications
- Add habit templates
- Export data functionality

### Advanced Features
- User authentication and profiles
- Habit sharing between users
- Advanced analytics and insights
- Mobile app using React Native
- API rate limiting and caching

### Getting Started with Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Chart.js for beautiful data visualizations
- Tailwind CSS for rapid UI development
- Font Awesome for the icon library

---

**Happy Habit Tracking! 🎯**
