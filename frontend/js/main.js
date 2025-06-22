// Global API URL
const API_URL = 'http://localhost:8000';

// Display motivational quotes on home page
const quotes = [
    {text: "The future depends on what you do today.", author: "Mahatma Gandhi"},
    {text: "Setting goals is the first step in turning the invisible into the visible.", author: "Tony Robbins"},
    {text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis"},
    {text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar"}
];

function displayRandomQuote() {
    const quoteContainer = document.querySelector('.motivational-quote');
    if (quoteContainer) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteContainer.innerHTML = `
            <p>"${randomQuote.text}"</p>
            <p class="author">- ${randomQuote.author}</p>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    displayRandomQuote();
});