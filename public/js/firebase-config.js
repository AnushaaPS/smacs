const firebaseConfig = {
  apiKey: "AIzaSyA7krkbRhO8-QH6y5bf9l3Lu-Z-ZqNypRk",
  authDomain: "new-project-5a2a7.firebaseapp.com",
  projectId: "new-project-5a2a7",
  storageBucket: "new-project-5a2a7.firebasestorage.app",
  messagingSenderId: "1081850809099",
  appId: "1:1081850809099:web:85c3e43d21ff07e98a700e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
