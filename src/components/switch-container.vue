<template>
    <section class="switch-container">
        <img
            v-if="!direction"
            src="../assets/image/left-circle.png"
            alt="prev"
            @click="handlerClick"
        >
        <img
            v-if="direction"
            src="../assets/image/right-circle.png"
            alt="next"
            @click="handlerClick"
        >
    </section>
</template>
    
<script>
export default {
  data() {
    return {}
  },

  props: {
    direction: {
        type: Boolean,
        default: false,
    },
  },

  methods: {
      handlerClick() {
         this.direction ? this.$emit('next') : this.$emit('prev'); 
      },
  },
}
</script>
    
<style lang="scss" scope>
.switch-container {
  cursor: pointer;

  img {
    user-select: none;
    width: 42px;
    height: 42px;
  }
}
</style>