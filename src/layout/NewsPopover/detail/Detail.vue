<template>
  <CSDetail
    :show="show"
    title="消息通知"
    width="552px"
    :headerStyle="{ borderBottom: 0, paddingTop: '16px' }"
    :bodyContentStyle="{ display: 'flex', flexDirection: 'column' }"
    @clear="clear"
  >
    <div class="top">
      <div class="top-tags">
        <div
          class="tag"
          :class="{ active: item.value === tagCursor }"
          @click="tabsChange(item.value)"
          v-for="item in inboxData.tabs"
          :key="item.value"
        >
          <label>{{ item.transition.label }}</label>
          <span>{{ item.transition.num }}</span>
        </div>
      </div>
      <div class="top-handle">
        <span
          class="point"
          @click="readHandle({ type: 'all', form: undefined })"
          >全部已读</span
        >
      </div>
    </div>
    <div class="search">
      <n-input placeholder="搜索关键词" size="small">
        <template #prefix>
          <i class="iconfont icon-Search text-18 text-c-1"></i>
        </template>
      </n-input>
    </div>
    <div class="content">
      <n-spin :show="loading">
        <Timeline :lastLineShow="inboxData.lastLineShow">
          <TimelineItem
            :data="item"
            dateFile="transition.date"
            timeFile="transition.time"
            v-for="item in inboxData.list"
            :key="item.id"
            :active="!item.is_read"
          >
            <span>{{ item.content }}</span>

            <template #footer v-if="!item.is_read">
              <span
                class="point"
                @click="readHandle({ type: 'single', form: { id: item.id } })"
                >设为已读</span
              >
            </template>
          </TimelineItem>
        </Timeline>
      </n-spin>
    </div>
    <div class="footer">
      <span class="mr-10"> 共 {{ inboxData.total }} 条</span>
      <n-pagination
        v-model:page="pagination.page"
        :page-count="pagination.pageCount"
        simple
      />
    </div>
    <Dialog ref="DialogRef" />
  </CSDetail>
</template>

<script setup lang="ts">
import { http } from '@/apis'
import { useOper } from '@/hooks/useOperation'
import CSDetail from '@/components/CSDetail.vue'
import dayjs from 'dayjs'
import Timeline from './components/Timeline.vue'
import TimelineItem from './components/TimelineItem.vue'

const DialogRef = ref(<any>{})
const show = ref<boolean>(false)
const loading = ref<boolean>(false)
const inboxData = ref<Record<string, any>>({})
const pagination = ref({
  page: 1,
  pageSize: 15,
  pageCount: 1
})
const keyWord = ref<string>('')
const tagCursor = ref<number>(-1)
// 获取站内信数据
function getInbox() {
  http
    .post('/admin-api/message/inbox/list', {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      keyword: keyWord.value,
      is_read: tagCursor.value
    })
    .then((res) => {
      res.data.tabs.forEach((e) => {
        let itemArr = e.label.split('(')
        e['transition'] = {
          label: itemArr[0],
          num: itemArr[1].slice(0, -1)
        }
      })
      res.data.list.forEach((e) => {
        let itemArr = e.created_at.split(' ')
        e['transition'] = {
          date:
            dayjs().format('YYYY-MM-DD') === itemArr[0] ? '今天' : itemArr[0],
          time: itemArr[1]
        }
      })
      inboxData.value = res.data
      const num = Math.floor(inboxData.value.total / pagination.value.pageSize)
      if (inboxData.value.total % pagination.value.pageSize !== 0) {
        pagination.value.pageCount = num + 1
      } else {
        pagination.value.pageCount = num
      }
      inboxData.value['lastLineShow'] =
        pagination.value.page !== pagination.value.pageCount
    })
}

// 切换tabs
function tabsChange(val) {
  tagCursor.value = val
  init()
  getInbox()
}

const readParam = reactive({
  all: {
    title: '确认将该页消息全部标记已读吗？',
    html: '该页全部消息状态将变为已读',
    api: '/admin-api/message/inbox/set-all-read'
  },
  single: {
    title: '确认将该条消息标记为已读吗？',
    html: '该条消息状态将变为已读',
    api: '/admin-api/message/inbox/set-read'
  }
})

// 设置全部已读逻辑
function readHandle(obj: {
  type: 'all' | 'single'
  form: Record<string, any> | undefined
}) {
  useOper({
    title: readParam[obj.type].title,
    element: DialogRef.value,
    html: `确定后，${readParam[obj.type].html}，请谨慎操作`,
    api: readParam[obj.type].api,
    form: obj.form,
    method: 'post',
    success: () => {
      getInbox()
      window.$message.success('操作成功')
    }
  })
}

// 筛选参数初始化
function init() {
  keyWord.value = ''
  pagination.value.page = 1
  pagination.value.pageSize = 15
}

function open() {
  show.value = true
  tagCursor.value = -1
  init()
  getInbox()
}

function clear() {
  show.value = false
}
defineExpose({
  open
})
</script>

<style lang="less" scoped>
.top {
  height: 19px;
  box-sizing: content-box;
  display: flex;
  justify-content: space-between;
  padding: 0 16px 16px;

  .top-tags {
    display: flex;
    column-gap: 24px;

    .tag {
      font-size: 12px;
      line-height: 19px;
      label {
        color: #4a5468;
        margin-right: 6px;
      }
      span {
        font-weight: bold;
        color: #122341;
      }

      &.active {
        font-weight: bold;
        label {
          color: #122341;
          margin-right: 6px;
        }
        span {
          color: #ea5703;
        }
      }
    }
  }
  .top-handle {
    span {
      font-size: 12px;
      line-height: 19px;
      color: #449beb;
    }
  }
}
.search {
  padding: 0 16px 30px;
}
.content {
  padding: 0 16px;
  height: calc(100% - 93px - 76px);
  border-bottom: 8px solid #f1f1f5;
  overflow-y: scroll;
}
.footer {
  height: 76px;
  display: flex;
  padding-right: 25px;
  justify-content: flex-end;
  align-items: center;
}
.point {
  &:hover {
    cursor: pointer;
  }
}
</style>
