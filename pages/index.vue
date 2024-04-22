<template>
    <div class="background"></div>
    <div class="body">
      <section class="container">
        <div class="chat-area">
          <header>
            <img id="avatar" alt="Avatar" src="../public/logo.webp">
            <div class="details">
              <span>BUGBOT Timo</span>
              <div id="status-wrapper">
                <div id="green-dot"></div>
                <p>Active</p>
              </div>
            </div>
            <a href="#password-popup" class="key-icon" id="key-open"><i class="fas fa-key"></i></a>
          </header>
          <div class="chat-box" id="chat-box">
            <div class="chat incoming typing-indicator" :id="typing_indicator_status">
              <div class="details">
                <div class="texting-div">
                  <div class="typing typing-1"></div>
                  <div class="typing typing-2"></div>
                  <div class="typing typing-3"></div>
                </div>
              </div>
            </div>
            <div v-for="message in messages">
              <div v-if="message.author == 'user'" class="chat outgoing">
                <div class="details">
                  <p>{{ message.content }}</p>
                </div>
              </div>
              <div v-else class="chat incoming">
                <div class="details">
                  <p>{{ message.content }}</p>
                </div>
              </div>
            </div>
          </div>
          <form action="#" class="typing-area" autocomplete="off">
            <input type="text" placeholder="Type something..." id="typing-input" v-model="message" @input="handleInput">
            <button id="send-message" :disabled="isButtonDisabled" @click="sendMessage"><i class="fas fa-location-arrow"></i></button>
          </form>
          <div class="error-message" id="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <perror id="error-message-text">This is an Error! Please change the text of this message according to which error occured.</perror>
          </div>
        </div>
      </section>
      <div id="password-popup" class="overlay">
        <section class="popup-container">
          <div class="popup">
            <header>
              <h2>Convo Key</h2>
              <a class="close" href="#" id="key-close"><i class="fas fa-times"></i></a>
            </header>
            <div class="content">
              <input v-model="chatId" id="convo-key" type="text" placeholder="Your key">
            </div>
            <a href="#" @click="loadSavedChat" class="submit" id="key-submit">Submit</a>
          </div>
        </section>
      </div>
    </div>
  </template>

<script>
import OpenAI from "openai";
const config = useRuntimeConfig();
const openai = new OpenAI({ apiKey: config.public.openAi.apiKey, dangerouslyAllowBrowser: true });
const thread = await openai.beta.threads.create();


const { saveChat, loadChat } = useChat();

export default {
  data() {
    return {
      messages: [
        { id: Date.now(), author: 'bot', content: 'Servus, ich bins der Timo 👋 Ich freue mich dir behilflich zu sein! Wie kann ich dir denn weiterhelfen?' }
      ],
      message: '',
      isButtonDisabled: true,
      typing_indicator_status: "disabled",
      assistantId: null,
      chatId: null,
    };
  },
  mounted() {
    this.fetchAssistantId();
  },
  methods: {
    async fetchAssistantId() {
      const response = await fetch('/api/openai');
      console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      this.assistantId = data.assistant.id;
    },
    async sendMessage(){
      const trimmedMessage = this.message.trim();
      if (trimmedMessage !== '') {
        this.messages.unshift({
          id: Date.now(),
          author: 'user',
          content: trimmedMessage,
        });
        this.message = '';
        this.isButtonDisabled = true;

        this.fetchResponse(trimmedMessage);
        this.chatId = await saveChat(this.messages, this.chatId);
      }
    },
    handleInput() {
      this.isButtonDisabled = !this.message.trim();
    },
    async fetchResponse(_message) {
      this.typing_indicator_status = "enabled"
      if (!this.assistantId) {
        console.error('Assistant ID is not set');
        return;
      }

      try {
        const message = await openai.beta.threads.messages.create(
          thread.id,
          {
            role: "user",
            content: _message,
          }
        );

        let run = await openai.beta.threads.runs.createAndPoll(
          thread.id,
          {
            assistant_id: this.assistantId,
          }
        );

        if (run.status === 'completed') {
          const messages = await openai.beta.threads.messages.list(
            run.thread_id
          );
          this.messages.unshift({
            id: Date.now(),
            author: 'bot',
            content: messages.data[0].content[0].text.value,
          });

          this.chatId = await saveChat(this.messages, this.chatId);
        } else {
          console.log(run.status);
        }
      } catch (error) {
        console.error('Failed to fetch response:', error);
      }
      this.typing_indicator_status = "disabled"
    },
    async loadSavedChat() {
      console.log('Loading chat with ID:', this.chatId);
      const savedChat = await loadChat(this.chatId);
      if (savedChat) {
        this.messages = savedChat;
      }
    }
  },
};
</script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    font-family: Poppins, sans-serif, FontAwesome;
  }

  /* || GENERAL STYLES */

  h1 {
    color: #2c2c2c;
    font-weight: 500;
    margin-left: 20px;
  }

  h2 {
    color: #2c2c2c;
    font-weight: 600;
  }

  .body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
  }

  ::placeholder {
    color: #777
  }

  /* || REUSABLE STYLES */

  .background {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0; bottom: 0; left: 0; right: 0;
    z-index: -2;
  }

  .background::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    background-image: url('../public/background.webp');
    background-size: cover;
    background-repeat: no-repeat;
    filter: blur(0.5vh) brightness(80%);
    transform: scale(1.2);
  }

  .error-message {
    display: flex;
    justify-content:left;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
    height: 35px;
    max-height: 0px;
    transition: all 0.4s ease-in-out;
    overflow: visible;
    opacity: 0;
  }

  .error-message i {
    color: red;
    font-size: 15px;
    margin-right: 15px;
  }

  .error-message perror {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: red;
  }

  .container {
    background: white;
    width: 450px;
    border-radius: 30px;
    box-shadow: 0 0 128px 0 rgba(0, 0, 0, 0.1), 0 32px 64px -48px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    transition: height 0.5s ease-in-out;
  }

  :is(.chat-box)::-webkit-scrollbar {
    width: 0;
  }

  .overlay {
  	position: absolute;
  	left: 0; 
    right: 0; 
    bottom: 0;
    top: 0;
    background: rgba(0,0,0,0.75);
  	transition: opacity 200ms;
    visibility: hidden;
  	opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .overlay:target {
    visibility: visible;
    opacity: 1;
  }

  .popup-container {
    background: white;
    width: 350px;
    border-radius: 30px;
    box-shadow: 0 0 128px 0 rgba(0, 0, 0, 0.1), 0 32px 64px -48px rgba(0, 0, 0, 0.5);
  }

  .popup header {
    display: flex;
    align-items: center;
    padding: 18px 25px;
  }

  .popup .content {
    background: #f0f0f0;
    padding: 15px;
    display: flex;
    justify-content: center;
  }

  .content input {
    width: 100%;
    height: 45px;
    font-size: 17px;
    border: 1px solid #ccc;
    border-radius: 10px;
    outline: none;
    padding: 0 15px;
  }

  .popup .submit {
    padding: 10px;
    display: flex;
    justify-content: center;
    color: #2c2c2c;
  }

  .popup .close {
    margin-left: auto;
    font-size: 20px;
    color: #2c2c2c;
  }

  /* || LOADING SCREEN */

  #loading{
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(16, 16, 16, 0.5);
    z-index: 9999;
  }

  @keyframes uil-ring-anim {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .uil-ring-css {
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 200px;
    height: 200px;
    transform: scale(0.7)
  }

  .uil-ring-css > div {
    position: absolute;
    display: block;
    width: 160px;
    height: 160px;
    top: 20px;
    left: 20px;
    border-radius: 50%;
    box-shadow: 0 6px 0 0 #fff;
    animation: uil-ring-anim 1s linear infinite;
  }

  /* || AUTH SYSTEM STYLES */

  .form {
    padding: 25px 30px;
  }

  .form header {
    font-size: 25px;
    font-weight: 600;
    padding-bottom: 15px;
    border-bottom: 1px solid #ccc;
  }

  .form form {
    margin: 30px 0;
  }

  .form form .name-details {
    display: flex;
  }

  form .name-details .field:first-child {
    margin-right: 10px;
  }

  form .name-details .field:last-child {
    margin-left: 10px;
  }

  .form form .field {
    display: flex;
    position: relative;
    flex-direction: column;
    margin-bottom: 10px;
  }

  .form form .g-recaptcha {
    margin: 20px 0;
    width: 100%;
  }

  .form form .field input {
    outline: none;
  }

  .form form .input input {
    height: 40px;
    width: 100%;
    font-size: 16px;
    padding: 0 16px;
    border: none;
    border-bottom: 1px solid #ccc;
    background: #f0f0f0;
    border-radius: 5px;
  }

  .form form .button input {
    margin-top: 15px;
    height: 45px;
    border: none;
    font-size: 17px;
    font-weight: 400;
    background: #2c2c2c;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }

  .form form .field i {
    width: 50px;
    text-align: center;
    position: absolute;
    right: 0;
    color: #777;
    top: 12px;
    cursor: pointer;
  }

  .form .link {
    text-align: center;
    margin: 10px 0;
    font-size: 17px;
  }

  .form .link a {
    color: #3d3d3d;
  }

  .form .link a:hover {
    text-decoration: underline;
  }

  /* || CHAT SYSTEM STYLES */

  .chat-area header {
    display: flex;
    align-items: center;
    padding: 18px 25px;
  }

  .chat-area header img {
    border-radius: 50%;
    width: 45px;
    height: 45px;
    margin-right: 20px;
  }

  .chat-area header span {
    font-size: 22px;
    font-weight: 500;
  }

  .chat-area header p {
    font-size: 15px;
  }

  .chat-area header .details {
    color: #2c2c2c;
  }

  .chat-area header .key-icon {
    margin-left: auto;
    width: 25px;
    border: none;
    outline: none;
    background: transparent;
    color: #2c2c2c;
    font-size: 20px;
    cursor: pointer;
  }

  .chat-box {
    display: flex;
    flex-direction: column-reverse;
    height: 500px;
    overflow-y: auto;
    background: #f0f0f0;
    padding: 10px 30px 20px 30px;
    box-shadow: inset 0 32px 32px -32px rgb(0 0 0 / 10%), inset 0 -32px 32px -32px rgb(0 0 0 / 10%);
  }

  .chat-box .chat {
    margin: 15px 0;
  }

  .chat-box .chat p {
    word-wrap: break-word;
    padding: 8px 16px;
    box-shadow: 0 0 32px rgb(0 0 0 / 8%), 0 16px 16px -16px rgb(0 0 0 / 10%);
  }

  .chat-box .chat .texting-div {
    word-wrap: break-word;
    border-radius: 25px 25px 25px 0px;
    padding-left: 15px !important;
    padding-right: 15px !important;
    box-shadow: 0 0 32px rgb(0 0 0 / 8%), 0 16px 16px -16px rgb(0 0 0 / 10%);
  }

  .chat-box .outgoing {
    display: flex; 
  }

  .outgoing .details {
    margin-left: auto;
    max-width: calc(100% - 130px);
  }

  .outgoing .details p {
    background: #2c2c2c;
    color: white;
    border-radius: 20px 20px 0 20px;
  }

  .chat-box .incoming {
    display: flex; 
  }

  .incoming .details {
    margin-right: auto;
    max-width: calc(100% - 130px);
  }

  .incoming .details p {
    background: white;
    color: #2c2c2c;
    border-radius: 25px 25px 25px 0;
  }

  .incoming .details > .texting-div {
    background: white;
    color: #2c2c2c;
    border-radius: 25px 25px 25px 0;
    padding: 10px;
  }

  .chat-area .typing-area {
    padding: 18px 18px;
    display: flex;
    justify-content: space-between;
  }

  .typing-area input {
    height: 45px;
    width: calc(100% - 55px);
    flex-grow: 1;
    font-size: 17px;
    border: none;
    background: #f0f0f0;
    border-radius: 25px;
    outline: none;
    padding: 0 15px;
  }

  .typing-area button {
  
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 7px;
    overflow: hidden;
    height: 45px;
    width: 45px;
    border: none;
    outline: none;
    background: #2c2c2c;
    color: white;
    border-radius: 50%;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0,.5,.5,1);
  }

  .typing-area button i {
    transition: all 0.2s cubic-bezier(0,.5,.5,1);
  }

  .typing-area button:disabled {
    margin-left: 0;
    width: 0;
    opacity: 0;
    background: black;
    color: black;
  }

  .typing-area button:disabled i {
    transform: scaleX(10%);
  }

  #status-wrapper {
    display: flex;
    align-items: center;
  }

  #green-dot {
    width: 10px;
    height: 10px;
    background-color: lightgreen;
    border-radius: 5px;
    margin-right: 10px;
  }

  .typing {
    display: inline-block;
    width: 0.6rem;
    height: 0.6rem;
    margin-right: 0rem;
    box-sizing: border-box;
    background: #ccc;
    border-radius: 50%;
  }

  .typing:not(:last-child) {
    margin-right: 4px;
  }

  .typing.typing-1 {
    animation: typing 2s infinite;
  }

  .typing.typing-2 {
    animation: typing 2s 300ms infinite;
  }

  .typing.typing-3 {
    animation: typing 2s 600ms infinite;
  }

  .typing-indicator {
    transition: all 0.2s cubic-bezier(0,.5,.5,1);
  }

  #disabled.typing-indicator {
    height: 0px !important;
    margin: 0px !important;
    opacity: 0 !important;
  }

  @keyframes typing {
  	0%, 75%, 100% {
  		transform: translate(0, 0.20rem) scale(0.7);
  		opacity: 0.5;
  	}
	
  	25% {
  		transform: translate(0, -0.20rem) scale(1);
  		opacity: 1;
  	}
  }

  </style>
  