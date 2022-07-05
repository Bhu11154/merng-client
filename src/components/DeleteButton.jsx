import React,{useState} from 'react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react'
import { FETCH_POSTS_QUERY } from '../graphql'

const DeleteButton = ({postId,commentId, callback}) => {
    const [open, setOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST
    
    const [deletePostOrMutation] = useMutation(mutation,{
        update(proxy,result){
            setOpen(false);
            if(!commentId){
                const data = proxy.readQuery({
                    query:FETCH_POSTS_QUERY
                })
                const newPosts = data.getPosts.filter(p => p.id !==postId)
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: newPosts
                    },
                });
            }
            
            if(callback) callback();
        },
        variables: {
            postId,
            commentId
        }
    })
  return (
    <>  
        <Popup
            content={commentId ? "Delete comment": "Delete Post"}
            inverted
            trigger={<Button as="div" color="red" floated='right' 
            onClick={()=>setOpen(true)}
            >
                <Icon name="trash" style={{margin: 0}}></Icon>
            </Button>}
        >
        </Popup>
        
        <Confirm 
            open={open}
            onCancel={()=> setOpen(false)}
            onConfirm={deletePostOrMutation}
        >
        </Confirm>
    </>
  )
}

const DELETE_POST = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: String!, $commentId: String!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton