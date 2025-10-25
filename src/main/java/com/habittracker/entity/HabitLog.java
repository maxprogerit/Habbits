package com.habittracker.entity;

import java.time.LocalDate;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "habit_logs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"habit_id", "log_date"})
})
public class HabitLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id", nullable = false)
    private Habit habit;
    
    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;
    
    @Column(nullable = false)
    private Boolean completed = false;
    
    @Column
    private String notes;

    // Constructors
    public HabitLog() {}

    public HabitLog(Habit habit, LocalDate logDate, Boolean completed) {
        this.habit = habit;
        this.logDate = logDate;
        this.completed = completed;
    }

    public HabitLog(Habit habit, LocalDate logDate, Boolean completed, String notes) {
        this(habit, logDate, completed);
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Habit getHabit() {
        return habit;
    }

    public void setHabit(Habit habit) {
        this.habit = habit;
    }

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HabitLog habitLog = (HabitLog) o;
        return Objects.equals(id, habitLog.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "HabitLog{" +
                "id=" + id +
                ", habit=" + (habit != null ? habit.getName() : null) +
                ", logDate=" + logDate +
                ", completed=" + completed +
                ", notes='" + notes + '\'' +
                '}';
    }
}
