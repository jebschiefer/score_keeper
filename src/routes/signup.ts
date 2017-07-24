import { AuthService } from "../services";

export class SignupRouter {
    public static get(req, res): void {
        if (req["user"]) {
            res.redirect("/");
        } else {
            const data = {
                formAction: "/signup",
                isLogin: false
            };

            res.render("login-signup", data);
        }
    }

    public static post(req, res): void {
        const username: string = req.body.username;
        const password: string = req.body.password;

        AuthService.signup(username, password)
            .then(data => {
                req.session.jwt = data.token;
                return res.redirect("/");
            })
            .catch(err => {
                return res.render("login-signup", { error: err.message });
            });
    }

    public static postJSON(req, res) {
        const username: string = req.body.username;
        const password: string = req.body.password;

        AuthService.signup(username, password)
            .then(data => res.json(data))
            .catch(err => res.status(err.status || 401).json({ message: err.message }));
    }
}
