import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

import { Database, FirebaseAdmin, FirebaseClient } from "../services";
import { User } from "../models";
import { logger } from "../util/logger";

dotenv.config();

const secret = process.env.SECRET;
const algorithm = "HS256";

export class AuthService {

    public static authError(req, res, err?) {
        let message = "Authentication required";
        let status = 401;

        if (err) {
            message = err.message;
            status = err.status || status;
        }

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

    public static checkToken(req: Request, res: Response, next: NextFunction) {
        let token;

        if (req.headers["x-access-token"]) {
            token = req.headers["x-access-token"]
        } else if (req.session && req.session['jwt']) {
            token = req.session['jwt'];
        }

        if (!token) {
            next();
        } else {
            const options = { algorithms: [algorithm] };

            jwt.verify(token, secret, options, (err, decoded) => {
                if (err) {
                    logger.error(err);
                } else {
                    req["user"] = new User(decoded.sub, decoded.email, decoded.role);
                }

                next();
            });
        }
    }

    public static requiresAdmin(req: Request, res: Response, next: NextFunction): Response|void {
        const user: User = req["user"];

        if (user && user.isAdmin()) {
            next();
        } else {
            const error = new Error("This action requires admin privileges");
            error["status"] = 401;

            AuthService.authError(req, res, error);
        }
    }

    public static requiresLogin(req: Request, res: Response, next: NextFunction): Response|void {
        const user: User = req["user"];

        if (user) {
            return next();
        } else {
            return AuthService.authError(req, res);
        }
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
            .then(data => User.fromFirebaseObject(data))
            .then((user: User) => Database.getUserData(user))
            .then((user: User) => {
                const token = AuthService.createToken(user);
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
            const token = AuthService.createToken(user);
            return { token };
        });

        return promise;
    }

    private static createToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };

        const options = {
            algorithm,
            expiresIn: "1 day"
        };

        return jwt.sign(payload, secret, options);
    }
}
