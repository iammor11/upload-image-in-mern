import React, { useState } from 'react';
import axios from 'axios'
import { useCookies } from 'react-cookie';

const SignIn = () => {
    const [cookies, setCookie] = useCookies(['token']);
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const handleChange = (e, updateValue) => {
        updateValue(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("submit")
        axios.post('http://localhost:4000/api/users/login', { email, password})
        .then(res => setCookie('token', res.data.token , { path: '/' }));
    }

    return(
        <>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Email :</label>
            <input type="text" onChange={ (e) => handleChange(e, setEmail)} placeholder="Enter email" />
            </div>

            <div>
            <label>Password :</label>
            <input type="text" onChange={ (e) => handleChange(e, setPassword)} placeholder="Enter password" />
            </div>

            <div>
            <input type="submit" value="submit" name="submit" />
            </div>
        </form>
        </>
    )
}
export default SignIn;