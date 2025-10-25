package com.habittracker.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.habittracker.entity.Habit;
import com.habittracker.entity.HabitLog;
import com.habittracker.repository.HabitLogRepository;
import com.habittracker.repository.HabitRepository;

@Service
@Transactional
public class HabitService {
    
    @Autowired
    private HabitRepository habitRepository;
    
    @Autowired
    private HabitLogRepository habitLogRepository;
    
    public List<Habit> getAllActiveHabits() {
        return habitRepository.findActiveHabitsOrderByCreatedDate();
    }
    
    public Optional<Habit> getHabitById(Long id) {
        return habitRepository.findById(id);
    }
    
    public Habit createHabit(Habit habit) {
        return habitRepository.save(habit);
    }
    
    public Habit updateHabit(Long id, Habit habitDetails) {
        return habitRepository.findById(id)
                .map(habit -> {
                    habit.setName(habitDetails.getName());
                    habit.setDescription(habitDetails.getDescription());
                    habit.setIcon(habitDetails.getIcon());
                    return habitRepository.save(habit);
                })
                .orElseThrow(() -> new RuntimeException("Habit not found with id: " + id));
    }
    
    public void deleteHabit(Long id) {
        habitRepository.findById(id)
                .ifPresent(habit -> {
                    habit.setIsActive(false);
                    habitRepository.save(habit);
                });
    }
    
    public HabitLog toggleHabitCompletion(Long habitId, LocalDate date) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found with id: " + habitId));
        
        Optional<HabitLog> existingLog = habitLogRepository.findByHabitAndLogDate(habit, date);
        
        if (existingLog.isPresent()) {
            HabitLog log = existingLog.get();
            log.setCompleted(!log.getCompleted());
            return habitLogRepository.save(log);
        } else {
            HabitLog newLog = new HabitLog(habit, date, true);
            return habitLogRepository.save(newLog);
        }
    }
    
    public List<HabitLog> getHabitLogsForDateRange(Long habitId, LocalDate startDate, LocalDate endDate) {
        return habitLogRepository.findByHabitIdAndDateRange(habitId, startDate, endDate);
    }
    
    public List<HabitLog> getTodayLogs() {
        return habitLogRepository.findByLogDate(LocalDate.now());
    }
    
    public Map<String, Object> getHabitStats(Long habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found with id: " + habitId));
        
        Long totalCompletions = habitLogRepository.countCompletedByHabitId(habitId);
        
        // Get weekly stats (last 7 days)
        LocalDate weekStart = LocalDate.now().minusDays(6);
        List<HabitLog> weekLogs = habitLogRepository.findByHabitIdAndDateRange(habitId, weekStart, LocalDate.now());
        long weekCompletions = weekLogs.stream().mapToLong(log -> log.getCompleted() ? 1 : 0).sum();
        
        // Get monthly stats (last 30 days)
        LocalDate monthStart = LocalDate.now().minusDays(29);
        List<HabitLog> monthLogs = habitLogRepository.findByHabitIdAndDateRange(habitId, monthStart, LocalDate.now());
        long monthCompletions = monthLogs.stream().mapToLong(log -> log.getCompleted() ? 1 : 0).sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("habitName", habit.getName());
        stats.put("totalCompletions", totalCompletions);
        stats.put("weeklyCompletions", weekCompletions);
        stats.put("monthlyCompletions", monthCompletions);
        stats.put("weeklyPercentage", Math.round((weekCompletions / 7.0) * 100));
        stats.put("monthlyPercentage", Math.round((monthCompletions / 30.0) * 100));
        
        return stats;
    }
    
    public Map<String, Object> getDashboardStats() {
        List<Habit> activeHabits = getAllActiveHabits();
        List<HabitLog> todayLogs = getTodayLogs();
        
        long todayCompletions = todayLogs.stream().mapToLong(log -> log.getCompleted() ? 1 : 0).sum();
        long todayTotal = activeHabits.size();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalHabits", todayTotal);
        stats.put("todayCompletions", todayCompletions);
        stats.put("todayPercentage", todayTotal > 0 ? Math.round((todayCompletions / (double) todayTotal) * 100) : 0);
        
        return stats;
    }
}
