import React from "react";

const ErrorValidate = ({ error }) => {
  return (
    <ul>
      {error.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
};

export default ErrorValidate;
