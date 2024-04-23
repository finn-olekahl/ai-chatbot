<template>
  <div class="header-wrapper-dashboard">
    <h1>Admin Dashboard</h1>
    <button class="signout-btn" @click="handleLogout">LOGOUT</button>
  </div>
  <div class="sub-header-wrapper-dashboard">
    <p>Account: <span>{{ user.providerData[0].email }}</span></p>
  </div>
  <div class="content-dashboard">
    <button @click="$router.push('/admin/dashboard/guidelines')">GUIDELINES</button>
    <button @click="$router.push('/admin/dashboard/settings')">SETTINGS</button>
    <button @click="$router.push('/admin/dashboard/support')">SUPPORT PANEL</button>
  </div>
  <div class="chat-window">
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
                <div v-else-if="message.author == 'forward'" class="chat forward">
                  <div class="details">
                    <p>Möchtest du mit dem Kundensupport verbunden werden?</p>
                    <button @click="forwardChat">Ja</button>
                    <button @click="sendNoForwardMessage">Nein</button>
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const user = useAuthUser();
const { logout } = useAuth();

const handleLogout = async () => {
  try {
      await logout();
      await navigateTo("/");
  } catch (error) {
      console.error(error);
  }
};

</script>

<style>
.header-wrapper-dashboard {
  display: flex;
  width: 100vw;
  height: 150px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.header-wrapper-dashboard > a {
  color: black;
}

.sub-header-wrapper-dashboard {
  display: flex;
  width: 100vw;
  height: 50px;
  transform: translateY(-40px);
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.header-wrapper-dashboard > h1 {
  font-size: 50px;
}

.sub-header-wrapper-dashboard > p {
  font-size: 14px !important;
  font-weight: 700;
  opacity: 0.6;
}

.sub-header-wrapper-dashboard > p > span {
  color: #007f51;
}

.header-wrapper-dashboard > .signout-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  background-color: #007f51;
  border: none;
  padding: 10px 30px;
  border-radius: 999px;
}

.header-wrapper-dashboard > h1 {
  position: relative;
}

.header-wrapper-dashboard > h1 > .goback-btn {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -50px;
  margin-top: auto;
  margin-bottom: auto;
  height: 30px;
  width: 30px;
  border-radius: 999px;
  border: none;
  background-color: rgb(175, 133, 255);
  transition: all 0.15s ease;
}

.header-wrapper-dashboard > h1 > .goback-btn:hover {
  transform: scale(1.1);
}

.header-wrapper-dashboard > h1 > .goback-btn:active:hover {
  transform: scale(1.0);
}

.header-wrapper-dashboard > h1 > .goback-btn > i {
  color: white
}

.content-dashboard {
  padding-top: 50px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-dashboard > button {
  width: 300px;
  color: white;
  background-color: black;
  border: none;
  padding: 10px 30px;
  border-radius: 999px;
}

.content-dashboard > button:not(:last-child) {
  margin-bottom: 20px;
}
</style>