import * as dotenv from "dotenv";
import * as firebaseAdmin from "firebase-admin";
import * as firebase from "firebase";

dotenv.config();

const serviceAccount = require("../../config/firebase.json");

const adminConfig = {
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE
};

const clientConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE
};

firebaseAdmin.initializeApp(adminConfig);
firebase.initializeApp(clientConfig);

export class FirebaseAdmin {
    public static auth = firebaseAdmin.auth();
    public static database = firebaseAdmin.database();
}

export const FirebaseClient = firebase;
