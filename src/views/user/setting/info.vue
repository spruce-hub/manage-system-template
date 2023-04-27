<template>
  <div class="page-wrap">
    <div class="page_navigation flex items-center">
      <span>个人信息</span>
    </div>
    <Formularies
      class="page_form"
      ref="FormRef"
      labelPlacement="left"
      labelWidth="110"
      labelAlign="right"
      :rules="rules"
    >
      <template #face_url>
        <div class="userimg">
          <img v-if="!form.face_url" src="@/assets/img/customer.png" />
          <img v-else :src="form.face_url" />
          <div class="update">
            <EUploadFile @update:file-list="change">
              <template #content>
                <p class="text-12">修改头像</p>
              </template>
            </EUploadFile>
          </div>
        </div>
      </template>
    </Formularies>
    <n-divider />
    <div class="page_operation">
      <n-button class="page_operation_button" size="large" @click="clear">
        取消
      </n-button>
      <n-button
        class="page_operation_button"
        size="large"
        @click="submit"
        type="primary"
      >
        保存
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserInfo } from '@/store/userInfo'
import { http } from '@/apis'
interface formItem {
  face_url: string
}
const form = ref(<formItem>{
  face_url: ''
})

const rules = ref({
  face_url: {
    slot: 'face_url'
  },
  name: {
    label: '姓名',
    type: 'text',
    readonly: true
  },
  account: {
    label: '帐号',
    type: 'text',
    disabled: true
  },
  identity: {
    label: '当前角色',
    type: 'select',
    multiple: true,
    disabled: true
  }
})
const info = useUserInfo()
info.getUserInfo().then((data) => {
  form.value.face_url = data.face_url
  Object.keys(rules.value).forEach((key) => {
    rules.value[key].value = data[key]
  })
})
function change({ url }) {
  form.value.face_url = url
}
function clear() {
  form.value = {
    face_url: info.$state.userInfo.face_url
  }
}
function submit() {
  if (!form.value.face_url) {
    return window.$message.info('请上传头像')
  }
  http
    .post('admin-api/personal/set-face', { face_url: form.value.face_url })
    .then((res) => {
      window.$message.success('修改成功')
      info.setUserImg(form.value.face_url)
    })
}
</script>

<style lang="less" scoped>
.page-wrap {
  margin: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  .page_navigation {
    width: 100%;
    padding: 16px;
    & > span {
      font-size: 16px;
      line-height: 22px;
      &:first-child {
        color: @text-c-0;
      }
    }
  }
  .page_form {
    flex: 1;
    width: 40%;
    justify-content: unset;
    align-items: unset;
    flex-direction: column;
    :deep(.n-form-item) {
      margin-bottom: 24px;
    }
  }
  .page_operation {
    margin-bottom: 24px;
    .page_operation_button {
      width: 100px;
      &:not(:first-child) {
        margin-left: 20px;
      }
    }
  }
}
.userimg {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 1px solid @line-c-0;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
  display: flex;
  img {
    width: 100%;
  }
  > .update {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 25px;
    line-height: 25px;
    width: 100%;
    text-align: center;
    cursor: pointer;
    opacity: 0;
    transition: all 0.5s;
    background: rgba(0, 0, 0, 0.5);
    p {
      color: @white;
    }
  }
  &:hover .update {
    opacity: 1;
    transition: all 0.5s;
  }
}
</style>
