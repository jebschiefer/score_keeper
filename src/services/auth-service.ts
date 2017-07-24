import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { FirebaseAdmin, FirebaseClient } from "../firebase";
import { Database } from "../database";
import { User } from "../models";

dotenv.config();

const secret = process.env.SECRET;
const algorithm = "HS256";

const sessionExtractor = (req) => {
    let token = null;

    if (req && req.session) {
        token = req.session['jwt'];
    }

    return token;
};

const options = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
        sessionExtractor
    ]),
    algorithms: [algorithm]
};

passport.use(new Strategy(options, (payload, next) => {
    const id = payload.sub;

    if (!id) {
        return next(null, false);
    }

    FirebaseAdmin.auth.getUser(id)
        .then(firebaseUser => {
            if (!firebaseUser) {
                return next(null, false);
            }

            const user = {
                id: firebaseUser.uid,
                email: firebaseUser.email
            };

            next(null, user);
        })
        .catch(error => next(error));
}));

export class AuthService {

    public static passport = passport;

    public static authSuccess(req, res, next) {
        next();
    }

    public static authError(err, req, res, next) {
        const message = err.message || "Authentication required";
        const status = err.status || 401;

        if (req.xhr || req.path.includes("/api/")) {
            return res.status(status).json({ message });
        } else {
            return res.redirect("/");
        }
    }

    public static loggedIn(req: Request, res: Response, next: NextFunction): void {
        req["loggedIn"] = req.session && req.session["jwt"];
        next();
    }

    public static login(username, password): Promise<any> {
        if (!username || !password) {
            const error = new Error("Username and password required.");
            error["status"] = 400;
            return Promise.reject(error);
        }

        const promise = FirebaseClient
            .auth()
            .signInWithEmailAndPassword(username, password)
            .then(data => {
                const token = AuthService.createToken(data.uid, data.email);
                return { token };
            });
        
        return promise as Promise<any>;
    }

    public static signup(username, password): Promise<any> {
        if (!username || !password) {
            const error = new Error("Username and password required.");
            error["status"] = 400;
            return Promise.reject(error);
        }

        const promise = FirebaseAdmin.auth.createUser({
            email: username,
            password,
        }).then(data => {
            const user = User.fromFirebaseObject(data);
            return Database.addUser(user);
        }).then((user: User) => {
            const token = AuthService.createToken(user.id, user.email);
            return { token };
        });

        return promise;
    }

    private static createToken(id, email): string {
        const payload = {
            sub: id,
            email,
        };

        const options = {
            algorithm,
            expiresIn: "1 day"
        };

        return jwt.sign(payload, secret, options);
    }
}
