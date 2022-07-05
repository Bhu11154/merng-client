import{
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'
import  {Home}  from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import {SinglePost} from './pages/SinglePost'
import {MenuBar} from './components/MenuBar';
import {Container} from 'semantic-ui-react'
import './App.css'
import {AuthProvider} from './context/auth'

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <Container>
            <MenuBar/>
            <Routes>
              <Route exact path="/" element={<Home/>}/>
              <Route exact path="/login" element={<Login/>}/>
              <Route exact path="/register" element={<Register/>}/>
              <Route exact path='/posts/:postId' element={<SinglePost/>}/>            
            </Routes>
          </Container>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
