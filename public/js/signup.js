import axios from 'axios';
import {
    showAlert
} from './alerts';

exports.signup = async (name, email, password) => {
    try {
        console.log(name, email, password);
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/signup',
            data: {
                name,
                email,
                password
            }
        });
        if (res.data.status === 'success') {

            showAlert('success', "Signed in sucessfully");
            window.setTimeout(() => {
                location.assign('/');
                //go back to home page
            }, 1500);
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
        //console.log(res.body);
    }
}