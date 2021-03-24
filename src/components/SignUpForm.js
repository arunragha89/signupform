import React, { useState } from "react";

import apiHelper from "../utils/apiHelper";
import FormInput from "./FormInput";

import { initialValue, SIGN_UP_ENDPOINT } from "../constants";
import useValidate from "../hooks/useValidate";

const SignUpForm = () => {
  const [fields, setFields] = useState({ ...initialValue });
  const [errorFields, setErrorFields] = useState({ ...initialValue });
  const [status, setStatus] = useState({ success: false, message: "" });
  const [validationResult, errorsPresent] = useValidate(fields);

  const onSignUp = async (event) => {
    event.preventDefault();
    setErrorFields({ ...errorFields, ...validationResult });

    if (!errorsPresent) {
      const { firstname, lastname, email, password } = fields;
      try {
        await apiHelper(SIGN_UP_ENDPOINT, {
          body: {
            firstname,
            lastname,
            email,
            password,
          },
        });
      } catch (error) {
        setStatus({ ...status, success: false, message: "Sign Up failed" });
        return;
      }
      setStatus({ ...status, success: true, message: "Sign Up Successful" });

      setTimeout(async () => {
        try {
          await apiHelper(SIGN_UP_ENDPOINT);
          setStatus({
            ...status,
            success: true,
            message: "Retrieve user details successful",
          });
        } catch (error) {
          setStatus({
            ...status,
            success: false,
            message: "Retrieve user details Failed",
          });
        }
      }, 4000);
    }
  };

  const onHandleChange = (event) => {
    const { name, type, checked, value } = event.target;
    const fieldvalue = type === "checkbox" ? checked : value;

    setFields({ ...fields, [name]: fieldvalue });
  };

  const renderStatus = () => {
    return (
      status.message && (
        <div
          className={`text-xl bg-gray-200 text-center p-2 m-2 ${
            status.success ? "text-green-800" : "text-red-800"
          }`}
        >
          {status.message}
        </div>
      )
    );
  };

  return (
    <div className="mt-8 max-w-md mx-auto">
      {renderStatus()}
      <form noValidate onSubmit={onSignUp}>
        <FormInput
          inputType="text"
          field="firstname"
          errorFields={errorFields}
          onHandleChange={onHandleChange}
        />

        <FormInput
          inputType="text"
          field="lastname"
          errorFields={errorFields}
          onHandleChange={onHandleChange}
        />

        <FormInput
          inputType="email"
          field="email"
          errorFields={errorFields}
          onHandleChange={onHandleChange}
        />

        <FormInput
          inputType={fields.showpassword ? "text" : "password"}
          field="password"
          errorFields={errorFields}
          onHandleChange={onHandleChange}
        />
        <FormInput
          inputType={fields.showpassword ? "text" : "password"}
          field="confirmpassword"
          errorFields={errorFields}
          onHandleChange={onHandleChange}
        />

        <label className="inline-flex items-center mb-6">
          <input
            type="checkbox"
            name="showpassword"
            className="rounded bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-gray-700 focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"
            onChange={onHandleChange}
          />
          <span className="ml-2">Show Password</span>
        </label>

        <button
          data-testid="signupbutton"
          className="w-full bg-blue-300 h-12 rounded-md"
        >
          Sign Up{" "}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
