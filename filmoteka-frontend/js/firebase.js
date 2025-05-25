// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Konfiguracja Twojej aplikacji Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCDESBJ4RMdWA1RveiPPjPr_OJXxv4B97U",
  authDomain: "filmoteka-f0f9e.firebaseapp.com",
  projectId: "filmoteka-f0f9e",
  storageBucket: "filmoteka-f0f9e.appspot.com", // ✅ poprawiona wartość
  messagingSenderId: "734589156373",
  appId: "1:734589156373:web:063149dcf264b6931fa21c",
  measurementId: "G-607GQXSLL1"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app); // Analytics — opcjonalne

// Eksport uwierzytelniania
export const auth = getAuth(app);





