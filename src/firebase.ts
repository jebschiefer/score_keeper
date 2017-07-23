import * as dotenv from "dotenv";
import * as firebaseAdmin from "firebase-admin";
import * as firebase from "firebase";

dotenv.config();

const serviceAccount = require("../config/firebase.json");

const adminConfig = {
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE
};

firebaseAdmin.initializeApp(adminConfig);

export class FirebaseAdmin {
    public static auth = firebaseAdmin.auth();
    public static database = firebaseAdmin.database();
}

const clientConfig = {
    apiKey: "AIzaSyCT26uOjRcydJKNSxltEkgZ5nhRTgi2-Ro",
    authDomain: "games-2e358.firebaseapp.com",
    databaseURL: process.env.DATABASE
};

firebase.initializeApp(clientConfig);

export const FirebaseClient = firebase;
