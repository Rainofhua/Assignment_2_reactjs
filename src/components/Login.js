import React, { Fragment, useEffect, useState } from 'react';
import axios from "axios";
import { baseUrl } from "../Constants";

function Login(props) {
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hasToken, setHasToken] = useState(false);
    const [groups, setGroup] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');

    useEffect(() => {
        const storedFirstName = localStorage.getItem("first_name");
        if (storedFirstName) {
            setFirstName(storedFirstName);
        }
        const storedLastName = localStorage.getItem("last_name");
        if (storedLastName) {
            setLastName(storedLastName);
        }
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            setHasToken(true);
        }
        const storedGroup = localStorage.getItem("groups");
        if (storedGroup) {
            setGroup(storedGroup);
        }
    }, []); // Corrected dependency array


    function usernameHandler(event) {
        setUsername(event.target.value);
    }

    function passwordHandler(event) {
        setPassword(event.target.value);
    }

    async function login() {
        await axios.post(
            baseUrl + 'auth/',
            {
                username: username,
                password: password,
            },
        ).then(response => {
            console.log(response.data);
            const newFirstName = response.data.first_name;
            const newLastName = response.data.last_name;
            const newToken = response.data.token;
            const newGroup = response.data.groups;
            setToken(newToken);
            setHasToken(true);
            localStorage.setItem("first_name", newFirstName);
            localStorage.setItem("last_name", newLastName);
            localStorage.setItem("token", newToken);
            localStorage.setItem("group", newGroup);

            if (newGroup === "Administrators") {
                window.location.href = "/admin";
            } else if (newGroup === "Lecturers") {
                window.location.href = "/lecturer";
            } else if (newGroup === "Students") {
                window.location.href = "/student";
            }
        }).catch(error => {
            console.log(error);
        });
    }



    function logout() {
        const loginfirstname = localStorage.getItem("first_name");
        const loginlastname = localStorage.getItem("last_name");
        const loginToken = localStorage.getItem("token");
        const logingroup = localStorage.getItem("group");
        axios.get(
            baseUrl + 'auth/logout/',
            {
                headers: {
                    Authorization: 'Token ' + loginToken,
                }
            }
        ).then(response => {
            console.log(response);
            localStorage.removeItem("first_name");
            localStorage.removeItem("last_name");
            localStorage.removeItem("token");
            localStorage.removeItem("group");
            setToken("");
            setHasToken(false);
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <div>
            {hasToken ?
                <Fragment>
                    <button className={"btn btn-primary"} onClick={logout}>Logout</button>
                </Fragment>
                :
                <Fragment>
                    <p>Username: <input className={"form-control"} name={"username"} onChange={usernameHandler} /></p>
                    <p>Password: <input type={"password"} className={"form-control"} name={"password"} onChange={passwordHandler} /></p>
                    <p><button className="custom-button" onClick={login}>Login</button></p>
                </Fragment>
            }
        </div>
    );
}

export default Login;
