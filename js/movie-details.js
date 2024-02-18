// Import Data
import { fetchData, createMovieBox, slidesElementCount } from "./main.js";

// Global Variables
const movieViewWrapper = document.querySelector(".movie-view .content");
const movieType = new URLSearchParams(location.search).get("type");
const movieId = new URLSearchParams(location.search).get("id");

/* One Clicking The Movie Title Or Image Or Watch Now Btn */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("movie-title") || e.target.classList.contains("movie-poster") || e.target.classList.contains("view-movie-btn")) {
    e.preventDefault();
    const movieId = e.target.parentElement.parentElement.dataset.id;
    const movieType = e.target.parentElement.parentElement.dataset.type === "show" ? "tv" : "movie";
    // Go To Movie Details Page
    location.href = `movie-details.html?type=${movieType}&id=${movieId}`;
  }
});

/* Display Movie's Data */
window.addEventListener("load", () => {
  if (movieViewWrapper) {
    // Get Clicked Movie's Data
    fetchData(
      `https://api.themoviedb.org/3/${movieType}/${movieId}?api_key=3400f1dcf13bf3f91eca2467f3756dc1&append_to_response=videos`,
      displayMoviesDetails,
      document.querySelector(".movie-view .videos-wrapper")
    );
  }
});

/* Create Similar Movies Section */
window.addEventListener("load", () => {
  const similarMoviesWrapper = document.querySelector(".similar-movies .content");

  if (similarMoviesWrapper) {
    fetchData(
      `https://api.themoviedb.org/3/${movieType}/${movieId}/similar?api_key=3400f1dcf13bf3f91eca2467f3756dc1`,
      createSimilarMoviesBoxes,
      similarMoviesWrapper
    );
  }
});

// Functions
function displayMoviesDetails(data, videosWrapper) {
  // Display Movie's Name In The Page Title
  document.title += data.title ? ` ${data.title}` : ` ${data.name}`;
  // Display Movie's Poster Data
  const moviePoster = document.querySelector(".movie-view .image img");
  moviePoster.src =  data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : `https://image.tmdb.org/t/p/w500${data.backdrop_path}`;
  moviePoster.alt = data.title || data.name;
  // Display Movie's Title
  const title = document.querySelector(".movie-view h1");
  title.textContent = data.title || data.name;
  // Display Movie's Rate
  const rate = document.querySelector(".movie-view .info .rate");
  rate.textContent = data.vote_average ? (data.vote_average).toFixed(1) : "Unknown";
  // Display Movie's Run Time
  const runtime = document.querySelector(".movie-view .info .runtime");
  runtime.textContent = data.runtime ? `${data.runtime}m` : `${data.episode_run_time || 0}m`;
  // Display Movie's Date
  const date = document.querySelector(".movie-view .info .date");
  if (data.release_date) {
    date.textContent = data.release_date.split("-")[0];
  } else if (data.first_air_date) {
    date.textContent = data.first_air_date.split("-")[0];
  } else {
    date.textContent = "Unknown";
  }
  // Display Movie's Mother Language
  const language = document.querySelector(".movie-view .info .language");
  language.textContent = data.original_language.toUpperCase();
  // Display The Movies Genres
  const movieGenres = document.querySelector(".movie-view .genres");
  movieGenres.textContent = data.genres.map(obj => ` ${obj.name}`);
  // Display Movie's Overview
  const overview = document.querySelector(".movie-view .overview");
  overview.textContent = data.overview;
  // Display The Movie's Director
  const director = document.querySelector(".movie-view .director-name");
  if (data.created_by && data.created_by.length > 0) {
    director.textContent = data.created_by.map(obj => ` ${obj.name}`);
  } else if (data.production_companies && data.production_companies.length > 0) {
    director.textContent = data.production_companies.map(obj => ` ${obj.name}`);
  } else {
    director.textContent = "Unknown";
  }
  // Create The Movie's Trailers & Clips
  const videosArr = data.videos.results;
  // Loop On The Videos Arr
  videosArr.forEach(video => {
    // Create The Video (iframe) Element
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${video.key}`; // YouTube embed URL
    iframe.title = video.name;
    iframe.allowFullscreen = true;
    iframe.classList.add("video", "swiper-slide")
    // Append iframe To The Video Element
    videosWrapper.append(iframe);
  }); 
  // Create The Movie's Clips & Trailers Slider
  createMovieClipsSlider();
}

function createMovieClipsSlider() {
  const clipssSlider = new Swiper(".movie-view .swiper", {
    spaceBetween: 10,
    breakpoints: {
      // when window width is >= 0
      0: {
        slidesPerView: 1,
      },
      // when window width is >= 550px
      550: {
        slidesPerView: 2,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 3,
      },
      // when window width is >= 992px
      992: {
        slidesPerView: 2,
      },
      // when window width is >= 1400px
      1400: {
        slidesPerView: 3,
      },
    },
    scrollbar: {
      el: '.movies-slider-section + .movies-slider-scrollbar.swiper-scrollbar',
      draggable: true,
    },
  });
}

function createSimilarMoviesBoxes(data, wrapper) {
  let moviesArr = data.results;

  // Loop On The Movies Array
  for (let i = 0; i < slidesElementCount; i++) {
    // Create Movie Box
    createMovieBox(moviesArr[i], wrapper);
  }
}