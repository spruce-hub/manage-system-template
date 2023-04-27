<template>
  <div
    class="information-pop flex"
    v-if="msgList.filter((e) => e.type === 'information').length"
  >
    <div
      class="item"
      v-for="(item, index) in msgList.filter((e) => e.type === 'information')"
      :key="index"
    >
      <p class="truncate">
        <span class="text-c-1"> 客户：{{ item.data.customer_name }} </span>
      </p>
      <p class="truncate">
        <span class="text-c-1"> 情报计划：{{ item.data.rule_title }} </span>
      </p>
      <div class="flex">
        <n-button type="primary" class="mr-10" @click="toInformation">
          立即处理
        </n-button>
        <n-button type="warning" @click="delMsg(index)"> 稍后提醒 </n-button>
      </div>
      <n-icon size="10" @click="delMsg(index)">
        <IconClose color="#666666" />
      </n-icon>
    </div>
  </div>
  <div
    class="radar-pop"
    v-if="msgList.filter((e) => e.type === 'radar').length"
  >
    <div
      class="item flex items-center"
      v-for="(item, index) in msgList.filter((e) => e.type === 'radar')"
      :key="index"
      @click="toRadar"
    >
      <p class="mr-20 truncate">{{ item.data.content }}</p>
      <n-icon class="cursor-pointer" size="10" @click.stop="delMsg(index)">
        <IconClose color="#666666" />
      </n-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getToken } from '@/apis'

// const staffStore = useStaffStore()
const router = useRoute()

interface SocketMsgListItem {
  type: 'radar' | 'information'
  data: {
    content: string
    rule_title: string
    customer_name: string
  }
  ts: number
}
const msgList = ref([] as SocketMsgListItem[])
function delMsg(index: number) {
  msgList.value.splice(index, 1)
}
const socketStatus = ref(false) // 链接状态
const socketTimer = ref(null as any)
const socket = ref(null as any)
const wss = ''
// const ws = `wss://${
//   import.meta.env.DEV ? 'bufanshop.online.dev.fyunshan.com' : location.host
// }/wss` //链接地址
if (getToken() && !socketStatus.value) {
  // initWebSocket()
}
function initWebSocket() {
  //初始化
  // socket.value = new WebSocket(ws)
  socket.value.onopen = () => {
    socketStatus.value = true
    // sendMessage('staff_id=' + staffStore.staffInfo.id)
  }
  socket.value.onmessage = (e: any) => {
    if (JSON.parse(e.data).type === 'ping') return
    msgList.value.push({ ...JSON.parse(e.data) })
    setTimeout(() => {
      msgList.value.splice(0, 1)
    }, 5000)
  }
  socket.value.onerror = () => {
    // 因为测试环境会产生很多报错，所以return掉，可视情况在本地注释掉下面这行
    if (import.meta.env.DEV) return

    socketStatus.value = false
    setTimeout(() => {
      resetSocket()
    }, 1000)
  }
  socket.value.onclose = (err: any) => {
    // 因为测试环境会产生很多报错，所以return掉，可视情况在本地注释掉下面这行
    if (import.meta.env.DEV) return
    socketStatus.value = false
    setTimeout(() => {
      resetSocket()
    }, 1000)
  }
}
// 重新链接
let retryTimes = 0
function resetSocket() {
  if (socketStatus.value || retryTimes > 30) return
  socketStatus.value = true
  clearInterval(socketTimer.value)
  initWebSocket()
  retryTimes++
}
// 发送消息
function sendMessage(msg: any) {
  socket.value.send(msg)
  socketTimer.value = setInterval(() => {
    socket.value.send(msg)
  }, 40000)
}

function toInformation() {
  router.push('/customer/information')
}
function toRadar() {
  router.push('/customer/radar')
}
</script>
<style lang="less" scoped>
.information-pop {
  position: fixed;
  bottom: 30px;
  right: 50px;
  z-index: 999;
  max-height: calc(100vh - 180px);
  overflow: hidden;
  width: 348px;
  flex-direction: column;
  justify-content: flex-end;

  .item {
    background: @white;
    padding: 20px 30px;
    margin-bottom: 20px;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #dcdcdc;
    backdrop-filter: blur(7px);
    border-radius: 3px;
    z-index: 9999;

    p {
      margin-bottom: 10px;
    }

    div {
      margin-top: 30px;
      justify-content: center;
    }

    .n-button {
      width: 120px;
    }

    .n-icon {
      position: absolute;
      top: 12px;
      right: 12px;
      cursor: pointer;
    }
  }
}
.radar-pop {
  position: fixed;
  right: 30px;
  top: 200px;
  width: 348px;
  height: 180px;
  z-index: 1000;

  .item {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    border-radius: 3px;
    padding: 8px 12px;
    margin-bottom: 10px;

    .n-icon:last-child {
      margin-left: auto;
    }
  }
}
</style>
