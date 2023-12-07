// Set error if signin input is invalid
function setSigninInputError(element, errorMessage) {
    const invalidSignin = document.getElementById("invalidSignin");
    const signinInput = document.getElementById("signinInput");
    const parentElement = element.parentElement;
    const error = parentElement.querySelector("p");

    error.innerText = errorMessage;
    error.className = "error signin-input";

    if (signinInput) {
        signinInput.classList.remove("error");
        signinInput.classList.remove("signin-input");
        signinInput.innerText = "";
    }

    if (invalidSignin) {
        invalidSignin.classList.remove("error");
        invalidSignin.classList.remove("signin-input");
        invalidSignin.innerText = "";
    }
}

// Set error if signup input is invalid
function setSignupFormError(element, errorMessage) {
    const errorSvr = document.getElementsByClassName("error-svr");
    const parentElement = element.parentElement;
    const error = parentElement.querySelector("p");

    error.innerText = errorMessage;
    error.className = "error signup-input";

    for (let element of errorSvr) {
        element.classList.remove("error");
        element.classList.remove("signup-input");
        element.innerText = "";
    }
}

// Remove error if input is valid
function setInputSuccess(element, className) {
    const parentElement = element.parentElement;
    const error = parentElement.querySelector("p");
    error.classList.remove("error");
    error.classList.remove(className);
    error.innerText = "";
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
            setInputSuccess(signupFirstName, "signup-input");
        } else {
            setSignupFormError(signupFirstName, "Please provide a valid first name.");
        }

        if (isLastNameValid) {
            setInputSuccess(signupLastName, "signup-input");
        } else {
            setSignupFormError(signupLastName, "Please provide a valid last name.");
        }

        if (isEmailValid) {
            setInputSuccess(signupEmailAddress, "signup-input");
        } else {
            setSignupFormError(signupEmailAddress, "Please provide a valid email.");
        }

        if (isPasswordValid) {
            setInputSuccess(signupPassword, "signup-input");
        } else {
            setSignupFormError(signupPassword, "Please provide a valid password.");
        }

        if (isConfirmPasswordValid) {
            setInputSuccess(signupConfirmPassword, "signup-input");
        } else {
            setSignupFormError(signupConfirmPassword, "Please provide a valid password.");
        }

        if (isPasswordValid && isConfirmPasswordValid) {
            if (isPasswordMatch) {
                setInputSuccess(signupConfirmPassword, "signup-input");
            } else {
                setSignupFormError(signupConfirmPassword, "Please make sure your passwords match.");
            }
        }

        if (isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid &&
            isConfirmPasswordValid && isPasswordMatch && isRoleValid) {
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
            setInputSuccess(signinPassword, "signin-input");
            signinForm.submit();
        } else {
            setSigninInputError(signinPassword, "Please provide valid email and password.");
        }
    }
}