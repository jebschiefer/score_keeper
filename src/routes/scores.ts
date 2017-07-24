import { Request, Response } from "express";

import { Game, Score, User } from "../models";
import { Database } from "../services";
import { logger } from "../util/logger";

export class ScoresRouter {
    private static success: string;
    private static error: any;

    public static get(req: Request, res: Response): void {
        const user: User = req["user"];
        const gameId: string = req.params.game;

        const gamePromise = Database.getGame(gameId);
        const scoresPromise = Database.getScores(gameId);

        const canUpdate = user ? user.isAdmin() : false;

        Promise.all([
            gamePromise,
            scoresPromise
        ]).then((values: any[]) => {
            const game = values[0] as Game;
            const scores = values[1] as Score[];

            const data = {
                canUpdate,
                scores,
                game: game.name,
                success: ScoresRouter.success,
                error: ScoresRouter.error
            };

            ScoresRouter.success = null;
            ScoresRouter.error = null;

            res.render("scores", data);
        }).catch((error: any) => {
            logger.error(error);
            res.render("scores", { game: gameId, error });
        });

    }

    public static put(req: Request, res: Response): void {
        const game: string = req.params.game;
        const scores = req.body.players as Score[] || [];

        logger.debug("%j", scores);

        const data = {
            resource: game,
            scores
        };

        Database
            .updateScores(data)
            .then(() => {
                ScoresRouter.success = "Updated the scores!";

                res.json({ message: ScoresRouter.success });
            })
            .catch((error: any) => {
                logger.error(error);
                ScoresRouter.error = error.message;

                res.status(error.statusCode || 500).json({ message: error.message });
            });
    }
}
