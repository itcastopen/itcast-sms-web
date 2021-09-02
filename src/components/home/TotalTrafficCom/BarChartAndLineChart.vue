<template>
  <div class="barAndLine">
    <div id="container" style="height: 100%"></div>
  </div>
</template>

<script lang="tsx">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import echarts from 'echarts'

@Component
export default class BarChartAndLineChart extends Vue {
static componentName = 'BarChartAndLineChart'

  private dataObjList = {} as any

  @Prop([Array]) mounthArr !: Function

  get option () {
    return {
      color: ['#dae8ff', 'rgba(79,171,152,1)', 'rgba(255,94,32,1)'],
      legend: {
        data: ['总量', '成功', '失败'],
        icon: "circle",
        bottom: '15',
        itemWidth: 6,
        itemHeight: 6
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        color: '#666666',
        formatter: function (params: any) {
          let htmlStr = ''
          for (let i = 0; i < params.length; i++) {
            const param = params[i]
            // x轴的名称
            const xName = param.name
            // 图例名称
            const seriesName = param.seriesName
            // y轴值
            const value = param.value
            // 图例颜色
            const color = param.color
            if (i === 0) {
              // x轴的名称
              htmlStr += `<span style="margin-left:20px;font-weight: 500;font-size: 14px;color: #666666;">${xName}</span>` + '<br/>'
            }
            htmlStr +='<div style="padding:5px 20px;width: 100px;">'
            // 为了保证和原来的效果一样，这里自己实现了一个点的效果
            htmlStr += '<span style="vertical-align: middle;margin-right:10px;display:inline-block;width:6px;height:6px;border-radius:5px;background-color:'+color+';"></span>'
            // 圆点后面显示的文本
            htmlStr += `<span style="font-size:12px;color: #666666;">${seriesName}</span>` + ' ' + `<span style="margin-left:20px;font-size:12px;color: #666666;">${value}</span>`
            
            htmlStr += '</div>'
          }
          return htmlStr
        }
      },
      grid: {
        left: '3%',
        width: '94%',
        containLabel: true
      },
      xAxis: [
        
        {
          axisTick: {
            show: false
          },
          type: 'category',
          data: this.dataObjList.date,
          axisLabel: {
            color: '#999999',
            borderColor: '#cdcdcd'
          },
          axisLine: {
            lineStyle: {
              color: '#cdcdcd'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          // 网格线
          splitLine: {
            lineStyle: {
              type: 'dashed'
            },
            show: true
          },
          axisLabel: {
            color: '#999999'
          }
        }
      ],
      series: [
        {
          barWidth: 14,
          name: '总量',
          type: 'bar',
          itemStyle: {
            // 悬浮改变当前柱状颜色
            emphasis: {
              color: '#dae8ff'
            },
            normal: {
              barBorderRadius: [4, 4, 0, 0]
            }
          },
          data: this.dataObjList.count
        },
        {
          name: '成功',
          type: 'line',
          data: this.dataObjList.success,
          symbol:'circle',
          itemStyle: {
            normal: {
              color: 'rgba(79,171,152,1)',
              borderColor: 'rgba(79,171,152,1)',
              lineStyle: {  
                color: 'rgba(79,171,152,1)'  
              }
            },
            emphasis: {
              color: '#4fab98',
              borderColor: '#fff',
              borderWidth: 2
            }
          }
        },
        {
          name: '失败',
          type: 'line',
          data: this.dataObjList.fail,
          symbol:'circle',
          itemStyle: {
            normal: {
              color: 'rgba(255,94,32,1)',
              borderColor: 'rgba(255,94,32,1)',
              lineStyle: {
                color: 'rgba(255,94,32,1)'
              }
            },
            emphasis: {
              color: '#ff5e20',
              borderColor: '#fff',
              borderWidth: 2
            }
          }
        }
      ]
    }
  }

  @Watch('mounthArr')
  getMounthArr () {
    // 调用mounthArr更新图标数据
    this.$nextTick(() => {
      this.getBarAndLineChart(this.mounthArr)
    })
  }
  mounted () {
    this.getBarAndLineChart(this.mounthArr)
  }
  getBarAndLineChart (arr?: any) {
    const params = {
      startCreateTime: arr ? arr[0] : null,
      endCreateTime: arr ? arr[1] : null
    }
    this.$api.getStatisticsTrend(params).then(res => {
      if (res && res !== null) {
        this.dataObjList = {
          date: res.date,
          count: res.count,
          fail: res.fail,
          success: res.success
        }
        const dom = document.getElementById("container")
        const myChart = echarts.init(dom)
        myChart.setOption(this.option, true)
        window.addEventListener('resize', () => {
          myChart.resize()
        })
        this.$once('hook:beforeDestroy', () => {
          window.removeEventListener('resize', () => {
            myChart.resize()
          })
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .barAndLine {
    width: 100%;
    height: 380px;
  }
</style>