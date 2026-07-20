// ========================================
// Firebase Configuration
// Mouad.Dev Portfolio
// ========================================

const firebaseConfig = {

    apiKey: "AIzaSyCnT_TkiRgYOGHYQa3jDqS7clW_g3eSu_Y",

    authDomain: "mouad-dev.firebaseapp.com",

    projectId: "mouad-dev",

    storageBucket: "mouad-dev.firebasestorage.app",

    messagingSenderId: "544768342964",

    appId: "1:544768342964:web:0ae2a480277c142e4f10e1"

};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();