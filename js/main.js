// Export Data 
export { fetchData, createMovieBox, slidesElementCount };

// Global Variables
const mainDelay = 5000;
const slidesElementCount = 18;

/* Page Loader */
const pageLoader = document.getElementById("pageLoader");

window.addEventListener("load", () => {
  // Add loaded Class To Both Of The Body & The Page Loader
  addClass("loaded", pageLoader);
  addClass("loaded", document.body);
});

pageLoader.addEventListener("transitionend", () => {
  // Remove The Page Loader From DOM
  pageLoader.remove();
});

/* Open & Close Search Bar */
const searchBtn = document.getElementById("searchBtn");
const searchCloseBtn = document.getElementById("searchCloseBtn");
const searchBar = document.querySelector("header .search-bar");

searchBtn.addEventListener("click", () => {
  addClass("open", searchBar);
  focusOn(searchBar.querySelector("input"));
});

searchCloseBtn.addEventListener("click", () => {
  removeClass("open", searchBar);
});

/* Toggle Genres List */
const genresListToggle = document.getElementById("genresListToggle");

if (genresListToggle) {
  genresListToggle.addEventListener("click", () => {
    const genresList = document.querySelector(".genres-list");
    const genresListToggleIcon = document.querySelector("#genresListToggle .icon");

    if (!genresList.classList.contains("open")) {
      addClass("open", genresList);
      genresListToggleIcon.classList.replace("fa-bars", "fa-indent");
    } else {
      removeClass("open", genresList);
      genresListToggleIcon.classList.replace("fa-indent", "fa-bars");
    }
  });
}

/* Create Hero Posters Slider */
window.addEventListener("load", createHeroPostersSlider);

/* Toggle Active Hero Banner */
const allShowsPosters = document.querySelectorAll(".hero .posters-slider .image");

if (allShowsPosters[0]) {
  allShowsPosters.forEach((poster, i) => {
    poster.addEventListener("click", () => {
      toggleActiveBanner(poster, i);
    });
  });
}

/* Create The Weekly Trending Movies Boxes */
const weeklyTrendingMoviesWrapper = document.querySelector(".weekly-trending-movies .content");

window.addEventListener("load", () => {
  if (weeklyTrendingMoviesWrapper) {
    fetchData("https://api.themoviedb.org/3/trending/movie/week?api_key=3400f1dcf13bf3f91eca2467f3756dc1", createSliderMoviesBoxes, weeklyTrendingMoviesWrapper);
  }
});

/* Create The Top Rated Movies Boxes */
const topRatedMoviesWrapper = document.querySelector(".top-rated-movies .content");

window.addEventListener("load", () => {
  if (topRatedMoviesWrapper) {
    fetchData("https://api.themoviedb.org/3/movie/top_rated?api_key=3400f1dcf13bf3f91eca2467f3756dc1",createSliderMoviesBoxes, topRatedMoviesWrapper);
  }
});

/* Create The Upcoming Movies Boxes */
const upcomingMoviesWrapper = document.querySelector(".upcoming-movies .content");

window.addEventListener("load", () => {
  if (upcomingMoviesWrapper) {
    fetchData("https://api.themoviedb.org/3/movie/upcoming?api_key=3400f1dcf13bf3f91eca2467f3756dc1", createSliderMoviesBoxes, upcomingMoviesWrapper);
  }
});

/* Create The Best Animated Shows Boxes */
const animatedShowsWrapper = document.querySelector(".animated-shows .content");

window.addEventListener("load", () => {
  if (animatedShowsWrapper) {
    fetchData("https://api.themoviedb.org/3/discover/tv?api_key=3400f1dcf13bf3f91eca2467f3756dc1&with_genres=16", createSliderMoviesBoxes, animatedShowsWrapper);
  }
});

/* Create The Top TV Serieses Boxes */
const tvSeriesesWrapper = document.querySelector(".tv-serieses .content");

window.addEventListener("load", () => {
  if (tvSeriesesWrapper) {
    fetchData("https://api.themoviedb.org/3/tv/popular?api_key=3400f1dcf13bf3f91eca2467f3756dc1", createSliderMoviesBoxes, tvSeriesesWrapper);
  }
});

/* Create The Movies Slider */
window.addEventListener("load", () => {
  const moviesSliderSection = document.querySelector(".movies-slider-section");

  if (moviesSliderSection) {
    createMoviesSlider();
  }
});

// Functions
function addClass(theClass, ele) {
  ele.classList.add(theClass);
}

function removeClass(theClass, ele) {
  ele.classList.remove(theClass);
}

function focusOn(input) {
  input.focus();
}

function createHeroPostersSlider() {
  const heroPostersWrapper = document.querySelector(".hero .posters-slider");

  if (heroPostersWrapper) {
    const heroPostersSlider = new Swiper(".hero .swiper", {
      loop: true,
      slidesPerView: 4,
      spaceBetween: 10,
      breakpoints: {
        // when window width is >= 500px
        500: {
            slidesPerView: 5,
        },
        // when window width is >= 992px
        992: {
            slidesPerView: 4,
        },
        // when window width is >= 1200px
        1200: {
            slidesPerView: 5,
        },
      },
    });
  }
}

function toggleActiveBanner(clickedPoster, index) {
  const allHeroBanners = document.querySelectorAll(".hero .banner");
  
  allHeroBanners.forEach((banner, i) => {
    if (index === i) {
      // Toggle Active Poster
      toggleActiveElement(allShowsPosters, clickedPoster);
      // Toggle Active Hero Banner
      toggleActiveElement(allHeroBanners, banner);
    }
  });
}

function toggleActiveElement(siblingsArr, choosenEle) {
  siblingsArr.forEach(ele => {
    removeClass("active", ele);
  });
  addClass("active", choosenEle);
}

function fetchData(url, callbackFunction, wrapper) {
  fetch(url).then(response => response.json()).then(data => callbackFunction(data, wrapper));
}

function createSliderMoviesBoxes(data, wrapper) {
  const moviesArr = data.results;
  
  // Loop On The Movies Array
  for (let i = 0; i < slidesElementCount; i++) {
    // Create Movie Box
    createMovieBox(moviesArr[i], wrapper);
  }
}

function createMovieBox(movie, wrapper) {
  // Create Movie Box
  const movieBox = document.createElement("div");
  movieBox.classList.add("movie-box");
  if (movie.original_title) {
    movieBox.dataset.type = "movie";
  } else if (movie.original_name) {
    movieBox.dataset.type = "show";
  }
  movieBox.dataset.id = movie.id;
  // Append The Movie Box To The Wrapper
  wrapper.append(movieBox);
  // Check If The Movie Is Swiper Slider Or Not
  if (movieBox.parentElement.classList.contains("swiper-wrapper")) movieBox.classList.add("swiper-slide");
  // Create The Movie Image Container
  const imageContainer = document.createElement("a");
  imageContainer.href = "movie-details.html";
  imageContainer.title = movie.title || movie.name;
  imageContainer.classList.add("image");
  movieBox.append(imageContainer);
  // Create The Movie Image
  const img = document.createElement("img");
  img.src = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`; 
  img.alt = movie.title || movie.name;
  img.classList.add("movie-poster");
  imageContainer.append(img);
  // Create The Text Container
  const text = document.createElement("div");
  text.classList.add("text");
  movieBox.append(text);
  // Create The Movie Title
  const title = document.createElement("a");
  title.href = "movie-details.html";
  title.title = movie.title || movie.name;
  title.classList.add("movie-title");
  title.textContent = movie.title || movie.name;
  text.append(title);
  // Create The Info Box
  const infoBox = document.createElement("div");
  infoBox.classList.add("info");
  text.append(infoBox);
  // Create The Rate Span
  const rate = document.createElement("span");
  rate.classList.add("rate");
  rate.textContent = movie.vote_average ? (movie.vote_average).toFixed(1) : "Unknown";
  infoBox.append(rate);
  // Create Year Span
  const year = document.createElement("span");
  year.classList.add("year");
  if (movie.release_date) {
    year.textContent = movie.release_date.split("-")[0];
  } else if (movie.first_air_date) {
    year.textContent = movie.first_air_date.split("-")[0];
  } else {
    year.textContent = "Unknown";
  }
  infoBox.append(year);
}

function createMoviesSlider() {
  const moviesSlider = new Swiper(".movies-slider-section.swiper", {
    spaceBetween: 10,
    slidesPerView: 2,
    breakpoints: {
      // when window width is >= 380px
      380: {
        slidesPerView: 3,
      },
      // when window width is >= 500px
      500: {
        slidesPerView: 4,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 5,
      },
      // when window width is >= 1400px
      1400: {
        slidesPerView: 6,
      },
    },
    autoplay: {
      delay: mainDelay,
    },
    scrollbar: {
      el: '.movies-slider-section .movies-slider-scrollbar.swiper-scrollbar',
      draggable: true,
    },
  });
}
