import {ObjectId} from 'mongodb';

let exportedMethods = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
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

  checkZip(zip){
    if(!zip) throw ("Zip code is required");
    if (zip.trim().length === 0) throw ("Zip code input can't be empty");
    let regex = /^(?:\d{5})?$/;
    if(!regex.test){
        throw "Invalid input for zip code";
    }
    return zip;
  }
};

export default exportedMethods;