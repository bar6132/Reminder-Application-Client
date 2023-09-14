import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "./App";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./Schedule.css";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Form from "react-bootstrap/Form";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const [pageNumberInput, setPageNumberInput] = useState(currentPage);

  const handlePageNumberChange = (e) => {
    const newPageNumber = parseInt(e.target.value, 10);
    setPageNumberInput(newPageNumber);
  };

  const handlePageNumberSubmit = (e) => {
    e.preventDefault();
    if (pageNumberInput >= 1 && pageNumberInput <= totalPages) {
      onPageChange(pageNumberInput);
    }
  };

  return (
    <ul className="pagination">
      <li>
        <Button
          variant="link"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
      </li>
      <li>
        <Form onSubmit={handlePageNumberSubmit}>
          <Form.Control
            type="number"
            value={currentPage}
            onChange={handlePageNumberChange}
            min="1"
            max={totalPages}
          />
        </Form>
      </li>
      <li>
        <span>of {totalPages}</span>
      </li>
      <li>
        <Button
          variant="link"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </li>
    </ul>
  );
}

function Schedule() {
  const { noteData, url } = useContext(AppContext);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(noteData && noteData.data.length / itemsPerPage);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    renderNotes();
  }, [currentPage])


  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    status: "",
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  function truncateText(text, limit) {
    const words = text;
    if (words.length > limit) {
      return words.slice(0, limit) + "...";
    }
    return text;
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
  
  
  const renderNotes = () => {
    if (!noteData || !noteData.data) {
      console.log("Note data is missing or empty.");
      return null;
    }
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    if (startIndex < 0 || startIndex >= noteData.data.length) {
      console.log("Invalid startIndex:", startIndex);
      return null;
    }
  
    const notesToDisplay = noteData.data.slice(startIndex, endIndex);
  
    return notesToDisplay.map((item) => (
      <div className="Card" key={item.id}>
        <Card style={{ width: "18rem" }}>
          <Card.Body className="noteCard">
            <Card.Title className="noteTitle">{item.title}</Card.Title>
            <Card.Text className="notedescription">
              Description: {truncateText(item.description, 10)}
            </Card.Text>
            <Card.Text className="notestatus">Status: {item.status}</Card.Text>
            <Card.Text className="notecreated_at">
              Created At: {formatDate(item.created_at)}
            </Card.Text>
            <Card.Text className="noteupdated_at">
              Updated At: {formatDate(item.updated_at)}
            </Card.Text>
  
            <Button variant="primary" onClick={() => handleNoteClick(item.id)}>
              View Note
            </Button>
          </Card.Body>
        </Card>
      </div>
    ));
  };

    return (
      <div className="Card">
      {renderNotes()}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
/>

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
              <Button variant="warning">Note is Completed</Button>
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
    );
  }
export default Schedule;
