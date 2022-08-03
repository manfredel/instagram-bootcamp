import React, { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Button from "react-bootstrap/Button";

const AuthForm = ({ toggleAuthForm }) => {
  const [logInData, setLogInData] = useState({
    email: "",
    password: "",
  });
  const [newUser, setNewUser] = useState(true);
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    setLogInData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    console.log(logInData);
    event.preventDefault();

    const resetForm = () => {
      setLogInData({
        email: "",
        password: "",
      });
      setErrorCode("");
      setErrorMessage("");
      setNewUser(true);
      toggleAuthForm();
    };

    const setErrorResponse = (error) => {
      console.log(error);
      setErrorCode(error.code);
      setErrorMessage(error.message);
    };

    if (newUser) {
      createUserWithEmailAndPassword(auth, logInData.email, logInData.password)
        .then(resetForm)
        .catch(setErrorResponse);
    } else {
      signInWithEmailAndPassword(auth, logInData.email, logInData.password)
        .then(resetForm)
        .catch(setErrorResponse);
    }
  };
  const toggleSignUpOrLogIn = () => {
    setNewUser((state) => !newUser);
  };

  return (
    <div>
      <div>
        <p>{errorCode ? `Error code: ${errorCode}` : null}</p>
        <p>{errorMessage ? `Error message: ${errorMessage}` : null}</p>
        <p>{newUser ? "Sign in to post" : "Log in to post"}</p>
        <form onSubmit={handleSubmit}>
          <span>Email:</span>
          <input
            type="text"
            value={logInData.email}
            name="email"
            onChange={handleChange}
          />
          <span>Password:</span>
          <input
            type="password"
            value={logInData.password}
            name="password"
            onChange={handleChange}
          />
          <br />
          <input type="submit" value={newUser ? "Sign Up" : "Log in"} />
          {/*changing the button text base the user status*/}
          <br />
          <Button variant="link" onClick={toggleSignUpOrLogIn}>
            {newUser ? "Click here to login" : "Click here to sign up"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
