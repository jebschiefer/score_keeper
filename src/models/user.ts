import * as firebaseAdmin from "firebase-admin";

export class User {
    constructor(
        public id: string,
        public email: string,
        public role: string
    ) {}

    public isAdmin(): boolean {
        return this.role === "admin";
    }

    public serialize(): object {
        return {
            id: this.id,
            email: this.email,
            role: this.role
        };
    }

    public static fromFirebaseObject(data: firebaseAdmin.auth.UserRecord): User {
        const user = new User(data.uid, data.email, "user");
        return user;
    }
}
