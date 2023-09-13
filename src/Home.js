import { NavLink } from "react-router-dom";
import React, { useState, useContext } from "react";
import { AppContext } from "./App";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Form from "react-bootstrap/Form";

function Home() {
  const { noteData, url } = useContext(AppContext);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    status: "",
  });
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  function truncateText(text, limit) {
    const words = text
    if (words.length > limit) {
      return words.slice(0, limit) + '...'; 
    }
    return text;
  }



  const handleNoteClick = (id) => {
    setSelectedNoteId(id);
    const selectedNote = noteData.data.find((note) => note.id === id);
    if (selectedNote) {
      setEditFormData({
        title: selectedNote.title,
        description: selectedNote.description,
      });
    }
  };

  const selectedNote =
    noteData && noteData.data.find((note) => note.id === selectedNoteId);

  if (selectedNote) {
    console.log(selectedNote.id);
  }


  const handleDelete = (id) => {
    axios({
      method: "delete",
      url: `${url}note/${id}/`,
      headers: {
        "content-type": "form-data",
      },
    })
      .then((response) => {
        console.log("Note deleted successfully:", response.data);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error deleting Note:", error);
      });
  };

  const handleComplete = async (id) => {
    console.log("completing");
    try {
      const response = await axios.patch(`${url}note/${id}/`, {
        status: "completed",
      });

      if (response.status === 200) {
        console.log("Note completed successfully:", response.data);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error("Error completing Note:", response.statusText);
      }
    } catch (error) {
      console.error("Error completing Note:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(`${url}note/${selectedNoteId}/`, {
        title: editFormData.title,
        description: editFormData.description,
      });

      if (response.status === 200) {
        console.log("Note edited successfully:", response.data);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error("Error editing Note:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing Note:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };


  

  return (
    <div className="App">

      <h1>Welcome to the Remaider</h1>
      <p className="intro">Here you will see the last 5 Notes that you wrote <br/>
        if you wish to see more click on the Schedule on top <br/>
        or <NavLink to="/Schedule">Here</NavLink>
      </p>


      <div className="Card">
      {noteData &&
        noteData.data.map((item) => (
          <Card key={item.id} style={{ width: "18rem" }}>
            <Card.Body className="noteCard">
              <Card.Title className="noteTitle">{item.title}</Card.Title>
              <Card.Text className="notedescription">
                Description: {truncateText(item.description, 10)}
              </Card.Text>
              <Card.Text className="notestatus">
                Status: {item.status}
              </Card.Text>
              <Card.Text className="notecreated_at">
                Created At: {formatDate(item.created_at)}
              </Card.Text>
              <Card.Text className="noteupdated_at">
                Updated At: {formatDate(item.updated_at)}
              </Card.Text>

              <Button
                variant="primary"
                onClick={() => handleNoteClick(item.id)}
              >
                View Note
              </Button>
            </Card.Body>
          </Card>
        ))}

      <Modal
        show={selectedNoteId !== null}
        onHide={() => setSelectedNoteId(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNoteId !== null && (
            <Form>
              <Form.Group controlId="editTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="editDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={editFormData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="DetailButtons">
          <Button variant="danger" onClick={() => handleDelete(selectedNoteId)}>
            Delete
          </Button>

          {selectedNote && selectedNote.status === "completed" ? (
            <Button variant="info">Note is Completed</Button>
          ) : (
            <Button
              variant="info"
              onClick={() => handleComplete(selectedNoteId)}
            >
              Mark As Complete
            </Button>
          )}
          <Button variant="success" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

    </div>
  )
}

export default Home