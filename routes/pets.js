// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import { Router } from "express";
import isAuthenticated from "../middleware.js";
const router = Router();
import { petData } from "../data/index.js";
import helpers from "../helpers.js";
import multer from 'multer';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/pet')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })

// routes to list all pets and create new pets
router.use(isAuthenticated);
router
  .route("/")
  .get(async (req, res) => {
    try {
      const petList = await petData.getAllPets();
      res.render("pets/pets", { pets: petList, user: req.session.user });
    } catch (error) {
      console.log(error);
      res.status(400).render("pets/pets", { error: error.message });
    }
  })

  // route to create new pet 
  .post(upload.single('image'), async (req, res) => {
    const newPetData = req.body;
    //make sure there is something present in the req.body
    if (!newPetData || Object.keys(newPetData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    // Change here for validating input params
    try {
      newPetData.nameInput = helpers.checkString(
        newPetData.nameInput,
        "pet name"
      );
      newPetData.ageInput = helpers.checkStringisNumber(newPetData.ageInput);
      newPetData.genderInput = helpers.checkString(
        newPetData.genderInput,
        "gender"
      );
      newPetData.breedInput = helpers.checkString(
        newPetData.breedInput,
        "breed"
      );
      newPetData.descriptionInput = helpers.checkString(
        newPetData.descriptionInput,
        "description"
      );
      newPetData.typeInput = helpers.checkString(
        newPetData.typeInput,
        "typeOfAnimal"
      );
      newPetData.zipInput = helpers.checkZip(newPetData.zipInput);
      newPetData.adoptionStatusInput = helpers.checkAdoptedStatus(
        newPetData.adoptionStatusInput
      );
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }

    // here we are creating new pet
    try {
      const {
        nameInput,
        ageInput,
        genderInput,
        breedInput,
        descriptionInput,
        typeInput,
        zipInput,
        adoptionStatusInput,
      } = newPetData;
      const newPet = await petData.createPet(
        "temp ID",
        nameInput,
        ageInput,
        genderInput,
        breedInput,
        descriptionInput,
        typeInput,
        zipInput,
        req.file.path,
        adoptionStatusInput
      );

      res.redirect("/pets");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });

// route to open form for creating new pet
router.route("/new").get(async (req, res) => {
  try {
    res.render("pets/form");
  } catch (error) {
    console.log(error);
    res.status(400).render("pets/form", { error: error.message });
  }
});

// route to open form for updating  pet
router.route("/edit/:petId").get(async (req, res) => {
  try {
    req.params.petId = helpers.checkId(req.params.petId, "Id URL Param");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }

  try {
    const pet = await petData.getPetById(req.params.petId);
    res.render("pets/editform", { pet: pet });
  } catch (error) {
    console.log(error);
    res.status(400).render("pets/editform", { error: error.message });
  }
});

// routes to get pet by id, delete pet by id and update pet by id
router
  .route("/:petId")
  .get(async (req, res) => {
    //code here for GET
    //here we are validating petString
    try {
      req.params.petId = helpers.checkId(req.params.petId, "Id URL Param");
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
    //try getting the event by ID
    try {
      const pet = await petData.getPetById(req.params.petId);
      res.render("pets/pet", { pet });
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: error });
    }
  })

  .post(async (req, res) => {
    //code here for PUT
    console.log("inside edit post route");
    console.log(req.body);
    const newPetData = req.body;
    //make sure there is something present in the req.body
    if (!newPetData || Object.keys(newPetData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    // Change here for validating input params
    try {
      newPetData.nameInput = helpers.checkString(
        newPetData.nameInput,
        "pet name"
      );
      newPetData.ageInput = helpers.checkStringisNumber(newPetData.ageInput);
      newPetData.genderInput = helpers.checkString(
        newPetData.genderInput,
        "gender"
      );
      newPetData.breedInput = helpers.checkString(
        newPetData.breedInput,
        "breed"
      );
      newPetData.descriptionInput = helpers.checkString(
        newPetData.descriptionInput,
        "description"
      );
      newPetData.typeInput = helpers.checkString(
        newPetData.typeInput,
        "typeOfAnimal"
      );
      newPetData.zipInput = helpers.checkZip(newPetData.zipInput);
      newPetData.adoptionStatusInput = helpers.checkAdoptedStatus(
        newPetData.adoptionStatusInput
      );
    } catch (error) {
      // console.log(error);
      return res.status(400).json({ error: error.message });
    }

    try {
      console.log("trying to update");
      const updatedPet = await petData.updatePet(
        req.params.petId,
        newPetData
      );
      return res.redirect("/pets/" + req.params.petId);
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: error.message });
    }
  });

router.route("/delete/:petId").get(async (req, res) => {
  //code here for DELETE
  // here we are validating petId
  console.log("inside pet delete route");
  try {
    req.params.petId = helpers.checkId(req.params.petId, "Id URL Param");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
  //
  //try to delete Event
  try {
    await petData.removePet(req.params.petId);
    return res.redirect("/pets");
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
});
  // route to add a comment
  router.route("/addComment/:petId")
  .post(async (req, res) => {
      //validating pet id
      try {
        req.params.petId = helpers.checkId(req.params.petId, "pet ID");
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message });
      }
      //validate comment
      try {
        req.body.comment_input = helpers.checkString(req.body.comment_input, "Comment");
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message });
      }
      // create comment
      try {
        const pet = await petData.createComment(req.params.petId, "6574ec348e7808f37c8224e2", req.body.comment_input);    
       } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
      }
      //reload page to show new comment
      try {
        const pet = await petData.getPetById(req.params.petId);
        res.render("pets/pet", { pet });
      } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
      }
  });
export default router;