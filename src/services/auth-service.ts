import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { FirebaseAdmin, FirebaseClient } from "../firebase";

dotenv.config();

const secret = process.env.SECRET;
const algorithm = "HS256";

const options = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
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
        req["loggedIn"] = req.session && req.session["loggedIn"];
        next();
    }

    public static login(username, password): Promise<object> {
        if (!username || !password) {
            const error = new Error("Username and password required.");
            error["status"] = 400;
            return Promise.reject(error);
        }

        const promise = FirebaseClient
            .auth()
            .signInWithEmailAndPassword(username, password)
            .then(data => {
                const payload = {
                    sub: data.uid,
                    email: data.email,
                };

                const options = {
                    algorithm,
                    expiresIn: "1 day"
                };

                const token = jwt.sign(payload, secret, options);

                return { token };
            });
        
        return promise as Promise<object>;
    }
}
