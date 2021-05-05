<!--
 描述: 销量趋势图表统计：商品、商家、地区
 作者: Jack Chen
 日期: 2021-04-28
-->

<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ "▎ " + showTitle }}</span>
      <span
        class="iconfont icon-arrow-down title-icon"
        :style="comStyle"
        @click="showChoice = !showChoice"
      ></span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
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
      showChoice: false, // 是否显示可选项
      choiceType: "map", // 显示数据类型
      titleFontSize: 0, // 指明标题字体大小
    };
  },
  created() {
    // 在组件创建完成之后，进行回调函数的注册
    this.$socket.registerCallBack("trendData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    // 发送数据给服务端，告诉服务端，前端现在需要数据
    this.$socket.send({
      action: "getData",
      socketType: "trendData",
      chartName: "trend",
      value: ""
    })
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    // 在组件销毁时，进行回调函数取消
    this.$socket.unRegisterCallBack("trendData");
  },
  computed: {
    ...mapState(["theme"]),
    selectTypes() {
      if (!this.allData) {
        return [];
      } else {
        return this.allData.type.filter((item) => {
          return item.key !== this.choiceType;
        });
      }
    },
    showTitle() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.choiceType].title;
      }
    },
    // 设置给标题的样式
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: getThemeValue(this.theme).labelColor
      };
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + "px",
        backgroundColor: getThemeValue(this.theme).bgColor
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
      this.myChart = this.$echarts.init(this.$refs.trend_ref, this.theme);
      const initOption = {
        grid: {
          left: "3%",
          top: "30%",
          right: "4%",
          bottom: "1%",
          containLabel: true,
        },
        backgroundColor: getThemeValue(this.theme).bgColor,
        tooltip: {
          trigger: "axis",
        },
        legend: {
          left: 20,
          top: "15%",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
      };
      this.myChart.setOption(initOption);
    },
    // 参数ret就是服务端发送给客户端的图表数据
    getData(ret) {
      // const { data: ret } = await this.$http.get("trend");
      this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      // 半透明颜色值
      const colorArr1 = [
        "rgba(73, 146, 255, .5)",
        "rgba(124, 255, 178, .5)",
        "rgba(253, 221, 96, .5)",
        "rgba(255, 110, 118, .5)",
        "rgba(88, 217, 249, .5)",
      ];
      // 全透明颜色值
      const colorArr2 = [
        "rgba(73, 146, 255, 0)",
        "rgba(124, 255, 178, 0)",
        "rgba(253, 221, 96, 0)",
        "rgba(255, 110, 118, 0)",
        "rgba(88, 217, 249, 0)",
      ];
      // 类目轴数据
      const timeArr = this.allData.common.month;
      // y轴数据 series下的数据
      const valueArr = this.allData[this.choiceType].data;
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          smooth: true,
          stack: "map",
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });
      // 图例数据
      const legendArr = valueArr.map((item) => {
        return item.name;
      });
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.myChart.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };
      this.myChart.setOption(adapterOption);
      this.myChart.resize();
    },
    handleSelect(curType) {
      this.choiceType = curType;
      this.updateChart();
      this.showChoice = false;
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 999;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  // .select-con {
  //   background-color: #100c2a;
  // }
}
</style>