import Vue from 'vue'
import Vuex from 'vuex'
import transactions from './modules/transaction'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        transactions
    }
})