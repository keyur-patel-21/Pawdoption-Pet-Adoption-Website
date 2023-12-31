// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import { Router } from "express";
import isAuthenticated from "../middleware.js";
const router = Router();
import { petData } from "../data/index.js";
import { userData } from "../data/index.js";
import helpers from "../helpers.js";
import multer from 'multer';
import xss from 'xss';

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/img/pet/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

var upload = multer({ storage: storage })

// routes to list all pets and create new pets
router.use(isAuthenticated);

router.route("/api").get(async (req, res) => {
	const petSearch = req.query;

	//make sure there is something present in the req.query
	if (!petSearch) {
		return res.status(400).json({ error: "There are no fields in the request query" });
	}

	try {
		const petList = await petData.getPetsBySearch(xss(petSearch.searchPetZip), xss(petSearch.searchPetType));
		res.json(petList);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router
	.route("/")
	.get(async (req, res) => {
		try {
			const petList = await petData.getAllPets();
			res.render("pets/home", { title: "Home | Pawdoption", pets: petList, user: xss(req.session.user) });
		} catch (error) {
			console.log(error);
			res.status(400).render("pets/home", { error: error, user: req.session.user });
		}
	})

	// route to create new pet 
	.post(upload.single('image'), async (req, res) => {
		const newPetData = req.body;
		//make sure there is something present in the req.body
		if (!newPetData || Object.keys(newPetData).length === 0) {
			return res.status(400).json({ error: "There are no fields in the request body" });
		}
		// Change here for validating input params
		try {
			newPetData.nameInput = helpers.checkString(
				xss(newPetData.nameInput),
				"pet name"
			);
			newPetData.ageInput = helpers.checkStringisNumber(xss(newPetData.ageInput));
			newPetData.genderInput = helpers.checkString(
				xss(newPetData.genderInput),
				"gender"
			);
			newPetData.breedInput = helpers.checkString(
				xss(newPetData.breedInput),
				"breed"
			);
			newPetData.descriptionInput = helpers.checkString(
				xss(newPetData.descriptionInput),
				"description"
			);
			newPetData.typeInput = helpers.checkString(
				xss(newPetData.typeInput),
				"typeOfAnimal"
			);
			newPetData.zipInput = helpers.checkZip(xss(newPetData.zipInput));
			newPetData.adoptionStatusInput = helpers.checkAdoptedStatus(
				xss(newPetData.adoptionStatusInput)
			);
			newPetData.picture = helpers.checkPicture(req.file)

			// here we are creating new pet
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
				xss(req.session.user.id),
				xss(nameInput),
				xss(ageInput),
				xss(genderInput),
				xss(breedInput),
				xss(descriptionInput),
				xss(typeInput),
				xss(zipInput),
				newPetData.picture,
				xss(adoptionStatusInput)
			);

			res.redirect("/pets");
		} catch (error) {
			console.log(error);
			res.status(500).render("pets/new-pet", { error: error });
		}
	});

// route to open form for creating new pet
router.route("/new").get(async (req, res) => {
	try {
		res.render("pets/new-pet", { title: "Add Pet | Pawdoption", user: req.session.user });
	} catch (error) {
		console.log(error);
		res.status(400).render("pets/new-pet", { error: error, user: req.session.user });
	}
});

// route to open form for updating  pet
router.route("/edit/:petId").get(async (req, res) => {
	try {
		req.params.petId = helpers.checkId(xss(req.params.petId), "Id URL Param");
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: error.message });
	}
	try {
		let pet = await petData.getPetById(xss(req.params.petId));
		res.render("pets/update-pet", { title: "Update Pet | Pawdoption", pet: pet, user: req.session.user });
	} catch (error) {
		console.log(error);
		res.status(400).render("pets/update-pet", { error: error, user: req.session.user });
	}
});

// routes to get pet by id, delete pet by id and update pet by id
router
	.route("/:petId")
	.get(async (req, res) => {
		//code here for GET
		//here we are validating petString
		try {
			req.params.petId = helpers.checkId(xss(req.params.petId), "Id URL Param");
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message });
		}
		//try getting the event by ID
		try {
			const pet = await petData.getPetById((req.params.petId));
			const updatedUser = await userData.getUserById((req.session.user.id))
			if (updatedUser) {
				req.session.user = {
					id: xss(updatedUser._id),
					firstName: xss(updatedUser.firstName),
					lastName: xss(updatedUser.lastName),
					emailAddress: xss(updatedUser.emailAddress),
					favoritePets: (updatedUser.favoritePets),
				};
			}

			let isCreator = false;
			if (JSON.stringify(req.session.user.id) === JSON.stringify(pet.creatorId)) isCreator = true;
			if (JSON.stringify(req.session.user.favoritePets).includes(JSON.stringify(pet._id))) {
				res.render("pets/pet", { title: `${pet.name} | Pawdoption`, pet: pet, isFavorite: true, isCreator: isCreator, user: req.session.user });
			} else {
				res.render("pets/pet", { title: `${pet.name} | Pawdoption`, pet: pet, isFavorite: false, isCreator: isCreator, user: req.session.user });
			}
		} catch (error) {
			console.log(error);
			res.status(404).json({ error: error });
		}
	})

	.post(upload.single('image'), async (req, res) => {
		//code here for PUT
		const newPetData = req.body;
		//make sure there is something present in the req.body
		if (!newPetData || Object.keys(newPetData).length === 0) {
			return res.status(400).render("pets/update-pet", { error: error, user: req.session.user });
		}
		// Change here for validating input params
		try {

			newPetData.nameInput = helpers.checkString(
				xss(newPetData.nameInput),
				"pet name"
			);
			newPetData.ageInput = helpers.checkStringisNumber(xss(newPetData.ageInput));
			newPetData.genderInput = helpers.checkString(
				xss(newPetData.genderInput),
				"gender"
			);
			newPetData.breedInput = helpers.checkString(
				xss(newPetData.breedInput),
				"breed"
			);
			newPetData.descriptionInput = helpers.checkString(
				xss(newPetData.descriptionInput),
				"description"
			);
			newPetData.typeInput = helpers.checkString(
				xss(newPetData.typeInput),
				"typeOfAnimal"
			);
			newPetData.zipInput = helpers.checkZip(xss(newPetData.zipInput));
			newPetData.adoptionStatusInput = helpers.checkAdoptedStatus(
				xss(newPetData.adoptionStatusInput)
			);
			newPetData.picture = helpers.checkPicture(req.file)

		} catch (error) {
			console.log(error);
			//return res.status(400).json({ error: error });
			return res.status(500).render("pets/update-pet", { error: error, user: req.session.user });
		}
		try {
			const updatedPet = await petData.updatePet(req.params.petId, newPetData);
			return res.redirect("/pets/" + req.params.petId);
		} catch (error) {
			console.log(error);
			res.status(500).render("pets/update-pet", { error: error, user: req.session.user });
		}
	});

// route to delete
router.route("/delete/:petId").get(async (req, res) => {

	try {
		req.params.petId = helpers.checkId(xss(req.params.petId), "Id URL Param");
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: error.message });
	}
	//
	//try to delete Event
	try {
		let remPet = await petData.removePet(req.params.petId, req.session.user);
		let delFav = await userData.removeFavoritePet(req.params.petId, req.session.user);
		req.session.user.favoritePets = delFav.updatedInfo.favoritePets; return res.redirect("/pets");
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
			req.params.petId = helpers.checkId(xss(req.params.petId), "pet ID");
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message });
		}
		//validate comment
		try {
			req.body.comment_input = helpers.checkString(xss(req.body.comment_input), "Comment");
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message });
		}
		// create comment
		try {
			const pet = await petData.createComment(xss(req.params.petId), xss(req.session.user.id), xss(req.body.comment_input));
		} catch (error) {
			console.log(error);
			res.status(404).json({ error: error });
		}
		//reload page to show new comment
		try {
			const pet = await petData.getPetById(xss(req.params.petId));
			res.render("pets/pet", { pet, user: req.session.user });
		} catch (error) {
			console.log(error);
			res.status(404).json({ error: error });
		}
	});
export default router;