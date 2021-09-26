// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import { initializeApp } from "firebase/app"
const firebaseConfig = require("./secret/firebase-config.json")
initializeApp(firebaseConfig)

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.component('v-icon', Icon)
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
