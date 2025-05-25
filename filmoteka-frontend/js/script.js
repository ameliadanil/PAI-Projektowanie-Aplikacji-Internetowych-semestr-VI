import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const TMDB_API_KEY = "cf373f61ad98a14cf0a56173cecf4f92";

  // 🔐 LOGIN
  window.login = function () {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        localStorage.setItem("loggedInUser", email);
        alert("✅ Zalogowano!");
      })
      .catch(error => {
        alert("❌ Błąd logowania: " + error.message);
      });
  };

  // 🔐 REJESTRACJA
  window.register = function () {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        localStorage.setItem("loggedInUser", email);
        alert("✅ Zarejestrowano!");
      })
      .catch(error => {
        alert("❌ Błąd rejestracji: " + error.message);
      });
  };

  // 🔍 WYSZUKIWANIE FILMÓW
  const genreSelect = document.getElementById("searchGenre");
  if (genreSelect) {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=pl-PL`)
      .then(res => res.json())
      .then(data => {
        data.genres.forEach(g => {
          const option = document.createElement("option");
          option.value = g.id;
          option.textContent = g.name;
          genreSelect.appendChild(option);
        });
      });
  }

  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", advancedSearch);
  }

  function advancedSearch() {
    const title = document.getElementById("searchTitle").value.trim();
    const actor = document.getElementById("searchActor").value.trim();
    const year = document.getElementById("searchYear").value.trim();
    const genre = document.getElementById("searchGenre").value;
    const hasOtherFilters = actor || year || genre;

    if (title && !hasOtherFilters) {
      return fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=pl-PL&query=${encodeURIComponent(title)}`)
        .then(res => res.json())
        .then(data => displayResults(data.results))
        .catch(() => displayResults([]));
    }

    if (actor) {
      return fetch(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(actor)}`)
        .then(res => res.json())
        .then(data => {
          const person = data.results[0];
          if (!person) return displayResults([]);
          const actorId = person.id;

          return fetch(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${TMDB_API_KEY}&language=pl-PL`)
            .then(res => res.json())
            .then(credits => {
              let movies = credits.cast || [];

              if (title) {
                movies = movies.filter(m => m.title.toLowerCase().includes(title.toLowerCase()));
              }

              if (year) {
                movies = movies.filter(m => m.release_date?.startsWith(year));
              }

              if (genre) {
                movies = movies.filter(m => m.genre_ids.includes(parseInt(genre)));
              }

              displayResults(movies);
            });
        })
        .catch(() => displayResults([]));
    }

    searchWithFilters(title, year, genre);
  }

  function searchWithFilters(title, year, genre) {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=pl-PL&sort_by=popularity.desc`;

    if (year) url += `&primary_release_year=${year}`;
    if (genre) url += `&with_genres=${genre}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const filtered = title
          ? data.results.filter(movie =>
              movie.title.toLowerCase().includes(title.toLowerCase())
            )
          : data.results;
        displayResults(filtered);
      })
      .catch(() => displayResults([]));
  }

  function displayResults(results) {
    const container = document.getElementById("results");
    if (!container) return;

    container.innerHTML = "";

    if (!results || results.length === 0) {
      container.innerHTML = "<p>Brak wyników.</p>";
      return;
    }

    results.forEach(movie => {
      const div = document.createElement("div");
      div.classList.add("film-card");

      const shortOverview =
        movie.overview && movie.overview.length > 150
          ? movie.overview.substring(0, 150) + "..."
          : movie.overview || "Brak opisu";

      div.innerHTML = `
        <h2>${movie.title}</h2>
        <p>${shortOverview}</p>
        <a href="film.html?id=${movie.id}">
          <button>Zobacz więcej</button>
        </a>
      `;

      container.appendChild(div);
    });
  }

  // 🔍 Obserwacja logowania
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("✅ Zalogowany:", user.email);
    } else {
      console.log("🔒 Niezalogowany");
    }
  });
});
