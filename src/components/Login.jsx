import React, {useRef,useState} from 'react'
import { Form,Button,Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  
  const {login} = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  async function handleSubmit(e){
    e.preventDefault()
    
    try{
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      navigate("/")
    }
    catch{
      setError('Nie udało się zalogować')
    }
    setLoading(false)
  }
  return (
    <>
    <Card>
        <Card.Body>
            <h2 className='text-center mb-4'>Logowanie</h2>
            
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email'ref={emailRef} required></Form.Control>
              </Form.Group>
              <Form.Group id='password'>
                <Form.Label>Hasło</Form.Label>
                <Form.Control type='password'ref={passwordRef} required></Form.Control>
              </Form.Group>
              
              <Button disabled={loading} type="submit" className='w-100 text-center mt-3'>Zaloguj</Button>
            </Form>
            <div className='w-100 text-center mt-3'>
                <Link to="/forgot-password">Zapomniałeś hasła?</Link>
            </div>
        </Card.Body>
    </Card>
    <div className='w-100 text-center mt-2'>
        Nie masz konta? <Link to='/signup'>Zarejestruj się</Link>
    </div>
    </>
  )
}

export default Login