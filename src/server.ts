import * as bodyParser from "body-parser";
import * as express from "express";
import * as hbs from "express-hbs";
import * as session from "express-session";
import * as favicon from "serve-favicon";
import * as serveStatic from "serve-static";
import * as path from "path";

import { Database } from "./database";
import { Routes } from "./routes";
import { logger } from "./util/logger";

export class Server {

    private app: express.Application;

    constructor() {
        this.app = express();
        Database.init();

        this.configure();
        this.listen();
    }

    public static bootstrap(): Server {
        return new Server();
    }

    private configure(): void {
        this.configureViewEngine();
        this.configureRoutes();
    }

    private configureViewEngine(): void {
        this.app.engine("hbs", hbs.express4({
            defaultLayout: path.join(__dirname, "views/layouts/default"),
        }));
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "hbs");
    }

    private configureRoutes(): void {
        this.app.use(session({
            secret: process.env.SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 3600000, // 1 hour
            },
        }));

        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());

        this.app.use(favicon(path.join(__dirname, "/public/img", "favicon.ico")));
        this.app.use(serveStatic(path.join(__dirname, "/public")));

        const routes = new Routes(express.Router());
        this.app.use(routes.getRouter());
    }

    private listen(): void {
        const port: number|string = process.env.PORT || 8080;

        this.app.listen(port, () => {
            logger.info(`Server running on port ${port}`);
        });
    }

}