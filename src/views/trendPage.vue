<!--
 描述: 这个组件对应于路由 /trendPage 而展示，在这个组件中，通过子组件注册的方式，要显示出trend.vue这个组件
 作者: Jack Chen
 日期: 2021-04-28
-->

<template>
  <div class="com-page">
    <trend />
  </div>
</template>

<script>
import trend from "@/components/trend";

export default {
  components: {
    trend,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" scoped>
</style>