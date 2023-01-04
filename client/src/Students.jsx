import React, {useState, useEffect} from 'react'
import './assets/w3.css'
import './assets/general.css'
import Axios from 'axios' //  axios to connect with server
import Webcam from 'react-webcam'

const Students = () => {
    
   
    const [students, setStudents] = useState([])
    const [editToggle,setEditToggle] = useState(false)
    const [addToggle,setAddToggle] = useState(false)
    const [img, setImg] = useState(null)
    const [del,setDel] = useState(null)
    const [errorTrap,setErrorTrap] = useState('')

    const [student, setStudent] =useState({
        
        lastname : '',
        firstname : '',
        course : '',
        level : '',
    })
    const [edit, setEdit] =useState({
        img:null,
        idno: '',
        lastname : '',
        firstname : '',
        course : '',
        level : ''
    })
    
   
    const videoConstraints = {
        width: 250,
        height: 250,
        facingMode: 'user'
    }
    const webcamRef = React.useRef(null)
    
    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot()
            setImg(imageSrc)
            setDisplay(true)
            
        }, [webcamRef]
    )

    const [display, setDisplay] = useState(false)
    const addStudentModal = React.useRef(null)
    const hiddenFileInput = React.useRef(null)
    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = event => {
        setImg(null)
    };

     useEffect(() =>{
            Axios.get('http://localhost:3500/students').then((res)=>{
            setStudents(res.data.studentsList)
            //console.log(res.data.studentsList)
        })
     })
    
    const showAddModal = (e) =>{
        //window.location='/addStudent'
        e.preventDefault
        setAddToggle(true)
        
    
    }
    const hideAddModal = (e) =>{
        //window.location='/addStudent'
        e.preventDefault
        setAddToggle(false)
        setImg(null)
     
    }
    
    const showEditModal = (e,id,lname,fname,crs,lvl,img) =>{{}
        e.preventDefault
        setEdit({
            ...edit,
                img:img,
                idno: id,
                lastname : lname,
                firstname : fname,
                course : crs,
                level : lvl
        })  
        setEditToggle(true)
    }
    const hideEditModal = (e) =>{
        //window.location='/addStudent'
        e.preventDefault
        setEditToggle(false)
        
    }
    const deleteStudent = (e,id) =>{
        e.preventDefault
        Axios.delete(`http://localhost:3500/students/${id}`).then( (res) =>{
            alert(res.data.message) 
        })
        
    }
    const addStudent = (e) => {  
        

        const formdata = new FormData(); 
        formdata.append('file', img);
        formdata.append('lastname', student.lastname)
        formdata.append('firstname', student.firstname)
        formdata.append('course', student.course)
        formdata.append('level', student.level)
       
        Axios.post('http://localhost:3500/students', 
            formdata, {headers: { "Content-Type": "multipart/form-data" }} ).then((res)=>{
            hideAddModal(e);
            alert(res.data.message)
        })
        
    }
    const editStudent = (e) => {         
        Axios.put('http://localhost:3500/students', edit).then((res =>{
            hideEditModal(e)
            alert(res.data.message)
            console.log(res.data.result)
            })   
        )  
    }
    
    

  return (
    <>
  

    <div className='w3-bar w3-green w3-padding-16'>
         <h1 style={{ fontWeight: '900', marginLeft: '1em'}}>Manage Students <a className='w3-right' style={{marginRight: '1em'}} href="/">Log out</a></h1>       
    </div>
    
    <div className='w3-margin-top'>
        <button id="btnAdd" 
        className='w3-right w3-button w3-green' 
        style={{marginRight: '2em', marginBottom: '1em', fontWeight: '800'}} 
        onClick=  {(e) =>{showAddModal(e)} }>Add User</button>
    </div>

    <div >
        <table  className="w3-table-all" style={{width: '95%', margin: 'auto'}}>
        <thead> 
            <tr className = "w3-green">
            {/* <th>Photo</th> */}
            <th>ID Number</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Course</th>
            <th>Level</th>
            <th className='w3-center'>Action</th>
            </tr>
        </thead>
        <tbody>
            
            {students.map((val,index) =>(
                <tr key={index}>
                    {/* <td><img src={`http://localhost:3500/images/${val.img}`}></img></td> */}
                    <td>{val.idno}</td>
                    <td>{val.lastname}</td>
                    <td>{val.firstname}</td>
                    <td>{val.course}</td>
                    <td>{val.level}</td> 
                     <td className='w3-center'> 
                     <button id='editbtn'
                       onClick={(e)=>{console.log(val.idno)
                        showEditModal(e,val.idno,val.lastname,val.firstname, val.course, val.level,val.img)}}
                     >&#9998;</button>
                      
                     <button id='delbtn'
                       onClick= {(e)=>{deleteStudent(e,val.idno)}}
                     >&#x1F5D1;</button>
                      {/*  */}
                     </td>    
                </tr>
                
            ))}
       
        </tbody>
        </table>
    </div>
    
    {/* ADD STUDENT MODAL */}
    {addToggle && 
        <div className='w3-modal'
        style={{ 
            display: 'block', 
            position: 'fixed', 
            zIndex: '1', inset: '0',  
            width: '100%', 
            
            backgroundColor: 'rgba(0,0,0,0.4)'
            }} 
            ref = {addStudentModal}>
         
            <div style={{width: '500px', height: '30vh', marginTop: '1%'}} className="w3-modal-content w3-animate-opacity">
                <div className="w3-container w3-green">
                    
                    <h3 className= "w3-left-align"style={{fontWeight: '800'}}>Add Student</h3>
                    <span className="w3-button w3-padding-16 w3-display-topright" onClick={(e) =>{hideAddModal(e)}} >&times;</span>
                </div>
                <div style={{display: 'flex', flexDirection: 'row',backgroundColor: 'white'}}>
                    <p>{errorTrap}</p>
                <p className='w3-center w3-margin-left'>
                    {img === null ?
                <Webcam
                        audio={false}
                        height={250}
                        ref={webcamRef}
                        screenshotFormat='image/jpeg'
                        width={250}
                        videoConstraints={videoConstraints}
                        
                    />:<img src={img}/>
                }
                    </p>
                    <div style={{display: 'flex', flexDirection: 'column', marginTop:'20%', width: '90%', gap:'20px', marginLeft:'20px',marginRight:'20px'}}>
                        <button onClick={capture}  className = "w3-green w3-button">Take Photo</button>
                        {/* <input 
                            
                            type="file" 
                            ref={hiddenFileInput}
                            style={{positionSelf: 'right', display: 'none'}}
                            onChange={(e) => { setStudent({...student,
                            img: setImg({
                                ...img,
                                file:e.target.files[0],
                                filepreview:URL.createObjectURL(e.target.files[0]),
                                })})
                            }} 
                        /> */}
                        <button 
                        className = "w3-green w3-button"
                        onClick={handleClick}>
                            Retake Photo
                        </button>
                 
                     
                    </div>
            </div>
            <div style={{width: '100%',  marginTop:'0%', marginBottom: '7%', marginRight: 'auto', marginLeft: 'auto' ,backgroundColor: 'white'}} className="w3-container w3-serif">
                       <table style={{width: '100%', margin: 'auto'}}>
                        <tbody>
                        <tr>
                            <td><label htmlFor='lastname'>Last Name: </label></td>
                            <td ><input type="text" id="lastname" 
                                    onChange = {(e) => {setStudent({...student, lastname: e.target.value})}} 
                                    style={{marginTop: '5px', width:'100%'}} required/>
                            </td>
                        </tr>

                        <tr>
                            <td><label htmlFor='firstname'>First Name: </label></td>
                            <td><input type="text" id="firstname" 
                                    onChange = {(e) => {setStudent({...student, firstname: e.target.value})}}
                                    style={{marginTop: '5px', width:'100%'}} required/>
                            </td>
                        </tr>

                        <tr>
                            <td><label htmlFor='course'>Course: </label></td>
                            <td style={{width:"350px"}}>
                            <input type="text" id="course" 
                                    onChange = {(e) => {setStudent({...student, course: e.target.value})}} 
                                    style={{marginTop: '5px', width:'30%'}} required/>
                            
                        

                        
                            <label htmlFor='level'
                                style={{marginLeft: '5px'}}>Year Level: </label>
                            
                                <select style={{width:'142px', height:'30px'}} 
                                onClick = {(e) => {setStudent({...student, level: e.target.value})}}>
                                    <option  >Select Level</option>
                                    <option value="1st" >1st</option>
                                    <option value="2nd">2nd</option>
                                    <option value="3rd">3rd</option>
                                    <option value="4th">4th</option>
                                    <option value="5th">5th</option>
                                </select>
                                {/* <input type="text" id="level" 
                                    onChange = {(e) => {setStudent({...student, level: e.target.value})}} 
                                    style={{marginTop: '5px',width:'100%'}}/> */}
                            </td>
                        </tr>
                        </tbody>
                        </table>

                        <p></p><button id="save" onClick={(e)=>{addStudent(e)}} className="w3-center w3-button w3-green w3-margin-top w3-margin-bottom">Save</button>
                </div>
                    
            </div>
        </div>
    }

     {/* EDIT STUDENT MODAL */}
    {editToggle && 
        <div className='w3-modal'
        style={{ 
            display: 'block', 
            position: 'fixed', 
            zIndex: '1', inset: '0',  
            width: '100%', 
            
            backgroundColor: 'rgba(0,0,0,0.4)'
            }} 
            ref = {addStudentModal}>
         
            <div style={{width: '500px', height: '30vh', marginTop: '1%'}} className="w3-modal-content w3-animate-opacity">
                <div className="w3-container w3-green">
                    
                    <h3 className= "w3-left-align"style={{fontWeight: '800'}}>Add Student</h3>
                    <span className="w3-button w3-padding-16 w3-display-topright" onClick={(e) =>{hideEditModal(e)}} >&times;</span>
                </div>
                <div style={{display: 'flex',justifyContent:'center', alignItems:'center',backgroundColor: 'white'}}>
                
                <img style= {{marginTop:'2%'}}src={`http://localhost:3500/images/${edit.img}`}></img>
                
                    
                    {/* <div style={{display: 'flex', flexDirection: 'column', marginTop:'20%', width: '90%', gap:'20px', marginLeft:'20px',marginRight:'20px'}}>
                        <button onClick={capture}  className = "w3-green w3-button">Take Photo</button>
                         <input 
                            
                            type="file" 
                            ref={hiddenFileInput}
                            style={{positionSelf: 'right', display: 'none'}}
                            onChange={(e) => { setImg({
                                ...img,
                                file:e.target.files[0],
                                filepreview:URL.createObjectURL(e.target.files[0]),
                                })
                            }} 
                        /> 
                        <button 
                        className = "w3-green w3-button"
                        onClick={handleClick}>
                            Upload photo
                        </button>
                 
                     
                    </div> */}
            </div>
            <div style={{width: '100%',  marginTop:'0%', marginBottom: '7%', marginRight: 'auto', marginLeft: 'auto' ,backgroundColor: 'white'}} className="w3-container w3-serif">
                       <table style={{width: '100%', margin: 'auto'}}>
                        <tbody>
                        <tr>
                            <td><label htmlFor='lastname'>Last Name: </label></td>
                            <td ><input type="text" id="lastname" 
                                        defaultValue= {edit.lastname}
                                        onChange = {(e) => {setEdit({...edit, lastname: e.target.value})}} 
                                        style={{marginTop: '5px', width:'100%'}}/>
                            </td>
                        </tr>

                        <tr>
                            <td><label htmlFor='firstname'>First Name: </label></td>
                            <td><input type="text" id="firstname"
                                        defaultValue = {edit.firstname} 
                                    onChange = {(e) => {setEdit({...edit, firstname: e.target.value})}}
                                    style={{marginTop: '5px', width:'100%'}}/>
                            </td>
                        </tr>

                        <tr>
                            <td><label htmlFor='course'>Course: </label></td>
                            <td><input type="text" id="course"
                                        defaultValue = {edit.course} 
                                    onChange = {(e) => {setEdit({...edit, course: e.target.value})}} 
                                    style={{marginTop: '5px', width:'45%'}}/>
                            
                       

                            <label htmlFor='level'>Year Level: </label>
                            <select style={{width:'80px', height:'30px'}} onChange = {(e) => {setEdit({...edit, level: e.target.value})}} >
                                    
                                      
                                    <option selected={edit.level === '1st'} value="1st">1st</option>
                                    <option selected={edit.level === '2nd'} value="2nd">2nd</option>
                                    <option selected={edit.level === '3rd'} value="3rd">3rd</option>
                                    <option selected={edit.level === '4th'} value="4th">4th</option>
                                    <option selected={edit.level === '5th'} value="5th">5th</option>
                                
                                </select>
                                
                            </td>
                                {/* <input type="text" id="level"
                                        defaultValue = {edit.level} 
                                    onChange = {(e) => {setEdit({...edit, level: e.target.value})}} 
                                    style={{marginTop: '5px',width:'100%'}}/> */}
                            
                        </tr>
                        </tbody>
                        </table>

                        <p></p><button id="save" onClick={(e)=>{editStudent(e)}} className="w3-center w3-button w3-green w3-margin-top w3-margin-bottom">Save</button>
                </div>
                    
            </div>
        </div>
    }
    
    </>
  )

}

export default Students