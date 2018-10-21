<template>
  <section
    class="marker-container"
    :class="{mactive: active, mclick: isClick}"
    @click="onHandleClick"
    @mouseenter="onSelectShoot"
    @mouseleave="onCancalShoot"
  >
    <span>{{marker.name}}</span>
    <span>{{marker.belong}}</span>
  </section>
</template>

<script>
export default {
  data() {
    return {
      active: false,
      isClick: false,
    };
  },

  props: {
    marker: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    word: {
      type: Object,
      default: () => ({}),
      require: true,
    },
  },

  watch: {
    marker(n, o) {
      this.onValidClick(n);
    },

    word(n, o) {
      if (n.id != o.id) {
        this.isClick = false;
      }
    }
  },

  mounted() {
    this.onValidClick(this.marker);
  },

  methods: {
    onSelectShoot() {
      this.active = true;
    },

    onCancalShoot() {
      this.active = false;
    },

    onHandleClick() {
      const { word, isClick } = this;
      // 取消 （冗余）
      if (isClick) {
        this.isClick = !isClick;
        this.$emit('select', this.marker);
        return;
      }
      // 限制 4 个 （耦合）
      if (word.mark_list && word.mark_list.length >= 4) {
        return;
      }

      this.isClick = !isClick;
      this.$emit('select', this.marker);
    },

    onValidClick(marker) {
      if (!this.word.mark_list) {
        return;
      }

      let instance = this.word.mark_list.find(item => item === marker.uuid);

      if (instance) {
        this.isClick = true;
        return;
      }

      this.isClick = false;
    }
  },
};
</script>

<style lang="scss" scope>
.marker-container {
  // border: 1px solid #1e1e1e;
  cursor: pointer;
  border-radius: 4px;
  padding: 10px 20px;
  background: #ffffff;
  width: 180px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
  // line-height: 60px;

  box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
    2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px 2px 2px 0 rgba(40, 120, 255, 0.08);

  span:nth-of-type(1) {
    // user-select: none;
    font-size: 18px;
  }

  span:nth-of-type(2) {
    display: block;
    font-size: 14px;
    color: #288ed8;
  }

  transition: all 0.1s;
}

.mactive {
  // width: 240px;
  color: #ffffff;
  background-color: #2a92dc;

  span:nth-of-type(2) {
    display: block;
    font-size: 14px;
    color: #ffffff;
  }
}

.mclick {
  color: #ffffff;
  background-color: #3c9e44;

  span:nth-of-type(2) {
    display: block;
    font-size: 14px;
    color: #ffffff;
  }
}
</style>
