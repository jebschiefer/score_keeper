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

        if (!username || !password) {
            return res.render("login", { error: "Username and password required." });
        }

        if (username === process.env.USERNAME && password === process.env.PASSWORD) {
            req.session.loggedIn = true;
            return res.redirect("/");
        } else {
            return res.render("login", { error: "Incorrect credentials." });
        }
    }
}