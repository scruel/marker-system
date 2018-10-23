<template>
  <section
    v-if="destroy"
    class="word-container"
  >
    <div
      ref="node"
      :class="{animation: activity}"
    >
      <span>{{word.word}}</span>
    </div>
    <!-- <div v-if="visible">
      <span style="opacity: 0;">{{alternative.word}}</span>
    </div>-->
  </section>
</template>

<script>
export default {
  data() {
    return {
      activity: false,
      offsetX: 0,
      offsetY: 0,
      destroy: true,
      visible: false,
    };
  },

  props: {
    word: {
      type: Object,
      default: () => ({
        color: {
          'border-color': '#ffffff',
          color: '#ffffff',
        },
      }),
    },

    serial: {
      type: Number,
      default: 0,
    },

    alternative: {
      type: Object,
      default: () => ({}),
    },

    marker: {
      type: Object,
      default: () => ({}),
    },
  },

  mounted() {},

  methods: {
    onMouseDown(event) {
      const offsetX = event.target.offsetLeft;
      if (!this.offsetX) {
        this.offsetX = offsetX;
      }

      const offsetY = event.target.offsetTop;
      if (!this.offsetY) {
        this.offsetY = offsetY;
      }

      this.$refs.node.style.left = `${offsetX}px`;
      this.$refs.node.style.top = `${offsetY}px`;

      if (!this.activity) {
        this.activity = true;
        this.visible = true;
      }

      document.onmousemove = this.onMouseMove.bind(this);
      document.onmouseup = this.onMouseUp.bind(this);

      this.$emit('select', this.word);
    },

    onMouseMove(event) {
      // if (!this.activity) {
      //   return;
      // }
      window.getSelection().removeAllRanges();

      const x = event.clientX + 15;
      const y = event.clientY + 15;
      this.$refs.node.style.left = `${x}px`;
      this.$refs.node.style.top = `${y}px`;
    },

    onMouseUp() {
      window.getSelection().removeAllRanges();

      const { offsetX, offsetY } = this;
      this.$refs.node.style.left = `${offsetX}px`;
      this.$refs.node.style.top = `${offsetY}px`;

      document.onmousemove = null;
      document.onmouseup = null;

      if (this.marker) {
        this.$emit('answer', this.serial);
        // this.destroy = false;
        this.activity = false;
        this.visible = false;
        return;
      }

      if (this.activity) {
        this.activity = false;
        this.visible = false;
        this.$emit('cancal', null);
      }
    },
  },
};
</script>

<style lang="scss" scope>
.word-container {
  border-radius: 4px;

  box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
    2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px 2px 2px 0 rgba(40, 120, 255, 0.08);

  div {
    // cursor: move;
    border: 1px solid #ffffff;
    border-radius: 4px;
    padding: 10px 20px;
    color: #ffffff;

    transition: all 0.1s;
  }

  span {
    user-select: none;
    // user-select: all;
  }
}

.animation {
  position: fixed;
  z-index: 10;
  border: 0px !important;
  background-color: #2b96e0;
}

@media only screen and (max-width: 420px) {
  .word-container {
    border-radius: 4px;

    div {
      padding: 5px 10px;
      text-align: center;
    }

    span {
      font-size: 16px;
    }
  }
}
</style>
