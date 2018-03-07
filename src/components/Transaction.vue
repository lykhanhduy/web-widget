<template>
<div>
  <nav class="bg-primary fixed-top shadow padding-wrap clearfix">
    <div class="pull-left clearfix">
      <div class="icon icon-code inline-block"><img class="img-base" err-src="/static/img/ic_category_foodndrink.png" :src=userInfo.icon|getIconLinkFilter></div>
      <div class="inline-block padding-left-small">
        <div id="wallet-name" class="text-white-trans">{{userInfo.name}}</div>
        <div id="total-amount"><strong>{{walletBalance | amountDisplayFilter(userInfo.currency)}}</strong></div>
      </div>
    </div>
    <div class="fixed-top-right more-options" @click="createEmbedCode">
      <ul class="dropdown bg-white padding-top-bottom-small radius-small shadow-2">
        <li class="padding-wrap change-bg-gray"><a href="#">Options 1</a></li>
        <li class="padding-wrap change-bg-gray"><a href="#">Options 2</a></li>
      </ul>
    </div>
  </nav>
  <div id="smallState" class="container fixed-center text-center" v-show="currentWidth < 300">
    <img src="/static/img/ic_error.png" alt="">
    <p class="padding-wrap text-normal">Your iframe is so small</p>
  </div>
  <div id="loadingState" class="container fixed-center text-center" v-show="error&&pageLoading">
    <img src="/static/img/ic_loading.gif" alt="">
    <p class="padding-wrap text-normal">Loading data</p>
  </div>
  <div id="emptyState" class="container fixed-center text-center" v-show="!error && currentWidth > 300">
    <img src="/static/img/ic_error.png" alt="">
    <p class="padding-wrap text-normal">
      <span ng-if="!userInfo">
        Wallet/Event not found. <br />
        Please tell us your Wallet Id or Event Id. <br />
      </span>
      <span ng-if="userInfo">Transaction not found</span>
    </p>
  </div>

  <div id="share" class="modal container radius-small fixed-center bg-white padding-modal shadow-3" v-show="turnOn">
    <h2 class="title">Share</h2>
    <div class="form-group">
      <label> Embed into website: </label>
      <input class="form-control" :value="'wallet'+this.$route.params.id" disabled/>
      <button id="copyClipboardWebsite" class="btn btn-line btn-copy" data-clipboard-target="embedWebsite"><img src="https://placeholdit.imgix.net/~text?txtsize=5&txt=24%C3%9724&w=24&h=24&txtpad=1"></button>
    </div>

    <div class="form-inline margin-top-small">
      <span>Size: Width <input class="form-control margin-right-small margin-left-small" ng-model="embedWidth" value="260"/> Height <input id="embedWebsite" class="form-control margin-left-small"  ng-model="embedHeight" value= "260"/></span>
    </div>

    <hr class="margin-wrap">

    <div class="align-right margin-top-extra">
      <a class="text-income btn-close" @click="createEmbedCode">Close</a>
    </div>
  </div>

  <div id="work-space" class="content container" v-show="error && (transactionLists.length !== 0) && (currentWidth > 300) && !turnOn">
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
          <strong class="amount text-large pull-right bigAmount" :class="(group.totalAmount ) > 0 ? 'text-income' : 'text-expense'">   
            {{group.totalAmount | amountDisplayFilter(group.currency)}}
          </strong>
        </li>
        <li class="detail table-view-cell padding-wrap margin-wrap-minus change-bg-gray clearfix" v-for="tran in group.trans">
          <span class="pull-left">
            <span class="inline-block align-top">
              <img class="img-base" err-src="/static/img/ic_category_foodndrink.png" :src=tran.category.icon|getIconLinkFilter>
            </span>
            <span class="pull-right">
              <span class="amount block smallAmount " v-bind:class="tran.category.type == 1 ? 'text-income' : 'text-expense'">{{tran.amount | amountDisplayFilter(group.currency)}}</span>
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
    <span class="pull-left">Last update: {{currentTime}}</span>
    <span class="pull-right text-small">Powered by <img src="/static/img/img_logo_footer.png" class="align-middle" alt="logo footer" width="12px"> <a class="underline" href="//moneylover.me">Money Lover</a></span>

    <!-- <a href="#" class="btn pull-right">Get</a> -->
  </footer>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'HelloWorld',
  computed: mapGetters({
    transactionLists: 'allTransaction',
    walletBalance: 'walletBalance',
    turnOn: 'turnOn',
    currentWidth: 'currentWidth',
    pageLoading: 'pageLoading',
    currentTime: 'currentTime',
    userInfo: 'userInfo',
    currentWidth: 'currentWidth',
    error: 'error'
    
  }),
  methods: {
    ...mapActions([
      'getListTransaction',
      'getListSymbol',
      'getUserInfo'
    ]),
    dateTimeFilter: function(input, patern){
      return this.$moment(input).format(patern);
    },
    createEmbedCode: function() {
      this.$store.commit('toggle')
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
    // checkNegativeNumber: function(amount) {
    //   if (amount < 0) {
    //           return 2;
    //       } else {
    //           return 1;
    //       }
    // },
    amountDisplayFilter: function (amount, currency){
      if (!currency || !amount) return;
      var formatCurrency = currency.t === 0 ? '%s %v' : '%v %s';

      return accounting.formatMoney(amount, { symbol: currency.s, format: formatCurrency });
    }
  },
  created() {
    this.getListTransaction(this.$route.params.id)
    this.getListSymbol()
    this.getUserInfo(this.$route.params.id)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
