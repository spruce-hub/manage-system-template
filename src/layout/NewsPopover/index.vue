<template>
  <div class="news" @click="DetailOpen">
    <n-badge class="msg-badge" color="#f53f3f" :value="number" :max="99">
      <i class="iconfont icon-notification text-18 text-c-1"></i>
    </n-badge>
  </div>
  <Detail ref="DetailRef" />
</template>
<script lang="ts" setup>
import { http } from '@/apis'
import Detail from './detail/Detail.vue'

// 打开消息通知详情页
const DetailRef = ref({} as typeof Detail)
// 消息通知详情页打开
function DetailOpen() {
  DetailRef.value.open()
}

// 获取未读消息数
const number = ref(0)
function getNumber() {
  // http.get('/admin/system.SystemMessage/get_unread_num').then((res) => {
  //   unreadNum.value = res.data.msg_num
  //   if (unreadNum.value) {
  //     getMessageList()
  //   }
  // })
}
// 获取消息列表
const newsList = ref([] as NewsListItem[])
function getMessageList() {
  http.get('/admin/system.SystemMessage/get_limit_msg').then((res) => {
    newsList.value = res.data
  })
}

onMounted(() => {
  getNumber()
})
</script>
<style lang="less" scoped>
.news {
  width: 32px;
  height: 32px;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  .msg-badge {
    :deep(.n-badge-sup) {
      height: 15px;
      padding: 4px;
      left: 25px;
      top: -2px;
      .n-base-slot-machine {
        height: 15px;
        line-height: 15px;
      }
    }
  }
}
.pop-news {
  text-align: center;
  padding-bottom: 26px;

  h3 {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid @line-c-1;
    text-align: left;
    margin-bottom: 16px;
  }

  .empty {
    padding: 80px 90px;
  }

  .item {
    text-align: left;
    margin: 0 20px 30px;
    cursor: pointer;
    min-width: 220px;
    max-width: 300px;
    display: block;

    p:last-child {
      font-size: 12px;
      color: @text-c-1;
      margin-top: 5px;
    }

    &:hover p:first-child {
      color: @main-c;
    }
  }

  .n-button {
    width: 120px;
  }
}
</style>
