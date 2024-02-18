// Import Data
import { fetchData, createMovieBox } from "./main.js";

// Global Variables
const genreMoviesWrapper = document.querySelector(".genre-movies .content");
const genreName = new URLSearchParams(location.search).get("genre");
const genreId = new URLSearchParams(location.search).get("id");

/* On Clicking The Genres Links */
const allGenresLinks = document.querySelectorAll(".genres-list .links a");

if (allGenresLinks[0]) {
  allGenresLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      location.href = `movies-list.html?genre=${link.textContent.toLowerCase()}&id=${link.dataset.id}`;
    });
  });
}

/* Display Genre Movies Boxes After Loading The Page */
window.addEventListener("load", () => {
  if (genreMoviesWrapper) {
    // Fetch Genre's Movies Data
    fetchData(
      `https://api.themoviedb.org/3/discover/movie?api_key=3400f1dcf13bf3f91eca2467f3756dc1&with_genres=${genreId}`,
      displayMoviesBoxes,
      genreMoviesWrapper
    );
    // Display Genre's Title
    displayGenreTitle(genreName);
  }
});

/* Clicking The Load More Btns */
const loadMoreBtns = document.querySelectorAll(".load-more-btn");

if (loadMoreBtns[0]) {
  let num = 2;

  loadMoreBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      loadMoreMovies(num);
      num++;
    });
  });
}

// Functions
function displayMoviesBoxes(data, wrapper) {
  let moviesArr = data.results;

  // Loop On The Movies Arr
  moviesArr.forEach(movie => {
    createMovieBox(movie, wrapper);
  });
}

function displayGenreTitle(genreName) {
  // Update Page Title
  document.title += ` ${genreName[0].toUpperCase() + genreName.slice(1)} Movies`;
  // Display Genre Title
  document.querySelector(".genre-title").textContent = `All ${genreName[0].toUpperCase() + genreName.slice(1)} Movies`;
}

function loadMoreMovies(num) {
  fetchData(
    `https://api.themoviedb.org/3/discover/movie?api_key=3400f1dcf13bf3f91eca2467f3756dc1&with_genres=${genreId}&page=${num}`,
    displayMoviesBoxes,
    genreMoviesWrapper
  );
}