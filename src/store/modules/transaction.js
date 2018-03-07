import Vue from 'vue'
//initial state
const state = {
    error: true,
    userInfo: {},
    turnOn: false,
    walletBalance: 0,
    transactionLists: [],
    currencyList: [],
    currentWidth: window.innerWidth,
    moreThanOneCurrency: false,
    pageLoading: true,
    currentTime: moment(new Date()).format("DD/MM/YYYY - hh:mm")
}

//getter
const getters = {
    allTransaction: state => state.transactionLists,
    dateTimeFilter: function(input, patern){
        return moment(input).format(patern);
    },
    walletBalance: state => state.walletBalance,
    turnOn: state => state.turnOn,
    pageLoading: state => state.pageLoading,
    currentTime: state => state.currentTime,
    currentWidth: state => state.currentWidth,
    currencyList: state => state.currencyList,
    userInfo: state => state.userInfo,
    currentWidth: state=> state.currentWidth,
    error: state => state.error
}

//action
const actions = {
    getUserInfo({commit},id){
        return Vue.http.jsonp('https://api.moneylover.me/wallet/'+id)
            .then(res => {
                commit('getInfo',JSON.parse(JSON.parse(res.data)))
            })
            .catch((err)=>console.log(err));
    },
    getListTransaction({commit},id){
        return Vue.http.jsonp('https://api.moneylover.me/wallet/'+id+'/transaction/all?callback=JSON_CALLBACK')
            .then(res => {
                let transaction = JSON.parse(JSON.parse(res.data))
                commit('getAll', transaction.data.transactions)
                
            })
            .catch((error) => console.log(error));
    },
    getListSymbol({commit}){
        return Vue.http.get('/static/currency.json')
        .then(res => {
            commit('listSymbol',res)
        })
        .catch(err => console.log(err));
    }
}

//mutation
const mutations = {
    getAll: function(state, data) {
            var tempDate,
            list = [],
            cList = [],
            indexList = -1;
            data.forEach(value => {
                if (!value.category) return;
                var transactionDate = moment(value.displayDate).format('YYYY-MM-DD'),
                    currId = (value.account.currency_id - 1),
                    curr = state.currencyList[currId];
                if (!tempDate || transactionDate!==tempDate) {
                    list.push({displayDate: transactionDate, trans: [], totalAmount: 0, currency: curr });
                    cList.push(currId);
                    tempDate = transactionDate;
                    indexList += 1;
                }
                var amount = value.amount;
                if (value.category.type === 2) amount *= -1;
                list[indexList].totalAmount += amount;
                value.currency = state.currencyList[currId];
                list[indexList].trans.push(value);
            });
            var temp,
            stopForEach = false;
            cList.forEach( value => {
                if (!stopForEach) {
                    if (!temp) {
                        temp = value;
                    } else {
                        if (temp === value) {
                            state.moreThanOneCurrency = true;
                            stopForEach = true;
                        }
                    }
                }
            })
            state.transactionLists = list;
            var totalBalance = 0;
            state.transactionLists.forEach(value => {
                totalBalance += value.totalAmount;
            });
            state.walletBalance = totalBalance;
            state.pageLoading = false;
    },
    getInfo: function(state, data) {
            console.log(data)
            if(data.message == 'wallet_not_found'){
                state.error = false;
            }
            var currId = data.data.currency_id - 1;
            data.data.currency = state.currencyList[currId];
            state.userInfo = data.data;
    },
    listSymbol:  function (state, data) {
                    if (data.status === 200) {
                        state.currencyList = [];
                        data.body.data.forEach((value) => {
                            state.currencyList.push(value);
                        });
                    } else {
                        console.log('Get currency symbol failed');
                    }
    },
    toggle: function(state) {
        state.turnOn = !state.turnOn;
    }
}


export default {
    state,
    getters,
    actions,
    mutations
}