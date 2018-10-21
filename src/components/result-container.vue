<template>
    <section
        v-if="complete"
        class="result-container"
    >
        <dir class="modal" />
        <div class="icon-tip">
            <img
                src="../assets/image/check.png"
                alt=""
            >
            <span @click="onHandleExit">任务达成</span>
        </div>
    </section>
</template>
    
<script>
import Cookies from '../lib/cookies';

export default {
  data() {
    return {}
  },

  props: {
    complete: {
        type: Boolean,
        default: false,
    },
  },

  methods: {
      onHandleExit() {
          Cookies.setCookie('token', '');
          window.location.reload();
      }
  }
}
</script>
    
<style lang="scss" scope>
.result-container {
  position: fixed;
  z-index: 10;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  .modal {
    width: 100%;
    height: 100%;
    background-color: rgba(50, 47, 81, 0.9);
  }

  .icon-tip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    width: 360px;
    //   height: 240px;
    background-color: #ffffff;
    border-radius: 10px;

    box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
      2px -2px 2px 0 rgba(40, 120, 255, 0.08),
      -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
      -2px 2px 2px 0 rgba(40, 120, 255, 0.08);

    span {
      cursor: pointer;
      display: block;
      width: 100%;
      font-size: 24px;
      text-align: center;
      padding: 20px 0px;
      border-top: 1px solid #03ddff;
    }
  }
}
</style>