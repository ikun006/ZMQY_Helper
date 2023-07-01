<template>
  <h2 style="margin: 10px;">登录页</h2>
  <van-cell-group inset>
    <van-field v-model="token" center clearable label="Token" placeholder="请粘贴您的Token">
      <template #button>
        <van-button size="small" type="primary" @click="login">验证登录</van-button>
      </template>
    </van-field>
  </van-cell-group>
  <br>
  <div style="color: gray;">您可以在“逐梦启元协管群”内联系管理员获得您的Token<br>
    请不要将您的Token给予任何人，它将可以代表你进行任何操作<br>
    <br>
    v1.0.5
  </div>
</template>

<script>
import { showLoadingToast, showSuccessToast, showFailToast, showToast } from 'vant';
import axios from 'axios'
export default {
  data() {
    return {
      token: undefined,
    }
  },
  methods: {
    login() {
      showLoadingToast({
        message: '校验中...',
        forbidClick: true,
        duration: 0,
        overlay: true
      });
      axios.get(`http://43.140.209.93:5000/auth/check?auth=${this.token}`).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          localStorage.setItem('token', this.token)
          let permMap = {
            "player": 0,
            "spector": 0,
            "helper": 1,
            "developer": 2
          }
          localStorage.setItem('selfPerm', permMap[res.data.data.permission])
          localStorage.setItem('selfUid', res.data.data.uid)
          localStorage.setItem('selfName', res.data.data.name)
          showSuccessToast('登录成功');
          this.$router.go(0)
        } else {
          showFailToast('校验失败')
        }
      }).catch((e) => {
        showToast('校验失败: ' + e);
      });
    }
  }
}
</script>