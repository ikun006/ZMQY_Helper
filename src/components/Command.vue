<template>
  <h2 style="margin: 10px;">{{ $route.params.type }}</h2>
  <van-cell-group inset>
    <van-field v-model="command" rows="1" autosize label="开发指令" type="textarea" placeholder="请输入开发指令"
      @update:model-value="cmdModelValueChanged" />
  </van-cell-group>
  <div style="margin: 16px;">
    <van-button block type="primary" v-bind:loading="isSubmiting" loading-text="等待服务器响应..."
      @click="submit">提交</van-button>
  </div>
</template>
<script>
import { ref } from 'vue';
import { showLoadingToast, showSuccessToast, showFailToast, showToast, showDialog } from 'vant';
import axios from 'axios'
export default {
  data() {
    return {
      command: new String(),
      isSubmiting: false
    }
  },
  methods: {
    cmdModelValueChanged(text) {
      if (text.indexOf('\n') != -1) {
        setTimeout(() => { this.command = this.command.replace('\n', '') }, 0);
        this.submit()
      }
    },
    submit() {
      this.isSubmiting = true;
      axios.get(`http://43.140.209.93:5000/api/botcmd?auth=${localStorage.getItem('token')}&cmd=${this.command}`).then((res) => {
        console.log(res.data);
        this.isSubmiting = false;
        if (res.data.data.result) {
          showDialog({
            title: res.data.code == 0 ? '执行成功' : '执行失败',
            message: res.data.data.result == '1' || res.data.data.result == 1 ? '操作成功' : res.data.data.result,
            theme: 'round-button',
          });
          if (res.data.code == 0) {
            this.playerNameOrUid = ''
          }
        }else{
          showDialog({
            title: '执行失败',
            message: '服务器无返回\n请使用/help查询后再试',
            theme: 'round-button',
          });
        }
      }).catch((e) => {
        showDialog({
          title: '操作失败',
          message: '服务器返回: ' + e,
          theme: 'round-button',
        });
        this.isSubmiting = false;
      });
    }
  }
}
</script>