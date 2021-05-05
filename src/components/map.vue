<!--
 描述: 商家地图分布图表
 作者: Jack Chen
 日期: 2021-04-28
-->

<template>
  <div class="com-container">
    <div @click="revertMap" class="back" :style="btnStyle" v-show="isShow">
      返回
    </div>
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils";
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  data() {
    return {
      myChart: null,
      allData: null,
      mapData: {},
      titleFontSize: 0,
      isShow: false,
    };
  },
  created() {
    // 在组件创建完成之后，进行回调函数的注册
    this.$socket.registerCallBack("mapData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "mapData",
      chartName: "map",
      value: ""
    })
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("mapData");
  },
  computed: {
    ...mapState(["theme"]),
    btnStyle() {
      return {
        fontSize: this.titleFontSize / 2 + "px",
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
    async initChart() {
      this.myChart = this.$echarts.init(this.$refs.map_ref, this.theme);
      // 获取中国地图的矢量数据
      // 由于我们现在获取的地图矢量数据并不是从后端返回，所以不能使用this.$http
      const { data: ret } = await axios.get(
        `//${location.host}/static/map/china.json`
      );
      this.$echarts.registerMap("china", ret);
      const initOption = {
        title: {
          text: "▎ 商家分布",
          left: 20,
          top: 20,
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
        backgroundColor: getThemeValue(this.theme).bgColor,
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          // label: {
          //   show: true,
          //   color: "rgba(255, 255, 255, .7)"
          // },
          itemStyle: {
            areaColor: "#2E72BF",
            borderColor: "#333",
          },
        },
      };
      this.myChart.setOption(initOption);
      this.myChart.on("click", async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name);
        console.log(provinceInfo);
        // 需要获取这个省份的地图矢量数据
        // 判断当前所点击的这个省份的地图矢量数据在mapData中是否存在
        if (provinceInfo.key) {
          if (!this.mapData[provinceInfo.key]) {
            const { data: ret } = await axios.get(
              `//${location.host}${provinceInfo.path}`
            );
            this.mapData[provinceInfo.key] = ret;
            this.$echarts.registerMap(provinceInfo.key, ret);
          }

          this.isShow = true;
          const changeOption = {
            geo: {
              map: provinceInfo.key,
            },
          };
          this.myChart.setOption(changeOption);
        }
      });
    },
    getData(ret) {
      // 获取服务器数据，对this.allData进行赋值之后，调用updateChart方法更新图表
      // const { data: ret } = await this.$http.get("map");
      // console.log(ret);
      this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      // 处理图表需要的数据
      // 图例数据
      const legendArr = this.allData.map((item) => {
        return item.name;
      });
      const seriesArr = this.allData.map((item) => {
        // return这个对象代表是一个类别下的所有散点数据
        // 如果想在地图中显示散点数据，需要给散点图表增加一个配置，coordinateSystem: geo
        return {
          type: "effectScatter",
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
        };
      });
      const dataOption = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.myChart.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };
      this.myChart.setOption(adapterOption);
      this.myChart.resize();
    },
    // 返回中国地图
    revertMap() {
      this.isShow = false;
      const revertOption = {
        geo: {
          map: "china",
        },
      };
      this.myChart.setOption(revertOption);
    },
  },
};
</script>

<style lang="less" scoped>
.back {
  position: absolute;
  left: 24%;
  top: 5%;
  z-index: 999;
  color: #fff;
  cursor: pointer;
}
</style>