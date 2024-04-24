<template>
    <div class="side-menu">
        <h1>Open Conversations</h1>
        <div class="spacer"></div>
        <div class="conversations-container">
            <div v-for="data in chats" class="conversation-element">
                <div v-if="loading" class="deactivated-overlay"></div>
                <div @click="onClickChat(data.id)">
                    <h2>{{ data.forward_reason }}</h2>
                    <p>last updated: {{ calculateTimeDifference(data.timestamp) }}</p>
                    <p>ID: {{ data.id }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="background"></div>
    <div class="header-wrapper-dashboard">
        <div class="white-bg-title"></div>
        <h1><button class="goback-btn" @click="$router.push('/admin/dashboard')"><i class="fas fa-arrow-left"></i></button>Support</h1>
    </div>
    <div class="body">
    <section class="container">
        <div class="chat-area">
        <header>
            <div class="details">
            <span>Reason</span>
            </div>
        </header>
        <div class="chat-box" id="chat-box">
            <img v-if="loading" src="../../../public/loading-indicator.gif" alt="">
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
            <div v-if="message.author == 'user'" class="chat incoming">
                <div class="details">
                <p>{{ message.content }}</p>
                </div>
            </div>
            <div v-else class="chat outgoing">
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

<script lang="ts">
import type { Timestamp } from 'firebase-admin/firestore';
import { serverTimestamp } from 'firebase/firestore';
import type { Message } from '~/types';

definePageMeta({
    middleware: 'auth'
})

let eventSource: EventSource | null = null;
const { saveChat, saveUnsolvedChat, loadChat, forwardChat } = useChat();

export default {
    data(): {
        messages: Message[],
        message: string,
        isButtonDisabled: boolean,
        typing_indicator_status: string,
        assistantId: string | null,
        chatId: string | null,
        forwarded: boolean,
        chats: { chatlog: [], forwarded?: boolean, forward_reason?: string, timestamp: string, id: string }[],
        loading: boolean,
        forward_reason: string
  }{
        return {
            messages: [],
            message: '',
            isButtonDisabled: true,
            typing_indicator_status: "disabled",
            assistantId: null,
            chatId: null,
            forwarded: false,
            chats: [],
            loading: false,
            forward_reason: ""
        };
    },
    mounted() {
        this.getUnsolvedChats()
    },
    methods: {
        handleInput() {
            this.isButtonDisabled = !this.message.trim();
        },
        async sendMessage() {
            const trimmedMessage = this.message.trim();
            if (trimmedMessage !== '') {
                this.messages.unshift({
                    id: Date.now(),
                    author: 'support',
                    content: trimmedMessage,
                });
                this.message = '';
                this.isButtonDisabled = true;
            }
            this.chatId = await saveChat(this.messages as Message[], this.chatId ?? undefined, this.forwarded, this.forward_reason);
        },
        async getUnsolvedChats() {
            const response = await fetch('/api/support/get_forwarded');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            await data.forEach(async (id: string) => {
                const IdData: { chatlog: [], timestamp: string, id: string, forwarded?: boolean, forward_reason?: string } = await $fetch("/api/db/get_support", {
                    method: "POST",
                    body: JSON.stringify({ id: id }),
                });

                IdData.id = id;

                console.log(IdData);
                this.chats.push(IdData)
            });
        },
        calculateTimeDifference(dateString: string): string {
            const pastDate = new Date(dateString);
            const currentDate = new Date();
            const difference = currentDate.getTime() - pastDate.getTime(); // difference in milliseconds

            const minutes = Math.floor(difference / 60000);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (minutes < 60) {
                return `${minutes} minutes`;
            } else if (hours < 24) {
                return `${hours} hours`;
            } else {
                return `${days} days`;
            }
        },
        async onClickChat(id: string) {
            this.loading = true
            this.chatId = id;
            if (eventSource != null) {
                eventSource.close()
            }
            const loadedChat = await loadChat(this.chatId);
            if ((loadedChat as { chatlog: [], forwarded: boolean, forward_reason: string }).chatlog) {
                this.messages = (loadedChat as { chatlog: [], forwarded: boolean, forward_reason: string }).chatlog;
                this.forwarded = (loadedChat as { chatlog: [], forwarded: boolean, forward_reason: string }).forwarded ?? false;
                this.forward_reason = (loadedChat as { chatlog: [], forwarded: boolean, forward_reason: string }).forward_reason ?? "";
                this.startForwardStream();
            }
        },
        async startForwardStream() {
            eventSource = new EventSource(`/api/support/${this.chatId}`);
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.messages = (data as { chatlog: [] }).chatlog;
                this.loading = false;
            }
        },
    }
}
</script>

<style>
 @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    font-family: Poppins, sans-serif, FontAwesome;
  }

  .white-bg-title {
    background-color: white;
    position: absolute;
    height: 100px;
    width: 450px;
    border-radius: 30px;
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
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    top: 0;
    bottom: 0;
    margin-top: auto;
    margin-bottom: auto;
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
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('~/public/background-support.webp');
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
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    height: 500px;
    overflow-y: auto;
    background: #f0f0f0;
    padding: 10px 30px 20px 30px;
    box-shadow: inset 0 32px 32px -32px rgb(0 0 0 / 10%), inset 0 -32px 32px -32px rgb(0 0 0 / 10%);
  }

  .chat-box > img {
    height: 30px;
    width: 30px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: auto;
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

  #purple-dot {
    width: 10px;
    height: 10px;
    background-color: purple;
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

  .side-menu {
    position: absolute;
    background-color: white;
    top: 0;
    bottom: 0;
    left: 0;
    right: calc(100vw - 500px);
    box-shadow: 0 0 100px 0 rgba(0, 0, 0, 0.3);
    z-index: 100;
  }

  .side-menu > h1 {
    width: 500px;
    text-align: center;
    margin: 0;
    margin-top: 20px;
    padding: 0;
    font-weight: 600;
  }

  .side-menu > .spacer {
    margin-top: 17px;
    height: 4px;
    width: 500px;
    background-color: #007f5075;
  }

  .side-menu > .conversations-container {
    padding: 30px;
    width: 500px;
    display: flex;
    flex-direction: column;
  }

  .conversation-element {
    position: relative;
    padding: 10px 20px;
    border-radius: 20px;
    overflow: hidden;;
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.25);
    transition: all 0.2s ease;
  }

  .conversation-element:not(:last-child) {
    margin-bottom: 20px;
  }

  .conversation-element:hover:not(:has(.deactivated-overlay)) {
    transform: scale(1.04);
  }

  .conversation-element:active:hover:not(:has(.deactivated-overlay))  {
    transform: scale(1.0);
  }

  .conversation-element > div > h2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1; 
    -webkit-box-orient: vertical;
  }

  .deactivated-overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(199, 199, 199, 0.731);
    z-index: 999;
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