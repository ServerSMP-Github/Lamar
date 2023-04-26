const express = require("express");
const router = express.Router();

const client = require("../../index")

router.get("/", async(req, res) => {
	return res.render("404.ejs");

    res.render("verify/index.ejs", { error: null });
});

router.post("/", async(req, res) => {
	return res.render("404.ejs");

	const token = req.body['cf-turnstile-response'];
	const ip = req.headers['CF-Connecting-IP'];

	const result = await (await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
		body: `secret=${client.config.api.cloudflare}&response=${token}&remoteip=${ip}`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		method: 'POST',
	})).json();

	if (result.success) return res.render("verify/complete.ejs");
    else return res.render("verify/index.ejs", { error: "An error has occurred" });
});

module.exports = {
	router: router,
    name: "verify"
};