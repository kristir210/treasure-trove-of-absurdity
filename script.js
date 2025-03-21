// Import quotes and songs from external files
import { quotes } from './assets/quotes.js';
import { songs } from './assets/songs.js';

// Function to generate a consistent "today" key
function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// Fetch and display the daily quote
function fetchQuote() {
  const todayKey = getTodayKey();
  const storedKey = localStorage.getItem("lastQuoteKey");
  let recentQuotes = JSON.parse(localStorage.getItem("recentQuotes")) || [];

  if (storedKey === todayKey) {
    const quoteIndex = parseInt(localStorage.getItem("quoteIndex"));
    document.getElementById("quote").textContent = `"${quotes[quoteIndex]}"`;
  } else {
    const availableQuotes = quotes.filter((_, index) => !recentQuotes.includes(index));
    if (availableQuotes.length === 0) recentQuotes = [];
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const quoteIndex = quotes.indexOf(availableQuotes[randomIndex]);
    localStorage.setItem("lastQuoteKey", todayKey);
    localStorage.setItem("quoteIndex", quoteIndex);
    recentQuotes.push(quoteIndex);
    localStorage.setItem("recentQuotes", JSON.stringify(recentQuotes));
    document.getElementById("quote").textContent = `"${quotes[quoteIndex]}"`;
  }
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

// Load everything after the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    fetchQuote();
    fetchSong();
  });
});