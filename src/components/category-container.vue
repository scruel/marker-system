<template>
  <section
    class="category-container"
    :class="{active: active}"
    @click="handleCategory"
  >
    <span>{{category.name}}</span>
  </section>
</template>

<script>
export default {
  data() {
    return {
      active: false,
      clicks: true,
    };
  },

  props: {
    category: {
      type: Object,
      default: () => ({}),
    },

    channel: {
      type: Object,
      default: () => ({}),
    },

    word: {
      type: Object,
      default: () => ({}),
      require: true,
    },
  },

  watch: {
    channel(n) {
      if (!n || n.name !== this.category.name) {
        this.active = false;
        this.clicks = true;
      }
    },
  },

  methods: {
    handleCategory() {
      this.active = !this.active;
      this.clicks = !this.clicks;
      this.$emit('category', this.category);
    },

    onSelectShoot() {
      if (!this.word) {
        return;
      }
      this.timer = setTimeout(() => {
        this.active = true;
        this.$emit('category', this.category);
      }, 300);
    },

    onCancalShoot() {
      clearTimeout(this.timer);

      if (this.active && this.clicks) {
        this.$emit('category', null);
      }

      if (this.clicks) {
        this.active = false;
      }
    },
  },
};
</script>

<style lang="scss" scope>
.category-container {
  // border: 1px solid #1e1e1e;
  border-radius: 4px;
  padding: 5px 10px;
  //   background: #2280ca;
  color: #545652;
  // width: 240px;
  height: 40px;
  //   user-select: none;
  cursor: pointer;

  text-align: center;
  line-height: 30px;

  //   box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
  //     2px -2px 2px 0 rgba(40, 120, 255, 0.08),
  //     -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
  //     -2px 2px 2px 0 rgba(40, 120, 255, 0.08);

  span {
    // user-select: none;
  }
}

.active {
  //   background-color: #c72923;
  color: #217ec9;
}
</style>
