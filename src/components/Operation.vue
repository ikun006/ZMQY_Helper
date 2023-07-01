<template>
  <h2 style="margin: 10px;">{{ $route.params.type }}</h2>
  <van-cell-group inset>
    <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect">
      <template #reference>
        <van-field v-model="playerNameOrUid" label="违规玩家" placeholder="玩家的昵称或UID"
          @update:model-value="nameModelValueChanged" />
      </template>
    </van-popover>
  </van-cell-group>
  <van-cell-group inset title="选填">
    <!-- <van-field v-model="durationSec" label="操作时长" placeholder="单位：秒，-1代表永久[-1]" /> -->
    <!-- <van-cell is-link title="操作时长" :value="durationText" @click="onShowDurationActionSheet" /> -->
    <!-- <van-action-sheet v-model:show="showDurationActionSheet" :actions="timeActionSheets" @select="onActionSheetSelect" -->
    <!-- close-on-click-action /> -->
    <!-- <van-field v-model="reasonText" label="操作原因" placeholder="游戏内反馈给该玩家的文字[作弊]" /> -->
    <van-cell :value="fieldValue" is-link readonly title="操作时长" @click="showPicker = true" />
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
    </van-popup>
    <van-cell is-link title="操作原因" :value="reasonText" @click="showReasonActionSheet = true" />
    <van-action-sheet v-model:show="showReasonActionSheet" :actions="reasonActionSheets" @select="onActionSheetSelect"
      close-on-click-action />
    <van-field v-model="extraInfo" label="备注信息" placeholder="给任何人公示此信息" />
    <van-field v-model="videoLink" label="视频证据" placeholder="证据链接，任意渠道均可" />
  </van-cell-group>
  <div style="margin: 16px;">
    <van-button block type="primary" v-bind:loading="isSubmiting" loading-text="等待服务器响应..."
      @click="submit">提交</van-button>
  </div>
  <!-- <van-cell-group inset>

  </van-cell-group> -->
</template>

<script>
import { ref } from 'vue';
import { showLoadingToast, showSuccessToast, showFailToast, showToast, showDialog } from 'vant';
import axios from 'axios'

export default {
  setup() { },
  data() {
    const fieldValue = '永久';
    const columns = [
      [{ text: '永久', value: -1 }], //天
      [], //小时
      [], //分钟
    ]
    for (let i = 0; i < 30; i++) {
      columns[0].push({ text: i.toString() + '天', value: i })
    }
    for (let i = 0; i < 24; i++) {
      columns[1].push({ text: i.toString() + '小时', value: i })
    }
    for (let i = 0; i < 60; i++) {
      columns[2].push({ text: i.toString() + '分钟', value: i })
    }
    return {
      showPopover: false,
      showDurationActionSheet: false,
      showReasonActionSheet: false,
      actions: [],
      isSubmiting: false,
      playerNameOrUid: null,
      durationSec: -1,
      durationText: '永久',
      reasonText: '游戏作弊',
      videoLink: null,
      extraInfo: null,
      showPicker: false,
      fieldValue: fieldValue,
      columns: columns,
      timeActionSheets: [
        {
          name: '永久',
          value: -1
        },
        {
          name: '一天',
          value: 60 * 60 * 24 * 1
        },
        {
          name: '三天',
          value: 60 * 60 * 24 * 3
        },
        {
          name: '一周',
          value: 60 * 60 * 24 * 7
        },
        {
          name: '10秒(测试用)',
          value: 10
        },
      ],
      reasonActionSheets: [
        { name: '攻击类[杀戮/碰撞箱/长臂猿]', value: '非法攻击行为' },
        { name: '移动类[飞行/踏空/高跳/加速]', value: '非法移动行为' },
        { name: '语言类[人身攻击/黄赌毒/卖挂]', value: '言论违法违规' },
        { name: '其他类[线下RMB交易/恶意利用Bug]', value: '涉嫌违规行为' },
        { name: '测试', value: '这是一次测试' }
      ]
    }
  },
  mounted() {

  },
  methods: {
    onConfirm({ selectedOptions }) {
      this.showPicker = false;
      let text = ''
      for (let i = 0; i < selectedOptions.length; i++) {
        const element = selectedOptions[i];
        text += element.text + ' ';
      }
      this.fieldValue = text;
      this.durationSec = selectedOptions[0].value * 86400 + selectedOptions[1].value * 3600 + selectedOptions[2].value * 60
      if (selectedOptions[0].value == -1){ // 永久
        this.durationSec = -1
      } 
    },
    onSelect(action) {
      showToast("已选择玩家昵称：" + action.text);
      this.playerNameOrUid = action.text;
    },
    onActionSheetSelect(item) {
      // showToast(typeof (item.value))
      if (typeof (item.value) == 'string') {
        this.reasonText = item.value;
      } else {
        this.durationSec = item.value;
        this.durationText = item.name;
      }
    },
    onShowDurationActionSheet() {
      this.showDurationActionSheet = true
    },
    nameModelValueChanged(text) {
      axios.get(`http://43.140.209.93:5000/api/getuid?regular=%${text}%&from=0&limit=6&auth=${localStorage.getItem('token')}`).then((res) => {
        console.log(res.data);
        this.actions = new Array(res.data.data.results.length)
        for (let i = 0; i < res.data.data.results.length; i++) {
          this.actions[i] = { text: res.data.data.results[i].name }
        }
      });
    },
    submit() {
      this.isSubmiting = true;
      const func = (uid) => {
        axios.get(`http://43.140.209.93:5000/api/account/${this.$route.params.type}?uid=${uid}&time=${this.durationSec ? this.durationSec : 1}&auth=${localStorage.getItem('token')}&reason=${this.reasonText ? this.reasonText : '作弊'}&note=${this.extraInfo ? this.extraInfo : '无'}&url=${this.videoLink ? this.videoLink : '无'}`).then((res) => {
          console.log(res.data);
          this.isSubmiting = false;
          showDialog({
            title: res.data.code == 0 ? '操作成功' : '操作失败',
            message: res.data.code == 0 ? '您的支持将会是服务器前进的动力,\n让我们一起加强游戏的监督和管理,\n为玩家提供更好的游戏体验!' : '服务器返回: ' + res.data.msg,
            theme: 'round-button',
          });
          if (res.data.code == 0) {
            this.playerNameOrUid = ''
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
      if (!isNaN(this.playerNameOrUid)) {
        func(this.playerNameOrUid)
      } else {
        axios.get(`http://43.140.209.93:5000/api/getuid?regular=${this.playerNameOrUid}&from=0&limit=6&auth=${localStorage.getItem('token')}`)
          .then((res) => {
            console.log(res.data);
            if (res.data.data.results.length > 1) {
              showDialog({
                title: '操作失败',
                message: '查询有多个该名玩家，请在查询界面根据其他信息查找其uid，使用uid进行封禁',
                theme: 'round-button',
              });
              this.isSubmiting = false;
              return
            }
            if (!res.data.data.results) {
              showDialog({
                title: '操作失败',
                message: '无法获取改玩家的UID',
                theme: 'round-button',
              });
              this.isSubmiting = false;
              return
            }
            func(res.data.data.results[0].uid)
          }).catch((e) => {
            showDialog({
              title: '操作失败',
              message: '服务器返回: ' + e,
              theme: 'round-button',
            });
            this.isSubmiting = false;
          })
      }

    }
  }
};
</script>