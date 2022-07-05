import React, {useState, useContext} from 'react'
import {Form, Button} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../context/auth'

export const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  })
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState({})

  const onChange = (e) => {
    setValues({...values, [e.target.name] : e.target.value})
  }

  const [loginUser, {loading}] = useMutation(LOGIN_USER,{
    update(_, result){
      context.login(result.data.login)
      navigate('/')
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  })

  const onSubmit = (e) =>{
    e.preventDefault();
    loginUser()
  }
  
  return (
    
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input
          label = "Username"
          placholder="Username.."
          name= "username"
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
          />
          <Form.Input
          label = "Password"
          placholder="Password.."
          name= "password"
          type='password'
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
          />
          <Button type='submit' primary>Login</Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
      
    </div>
  )
}


const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
        username: $username
        password: $password
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
