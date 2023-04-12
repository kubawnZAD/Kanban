import React from 'react'
import {Card,Button} from "react-bootstrap"
import MyModal from './MyModal';
import {doc,deleteDoc, updateDoc} from "firebase/firestore"
import { db } from '../firebase';
import "./styles/Task.css";
const Task = (props) => {
    
    const [modalShow, setModalShow] = React.useState(false);
    const deleteTask = async (id)=>{
        deleteDoc(doc(db,"Tasks",id))
    }
    const changeCursor = (e)=>{
        e.target.style.cursor = "move";
    }
    const editTask = async (name)=>{
    await updateDoc(doc(db,"Tasks",props.id),{name:name})
    
    }
  return (
    <Card draggable={true} onMouseOver={changeCursor} 
    onDragStart={(e)=>{e.currentTarget.classList.add("dragging")}} 
    onDragEnd={(e)=>e.currentTarget.classList.remove("dragging")}>
    <Card.Body>
    <h2 className='d-flex justify-content-center align-items-center'>{props.name}</h2>
    </Card.Body>
    <Button onClick={()=>{deleteTask(props.id)}}>delete task</Button>
    <Button variant="primary" onClick={() => setModalShow(true)}> Edit Task</Button>
    <MyModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        editTask={editTask}
        id={props.id}
    />
    </Card>
  )
}

export default Task