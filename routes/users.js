import { Router } from "express";
const router = Router();
import isAuthenticated from "../middleware.js";
import { petData, userData } from "../data/index.js";
import helpers from "../helpers.js";
import xss from "xss";

router.get("/", isAuthenticated, (req, res) => {
  return res.redirect("/pets");
});

router
  .route("/register")
  .get(async (req, res) => {
    res.render("users/signup", { title: "Sign Up", layout: "account" });
  })
  .post(async (req, res) => {
    try {
      const {
        firstNameInput,
        lastNameInput,
        emailAddressInput,
        passwordInput,
        confirmPasswordInput,
      } = req.body;

      const firstName = helpers.checkString(xss(firstNameInput), "first name");
      const lastName = helpers.checkString(xss(lastNameInput), "last name");
      const emailAddress = helpers.checkEmail(xss(emailAddressInput));
      const passwordReg =
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()\-_=+{}[\]:;"'<>,.?/|\\]).{8,}$/;

      if (
        passwordInput.length === 0 ||
        /\s/.test(passwordInput) ||
        !passwordReg.test(passwordInput)
      ) {
        return res.status(400).render("users/signup", {
          error: "Please provide valid password",
          layout: "account",
        });
      }

      if (passwordInput !== confirmPasswordInput) {
        return res.status(400).render("users/signup", {
          error: "Password and confirmPassword do not match",
          layout: "account",
        });
      }

      const result = await userData.createUser(
        xss(firstName),
        xss(lastName),
        xss(emailAddress),
        xss(passwordInput)
      );

      if (result.insertedUser) {
        res.redirect("/login");
      } else {
        res.status(500).send("Internal Server Error");
      }
    } catch (error) {
      res
        .status(400)
        .render("users/signup", { error: error, layout: "account" });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    res.render("users/signin", { title: "Sign In", layout: "account" });
  })
  .post(async (req, res) => {
    try {
      const { emailAddressInput, passwordInput } = req.body;

      const emailAddress = helpers.checkEmail(xss(emailAddressInput));
      const trimmedPassword = xss(passwordInput.trim());

      if (!emailAddress || !trimmedPassword) {
        return res.status(400).render("signin", {
          error: "Email address and password are required",
          layout: "account",
        });
      }

      const user = await userData.loginUser(
        emailAddress.toLowerCase(),
        trimmedPassword
      );

      if (user) {
        res.cookie("AuthState", true);
        req.session.user = {
          id: xss(user._id),
          firstName: xss(user.firstName),
          lastName: xss(user.lastName),
          emailAddress: xss(user.emailAddress),
          favoritePets: user.favoritePets,
        };
        //console.log("user id: " + req.session.user.userId)

        res.redirect("/pets");
      } else {
        res.status(400).render("users/signin", {
          error: "Invalid email address and/or password",
          layout: "account",
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .render("users/signin", { error: error, layout: "account" });
    }
  });

router.route("/logout").get(async (req, res) => {
  if (req.session.user) {
    req.session.destroy();
    res
      .status(200)
      .render("users/signin", { title: "Sign In", layout: "account" });
  } else {
    res.redirect("/login");
  }
});

router.route("/addToFavourites/:petId").get(async (req, res) => {
  const petId = helpers.checkId(req.params.petId, "pet id");
  const userId = helpers.checkId(req.session.user.id, "user id");

  try {
    const result = await userData.addFavoritePet(petId, userId);

    if (result) {
      return res.redirect("/pets/" + req.params.petId);
    } else {
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.log(error.message);
    res.redirect("/pets/" + req.params.petId);
  }
});

router.route("/removeFromFavourites/:petId").get(async (req, res) => {
  const petId = helpers.checkId(req.params.petId, "pet id");
  const userId = helpers.checkId(req.session.user.id, "user id");

  try {
    await userData.removeFavoritePet(petId, userId);
    //req.session.user = delFav.updatedInfo;
    //console.log("req session", req.session.user)

    if (result) {
      return res.rendirect("/pets/" + req.params.petId);
    } else {
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/pets/" + req.params.petId);
  }
});

router.route("/about").get(async (req, res) => {
  res.render("pages/about", {
    title: "About | Pawdoption",
    user: req.session.user,
  });
});

router.route("/profile").get(async (req, res) => {
  if (req.session.user) {
    const name = `${req.session.user.firstName} ${req.session.user.lastName}`;
    res.render("users/profile", {
      title: `${name} | Pawdoption`,
      user: req.session.user,
    });
  } else {
    res.redirect("/pets");
  }
});

export default router;
