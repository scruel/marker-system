<template>
  <section
    class="count-container"
  >
    <div>
      <span>{{count}}/{{task}}</span>
      <span>(已标记词汇)</span>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {
    count: {
      type: Number,
      default: 0,
    },
    task: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scope>
.count-container {
  position: fixed;
  bottom: 130px;
  right: 20px;

  width: 90px;
  height: 90px;
  border-radius: 50%;

  color: #c2251f;
  //   line-height: 40px;
  text-align: center;
  background-color: #ffffff;
  box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
    2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px 2px 2px 0 rgba(40, 120, 255, 0.08);
  // transform: scale(0.75);

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80px;

    span:nth-of-type(2) {
      font-size: 10px;
    }
  }
}
</style>
