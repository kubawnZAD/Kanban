import React, { useRef } from 'react'
import { db } from '../firebase';
import { serverTimestamp } from '../firebase';
import {useAuth} from '../contexts/AuthContext'
const Fetch = () => {
    let items=[]
    const inputRef = useRef()
    let unsubscribe
    const {currentUser} = useAuth()
    function createTask(){
        const taskRef = db.collection("Tasks")
        taskRef.add({
            uid:currentUser.uid,
            name:inputRef.current.value,
            createdAt: serverTimestamp()
        })
        
        
    }
  return (
    <div>
        <input type="text" ref={inputRef}/>
        <button onClick={createTask}>Stwórz zadanie</button>
    
    </div>
  )
}

export default Fetch