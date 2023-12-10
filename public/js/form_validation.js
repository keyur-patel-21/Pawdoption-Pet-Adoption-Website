// Set error if signin form input is invalid
function setSigninInputError(element, errorMessage) {
    const signupInput = element.parentElement;
    const error = signupInput.querySelector("p");

    error.innerText = errorMessage;
    error.className = "error signin-error";
    parentElement.classList.add("invalid");
}

// Set error if signup form input is invalid
function setSignupFormError(element, errorMessage) {
    const parentElement = element.parentElement;
    const error = parentElement.querySelector("p");

    error.innerText = errorMessage;
    error.className = "error signup-error";
    parentElement.classList.add("invalid");

}

// Set error if new pet form input is invalid
function setNewPetFormError(element, errorMessage) {
    const parentElement = element.parentElement;
    const error = parentElement.querySelector("p");

    error.innerText = errorMessage;
    error.className = "error new-pet-error";
    parentElement.classList.add("invalid");
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

    if (description.length === 0 || description.length < 5) {
        isDescriptionValid = false;
    }

    return isDescriptionValid;
}


// Get the signup form element
const signupForm = document.forms["signupForm"];

if (signupForm) {
    const signupFirstName = signupForm.elements["firstName"];
    const signupLastName = signupForm.elements["lastName"];
    const signupEmailAddress = signupForm.elements["userEmailAddress"];
    const signupPassword = signupForm.elements["userPassword"];
    const signupConfirmPassword = signupForm.elements["confirmUserPassword"];

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

        if (isFirstNameValid) {
            setInputSuccess(signupFirstName, "signup-error");
        } else {
            setSignupFormError(signupFirstName, "Please provide a valid first name.");
        }

        if (isLastNameValid) {
            setInputSuccess(signupLastName, "signup-error");
        } else {
            setSignupFormError(signupLastName, "Please provide a valid last name.");
        }

        if (isEmailValid) {
            setInputSuccess(signupEmailAddress, "signup-error");
        } else {
            setSignupFormError(signupEmailAddress, "Please provide a valid email.");
        }

        if (isPasswordValid) {
            setInputSuccess(signupPassword, "signup-error");
        } else {
            setSignupFormError(signupPassword, "Please provide a valid password.");
        }

        if (isConfirmPasswordValid) {
            setInputSuccess(signupConfirmPassword, "signup-error");
        } else {
            setSignupFormError(signupConfirmPassword, "Please provide a valid password.");
        }

        if (isPasswordValid && isConfirmPasswordValid) {
            if (isPasswordMatch) {
                setInputSuccess(signupConfirmPassword, "signup-error");
            } else {
                setSignupFormError(signupConfirmPassword, "Please make sure your passwords match.");
            }
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
    const signinEmailAddress = signinForm.elements["emailAddress"];
    const signinPassword = signinForm.elements["password"];

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

// Get the new pet form element
const newPetForm = document.forms["newPetForm"];

if (newPetForm) {
    const newPetName = newPetForm.elements["petName"];
    const newPetAge = newPetForm.elements["petAge"];
    const newPetGender = newPetForm.elements["petGender"];
    const newPetBreed = newPetForm.elements["petBreed"];
    const newPetType = newPetForm.elements["petType"];
    const newPetZipCode = newPetForm.elements["petZipCode"];
    const newPetAdoptionStatus = newPetForm.elements["petAdoptionStatus"];
    const newPetDescription = newPetForm.elements["petDescription"];

    newPetForm.addEventListener("submit", (event) => {
        event.preventDefault();

        validateNewPetForm();
    });

    // Validate new pet form inputs
    function validateNewPetForm() {
        const petName = newPetName.value.trim();
        const petAge = newPetAge.value.trim();
        const petGender = newPetGender.value.trim();
        const petBreed = newPetBreed.value.trim();
        const petType = newPetType.value.trim();
        const petZipCode = newPetZipCode.value.trim();
        const petAdoptionStatus = newPetAdoptionStatus.value.trim();
        const petDescription = newPetDescription.value.trim();

        const isPetNameValid = validateName(petName);
        const isPetAgeValid = validateAge(petAge);
        const isPetGenderValid = validateGender(petGender);
        const isPetBreedValid = validateName(petBreed);
        const isPetTypeValid = validateName(petType);
        const isPetZipCodeValid = validateZipCode(petZipCode);
        const isPetAdoptionStatusValid = validateAdoptionStatus(petAdoptionStatus);
        const isPetDescriptionValid = validateDescription(petDescription);

        if (isPetNameValid) {
            setInputSuccess(newPetName, "new-pet-error");
        } else {
            setNewPetFormError(newPetName, "Please provide a valid name.");
        }

        if (isPetAgeValid) {
            setInputSuccess(newPetAge, "new-pet-error");
        } else {
            setNewPetFormError(newPetAge, "Please provide a valid age.");
        }

        if (isPetGenderValid) {
            setInputSuccess(newPetGender, "new-pet-error");
        } else {
            setNewPetFormError(newPetGender, "Please provide a valid gender.");
        }

        if (isPetBreedValid) {
            setInputSuccess(newPetBreed, "new-pet-error");
        } else {
            setNewPetFormError(newPetBreed, "Please provide a valid breed.");
        }

        if (isPetTypeValid) {
            setInputSuccess(newPetType, "new-pet-error");
        } else {
            setNewPetFormError(newPetType, "Please provide a valid pet type.");
        }

        if (isPetZipCodeValid) {
            setInputSuccess(newPetZipCode, "new-pet-error");
        } else {
            setNewPetFormError(newPetZipCode, "Please provide a valid zip code.");
        }

        if (isPetAdoptionStatusValid) {
            setInputSuccess(newPetAdoptionStatus, "new-pet-error");
        } else {
            setNewPetFormError(newPetAdoptionStatus, "Please provide a valid adoption status.");
        }

        if (isPetDescriptionValid) {
            setInputSuccess(newPetDescription, "new-pet-error");
        } else {
            setNewPetFormError(newPetDescription, "Please provide a valid description.");
        }

        if (isPetNameValid && isPetAgeValid && isPetGenderValid && isPetBreedValid && isPetTypeValid &&
            isPetZipCodeValid && isPetAdoptionStatusValid && isPetDescriptionValid) {
            newPetForm.submit();
        }
    }
}