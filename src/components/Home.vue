<template>
  <br>
  <van-cell-group inset>
    <div style="height: 3.1cm; width: 50%;float: left;" @click="reGetOnline">
      <div style="font-size: 60pt;height:64pt;width: 100%;text-align: center">{{ onlinePlayers }}</div>
      <div style="width: 100%;text-align: center;color: #BBB;">当前在线玩家</div>
    </div>
    <div style="height: 3.1cm; width: 50%;float: right;" @click="reGetBan">
      <div style="width: 100%;text-align: center;">
        <div style="font-size: 60pt;height:64pt;">{{ monthlyBan }}</div>
      </div>
      <div :style="{'width': '100%','text-align': 'center','color': monthlyBanRank <= 10 || typeof(monthlyBanRank) != 'number' ? '#BBB' : '#F22'}">本月封禁No.{{ monthlyBanRank }}
      </div>
    </div>
  </van-cell-group>
  <van-cell-group v-for="(name, perm, index) in permName" :title="`${name}功能`" inset>
    <div v-for="func in functionList">
      <van-cell is-link v-if="perm == func.perm" @click="cellClickEvent(func)">
        <template #title>
          <span class="custom-title">{{ func.name }}&nbsp</span>
          <van-tag v-if="perm <= selfPerm" type="success">可用</van-tag>
          <van-tag v-else type="danger">禁用</van-tag>
        </template>
      </van-cell>
    </div>
  </van-cell-group>
</template>

<script>
import axios from 'axios';
import { showLoadingToast, showSuccessToast, showFailToast, showToast } from 'vant';
export default {
  data() {
    return {
      onlinePlayers: '--',
      monthlyBan: '--',
      monthlyBanRank: '--',
      functionList: [
        {
          name: '封禁玩家',
          perm: 1,
          router: 'Operation',
          args: {
            type: 'ban',
          }
        },
        {
          name: '踢出玩家',
          perm: 1,
          router: 'Operation',
          args: {
            type: 'kick',
          }
        },
        {
          name: '禁言玩家',
          perm: 1,
          router: 'Operation',
          args: {
            type: 'mute',
          }
        },
        {
          name: '运行指令',
          perm: 1,
          router: 'Command',
          args: {
            type: 'cmd',
          }
        },
        {
          name: '解除封禁',
          perm: 2,
          router: 'Operation',
          args: {
            type: 'unban',
          }
        },
        {
          name: '解除禁言',
          perm: 2,
          router: 'Operation',
          args: {
            type: 'unmute',
          }
        }
      ],
      permName: {
        1: '协管',
        2: '管理'
      },
      selfPerm: localStorage.getItem('selfPerm')
    }
  },
  methods: {
    cellClickEvent(data) {
      if (data.perm > this.selfPerm) {
        showFailToast('权限不足')
        return
      }
      this.$router.push(data.router + '/' + data.args.type)
      this.title = data.name
    },
    reGetOnline() {
      this.onlinePlayers = '--'
      axios.get(`http://43.140.209.93:5000/api/botcmd?auth=${localStorage.getItem('token')}&cmd=/online`).then(res => {
        // console.log(res.data.data);
        let t = res.data.data.result.split(':')
        this.onlinePlayers = t[t.length - 1]
        localStorage.setItem('onlinePlayers', this.onlinePlayers)
        localStorage.setItem('reGetTime', new Date().getTime())
      })
    },
    reGetBan() {
      this.monthlyBan = '--'
      this.monthlyBanRank = '--'
      axios.get(`http://43.140.209.93:5000/api/getRank?auth=${localStorage.getItem('token')}`).then(res => {
        let result = res.data.data.result
        console.log(result);
        let selfUid = localStorage.getItem('selfUid')
        this.monthlyBan = result[selfUid]
        let rank = 1
        for (let k in result) {
          if (result[k] > this.monthlyBan) rank++;
        }
        this.monthlyBanRank = rank
        localStorage.setItem('monthlyBan', this.monthlyBan)
        localStorage.setItem('monthlyBanRank', this.monthlyBanRank)
        localStorage.setItem('reGetTime', new Date().getTime())
      })
    }
  },
  mounted() {
    let r = localStorage.getItem('reGetTime')
    if (!r || new Date().getTime() - r > 1000 * 300) { // 五分钟自动刷新一次
      setTimeout(() => {
        this.reGetOnline()
      }, 2000)
      setTimeout(() => {
        this.reGetBan()
      }, 4000)
    }
    else {
      this.monthlyBan = localStorage.getItem('monthlyBan')
      this.monthlyBanRank = localStorage.getItem('monthlyBanRank')
      this.onlinePlayers = localStorage.getItem('onlinePlayers')
    }
  }
};
</script>