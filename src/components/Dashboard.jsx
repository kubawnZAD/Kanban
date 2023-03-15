import React, {useState, useRef, useEffect} from 'react'
import {Card,Button, Alert} from "react-bootstrap"
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext'
import { db } from '../firebase';
import { serverTimestamp } from '../firebase';
import Navbar from './Navbar';

export const Dashboard = () => {
    const [error,setError] = useState("");
    const [Tasks, setTasks] = useState([]);
    const {currentUser, logout} = useAuth();
    let unsubscribe
    let items
    const navigate = useNavigate()
    const inputRef = useRef()
    useEffect(()=>getTasks,[])
    const taskRef = db.collection("Tasks")
    async function createTask(){
        
        await taskRef.add({
            uid:currentUser.uid,
            name:inputRef.current.value,
            createdAt: serverTimestamp()
        })

    }
    async function getTasks(){
        unsubscribe = await taskRef.where('uid','==',currentUser.uid).onSnapshot(querySnapshot=>{
            setTasks(querySnapshot.docs.map(doc=>({id:doc.id,name:doc.data().name})))
        })
        
    }
    async function handleLogout(){
        setError("")
        try{
        await logout()
        navigate('/login')
        }
        catch(error){
            setError("Nie udało się wylogować")
            console.log(error)
        }
    }

  return (
    <>
    <Navbar></Navbar>
    <input type="text" ref={inputRef}/>
        <Button onClick={createTask}>Stwórz zadanie</Button>
    {Tasks.map(task=>(
        <Card>
            <Card.Body>
            <h2 className='d-flex justify-content-center align-items-center'>{task.name}</h2>
            </Card.Body>
            </Card>
    ))}
    
    <div className='w-100 text-center mt-2'>
        <Button variant="link" onClick={handleLogout}>Wyloguj się</Button>
    </div>
    </>
  )
}
