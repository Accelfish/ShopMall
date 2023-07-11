import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.scss';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {
    faStore,
    faMagnifyingGlass,
    faCartShopping,
    faEye,
    faEyeSlash,
    faTrash
} from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
library.add(faStore, faMagnifyingGlass, faCartShopping, faEye, faEyeSlash, faTrash);

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

