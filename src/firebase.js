import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCMv6ZGiWo5fGXJfTh47elv2rx6xLNUzCs",
    authDomain: "todoslistproject.firebaseapp.com",
    projectId: "todoslistproject",
    storageBucket: "todoslistproject.appspot.com",
    messagingSenderId: "157049499939",
    appId: "1:157049499939:web:8eefd94af0e855d3855c96",
    databaseURL:
        "https://todoslistproject-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
