import React from 'react'
import {setContext} from 'apollo-link-context'
import App from './App'

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';

const httpLink = createHttpLink({
    uri: 'https://rocky-hollows-59588.herokuapp.com/'
})

const authLink = setContext(()=>{
  const token = localStorage.getItem('jwtToken');
  return{
    headers:{
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})



const ApolloProviderComponent = () => {
  return (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
  )
}

export default ApolloProviderComponent
