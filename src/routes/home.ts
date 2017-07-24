import { Request, Response } from "express";

import { Game } from "../models";
import { Database } from "../services";
import { logger } from "../util/logger";

export class HomeRouter {

    public static get(req: Request, res: Response): void {
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
