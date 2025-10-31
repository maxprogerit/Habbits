// Analytics Page JavaScript
class AnalyticsManager {
    constructor() {
        this.habits = [];
        this.selectedHabitId = null;
        this.charts = {};
        this.init();
    }

    async init() {
        await this.loadHabits();
        this.setupEventListeners();
        this.setupTheme();
        this.populateHabitSelector();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Habit selector
        const habitSelector = document.getElementById('habit-selector');
        if (habitSelector) {
            habitSelector.addEventListener('change', (e) => this.onHabitSelect(e.target.value));
        }
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        const html = document.documentElement;

        // Remove both classes first
        html.classList.remove('dark', 'light');

        // Add the current theme class
        html.classList.add(theme);

        // Also set data attribute for CSS
        html.setAttribute('data-theme', theme);

        // Save to localStorage
        localStorage.setItem('theme', theme);

        // Update theme toggle icon
        this.updateThemeToggleIcon(theme);
    }

    updateThemeToggleIcon(theme) {
        const moonIcon = document.querySelector('#theme-toggle .fa-moon');
        const sunIcon = document.querySelector('#theme-toggle .fa-sun');

        if (theme === 'dark') {
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIcon) sunIcon.style.display = 'inline';
        } else {
            if (moonIcon) moonIcon.style.display = 'inline';
            if (sunIcon) sunIcon.style.display = 'none';
        }
    }

    toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);

        // Update chart colors after theme change
        setTimeout(() => {
            if (this.selectedHabitId) {
                this.loadHabitAnalytics(this.selectedHabitId);
            }
        }, 100);
    }

    async loadHabits() {
        try {
            const response = await fetch('/api/habits');
            if (response.ok) {
                this.habits = await response.json();
            }
        } catch (error) {
            console.error('Error loading habits:', error);
        }
    }

    populateHabitSelector() {
        const selector = document.getElementById('habit-selector');
        if (!selector) return;

        selector.innerHTML = '<option value="">Select a habit...</option>';

        this.habits.forEach(habit => {
            const option = document.createElement('option');
            option.value = habit.id;
            option.textContent = habit.name;
            selector.appendChild(option);
        });
    }

    async onHabitSelect(habitId) {
        if (!habitId) {
            this.hideHabitStats();
            this.clearCharts();
            return;
        }

        this.selectedHabitId = habitId;
        await this.loadHabitAnalytics(habitId);
    }

    async loadHabitAnalytics(habitId) {
        try {
            // Load habit statistics
            const statsResponse = await fetch(`/api/habits/${habitId}/stats`);
            if (statsResponse.ok) {
                const stats = await statsResponse.json();
                this.updateHabitStats(stats);
            }

            // Load habit logs for charts
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const logsResponse = await fetch(`/api/habits/${habitId}/logs?startDate=${startDate}&endDate=${endDate}`);
            if (logsResponse.ok) {
                const logs = await logsResponse.json();
                this.updateCharts(logs);
            }

        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    updateHabitStats(stats) {
        document.getElementById('total-completions').textContent = stats.totalCompletions || 0;
        document.getElementById('weekly-percentage').textContent = `${stats.weeklyPercentage || 0}%`;
        document.getElementById('monthly-percentage').textContent = `${stats.monthlyPercentage || 0}%`;

        // Calculate current streak (simplified)
        document.getElementById('current-streak').textContent = '0'; // This would need more complex logic

        // Show stats container
        document.getElementById('habit-stats').style.display = 'block';
    }

    hideHabitStats() {
        document.getElementById('habit-stats').style.display = 'none';
    }

    updateCharts(logs) {
        this.createWeeklyChart(logs);
        this.createMonthlyChart(logs);
    }

    createWeeklyChart(logs) {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.weekly) {
            this.charts.weekly.destroy();
        }

        // Prepare weekly data (last 7 days)
        const weekData = this.prepareWeeklyData(logs);
        const isDark = document.documentElement.classList.contains('dark');

        this.charts.weekly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: weekData.labels,
                datasets: [{
                    label: 'Completed',
                    data: weekData.data,
                    backgroundColor: weekData.data.map(val => val ? '#dc143c' : '#6b7280'),
                    borderColor: weekData.data.map(val => val ? '#b01e37' : '#4b5563'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: isDark ? '#f9fafb' : '#1f2937'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            stepSize: 1,
                            color: isDark ? '#d1d5db' : '#6b7280',
                            callback: function (value) {
                                return value === 1 ? 'Done' : 'Not Done';
                            }
                        },
                        grid: {
                            color: isDark ? '#374151' : '#e5e7eb'
                        }
                    },
                    x: {
                        ticks: {
                            color: isDark ? '#d1d5db' : '#6b7280'
                        },
                        grid: {
                            color: isDark ? '#374151' : '#e5e7eb'
                        }
                    }
                }
            }
        });
    }

    createMonthlyChart(logs) {
        const ctx = document.getElementById('monthlyChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.monthly) {
            this.charts.monthly.destroy();
        }

        // Prepare monthly data
        const monthData = this.prepareMonthlyData(logs);
        const isDark = document.documentElement.classList.contains('dark');

        this.charts.monthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthData.labels,
                datasets: [{
                    label: 'Completion Rate',
                    data: monthData.data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: isDark ? '#f9fafb' : '#1f2937'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: isDark ? '#d1d5db' : '#6b7280',
                            callback: function (value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: isDark ? '#374151' : '#e5e7eb'
                        }
                    },
                    x: {
                        ticks: {
                            color: isDark ? '#d1d5db' : '#6b7280'
                        },
                        grid: {
                            color: isDark ? '#374151' : '#e5e7eb'
                        }
                    }
                }
            }
        });
    }

    prepareWeeklyData(logs) {
        const today = new Date();
        const labels = [];
        const data = [];
        const logMap = new Map(logs.map(log => [log.logDate, log.completed]));

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            data.push(logMap.get(dateStr) ? 1 : 0);
        }

        return { labels, data };
    }

    prepareMonthlyData(logs) {
        const labels = [];
        const data = [];
        const logsByWeek = new Map();

        // Group logs by week
        logs.forEach(log => {
            const date = new Date(log.logDate);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!logsByWeek.has(weekKey)) {
                logsByWeek.set(weekKey, { completed: 0, total: 0 });
            }

            const week = logsByWeek.get(weekKey);
            week.total++;
            if (log.completed) week.completed++;
        });

        // Convert to chart data
        const sortedWeeks = Array.from(logsByWeek.entries()).sort();
        sortedWeeks.forEach(([weekKey, stats]) => {
            const weekDate = new Date(weekKey);
            labels.push(weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            data.push(stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0);
        });

        return { labels, data };
    }

    clearCharts() {
        if (this.charts.weekly) {
            this.charts.weekly.destroy();
            this.charts.weekly = null;
        }
        if (this.charts.monthly) {
            this.charts.monthly.destroy();
            this.charts.monthly = null;
        }
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
});
