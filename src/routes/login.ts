import { AuthService } from "../services";

export class LoginRouter {
    public static get(req, res): void {
        if (req.session && req.session.loggedIn) {
            res.redirect("/");
        } else {
            res.render("login");
        }
    }

    public static post(req, res): void {
        const username: string = req.body.username;
        const password: string = req.body.password;
        
        AuthService.login(username, password)
            .then(data => {
                req.session.loggedIn = true;
                return res.redirect("/");
            })
            .catch(err => {
                return res.render("login", { error: "Incorrect credentials." });
            });
    }

    public static postJSON(req, res) {
        const username: string = req.body.username;
        const password: string = req.body.password;

        AuthService.login(username, password)
            .then(data => res.json(data))
            .catch(err => res.status(err.status || 401).json({ message: err.message }));
    }
}
