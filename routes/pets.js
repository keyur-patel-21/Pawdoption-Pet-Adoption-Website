// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import { Router } from "express";
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
router
  .route("/")
  .get(async (req, res) => {
    try {
      const petList = await petData.getAllPets();
      res.render("pets/pets", { pets: petList });
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
        adoptionStatusInput
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
    res.render("pets/editform", {pet: pet});
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
  .delete(async (req, res) => {
    //code here for DELETE
    // here we are validating petId
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
      res.render("pets/pets");
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: error.message });
    }
  })
  .put(async (req, res) => {
    //code here for PUT
    console.log("inside put route")
    const updatedpetData = req.body;
    //make sure there is something present in the req.body
    if (!updatedpetData || Object.keys(updatedpetData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    //here we are validating input params for updatig pet, need to make changes

    try {
      console.log("on 4")
      req.params.petId = helpers.checkId(req.params.petId, "Id URL Param");
      updatedpetData.nameInput = helpers.checkString(
        updatedpetData.nameInput,
        "pet name"
      );
      updatedpetData.ageInput = helpers.checkStringisNumber(
        updatedpetData.ageInput
      );
      updatedpetData.genderInput = helpers.checkString(
        updatedpetData.genderInput,
        "gender"
      );
      updatedpetData.breedInput = helpers.checkString(
        updatedpetData.breedInput,
        "breed"
      );
      updatedpetData.descriptionInput = helpers.checkString(
        updatedpetData.descriptionInput,
        "description"
      );
      updatedpetData.typeInput = helpers.checkString(
        updatedpetData.typeInput,
        "typeOfAnimal"
      );
      updatedpetData.zipInput = helpers.checkZip(updatedpetData.zipInput);
      updatedpetData.adoptionStatusInput = helpers.checkAdoptedStatus(
        updatedpetData.adoptionStatusInput
      );
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: e.message });
    }

    try {
      console.log("trying to update")
      const updatedPet = await petData.updatePet(
        req.params.petId,
        updatedpetData
      );
      res.json(updatedPet);
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