<!--
 描述: 销量排行图表统计
 作者: Jack Chen
 日期: 2021-04-28
-->

<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            myChart: null,
            allData: null,
            startValue: 0, // 区域缩放的起点值
            endValue: 9, // 区域缩放的终点值
            timer: null // 定时器的标识
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
        clearInterval(this.timer);
    },
    methods: {
        initChart() {
            this.myChart = this.$echarts.init(this.$refs.rank_ref, 'dark');
            const initOption = {
                title: {
                    text: '▎ 地区销售排行',
                    left: 20,
                    top: 20
                },
                grid: {
                    top: '40%',
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        type: 'bar'
                    }
                ]
            }
            this.myChart.setOption(initOption);
            this.myChart.on('mouseover', () => {
                clearInterval(this.timer);
            })
            this.myChart.on('mouseout', () => {
                this.startInterval();
            })
        },
        async getData() {
            const {data: ret} = await this.$http.get('rank');
            console.log(ret);
            this.allData = ret;
            this.allData.sort((a, b) => {
                return b.value - a.value;
            })
            this.updateChart();
            this.startInterval();
        },
        updateChart() {
            const colorArr = [
                ['#0BA82C', '#4FF778'],
                ['#2E728F', '#23E5E5'],
                ['#5052EE', '#AB6EE5']
            ]
            // 所有省份形成的数组
            const provinceArr = this.allData.map(item => {
                return item.name;
            })
            // 所有省份对应的销售金额
            const valueArr = this.allData.map(item => {
                return item.value;
            })
            const dataOption = {
                dataZoom: {
                    show: false,
                    startValue: this.startValue,
                    endValue: this.endValue
                },
                xAxis: {
                    data: provinceArr
                },
                series: [
                    {
                        data: valueArr,
                        itemStyle: {
                            color: arg => {
                                let targetColorArr = null;
                                if (arg.value > 300) {
                                    targetColorArr = colorArr[0];
                                } else if (arg.value > 200) {
                                    targetColorArr = colorArr[1];
                                } else {
                                    targetColorArr = colorArr[2];
                                }
                                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: targetColorArr[0]
                                    },
                                    {
                                        offset: 1,
                                        color: targetColorArr[1]
                                    }
                                ]);
                            }
                        }
                    }
                ]
            }
            this.myChart.setOption(dataOption);
        },
        screenAdapter() {
            const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6;
            const adapterOption = {
                title: {
                    textStyle: {
                        fontSize: titleFontSize
                    }
                },
                series: [
                    {
                        barWidth: titleFontSize,
                        itemStyle: {
                            borderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
                        }
                    }
                ]
            }
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
            }, 2000)
        }
    }
}
</script>
<style lang="less" scoped>

</style>