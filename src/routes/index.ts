import * as express from "express";

import { AuthService } from "../services";
import { logRoute } from "../util/logger";

import { HomeRouter } from "./home";
import { ScoresRouter } from "./scores";
import { LoginRouter } from "./login";

export class Routes {
    constructor(private router: express.Router) {
        this.initRoutes();
    }

    public initRoutes() {
        this.router.all("*", logRoute);
        this.router.all("*", AuthService.loggedIn);

        this.router.all("/", HomeRouter.get);
        this.router.get("/login", LoginRouter.get);
        this.router.post("/login", LoginRouter.post);
        this.router.get("/scores/:game", ScoresRouter.get);

        this.router.post("/api/v1/login", LoginRouter.postJSON);

        this.protectedRoutes();

        this.router.all("*", (req, res) => {
            res.redirect("/");
        });
    }

    public getRouter() {
        return this.router;
    }

    private protectedRoutes(): void {
        this.router.all(
            "/api/*", 
            AuthService.passport.authenticate('jwt', { session: false, failWithError: true }), 
            AuthService.authSuccess, 
            AuthService.authError
        );

        this.router.get('/api/test', (req, res) => {
            return res.json({ message: "success", user: req["user"] });
        });

        this.router.put("/api/scores/:game", ScoresRouter.put);
    }
}
