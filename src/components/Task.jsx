import React, { useState, useCallback } from 'react';
import { Card, Button } from "react-bootstrap";
import MyModal from './MyModal';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import "./styles/Task.css";

const Task = ({ id, name, deleteTask }) => {
    const [modalShow, setModalShow] = useState(false);

    const handleDeleteTask = useCallback(async () => {
        try {
            await deleteDoc(doc(db, "Tasks", id));
            deleteTask(id);
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    }, [id, deleteTask]);

    const editTask = useCallback(async (newName) => {
        try {
            await updateDoc(doc(db, "Tasks", id), { name: newName });
        } catch (error) {
            console.error("Error updating task: ", error);
        }
    }, [id]);

    const handleDragStart = useCallback((e) => {
        e.dataTransfer.setData("text/plain", id);
        e.currentTarget.classList.add("dragging");
    }, [id]);

    const handleDragEnd = useCallback((e) => {
        e.currentTarget.classList.remove("dragging");
    }, []);

    return (
        <Card
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="task-card"
        >
            <Card.Body>
                <h2 className='d-flex justify-content-center align-items-center'>{name}</h2>
            </Card.Body>
            <Button onClick={handleDeleteTask}>Delete Task</Button>
            <Button variant="primary" onClick={() => setModalShow(true)}>Edit Task</Button>
            <MyModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                editTask={editTask}
                id={id}
            />
        </Card>
    );
};

export default Task;