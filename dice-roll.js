// Select the dice result element and message element
const diceResultElement = document.getElementById("dice-result");
const diceMessageElement = document.getElementById("dice-message");

// List of humorous messages for each dice roll (1-20)
const diceMessages = [
    "One? You rolled a one. At least it can't get any worse... or can it?",
    "Two? That's like rolling a participation trophy. Congrats, I guess?",
    "Three? The magic number. Or was it four? Who cares!",
    "Four? An even number that nobody asked for. Still better than a one.",
    "Five? Halfway to ten. But who said ten was the goal?",
    "Six? Meh, still not impressive. But hey, it's better than five.",
    "Seven? Lucky number? Sure, if you believe in made-up luck.",
    "Eight? Big things come in small packages. Except this package is just okay.",
    "Nine? Almost double digits. Keep dreaming, champ.",
    "Ten? A perfect score for mediocrity. Good job!",
    "Eleven? Now we're getting into weird territory. Like you.",
    "Twelve? The clock strikes midnight. Is it time for bed yet?",
    "Thirteen? Spooky! Did you hear something behind you?",
    "Fourteen? An awkward teenager of numbers. Awkwardly average.",
    "Fifteen? Halfway there. Wherever 'there' is.",
    "Sixteen? Sweet sixteen. Not sweet enough for cake, though.",
    "Seventeen? Just hanging out, being all prime and stuff.",
    "Eighteen? Practically grown-up. Almost ready to adult.",
    "Nineteen? So close to twenty, yet so far from relevance.",
    "Twenty? Jackpot! You win... absolutely nothing. But congrats anyway!"
  ];

// Function to simulate a dice roll with animation
function rollDice() {
  const maxNumber = 20; // Maximum number for the dice roll
  let rollCount = 0; // Counter for animation iterations
  const maxRolls = 30; // Number of rapid rolls before settling
  const intervalTime = 50; // Time between number changes (in milliseconds)

  // Clear previous result and message
  diceResultElement.textContent = "";
  diceMessageElement.textContent = "";

  // Remove the 'final' class to start the animation
  diceResultElement.classList.remove("final");

  // Start the rolling animation
  const intervalId = setInterval(() => {
    rollCount++;
    const randomNumber = Math.floor(Math.random() * maxNumber) + 1; // Random number between 1 and 20
    diceResultElement.textContent = randomNumber;

    // Stop the animation after maxRolls and display the final result
    if (rollCount >= maxRolls) {
      clearInterval(intervalId);

      // Final dice result
      const finalResult = Math.floor(Math.random() * maxNumber) + 1;
      setTimeout(() => {
        diceResultElement.textContent = finalResult;
        diceMessageElement.textContent = diceMessages[finalResult - 1]; // Display corresponding message

        // Stop the animation by adding the 'final' class
        diceResultElement.classList.add("final");
      }, intervalTime);
    }
  }, intervalTime);
}

// Export the rollDice function for use in other files
export { rollDice };