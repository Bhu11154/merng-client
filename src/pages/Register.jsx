import React, {useState,useContext} from 'react'
import {Form, Button} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../context/auth'

export const Register = () => {
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

  const [addUser, {loading}] = useMutation(REGISTER_USER,{
    update(proxy, result){
      context.login(result.data.register)
      navigate('/')
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  })

  const onSubmit = (e) =>{
    e.preventDefault();
    addUser()
  }
  
  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input
          label = "Username"
          placholder="Username.."
          name= "username"
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
          />
        <Form.Input
          label = "Email"
          placholder="Email.."
          name= "email"
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}
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
          <Form.Input
          label = "Confirm Password"
          placholder="Confirm Password.."
          name= "confirmPassword"
          type='password'
          value={values.confirmPassword}
          error={errors.password ? true : false}
          onChange={onChange}
          />
          <Button type='submit' primary>Register</Button>
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
