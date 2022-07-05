import React,{useContext, useState, useRef} from 'react'
import gql from 'graphql-tag'
import { Button, Card, Grid , Icon, Image, Label, Form} from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import DeleteButton from '../components/DeleteButton';
import {useQuery, useMutation} from '@apollo/react-hooks'

export const SinglePost = () => {
    const navigate = useNavigate()
    const {postId} = useParams();
    const {user} = useContext(AuthContext)
    const commentInputRef = useRef(null)
    const {data} = useQuery(FETCH_POST_QUERY, {
        variables:{
            postId
        }
    })

  const [comment, setComment] = useState('');

  const [submitComment] = useMutation(CREATE_COMMENT, {
    update(){
        setComment('')
        commentInputRef.current.blur();
    },
    variables:{
        postId,
        body: comment
    }
  })

  const deletePostCallback = () =>{
    navigate('/')
  }
    let postMarkup;

    if(!data){
        postMarkup = <p>Loading....</p>
    }else{
        
        const {id, body, createdAt, username, comments,commentCount, likeCount, likes} = data.getPost;
        
        postMarkup = (
            <>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <Image
                                floated='right'
                                size='small'
                                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>{username}</Card.Header>
                                    <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{body}</Card.Description>
                                </Card.Content>
                            </Card>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id,likeCount,likes}}/>
                                <Button as="div" labelPosition='right'>
                                    <Button basic color="blue">
                                        <Icon name="comments"/>
                                    </Button>
                                    <Label basic color="blue" pointing="left">{commentCount}</Label>
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback}/>
                                )}
                            </Card.Content>
                            {user && (
                                <Card fluid>
                                    <Card.Content>
                                        <p>Post a comment</p>
                                        <Form>
                                            <div className='ui action input fluid'>
                                                <input type="text"
                                                    placeholder='Comment..'
                                                    name="comment"
                                                    value={comment}
                                                    onChange = {(e)=>setComment(e.target.value)}
                                                    ref = {commentInputRef}
                                                />
                                                <button 
                                                    className='ui button teal' 
                                                    type="submit" 
                                                    disabled={comment.trim() === ''}
                                                    onClick={submitComment}
                                                >Submit</button>
                                            </div>
                                        </Form>
                                    </Card.Content> 
                                </Card>
                            )}
                            {comments.map(comment => {
                                return (
                                    <Card fluid key={comment.id}>
                                        <Card.Content>
                                            {user && user.username === comment.username && (
                                                <DeleteButton postId={id} commentId={comment.id}/>
                                            )}
                                            <Card.Header>{comment.username}</Card.Header>
                                            <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                            <Card.Description>{comment.body}</Card.Description>
                                        </Card.Content>
                                    </Card>
                                );
                                
                            })}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
        )
    }

    return postMarkup;
  
}

const CREATE_COMMENT = gql`
    mutation($postId: String!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id body createdAt username
            }
            commentCount
        }
    }
`


const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

