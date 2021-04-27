import Vue from 'vue';
import App from './App.vue';
import VueI18n from 'vue-i18n'
import './registerServiceWorker';

import { defaultLocale, languages } from './translations/index';
const messages = Object.assign(languages)

Vue.config.productionTip = false;

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || navigator.language.split('-')[0] || defaultLocale,
  fallbackLocale: 'en',
  messages
})

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
