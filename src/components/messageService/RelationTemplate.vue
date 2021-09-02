<template>
  <div class="RelationTemplate">
    <div class="search">
      <m-form :formData="formData" labelPosition="left" :columns="formColumns"></m-form>
    </div>
    <div class="list">
      <el-button type="primary" @click="addRelTemplate('add')" class="moreList">关联更多模板</el-button>
    </div>
    <div class="data-list" v-if="cardLiStData.length > 0">
      <el-card class="box-card" v-for="(item, index) of cardLiStData" :key="index">
        <div class="card">
          <div class="card-word">
            <span class="word-text">{{item.code}}</span>
            <span class="card-img juli" @click="addRelTemplate('edit', item)">
              <el-tooltip class="item" effect="light" content="修改其他配置" placement="top">
                <img src="@/assets/messageService/edit.png" alt="" />
              </el-tooltip>
            </span>
          </div>
          <div class="name-date">
            <p>
              <span class="name-label">模板名称：</span>
              <span class="name-label-span">{{ item.name }}</span>
            </p>
            <p>
              <span class="name-label">其他配置：</span>
              <el-tooltip v-if="item.configTemplateCode !== null" class="item" effect="light" :content="item.configTemplateCode" placement="top">
                <span class="name-label-span">{{ item.configTemplateCode }}</span>
              </el-tooltip>
              <span v-else class="name-label-span">{{ item.configTemplateCode }}</span>
            </p>
          </div>
        </div>
      </el-card>
      <div class="pick"></div>
    </div>
    <!-- TODO 暂无数据处理-->
    <div v-if="cardLiStData.length === 0 && tableShow === false" class="no-data">
      <div>
        <img src="@/assets/messageService/no-data.png" alt="" />
        <p>这里什么都没有哦～</p>
      </div>
    </div>
    <div class="paging" v-if="pageInfo.total > 16">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.current" :page-size="pageInfo.size" layout="total, prev, pager, next, jumper" :total="pageInfo.total">
      </el-pagination>
    </div>
    <SignOrTemRelateDialog :dialogShow="dialogShow" @closeDialog="closeDialog" :title="TemTitle" :diaFormData="temFormData" />
  </div>
</template>

<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator'
import SignOrTemRelateDialog from './signOrTemRelate/SignOrTemRelateDialog.vue'
import { getListById } from '@/api/ajax'
import { baseUrl } from '@/config.json'

@Component({
  components: {
    SignOrTemRelateDialog
  }
})
export default class RelationTemplate extends Vue {
  private formData = {} as any
  private dialogShow = false
  private tableShow = false
  private TemTitle = '关联更多模板'
  private temFormData = {}
  private pageInfo = {
    current: 1,
    size: 16,
    total: 0
  }
  private diaChoiceList = []
  private cardLiStData = [] as any

  get formColumns () {
    return [
      {
        label: '模板编号：',
        prop: 'code',
        span: 5,
        labelWidth: '90px',
        el: 'input',
        placeholder: '请输入'
      },
      {
        label: '模板名称：',
        prop: 'name',
        span: 5,
        labelWidth: '90px',
        offset: 1,
        xs: { span: 24, offset: 0 },
        el: 'input',
        placeholder: '请输入'
      },
      {
        prop: 'btn',
        span: 5,
        offset: 1,
        xs: { span: 24, offset: 0 },
        render: () => {
          return <div>
            <el-button type="primary" icon="el-icon-search" onClick={this.getList} class="searchBtn">搜索</el-button>
            <el-button icon="el-icon-edit" onClick={this.resetFun} class="cancelBtn">重置</el-button>
          </div>
        }
      }
    ]
  }

  created () {
    this.getList()
    this.getTemplateList()
  }
  getList () {
    // TODO
    this.tableShow = true
    const { current, size } = this.pageInfo
    const params = {
      current,
      size,
      code: this.formData.code,
      name: this.formData.name,
      configId: this.$route.query.id
    }
    this.$api.getTemplateCustomPage(params).then(res => {
      if (res && res !== null) {
        this.tableShow = false
        this.cardLiStData = [
          ...res.records
        ]
      }
    })
  }

  // 获取签名管理所有数据
  getTemplateList () {
    const params = {}
    this.$api.getTemplate(params).then(res => {
      if (res && res !== null) {
        this.diaChoiceList = res.records.map((obj: any) => ({ label: obj.name, value: obj.id }))
      }
    })
  }

  resetFun () {
    this.formData = {}
  }

  addRelTemplate (type: string, item?: any) {
    // TODO
    this.TemTitle = type === 'add' ? '关联更多模板': '修改其他配置'
    this.dialogShow = true
    const params = {
      current: 1,
      size: 16
    }
    // 请求mSelect数据传递子组件
    getListById(`${baseUrl}/config/${this.$route.query.id}`, params).then((res: any) => {
      if (res && res !== null) {
        let newItem = {}
        newItem = {
          dataList: [ ...this.diaChoiceList ],
          templateIds: res.templateIds,
          ...item,
          formPassWayIdTem: this.$route.query.id,
          title: '模板'
        }
        
        this.temFormData = {
          ...(newItem || {})
        }
      }
    })
  }

  handleSizeChange(val: any) {
    this.pageInfo.size = val
  }

  handleCurrentChange(val: any) {
    this.pageInfo.current = val
    this.getList()
  }

  closeDialog () {
    this.dialogShow = false
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
  .RelationTemplate {
    width: 100%;
    height: 100%;
    position: relative;
    .data-list {
      // width: 100%;
      // height: 100%;
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      .box-card {
        width: 24.3%;
        margin-top: 14px;
        // min-width: 400px;
        border-radius: 6px;
        .card {
          width: 100%;
          // height: 128px;
          height: 116px;
          background-color: #fff;
          border-radius: 6px;
          overflow: hidden;
          .checkbox-style {
            margin-top: 10px;
            // margin-left: 6px;
            /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
              background-color: #0bb290;
              border-color: #0bb290;
            }
          }
          .card-word {
            margin-left: 13px;
            margin-top: 12px;
            // text-align: center;
            overflow: hidden;
            position: relative;
            .word-text {
              font-size: 18px;
              font-family: PingFangSC, PingFangSC-Medium;
              font-weight: 700;
              text-align: left;
              color: #20232a;
              line-height: 25px;
              margin-right: 80px;
            }
            .card-img {
              cursor: pointer;
              display: inline-block;
              text-align: right;
              img {
                width: 18px;
                height: 18px;
                vertical-align: middle;
              }
            }
            .juli {
              // margin-left: 15px;
              position: absolute;
              right: 16px;
            }
          }
          .name-date {
            margin-left: 20px;
            margin-top: 18px;
            p {
              margin: 0;
              margin-top: 4px;
              display: flex;
              .name-label {
                display: block;
                width: 70px;
                font-size: 14px;
                font-family: PingFangSC, PingFangSC-Light;
                font-weight: 300;
                text-align: left;
                color: #777777;
                line-height: 20px;
              }
              .name-label-span {
                display: block;
                flex: 1;
                font-size: 14px;
                font-family: PingFangSC, PingFangSC-Light;
                font-weight: 300;
                text-align: left;
                color: #777777;
                line-height: 20px;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
              }
            }
          }
        }
      }
      .pick {
        width: 24.3%;
        overflow: hidden;
      }
      @media (max-width:1630px) {
        .box-card {
          float: left;
          width: 32.6%;
          box-sizing: border-box;
          padding: 10px;
          min-width: 150px;
        }
        .pick {
          width: 32.6%;
          overflow: hidden;
        }
      }
      @media (max-width:1366px) {
        .box-card {
          float: left;
          width: 32.6%;
          box-sizing: border-box;
          padding: 10px;
          min-width: 150px;
        }
        .pick {
          width: 32.6%;
          overflow: hidden;
        }
      }
      @media (max-width:1200px) {
        .box-card {
          float: left;
          width: 32.6%;
          box-sizing: border-box;
          padding: 10px;
          min-width: 150px;
        }
        .pick {
          width: 32.6%;
          overflow: hidden;
        }
      }
    }
    .data-list:after{
      content: '';
      width: 24.3%;
    }
    // no-data
    .no-data {
      margin-top: 100px;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      div {
        img {
          display: block;
          width: 200px;
          height: 168px;
          // border: 1px dashed #ccc;
        }
        p {
          margin: 0;
          margin-top: 32px;
          font-size: 16px;
          font-family: SourceHanSansCN, SourceHanSansCN-Normal;
          font-weight: Normal;
          text-align: center;
          color: #20232a;
          line-height: 24px;
        }
      }
    }
    
    .paging {
      position: absolute;
      margin-top: 40px;
      margin-bottom: 50px;
      text-align: right;
      bottom: -10px;
      right: 20px;
    }

    /deep/ .el-card__body {
      padding: 0px;
    }
  }
</style>