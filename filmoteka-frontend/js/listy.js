const listContainer = document.getElementById("listContainer");

document.getElementById("showFavorites").addEventListener("click", () => {
  renderList("favorites", "Ulubione filmy");
});

document.getElementById("showWatchlist").addEventListener("click", () => {
  renderList("watchlist", "Watchlista");
});

function renderList(type, label) {
  const list = JSON.parse(localStorage.getItem(type)) || [];

  if (list.length === 0) {
    listContainer.innerHTML = `<p>Brak filmów w liście <strong>${label}</strong>.</p>`;
    return;
  }

  listContainer.innerHTML = `<h2>${label}</h2><ul class="film-list"></ul>`;
  const ul = listContainer.querySelector(".film-list");

  list.forEach(film => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="film.html?id=${film.id}">${film.title}</a>`;
    ul.appendChild(li);
  });
}
