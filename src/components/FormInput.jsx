import React from "react";

const FormInput = ({ inputType, field, errorFields, onHandleChange }) => {
  return (
    <label className="block mb-6">
      <span className="text-gray-700 uppercase">{field}</span>
      <input
        type={inputType}
        name={field}
        className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 border-gray-300 border py-2 px-3 text-base leading-6"
        onChange={onHandleChange}
        data-testid={field}
      />
      <div className="text-red-500 text-sm mt-1">{errorFields[field]}</div>
    </label>
  );
};

export default FormInput;
