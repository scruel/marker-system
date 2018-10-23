<template>
  <section
    v-if="commit"
    class="result-container"
  >
    <div
      class="modal"
      @click="onCloseModal"
    />
    <div class="icon-tip">
      <div>
        <img
          src="../assets/image/question.png"
          alt=""
        >
        <!-- <span>提交之后无法取消, 请确认是否提交</span> -->
      </div>
      <div>
        <span @click="onHandleCommit">提交</span>
        <!-- <span >取消</span> -->
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {
    commit: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onHandleCommit() {
      this.$emit('commit');
    },

    onCloseModal() {
      this.$emit('close');
    },
  },
};
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
    width: 300px;
    //   height: 240px;
    background-color: #ffffff;
    border-radius: 10px;

    box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
      2px -2px 2px 0 rgba(40, 120, 255, 0.08),
      -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
      -2px 2px 2px 0 rgba(40, 120, 255, 0.08);

    div:nth-of-type(1) {
      border-top: 0px solid #03ddff;
      // span {
      //   font-size: 12px;
      // }
    }

    div:nth-of-type(2) {
      border-top: 1px solid #03ddff;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        cursor: pointer;
        flex: 1;
        display: inline-block;
        font-size: 24px;
        text-align: center;
        // padding: 20px 10px;
        // width: 50%;
        text-align: center;
        padding: 10px 0px;
      }

      span:nth-of-type(1) {
        color: #c72923;
      }

      // span:nth-of-type(2) {
      //   color: #1296db;
      // }
    }
  }
}
</style>
