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
      res.status(400).render("register/register", { error: error.message });
    }
  });

export default router;
