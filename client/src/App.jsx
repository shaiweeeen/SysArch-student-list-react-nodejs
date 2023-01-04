import React from 'react'
import Login from './Login'
import Students from './Students'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AddStudent from './AddStudent'
import EditStudent from './EditStudent'
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route index element={<Login/>}/>
          <Route path='/students' element={<Students/>}/>
          <Route path='/addStudent' element={<AddStudent/>}/>
          <Route exact path="/editStudent" render={(props) => <EditStudent {...props}/>} />
        </Routes>
      </Router>
      
    </>
  )
}

export default App
