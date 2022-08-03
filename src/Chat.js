import React, { useState, useEffect } from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";

import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";

const Chat = () => {
  // Initialise empty messages array in state to keep local state in sync with Firebase
  // When Firebase changes, update local state, which will update local UI
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    console.log(event.target.value);
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const messagesRef = ref(database, MESSAGE_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      setMessages(
        (
          state // Store message key so we can use it as a key in our list items when rendering messages
        ) => [...state, { key: data.key, val: data.val().inputValue }]
      );
    });
  }, []);

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  const handleSubmit = (event) => {
    event.preventDefault();
    const messageListRef = ref(database, MESSAGE_FOLDER_NAME);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, { inputValue });
    setInputValue("");
  };

  // Convert messages in state to message JSX elements to render
  let messageListItems = messages.map((message) => (
    <li key={message.key}>{message.val}</li>
  ));

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <input type="text" value={inputValue} onChange={handleChange} />
          <input type="submit" value="send" />
        </form>
        <ol>{messageListItems}</ol>
      </header>
    </div>
  );
};

export default Chat;
