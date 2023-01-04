import React , {useEffect,useState} from 'react'
import Axios from 'axios' //  axios to connect with server
import './assets/w3.css'
import './assets/general.css'


const Login = () => {
 
const [username, setUsername] = useState ('')
const [password, setPassword] = useState ('')
const [errMsg, setErrMsg] = useState ('')



const login = (event) => {

  event.preventDefault()
    console.log(username)
    console.log(password)
    Axios.post('http://localhost:3500/login', {
        username : username , 
        password : password
    }).then((response) => {
      console.log(response.data.success)
        if(response.data.success){
          window.location = '/students'
        }else{
          setErrMsg("Login Failed")
        }
    } )

}
  return (
    <div className = 'w3-container w3-center ' style={{width: "500px", paddingBottom: "20px", margin: "auto"}}>
      
      <div className='w3-card-2'>
        <div className = "w3-container w3-green " style={{marginTop: "35%",borderTopLeftRadius: '5px', borderTopRightRadius: '5px'}}>
          <p>{errMsg}</p>
            <h1 style={{textTransform: 'uppercase'}}>Log in</h1>
        </div>

        <div className='w3-container w3-padding-16 w3-sand'>
              <label>Username: </label>
              <input  className='w3-margin-top' type = "text" onChange = {(e) => {
                setUsername(e.target.value) 
                setErrMsg("")
              }}/>
              <br/>
              <label>Password: </label>
              <input  className='w3-margin-top' type = "password" onChange = {(e) => {
                setPassword(e.target.value) 
                setErrMsg("")
              }}/><br/>
              <button onClick ={login} className="w3-button w3-green w3-margin-top">Log in</button>
        </div>
      </div>
    </div>
  )
}

export default Login