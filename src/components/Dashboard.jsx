import React, {useState, useRef, useEffect} from 'react'
import {Button} from "react-bootstrap"
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext'
import { db } from '../firebase';
import { serverTimestamp } from '../firebase';

import Task from './Task';



export const Dashboard = () => {
    const [error,setError] = useState("");
    const [Tasks, setTasks] = useState([]);
    const {currentUser, logout} = useAuth();
    
    const navigate = useNavigate()
    const inputRef = useRef()
    useEffect(()=>getTasks)
    const taskRef = db.collection("Tasks")
    async function createTask(){
        if(inputRef.current.value!==""){
        await taskRef.add({
            uid:currentUser.uid,
            name:inputRef.current.value,
            createdAt: serverTimestamp()
        })
    }

    }
    async function getTasks(){
        await taskRef.where('uid','==',currentUser.uid).onSnapshot(querySnapshot=>{
            setTasks(querySnapshot.docs.map(doc=>({id:doc.id,name:doc.data().name})))
        })
        
    }
    const drag = (e) =>{
        let el = document.querySelector(".dragging")
        e.currentTarget.appendChild(el)
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
    <div className='App'>
    <div style={{display:"flex",position:"relative", width:"100%"}}>
    <div style={{backgroundColor:"red", width:"200px", height:"200px", margin:"10px" }} 
    onDragOver={(e)=>drag(e)}>1</div>
    <div style={{backgroundColor:"red", width:"200px", height:"200px",margin:"10px"}}></div>
    <div style={{backgroundColor:"red", width:"200px", height:"200px",margin:"10px"}}></div>
    </div>
    {error ? error : null}
    <input type="text" ref={inputRef}/>
        <Button onClick={createTask}>Stwórz zadanie</Button>
    {Tasks.map(task=>(
       <Task key={task.id} name={task.name} id={task.id}></Task>
    ))}
    
    <div className='w-100 text-center mt-2'>
        <Button variant="link" onClick={handleLogout}>Wyloguj się</Button>
    </div>
    </div>
  )
}
