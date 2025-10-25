package com.habittracker.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.habittracker.entity.Habit;
import com.habittracker.entity.HabitLog;
import com.habittracker.service.HabitService;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "*")
public class HabitController {
    
    @Autowired
    private HabitService habitService;
    
    @GetMapping
    public ResponseEntity<List<Habit>> getAllHabits() {
        List<Habit> habits = habitService.getAllActiveHabits();
        return ResponseEntity.ok(habits);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Habit> getHabitById(@PathVariable Long id) {
        return habitService.getHabitById(id)
                .map(habit -> ResponseEntity.ok().body(habit))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Habit> createHabit(@RequestBody Habit habit) {
        Habit createdHabit = habitService.createHabit(habit);
        return ResponseEntity.ok(createdHabit);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Habit> updateHabit(@PathVariable Long id, @RequestBody Habit habitDetails) {
        try {
            Habit updatedHabit = habitService.updateHabit(id, habitDetails);
            return ResponseEntity.ok(updatedHabit);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{id}/toggle")
    public ResponseEntity<HabitLog> toggleHabitCompletion(@PathVariable Long id, 
                                                         @RequestParam(required = false) String date) {
        LocalDate logDate = date != null ? LocalDate.parse(date) : LocalDate.now();
        try {
            HabitLog habitLog = habitService.toggleHabitCompletion(id, logDate);
            return ResponseEntity.ok(habitLog);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{id}/logs")
    public ResponseEntity<List<HabitLog>> getHabitLogs(@PathVariable Long id,
                                                      @RequestParam(required = false) String startDate,
                                                      @RequestParam(required = false) String endDate) {
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().minusDays(30);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();
        
        List<HabitLog> logs = habitService.getHabitLogsForDateRange(id, start, end);
        return ResponseEntity.ok(logs);
    }
    
    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Object>> getHabitStats(@PathVariable Long id) {
        try {
            Map<String, Object> stats = habitService.getHabitStats(id);
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = habitService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/today")
    public ResponseEntity<List<HabitLog>> getTodayLogs() {
        List<HabitLog> logs = habitService.getTodayLogs();
        return ResponseEntity.ok(logs);
    }
}
