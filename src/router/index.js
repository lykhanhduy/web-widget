import Vue from 'vue'
import Router from 'vue-router'
import Transaction from '@/components/Transaction'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/wallet/:id',
      name: 'Transaction',
      component: Transaction
    },
    {
      path: '/',
      redirect: '/wallet/3AF29F712CCA47D284AA4C3BC75203FA/'
    },
    {
      path: '*',
      redirect: '/wallet/3AF29F712CCA47D284AA4C3BC75203FA/'
    }
  ]
})
