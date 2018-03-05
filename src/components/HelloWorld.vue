<template>
<div>
  <nav class="bg-primary fixed-top shadow padding-wrap clearfix">
    <div class="pull-left clearfix">
      <div class="icon icon-code inline-block"><img class="img-base" err-src="/static/img/ic_category_foodndrink.png" src="//static.moneylover.me/img/icon/icon_94.png"></div>
      <div class="inline-block padding-left-small">
        <div id="wallet-name" class="text-white-trans">Tài khoản ngân hàng</div>
        <div id="total-amount"><strong>-38,222,300.00 ₫</strong></div>
      </div>
    </div>
    <div class="fixed-top-right more-options" ng-click="createEmbedCode()">
      <ul class="dropdown bg-white padding-top-bottom-small radius-small shadow-2">
        <li class="padding-wrap change-bg-gray"><a href="#">Options 1</a></li>
        <li class="padding-wrap change-bg-gray"><a href="#">Options 2</a></li>
      </ul>
    </div>
  </nav>
  <div id="smallState" class="container fixed-center text-center" ng-show="currentWidth < 300">
    <img src="/static/img/ic_error.png" alt="">
    <p class="padding-wrap text-normal">Your iframe is so small</p>
  </div>
  <div id="loadingState" class="container fixed-center text-center" ng-show="pageLoading && (currentWidth > 300)">
    <img src="/static/img/ic_loading.gif" alt="">
    <p class="padding-wrap text-normal">Loading data</p>
  </div>
  <div id="emptyState" class="container fixed-center text-center" ng-show="(transactionLists.length === 0 ) && !pageLoading && (currentWidth > 300)">
    <img src="/static/img/ic_error.png" alt="">
    <p class="padding-wrap text-normal">
      <span ng-if="!userInfo">
        Wallet/Event not found. <br />
        Please tell us your Wallet Id or Event Id. <br />
      </span>
      <span ng-if="userInfo">Transaction not found</span>
    </p>
  </div>

  <div id="share" class="modal container radius-small fixed-center bg-white padding-modal shadow-3" ng-show="turnOn">
    <h2 class="title">Share</h2>
    <div class="form-group">
      <label> Embed into website: </label>
      <input class="form-control" ng-value="embedCode" disabled/>
      <button id="copyClipboardWebsite" class="btn btn-line btn-copy" data-clipboard-target="embedWebsite"><img src="https://placeholdit.imgix.net/~text?txtsize=5&txt=24%C3%9724&w=24&h=24&txtpad=1"></button>
    </div>

    <div class="form-inline margin-top-small">
      <span>Size: Width <input class="form-control margin-right-small margin-left-small" ng-model="embedWidth" ng-init="embedWidth = 260"/> Height <input id="embedWebsite" class="form-control margin-left-small"  ng-model="embedHeight" ng-init="embedHeight = 260"/></span>
    </div>

    <hr class="margin-wrap">

    <div class="align-right margin-top-extra">
      <a class="text-income btn-close" ng-click="turnOn = false">Close</a>
    </div>
  </div>

  <div id="work-space" class="content container" ng-hide="(transactionLists.length === 0) && (minWidth < 300) || turnOn">
    <div class="card radius-small bg-white shadow padding-wrap margin-wrap" v-for="group in transactionLists">
      <ul class="table-view clearfix" ng-model="displayDate">
        <li class="table-view-cell padding-top-bottom-small border-bottom clearfix">
            <span class="date-time pull-left">
              <span class="date text-extra pull-left">{{dateTimeFilter(group.displayDate,"DD")}}</span>
              <span class="pull-left padding-left-small">
                <span class="day block text-small">{{dateTimeFilter(group.displayDate,"dddd")}}</span>
                <span class="month-year text-small text-dark-trans">{{dateTimeFilter(group.displayDate,"MMM. YYYY")}}</span>
              </span>
            </span>
          <strong class="amount text-large pull-right bigAmount text-expense" :class="(group.totalAmount | checkNegativeNumber) === 1 ? 'text-income' : 'text-expense'">   
            {{group.totalAmount | amountDisplayFilter(group.totalAmount,group.currency,(group.totalAmount | checkNegativeNumber))}}
          </strong>
        </li>
        <li class="detail table-view-cell padding-wrap margin-wrap-minus change-bg-gray clearfix" v-for="tran in group.trans">
          <span class="pull-left">
            <span class="inline-block align-top">
              <img class="img-base" err-src="/static/img/ic_category_foodndrink.png" :src=tran.category.icon|getIconLinkFilter>
            </span>
            <span class="pull-right">
              <span class="amount block smallAmount text-expense" ng-class="tran.category.type == 1 ? 'text-expense' : 'text-income'">{{tran.amount | amountDisplayFilter(tran.amount,tran.currency,tran.category.type)}}</span>
              <!-- <span class="note-amount block text-dark-trans">0</span> -->
            </span>
            <span class="inline-block padding-left-large">
              <span class="name block">{{tran.category.name}}</span>
              <span class="note text-small text-dark-trans block make-text-fit">{{tran.note}}</span>
            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <footer class="bar-footer fixed-bottom padding-wrap bg-gray border-top align-center">
    <span class="pull-left">Last update: </span>
    <span class="pull-right text-small">Powered by <img src="/static/img/img_logo_footer.png" class="align-middle" alt="logo footer" width="12px"> <a class="underline" href="//moneylover.me">Money Lover</a></span>

    <!-- <a href="#" class="btn pull-right">Get</a> -->
  </footer>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  watch: {
    listTransaction: this.getListTransaction
  },
  methods: {
    getTransactionResult: function(data) {
      var tempDate,
          list = [],
          cList = [],
          indexList = -1;
      data.forEach(value => {
        if (!value.category) return;
          var transactionDate = this.$moment(value.displayDate).format('YYYY-MM-DD'),
              currId = (value.account.currency_id - 1),
              curr = this.currencyList[currId];

          if (!tempDate || transactionDate!==tempDate) {
              list.push({displayDate: transactionDate, trans: [], totalAmount: 0, currency: curr });
              cList.push(currId);
              tempDate = transactionDate;
              indexList += 1;
          }

          var amount = value.amount;

          if (value.category.type === 2) amount *= -1;
          list[indexList].totalAmount += amount;
          value.currency = this.currencyList[currId];
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
                    this.moreThanOneCurrency = true;
                    stopForEach = true;
                }
            }
        }
      })
      this.transactionLists = list;
      this.calBalance();
    },
    calBalance: function() {
      var totalBalance = 0;
      this.transactionLists.forEach(value => {
          totalBalance += value.totalAmount;
      });

      this.walletBalance = totalBalance;
    },
    getSymbol:  function (callback) {
                  $http.get('currency.json')
                      .success(function (data, status) {
                          if (status === 200) {

                              this.currencyList = [];

                              data.data.forEach((value) => {
                                  this.currencyList.push(value);
                              });
                              callback();
                          } else {
                              callback('Get currency symbol failed');
                          }
                      })
                      .error(function () {
                          callback('Fail on get currency symbol.');
                      });
                },
    dateTimeFilter: function(input, patern){
      return this.$moment(input).format(patern);
    }
  },
  data () {
    return {
      currencyList: [],
      transactionLists: [],
      moreThanOneCurrency: false,
      walletBalance: 0
    }
  },
  filters: {
    getIconLinkFilter: function(imgName) {
      if(!imgName) return '';
      imgName = imgName.replace(/.png/i, '').replace(/icon\//i, '');

      if (imgName.indexOf("provider") != -1) {
          var number = imgName.replace(/\/provider\//i, '');
          return ('https://d3938q3vi00zd9.cloudfront.net/provider_'+number+'-logo.png');
      }

      return ('//static.moneylover.me' + '/img/icon/' + imgName + '.png');
    },
    checkNegativeNumber: function(amount) {
      if (amount < 0) {
              return 2;
          } else {
              return 1;
          }
    },
    amountDisplayFilter: function (amount, currency, type){
      if (!currency || !amount) return;

      var formatCurrency = currency.t === 0 ? '%s %v' : '%v %s';

      return accounting.formatMoney(amount, { symbol: currency.s, format: formatCurrency });
    }
  },
  created() {
    this.$http.jsonp('https://api.moneylover.me/wallet/7b259e3416394275ac4c87142f79ba7b/transaction/all?callback=JSON_CALLBACK')
      .then(res => {
        let transactions = JSON.parse(JSON.parse(res.data));
        this.getTransactionResult(transactions.data.transactions)
        // console.log(transactions)
        // console.log(this.transactionLists)
      },err => console.log(err))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
