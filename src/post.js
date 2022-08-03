import React, { useState, useEffect } from "react";
import { database, storage } from "./firebase";

import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import Card from "react-bootstrap/Card";

const IMAGE_FOLDER = "image"; //setting own folder name for firebase
const POST_FOLDER = "post";

const Posting = ({ loggedInUser }) => {
  /*  const [inputData, setInputData] = useState({
    imageFile: null,
    fileValue: "",
    caption: "",
  });  */ //for user input
  const [imageFile, setImageFile] = useState("");
  const [fileValue, setFileValue] = useState("");
  const [caption, setCaption] = useState("");
  const [postData, setPostData] = useState([]); //render

  const handleTextChange = (event) => {
    setCaption(event.target.value);
    //setInputData({ caption: event.target.value });
    console.log(event.target.value);
  };

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
    setFileValue(event.target.value);
    /* setInputData({
      imageFile: event.target.files[0],
      fileValue: event.target.value,
    }); */
    console.log(event.target.value);
  };

  useEffect(() => {
    const postRef = databaseRef(database, POST_FOLDER);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postRef, (data) => {
      // Store post key so we can use it as a key in our list items when rendering messages
      setPostData((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, []); //[] dependancy value

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fileRef = storageRef(storage, `${IMAGE_FOLDER} / ${imageFile.name}`);
    /*     uploadBytes(fileRef, inputData.imageFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const postListRef = databaseRef(database, POST_FOLDER);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadUrl,
          text: inputData.caption,
        }); */

    await uploadBytes(fileRef, imageFile); //uploading the file to Firebase Storage
    const downloadURL = await getDownloadURL(fileRef); //retrieving the fileURL link from Firebase storage
    const postListRef = databaseRef(database, POST_FOLDER); //saving data(text) to Firebase realtime database
    const newPostRef = push(postListRef); //generating the key from staying in Firebase realtime database
    await set(newPostRef, { imageLink: downloadURL, text: caption });
    setImageFile("");
    setFileValue("");
    setCaption("");
    /*  setInputData({
      imageFile: null,
      fileValue: "",
      caption: "",
    }); */
  };

  let postCards = postData.map((post) => (
    <Card bg="dark" key={post.key}>
      <Card.Img src={post.val.imageLink} className="Card-Img" />
      <Card.Text>{post.val.text}</Card.Text>
    </Card>
  ));
  postCards.reverse();

  return (
    <div>
      {/*loggedInUser is an object because of 'user' so the key needs to be indicated for presentation*/}
      <p>{loggedInUser ? loggedInUser.email : null}</p>
      <form onSubmit={handleSubmit}>
        <input type="file" value={fileValue} onChange={handleFileChange} />
        <br />
        <input type="text" value={caption} onChange={handleTextChange} />
        <input type="submit" value="send" />
      </form>
      <br />
      {postCards}
    </div>
  );
};

export default Posting;
