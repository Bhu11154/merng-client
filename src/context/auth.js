import React, {createContext, useReducer} from "react";
import jwtDecode from 'jwt-decode'

const initialState = {
    user:null
}

if(localStorage.getItem('jwtToken')){
    const decodedtoken = jwtDecode(localStorage.getItem('jwtToken'));

    if(decodedtoken.exp * 1000 < Date.now()){
        localStorage.removeItem('jwtToken')
    }else{
        initialState.user = decodedtoken;
    }
}

const AuthContext =  createContext({
    user:null,
    login: (data) => {},
    logout: ()=>{}
})

function authReducer(state, action){
    switch(action.type){
        case 'LOGIN':
            return{
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user:null
            }
        default:
            return state;
    }
}

function AuthProvider(props){
    const [state, dispath] = useReducer(authReducer, initialState);

    function login(userData){
        localStorage.setItem('jwtToken', userData.token);
        dispath({
            type: 'LOGIN',
            payload: userData
        })
    }

    function logout(){
        localStorage.removeItem('jwtToken');
        dispath({
            type: 'LOGOUT'
        })
    }

    return(
        <AuthContext.Provider
            value = {{user:state.user, login, logout}}
            {...props}
        />
    )

}

export {AuthContext, AuthProvider}