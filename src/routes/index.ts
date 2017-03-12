import * as express from "express";

import { Database } from "../database";
import { Auth } from "../util/auth";
import { logger, logRoute } from "../util/logger";

import { HomeRouter } from "./home";
import { ScoresRouter } from "./scores";
import { LoginRouter } from "./login";

export class Routes {
    constructor(private router: express.Router) {
        this.initRoutes();
    }

    public initRoutes() {
        this.router.all("*", logRoute);
        this.router.all("*", Auth.loggedIn);

        this.router.all("/", HomeRouter.get);
        this.router.get("/login", LoginRouter.get);
        this.router.post("/login", LoginRouter.post);
        this.router.get("/scores/:game", ScoresRouter.get);

        this.protectedRoutes();

        this.router.all("*", (req, res) => {
            res.redirect("/");
        });
    }

    public getRouter() {
        return this.router;
    }

    private protectedRoutes(): void {
        this.router.all("/api/*", Auth.requireAuthentication);

        this.router.put("/api/scores/:game", ScoresRouter.put);
    }
}