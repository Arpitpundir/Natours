//in index.js we will take the elements from the user interface and then delegate them task by using 
//functions present in other files 
//in js we will use import and export keywords.
import {
    login,
    logout
} from "./login.js";

import "@babel/polyfill";
import {
    displayMap
} from "./mapbox.js";
//this package would make some of the new features of the js in some old browsers
import { updateSettings } from './updateSettings';

import {bookTour} from "./stripe";
import {signup} from "./signup"
const loginForm = document.querySelector('.form--login');
const mapBox = document.getElementById("map");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById("book-tour");
const signUpForm = document.getElementById("form--signup");

if (loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        //const userPhoto = document.getElementById("photo").value;
        login(email, password);
    });

if(signUpForm){
    console.log("kll;")
    signUpForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        signup(name, email, password)
        
    })
}

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (logOutBtn) {
    logOutBtn.addEventListener("click", logout);
}
if (userDataForm)
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData;
        // The FormData interface provides a way to easily construct a set of key/value pairs representing form fields and their values, which can then be easily sent using the XMLHttpRequest.send() method. 
        // It uses the same format a form would use if the encoding type were set to "multipart/form-data".
        form.append("name", document.getElementById('name').value);
        form.append("email", document.getElementById('email').value);
        form.append("photo", document.getElementById('photo').files[0]);
        console.log(form);
        updateSettings(form, 'data');
    });

if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({
                passwordCurrent,
                password,
                passwordConfirm
            },
            'password'
        );

        document.querySelector('.btn--save-password').textContent = 'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });

    if(bookBtn){
        bookBtn.addEventListener("click", e => {
            e.target.textContent = "Processing...";
            const {tourId} = e.target.dataset;
            bookTour(tourId);
        });
    }