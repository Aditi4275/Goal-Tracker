document.addEventListener('DOMContentLoaded', async () => {
    const goalsContainer = document.getElementById('goals-container');
    const dateFilter = document.getElementById('date-filter');
    
    async function fetchGoals(date = null) {
        goalsContainer.innerHTML = '<div class="loading">Loading your goals...</div>';
        
        try {
            const response = await fetch(`${API_URL}/goals/`);
            if (!response.ok) throw new Error('Failed to fetch goals');
            
            const goals = await response.json();
            displayGoals(goals, date);
        } catch (error) {
            console.error('Error:', error);
            goalsContainer.innerHTML = '<div class="error">Failed to load goals. Please try again later.</div>';
        }
    }
    
    function displayGoals(goals, filterDate = null) {
        if (goals.length === 0) {
            goalsContainer.innerHTML = '<div class="no-goals">No goals found. Start by adding a new goal!</div>';
            return;
        }
        
        let filteredGoals = goals;
        if (filterDate) {
            const filterDateStr = new Date(filterDate).toISOString().split('T')[0];
            filteredGoals = goals.filter(goal => {
                const goalDate = new Date(goal.created_at).toISOString().split('T')[0];
                return goalDate === filterDateStr;
            });
            
            if (filteredGoals.length === 0) {
                goalsContainer.innerHTML = '<div class="no-goals">No goals found for the selected date.</div>';
                return;
            }
        }
        
        goalsContainer.innerHTML = '';
        
        filteredGoals.forEach(goal => {
            const goalCard = document.createElement('div');
            goalCard.className = 'goal-card';
            
            const goalDate = new Date(goal.created_at).toLocaleDateString();
            
            let subtasksHTML = '';
            if (goal.subtasks && goal.subtasks.length > 0) {
                subtasksHTML = '<ul class="subtask-list">';
                goal.subtasks.forEach(subtask => {
                    const statusClass = subtask.completed ? 'completed' : '';
                    subtasksHTML += `
                        <li class="subtask-item">
                            <span class="subtask-text ${statusClass}">${subtask.title}</span>
                        </li>
                    `;
                });
                subtasksHTML += '</ul>';
            }
            
            goalCard.innerHTML = `
                <div class="goal-title">${goal.title}</div>
                <div class="goal-date">${goalDate}</div>
                ${subtasksHTML}
            `;
            
            goalsContainer.appendChild(goalCard);
        });
    }
    
    function filterGoalsByDate() {
        const selectedDate = dateFilter.value;
        fetchGoals(selectedDate);
    }
    
    function clearFilter() {
        dateFilter.value = '';
        fetchGoals();
    }
    
    // Make functions available globally for HTML onclick
    window.filterGoalsByDate = filterGoalsByDate;
    window.clearFilter = clearFilter;
    
    // Initial fetch
    fetchGoals();
});