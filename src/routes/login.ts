import { AuthService } from "../services";

export class LoginRouter {
    public static get(req, res): void {
        if (req.session && req.session.loggedIn) {
            res.redirect("/");
        } else {
            const data = {
                formAction: "/login",
                isLogin: true
            };

            res.render("login-signup", data);
        }
    }

    public static post(req, res): void {
        const username: string = req.body.username;
        const password: string = req.body.password;

        AuthService.login(username, password)
            .then(data => {
                req.session.jwt = data.token;
                return res.redirect("/");
            })
            .catch(err => {
                return res.render("login-signup", { error: "Incorrect credentials." });
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
