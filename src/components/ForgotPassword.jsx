import React, {useRef,useState} from 'react'
import { Form,Button,Card, Alert } from 'react-bootstrap'
import { Link} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const ForgotPassword = () => {
  const emailRef = useRef();
  
  
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const {resetPassword} = useAuth()
  async function handleSubmit(e){
    e.preventDefault()
    
    try{
        setMessage('')
      setError('')
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Sprawdź swoją skrzynkę email aby zresetować hasło")
    }
    catch{
        
      setError('Nie udało się zresetować hasła')
    }
    setLoading(false)
  }
  return (
    <>
    <Card>
        <Card.Body>
            <h2 className='text-center mb-4'>Resetowanie hasła</h2>
            
            {error && <Alert variant='danger'>{error}</Alert>}
            {message && <Alert variant='success'>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email'ref={emailRef} required></Form.Control>
              </Form.Group>
              
              
              <Button disabled={loading} type="submit" className='w-100 text-center mt-3'>Zresetuj Hasło</Button>
            </Form>
            <div className='w-100 text-center mt-3'>
                <Link to="/login">Login</Link>
            </div>
        </Card.Body>
    </Card>
    <div className='w-100 text-center mt-2'>
        Nie masz konta? <Link to='/signup'>Zarejestruj się</Link>
    </div>
    </>
  )
}

export default ForgotPassword