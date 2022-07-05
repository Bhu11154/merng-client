import React,{useState} from 'react'
import {Form, Button} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {FETCH_POSTS_QUERY} from '../graphql'

function PostForm() {
    const [values, setValues] = useState({
        body: ''
    });
    const onChange = (e) => {
        setValues({...values, [e.target.name] : e.target.value})
    }
    const [createPost, {error}] = useMutation(CREATE_POST,{
        variables: values,
        update(proxy, result){
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts],
                },
            });
            values.body = '';
        }
    })

    const onSubmit = (e) =>{
        e.preventDefault();
        createPost()
    }

  return (
    <>
        <Form onSubmit={onSubmit}>
            <h2>Create a Post: </h2>
                
            <Form.Field>
                <Form.Input 
                    placeholder = 'Hi world!!'
                    name = "body"
                    onChange = {onChange}
                    value = {values.body}
                    error={error ? true : false}
                />
                <Button type='submit' color='teal'>Submit</Button>
            </Form.Field> 
        </Form>
        {error && (
            <div className='ui error message' style={{marginBottom: "20px"}}>
                <ul className="list">
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
            </div>
        )}
    </>
  )
}

const CREATE_POST = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body createdAt username 
            likes{
                id username createdAt
            }
            likeCount
            comments{
                id body username createdAt
            }
            commentCount
        }
    }
`
export default PostForm
