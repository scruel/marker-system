<template>
  <div id="app">
    <div class="container">
      <login-container
        :visible="visible"
        @login="onStudentLogin"
        @error="onHandleError"
      />
      <div class="word-list">
        <word-container
          v-for="(item, index) in words"
          :key="index"
          :word="item"
          :marker="marker"
          @select="onSelectWord"
          @answer="onBuildAnswer"
        />
      </div>
      <div class="marker-list">
        <marker-container
          v-for="(item, index) in markers"
          :key="index"
          :marker="item"
          :word="word"
          @select="onSelectMarker"
          @cancal="onCancalMarker"
        />
      </div>
      <tip-container
        :message="message"
        ref="tip"
      />
    </div>
  </div>
</template>

<script>
import MarkerContainer from './components/marker-contianer';
import WordContainer from './components/word-container';
import LoginContainer from "./components/login-container";
import TipContainer from "./components/tip-container";

export default {
  name: 'App',

  data() {
    return {
      visible: true,
      word: null,
      words: [
        '繁星',
        '雨落',
        '碎梦',
        '琐事',
      ],
      marker: null,
      markers: [
        '事物',
        '主观',
      ],
      answer: new Map(),
      message: '',
    };
  },

  components: {
    MarkerContainer,
    WordContainer,
    LoginContainer,
    TipContainer,
  },

  methods: {
    onStudentLogin(user) {
  
    },

    onSelectWord(word) {
      this.word = word;
    },

    onSelectMarker(marker) {
      this.marker = marker;
    },

    onCancalMarker() {
      this.marker = null;
    },

    onBuildAnswer() {
      const { answer, marker, word } = this;
      const model = answer.get(marker) || [];
      model.push(word);
      answer.set(marker, model);
      this.marker = null;
      this.word = null;
      console.log('====================================');
      console.log(answer);
      console.log('====================================');
    },

    onHandleError(error) {
      const { message } = error;
      this.message = message;
      this.$refs.tip.handlerError();
    }
  },
};
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
}

.container {
  display: flex;

  height: 100%;
}

.word-list,
.marker-list {
  height: 100%;
}

.word-list {
  // position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 0px 4px 0 rgba(40, 120, 255, 0.08);

  width: 200px;
  top: 0px;

  padding: 10px 20px;
  background-color: #1e1e1e;

  .word-container {
    margin-bottom: 10px;
  }
}

.marker-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  .marker-container {
    margin-left: 10px;
  }
}
</style>
