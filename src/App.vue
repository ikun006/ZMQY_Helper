<template>
  <van-nav-bar :title="title" @click-left="toHomePage" @click-right="rePing">
    <template #left>
      <van-icon name="home-o" size="24" />
    </template>
    <template #right>
      <label :style="{'color': ping == -1 ? 'rgb(224,100,85)' : 'rgb(0,255,30)'}">{{ ping }} ms</label>
    </template>
  </van-nav-bar>
  <RouterView>

  </RouterView>
  <van-config-provider theme="dark"></van-config-provider>
  <van-tabbar v-model="active" @change="onTabberChange">
    <van-tabbar-item icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item icon="search">查询</van-tabbar-item>
    <van-tabbar-item icon="todo-list-o">记录</van-tabbar-item>

  </van-tabbar>
  <van-watermark opacity="0.1" :width="150" :full-page="true" :gap-x="10" :gap-y="66" :content="selfName + ' ' + selfUid" style="z-index: 1000;"/>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'
import { showLoadingToast, showSuccessToast, showFailToast, showToast } from 'vant';
export default {
  setup() {
    
    const active = ref(0);
    const router = useRouter()
    const pagesMap = ['/', '/Search', '/History'];
    const onTabberChange = (index) => {
      router.push(pagesMap[index]);
    }
    const toHomePage = () => {
      router.push('/');
    }
    return { active, onTabberChange, toHomePage };
  },
  mounted() {
    this.rePing()
  },
  data() {
    return {
      title: "逐梦启元 协管管理系统",
      selfName: localStorage.getItem('selfName'),
      selfUid: localStorage.getItem('selfUid'),
      ping: '-1',
      lastPing: (new Date()).valueOf()
    }
  },
  methods: {
    rePing(){
      let token = localStorage.getItem('token');
      if (! token){
        showFailToast('请先进行登录')
        return
      }
      this.lastPing = (new Date()).valueOf()
      showLoadingToast({
        message: '连接中...',
        forbidClick: true,
        duration: 0,
        overlay: true
      });
      axios.get(`http://43.140.209.93:5000/auth/check?auth=${token}`).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          localStorage.setItem('token', token)
          let permMap = {
            "player": 0,
            "spector": 0,
            "helper": 1,
            "developer": 2
          }
          localStorage.setItem('selfPerm', permMap[res.data.data.permission])
          localStorage.setItem('selfUid', res.data.data.uid)
          localStorage.setItem('selfName', res.data.data.name)
          showSuccessToast('连接正常');
          this.ping = Math.round((new Date().getTime() - this.lastPing) / 4)
        } else {
          showFailToast('连接失败')
          this.ping = -1
        }
      }).catch((e) => {
        showToast('失败: ' + e);
        this.ping = -1
      });
    }
  },
  name: 'App',
}
</script>
