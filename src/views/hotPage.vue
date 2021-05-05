<!--
 描述: 这个组件对应于路由 /hotPage 而展示，在这个组件中，通过子组件注册的方式，要显示出hot.vue这个组件
 作者: Jack Chen
 日期: 2021-04-28
-->

<template>
  <div class="com-page">
    <Hot />
  </div>
</template>

<script>
import Hot from "@/components/Hot";

export default {
  components: {
    Hot
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" scoped>
</style>