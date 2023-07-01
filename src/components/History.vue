<template>
  <h2 style="margin: 10px;">操作记录</h2>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell-group inset style="margin-top: 4mm;margin-bottom: 5mm;">
        <van-cell v-for="item in list" :key="item" :title="item.front" :value="item.back" :label="item.bottom" />
      </van-cell-group>
    </van-list>
  </van-pull-refresh>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios'
import { showLoadingToast, showSuccessToast, showFailToast, showToast, showDialog } from 'vant';

export default {
  setup() {
    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);
    let perLength = 10
    let nowIndex = 0
    const onLoad = () => {

      axios.get(`http://43.140.209.93:5000/api/history/list?from=${nowIndex}&limit=${perLength}&auth=${localStorage.getItem('token')}`)
        .then((res) => {
          if (refreshing.value) {
            list.value = [];
            refreshing.value = false;
          }
          if (res.data.code) {
            finished.value = true;
            loading.value = false;
            showDialog({
              title: '加载失败',
              message: '拉到底部啦',
              theme: 'round-button',
            });
            return
          }

          let results = res.data.data.results
          for (let i = 0; i < results.length; i++) {
            const date = new Date(results[i].time * 1000);
            const year = (date.getFullYear()).toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = (date.getDate()).toString().padStart(2, '0');
            const hour = (date.getHours()).toString().padStart(2, '0');
            const minute = (date.getMinutes()).toString().padStart(2, '0');
            const second = (date.getSeconds()).toString().padStart(2, '0');
            const formattedTime = month + '/' + day + '-' + hour + ':' + minute;
            list.value.push({
              front: `${formattedTime} ${results[i].target}`,
              back: `[${results[i].type} ${results[i].long == -1 ? '永久' : results[i].long + '秒'}] by ${results[i].operator.length >= 7 ? results[i].operator.substr(0, 6) + '..' : results[i].operator}`,
              bottom: `${results[i].reason} 备注: ${results[i].note}`
            });

          }



          nowIndex += perLength;
          loading.value = false;
        }).catch((e) => {
          showDialog({
            title: '加载失败',
            message: '服务器返回: ' + e,
            theme: 'round-button',
          });
          finished.value = true;
        })

    };

    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
      onLoad();
    };

    return {
      list,
      onLoad,
      loading,
      finished,
      onRefresh,
      refreshing,
    };
  },
};
</script>