<!--
 描述: 库存销量分析图表统计
 作者: Jack Chen
 日期: 2021-04-28
-->

<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  data() {
    return {
      myChart: null,
      allData: null,
      curIndex: 0, // 当前显示的页数
      timer: null
    };
  },
  created() {
  },
  mounted() {
    // 在组件创建完成之后，进行回调函数的注册
    this.$socket.registerCallBack("stockData", this.getData);
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "stockData",
      chartName: "stock",
      value: ""
    })
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timer);
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("stockData");
  },
  computed: {
    ...mapState(["theme"]),
  },
  watch: {
    theme() {
      this.myChart.dispose(); // 销毁当前的图表
      this.initChart(); // 重新以最新的主题名称初始化图表对象
      this.screenAdapter(); // 完成屏幕适配
      this.updateChart(); // 更新图表展示
    },
  },
  methods: {
    initChart() {
      this.myChart = this.$echarts.init(this.$refs.stock_ref, this.theme);
      const initOption = {
        title: {
          text: '▎ 库存销量分析',
          left: 20,
          top: 20
        },
        backgroundColor: getThemeValue(this.theme).bgColor,
      };
      this.myChart.setOption(initOption);
      this.myChart.on('mouseover', () => {
        clearInterval(this.timer);
      })
      this.myChart.on('mouseout', () => {
        this.startInterval();
      })
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get("stock");
      // console.log(ret);
      this.allData = ret;
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      const centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55455'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF'],
      ]
      const start = this.curIndex * 5;
      const end = (this.curIndex + 1) * 5;
      const showData = this.allData.slice(start, end);
      const seriesArr = showData.map((item, index) => {
        return {
          type: "pie",
          // radius: [110, 100],
          center: centerArr[index],
          avoidLabelOverlap: false,
          hoverAnimation: false, // 关闭鼠标移入到饼图时的动画效果,
          label: {
            position: 'center',
            color: colorArr[index][0]
          },
          labelLine: {
            show: false // 隐藏指示线
          },
          data: [
            {
              name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              name: item.name + '\n\n' + item.sales,
              value: item.stock,
              itemStyle: {
                color: getThemeValue(this.theme).backgroundColor
              }
            },
          ]
        };
      });
      const dataOption = {
        series: seriesArr,
      };
      this.myChart.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6;
      const innerRadius = titleFontSize * 2.4;
      const outerRadius = innerRadius * 1.125;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }
        ]
      };
      this.myChart.setOption(adapterOption);
      this.myChart.resize();
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.curIndex++;
        if (this.curIndex > 1) {
          this.curIndex = 0;
        }
        this.updateChart();
      }, 5000)
    }
  },
};
</script>

<style lang="less" scoped>
</style>