import * as firebaseAdmin from "firebase-admin";

export class User {
    constructor(
        public id: string,
        public email: string) {}

    public serialize(): object {
        return {
            id: this.id,
            email: this.email
        };
    }

    public static fromFirebaseObject(data: firebaseAdmin.auth.UserRecord): User {
        const user = new User(data.uid, data.email);
        return user;
    }
}
