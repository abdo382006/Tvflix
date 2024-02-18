// Import Data
import { fetchData, createMovieBox } from "./main.js";

// Variables
const searchQuery = new URLSearchParams(location.search).get("q") ? new URLSearchParams(location.search).get("q").toLowerCase() : "";
const searchInput = document.getElementById("searchInput");
const searchResultsWrapper = document.querySelector(".search-results .content");

/* Locate To search-results.html After Submiting */
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    let value = searchInput.value.trim();

    if (value !== "") {
      location.href = `search-results.html?q=${value}`;
    }
  }
});

/* Update Search Query Content After Loading The Page */
window.addEventListener("load", displaySearchQuery);

/* Fetch Search Query's Movies Data After Page Loading */
window.addEventListener("load", () => {
  if (searchResultsWrapper) {
    fetchData(
      `https://api.themoviedb.org/3/search/multi?api_key=3400f1dcf13bf3f91eca2467f3756dc1&query=${searchQuery}`,
      createMoviesGridBoxes, 
      searchResultsWrapper
    );
  }
});

// Functions
function displaySearchQuery() {
  if (searchResultsWrapper) {
    // Update Search Query Element Content
    const searchQueryElement = document.getElementById("searchQuery");
    searchQueryElement.textContent = searchQuery;
    // Update Search Input Value
    searchInput.value = searchQuery;
    // Update The Page Title
    document.title += ` ${searchQuery}`; 
  }
}

function createMoviesGridBoxes(data, wrapper) {
  const resultsArr = data.results;
  
  // Loop On The Search Results Arr
  resultsArr.forEach(obj => {
    createMovieBox(obj, wrapper);
  });
}