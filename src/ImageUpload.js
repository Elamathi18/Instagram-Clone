import React, {useState}from 'react';
import firebase from "firebase";
import {Button} from '@material-ui/core';
import {storage,db} from './firebase';
import './ImageUpload.css';

function ImageUpload (username) { 
    const [image,setImage]=useState(null);
    const [progress,setProgress]=useState(0);
    const [caption,setCaption]=useState('');

    const handleChange = (e) => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    };

    const handleUpload =() =>{
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // Error function ...
          console.log(error);
        },
        () => {
          // complete function ...
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              //setUrl(url);
  
              // post image inside db
              db.collection("posts").add({
                imageUrl: url,
                caption: caption,
                username: username,
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
              });
  
              setProgress(0);
              setCaption("");
              setImage(null);
            });
        }
      );
    };

    return (
      <div className="imageupload">
      {/*i want to have the following*/}
      {/*Caption input*/}
      {/*File picker*/}
      {/*Post button*/}
     
      <progress className="imageupload_progress" value={progress} max="100" />
      <input type="text"
      placeholder="Enter the caption..." 
      value={caption}
      onChange={event=>setCaption(event.target.value)}/>
      
      <input type="file" 
      onChange={handleChange}/>
      <Button onClick={handleUpload}>UPLOAD</Button>
      </div>
    )
}

export default ImageUpload
