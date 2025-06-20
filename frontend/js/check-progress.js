document.addEventListener('DOMContentLoaded', async () => {
    const goalsContainer = document.getElementById('today-goals-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    async function fetchTodayGoals() {
        goalsContainer.innerHTML = '<div class="loading">Loading today\'s goals...</div>';
        
        try {
            const response = await fetch(`${API_URL}/goals/today/`);
            if (!response.ok) throw new Error('Failed to fetch today\'s goals');
            
            const goals = await response.json();
            displayTodayGoals(goals);
            calculateProgress(goals);
        } catch (error) {
            console.error('Error:', error);
            goalsContainer.innerHTML = '<div class="error">Failed to load today\'s goals. Please try again later.</div>';
        }
    }
    
    function displayTodayGoals(goals) {
        if (goals.length === 0) {
            goalsContainer.innerHTML = '<div class="no-goals">No goals for today. Add a new goal to get started!</div>';
            return;
        }
        
        goalsContainer.innerHTML = '';
        
        goals.forEach(goal => {
            const goalCard = document.createElement('div');
            goalCard.className = 'goal-card';
            
            let subtasksHTML = '';
            if (goal.subtasks && goal.subtasks.length > 0) {
                subtasksHTML = '<ul class="subtask-list">';
                goal.subtasks.forEach(subtask => {
                    const isChecked = subtask.completed ? 'checked' : '';
                    subtasksHTML += `
                        <li class="subtask-item">
                            <input type="checkbox" class="subtask-checkbox" data-subtask-id="${subtask.id}" ${isChecked} 
                                   onchange="updateSubtaskStatus(${subtask.id}, this.checked)">
                            <span class="subtask-text ${isChecked ? 'completed' : ''}">${subtask.title}</span>
                        </li>
                    `;
                });
                subtasksHTML += '</ul>';
            }
            
            goalCard.innerHTML = `
                <div class="goal-title">${goal.title}</div>
                ${subtasksHTML}
            `;
            
            goalsContainer.appendChild(goalCard);
        });
    }
    
    function calculateProgress(goals) {
        let totalSubtasks = 0;
        let completedSubtasks = 0;
        
        goals.forEach(goal => {
            if (goal.subtasks && goal.subtasks.length > 0) {
                totalSubtasks += goal.subtasks.length;
                completedSubtasks += goal.subtasks.filter(subtask => subtask.completed).length;
            }
        });
        
        const progressPercentage = totalSubtasks > 0 
            ? Math.round((completedSubtasks / totalSubtasks) * 100) 
            : 0;
            
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progressPercentage}% Complete`;
    }
    
    async function updateSubtaskStatus(subtaskId, completed) {
        try {
            const response = await fetch(`${API_URL}/subtasks/${subtaskId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: completed }),
            });
            
            if (!response.ok) throw new Error('Failed to update subtask status');
            
            // Refresh the progress calculation
            const goalsResponse = await fetch(`${API_URL}/goals/today/`);
            if (goalsResponse.ok) {
                const goals = await goalsResponse.json();
                calculateProgress(goals);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update subtask status. Please try again.');
        }
    }
    
    // Make functions available globally for HTML onchange
    window.updateSubtaskStatus = updateSubtaskStatus;
    
    // Initial fetch
    fetchTodayGoals();
});