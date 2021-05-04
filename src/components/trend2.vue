<!--
 描述: 销量趋势图表统计
 作者: Jack Chen
 日期: 2021-04-28
-->

<template>
  <div class="com-container">
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            myChart: null,
            allData: null
        }
    },
    mounted() {
        this.initChart();
        this.getData();
        window.addEventListener('resize', this.screenAdapter);
        this.screenAdapter();
    },
    destroyed() {
        window.removeEventListener('resize', this.screenAdapter);
    },
    methods: {
        initChart() {
            this.myChart = this.$echarts.init(this.$refs.trend_ref);
            const initOption = {

            }
            this.myChart.setOption(initOption);
        },
        getData() {
            this.updateChart();
        },
        updateChart() {
            const dataOption = {

            }
            this.myChart.setOption(dataOption);
        },
        screenAdapter() {
            const adapterOption = {

            }
            this.myChart.setOption(adapterOption);
            this.myChart.resize();
        }
    }
}
</script>
<style lang="less" scoped>

</style>