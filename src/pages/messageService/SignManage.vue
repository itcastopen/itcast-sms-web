<template>
  <div class="sign-message">
    <div class="search">
      <m-form :formData="formData" labelPosition="left" :columns="formColumns" />
    </div>
    <div class="list">
      <el-button type="primary" @click="addSign('add')" style="margin-right: 16px;" class="addList">
        <i class="el-icon-circle-plus-outline icon-sign"></i>
        添加签名
      </el-button>
      <el-button @click="deleteSignIds" :disabled="ids.length === 0" class="delete">
        <i class="el-icon-delete icon-sign"></i>
        批量删除
      </el-button>
    </div>
    <div class="data-list" v-if="cardLiStData.length > 0">
      <el-card class="box-card" v-for="(item, index) of cardLiStData" :key="index">
        <div class="card">
          <el-checkbox v-model="item.choseCheck" class="checkbox-style" @change="getSignIds(item, $event)"></el-checkbox>
          <div class="card-word">
            <span class="word-text">{{item.code}}</span>
            <span class="card-img edit" @click="addSign('edit', item)">
              <el-tooltip class="item" effect="light" content="点击修改签名模板" placement="top">
                <img src="@/assets/messageService/edit.png" alt="" />
              </el-tooltip>
            </span>
            <span class="card-img juli" @click="deleteSign(item)">
              <el-tooltip class="item" effect="light" content="点击删除当前签名模板" placement="top">
                <img src="@/assets/messageService/delete.png" alt="" />
              </el-tooltip>            
            </span>
          </div>
          <div class="name-date">
            <p>
              <span class="name-label">签名名称：</span>
              <span class="name-label">{{ item.name }}</span>
            </p>
            <p>
              <span class="name-label">创建时间：</span>
              <span class="name-label">{{ item.createTime }}</span>
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
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageInfo.size" layout="total, prev, pager, next, jumper" :total="pageInfo.total">
      </el-pagination>
    </div>
    <!-- 新增和修改 -->
    <MessageListDialog :dialogShow="dialogShow" @closeDialog="closeDialog" :title="DiaTile" :diaFormData="signFormData" />
    <!-- 删除动作 -->
    <el-dialog v-el-drag :visible.sync="centerDialogVisible" width="322px" center :show-close="false" top="22vh" class="dia-sign dia-form">
      <span class="diaLog-span" style="text-align:center;">确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" class="cancelSumbitBtn" style="margin-right: 20px;">取 消</el-button>
        <el-button type="primary" @click="deteleSignDialog" class="sumbitBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator'
import MessageListDialog from '@/components/messageService/MessageListDialog.vue'
import { mixins } from 'vue-class-component'
import MixinTools from '@/utils/mixins.vue'

@Component({
  components: {
    MessageListDialog
  }
})
export default class SignManage extends mixins(MixinTools) {
  private formData = {} as any
  private currentPage = 0
  private checked = false
  private tableShow = false
  private dialogShow = false
  private DiaTile = '添加签名'
  private ids: Array<number> = []
  private centerDialogVisible = false
  private signFormData = {} as any
  private pageInfo = {
    current: 1,
    total: 0,
    size: 16
  }
  private cardLiStData = [] as any

  get formColumns () {
    return [
      {
        label: '签名编号：',
        prop: 'code',
        placeholder: '请输入',
        el: 'input',
        labelWidth: '90px',
        span: 5
      },
      {
        label: '签名名称：',
        prop: 'name',
        placeholder: '请输入',
        el: 'input',
        labelWidth: '90px',
        span: 5,
        offset: 1,
        xs: { span: 24, offset: 0 }
      },
      {
        span: 7,
        offset: 1,
        xs: { span: 24, offset: 0 },
        prop: 'btn',
        render: () => {
          return <div>
            <el-button type="primary" icon="el-icon-search" class="searchBtn" onClick={this.getList}>搜索</el-button>
            <el-button icon="el-icon-edit" class="cancelBtn" onClick={this.resetFun}>重置</el-button>
          </div>
        }
      }
    ]
  }

  created () {
    this.getList()
  }

  getList () {
    this.tableShow = true
    const { current, size } = this.pageInfo
    const params = {
      current,
      size,
      code: this.formData.code,
      name: this.formData.name
    }
    this.$api.getSignaturePage(params).then(res => {
      if (res && res.records) {
        this.tableShow = false
        this.cardLiStData = res.records.map((obj: any) => ({ choseCheck: false, ...obj }))
        this.pageInfo.total = Number(res.total)
        // this.resetFun()
      }
    })
  }

  resetFun () {
    this.formData = {}
  }

  handleSizeChange(val: any) {
    this.pageInfo.size = val
  }

  handleCurrentChange(val: any) {
    this.pageInfo.current = val
    this.getList()
  }

  addSign (type: string, item?: any) {
    this.signFormData = {}
    this.DiaTile = type === 'add' ? '添加签名' : '修改签名'
    this.dialogShow = true
    this.signFormData = {
      ...(item || {})
    }
  }

  async deleteSignIds () {
    try {
      await this.showDeleteConfirm()
      if (this.ids.length === 0) {
        this.$message.error('请勾选要删除的签名')
      } else {
        this.centerDialogVisible = true
      }
    } catch (error) {
      console.log('err' + error)
    }
  }

  getSignIds () {
    this.ids = this.cardLiStData.filter((obj: any) => {
      return obj.choseCheck === true
    }).map((item: any) => (item.id))
  }
  
  async deleteSign (item: any) {
    try {
      await this.showDeleteConfirm()
      this.ids = []
      this.centerDialogVisible = true
      this.ids.push(item.id)
    } catch (error) {
      console.log('err' + error)
    }
  }

  deteleSignDialog () {
    const params = [ ...this.ids ]
    this.$api.deleteSignature(params).then(res => {
      if (res && res.length <= 0) {
        this.centerDialogVisible = false
        this.$message.success('删除成功')
        this.getList()
        this.ids = []
      } else {
        this.centerDialogVisible = false
        this.$message.warning(`${res.join(',')}已使用，无法删除`)
        this.getList()
        this.ids = []
      }
      
    })
  }

  closeDialog () {
    this.dialogShow = false
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
  .sign-message {
    width: 100%;
    height: 100%;
    position: relative;
    .list {
      .icon-sign {
        // margin-right: 6px;
        /deep/ .el-button--small, .el-button--small.is-round {
          padding: 8px 20px!important;
        }
      }
    }
    .data-list {
      margin-top: 6px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      .box-card {
        width: 24.3%;
        margin-top: 14px;
        // border-radius: 10px;
        border-radius: 6px;
        .card {
          width: 100%;
          // 老的每个card高度
          // height: 138px;
          // 新的买个card高度
          height: 128px;
          background-color: #fff;
          border-radius: 6px;
          overflow: hidden;
          box-sizing: border-box;
          .checkbox-style {
            // 老的多选框距离上部样式
            // margin-top: 10px;
            // margin-left: 10px;
            // 新的多选框距离顶部样式
            margin-top: 4px;
            margin-left: 4px;
            /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
              background-color: #0bb290;
              border-color: #0bb290;
            }
          }
          .card-word {
            // 老的多选框距离左边样式
            // margin-left: 20px;
            // 新的多选框距离左边样式
            margin-left: 16px;
            margin-top: -5px;
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
            .edit {
              position: absolute;
              right: 40px;
            }
            .juli {
              position: absolute;
              right: 14px;
            }
          }
          .name-date {
            margin-left: 20px;
            margin-top: 18px;
            margin-bottom: 22px;
            p {
              margin: 0;
              margin-top: 4px;
              .name-label {
                font-size: 14px;
                font-family: PingFangSC, PingFangSC-Light;
                font-weight: 300;
                text-align: left;
                color: #777777;
                line-height: 20px;
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
          // padding: 10px;
          // min-width: 150px;
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
          // width: 24.4%;
          box-sizing: border-box;
          // padding: 10px;
          // min-width: 150px;
        }
        .pick {
          width: 32.6%;
          // width: 24.4%;
          overflow: hidden;
        }
      }
      // @media (max-width:1200px) {
      //   .box-card {
      //     float: left;
      //     width: 32.6%;
      //     box-sizing: border-box;
      //     padding: 10px;
      //     min-width: 150px;
      //   }
      //   .pick {
      //     width: 32.6%;
      //     overflow: hidden;
      //   }
      // }
      
      .card {
        width: 100%;
      }
      
    }
    .data-list:after{
      content: '';
      width: 24.3%;
    }
    // no-data
    .no-data {
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
      margin-top: 40px;
      margin-bottom: 50px;
      text-align: right;
      right: 20px;
    }

    // js内部面板样式
    .dia-htitle {
      width: 100px;
      height: 28px;
      font-size: 20px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      text-align: left;
      color: #333333;
      line-height: 28px;
    }
    /deep/ .el-dialog {
      border-radius: 10px;
    }
    .diaLog-span {
      display: block;
      width: 100%;
      font-size: 20px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      text-align: center;
      color: #333333;
      line-height: 28px;
    }
    // .dialog-footer {
    //   .btn-sty {
    //     margin-right: 20px;
    //     margin-bottom: 30px;
    //     padding: 10px 20px;
    //   }
    // }

    // 按钮样式修改
    // .el-button–primary {
    //   color: rgba(11,178,144,1);
    //   background-color: #8B83D2;
    //   border-color: #8B83D2;
    // }
    // .el-button–primary:hover {
    //   background-color: rgba(11,178,144,1);
    //   border-color: rgba(11,178,144,1);
    // }
    // .el-button–primary:focus {
    //   background-color: rgba(11,178,144,1);
    //   border-color: rgba(11,178,144,1);
    // }
    // .delete {
    //   /deep/ .el-button {
    //     background: #FFF;
    //     border: 1px solid #DCDFE6;
    //     color: rgba(11,178,144,1);
    //   }
    // }
    
    /deep/ .el-checkbox__inner:hover {
      border-color: rgba(11,178,144,1);
    }



    // .dia-sign {
    //   // 弹框按钮样式迭代
    //   // 朴素按钮样式迭代
    //   // hover
    //   /deep/ .el-button:first-child:hover {
    //     color: rgba(11,178,144,1);
    //     border-color: rgba(11,178,144,1);
    //   }
    //   /deep/ .el-button:first-child:focus {
    //     color: rgba(11,178,144,1);
    //     border-color: rgba(11,178,144,1);
    //   }
    // }


    /deep/ .el-card__body {
      padding: 0px;
    }
  }
</style>