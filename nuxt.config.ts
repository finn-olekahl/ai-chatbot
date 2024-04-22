// https://nuxt.com/docs/api/configuration/nuxt-config
const ONE_DAY = 60 * 60 * 24 * 1000;
const ONE_WEEK = ONE_DAY * 7;

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'stylesheet', type:"text/css", href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' }
      ],
    }
  },
  devtools: { enabled: true },
  routeRules: {
    '/admin': { redirect: '/admin/dashboard'},
    '/': { ssr: false }
  },
  runtimeConfig: {

    // private config
    firebaseadmin: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, "\n"),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    },

    // public config
    public: {
      authCookieName: "__session",
      authCookieExpires: parseInt(ONE_WEEK.toString(), 10),
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      },
      openAi: {
      apiKey: process.env.OPENAI_API_KEY
    },
    },
  },
})
