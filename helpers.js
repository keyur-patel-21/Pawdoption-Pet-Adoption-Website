import { ObjectId } from 'mongodb';

let exportedMethods = {
	checkId(id, varName) {
		if (!id) throw `Error: You must provide a id for ${varName}`;
		if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
		return new ObjectId(id)
	},

	checkString(strVal, varName) {
		if (!strVal) throw `Error: You must supply a ${varName}!`;
		if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
		strVal = strVal.trim();
		if (strVal.length === 0)
			throw `Error: ${varName} cannot be an empty string or string with just spaces`;
		if (!isNaN(strVal))
			throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
		return strVal;
	},

	checkInput(input, varName) {
		if (!input) throw `Error: You must supply a ${varName}!`;
		input = input.trim();
	},

	checkZip(zip) {
		if (!zip) throw ("Zip code is required");
		if (zip.trim().length === 0) throw ("Zip code input can't be empty");
		let regex = /^(?:\d{5})?$/;
		if (!regex.test) {
			throw ("Invalid input for zip code");
		}
		return zip;
	},

	checkStringisNumber(string) {
		if (!string) throw ("Error: number is required");
		if (string.trim().length === 0) throw ("Error: input can't be empty");
		let regex = /^[0-9]*$/;
		if (!regex.test(string)) {
			throw ("Invalid input for age");
		}
		return string;
	},

	checkEmail(email) {
		if (!email) throw ("Error: must provide an email");
		email = email.trim().toLowerCase();
		let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		if (regex.test(String(email).toLowerCase())) {
			return email;
		} else {
			throw ("Error: invalid email");
		}
	},

	checkAdoptedStatus(adoptionStatus) {
		if (!adoptionStatus) throw ("Error: must provide an adoption status");
		adoptionStatus = adoptionStatus.trim().toLowerCase();
		if ((adoptionStatus === "true") || (adoptionStatus === "false")) {
			return adoptionStatus;
		} else {
			throw ("Error: invalid adoption status");
		}
	},

	//  checkId(id, varName) {
	//   if (!id) throw `Error: You must provide a ${varName}`;
	//   if (typeof id !== 'string') throw `Error:${varName} must be a string`;
	//   id = id.trim();
	//   if (id.length === 0)
	//     throw `Error: ${varName} cannot be an empty string or just spaces`;
	//   if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
	//   return id;
	// },
};

export default exportedMethods;