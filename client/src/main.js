import { createApp } from 'vue'
import store from './store/store'
import App from './App.vue'
import router from "./router/router"

createApp(App)
    .use(store)
    .use(router)
    .mount('#app')
