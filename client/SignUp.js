import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SignUp = () => {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirm, setConfirm] = useState()
    const [mblno, setMblno] = useState(null)
    const [preUrl, setPreUrl] = useState()
    const [pic, setPic] = useState([])
    

    // useEffect(() => {
    //     if(image){
    //         const fileReader = new FileReader();
    //         fileReader.onload= () => {
    //             setPreUrl(fileReader.result)
    //         }
    //         fileReader.readAsDataURL(image)
    //     }
    // }, [image])

    const handleChange = (e, updateValue) => {
        updateValue(e.target.value)
    }

    const handleFileChange = (e) => {
        // for(var x = 0; x < e.target.files.length; x++) {
        //     setPic([...pic, e.target.files[x]])
        // }
        // for single file
        // setPic(e.target.files[0])
        setPic([...pic, ...e.target.files])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("submit")
        
        console.log(preUrl)
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('mblno', mblno);
        for(var x = 0; x < pic.length; x++) {
            formData.append('pic', pic[x])
        }
        console.log(formData, pic , preUrl)
        axios.post('http://localhost:4000/api/users/signup', formData)
        .then(res => console.log(res.data));
    }



    console.log(pic, preUrl)
    return(

        <>
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <div>
                <label>Name :</label>
                <input type="text" onChange={ (e) => handleChange(e, setName)} placeholder="Enter your name" />
                </div>

                <div>
                <label>Email :</label>
                <input type="text" onChange={ (e) => handleChange(e, setEmail)} placeholder="Enter email" />
                </div>

                <div>
                <label>Password :</label>
                <input type="text" onChange={ (e) => handleChange(e, setPassword)} placeholder="Enter password" />
                </div>

                <div>
                <label>Confirm Password :</label>
                <input type="text" onChange={ (e) => handleChange(e, setConfirm)} placeholder="Confirm password" />
                </div>

                <div>
                <label>Mobile No :</label>
                <input type="number" onChange={ (e) => handleChange(e, setMblno)} placeholder="Enter your mobile no" />
                </div>

                <div>
                <label>Profile Image :</label>
                <input type="file" accept=".jpeg , .png , .jpg" multiple onChange={handleFileChange} />
                </div>

                <div>
                <input type="submit" value="Submit" name="Submit" />
                </div>
     
            </form>

            {/* {preUrl && <img src={preUrl} alt="kdsn" />}  */}

        </>
    )
}
export default SignUp;