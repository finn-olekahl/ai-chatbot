<template>
    <div class="background"></div>
    <div class="body">
      <section class="container">
        <div class="chat-area">
          <header>
            <img v-if="forwarded" id="avatar" alt="Avatar" src="~/public/logo_support.png">
            <img v-else="forwarded" id="avatar" alt="Avatar" src="~/public/logo.webp">
            <div class="details">
              <span v-if="forwarded">BUGLAND Support</span>
              <span v-else="forwarded">BUGBOT Timo</span>
              <div id="status-wrapper">
                <div v-if="forwarded" id="purple-dot"></div>
                <div v-else="forwarded" id="green-dot"></div>
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
                <div class="details" v-if="message.content.includes('https://storage.googleapis.com')">
                  <img :src="message.content" alt="">
                </div>
                <div v-else class="details">
                  <p>{{ message.content }}</p>
                </div>
              </div>
              <div v-else-if="message.author == 'support'" class="chat support">
                <div class="details" v-if="message.content.includes('https://storage.googleapis.com')">
                  <img :src="message.content" alt="">
                </div>
                <div v-else class="details">
                  <p>{{ message.content }}</p>
                </div>
              </div>
              <div v-else-if="message.author == 'forward'" class="chat forward">
                  <div class="details">
                    <p>Möchtest du mit dem Kundensupport verbunden werden?</p>
                    <div class="buttons-wrapper">
                      <button class="green" @click="forwardChat">Ja</button>
                      <button class="red" @click="sendNoForwardMessage">Nein</button>
                    </div>
                  </div>
                </div>
              <div v-else class="chat incoming">
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
            <button v-if="forwarded" type="button" id="add-image-btn" @click="triggerFileInput"><i class="fas fa-image"></i></button>
            <input type="file" ref="fileInput" style="display: none" @change="uploadFile" accept="image/*"/>
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
import '~/assets/css/index.css'
import type { TextContentBlock } from 'openai/resources/beta/threads/messages.mjs';
import { ref } from 'vue';
import type { Message } from '~/types';
import OpenAI from "openai";
import type { Thread } from 'openai/resources/beta/index.mjs';
const config = useRuntimeConfig();
const openai = new OpenAI({ apiKey: config.public.openAi.apiKey, dangerouslyAllowBrowser: true });
let thread: Thread | null = null;
let reason: string | null = null;
let eventSource: EventSource | null = null;

const forwardRegex = /\s*\[\s*FORWARD_KUNDENSUPPORT\s*\]\s*/;


const { saveChat, saveUnsolvedChat, loadChat, forwardChat } = useChat();
var fileInput: Ref<HTMLInputElement | null>;

export default {
  head() {
    return {
      title: 'BUGLAND - Chatbot',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'BUGLAND Chatbot' },
      ],
    };
  },
  data(): {
    messages: Message[],
    message: string,
    isButtonDisabled: boolean,
    typing_indicator_status: string,
    assistantId: string | null,
    chatId: string | null,
    forwarded: boolean,
    timer: number,
    timerRef: number | null,
  } {
    return {
      messages: [
        { id: Date.now(), author: 'bot', content: 'Servus, ich bins der Timo 👋 Ich freue mich dir behilflich zu sein! Wie kann ich dir denn weiterhelfen?' }
      ],
      message: '',
      isButtonDisabled: true,
      typing_indicator_status: "disabled",
      assistantId: null,
      chatId: null,
      forwarded: false,
      timer: 2,
      timerRef: null
    };
  },
  mounted() {
    this.fetchAssistantId();
  },
  setup() {
    const fileInput: Ref<HTMLInputElement | null> = ref(null)

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
    async uploadFile(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) {
        alert("No file selected.");
        return;
      }

      const file = input.files[0];
      const formData = new FormData();
      formData.append("file", file);
      console.log(formData.values)

      try {
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

        if (!this.forwarded && !trimmedMessage.includes("https://storage.googleapis.com")) {
          this.fetchResponse(trimmedMessage);
        }

        this.chatId = await saveChat(this.messages as Message[], this.chatId ?? undefined);
        await $fetch('/api/support/set_user_last_typing', {
          method: 'POST',
          body: JSON.stringify({ id: this.chatId, reset: true})
        });
      }
    },
    async sendNoForwardMessage() {
      const noMessage = "Nein, will ich nicht.";

      this.messages.shift();
      this.messages.unshift({
          id: Date.now(),
          author: 'user',
          content: noMessage,
        });
        this.message = '';
        this.isButtonDisabled = true;

        this.fetchResponse(noMessage);
        this.chatId = await saveChat(this.messages, this.chatId ?? undefined);
    },
    async forwardChat() {
      const message = "Ok, ich leite den Support an einen unserer Mitarbeiter weiter. Bitte warten habe einen Moment geduld."

      this.messages.shift();
      this.messages.unshift({
          id: Date.now(),
          author: 'bot',
          content: message,
        });

        this.message = '';
        this.isButtonDisabled = true;

        this.chatId = await forwardChat(this.messages, this.chatId!, reason ?? 'No reason provided');
        this.forwarded = true;

        await this.startForwardStream();
    },
    async handleInput() {
      this.isButtonDisabled = !this.message.trim();
      console.log("teststststststts");
      await $fetch('/api/support/set_user_last_typing', {
        method: 'POST',
        body: JSON.stringify({ id: this.chatId })
      });
    },
    async fetchResponse(_message: string) {
      const threadId = thread != null ? thread.id : (thread = await openai.beta.threads.create()).id;
      this.typing_indicator_status = "enabled"
      if (!this.assistantId) {
        console.error('Assistant ID is not set');
        return;
      }

      try {
       await openai.beta.threads.messages.create(
        threadId,
          {
            role: "user",
            content: _message,
          }
        );

        let run = await openai.beta.threads.runs.createAndPoll(
          threadId,
          {
            assistant_id: this.assistantId,
          }
        );

        if (run.status === 'completed') {
          const messages = await openai.beta.threads.messages.list(
            run.thread_id
          );


          const cleanedMessage = this.checkForwardMessage((messages.data[0].content[0] as TextContentBlock).text.value);

          this.messages.unshift({
            id: Date.now(),
            author: 'bot',
            content: cleanedMessage ?? (messages.data[0].content[0] as TextContentBlock).text.value,
          });

          if (cleanedMessage) {
            this.sendForwardMessage();
          }

          this.chatId = await saveChat(this.messages, this.chatId ?? undefined);
        } else {
          console.log(run.status);
        }
      } catch (error) {
        console.error('Failed to fetch response:', error);
      }
      this.typing_indicator_status = "disabled"
    },
    checkForwardMessage(message: string) {
      console.log('Checking for forward message:', message);
      if (message.match(forwardRegex)) {
        reason = message.split(' [FORWARD_KUNDENSUPPORT] ')[1].trim();
        return message.split(' [FORWARD_KUNDENSUPPORT] ')[0].trim();
      }
      return null;
    },
    async sendForwardMessage() {
      if (!reason) return;

      this.messages.unshift({
          id: Date.now(),
          author: 'forward',
          content: 'FORWARD_KUNDENSUPPORT',
      });

      await saveUnsolvedChat(this.messages, this.chatId!, reason);
    },
    async loadSavedChat() {
      console.log('Loading chat with ID:', this.chatId);
      if (this.chatId == null) return;
      const savedChat = await loadChat(this.chatId);
      if (saveChat == null) return;
      
      if (eventSource != null) {
        (eventSource as EventSource).close();
      }

      if ((savedChat as {chatlog: [], forwarded: boolean }).chatlog) {
        this.messages = (savedChat as {chatlog: [], forwarded: boolean }).chatlog;
        this.forwarded = (savedChat as {chatlog: [], forwarded: boolean}).forwarded ?? false;
        await this.startForwardStream();
      }
    },
    async startForwardStream() {
      eventSource = new EventSource(`/api/support/${this.chatId}`);
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (this.messages.length + 1 == (data as { chatlog: [] }).chatlog.length) {
          this.typing_indicator_status = "disabled"
        }
        this.messages = (data as {chatlog: []}).chatlog;
        this.typing_indicator_status = this.calculateTimeDifferenceInSeconds(data.support_last_typing) <= 5 ? "enabled" : "disabled"
        this.resetCounter(async () => {
          this.typing_indicator_status = "disabled"
          await $fetch('/api/support/set_user_last_typing', {
            method: 'POST',
            body: JSON.stringify({ id: this.chatId, reset: true })
          });
        })
      }
    },
    calculateTimeDifferenceInSeconds(msString: string): number {
      const pastTime = parseInt(msString, 10);
      const currentTime = Date.now();
      const difference = currentTime - pastTime;
      const differenceInSeconds = difference / 1000;
      return differenceInSeconds;
    },
    resetCounter(callback: () => Promise<void>) {
      // Clears any existing timer
      if (this.timerRef) {
        clearTimeout(this.timerRef);
      }

      // Resets the timer to 5 seconds
      this.timer = 2;

      const countDown = () => {
        if (this.timer > 0) {
          this.timer--;
          this.timerRef = setTimeout(countDown, 1000) as unknown as number;
        } else {
          callback(); // Execute the callback function when timer reaches 0
        }
      };

      // Start the countdown
      this.timerRef = setTimeout(countDown, 1000) as unknown as number;
    },
  },
  unmounted() {
    if (this.timerRef) {
      clearTimeout(this.timerRef);
    }
  },
};
</script>