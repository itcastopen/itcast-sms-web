<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Mixin'
})
export default class extends Vue {
  // 删除确认
  public async showDeleteConfirm() {
    if (process.env.NODE_ENV === 'production') {
      const message = '演示系统，不支持此操作'
      this.$notify.info({
        title: '提示',
        message: message
      })
      return new Promise(function(resolve, reject) {
        reject(new Error(message))
      })
    }
  }
}
</script>