import legacy from '@vitejs/plugin-legacy' //浏览器兼容插件
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
    legacy({
      targets: ['defaults', 'not IE 11'] //浏览器兼容
    }),
    AutoImport({
      include: [/\.js/, /\.ts/, /\.vue/],
      imports: ['vue', 'vue-router']
    }),
    viteCompression({
      threshold: 1024
    })
  ],
  server: {
    port: 88, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域
    host: '0.0.0.0',
    proxy: {
      '/dev': {
        target: 'https://zfl.online.dev.fyunshan.com', // https://webadmin.release.akusense.cn
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src') //设置@指向src目录
    }
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1024
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `
          @import './src/assets/css/theme.less';
          @import './src/assets/css/utilsStyle.less';
        `
      }
    }
  }
})
