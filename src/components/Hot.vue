<!--
 描述: 热销商品占比图表
 作者: Jack Chen
 日期: 2021-04-28
-->

<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle"
      >&#xe6ef;</span
    >
    <span class="iconfont arr-right" @click="toRight" :style="comStyle"
      >&#xe6ed;</span
    >
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
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
      curIndex: 0, // 当前所展示出的一级分类数据
      titleFontSize: 0,
    };
  },
  created() {
    // 在组件创建完成之后，进行回调函数的注册
    this.$socket.registerCallBack("hotData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "hotData",
      chartName: "hotproduct",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("hotData");
  },
  computed: {
    ...mapState(["theme"]),
    catName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.curIndex].name;
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: getThemeValue(this.theme).labelColor
      };
    },
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
      this.myChart = this.$echarts.init(this.$refs.hot_ref, this.theme);
      const initOption = {
        title: {
          text: "▎ 热销商品占比",
          left: 20,
          top: 20,
        },
        legend: {
          top: "12%",
          icon: "circle",
        },
        backgroundColor: getThemeValue(this.theme).bgColor,
        tooltip: {
          show: true,
          formatter: (arg) => {
            const thirdCategory = arg.data.children;
            // 计算出所有三级分类的数值总和
            let total = 0;
            thirdCategory.forEach((item) => {
              total += item.value;
            });
            let retStr = "";
            thirdCategory.forEach((item) => {
              retStr += `${item.name}：${
                parseInt((item.value / total) * 100) + "%"
              }<br>`;
            });
            return retStr;
          },
        },
        series: [
          {
            type: "pie",
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
          },
        ],
      };
      this.myChart.setOption(initOption);
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get("hotproduct");
      // console.log(ret);
      this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      const legendData = this.allData[this.curIndex].children.map((item) => {
        return item.name;
      });
      const seriesData = this.allData[this.curIndex].children.map((item) => {
        return {
          name: item.name,
          value: item.value,
          children: item.children,
        };
      });
      const dataOption = {
        legend: {
          data: legendData,
        },
        series: [
          {
            data: seriesData,
          },
        ],
      };
      this.myChart.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 4,
            center: ["50%", "50%"],
          },
        ],
      };
      this.myChart.setOption(adapterOption);
      this.myChart.resize();
    },
    toLeft() {
      this.curIndex--;
      if (this.curIndex < 0) {
        this.curIndex = this.allData.length - 1;
      }
      this.updateChart();
    },
    toRight() {
      this.curIndex++;
      if (this.curIndex > this.allData.length - 1) {
        this.curIndex = 0;
      }
      this.updateChart();
    },
  },
};
</script>
<style lang="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 5%;
}
</style>