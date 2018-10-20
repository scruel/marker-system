<template>
    <section
        class="category-container"
        :class="{active: active}"
        @click="handleCategory"
        @mouseenter="onSelectShoot"
    >
        <span>{{category.name}}</span>
    </section>
</template>
    
<script>
export default {
  data() {
    return {
        active: false,
    }
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
          }
      },
  },

  methods: {
    handleCategory() {
        this.active = !this.active;
        this.$emit('category', this.category);
    },

    onSelectShoot() {
        if (!this.word) {
            return;
        }
        this.active = true;
        this.$emit('category', this.category);
    },

    onCancalShoot() {
        if (!this.word) {
            return;
        }
        this.active = false
        this.$emit('category', null);
    },
  }
}
</script>
    
<style lang="scss" scope>
.category-container {
  // border: 1px solid #1e1e1e;
  border-radius: 4px;
  padding: 5px 30px;
  background: #2280ca;
  color: #ffffff;
  // width: 240px;
  height: 50px;
  //   user-select: none;

  text-align: center;
  line-height: 40px;

  box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
    2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px 2px 2px 0 rgba(40, 120, 255, 0.08);

  span {
    // user-select: none;
  }
}

.active {
  background-color: #c72923;
}
</style>