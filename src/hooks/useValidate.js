import { initialValue } from "../constants";

const useValidate = (fields) => {
  let errors = { ...initialValue };

  if (fields.firstname) {
    if (!/^[a-zA-Z0-9]+$/.test(fields.firstname)) {
      errors.firstname = "Should contain only characters or numbers";
    }
  } else {
    errors.firstname = "Please enter your firstname";
  }

  if (fields.lastname) {
    if (!/^[a-zA-Z0-9]+$/.test(fields.lastname)) {
      errors.lastname = "Should contain only characters or numbers";
    }
  } else {
    errors.lastname = "Please enter your lastname";
  }

  if (fields.email) {
    if (!/^\S+@\S+$/.test(fields.email)) {
      errors.email = "Please enter a valid email";
    }
  } else {
    errors.email = "Please enter your email";
  }

  if (fields.password) {
    const value = fields.password;
    if (value.length < 8) {
      errors.password = "Please enter password with minimum of 8 characters";
    } else if (!/(.*[a-z].*)/.test(value) || !/(.*[A-Z].*)/.test(value)) {
      errors.password =
        "Please enter password containing atlease one lowercase and uppercase characters";
    } else if (
      value.indexOf(fields.firstname) > -1 ||
      value.indexOf(fields.lastname) > -1
    ) {
      errors.password =
        "Please enter password that does not contain user's first or last name";
    }
  } else {
    errors.password = "Please enter your password";
  }

  if (fields.confirmpassword) {
    if (fields.confirmpassword !== fields.password) {
      errors.confirmpassword = "Passwords does not match";
    }
  } else {
    errors.confirmpassword = "Please enter your confirm password";
  }

  const errorsPresent = Object.values(errors).find((error) => error !== "");

  return [errors, errorsPresent];
};

export default useValidate;
