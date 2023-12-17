// Set error if signin form input is invalid
function setSigninInputError(element, errorMessage) {
    const srvError = document.getElementById("srvError");
    const parentElement = element.parentElement;
    const error = parentElement.querySelector("p");

    error.innerText = errorMessage;
    error.className = "error signin-error";
    parentElement.classList.add("invalid");

    if (srvError) {
        srvError.style.display = "none";
    }
}

// Set error if signup form input is invalid
function setSignupFormError(element, errorMessage) {
    const srvError = document.getElementById("srvError");
    const parentElement = element.parentElement;
    const error = parentElement.querySelector("p");

    error.innerText = errorMessage;
    error.className = "error signup-error";
    parentElement.classList.add("invalid");
    parentElement.children[1].focus();

    if (srvError) {
        srvError.style.display = "none";
    }
}

// Set error if new pet form input is invalid
function setPetFormError(element, errorMessage) {
    const srvError = document.getElementById("srvError");
    const parentElement = element.parentElement;
    const error = parentElement.querySelector("p");

    error.innerText = errorMessage;
    error.className = "error pet-form-error";
    parentElement.classList.add("invalid");
    parentElement.children[1].focus();

    if (srvError) {
        srvError.style.display = "none";
    }
}

// Remove error if input is valid
function setInputSuccess(element, className) {
    const parentElement = element.parentElement;
    const error = parentElement.querySelector("p");

    error.classList.remove("error");
    error.classList.remove(className);
    error.innerText = "";
    parentElement.classList.remove("invalid");
}

// Validate name
function validateName(name) {
    let isNameValid = true;

    if (name.length === 0 || name.match(/\d+/) || name.length < 2 || name.length > 25) {
        isNameValid = false;
    }

    return isNameValid;
}

// Validate email address
function validateEmailAddress(emailAddress) {
    let isEmailAddressValid = true;

    const emailReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/g;

    if (emailAddress.length === 0 || !emailReg.test(emailAddress)) {
        isEmailAddressValid = false;
    }

    return isEmailAddressValid;
}

// Validate password
function validatePassword(password) {
    let isPasswordValid = true;
    const passwordReg = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()\-_=+{}[\]:;"'<>,.?/|\\]).{8,}$/;

    if (password.length === 0 || /\s/.test(password) || !passwordReg.test(password)) {
        isPasswordValid = false;
    }

    return isPasswordValid;
}

// Match passwords
function matchPassword(password, confirmPassword) {
    let isPasswordMatch = true;

    if (password !== confirmPassword) {
        isPasswordMatch = false;
    }

    return isPasswordMatch;
}

// Validate gender
function validateGender(gender) {
    let isGenderValid = true;

    if (gender !== "female" && gender !== "male") {
        isGenderValid = false;
    }

    return isGenderValid;
}

// Validate type of animal
function validatePetType(typeOfAnimal) {
    let isTypeValid = true;

    let type = ["dog", "cat", "bird", "rabbit", "fish", "reptile"];

    if (!type.includes(typeOfAnimal)) {
        isTypeValid = false;
    }

    return isTypeValid;
}

// Validate adoption status
function validateAdoptionStatus(status) {
    let isAdoptionStatusValid = true;

    if (status !== "true" && status !== "false") {
        isAdoptionStatusValid = false;
    }

    return isAdoptionStatusValid;
}

// Validate age
function validateAge(age) {
    let isAgeValid = true;
    age = Number(age);

    if (!age || age < 0 || !Number.isInteger(age)) {
        isAgeValid = false;
    }

    return isAgeValid;
}

// Validate zip code
function validateZipCode(zipCode) {
    let isZipCodeValid = true;

    const zipCodeReg = /^\d{5}$/;

    if (zipCode.length === 0 || !zipCodeReg.test(zipCode)) {
        isZipCodeValid = false;
    }

    return isZipCodeValid;
}

// Validate description
function validateDescription(description) {
    let isDescriptionValid = true;

    if (description.length === 0 || description.length < 5 || !isNaN(description)) {
        isDescriptionValid = false;
    }

    return isDescriptionValid;
}


// Get the signup form element
const signupForm = document.forms["signupForm"];

if (signupForm) {
    const signupFirstName = signupForm.elements["firstNameInput"];
    const signupLastName = signupForm.elements["lastNameInput"];
    const signupEmailAddress = signupForm.elements["emailAddressInput"];
    const signupPassword = signupForm.elements["passwordInput"];
    const signupConfirmPassword = signupForm.elements["confirmPasswordInput"];

    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();

        validateSignupForm();
    });

    // Validate signup form inputs
    function validateSignupForm() {
        const firstName = signupFirstName.value.trim();
        const lastName = signupLastName.value.trim();
        const emailAddress = signupEmailAddress.value.trim().toLowerCase();
        const password = signupPassword.value.trim();
        const confirmPassword = signupConfirmPassword.value.trim();

        const isFirstNameValid = validateName(firstName);
        const isLastNameValid = validateName(lastName);
        const isEmailValid = validateEmailAddress(emailAddress);
        const isPasswordValid = validatePassword(password);
        const isConfirmPasswordValid = validatePassword(confirmPassword);
        const isPasswordMatch = matchPassword(password, confirmPassword);

        if (isConfirmPasswordValid) {
            setInputSuccess(signupConfirmPassword, "signup-error");
        } else {
            // setSignupFormError(signupConfirmPassword, "Please provide a valid password.");
            setSignupFormError(signupConfirmPassword, 
                "Password Requirements:\n" + 
                "MUST contain at least 8 characters\n" + 
                "MUST contain at least one uppercase letter\n" + 
                "MUST contain at least one lowercase  letter\n" + 
                "MUST contain at least one number\n" + 
                "MUST contain at least one special character");
        }

        if (isPasswordValid) {
            setInputSuccess(signupPassword, "signup-error");
        } else {
            setSignupFormError(signupPassword, 
                "Password Requirements:\n" + 
                "MUST contain at least 8 characters\n" + 
                "MUST contain at least one uppercase letter\n" + 
                "MUST contain at least one lowercase  letter\n" + 
                "MUST contain at least one number\n" + 
                "MUST contain at least one special character");
        }

        if (isPasswordValid && isConfirmPasswordValid) {
            if (isPasswordMatch) {
                setInputSuccess(signupConfirmPassword, "signup-error");
            } else {
                setSignupFormError(signupConfirmPassword, "Please make sure your passwords match.");
            }
        }

        if (isEmailValid) {
            setInputSuccess(signupEmailAddress, "signup-error");
        } else {
            setSignupFormError(signupEmailAddress, "Please provide a valid email.");
        }

        if (isLastNameValid) {
            setInputSuccess(signupLastName, "signup-error");
        } else {
            setSignupFormError(signupLastName, "Please provide a valid last name.");
        }

        if (isFirstNameValid) {
            setInputSuccess(signupFirstName, "signup-error");
        } else {
            setSignupFormError(signupFirstName, "Please provide a valid first name.");
        }

        if (isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid &&
            isConfirmPasswordValid && isPasswordMatch) {
            signupForm.submit();
        }
    }
}

// Get the signin form element
const signinForm = document.forms["signinForm"];

if (signinForm) {
    const signinEmailAddress = signinForm.elements["emailAddressInput"];
    const signinPassword = signinForm.elements["passwordInput"];

    signinForm.addEventListener("submit", (event) => {
        event.preventDefault();

        validateSigninForm();
    });

    // Validate signin form inputs
    function validateSigninForm() {
        const emailAddress = signinEmailAddress.value.trim().toLowerCase();
        const password = signinPassword.value.trim();

        const isEmailValid = validateEmailAddress(emailAddress);
        const isPasswordValid = validatePassword(password);

        if (isEmailValid && isPasswordValid) {
            setInputSuccess(signinPassword, "signin-error");
            signinForm.submit();
        } else {
            setSigninInputError(signinPassword, "Please provide valid email and password.");
        }
    }
}

// Validate the new pet and update pet form
function validatePetForm(petForm) {
    if (petForm) {
        const formPetName = petForm.elements["nameInput"];
        const formPetAge = petForm.elements["ageInput"];
        const formPetGender = petForm.elements["genderInput"];
        const formPetType = petForm.elements["typeInput"];
        const formPetBreed = petForm.elements["breedInput"];
        const formPetZipCode = petForm.elements["zipInput"];
        const formPetAdoptionStatus = petForm.elements["adoptionStatusInput"];
        const formPetDescription = petForm.elements["descriptionInput"];

        petForm.addEventListener("submit", (event) => {
            event.preventDefault();

            validateNewPetForm();
        });

        // Validate new pet form inputs
        function validateNewPetForm() {
            const petName = formPetName.value.trim();
            const petAge = formPetAge.value.trim();
            const petGender = formPetGender.value.trim();
            const petBreed = formPetBreed.value.trim();
            const petType = formPetType.value.trim();
            const petZipCode = formPetZipCode.value.trim();
            const petAdoptionStatus = formPetAdoptionStatus.value.trim();
            const petDescription = formPetDescription.value.trim();

            const isPetNameValid = validateName(petName);
            const isPetAgeValid = validateAge(petAge);
            const isPetGenderValid = validateGender(petGender);
            const isPetBreedValid = validateName(petBreed);
            const isPetTypeValid = validatePetType(petType);
            const isPetZipCodeValid = validateZipCode(petZipCode);
            const isPetAdoptionStatusValid = validateAdoptionStatus(petAdoptionStatus);
            const isPetDescriptionValid = validateDescription(petDescription);

            if (isPetDescriptionValid) {
                setInputSuccess(formPetDescription, "pet-form-error");
            } else {
                setPetFormError(formPetDescription, "Please provide a valid description.");
            }

            if (isPetAdoptionStatusValid) {
                setInputSuccess(formPetAdoptionStatus, "pet-form-error");
            } else {
                setPetFormError(formPetAdoptionStatus, "Please provide a valid adoption status.");
            }

            if (isPetZipCodeValid) {
                setInputSuccess(formPetZipCode, "pet-form-error");
            } else {
                setPetFormError(formPetZipCode, "Please provide a valid zip code.");
            }

            if (isPetBreedValid) {
                setInputSuccess(formPetBreed, "pet-form-error");
            } else {
                setPetFormError(formPetBreed, "Please provide a valid breed.");
            }

            if (isPetTypeValid) {
                setInputSuccess(formPetType, "pet-form-error");
            } else {
                setPetFormError(formPetType, "Please provide a valid pet type.");
            }

            if (isPetGenderValid) {
                setInputSuccess(formPetGender, "pet-form-error");
            } else {
                setPetFormError(formPetGender, "Please provide a valid gender.");
            }

            if (isPetAgeValid) {
                setInputSuccess(formPetAge, "pet-form-error");
            } else {
                setPetFormError(formPetAge, "Please provide a valid age.");
            }

            if (isPetNameValid) {
                setInputSuccess(formPetName, "pet-form-error");
            } else {
                setPetFormError(formPetName, "Please provide a valid name.");
            }

            if (isPetNameValid && isPetAgeValid && isPetGenderValid && isPetTypeValid && isPetBreedValid &&
                isPetZipCodeValid && isPetAdoptionStatusValid && isPetDescriptionValid) {
                petForm.submit();
            }
        }
    }
}

// Get the new pet form element
const newPetForm = document.forms["newPetForm"];
validatePetForm(newPetForm)

// Get the update pet form element
const updatePetForm = document.forms["updatePetForm"];
validatePetForm(updatePetForm);