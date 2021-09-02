<template>
  <div class="PassageWayDialog dia-form">
    <el-dialog :title="title" :visible.sync="dialogShow" :before-close="closeDialog" :close-on-click-modal="false" :show-close="true" width="660px" top="22vh">
      <!-- <m-form :formData="diaFormData" :columns="formColumns" ref="mform"></m-form> -->
      <m-form :formData="formData" :columns="formColumns" ref="mform"></m-form>
      <div slot="footer" style="text-align:center;">
        <el-button @click="closeDialog" class="cancelSumbitBtn" style="margin-right:30px;">取消</el-button>
        <el-button type="primary" class="sumbitBtn" @click="addOrUpdateSign">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="tsx">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

interface DataType {
  isEnable: number;
}

@Component
export default class PassageWayDialog extends Vue {
  static componentName = 'PassageWayDialog'
  // private formData = {} as any
  
  @Prop([String]) title!: string
  @Prop([Boolean]) dialogShow!: boolean
  @Prop([Object]) diaFormData!: DataType

  private formData = {
    ...this.diaFormData,
    otherList: (this as any).diaFormData.list ? (this as any).diaFormData.list :  [{ inputKey: '', inputValue: '' }] as any
  } as any

  $refs!: {
    mform: any;
  }

  @Watch('diaFormData', { immediate: true })
  watchFiaFormData () {
    this.formData = {
      ...this.diaFormData,
      otherList: (this as any).diaFormData.list ? (this as any).diaFormData.list :  [{ inputKey: '', inputValue: '' }] as any
    } as any
  }

  get isEnableList () {
    if (this.title === '修改通道' && this.diaFormData.isEnable === 1) {
      return [
        {
          label: '正常',
          value: 1
        }
      ]
    } else {
      return [
        {
          label: '正常',
          value: 1
        },
        {
          label: '故障',
          value: 0
        }
      ]
    }
  }

  get formColumns () {
    return [
      {
        label: '通道类型：',
        prop: 'channelType',
        span: 22,
        el: 'radio-group',
        list: [
          {
            label: '文字',
            value: 1
          },
          {
            label: '语音',
            value: 2
          },
          {
            label: '推送',
            value: 3
          }
        ],
        rules: {
          required: true,
          trigger: 'change',
          message: '请勾选通道类型'
        }
      },
      {
        label: '通道名称：',
        prop: 'name',
        span: 22,
        placeholder: '请输入',
        maxlength: '10',
        'show-word-limit': true,
        el: 'input',
        rules: {
          required: true,
          trigger: 'blur',
          validator: (rules: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('通道名称不能为空'))
            } else {
              if (value.length > 10 || value.length < 2) {
                callback(new Error('通道名称字符长度在2-50之间'))
              } else {
                callback()
              }
            }
          }
        }
      },
      {
        label: '平台：',
        prop: 'platform',
        span: 22,
        placeholder: '请输入',
        maxlength: '10',
        'show-word-limit': true,
        el: 'input',
        rules: {
          required: true,
          trigger: 'blur',
          validator: (rules: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('平台不能为空'))
            } else {
              if (value.length > 10 || value.length < 2) {
                callback(new Error('平台字符长度在2-50之间'))
              } else {
                callback()
              }
            }
          }
        }
      },
      {
        label: '域名：',
        prop: 'domain',
        placeholder: '请输入',
        span: 22,
        el: 'input',
        maxlength: '50',
        'show-word-limit': true,
        rules: {
          required: true,
          trigger: 'blur',
          validator: (rlues: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('域名不能为空'))
            } else {
              if (value.length > 50 || value.length < 2) {
                callback(new Error('域名字符长度在2-50之间'))
              } else {
                callback()
              }
            }
          }
        }
      },
      {
        label: '秘钥ID：',
        prop: 'accessKeyId',
        span: 22,
        el: 'input',
        maxlength: '50',
        'show-word-limit': true,
        placeholder: '请输入',
        rules: {
          required: true,
          trigger: 'blur',
          validator: (rules: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('秘钥ID不能为空'))
            } else {
              if (value.length > 50 || value.length < 2) {
                callback(new Error('秘钥ID字符长度在2-50之间'))
              } else {
                callback()
              }
            }
          }
        }
      },
      {
        label: '秘钥值：',
        prop: 'accessKeySecret',
        placeholder: '请输入',
        span: 22,
        el: 'input',
        maxlength: '50',
        'show-word-limit': true,
        rules: {
          required: true,
          trigger: 'blur',
          validator: (rules: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('秘钥值不能为空'))
            } else {
              if (value.length > 50 || value.length < 2) {
                callback(new Error('秘钥值字符长度为2-50之间'))
              } else {
                callback()
              }
            }
          }
        }
      },
      ...this.getOtherColumns(),
      ...(this.title !== '添加通道' ? [
        {
          label: '是否正常：',
          prop: 'isEnable',
          el: 'radio-group',
          span: 22,
          list:  this.isEnableList,
          rules: {
            required: true,
            trigger: 'change',
            message: '请勾选是否正常'
          }
        }
      ] : []),
      ...(this.diaFormData.isEnable === 0 ? [] : [
        {
          label: '是否启用：',
          prop: 'isActive',
          el: 'radio-group',
          span: 22,
          list: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ],
          rules: {
            required: true,
            trigger: 'change',
            message: '请勾选是否启用'
          }
        }
      ]),
      {
        label: '备注：',
        prop: 'remark',
        el: 'input',
        type: 'textarea',
        maxlength: '200',
        'show-word-limit': true,
        placeholder: '例如： 不知道原因',
        clearable: true,
        height: 100,
        span: 22,
        ploaceholder: '示例：不知道原因'
        // rules: {
        //   required: true,
        //   trigger: 'blur',
        //   message: '模板内容不能为空'
        // }
      }
    ]
  }


  getOtherColumns () {
    return this.formData.otherList.map((obj: any, index: number) => {
      return [
        {
          label: `其他配置${index + 1}：`,
          prop: `otherList[${index}].inputKey`,
          el: 'input',
          placeholder: `请输入变量${index + 1}`,
          labelWidth: '100px',
          // rules: {
          //   required: false,
          //   trigger: 'blur',
          //   // message: '其他配置变量key不能为空',
          //   validator: (rule: any, value: string, callback: Function) => {
          //     if (!value) {
          //       callback()
          //     } else {
          //       console.log(this.formData.otherList[index].inputValue)
          //       if (!this.formData.otherList[index].inputValue) {
          //         callback(new Error('key或value为空'))
          //       } else {
          //         callback()
          //       }
          //     }
          //   }
          // }
        },
        {
          prop: `otherList[${index}].inputValue`,
          el: 'input',
          placeholder: `请输入变量${index + 1}`,
          span: 8,
          // rules: {
          //   required: false,
          //   trigger: 'blur',
          //   // message: '其他配置变量value不能为空',
          //   validator: (rule: any, value: string, callback: Function) => {
          //     if (!value) {
          //       callback()
          //     } else {
          //       if (!this.formData.otherList[index].inputKey) {
          //         callback(new Error('key或value为空'))
          //       } else {
          //         callback()
          //       }
          //     }
          //   }
          // }
        },
        {
          prop: `del${index}`,
          span: 1,
          render: 
            this.formData.otherList.length !== 1 &&  index !== 0 ? (
            <el-button type="text" onClick={() => { this.formData.otherList.splice(index, 1) }} class="render-style">
              <el-tooltip class="item" effect="light" content={`点击删除第${index + 1}其他配置`} placement="top">
                <img src={require('@/assets/marketSMS/del.png')} alt="" />
              </el-tooltip>
            </el-button>
          ) : null
        },
        {
          prop: `add${index}`,
          span: 1,
          render: index === 4 ? null :
          (
            <el-button type="text" onClick={this.addDomain} class="render-style" style="margin-left: 10px;">
              <el-tooltip class="item" effect="light" content="点击新增" placement="top">
                <img src={require('@/assets/marketSMS/add.png')} alt="" />
              </el-tooltip>
            </el-button>
          )
        }
      ]
    }).flat()
  }


  addDomain () {
    if (this.formData.otherList.length >= 5) {
      return this.$message.error('其他配置最多添加五个')
    }
    this.formData.otherList.push({
      inputKey: '',
      inputValue: ''
    })
  }

  closeDialog () {
    this.resetForm()
    this.$emit('closeDialog')
  }

  resetForm () {
    this.$refs.mform.resetFields()
  }

  addOrUpdateSign () {
    const list = [] as any
    for (let y = 0; y < this.formData.otherList.length; y++) {
      if (this.formData.otherList[y].inputKey && this.formData.otherList[y].inputValue) {
        list.push({
          [this.formData.otherList[y].inputKey]: this.formData.otherList[y].inputValue
        })
      } else if (!this.formData.otherList[y].inputKey && !this.formData.otherList[y].inputValue) {
        list.push({})
      } else {
        return this.$message.error('key或value为空')
      }
    }
    this.$refs.mform.validate().then((value: boolean) => {
      if (value) {
        // TODO
        const params = {
          ...this.formData,
          other: JSON.stringify(Object.assign({}, ...list))
        }
        delete params.list
        delete params.otherList
        const addParams = {
          ...this.formData,
          isEnable: 1,
          other: JSON.stringify(Object.assign({}, ...list))
        }
        delete addParams.list
        delete addParams.otherList
        this.title === '添加通道' ? this.$api.addConfig(addParams).then(res => {
          if (res === true || res !== null) {
            this.$message.success('添加通道成功')
            this.$emit('closeDialog')
          }
        }) : this.$api.editConfig(params).then(res => {
          if (res === true || res !== null) {
            this.$message.success('修改通道成功')
            this.$emit('closeDialog')
          }
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .PassageWayDialog {
    .render-style {
      img {
        width: 18px;
        height: 18px;
      }
    }
    
    /deep/ .el-dialog {
      border-radius: 10px;
    }
    /deep/ .el-dialog__title {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      text-align: left;
      color: #333333;
      line-height: 22px;
    }
    /deep/ .el-textarea__inner {
      height: 134px!important;
    }
    /deep/ .el-input__inner:focus {
      border-color: rgba(11,178,144,1);
    }
    /deep/ .el-textarea__inner:focus {
      border-color: rgba(11,178,144,1);
    }

    /deep/ .el-radio-group {
      width: 100%;
    }
    // 单选框部分
    /deep/ .el-radio__input.is-checked .el-radio__inner {
      border-color: rgba(11,178,144,1);
      background: rgba(11,178,144,1);
    }
    /deep/ .el-radio__input.is-checked+.el-radio__label {
      color: rgba(11,178,144,1);
    }

    /deep/ .el-radio__inner:hover {
      border-color: rgba(11,178,144,1);
    }
    /deep/ .el-radio {
      margin-right: 50px;
    }


    // 弹框按钮样式迭代
    // 朴素按钮样式迭代
    // hover
    /deep/ .el-button:first-child:hover {
      color: rgba(11,178,144,1);
      // border-color: rgba(11,178,144,1);
    }
    /deep/ .el-button:first-child:focus {
      color: rgba(11,178,144,1);
      // border-color: rgba(11,178,144,1);
    }
  }
</style>