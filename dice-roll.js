// Select the dice result element
const diceResultElement = document.getElementById("dice-result");

// Function to simulate a dice roll with animation
function rollDice() {
  const numbers = [1, 2, 3, 4, 5, 6]; // Possible dice outcomes
  let rollCount = 0; // Counter for animation iterations
  const maxRolls = 20; // Number of rapid rolls before settling
  const intervalTime = 50; // Time between number changes (in milliseconds)

  // Clear previous result
  diceResultElement.textContent = "";

  // Start the rolling animation
  const intervalId = setInterval(() => {
    rollCount++;
    const randomIndex = Math.floor(Math.random() * numbers.length);
    diceResultElement.textContent = numbers[randomIndex];

    // Stop the animation after maxRolls and display the final result
    if (rollCount >= maxRolls) {
      clearInterval(intervalId);

      // Final dice result
      const finalResult = Math.floor(Math.random() * 6) + 1;
      setTimeout(() => {
        diceResultElement.textContent = finalResult;
      }, intervalTime);
    }
  }, intervalTime);
}

// Export the rollDice function for use in other files
export { rollDice };