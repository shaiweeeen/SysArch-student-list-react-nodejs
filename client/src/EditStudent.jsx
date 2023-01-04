import React, {useState} from 'react'
import './assets/w3.css'
import './assets/general.css'
import Webcam from 'react-webcam'
const EditStudent = (props) => {
    const [student, setStudent] =useState({
        
        lastname : '',
        firstname : '',
        course : '',
        level : '',
    })
    
    const save = () => { 
        
        Axios.post('http://localhost:3500/students', student)
    }
    const videoConstraints = {
        width: 250,
        height: 250,
        facingMode: 'user'
    }
    const webcamRef = React.useRef(null)
    const [img, setImg] = useState(null)
    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot()
            setImg(imageSrc)
            setDisplay(true)
            
        }, [webcamRef]
    )

    const [display, setDisplay] = useState(false)
    
    const hiddenFileInput = React.useRef(null);
    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
  return (
    <>
        <div>
            <div style={{width: '500px', height: '30vh', marginTop: '1%'}} className="w3-modal-content w3-animate-opacity">
                <div className="w3-container w3-green">
                    
                    <h3 className= "w3-left-align"style={{fontWeight: '800'}}>Add Student</h3>
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                <p className='w3-center w3-margin-left'>
                    {img === null ?
                <Webcam
                        audio={false}
                        height={250}
                        ref={webcamRef}
                        screenshotFormat='image/jpeg'
                        width={250}
                        videoConstraints={videoConstraints}
                        
                    />:<img src={img.filepreview}/>
                }
                    </p>
                    <div style={{display: 'flex', flexDirection: 'column', marginTop:'20%', width: '90%', gap:'20px', marginLeft:'20px',marginRight:'20px'}}>
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
                 
                     
                    </div>
            </div>
            <div style={{width: '100%',  marginTop:'1%', marginBottom: '7%', marginRight: 'auto', marginLeft: 'auto'}} className="w3-container w3-serif">
                       <table style={{width: '100%', margin: 'auto'}}>
                        <tr>
                            <td><label htmlFor='lastname'>Last Name: </label></td>
                            <td ><input type="text" id="lastname" 
                                    onChange = {(e) => {setStudent({...student, lastname: e.target.value})}} 
                                    style={{marginTop: '5px', width:'100%'}}/>
                            </td>
                        </tr>

                        <tr>
                            <td><label htmlFor='firstname'>First Name: </label></td>
                            <td><input type="text" id="firstname" 
                                    onChange = {(e) => {setStudent({...student, firstname: e.target.value})}}
                                    style={{marginTop: '5px', width:'100%'}}/>
                            </td>
                        </tr>

                        <tr>
                            <td><label htmlFor='course'>Course: </label></td>
                            <td><input type="text" id="course" 
                                    onChange = {(e) => {setStudent({...student, course: e.target.value})}} 
                                    style={{marginTop: '5px', width:'100%'}}/>
                            </td>
                        </tr>

                        <tr>
                            <td><label htmlFor='level'>Year Level: </label></td>
                            <td><input type="text" id="level" 
                                    onChange = {(e) => {setStudent({...student, level: e.target.value})}} 
                                    style={{marginTop: '5px',width:'100%'}}/>
                            </td>
                        </tr>
                        </table>

                        <p></p><button id="save" onClick={save} className="w3-center w3-button w3-green w3-margin-top w3-margin-bottom">Save</button>
                </div>
                    
            </div>
        </div>

        
    </>
  )
}

export default EditStudent