<!--
 描述: 这个组件对应于路由 /mapPage 而展示，在这个组件中，通过子组件注册的方式，要显示出map.vue这个组件
 作者: Jack Chen
 日期: 2021-04-28
-->

<template>
  <div class="com-page">
    <Map />
  </div>
</template>

<script>
import Map from "@/components/map";

export default {
  components: {
    Map
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" scoped>
</style>