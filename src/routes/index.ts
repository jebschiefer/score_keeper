import * as express from "express";

import { AuthService } from "../services";
import { logRoute } from "../util/logger";

import { HomeRouter } from "./home";
import { LoginRouter } from "./login";
import { ScoresRouter } from "./scores";
import { SignupRouter } from "./signup";

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
        this.router.get("/signup", SignupRouter.get);
        this.router.post("/signup", SignupRouter.post);

        this.router.post("/api/login", LoginRouter.postJSON);

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

        this.router.put("/api/scores/:game", ScoresRouter.put);
    }
}
