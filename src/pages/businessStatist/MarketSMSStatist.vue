<template>
  <div class="MarketSMSStatist">
    <el-breadcrumb separator="/" style="margin-bottom: 20px;margin-left: 20px" v-if="$route.query.type === '营销'">
      <el-breadcrumb-item :to="{ path: '/MarketSMS' }">营销短信</el-breadcrumb-item>
      <el-breadcrumb-item>营销短信统计</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="search">
      <m-form :formData="formData" labelPosition="left" :columns="formColumns" />
    </div>
    <m-table v-if="tableData.length > 0" :tableData="tableData" :columns="tableColumns" @pageChange="pageChange" :stripe="true" :border="false" :page="pageInfo" layout="total, prev, pager, next, jumper">
      <div slot="count" slot-scope="{row}">
        <span class="total-info">{{ row.count }}</span>
      </div>
      <div slot="success" slot-scope="{ row }">
        <span class="success">{{ row.success }}</span>
      </div>
      <div slot="fail" slot-scope="{row}">
        <span class="file">{{ row.fail }}</span>
      </div>
      <div slot="btn" slot-scope="{row}" style="height: 40px;">
        <el-tooltip class="item" effect="light" content="点击查看失败详情" placement="top">
          <el-button @click="goDetail(row)" type="text" class="btn-img" v-show="row.fail !== 0">
            <img src="@/assets/marketSMS/xiangqing.png" alt="" />
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="点击重新发送" placement="top">
          <el-button @click="recordsFun(row)" type="text" class="btn-img" v-show="row.fail !== 0">
            <img src="@/assets/marketSMS/xinxichakan.png" alt="" />
          </el-button>
        </el-tooltip>
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
export default class MarketSMSStatist extends Vue {
  private formData = {
    dateArr: [ monthOneDay(), formatTodayDate() ]
  } as any

  private tableShow = false
  private pageInfo = {
    pageSize: 15,
    pageNum: 1,
    total: 0
  }
  private tableData = [] as any

  get formColumns () {
    return [
      {
        label: '发送时间：',
        prop: 'dateArr',
        el: 'date-picker',
        type: 'daterange',
        'value-format': 'yyyy-MM-dd',
        format: 'yyyy-MM-dd',
        labelWidth: '90px',
        span: 5
      },
      {
        label: '签名名称：',
        prop: 'signatureName',
        labelWidth: '90px',
        span: 5,
        offset: 1,
        xs: { span: 24, offset: 0 },
        placeholder: '请输入',
        el: 'input'
      },
      {
        label: '主题名称：',
        prop: 'title',
        labelWidth: '90px',
        span: 5,
        offset: 1,
        xs: { span: 24, offset: 0 },
        placeholder: '请输入',
        el: 'input'
      },
      
      {
        prop: 'btn',
        span: 5,
        offset: 1,
        xs: { span: 24, offset: 0 },
        render: () => {
          return <div>
            <el-button type="primary" icon="el-icon-search" class="searchBtn" style="margin-left:-10px;" onClick={this.getList}>搜索</el-button>
            <el-button icon="el-icon-edit" onClick={this.resetFun} class="cancelBtn">重置</el-button>
          </div>
        }
      }
    ]
  }

  get tableColumns () {
    return [
      {
        label: '发送时间',
        prop: 'date',
        align: 'left'
      },
      {
        label: '签名名称',
        prop: 'signatureName',
        align: 'left'
      },
      {
        label: '主题名称',
        prop: 'title',
        align: 'left'
      },
      {
        label: '发送总数（条）',
        prop: 'count',
        align: 'left'
      },
      {
        label: '发送成功（条）',
        prop: 'success',
        align: 'left'
      },
      {
        label: '发送失败（条）',
        prop: 'fail',
        align: 'left'
      },
      {
        label: '操作',
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
    const { pageSize, pageNum } =this.pageInfo
    const params = {
      current: pageNum,
      size: pageSize,
      title: this.formData.title,
      signatureName: this.formData.signatureName,
      startCreateTime: this.formData.dateArr ? this.formData.dateArr[0] + ' 00:00:00' : null,
      endCreateTime: this.formData.dateArr ? this.formData.dateArr[1] + ' 23:59:59' : null
    }
    this.$api.getStatisticsMarketingCountPage(params).then(res => {
      if (res && res.records) {
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

  goDetail (item: any) {
    this.$router.push({ path: '/businessStatist/SendRecord', query: { sendRecordParams: item.id, name: '营销' } })
  }

  recordsFun (item: any) {
    const params = {
      id: item.id
    }
    this.$api.editMarketingReSend(params).then(res => {
      if (res === true || res !== null) {
        this.$message.success('短信已发出，请稍后查看结果！')
        this.getList()
      }
    })
    
  }
}
</script>

<style lang="scss" scoped>
  .MarketSMSStatist {
    .total-info {
      color: #5771de;
      font-weight: 700;
    }
    .success {
      color: #0bb290;
      font-weight: 700;
    }
    .file {
      color: #ff5a5a;
      font-weight: 700;
    }
    /deep/ .el-table--border, .el-table--group {
      border: 1px solid #EBEEF5;
      border-radius: 10px;
    }
    .btn-img {
      img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
    }
    // 日期框hover颜色覆盖
    /deep/ .el-range-editor.is-active, .el-range-editor.is-active:hover {
      border-color: rgba(11,178,144,1);
    }
  }
</style>