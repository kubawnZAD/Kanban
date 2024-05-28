import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db, serverTimestamp } from '../firebase';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import Task from './Task';

export const Dashboard = () => {
    const [error, setError] = useState("");
    const [tasks, setTasks] = useState([]);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const inputRef = useRef();

    const taskRef = db.collection("Tasks");

    const getTasks = useCallback(() => {
        if (!currentUser) return () => {};
        const unsubscribe = taskRef.where('uid', '==', currentUser.uid).onSnapshot(querySnapshot => {
            setTasks(querySnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                container: doc.data().container || '1'
            })));
        });
        return unsubscribe;
    }, [currentUser]);

    useEffect(() => {
        const unsubscribe = getTasks();
        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [getTasks]);

    const createTask = async () => {
        if (inputRef.current.value !== "") {
            try {
                await taskRef.add({
                    uid: currentUser.uid,
                    name: inputRef.current.value,
                    container: '1', // Default container
                    createdAt: serverTimestamp()
                });
                inputRef.current.value = "";
            } catch (error) {
                setError("Nie udało się stworzyć zadania");
                console.error(error);
            }
        }
    };

    const deleteTask = useCallback(async (id) => {
        try {
            await deleteDoc(doc(db, "Tasks", id));
            setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, containerId) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("text/plain");
        const task = tasks.find(task => task.id === taskId);
        if (task && task.container !== containerId) {
            try {
                await updateDoc(doc(db, "Tasks", taskId), { container: containerId });
                setTasks(prevTasks =>
                    prevTasks.map(t =>
                        t.id === taskId ? { ...t, container: containerId } : t
                    )
                );
            } catch (error) {
                console.error("Error moving task: ", error);
            }
        }
    };

    const handleLogout = async () => {
        setError("");
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            setError("Nie udało się wylogować");
            console.error(error);
        }
    };

    return (
        <div className='App'>
            <div style={{ display: "flex", position: "relative", width: "100%" }}>
                {['1', '2', '3'].map(containerId => (
                    <div
                        key={containerId}
                        style={{ backgroundColor: "red", width: "200px", height: "200px", margin: "10px" }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, containerId)}
                    >
                        {tasks.filter(task => task.container === containerId).map(task => (
                            <Task key={task.id} id={task.id} name={task.name} deleteTask={deleteTask} />
                        ))}
                    </div>
                ))}
            </div>
            {error && <div>{error}</div>}
            <input type="text" ref={inputRef} />
            <Button onClick={createTask}>Stwórz zadanie</Button>
            <div className='w-100 text-center mt-2'>
                <Button variant="link" onClick={handleLogout}>Wyloguj się</Button>
            </div>
        </div>
    );
};

export default Dashboard;