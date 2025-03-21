// Import quotes and songs from external files
import { motivationalQuotes } from './assets/motivational-quotes.js';
import { memes } from './assets/memes.js';
import { songs } from './assets/songs.js';

// Function to generate a consistent "today" key
function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// Function to calculate the quote index based on the current day
function getQuoteIndex(quoteType) {
  const totalQuotes = quoteType === "motivational" ? motivationalQuotes.length : memes.length;
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1); // January 1st of the current year
  const dayOfYear = Math.floor((currentDate - startOfYear) / (24 * 60 * 60 * 1000)); // Day of the year

  return dayOfYear % totalQuotes; // Cycle through quotes every day
}

// Fetch and display the daily quote
function fetchQuote(quoteType) {
  const quotes = quoteType === "motivational" ? motivationalQuotes : memes;
  const quoteIndex = getQuoteIndex(quoteType);

  // Replace loading text immediately
  document.getElementById("quote").textContent = `"${quotes[quoteIndex]}"`;
}

// Fetch and display the "Song of the Day"
function fetchSong() {
  const todayKey = getTodayKey();
  const storedKey = localStorage.getItem("lastSongKey");
  const recentSongs = JSON.parse(localStorage.getItem("recentSongs")) || [];
  const currentDate = new Date();

  if (storedKey === todayKey) {
    const songIndex = parseInt(localStorage.getItem("songIndex"));
    displaySong(songs[songIndex]);
  } else {
    const availableSongs = songs.filter(song => {
      const lastSelected = recentSongs.find(rs => rs.name === song.name);
      if (!lastSelected) return true;
      const lastSelectedDate = new Date(lastSelected.date);
      const cooldownPeriod = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
      return currentDate - lastSelectedDate > cooldownPeriod;
    });

    if (availableSongs.length === 0) {
      console.log("All songs on cooldown. Resetting...");
      localStorage.removeItem("recentSongs");
      return fetchSong();
    }

    const randomSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
    const updatedRecentSongs = recentSongs.filter(rs => rs.name !== randomSong.name);
    updatedRecentSongs.push({ name: randomSong.name, date: currentDate.toISOString() });
    localStorage.setItem("lastSongKey", todayKey);
    localStorage.setItem("songIndex", songs.indexOf(randomSong));
    localStorage.setItem("recentSongs", JSON.stringify(updatedRecentSongs));
    displaySong(randomSong);
  }
}

// Display the selected song
function displaySong(song) {
  document.getElementById("song-name").textContent = `"${song.name}"`;
  document.getElementById("song-artist").textContent = `by ${song.artist}`;
}

// Add event listeners for quote buttons
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("motivational-quote-btn").addEventListener("click", () => {
    fetchQuote("motivational");
  });

  document.getElementById("meme-btn").addEventListener("click", () => {
    fetchQuote("meme");
  });

  // Load the song of the day
  requestAnimationFrame(() => {
    fetchSong();
  });
});