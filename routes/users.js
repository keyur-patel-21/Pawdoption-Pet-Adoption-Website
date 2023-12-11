import { Router } from "express";
const router = Router();
import isAuthenticated from "../middleware.js";
import { userData } from "../data/index.js";
import helpers from "../helpers.js";

router.get("/", isAuthenticated, (req, res) => {
  return res.redirect('/pets');
});

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
          emailAddress: user.emailAddress,
          userId: user._id
        };
        //console.log("user id: " + req.session.user.userId)

        res.redirect("/pets");
      } else {
        res.status(400).render("users/login", {
          error: "Invalid email address and/or password",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).render("users/login", { error: error.message });
    }
  });

router.route("/logout").get(async (req, res) => {
  console.log("inside logout path");
  console.log(req.session.user);
  if (req.session.user) {
    req.session.destroy();
    res.status(200).render("users/login", { title: "Logout" });
  }
});

export default router;
