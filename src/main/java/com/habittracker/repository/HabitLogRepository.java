package com.habittracker.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.habittracker.entity.Habit;
import com.habittracker.entity.HabitLog;

@Repository
public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    
    Optional<HabitLog> findByHabitAndLogDate(Habit habit, LocalDate logDate);
    
    List<HabitLog> findByHabitAndLogDateBetween(Habit habit, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT hl FROM HabitLog hl WHERE hl.habit.id = :habitId AND hl.logDate BETWEEN :startDate AND :endDate ORDER BY hl.logDate DESC")
    List<HabitLog> findByHabitIdAndDateRange(@Param("habitId") Long habitId, 
                                           @Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);
    
    @Query("SELECT hl FROM HabitLog hl WHERE hl.logDate = :date ORDER BY hl.habit.name")
    List<HabitLog> findByLogDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(hl) FROM HabitLog hl WHERE hl.habit.id = :habitId AND hl.completed = true")
    Long countCompletedByHabitId(@Param("habitId") Long habitId);
}
