document.addEventListener('DOMContentLoaded', () => {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const goalInput = document.getElementById('goal');
    const subtasksContainer = document.getElementById('subtasks-container');
    
    function nextStep() {
        if (goalInput.value.trim() === '') {
            alert('Please enter your goal before proceeding');
            return;
        }
        
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
    }
    
    function addSubtaskField() {
        const lastInput = subtasksContainer.lastElementChild.querySelector('input');
        if (lastInput.value.trim() === '') {
            alert('Please enter the current subtask before adding another');
            return;
        }
        
        const newSubtask = document.createElement('div');
        newSubtask.className = 'subtask-input';
        newSubtask.innerHTML = `
            <input type="text" placeholder="Enter subtask (e.g., Study for 1 hour)">
            <button onclick="addSubtaskField()" class="btn btn-add">+ Add More</button>
        `;
        subtasksContainer.appendChild(newSubtask);
    }
    
    async function submitGoal() {
        const goalTitle = goalInput.value.trim();
        if (goalTitle === '') {
            alert('Please enter your goal');
            return;
        }
        
        const subtaskInputs = document.querySelectorAll('#subtasks-container input');
        const subtasks = Array.from(subtaskInputs)
            .map(input => input.value.trim())
            .filter(text => text !== '');
            
        if (subtasks.length === 0) {
            alert('Please add at least one subtask');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/goals/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: goalTitle,
                    subtasks: subtasks
                }),
            });
            
            if (response.ok) {
                alert('Goal and subtasks created successfully!');
                window.location.href = 'index.html';
            } else {
                throw new Error('Failed to create goal');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating your goal. Please try again.');
        }
    }
    
    // Make functions available globally for HTML onclick
    window.nextStep = nextStep;
    window.addSubtaskField = addSubtaskField;
    window.submitGoal = submitGoal;
});