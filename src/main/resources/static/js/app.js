// Habit Tracker Application
class HabitTracker {
    constructor() {
        this.habits = [];
        this.init();
    }

    async init() {
        await this.loadHabits();
        this.setupEventListeners();
        this.setupTheme();
        await this.updateDashboardStats();
    }

    setupEventListeners() {
        // Form submission
        const habitForm = document.getElementById('habit-form');
        if (habitForm) {
            habitForm.addEventListener('submit', (e) => this.handleAddHabit(e));
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    setupTheme() {
        // Check for saved theme or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    async loadHabits() {
        try {
            const response = await fetch('/api/habits');
            if (response.ok) {
                this.habits = await response.json();
                await this.renderHabits();
            } else {
                console.error('Failed to load habits');
            }
        } catch (error) {
            console.error('Error loading habits:', error);
        }
    }

    async renderHabits() {
        const habitsList = document.getElementById('habits-list');
        if (!habitsList) return;

        if (this.habits.length === 0) {
            habitsList.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-plus-circle text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-500 dark:text-gray-400">No habits yet. Add your first habit above!</p>
                </div>
            `;
            return;
        }

        // Get today's logs
        const todayLogs = await this.getTodayLogs();
        const logMap = new Map(todayLogs.map(log => [log.habit.id, log]));

        habitsList.innerHTML = this.habits.map(habit => {
            const log = logMap.get(habit.id);
            const isCompleted = log && log.completed;

            return `
                <div class="habit-card ${isCompleted ? 'completed' : ''} bg-white dark:bg-gray-700 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-600 transition-all duration-300">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="${habit.icon || 'fas fa-check'} text-2xl text-blue-600"></i>
                            <div>
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white">${this.escapeHtml(habit.name)}</h3>
                                ${habit.description ? `<p class="text-sm text-gray-500 dark:text-gray-400">${this.escapeHtml(habit.description)}</p>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center space-x-3">
                            <input type="checkbox" 
                                   class="habit-toggle" 
                                   ${isCompleted ? 'checked' : ''} 
                                   data-habit-id="${habit.id}"
                                   onchange="habitTracker.toggleHabit(${habit.id}, this)">
                            <button onclick="habitTracker.deleteHabit(${habit.id})" 
                                    class="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    async getTodayLogs() {
        try {
            const response = await fetch('/api/habits/today');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error loading today logs:', error);
        }
        return [];
    }

    async handleAddHabit(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const habit = {
            name: document.getElementById('habit-name').value.trim(),
            description: document.getElementById('habit-description').value.trim(),
            icon: document.getElementById('habit-icon').value
        };

        if (!habit.name) {
            this.showNotification('Please enter a habit name', 'error');
            return;
        }

        try {
            const response = await fetch('/api/habits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(habit)
            });

            if (response.ok) {
                const newHabit = await response.json();
                this.habits.push(newHabit);
                await this.renderHabits();
                await this.updateDashboardStats();
                form.reset();
                this.showNotification('Habit added successfully!', 'success');
            } else {
                throw new Error('Failed to create habit');
            }
        } catch (error) {
            console.error('Error creating habit:', error);
            this.showNotification('Failed to add habit. Please try again.', 'error');
        }
    }

    async toggleHabit(habitId, checkbox) {
        const originalState = checkbox.checked;

        try {
            const response = await fetch(`/api/habits/${habitId}/toggle`, {
                method: 'POST'
            });

            if (response.ok) {
                await this.renderHabits();
                await this.updateDashboardStats();
                this.showNotification(
                    originalState ? 'Habit completed! 🎉' : 'Habit unmarked',
                    'success'
                );
            } else {
                checkbox.checked = !originalState;
                throw new Error('Failed to toggle habit');
            }
        } catch (error) {
            console.error('Error toggling habit:', error);
            checkbox.checked = !originalState;
            this.showNotification('Failed to update habit. Please try again.', 'error');
        }
    }

    async deleteHabit(habitId) {
        if (!confirm('Are you sure you want to delete this habit?')) {
            return;
        }

        try {
            const response = await fetch(`/api/habits/${habitId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.habits = this.habits.filter(habit => habit.id !== habitId);
                await this.renderHabits();
                await this.updateDashboardStats();
                this.showNotification('Habit deleted successfully', 'success');
            } else {
                throw new Error('Failed to delete habit');
            }
        } catch (error) {
            console.error('Error deleting habit:', error);
            this.showNotification('Failed to delete habit. Please try again.', 'error');
        }
    }

    async updateDashboardStats() {
        try {
            const response = await fetch('/api/habits/dashboard/stats');
            if (response.ok) {
                const stats = await response.json();

                // Update DOM elements
                const totalHabitsEl = document.getElementById('total-habits');
                const todayProgressEl = document.getElementById('today-progress');
                const successRateEl = document.getElementById('success-rate');

                if (totalHabitsEl) totalHabitsEl.textContent = stats.totalHabits || 0;
                if (todayProgressEl) todayProgressEl.textContent = `${stats.todayCompletions || 0}/${stats.totalHabits || 0}`;
                if (successRateEl) successRateEl.textContent = `${stats.todayPercentage || 0}%`;
            }
        } catch (error) {
            console.error('Error updating dashboard stats:', error);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;

        // Set colors based on type
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            info: 'bg-blue-500 text-white'
        };

        notification.className += ` ${colors[type] || colors.info}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.habitTracker = new HabitTracker();
});
