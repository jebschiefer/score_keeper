import {Request, Response } from "express";

import { Game } from "../models";
import { Database } from "../database";
import { logger } from "../util/logger";

export class HomeRouter {

    public static get(req: Request, res: Response): void {
        const loggedIn: boolean = req["loggedIn"];
        const game: string = req.params.game;

        Database
            .getGames()
            .then((games: Game[]) => {
                res.render("home", { games });
            })
            .catch((error: any) => {
                logger.error(error);
                res.render("home", { error });
            });
    }

}