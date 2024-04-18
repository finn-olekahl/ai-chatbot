<template>
    <div class="chat-window">
      <div class="chat-header">
        <h2>Chat bot</h2>
        <p>I'm your online assistant.</p>
      </div>
      <div class="chat-messages">
        <ul>
          <li class="message" v-for="message in messages" :key="message.id">
            <div class="message-author">{{ message.author }}</div>
            <div class="message-content">{{ message.content }}</div>
          </li>
        </ul>
      </div>
      <div class="chat-input">
        <input type="text" v-model="message" @keyup.enter="sendMessage">
        <button @click="sendMessage">Senden</button>
      </div>
    </div>
  </template>
  
  <script>
export default {
  data() {
    return {
      messages: [],
      message: '',
    };
  },
  methods: {
    sendMessage() {
      if (this.message.trim() !== '') {
        this.messages.push({
          id: Date.now(),
          author: 'User',
          content: this.message.trim(),
        });
        this.message = '';

        // Simulate bot response
        setTimeout(() => {
          this.messages.push({
            id: Date.now(),
            author: 'Bot',
            content: 'Hello World',
          });
        }, 1000);
      }
    },
  },
};
</script>
  
  <style scoped>
  .chat-window {
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;
    padding: 10px;
  }
  
  .chat-header {
    text-align: center;
    margin-bottom: 10px;
  }
  
  .chat-messages {
    height: 300px;
    overflow-y: scroll;
    margin-bottom: 10px;
  }
  
  .message {
    margin-bottom: 5px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
  }
  
  .message-author {
    font-weight: bold;
  }
  
  .chat-input {
    display: flex;
    justify-content: space-between;
  }
  
  .chat-input input {
    flex-grow: 1;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .chat-input button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  