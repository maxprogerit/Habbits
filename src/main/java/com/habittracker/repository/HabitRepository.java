package com.habittracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.habittracker.entity.Habit;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    
    List<Habit> findByIsActiveTrue();
    
    @Query("SELECT h FROM Habit h WHERE h.isActive = true ORDER BY h.createdDate DESC")
    List<Habit> findActiveHabitsOrderByCreatedDate();
}
