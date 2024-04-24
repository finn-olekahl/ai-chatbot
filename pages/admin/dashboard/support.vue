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
                <div class="details" v-if="message.content.includes('https://storage.googleapis.com')">
                    <img :src="message.content" alt="">
                </div>
                <div v-else class="details">
                <p>{{ message.content }}</p>
                </div>
            </div>
            <div v-else class="chat outgoing">
                <div class="details" v-if="message.content.includes('https://storage.googleapis.com')">
                    <img :src="message.content" alt="">
                </div>
                <div v-else class="details">
                <p>{{ message.content }}</p>
                </div>
            </div>
            </div>
        </div>
        <form action="#" class="typing-area" autocomplete="off">
            <button type="button" id="add-image-btn" @click="triggerFileInput"><i class="fas fa-image"></i></button>
            <input type="file" ref="fileInput" style="display: none" @change="uploadFile" />
            <input :disabled="chatId == null" type="text" placeholder="Type something..." id="typing-input" v-model="message" @input="handleInput">
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
            <a href="#" @click="" class="submit" id="key-submit">Submit</a>
        </div>
        </section>
    </div>
    </div> 
</template>

<script lang="ts">
import '~/assets/css/support.css'
import type { Message } from '~/types';

definePageMeta({
    middleware: 'auth'
})

let eventSource: EventSource | null = null;
const { saveChat, loadChat } = useChat();
var fileInput: Ref<HTMLInputElement | null>;

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
    setup() {
        const fileInput: Ref<HTMLInputElement | null> = ref(null); // Declare the ref inside setup

        const triggerFileInput = () => {
            if (fileInput.value) {
                console.log('File input is accessed:', fileInput.value);
                fileInput.value.click();
            } else {
                console.error('The file input is not referenced correctly');
            }
        };

        return { fileInput, triggerFileInput };
    },
    methods: {
        handleInput() {
            this.isButtonDisabled = !this.message.trim();
        },
        async uploadFile(event: Event) {
            const input = event.target as HTMLInputElement;
            if (!input.files || input.files.length === 0) {
                alert("No file selected.");
                return;
            }

            const file = input.files[0];
            const formData = new FormData();
            formData.append("file", file);

            try {
                console.log("try")
                const response = await fetch('/api/support/upload_picture', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                console.log('File uploaded:', result.url);
                this.message = result.url as string;
                this.sendMessage()

            } catch (error) {
                console.error('Error uploading file:', error);
            }
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
            this.chatId = await saveChat(this.messages as Message[], this.chatId ?? undefined);
        },
        async getUnsolvedChats() {
            const response = await fetch('/api/support/get_forwarded');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            await data.forEach(async (id: string) => {
                const IdData: { chatlog: [], timestamp: string, id: string, forwarded?: boolean, forward_reason?: string } = await $fetch("/api/support/get_support", {
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
                this.loading = false;
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