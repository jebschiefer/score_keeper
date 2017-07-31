import { Request, Response } from "express";

import { User } from "../models";
import { AuthService, Database } from "../services";
import { logger } from "../util/logger";

export class GameRouter {

    private static error: any;

    public static get(req: Request, res: Response): void {
        const user: User = req["user"];

        if (!AuthService.userCanUpdate(user)) {
            return res.redirect("/");
        }

        const data = {
            error: GameRouter.error
        }

        return res.render("add-game", data);
    }

    public static post(req: Request, res: Response): void {
        const game = req.body.game;
        const winner = req.body.winner;
        let players = req.body.players;

        if (!Array.isArray(players)) {
            players = [players];
        }

        const data = {
            game,
            winner,
            players
        };

        Database.addGame(data)
            .then(() => {
                res.redirect("/");
            })
            .catch(err => {
                GameRouter.error = err;
                logger.error(err);
                res.redirect("/game/add");
            });
    }

}
