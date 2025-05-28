# 🎬 Filmoteka – Wirtualna Biblioteczka Filmowa

Aplikacja webowa do dodawania, oceniania i przeglądania filmów oraz recenzji innych użytkowników. Projekt zaliczeniowy na przedmiot **Projektowanie Aplikacji Internetowych** (WSB Merito, lato 2025).

## 👥 Autorzy
- **Amelia Danił** – Backend, Bazy danych
- **Sebastian Woźniak** – Frontend, UI/UX

## 📌 Opis
Aplikacja umożliwia użytkownikom:
- Rejestrowanie konta i logowanie (z użyciem e-maila lub konta Google)
- Wyszukiwanie filmów przez TMDb API (tytuł, gatunek, rok, aktor)
- Dodawanie filmów do list: Ulubione, Do obejrzenia, Obejrzane
- Ocenianie filmów (1–10) i dodawanie recenzji
- Komentowanie i przeglądanie recenzji innych użytkowników
- Podgląd swojego profilu z historią aktywności

Użytkownicy **premium** mają dostęp do:
- Systemu rekomendacji filmów
- Trybu „kino” – losowania filmu z listy „do obejrzenia”
- Eksportu danych (PDF / CSV)

## 🧩 Technologie

### Frontend:
- React
- Tailwind CSS
- React Router
- Axios

### Backend:
- Node.js + Express
- MongoDB Atlas (Mongoose)
- JWT (autoryzacja)
- TMDb API (zewnętrzne źródło danych)

## 🔐 Funkcje użytkownika

- Rejestracja i logowanie (e-mail / Google)
- Wyszukiwanie filmów
- Przeglądanie szczegółów filmu (opis, obsada, zwiastun, plakat)
- Recenzje i oceny (1–10)
- Komentarze do recenzji
- Listy filmów:
  - ❤️ Ulubione
  - 🎞️ Do obejrzenia
- Widok profilu z aktywnością użytkownika

## 🚀 Uruchamianie lokalnie

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Wymagane zmienne `.env`

#### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/filmoteka
JWT_SECRET=jakies_super_tajne_haslo
TMDB_API_KEY=twoj_klucz_z_tmdb
```

## 📝 API (wybrane endpointy)

- `POST /api/auth/register` – rejestracja
- `POST /api/auth/login` – logowanie
- `GET /api/tmdb/search?query=Matrix` – wyszukiwanie filmów
- `POST /api/reviews` – dodaj recenzję
- `GET /api/user/mylists` – pobierz listy użytkownika
- `POST /api/user/export` – eksport danych (PDF/CSV, premium)

## 🌐 Deployment
Projekt gotowy do wdrożenia na:
- Railway / Render (backend)
- Vercel (frontend)
- Użycie `.env.production` dla produkcji

## 📄 Licencja
Projekt edukacyjny – WSB Merito, 2025
