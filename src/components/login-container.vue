<template>
  <section
    v-if="visible"
    class="login-container"
  >
    <div class="login-block">
      <h3>微云问卷</h3>
      <div class="input-item">
        <span>用户名</span>
        <input
          type="text"
          v-model="student"
        >
      </div>
      <div
        class="button-item"
        @click="handlerLogin"
      >
        <span>登录</span>
      </div>
    </div>
  </section>
</template>
    
<script>
export default {
  data() {
    return {
      student: '',
    };
  },

  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    handlerLogin() {
      const { student } = this;

      if (!student) {
        this.$emit('error', {
          message: '请输入学号 ！',
        });

        return;
      }

      this.$emit('login', student);
    },
  },
};
</script>
    
<style lang="scss" scope>
.login-container {
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, #135fab, #32a5ee);
  //   border-radius: 6px;

  .login-block {
    border-radius: 4px;
    padding: 20px 20px;
    background-color: #ffffff;
    font-size: 18px;
    box-shadow: 2px 2px 4px #3ba3ff;

    h3 {
      text-align: center;
      color: #616366;
    }

    .input-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 25px;

      span {
        font-weight: bold;
        color: #616366;
      }

      input {
        padding: 10px 0px;
        border: 0px;
        outline: 0px;
        color: #616366;
        font-size: 16px;
        border-bottom: 1px solid #e2e2e2;
      }
    }

    .button-item {
      background-color: #3ba3ff;
      cursor: pointer;

      width: 240px;
      height: 42px;

      font-weight: bold;
      color: #ffffff;
      text-align: center;
      line-height: 42px;

      border-radius: 2px;
    }
  }
}
</style>
