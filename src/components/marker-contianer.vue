<template>
  <section
    class="marker-container"
    @mouseenter="onSelectShoot"
    @mouseleave="onCancalShoot"
  >
    <span>{{marker}}</span>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {
    marker: {
      type: String,
      require: true,
    },
    word: {
      type: String,
      require: true,
    },
  },

  methods: {
    onSelectShoot() {
      if (!this.word) {
        return;
      }
      this.$emit('select', this.marker);
    },

    onCancalShoot() {
      this.$emit('cancal', null);
    },
  },
};
</script>

<style lang="scss" scope>
.marker-container {
  // border: 1px solid #1e1e1e;
  border-radius: 4px;
  padding: 5px 20px;
  background: #ffffff;
  width: 240px;
  height: 60px;

  text-align: center;
  line-height: 60px;

  box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
    2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px 2px 2px 0 rgba(40, 120, 255, 0.08);

  span {
    user-select: none;
  }
}
</style>
