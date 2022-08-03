import React, { useState, useEffect } from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database, storage, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import logo from "./logo.png";
import "./App.css";
import Chat from "./Chat.js";
import Posting from "./post.js";
import AuthForm from "./AuthForm";

const App = () => {
  const [appState, setAppState] = useState({
    loggedInUser: null,
    shouldRenderAuthForm: false,
  });
  /*  const [loggedInUser, setLoggedInUser] = useState(null);
  const [shouldRenderAuthForm, setShouldRenderAuthForm] = useState(false); */

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAppState((prev) => ({ ...prev, loggedInUser: user }));
      } else {
        setAppState((prev) => ({ ...prev, loggedInUser: null }));
      }
    });
  }, []);

  const toggleAuthForm = () => {
    setAppState((prev) => ({
      ...prev,
      shouldRenderAuthForm: !prev.shouldRenderAuthForm,
    }));
  };

  const authForm = <AuthForm toggleAuthForm={toggleAuthForm} />;
  const posting = <Posting loggedInUser={appState.loggedInUser} />;
  const signUpOrLogInButton = (
    <div>
      <button onClick={toggleAuthForm}>Sign Up or Login</button>
    </div>
  );

  const postAndWrite = (
    <div>{appState.loggedInUser ? posting : signUpOrLogInButton}</div>
  );
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {/* <button type="submit" value={loggedInUser ? <Posting /> : authForm} /> */}
        {appState.shouldRenderAuthForm ? authForm : postAndWrite}
      </header>
    </div>
  );
};

export default App;
