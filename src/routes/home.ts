import { Request, Response } from "express";

import { Game, User } from "../models";
import { AuthService, Database } from "../services";
import { logger } from "../util/logger";

export class HomeRouter {

    public static get(req: Request, res: Response): void {
        const user: User = req["user"];
        const canUpdate = AuthService.userCanUpdate(user);

        Database
            .getGames()
            .then((games: Game[]) => {
                res.render("home", { games, canUpdate });
            })
            .catch((error: any) => {
                logger.error(error);
                res.render("home", { error });
            });
    }

}
