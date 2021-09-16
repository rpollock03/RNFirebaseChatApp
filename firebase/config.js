import * as firebase from "firebase";
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDR3dxVvpCCNBVZBk_-qGI-PdGADb_SKYs",
    authDomain: "rnfirebase-chat-778b4.firebaseapp.com",
    projectId: "rnfirebase-chat-778b4",
    storageBucket: "rnfirebase-chat-778b4.appspot.com",
    messagingSenderId: "407488541796",
    appId: "1:407488541796:web:68ae419b58269b7dea9b71",
    measurementId: "G-F316MXPCKW"
};

let app
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
//or export firebase and do firebase.db() etc in the components
export { db, auth };