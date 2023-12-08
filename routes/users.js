import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import helpers from "../helpers.js";

router
  .route("/register")
  .get(async (req, res) => {
    res.render("users/register", { title: "Sign up" });
  })
  .post(async (req, res) => {
    const {
      firstNameInput,
      lastNameInput,
      emailAddressInput,
      passwordInput,
      confirmPasswordInput,
    } = req.body;

    const firstName = helpers.checkString(firstNameInput, "first name");
    const lastName = helpers.checkString(lastNameInput, "last name");
    const emailAddress = helpers.checkEmail(emailAddressInput);

    if (passwordInput !== confirmPasswordInput) {
      return res.status(400).render("users/register", {
        error: "Password and confirmPassword do not match",
      });
    }

    try {
      const result = await userData.createUser(
        firstName,
        lastName,
        emailAddress,
        passwordInput
      );

      if (result.insertedUser) {
        res.redirect("/login");
      } else {
        res.status(500).send("Internal Server Error");
      }
    } catch (error) {
      res.status(400).render("users/register", { error: error.message });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    res.render("users/login", { title: "Login Page" });
  })
  .post(async (req, res) => {
    console.log("inside login post route")
    const { emailAddressInput, passwordInput } = req.body;

    const emailAddress = helpers.checkEmail(emailAddressInput);
    const trimmedPassword = passwordInput.trim();

    if (!emailAddress || !trimmedPassword) {
      return res
        .status(400)
        .render("login", { error: "Email address and password are required" });
    }

    try {
      const user = await userData.loginUser(
        emailAddress.toLowerCase(),
        trimmedPassword
      );

      if (user) {
        res.cookie("AuthState", true);

        req.session.user = {
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddress: user.email,
        };

        res.redirect("/pets");
      } else {
        res
          .status(400)
          .render("users/login", { error: "Invalid email address and/or password" });
      }
    } catch (error) {
      console.log(error)
      res.status(400).render("users/login", { error: error.message });
    }
  });

export default router;
