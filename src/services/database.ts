import * as dotenv from "dotenv";
import * as firebase from "firebase-admin";

import { FirebaseAdmin } from "./firebase";
import { Game, Score, User } from "../models";
import { logger } from "../util/logger";

dotenv.config();

export class Database {
    private static db: firebase.database.Database = FirebaseAdmin.database;

    public static addUser(user: User): Promise<User> {
        const data = {
            [user.id]: user.serialize()
        };

        return this.db.ref('users').set(data).then(() => user);
    }

    public static getUserData(user: User): Promise<User> {
        return new Promise((resolve: Function, reject: Function) => {
            this.db.ref(`users/${user.id}`).once(
                "value",
                (snap: firebase.database.DataSnapshot) => {
                    const data = snap.val();
                    user.role = data.role;

                    logger.info("user: %j", user);

                    resolve(user);
                },
                (error: any) => {
                    reject(error);
                }
            )
        });
    }

    public static getGame(id: string): Promise<Game> {
        return new Promise((resolve: Function, reject: Function) => {
            this.db.ref(`games/${id}`).once(
                "value",
                (snap: firebase.database.DataSnapshot) => {
                    const game = new Game({
                        id,
                        name: snap.val()
                    });

                    logger.info("game: %j", game);

                    resolve(game);
                },
                (error: any) => {
                    reject(error);
                }
            )
        });
    }

    public static getGames(): Promise<Game[]> {
        return new Promise((resolve: Function, reject: Function) => {
            this.db.ref("games").once(
                "value",
                (snap: firebase.database.DataSnapshot) => {
                    const data = snap.val();
                    const games = [];

                    console.log(data);

                    Object.keys(data).forEach((key: string) => {
                        const game = new Game({
                            id: key,
                            name: data[key]
                        });

                        games.push(game);
                    });

                    logger.info("games: %j", games);

                    resolve(games);
                },
                (error: any) => {
                    reject(error);
                }
            )
        });
    }

    public static getScores(resource: string): Promise<Score[]> {
        return new Promise((resolve: any, reject: any) => {
            this.db.ref(resource).once(
                "value",
                (snap: firebase.database.DataSnapshot) => {
                    const data = snap.val();
                    const scores = [];

                    Object.keys(data).forEach((key: string) => {
                        const score = new Score({
                            name: key,
                            played: data[key].played,
                            won: data[key].won
                        });

                        scores.push(score);
                    });

                    logger.info("scores: %j", scores);

                    resolve(scores);
                },
                (error: any) => {
                    reject(error);
                }
            );
        });
    }

    public static updateScores(data: any): Promise<any> {
        const promise = Database
            .getScores(data.resource)
            .then((currentScores: Score[]) => {
                const update = {};

                data.scores.forEach((newScore: Score) => {
                    const found = currentScores.find((currentScore: Score) => currentScore.name === newScore.name);

                    if (found) {
                        const playedAttr: string = `${found.name}/played`;

                        update[playedAttr] = found.played + 1;

                        if (newScore.won) {
                            const wonAttr = `${found.name}/won`;
                            update[wonAttr] = found.won + 1;
                        }
                    } else {
                        logger.error(`Existing score not found for ${newScore.name}`);
                    }
                });

                logger.info("new scores: %j", update);

                return update;
            })
            .then((updateData: any) => this.db.ref(data.resource).update(updateData));

        return promise;
    }
}
