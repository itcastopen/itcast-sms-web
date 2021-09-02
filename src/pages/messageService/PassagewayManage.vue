<template>
  <div class="passageway-manage">
    <div class="search">
      <m-form :formData="formData" labelPosition="left" :columns="formColumns" />
    </div>
    <div class="list">
      <el-button type="primary" @click="addPassageWay('add')" style="margin-left:0px;" class="addList">
        <i class="el-icon-circle-plus-outline icon-sign"></i>
        添加通道
      </el-button>
    </div>
    <div class="data-list" v-if="cardLiStData.length > 0">
      <!-- 数据可拖动部分 -->
      <draggable v-model="cardLiStData" style="width: 100%; cursor: move;" class="draggable-list" filter=".undraggable" :move="checkMove" @end="getNewCardList">
        <el-card class="box-card" v-for="(item, index) of cardLiStData" :key="index" :class="[ item.canEdit ? 'draggable' : 'undraggable', item.isEnable === 0 ? 'active' : '' ]">
          <div class="card">
            <div class="card-title">
              <span>{{ item.name }}</span>
              <el-tooltip class="item" effect="light" content="点击切换通道状态" placement="top"> <!-- isActive isEnable -->
                <el-switch style="margin-left:15px;width: 32px;height:16px;" v-model="item.isActive" active-color="rgba(11,178,144,1)" :disabled="item.isActive === 0" @change="getSwitchValue(item)"></el-switch>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="点击修改通道" placement="top">
                <img class="img-edit" src="@/assets/messageService/edit.png" alt="" @click="addPassageWay('edit', item)" />
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="点击设置" placement="top">
                <img class="img-shezhi" src="@/assets/messageService/shezhi.png" alt="" @click="goChannel(item)" />
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="点击删除当前通道" placement="top">
                <img class="img-delete" src="@/assets/messageService/delete.png" alt="" @click="deletePassWay(item)" />
              </el-tooltip>
            </div>
            <div class="card-content">
              <p>
                <span class="name-label">域名：</span>
                <el-tooltip class="item" effect="light" :content="item.domain" placement="top">
                  <span class="name-label-span">{{ item.domain }}</span>
                </el-tooltip>
              </p>
              <p>
                <span class="name-label">秘钥ID： </span>
                <el-tooltip class="item" effect="light" :content="item.accessKeyId" placement="top">
                  <span class="name-label-span">{{ item.accessKeyId }}</span>
                </el-tooltip>
              </p>
              <p>
                <span class="name-label">秘钥值：  </span>
                <el-tooltip class="item" effect="light" :content="item.accessKeySecret" placement="top">
                  <span class="name-label-span">{{ item.accessKeySecret }}</span>
                </el-tooltip>
              </p>
              <p>
                <span class="name-label">创建时间：  </span>
                <span class="name-date">{{ item.createTime }}</span>
              </p>
            </div>
            <!-- 新增图片放置 -->
            <div class="level-img">
              <img class="image-card" v-if="index === 0" src="@/assets/messageService/huangguan.png" alt="" />
              <img class="image-card" v-if="index !== 0 && item.isActive === 0" src="@/assets/messageService/zuanshi1.png" alt="" />
              <img class="image-card" v-if="index !== 0 && item.isActive !== 0" src="@/assets/messageService/zuanshi2.png" alt="" />
              <span class="img-word" :class="{ 'first-word': index === 0 }">Lv{{ index + 1 }}</span>
            </div>
          </div>
        </el-card>
        <div class="pick"></div>
      </draggable>
      <!-- 拼接不能拖动的数据 -->
    </div>
    <!-- TODO 暂无数据处理-->
    <div v-if="cardLiStData.length === 0 && tableShow === false" class="no-data">
      <div>
        <img src="@/assets/messageService/no-data.png" alt="" />
        <p>这里什么都没有哦～</p>
      </div>
    </div>
    <!-- 弹框部分 -->
    <PassageWayDialog :dialogShow="dialogShow" :title="passTitle" @closeDialog="closeDialog" :diaFormData="sendPassDialogData" />
    <!-- 删除动作 -->
    <el-dialog :visible.sync="centerDialogVisible" width="322px" center :show-close="false" top="22vh" class="dia-form">
      <span class="diaLog-span" style="text-align:center;">确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" class="cancelSumbitBtn" style="margin-right: 20px;">取 消</el-button>
        <el-button type="primary" @click="detelePassDialog" class="sumbitBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator'
import PassageWayDialog from '@/components/messageService/PassageWayDialog.vue'
import draggable from 'vuedraggable'
import { mixins } from 'vue-class-component'
import MixinTools from '@/utils/mixins.vue'

interface Item {
  id: string;
}

@Component({
  components: {
    PassageWayDialog,
    draggable
  }
})
export default class PassagewayManage extends mixins(MixinTools) {
  private formData = {} as any
  private passTitle = '添加通道'
  private sendPassDialogData = {} as any
  private dialogShow = false
  private tableShow = false
  private currentPage = 0
  private value = false
  private centerDialogVisible = false
  private ids = [] as any
  private cardLiStData = [] as any
  private myList = [] as any
  private leftOverList = [] as any

  get formColumns () {
    return [
      {
        label: '通道名称：',
        prop: 'name',
        placeholder: '请输入',
        el: 'input',
        labelWidth: '90px',
        span: 5
      },
      {
        span: 5,
        offset: 1,
        xs: { span: 24, offset: 0 },
        prop: 'btn',
        render: () => {
          return <div>
            <el-button type="primary" icon="el-icon-search" class="searchBtn" onClick={this.getList}>搜索</el-button>
            <el-button icon="el-icon-edit" onClick={this.resetFun} class="cancelBtn">重置</el-button>
          </div>
        }
      }
    ]
  }

  getImgType (name: any) {
    switch (name) {
      case 0:
        return require('@/assets/messageService/ali.png')
      case 1:
        return require('@/assets/messageService/lexin.png')
      case 2:
        return require('@/assets/messageService/mengwang.png')
      default:
        return ''
    }
  }

  created() {
    this.getList()
  }

  checkMove () {
    // TODO
  }

  // 触发传递后台数据
  getNewCardList () {
    let ids = []
    ids = this.cardLiStData.map((obj: any) => (obj.id))
    this.$api.postConfigLevel([ ...ids ]).then(res => {
      if (res === true || res !== null) {
        this.getList()
      }
    })
  }

  getList () {
    this.tableShow = true
    // const { current, size } = this.pageInfo
    const params = {
      name: this.formData.name
    }
    this.$api.getConfigPage(params).then(res => {
      if (res && res.records) {
        this.tableShow = false
        this.cardLiStData = res.records.map((obj: any) => ({ choseCheck: false, ...obj, isActive: obj.isActive === 0 ? false : true, canEdit: obj.isEnable === 1 ? true : false}))
      }
    })
  }

  getSwitchValue (item: any) {
    const { id, isActive } = item
    const params = {
      id,
      isActive: isActive === true ? 1 : 0
    }
    this.$api.editConfig(params).then(res => {
      if (res === true || res !== null) {
        const title = isActive === false ? '关闭通道成功' : '开启通道成功'
        this.$message.success(title)
        this.getList()
      }
    })
  }

  resetFun () {
    this.formData = {}
  }

  goChannel (item: any) {
    this.$router.push({ path: '/messageService/ChannelDeploy', query: { id: item.id } })
  }

  async deletePassWay (item: any) {
    // TODO
    try {
      await this.showDeleteConfirm()
      this.ids = []
      this.centerDialogVisible = true
      this.ids.push(item.id)
    } catch (error) {
      console.log('err' + error)
    }
  }

  detelePassDialog () {
    // TODO
    const params = [
      ...this.ids
    ]
    this.$api.deleteConfig(params).then(res => {
      if (res === true || res !== null) {
        this.centerDialogVisible = false
        this.$message.success('删除成功')
        this.getList()
        this.ids = []
      }
    })
  }

  // 添加通道或修改通道
  addPassageWay (type: string, item?: any) {
    this.passTitle = type === 'add' ? '添加通道' : '修改通道'
    this.dialogShow = true
    let newItem = {}
    if (type === 'edit') {
      const list = []
      if (item.other) {
        if (item.other === '{}') {
          list.push({ inputKey: '', inputValue: '' })
        } else {
          for (const key in JSON.parse(item.other)) {
            const temp = {} as { inputKey: string; inputValue: string }
            temp.inputKey = key
            temp.inputValue = JSON.parse(item.other)[key]
            list.push(temp)
          }
        }
        
      }
      newItem = {
        ...item,
        isActive: item.isActive === true ? 1 : 0,
        list
      }
    }
    this.sendPassDialogData = {
      ...(newItem || {})
    }
  }

  closeDialog () {
    this.dialogShow = false
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
  .passageway-manage {
    width: 100%;
    height: 100%;
    // position: relative;
    .data-list {
      // width: 100%;
      // height: 100%;
      // margin-top: 20px;
      // margin-top: 6px;
      margin-bottom: 50px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      .draggable-list {
        margin-top: 6px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .box-card {
        width: 24.3%;
        // width: 414px;
        margin-top: 14px;
        border-radius: 6px;
        // 新增逻辑
        position: relative;
        .card {
          width: 100%;
          // margin-top: 20px;
          // height: 172px;
          height: 150px;
          background-color: #fff;
          border-radius: 6px;
          .card-title {
            position: relative;
            width: 100%;
            height: 40px;
            line-height: 40px;
            margin-top: -8px;
            span {
              // margin-left: 20px;
              font-size: 18px;
              font-family: PingFangSC, PingFangSC-Medium;
              font-weight: 700;
              text-align: left;
              color: #20232a;
              line-height: 25px;
            }
            .title-logo {
              width: 70px;
              height: 33px;
              vertical-align: middle;
              margin-left: 20px;
              
            }
            .img-edit {
              cursor: pointer;
              position: absolute;
              right: 16%;
              top: 50%;
              transform: translateY(-50%);
              width: 19px;
              height: 19px;
              display: inline-block;
              vertical-align: middle;
            }
            .img-shezhi {
              cursor: pointer;
              position: absolute;
              right: 8%;
              top: 50%;
              transform: translateY(-50%);
              width: 19px;
              height: 19px;
              display: inline-block;
              vertical-align: middle;
            }
            .img-delete {
              cursor: pointer;
              position: absolute;
              top: 50%;
              right: 0%;
              transform: translateY(-50%);
              width: 19px;
              height: 19px;
            }
          }
          .card-content {
            width: 100%;
            // margin-left: 70px;
            // margin-left: 20px;
            margin-top: 12px;
            p {
              margin: 0;
              margin-top: 4px;
              display: flex;
              .name-label {
                display: block;
                width: 72px;
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
                width: 100%;
                font-size: 14px;
                font-family: PingFangSC, PingFangSC-Light;
                font-weight: 300;
                text-align: left;
                color: #20232a;
                line-height: 20px;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
              }
              .name-date {
                font-size: 14px;
                font-family: PingFangSC, PingFangSC-Light;
                font-weight: 300;
                text-align: left;
                color: #a2a5ac;
                line-height: 20px;
              }
            }
          }

          // 新增图片放置
          .level-img {
            position: absolute;
            bottom: 0px;
            right: 10px;

            .image-card {
              width: 44px;
              height: 40px;
            }

            .img-word {
              font-style:italic;
              position: absolute;
              bottom: 12px;
              right: 12px;
              font-size: 12px;
              font-family: Arial, Arial-ItalicMT;
              font-weight: ItalicMT;
              text-align: left;
              color: #999999;
              line-height: 14px;
              text-shadow: 0px 1px 2px 0px rgba(0,0,0,0.2);
            }

            .first-word {
              color: red;
            }
          }
        }
      }
      .pick {
        width: 24.3%;
        overflow: hidden;
      }
      @media (max-width:1720px) {
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
          box-sizing: border-box;
          // padding: 10px;
        }
        .pick {
          width: 32.6%;
          overflow: hidden;
        }
      }
      
      .draggable-list:after{
        content: '';
        width: 24.3%;
      }
      
      .active {
        background: #ebf1f0;
        .card {
          background: #ebf1f0;
        }
      }
    }
    .data-list:after{
      content: '';
      width: 24.3%;
    }
    // no-data
    .no-data {
      // margin-top: 100px;
      // width: 100%;
      // height: 100%;
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
    // .dia-pass {
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
      padding: 14px;
    }
  }
</style>