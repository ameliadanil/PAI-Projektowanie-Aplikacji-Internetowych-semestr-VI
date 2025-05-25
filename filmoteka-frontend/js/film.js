const TMDB_API_KEY = "cf373f61ad98a14cf0a56173cecf4f92";
const params = new URLSearchParams(window.location.search);
const filmId = params.get("id");
const currentUserEmail = localStorage.getItem("loggedInUser");

if (!filmId) {
  document.getElementById("filmDetails").innerHTML =
    "<p style='color: red;'>❌ Brak ID filmu w adresie URL.</p>";
} else {
  fetch(`https://api.themoviedb.org/3/movie/${filmId}?api_key=${TMDB_API_KEY}&language=pl-PL`)
    .then(res => {
      if (!res.ok) throw new Error(`Błąd API: ${res.status}`);
      return res.json();
    })
    .then(data => displayFilm(data))
    .catch(err => {
      document.getElementById("filmDetails").innerHTML =
        `<p style="color: red;">❌ Błąd ładowania danych o filmie: ${err.message}</p>`;
    });
}

// 🖼️ Wyświetlanie szczegółów filmu + oceny
function displayFilm(film) {
  const container = document.getElementById("filmDetails");

  const poster = film.poster_path
    ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
    : "https://via.placeholder.com/300x450?text=Brak+plakatu";

  const rating = film.vote_average
    ? `${film.vote_average.toFixed(1)} / 10`
    : "Brak";

  container.innerHTML = `
    <h1>${film.title}</h1>
    <img src="${poster}" alt="Plakat filmu ${film.title}" />
    <p><strong>Opis:</strong> ${film.overview || "Brak opisu"}</p>
    <p><strong>Data premiery:</strong> ${film.release_date || "Brak"}</p>
    <p><strong>Ocena TMDb:</strong> ${rating}</p>
    <p><strong>Ocena użytkowników:</strong> <span id="userAverage">Ładowanie...</span></p>
  `;

  loadReviews();
  updateUserAverage();
}

// 💬 Zapis recenzji
document.getElementById("saveReviewBtn").addEventListener("click", () => {
  const rating = parseInt(document.getElementById("ratingInput").value);
  const text = document.getElementById("reviewInput").value.trim();

  if (!currentUserEmail) {
    alert("Musisz być zalogowany, aby dodać recenzję.");
    return;
  }

  if (!rating || rating < 1 || rating > 10 || !text) {
    alert("Podaj ocenę (1–10) oraz recenzję.");
    return;
  }

  const reviews = JSON.parse(localStorage.getItem(`reviews_${filmId}`)) || [];
  const existingIndex = reviews.findIndex(r => r.email === currentUserEmail);

  const review = {
    email: currentUserEmail,
    rating,
    text,
    date: new Date().toLocaleString()
  };

  if (existingIndex >= 0) {
    reviews[existingIndex] = review;
  } else {
    reviews.push(review);
  }

  localStorage.setItem(`reviews_${filmId}`, JSON.stringify(reviews));

  document.getElementById("ratingInput").value = "";
  document.getElementById("reviewInput").value = "";

  loadReviews();
  updateUserAverage();
});

// 📋 Wyświetlanie recenzji z oceną
function loadReviews() {
  const list = document.getElementById("reviewList");
  list.innerHTML = "";

  const reviews = JSON.parse(localStorage.getItem(`reviews_${filmId}`)) || [];

  if (reviews.length === 0) {
    list.innerHTML = "<p>Brak recenzji dla tego filmu.</p>";
    return;
  }

  reviews.forEach(r => {
    const li = document.createElement("li");
    li.classList.add("review-item");
    li.innerHTML = `
      <strong>${r.email}</strong><br/>
      ⭐ Ocena: <strong>${r.rating}/10</strong><br/>
      ${r.text}<br/>
      <small>${r.date}</small>
    `;

    if (r.email === currentUserEmail) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️ Edytuj";
      editBtn.onclick = () => {
        document.getElementById("ratingInput").value = r.rating;
        document.getElementById("reviewInput").value = r.text;
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️ Usuń";
      deleteBtn.onclick = () => {
        const updated = reviews.filter(x => x.email !== currentUserEmail);
        localStorage.setItem(`reviews_${filmId}`, JSON.stringify(updated));
        loadReviews();
        updateUserAverage();
      };

      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
    }

    list.appendChild(li);
  });
}

// 🧮 Obliczanie średniej użytkowników
function updateUserAverage() {
  const reviews = JSON.parse(localStorage.getItem(`reviews_${filmId}`)) || [];
  const averageBox = document.getElementById("userAverage");

  if (!averageBox) return;

  if (reviews.length === 0) {
    averageBox.textContent = "Brak ocen użytkowników";
    return;
  }

  const avg = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  averageBox.textContent = `${avg} / 10`;
}
