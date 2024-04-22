//SETUP APIS
import { areCookiesEnabled } from "@firebase/util";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const app = {
  init: () => {
    document.addEventListener("DOMContentLoaded", app.load)
  },
  load: () => {
    //The Page has finished loading its html
    app.setup()
  },
  setup: () => {
    //initialize firebase
    const firebaseConfig = {
      apiKey: "AIzaSyAeukxXocYV5YXoR7Aud05-5YpRGCAoiCs",
      authDomain: "chatscure.firebaseapp.com",
      databaseURL: "https://chatscure-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "chatscure",
      storageBucket: "chatscure.appspot.com",
      messagingSenderId: "624549740080",
      appId: "1:624549740080:web:4555807bf14b6283b8b7f5",
      measurementId: "${config.measurementId}"
    };

    const fbapp = initializeApp(firebaseConfig);
    const auth = getAuth(fbapp);

    app.checkUserSignedIn(auth)

    //assign button functions
    let page = document.body.id
    switch (page) {
      case "signin-html":
        app.signin(auth)
        break
      case "signup-html":
        app.signup(auth)
        break
      case "chat-select": 
        app.signout(auth)
        break
    }
  },
  signin: (auth) => {
    let signinBtn = document.querySelector(".form form .button input")
    let email = document.querySelector("#email-input")
    let password = document.querySelector("#password-input")
    signinBtn.onclick = () => {
      app.showLoading();
      signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
      })
      .catch((error) => {
        let errorMessage = error.code;
        app.showError(errorMessage)
      })
      .finally(() => {
        app.hideLoading();
      });
    }
  },
  signup: (auth) => {
    let signupBtn = document.querySelector(".form form .button input")
    let username = document.querySelector("#username-input")
    let firstname = document.querySelector("#firstname-input")
    let lastname = document.querySelector("#lastname-input")
    let email = document.querySelector("#email-input")
    let password = document.querySelector("#password-input")

    signupBtn.onclick = () => {
      //signin
      app.showLoading();
      createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
        
      })
      .catch((error) => {
        let errorMessage = error.code;
        app.showError(errorMessage);
      })
      .finally(() => {
        app.hideLoading();
      });
    }
  },
  signout: (auth) => {
    let signoutBtn = document.querySelector(".form form .button input")

    signoutBtn.onclick = () => {
      signOut(auth)
      .then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
    }

  },
  checkUserSignedIn: (auth) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //user signed in
        let currentPage = window.location.href.split("/").slice(-1)
        if (currentPage == "signin.html" || currentPage =="signup.html") {
          window.location = "chat.html"
        }
      }
      else {
        if (currentPage != "signin.html" || currentPage != "signup.html") {
          //user not signed in
          window.location = "signin.html"
        }
      }
    });
  },
  showLoading: () => {
    let loadingOverlay = document.getElementById("loading");
    loadingOverlay.style.display = "block";
  },
  hideLoading: () => {
    let loadingOverlay = document.getElementById("loading");
    loadingOverlay.style.display = "none";
  },
  showError: (errorMessage) => {
    let errorMessageElement = document.getElementById("error-message")
    errorMessageElement.getElementsByTagName('perror')[0].innerText = app.getErrorMessage(errorMessage)
    errorMessageElement.style.maxHeight = "35px"
    errorMessageElement.style.opacity = 1
  },
  hideError: () => {
    var errorMessageElement = document.getElementById("error-message")
  },
  getErrorMessage: (errorCode) => {
    let errorCodes = require('./errorcodes.json')

    let errorOutput
    if (errorCodes[errorCode] == undefined) {
      errorOutput = `An unknown error occured. (${errorCode})`
    }
    else {
      errorOutput = errorCodes[errorCode]
    }
    
    return errorOutput
  }
}
app.init();

//GENERAL
//show/hide password
const passwordField = document.getElementById("password-input")
const showPasswordBtn = document.getElementById("show-password")
if (passwordField != null && showPasswordBtn != null) {
  showPasswordBtn.onclick = () => {
    if (passwordField.type == "password") {
      passwordField.type = "text"
      showPasswordBtn.setAttribute("class", "fas fa-eye-slash")
    }
    else {
      passwordField.type = "password"
      showPasswordBtn.setAttribute("class", "fas fa-eye")
    }
  }
}