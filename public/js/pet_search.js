$(function () {
	let petSearch = $("#petSearchForm");
	let searchPetType = $("#searchPetType");
	let searchPetZip = $("#searchPetZip");
	let searchPetsList = $(".search-pets-list");

	// Get user zip code
	$(document).on("click", "#btnLocation", function () {

		const success = (position) => {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;

			const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

			fetch(geoApiUrl).then(res => res.json()).then(data => {
				searchPetZip.val(data.postcode);
			});
		}

		const error = () => {
			alert("Unable to get your location.");
		}

		navigator.geolocation.getCurrentPosition(success, error);
	});

	// Get pet details
	petSearch.on("submit", (function (event) {
		event.preventDefault();

		let petZip = searchPetZip.val().trim();
		let petType = searchPetType.val();
		let isSubmitValid = true;

		const zipCodeReg = /^\d{5}$/;

		// Validate zip code
		if (petZip.length === 0 || !zipCodeReg.test(petZip)) {
			searchPetZip.trigger("focus");
			searchPetZip.val("");
			searchPetZip.attr("placeholder", "ZIP Code");
			isSubmitValid = false;
		}

		if (petType) {
			petType = petType.trim();
			if (petZip.length !== 0 && (petType.length === 0 || petType.match(/\d+/))) {
				searchPetType.trigger("focus");
				searchPetType.val("");
				searchPetType.attr("placeholder", "Find a pet (e.g. Dog, Cat)");
				isSubmitValid = false;
			}
		}

		// Search the pets
		if (isSubmitValid) {
			$(".pet-not-found").hide();
			searchPetsList.empty();

			$.ajax({
				method: "GET",
				url: `http://localhost:3000/pets/api/?searchPetType=${petType}&searchPetZip=${petZip}`,
				success: function (pets) {
					if (pets.length > 0) {
						$.each(pets, function (i, pet) {
							searchPetsList.append(`<li class="search-pet" id="pet${i}">`);
							$(`#pet${i}`).append(`<a href="/pets/${pet._id}" id="petlink${i}"></a>`);
							$(`#petlink${i}`).append(`<div class="search-pet-details" id="pet-det${i}"></div>`);
							if (pet.picture) {
								$(`#pet-det${i}`).append(`<img src="${pet.picture}" alt="${pet.name}" style="width: 110px; height: 110px; border-radius: 5px;">`);
							} else {
								$(`#pet-det${i}`).append(`<img src="/public/img/user/no_image.png" alt="${pet.name}" style="width: 110px; height: 110px; border-radius: 5px;">`);
							}
							$(`#pet-det${i}`).append(`<p>Name: ${pet.name}</p>`);
							$(`#pet-det${i}`).append(`<p>Age: ${pet.age}</p>`);
							$(`#pet-det${i}`).append(`<p>Gender: ${pet.gender}</p>`);
							$(`#pet-det${i}`).append(`<p>Breed: ${pet.breed}</p>`);
						});
					} else {
						searchPetsList.hide();
						if ($(".pet-not-found").length === 0) {
							$(".pet-search-result").append(`<div class="pet-not-found"></div>`);
							$(".pet-not-found").append(`<p><span class="material-icons-outlined">sentiment_dissatisfied</span></p>`)
							$(".pet-not-found").append(`<p>No pets found</p>`);
						}

						$(".pet-not-found").show();
					}
				}
			});

			searchPetsList.show();
		}
	})
	);
});