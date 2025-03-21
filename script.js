// Import quotes and songs from external files
import { quotes } from './assets/quotes.js';
import { songs } from './assets/songs.js';

// Function to generate a consistent "today" key
function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// Precompute all available quotes and songs
function precomputeData() {
  if (!localStorage.getItem("availableQuotes")) {
    const availableQuotes = [...quotes]; // Start with all quotes
    localStorage.setItem("availableQuotes", JSON.stringify(availableQuotes));
  }

  if (!localStorage.getItem("availableSongs")) {
    const currentDate = new Date();
    const availableSongs = songs.filter(song => {
      const lastSelected = JSON.parse(localStorage.getItem("recentSongs") || []).find(rs => rs.name === song.name);
      if (!lastSelected) return true;
      const lastSelectedDate = new Date(lastSelected.date);
      const cooldownPeriod = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
      return currentDate - lastSelectedDate > cooldownPeriod;
    });
    localStorage.setItem("availableSongs", JSON.stringify(availableSongs));
  }
}

// Fetch and display the daily quote
function fetchQuote() {
  const todayKey = getTodayKey();
  const storedKey = localStorage.getItem("lastQuoteKey");

  if (storedKey === todayKey) {
    const quoteIndex = parseInt(localStorage.getItem("quoteIndex"));
    document.getElementById("quote").textContent = `"${quotes[quoteIndex]}"`;
  } else {
    let availableQuotes = JSON.parse(localStorage.getItem("availableQuotes"));
    if (availableQuotes.length === 0) {
      console.log("All quotes used. Resetting...");
      localStorage.removeItem("availableQuotes");
      localStorage.removeItem("recentQuotes");
      return fetchQuote();
    }

    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const quoteIndex = quotes.indexOf(availableQuotes[randomIndex]);
    const recentQuotes = JSON.parse(localStorage.getItem("recentQuotes")) || [];
    recentQuotes.push(quoteIndex);
    localStorage.setItem("lastQuoteKey", todayKey);
    localStorage.setItem("quoteIndex", quoteIndex);
    localStorage.setItem("recentQuotes", JSON.stringify(recentQuotes));

    // Remove the selected quote from availableQuotes
    availableQuotes = availableQuotes.filter((_, index) => index !== randomIndex);
    localStorage.setItem("availableQuotes", JSON.stringify(availableQuotes));

    document.getElementById("quote").textContent = `"${quotes[quoteIndex]}"`;
  }
}

// Fetch and display the "Song of the Day"
function fetchSong() {
  const todayKey = getTodayKey();
  const storedKey = localStorage.getItem("lastSongKey");

  if (storedKey === todayKey) {
    const songIndex = parseInt(localStorage.getItem("songIndex"));
    displaySong(songs[songIndex]);
  } else {
    let availableSongs = JSON.parse(localStorage.getItem("availableSongs"));
    if (availableSongs.length === 0) {
      console.log("All songs on cooldown. Resetting...");
      localStorage.removeItem("recentSongs");
      localStorage.removeItem("availableSongs");
      return fetchSong();
    }

    const randomSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
    const recentSongs = JSON.parse(localStorage.getItem("recentSongs")) || [];
    const updatedRecentSongs = recentSongs.filter(rs => rs.name !== randomSong.name);
    updatedRecentSongs.push({ name: randomSong.name, date: new Date().toISOString() });

    localStorage.setItem("lastSongKey", todayKey);
    localStorage.setItem("songIndex", songs.indexOf(randomSong));
    localStorage.setItem("recentSongs", JSON.stringify(updatedRecentSongs));

    // Remove the selected song from availableSongs
    availableSongs = availableSongs.filter(song => song.name !== randomSong.name);
    localStorage.setItem("availableSongs", JSON.stringify(availableSongs));

    displaySong(randomSong);
  }
}

// Display the selected song
function displaySong(song) {
  document.getElementById("song-name").textContent = `"${song.name}"`;
  document.getElementById("song-artist").textContent = `by ${song.artist}`;
}

// Load everything after the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  precomputeData(); // Precompute data on first load
  requestAnimationFrame(() => {
    fetchQuote();
    fetchSong();
  });
});