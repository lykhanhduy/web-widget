// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import index from './store/index'
import moment from "moment";
import VueMomentJS from "vue-momentjs";

Vue.use(VueResource)
Vue.use(VueMomentJS, moment);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: index,
  router,
  components: { App },
  template: '<App/>'
})
