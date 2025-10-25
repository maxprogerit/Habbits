package com.habittracker.config;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.habittracker.entity.Habit;
import com.habittracker.entity.HabitLog;
import com.habittracker.repository.HabitLogRepository;
import com.habittracker.repository.HabitRepository;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private HabitLogRepository habitLogRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only load sample data if database is empty
        if (habitRepository.count() == 0) {
            loadSampleData();
        }
    }

    private void loadSampleData() {
        // Create sample habits
        List<Habit> sampleHabits = Arrays.asList(
            new Habit("Morning Exercise", "30 minutes of physical activity", "fas fa-dumbbell"),
            new Habit("Read for 20 minutes", "Daily reading habit", "fas fa-book"),
            new Habit("Drink 8 glasses of water", "Stay hydrated throughout the day", "fas fa-tint"),
            new Habit("Meditation", "10 minutes of mindfulness", "fas fa-brain"),
            new Habit("Walk 10,000 steps", "Daily walking goal", "fas fa-walking")
        );

        // Save habits
        List<Habit> savedHabits = habitRepository.saveAll(sampleHabits);

        // Generate sample logs for the past 30 days
        Random random = new Random();
        LocalDate today = LocalDate.now();
        
        for (Habit habit : savedHabits) {
            for (int i = 30; i >= 0; i--) {
                LocalDate logDate = today.minusDays(i);
                
                // Simulate different completion rates for different habits
                double completionRate = getCompletionRate(habit.getName());
                boolean completed = random.nextDouble() < completionRate;
                
                if (completed || random.nextDouble() < 0.3) { // 30% chance to log even if not completed
                    HabitLog log = new HabitLog(habit, logDate, completed);
                    if (completed && random.nextDouble() < 0.2) { // 20% chance to add notes when completed
                        log.setNotes("Feeling great!");
                    }
                    habitLogRepository.save(log);
                }
            }
        }

        System.out.println("Sample data loaded successfully!");
    }

    private double getCompletionRate(String habitName) {
        // Different habits have different typical completion rates
        switch (habitName.toLowerCase()) {
            case "morning exercise":
                return 0.7; // 70% completion rate
            case "read for 20 minutes":
                return 0.8; // 80% completion rate
            case "drink 8 glasses of water":
                return 0.6; // 60% completion rate
            case "meditation":
                return 0.75; // 75% completion rate
            case "walk 10,000 steps":
                return 0.65; // 65% completion rate
            default:
                return 0.7; // Default 70% completion rate
        }
    }
}
