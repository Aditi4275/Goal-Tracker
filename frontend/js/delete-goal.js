document.addEventListener('DOMContentLoaded', async () => {
    const goalsContainer = document.getElementById('goals-container');
    
    async function fetchGoals() {
        goalsContainer.innerHTML = '<div class="loading">Loading your goals...</div>';
        
        try {
            const response = await fetch(`${API_URL}/goals/`);
            if (!response.ok) throw new Error('Failed to fetch goals');
            
            const goals = await response.json();
            displayGoalsForDeletion(goals);
        } catch (error) {
            console.error('Error:', error);
            goalsContainer.innerHTML = '<div class="error">Failed to load goals. Please try again later.</div>';
        }
    }
    
    function displayGoalsForDeletion(goals) {
        if (goals.length === 0) {
            goalsContainer.innerHTML = '<div class="no-goals">No goals found. Nothing to delete!</div>';
            return;
        }
        
        goalsContainer.innerHTML = '';
        
        goals.forEach(goal => {
            const goalCard = document.createElement('div');
            goalCard.className = 'goal-card';
            
            const goalDate = new Date(goal.created_at).toLocaleDateString();
            
            goalCard.innerHTML = `
                <div class="goal-title">${goal.title}</div>
                <div class="goal-date">${goalDate}</div>
                <button onclick="deleteGoal(${goal.id})" class="delete-btn">Delete</button>
            `;
            
            goalsContainer.appendChild(goalCard);
        });
    }
    
    async function deleteGoal(goalId) {
        if (!confirm('Are you sure you want to delete this goal and all its subtasks? This action cannot be undone.')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/goals/${goalId}/`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                alert('Goal deleted successfully!');
                fetchGoals(); // Refresh the list
            } else {
                throw new Error('Failed to delete goal');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete goal. Please try again.');
        }
    }
    
    // Make function available globally for HTML onclick
    window.deleteGoal = deleteGoal;
    
    // Initial fetch
    fetchGoals();
});