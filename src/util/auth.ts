import { Request, Response, NextFunction } from "express";

export class Auth {
    public static requireAuthentication(req: Request, res: Response, next: NextFunction): void {
        if (req["loggedIn"]) {
            next();
        } else if (req.xhr || req.path.includes("/api/")) {
            res.status(401).json({ message: "Authentication required" });
        } else {
            res.redirect("/");
        }
    }

    public static loggedIn(req: Request, res: Response, next: NextFunction): void {
        req["loggedIn"] = req.session && req.session["loggedIn"];
        next();
    }
}
