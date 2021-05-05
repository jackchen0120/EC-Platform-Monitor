<!--
 描述: 商家销售统计的横向柱状图
 作者: Jack Chen
 日期: 2021-04-28
-->

<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
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
      curPage: 1, // 当前显示的页数
      totalPage: 0, // 总页数
      timer: null, // 定时器的标识
    };
  },
  created() {
  },
  mounted() {
    // 在组件创建完成之后，进行回调函数的注册
    this.$socket.registerCallBack("sellerData", this.getData);
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "sellerData",
      chartName: "seller",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    // 在页面加载完成的时候，主动进行屏幕的适配
    this.screenAdapter();
    // console.log(this.theme);
  },
  destroyed() {
    clearInterval(this.timer);
    // 在组件销毁时，需将监听器注销
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("sellerData");
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
    // 初始化echartsInstance对象
    initChart() {
      this.myChart = this.$echarts.init(this.$refs.seller_ref, this.theme);
      // 对图表初始化配置的控制
      const initOption = {
        title: {
          text: "▎ 商家销售统计",
          textStyle: {
            fontSize: 66,
          },
          left: 20,
          top: 20,
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true, // 距离包含坐标轴上的文字
        },
        backgroundColor: getThemeValue(this.theme).bgColor,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: 'shadow'
            // type: "line",
            // z: 0,
            // lineStyle: {
            //   width: 66,
            //   color: "#2D3443",
            // },
          },
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        series: [
          {
            type: "bar",
            barWidth: 66,
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: getThemeValue(this.theme).labelColor,
              },
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              // 指明颜色渐变的方向
              // 指明不同百分比之下颜色的值
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "#5052EE", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#AB6EE5", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      };
      this.myChart.setOption(initOption);

      // 对图表对象进行鼠标事件的监听
      this.myChart.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.myChart.on("mouseout", () => {
        this.startInterval();
      });
    },
    // 获取服务端的数据
    getData(ret) {
      // const { data: ret } = await this.$http.get("seller");
      // console.log("获取后端数据===", ret);
      this.allData = ret;
      // 对数据排序
      this.allData.sort((a, b) => {
        return a.value - b.value;
      });
      // 每5个元素显示一页
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1;
      this.updateChart();
      // 启动定时器
      this.startInterval();
    },
    // 更新图表
    updateChart() {
      const start = (this.curPage - 1) * 5;
      const end = this.curPage * 5;
      const showData = this.allData.slice(start, end);

      const sellerName = showData.map((item) => {
        return item.name;
      });

      const sellerValue = showData.map((item) => {
        return item.value;
      });

      const dataOption = {
        yAxis: {
          data: sellerName,
        },
        series: [
          {
            data: sellerValue,
          },
        ],
      };

      this.myChart.setOption(dataOption);
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.curPage++;
        if (this.curPage > this.totalPage) {
          this.curPage = 1;
        }
        this.updateChart();
      }, 3000);
    },
    // 当浏览器的大小发生变化时，会调用的方法，来完成屏幕的适配
    screenAdapter() {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      };
      this.myChart.setOption(adapterOption);
      // 手动调用图表对象的resize才能生效
      this.myChart.resize();
    },
  },
};
</script>

<style lang="less" scoped>
</style>