<template>
  <div class="TotalTrend">
    <div class="TotalTrend-left">
      <div class="left">
        <div class="left-word">
          <h3>{{ totalObj.count }}</h3>
          <p>发送总量(条)</p>
        </div>
        <div class="left-img">
          <img src="../../../assets/home/total.png" alt="" />
        </div>
      </div>
    </div>
    <div class="TotalTrend-center">
      <div class="left">
        <div class="left-word">
          <h3>{{ totalObj.success }}</h3>
          <p>发送成功量(条)</p>
        </div>
        <div class="left-img">
          <img src="../../../assets/home/amount_total.png" alt="" />
        </div>
      </div>
    </div>
    <div class="TotalTrend-right">
      <div class="left">
        <div class="left-word">
          <h3>{{ totalObj.fail }}</h3>
          <p>发送失败量(条)</p>
        </div>
        <div class="left-img">
          <img src="../../../assets/home/failure_total.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class TotalTrend extends Vue {
  static componentName = 'TotalTrend'

  private totalObj = {}

  @Prop([Array]) mounthArr !: Function

  @Watch('mounthArr')
  getMounthArr () {
    // 调用mounthArr更新图标数据
    this.getTotalTrend(this.mounthArr)
  }

  created () {
    this.getTotalTrend(this.mounthArr)
  }

  getTotalTrend (arr: any) {
    const params = {
      startCreateTime: arr ? arr[0] : null,
      endCreateTime: arr ? arr[1] : null
    }
    this.$api.getStatisticsCount(params).then(res => {
      if (res && res !== null) {
        this.totalObj = {
          ...res
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .TotalTrend {
    width: 100%;
    height: 136px;
    margin-top: 50px;
    padding-left: 30px;
    box-sizing: border-box;
    display: flex;
    .TotalTrend-left, .TotalTrend-center, .TotalTrend-right {
      flex: 1;
      border-radius: 10px;
    }
    .TotalTrend-left, .TotalTrend-center, .TotalTrend-right {
      margin-right: 27px;
      background-color: #F9FCFA;
      padding-top: 30px;
      box-sizing: border-box;
      .left {
        width: 100%;
        display: flex;
        .left-word {
          flex: 1;
          margin-left: 36px;
          h3 {
            margin: 0;
            font-size: 30px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #5771de;
            line-height: 42px;
            // text-shadow: 2px 2px 4px 0px rgba(31,66,159,0.39);
          }
          p {
            margin: 0;
            // width: 107px;
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
          }
        }
        .left-img {
          width: 80px;
          // margin-right: 40px;
          margin-right: 5px;
          img {
            margin-top: 10px;
            display: inline-block;
            width: 56px;
            height: 56px;
            vertical-align: middle;
          }
        }
      }
    }


    .TotalTrend-left {
      margin-right: 27px;
      background-color: #f6fafe;
      // background: #f6fafe;
      .left {
        .left-word {
          h3 {
            text-shadow: 2px 2px 4px 0px rgba(31,66,159,0.39); 
          }
          p {
            // width: 107px;
            opacity: 0.54;
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            color: #5b5b5b;
          }
        }
      }
    }

    .TotalTrend-center {
      margin-right: 27px;
      // background-color: rgba(255,243,240,0.4);
      .left {
        .left-word {
          h3 {
            color: rgba(31,159,133,1);
            text-shadow: 2px 2px 4px 0px rgba(31,159,133,0.39); 
          }
          p {
            // width: 115px;
            color: #5b5b5b;
          }
        }
      }
    }
    .TotalTrend-right {
      margin-right: 30px;
      background-color: rgba(255,243,240,0.4);
      .left {
        .left-word {
          h3 {
            color: rgba(255,94,32,1);
            text-shadow: 2px 2px 4px 0px rgba(255,94,32,0.30); 
          }
          p {
            // width: 115px;
            color: #5b5b5b;
          }
        }
      }
    }
  }


  @media (max-width:1366px) {
    .TotalTrend {
      .TotalTrend-left, .TotalTrend-center, .TotalTrend-right {
        .left {
          .left-word {
            p {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
</style>