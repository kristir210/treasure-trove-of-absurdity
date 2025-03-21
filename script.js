// Import quotes from external file
import { quotes } from './assets/quotes.js';

// Function to fetch and display a random quote
function fetchQuote() {
  console.log("Quotes array:", quotes); // Debugging: Check if quotes are imported correctly

  if (!quotes || quotes.length === 0) {
    console.error("Quotes array is empty or undefined.");
    document.getElementById("quote").textContent = "Error: Quotes not loaded.";
    return;
  }

  // Select a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  console.log("Selected quote:", selectedQuote); // Debugging: Check the selected quote

  // Display the quote
  document.getElementById("quote").textContent = `"${selectedQuote}"`;
}

// Load the quote after the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  fetchQuote();
});