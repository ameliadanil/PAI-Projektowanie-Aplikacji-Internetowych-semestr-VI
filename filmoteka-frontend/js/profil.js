document.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("loggedInUser");
  const userEmailSpan = document.getElementById("userEmail");
  const userNickSpan = document.getElementById("userNick");
  const avatarImg = document.getElementById("avatarImg");
  const nickInput = document.getElementById("nickInput");
  const avatarInput = document.getElementById("avatarInput");
  const saveBtn = document.getElementById("saveProfileBtn");

  if (!email) {
    userEmailSpan.textContent = "Nie jesteś zalogowany.";
    return;
  }

  userEmailSpan.textContent = email;

  // 🔧 Wczytaj profil użytkownika (nick + avatar)
  const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

  if (savedProfile.email === email) {
    userNickSpan.textContent = savedProfile.nick || "(brak)";
    nickInput.value = savedProfile.nick || "";
    avatarInput.value = savedProfile.avatar || "";
    avatarImg.src = savedProfile.avatar || "https://via.placeholder.com/80";
  }

  // 💾 Zapis profilu
  saveBtn.addEventListener("click", () => {
    const newNick = nickInput.value.trim();
    const newAvatar = avatarInput.value.trim();

    if (!newNick || !newAvatar) {
      alert("Wprowadź nick i link do avatara!");
      return;
    }

    const profileData = {
      email,
      nick: newNick,
      avatar: newAvatar
    };

    localStorage.setItem("userProfile", JSON.stringify(profileData));
    alert("✅ Profil zapisany!");
    location.reload();
  });

  // 🔐 Wylogowanie
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    alert("Zostałeś wylogowany.");
    window.location.href = "index.html";
  });

  // 📤 Eksport recenzji
  document.getElementById("exportBtn").addEventListener("click", () => {
    const allReviews = [];

    for (let key in localStorage) {
      if (key.startsWith("reviews_")) {
        const reviews = JSON.parse(localStorage.getItem(key)) || [];
        reviews
          .filter(r => r.email === email)
          .forEach(r => {
            allReviews.push({
              filmId: key.replace("reviews_", ""),
              rating: r.rating,
              text: r.text,
              date: r.date
            });
          });
      }
    }

    const blob = new Blob([JSON.stringify(allReviews, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "moje_recenzje.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  // 📋 Lista recenzji użytkownika
  const reviewsUl = document.getElementById("userReviews");
  reviewsUl.innerHTML = "";

  for (let key in localStorage) {
    if (key.startsWith("reviews_")) {
      const reviews = JSON.parse(localStorage.getItem(key)) || [];
      reviews
        .filter(r => r.email === email)
        .forEach(r => {
          const li = document.createElement("li");
          const movieId = key.replace("reviews_", "");

          li.innerHTML = `
            <strong>Film ID ${movieId}</strong><br/>
            ⭐ ${r.rating}/10<br/>
            ${r.text}<br/>
            <small>${r.date}</small><br/>
            <a href="film.html?id=${movieId}">Zobacz film</a><br/>
            <button data-film="${movieId}" class="deleteReviewBtn">🗑️ Usuń recenzję</button>
          `;

          reviewsUl.appendChild(li);
        });
    }
  }

  // 🗑️ Usuwanie recenzji
  reviewsUl.addEventListener("click", (e) => {
    if (e.target.classList.contains("deleteReviewBtn")) {
      const filmId = e.target.getAttribute("data-film");
      const reviews = JSON.parse(localStorage.getItem(`reviews_${filmId}`)) || [];
      const updated = reviews.filter(r => r.email !== email);
      localStorage.setItem(`reviews_${filmId}`, JSON.stringify(updated));
      location.reload();
    }
  });

  // 📋 Listy: ulubione / watchlist / obejrzane
  loadList("ulubione", "ulubioneList");
  loadList("watchlist", "watchlist");
  loadList("watched", "watchedList");
});

function loadList(listKey, ulId) {
  const list = JSON.parse(localStorage.getItem(listKey)) || [];
  const ul = document.getElementById(ulId);
  ul.innerHTML = "";

  if (list.length === 0) {
    ul.innerHTML = "<li>Brak pozycji.</li>";
    return;
  }

  list.forEach(movie => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="film.html?id=${movie.id}">${movie.title}</a>`;
    ul.appendChild(li);
  });
}
