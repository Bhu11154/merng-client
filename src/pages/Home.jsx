import React, {useContext} from 'react'
import {useQuery} from '@apollo/react-hooks'
import { FETCH_POSTS_QUERY } from '../graphql';
import {Grid, Transition} from 'semantic-ui-react'
import PostCard from '../components/PostCard';
import {AuthContext} from '../context/auth'
import PostForm from '../components/PostForm'

export const Home = () => {

  const {user} = useContext(AuthContext)
  
  const {loading, data} = useQuery(FETCH_POSTS_QUERY)
  
  return (
    <>
        <Grid.Row className='page-title'>
          <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid columns={3}>
          <Grid.Row>
            {user && (
              <Grid.Column>
                <PostForm/>
              </Grid.Column>
            )}
            {
              loading ? (<h1>Loading..</h1>) : (
                <Transition.Group>
                  {data.getPosts && data.getPosts.map(post => {
                  return(
                    <Grid.Column key={post.id} style={{marginBottom: 30}}>
                      <PostCard post = {post}/>
                    </Grid.Column>
                  );
                  
                })}
                </Transition.Group>
              )
            }
          </Grid.Row>
        </Grid>
    </>

  )
}


