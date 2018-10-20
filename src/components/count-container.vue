<template>
    <section class="count-container">
        <div>{{count}}</div>
    </section>
</template>
    
<script>
export default {
  data() {
    return {}
  },

  props: {
      count: {
          type: Number,
          default: 0,
      }
  }
}
</script>
    
<style lang="scss" scope>
.count-container {
  position: fixed;
  bottom: 20px;
  right: 20px;

  width: 40px;
  height: 40px;
  border-radius: 50%;

  line-height: 40px;
  text-align: center;

  box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
    2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px 2px 2px 0 rgba(40, 120, 255, 0.08);
}
</style>