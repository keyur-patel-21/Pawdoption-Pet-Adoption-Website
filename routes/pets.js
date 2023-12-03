// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import { Router } from "express";
const router = Router();
import { petData } from "../data/index.js";
import helpers from "../helpers.js";

// routes to list all pets and create new pets
router
  .route("/")
  .get(async (req, res) => {
    try {
      const petList = await petData.getAllPets();
      res.render("pets/pets", {pets: petList});
    } catch (error) {
      console.log(error);
      res.status(400).render("pets/pets", { error: error.message });
    }
  })
  .post(async (req, res) => {
    const newPetData = req.body;
    //make sure there is something present in the req.body
    if (!newPetData || Object.keys(newPetData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    // Change here for validating input params
    try {
      console.log(req.body);
      newPetData.nameInput = helpers.checkString(newPetData.nameInput, "pet name");
      newPetData.ageInput = helpers.checkStringisNumber(newPetData.ageInput);
      newPetData.genderInput = helpers.checkString(newPetData.genderInput, "gender");
      newPetData.breedInput = helpers.checkString(newPetData.breedInput, "breed");
      newPetData.descriptionInput = helpers.checkString(newPetData.descriptionInput, "description");
      newPetData.typeInput = helpers.checkString(newPetData.typeInput, "typeOfAnimal");
      newPetData.zipInput = helpers.checkZip(newPetData.zipInput);
      newPetData.adoptionStatusInput = helpers.checkAdoptedStatus(newPetData.adoptionStatusInput);
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
      console.log(adoptionStatusInput)
      const newPet = await petData.createPet(
        "temp ID",
        nameInput,
        ageInput,
        genderInput,
        breedInput,
        descriptionInput,
        typeInput,
        zipInput,
        "temp_pic.png",
        adoptionStatusInput,
      );
      res.redirect("/pets");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });

// route to open form for creating new pet
router
  .route("/new")
  .get(async (req, res) => {
    try {
      res.render("pets/form");
    } catch (error) {
      console.log(error);
      res.status(400).render("pets/form", { error: error.message });
    }
  })

// routes to get pet by id, delete pet by id and update pet by id
router
  .route("/:petId")
  .get(async (req, res) => {
    //code here for GET

    //here we are validating petString
    // try {
    //   req.params.petId = checkId(req.params.eventId, "Id URL Param");
    // } catch (error) {
    //    console.log(error);
    //   return res.status(400).json({ error: e });
    // }
    //try getting the event by ID
    try {
      const pet = await petData.get(req.params.petId);
      res.json(pet);
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE

    // here we are validating petId
    // try {
    //   req.params.eventId = checkId(req.params.eventId, "Id URL Param");
    // } catch (error) {
    //    console.log(error);
    //   return res.status(400).json({ error: e });
    // }
    //try to delete Event
    try {
      let deletedPet = await petData.remove(req.params.petId);
      res.json(deletedPet);
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: e });
    }
  })
  .put(async (req, res) => {
    //code here for PUT
    const updatedpetData = req.body;
    //make sure there is something present in the req.body
    if (!updatedeventData || Object.keys(updatedeventData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    //here we are validating input params for updatig pet, need to make changes

    // try {
    //   req.params.eventId = checkId(req.params.eventId, 'ID url param');
    //   if (
    //     !updatedeventData.eventName ||
    //     typeof updatedeventData.eventName !== "string" ||
    //     updatedeventData.eventName.trim().length < 5
    //   ) {
    //     throw "Invalid or missing eventName";
    //   }
    //   updatedeventData.eventName = updatedeventData.eventName.trim();

    //   if (
    //     !updatedeventData.eventDescription ||
    //     typeof updatedeventData.eventDescription !== "string" ||
    //     updatedeventData.eventDescription.trim().length < 25
    //   ) {
    //     throw "Invalid or missing eventDescription";
    //   }
    //   updatedeventData.eventDescription = updatedeventData.eventDescription.trim();

    //   if (
    //     !updatedeventData.contactEmail ||
    //     typeof updatedeventData.contactEmail !== "string" ||
    //     !isValidEmail(updatedeventData.contactEmail.trim())
    //   ) {
    //     throw "Invalid or missing contactEmail";
    //   }
    //   updatedeventData.contactEmail = updatedeventData.contactEmail.trim();

    //   if (
    //     !updatedeventData.eventDate ||
    //     typeof updatedeventData.eventDate !== "string" ||
    //     !isValidDate(updatedeventData.eventDate)
    //   ) {
    //     throw "Invalid or missing eventDate";
    //   }
    //   updatedeventData.eventDate = updatedeventData.eventDate.trim();

    //   const eventDate = new Date(updatedeventData.eventDate);

    //   if (eventDate <= new Date()) {
    //     throw "Event date must be in the future";
    //   }

    //   if (
    //     !updatedeventData.startTime ||
    //     typeof updatedeventData.startTime !== "string" ||
    //     !isValidTime(updatedeventData.startTime)
    //   ) {
    //     throw "Invalid or missing startTime";
    //   }
    //   updatedeventData.startTime = updatedeventData.startTime.trim();

    //   if (
    //     !updatedeventData.endTime ||
    //     typeof updatedeventData.endTime !== "string" ||
    //     !isValidTime(updatedeventData.endTime)
    //   ) {
    //     throw "Invalid or missing endTime";
    //   }
    //   updatedeventData.endTime = updatedeventData.endTime.trim();

    //   const startTime = new Date(`2000-01-01 ${updatedeventData.startTime}`);
    //   const endTime = new Date(`2000-01-01 ${updatedeventData.endTime}`);

    //   if (startTime >= endTime) {
    //     throw "Start time must be earlier than end time";
    //   }

    //   if (endTime - startTime < 30 * 60 * 1000) {
    //     throw "End time should be at least 30 minutes later than start time";
    //   }

    //   if (typeof updatedeventData.publicEvent !== "boolean") {
    //     throw "Invalid or missing publicEvent";
    //   }

    //   if (
    //     updatedeventData.maxCapacity === undefined ||
    //     typeof updatedeventData.maxCapacity !== "number" ||
    //     updatedeventData.maxCapacity <= 0
    //   ) {
    //     throw "Invalid or missing maxCapacity";
    //   }

    //   if (
    //     updatedeventData.priceOfAdmission === undefined ||
    //     (typeof updatedeventData.priceOfAdmission !== "number" &&
    //       typeof updatedeventData.priceOfAdmission !== "string") ||
    //     parseFloat(updatedeventData.priceOfAdmission) < 0
    //   ) {
    //     throw "Invalid or missing priceOfAdmission";
    //   }

    //   updatedeventData.maxCapacity = parseInt(updatedeventData.maxCapacity);

    //   if (typeof updatedeventData.eventLocation !== "object") {
    //     throw "Invalid eventLocation";
    //   }

    //   if (
    //     typeof updatedeventData.eventLocation.streetAddress !== "string" ||
    //     updatedeventData.eventLocation.streetAddress.trim().length < 3 ||
    //     typeof updatedeventData.eventLocation.city !== "string" ||
    //     updatedeventData.eventLocation.city.trim().length < 3 ||
    //     typeof updatedeventData.eventLocation.state !== "string" ||
    //     !isValidState(updatedeventData.eventLocation.state) ||
    //     typeof updatedeventData.eventLocation.zip !== "string" ||
    //     !isValidZip(updatedeventData.eventLocation.zip)
    //   ) {
    //     throw "Invalid eventLocation properties";
    //   }
    //   updatedeventData.eventLocation.streetAddress =
    //   updatedeventData.eventLocation.streetAddress.trim();
    //   updatedeventData.eventLocation.city = updatedeventData.eventLocation.city.trim();
    //   updatedeventData.eventLocation.state =
    //   updatedeventData.eventLocation.state.trim();
    // } catch (error) {
    //    console.log(error);
    //   return res.status(400).json({ error: e.message });
    // }

    try {
      const updatedPet = await petData.updatePet(
        req.params.petId,
        updatedpetData
      );
      res.json(updatedPet);
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: e.message });
    }
  });

export default router;
