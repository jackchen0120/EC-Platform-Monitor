<!--
 描述: 销售排行图表统计
 作者: Jack Chen
 日期: 2021-04-28
-->

<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
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
      startValue: 0, // 区域缩放的起点值
      endValue: 9, // 区域缩放的终点值
      timer: null, // 定时器的标识
    };
  },
  created() {
  },
  mounted() {
    // 在组件创建完成之后，进行回调函数的注册
    this.$socket.registerCallBack("rankData", this.getData);
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "rankData",
      chartName: "rank",
      value: ""
    })
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timer);
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("rankData");
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
      this.myChart = this.$echarts.init(this.$refs.rank_ref, this.theme);
      const initOption = {
        title: {
          text: "▎ 地区销售排行",
          left: 20,
          top: 20,
        },
        grid: {
          top: "40%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        backgroundColor: getThemeValue(this.theme).bgColor,
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: 'top'
            }
          },
        ],
      };
      this.myChart.setOption(initOption);
      this.myChart.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.myChart.on("mouseout", () => {
        this.startInterval();
      });
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get("rank");
      // console.log(ret);
      this.allData = ret;
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E728F", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];
      // 所有省份形成的数组
      const provinceArr = this.allData.map((item) => {
        return item.name;
      });
      // 所有省份对应的销售金额
      const valueArr = this.allData.map((item) => {
        return item.value;
      });
      const dataOption = {
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        xAxis: {
          data: provinceArr,
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null;
                if (arg.value > 200) {
                  targetColorArr = colorArr[0];
                } else if (arg.value > 100) {
                  targetColorArr = colorArr[1];
                } else {
                  targetColorArr = colorArr[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0],
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1],
                  },
                ]);
              },
            },
          },
        ],
      };
      this.myChart.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              borderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
            },
          },
        ],
      };
      this.myChart.setOption(adapterOption);
      this.myChart.resize();
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }

      this.timer = setInterval(() => {
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.updateChart();
      }, 2000);
    },
  },
};
</script>

<style lang="less" scoped>
</style>