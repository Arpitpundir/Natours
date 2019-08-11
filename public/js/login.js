import axios from 'axios';
import {
    showAlert
} from './alerts';

// if (loginForm)
//   loginForm.addEventListener('submit', e => {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     login(email, password);
//   });
export const login = async (email, password) => {
    try {
        //console.log(email, password)
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        console.log(res.cookies.jwt);
        if (res.data.status === 'success') {

            showAlert('success', "Logged in sucessfully");
            window.setTimeout(() => {
                location.assign('/');
                //go back to home page
            }, 1500);
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
        //console.log(res.body);
    }
};

export const logout = async () => {
    try {
        //we are replacing our cookie having token to an empty cookie with the same name jwt
        //
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if ((res.data.status = 'success')) location.reload(true);
    } catch (err) {
        console.log(err.response);
        showAlert('error', 'Error logging out! Try again.');
    }
};