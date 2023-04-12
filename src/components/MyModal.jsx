import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, {useRef, useState} from 'react';

function MyModal(props) {
  const [name,setName]= useState('')
  const inpRef = useRef()
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e)=>{
            e.preventDefault()
            
            props.editTask(name)
          }}>
          Nazwa zadania:<input type="text" ref={inpRef} onChange={(e)=>{setName(e.target.value)}}/>
          <Button onClick={props.onHide} type='submit'>Edit</Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  export default MyModal;