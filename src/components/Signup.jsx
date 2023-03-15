import React, {useRef,useState} from 'react'
import { Form,Button,Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const {signup}= useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value){
      return setError('Hasła się nie zgadzają')
    }
    try{
      setError('')
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      navigate("/")
    }
    catch(error){
      setError('Nie udało się założyć konta')
      console.log(error)
    }
    setLoading(false)
  }
  return (
    <>
    <Card>
        <Card.Body>
            <h2 className='text-center mb-4'>Rejestracja</h2>
            
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
              <Form.Group id='password-confirm'>
                <Form.Label>Powtórz hasło</Form.Label>
                <Form.Control type='password'ref={passwordConfirmRef} required></Form.Control>
              </Form.Group>
              <Button disabled={loading} type="submit" className='w-100 text-center mt-3'>Zarejestruj</Button>
            </Form>
        </Card.Body>
    </Card>
    <div className='w-100 text-center mt-2'>
        Masz już konto? <Link to="/login">Zaloguj się</Link>
    </div>
    </>
  )
}

export default Signup