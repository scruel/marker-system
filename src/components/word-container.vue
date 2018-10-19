<template>
  <section
    v-if="destroy"
    class="word-container"
  >
    <div
      ref="node"
      :class="{animation: activity}"
      @mousedown="onMouseDown"
    >
      <span>{{word}}</span>
    </div>
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
    };
  },

  props: {
    word: {
      type: String,
      default: '',
    },
    marker: {
      type: String,
      default: '',
    },
  },

  mounted() {

  },

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
      }

      document.onmousemove = this.onMouseMove.bind(this);
      document.onmouseup = this.onMouseUp.bind(this);

      this.$emit('select', this.word);
    },

    onMouseMove(event) {
      // if (!this.activity) {
      //   return;
      // }

      const x = event.clientX + 5;
      const y = event.clientY + 5;
      this.$refs.node.style.left = `${x}px`;
      this.$refs.node.style.top = `${y}px`;
    },

    onMouseUp() {
      document.onmousemove = null;
      document.onmouseup = null;

      if (this.marker) {
        this.$emit('answer');
        this.destroy = false;
        return;
      }

      if (this.activity) {
        this.activity = false;
      }
    },
  },
};
</script>

<style lang="scss" scope>
.word-container {
  div {
    border: 1px solid #ffffff;
    border-radius: 4px;
    padding: 5px 20px;
    color: #ffffff;

    transition: all 0.1s;
  }

  span {
    user-select: none;
  }
}

.animation {
  position: absolute;
  z-index: 100;
  border: 0px;
  background-color: #1e1e1e;
}
</style>
