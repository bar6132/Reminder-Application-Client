import './AddNote.css'
import React, { useState, useContext } from "react";
import { AppContext } from "./App";
import axios from "axios";



function AddNote() {
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');
  const { url } = useContext(AppContext);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', 'New');
    formData.append('description', description);
    console.log('Note:', note);
    console.log('Description:', description);

    axios({
        method: "post",
        url: `${url}note/`,
        data: formData,
        headers: {
          "content-type": "form-data",
        },
      })
        .then((response) => {
          console.log("Note Added successfully:", response.data);
          setTimeout(() => {
            window.location.href = '/Schedule';
                  }, 1000);
        })
        .catch((error) => {
          console.error("Error Adding Note:", error);
        });
    };



  return (
    <div className="add-note-container">
      <h2>Add Note</h2>
      <form className="add-note-form" onSubmit={handleSubmit}>
        <div>
          <label className="add-note-label" htmlFor="note">Note Title:</label>
          <input
            type="text"
            id="note"
            value={note}
            onChange={handleNoteChange}
            className="add-note-input"
            required
          />
        </div>
        <div>
          <label className="add-note-label" htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="add-note-textarea"
            required
          ></textarea>
        </div>
        <button type="submit" className="add-note-button">Submit</button>
      </form>
    </div>
  );
}

export default AddNote;
