//SETUP API(S)
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

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

//#region references/general variables
//general parameters
var messageCooldown_ms = 5000
var maxMessagesPerMinute = 10
//general
var chatBox = document.getElementById("chat-box")
//avatar
var avatar = document.getElementById("avatar")
//key
var keyField = document.getElementById("convo-key")
var keySubmit = document.getElementById("key-submit")
var keyOpen = document.getElementById("key-open")
var keyCancel = document.getElementById("key-close")
//typing
var typingInput = document.getElementById("typing-input")
var sendMessageBtn = document.getElementById("send-message")
var typingErrorMessage = document.getElementById("error-message")
//auth page
var authHeader = document.getElementById("auth-header")
//firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase()
//#endregion

//#region SETUP/GENERAL/REUSABLE
//always scroll down
chatBox.scrollTo(0,document.body.scrollHeight);

//key management
keySubmit.onclick = function submitKey() {
  console.log("Key Updated")
}
var keyPre = "";
keyOpen.onclick = function keyBefore() {
  keyPre = keyField.value
  console.log("saved key")
}
keyCancel.onclick = function resetKey() {
  keyField.value = keyPre
  console.log(keyField.value)
}

//avatar management
var seed = "Tim Urbutt"
avatar.src = `https://avatars.dicebear.com/api/initials/${seed}.svg`;

//errormessagehandler
function ShowErrorMessage(errorMessageElement, errorMessage) {
  //set error message
  errorMessageElement.getElementsByTagName('perror')[0].innerText = errorMessage
  errorMessageElement.style.marginBottom = "17px"
  errorMessageElement.style.opacity = 1
  errorMessageElement.style.maxHeight = "30px";
  
  setTimeout(() => { HideErrorMessage(errorMessageElement) }, 4000)
}
function HideErrorMessage(errorMessageElement) {
  errorMessageElement.style.opacity = 0
  errorMessageElement.style.marginBottom = 0
  errorMessageElement.style.marginTop = 0
  errorMessageElement.style.maxHeight = 0
}

//typing input management
//disable first
sendMessageBtn.disabled = true
var ti_event = function (e) {
  const value = e.currentTarget.value
  sendMessageBtn.disabled = false
  HideErrorMessage(typingErrorMessage)

  if (value == "") {
    sendMessageBtn.disabled = true
  }
}
typingInput.addEventListener("input", ti_event);
//#endregion

//#region FIREBASE
//firebase realtime database
//sending and receiving messages
sendMessageBtn.onclick = function SendMessage() {
  //only send if input contains message
  if (typingInput.value != "") {
    //Get Message + clear typingInput
    var message = typingInput.value
    typingInput.value = ""
    sendMessageBtn.disabled = true

    //sendmessage 
    set(ref(database, "chatMessages/debugChat/testmessage/"), {
      sentBy: "admin",
      messageDate: "testDate",
      message: message
    })
  }
}
//#endregion