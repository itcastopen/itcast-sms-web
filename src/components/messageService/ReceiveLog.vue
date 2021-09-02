<template>
  <div class="ReceiveLog">
    <div class="search">
      <m-form :formData="formData" labelPosition="left" :columns="formColumns"></m-form>
    </div>
    <m-table v-if="tableData.length > 0" :header-cell-style="tableHeaderColor" :tableData="tableData" :columns="tableColumns" :stripe="true" :border="false" @pageChange="pageChange" :page="pageInfo" layout="total, prev, pager, next, jumper">
      <div slot="btn" slot-scope="{row}" style="height: 40px;line-height: 40px;">
        <span v-if="row.status === 1" :class="{ 'active': row.status === 1 }">成功</span>
        <span v-else :class="{ 'activeFile': row.status === 0 }">失败</span>
      </div>
    </m-table>
    <!-- TODO 暂无数据处理-->
    <div v-if="tableData.length === 0 && tableShow === false" class="no--table-data">
      <div>
        <img src="@/assets/messageService/no-data.png" alt="" />
        <p>这里什么都没有哦～</p>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator'
import { PageInfo } from '@/types/index'
import { monthOneDay, formatTodayDate } from '@/utils/formValidate'

@Component
export default class ReceiveLog extends Vue {
  static componentName = 'ReceiveLog'

  private formData = {
    dateArr: [ monthOneDay(), formatTodayDate() ]
  } as any
  private tableData = [] as any
  private tableShow = false

  private pageInfo = {
    pageSize: 15,
    pageNum: 1,
    total: 0
  }

  get formColumns () {
    return [
      {
        label: '签名名称：',
        prop: 'signatureName',
        span: 5,
        placeholder: '请输入',
        labelWidth: '90px',
        el: 'input'
      },
      {
        label: '模板名称：',
        prop: 'templateName',
        span: 5,
        offset: 1,
        xs: { span: 24, offset: 0 },
        placeholder: '请输入',
        labelWidth: '90px',
        el: 'input'
      },
      
      {
        label: '创建时间：',
        prop: 'dateArr',
        el: 'date-picker',
        span: 5,
        offset: 1,
        xs: { span: 24, offset: 0 },
        labelWidth: '90px',
        'value-format': 'yyyy-MM-dd',
        format: 'yyyy-MM-dd',
        type: 'daterange',
        pickerOptions: {
          disabledDate(time: any) {
              return time.getTime() > Date.now()
          }
        },
        // rules: {
        //   required: true,
        //   trigger: 'blur',
        //   validator: (rule: any, value: any, callback: Function) => {
        //     if (!value) {
        //       callback(new Error('创建时间不能为空'))
        //     } else {
        //       // 判断时间是不是在一个月之内
        //       const time1 = new Date(this.formData.dateArr[0]).getTime()
        //       const time2 = new Date(this.formData.dateArr[1]).getTime()
        //       const time3 = time2 - time1
        //       const time4 = 1000 * 3600 * 24 * 30
        //       if (time3 > time4) {
        //         // TODO
        //         callback(new Error('时间查询跨度不能超过30天'))
        //       } else {
        //         callback()
        //       }
        //     }
        //   }
        // },
        'prefix-icon': ''
      },
      {
        label: '应用名称：',
        prop: 'platformName',
        span: 5,
        offset: 1,
        xs: { span: 24, offset: 0 },
        placeholder: '请输入',
        labelWidth: '90px',
        el: 'input'
      },
      {
        prop: 'btn',
        span: 5,
        // offset: 1,
        // xs: { span: 24, offset: 0 },
        render: () => {
          return <div>
            <el-button type="primary" icon="el-icon-search" class="searchBtn" style="margin-left: -10px;" onClick={this.getList}>搜索</el-button>
            <el-button icon="el-icon-edit" onClick={this.resetFun} class="cancelBtn">重置</el-button>
          </div>
        }
      }
    ]
  }

  get tableColumns () {
    return [
      {
        label: '创建时间',
        prop: 'createTime',
        align: 'left'
      },
      {
        label: '通道名称',
        prop: 'configName',
        align: 'left'
      },
      {
        label: '签名名称',
        prop: 'signatureName',
        align: 'left'
      },
      {
        label: '模板名称',
        prop: 'templateName',
        align: 'left'
      },
      {
        label: '应用',
        prop: 'platformName',
        align: 'left'
      },
      {
        label: '耗时（秒）',
        prop: 'useTime',
        align: 'left'
      },
      {
        label: '状态',
        prop: 'btn',
        align: 'left'
      }
    ]
  }

  created () {
    this.getList()
  }

  getList () {
    this.tableShow = true
    const { pageSize, pageNum } = this.pageInfo
    const params = {
      current: pageNum,
      size: pageSize,
      signatureName: this.formData.signatureName,
      templateName: this.formData.templateName,
      startCreateTime: this.formData.dateArr ? this.formData.dateArr[0] + ' 00:00:00' : null,
      endCreateTime: this.formData.dateArr ? this.formData.dateArr[1] + ' 23:59:59' : null,
      platformName: this.formData.platformName
    }
    this.$api.getLogReceivePage(params).then(res => {
      if (res && res !== null) {
        this.tableShow = false
        this.tableData = [
          ...res.records
        ]
        this.pageInfo.total = Number(res.total)
      }
    })
  }

  resetFun () {
    this.formData = {}
  }

  pageChange (pageInfo: PageInfo) {
    this.pageInfo = pageInfo
    this.getList()
  }

  tableHeaderColor () {
    return 'border-top-left-radius: 14px;border-top-right-radius: 14px;'
  }

}
</script>

<style lang="scss" scoped>
  .ReceiveLog {
    
    width: 100%;
    .active {
      color: #0bb290;
      font-weight: 700;
    }
    .activeFile {
      color: #ff5a5a;
      font-weight: 700;
    }

    /deep/ .el-date-table td.selected span {
      background-color:  #0bb290;
    }

    // 日期框颜色样式覆盖
    /deep/ .el-range-editor.is-active, .el-range-editor.is-active:hover {
      border-color: rgba(11,178,144,1);
    }
  }
</style>