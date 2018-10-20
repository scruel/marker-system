<template>
  <div id="app">
    <div class="container">
      <login-container
        :visible="visible"
        @login="onStudentLogin"
        @error="onHandleError"
      />
      <div class="word-list">
        <!-- <word-container
          v-for="(item, index) in words"
          :key="index"
          :word="item"
          :marker="marker"
          @select="onSelectWord"
          @answer="onBuildAnswer"
        /> -->
        <switch-container
          :direction="false"
          @prev="onPrevWord"
        />
        <div class="shadow-block">
          <word-container
            v-for="(item, index) in select"
            :key="index"
            :serial="index"
            :word="item"
            :alternative="alternative"
            :marker="marker"
            @select="onSelectWord"
            @answer="onBuildAnswer"
          />
        </div>
        <switch-container
          :direction="true"
          @next="onNextWord"
        />
      </div>
      <div class="category-list">
        <div class="shadow-block">
          <category-container
            v-for="(item, index) in categorys"
            :key="index"
            :channel="category"
            :category="item"
            @category="onHandlerCategory"
          />
        </div>
        <search-container @search="onHandlerSearch" />
      </div>
      <div class="marker-list">
        <div class="shadow-block">
          <marker-container
            v-for="(item, index) in MarkersProxy"
            :key="index"
            :marker="item"
            :word="word"
            @select="onSelectMarker"
            @cancal="onCancalMarker"
          />
        </div>
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
import SwitchContainer from "./components/switch-container";
import CategoryContainer from "./components/category-container";
import SearchContainer from "./components/search-container";

import Marker from "./config/marker";
import Category from "./config/category";

import { login, subject, commit, mark } from "./api/api";
import Cookies from './lib/cookies';
import category from './config/category';

export default {
  name: 'App',

  data() {
    return {
      token: '',
      visible: true,
      select: [],
      alternative: null,
      pointer: 0,
      shadow: null,
      word: null,
      words: [],
      marker: null,
      markers: Marker.data,
      categorys: Category.data,
      category: null,
      message: '',
      answer: new Map(),
      answer_serial: [],
    };
  },

  components: {
    MarkerContainer,
    WordContainer,
    LoginContainer,
    TipContainer,
    SwitchContainer,
    CategoryContainer,
    SearchContainer,
  },

  created() {
   const token =  Cookies.getCookie('token');
   if (token) {
     this.visible = false;
     this.token = token;
     this.onNetworkSubject(token);
   }
  },

  computed: {
    MarkersProxy() {
      if (!this.category) return this.markers;
      return this.markers.filter(item => item.belong === this.category.name);
    },
  },

  methods: {
    onStudentLogin(user) {
      this.onNetworkLogin(user);
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

    onBuildAnswer(serial) {
      const { answer, answer_serial, marker, word, shadow } = this;
      const model = answer.get(word.id) || [];
      model.push(marker.uuid);
      answer.set(word.id, model);
      if (shadow  && shadow.id != word.id) {
        answer_serial.push(shadow.id);
        let temp = [];
        for (let i = 0; i < 4 - model.length; i++) {
          temp.push(word);
        }
        temp.push(this.words[this.pointer + 1]);
        this.select = temp;
        this.pointer += 1;
      } else {
        this.select[serial] = this.alternative;
        this.alternative = this.words[this.pointer];
      }
      
      this.shadow = word;
      this.word = null;
      this.marker = null;

      console.log('====================================');
      console.log(this.answer, answer_serial);
      console.log('====================================');

      if (this.answer.size && !(this.answer.size % 3)) {
        const word_id = answer_serial.unshift();
        console.warn(word_id);
        const token = this.token;
        const mark_list = this.answer.get(word_id);
        this.onNetworkMark({
          token,
          word_id,
          mark_list,
        });
        this.answer.delete(word_id);
      }
    },

    onHandleError(error) {
      const { message } = error;
      this.message = message;
      this.$refs.tip.handlerError();
    },

    onHandlerSearch(keyword) {
      const rege = new RegExp();
    },

    onHandlerCategory(category) {
      if (this.category && this.category.name == category.name) {
        this.category = null;
        return;
      }

      this.category = category;
    },

    onPrevWord() {
      const { pointer, words } = this;
      
      if (0 < pointer) {
        return;
      }
      
      const work = this.words[pointer - 1 ];
      let temp = [];

      for (let i = 0; i < 4; i++) {
        temp.push(word);
      }

      this.select = temp;
      this.pointer -= 1;
    },

    onNextWord() {
      const { pointer, words } = this;
      
      if (pointer > words.length) {
        return;
      }
      
      const word = words[pointer];
      let temp = [];

      for (let i = 0; i < 4; i++) {
        temp.push(word);
      }

      this.select = temp;
      this.pointer = this.pointer + 1;
    },

    async onNetworkLogin(student_id) {
      const { data } = await login(
        {
          student_id,
        }
      ).catch((error) => {
        this.message = '抱歉，你无权进行数据标记';
        this.$refs.tip.handlerError();
      });

      Cookies.setCookie('token', data.token);
      this.visible = false;
      this.token = token;
      // 获取题目
      this.onNetworkSubject(data.token);
    },

    async onNetworkSubject(token, count = 100) {
      const { data } = await subject(
        {
          token,
          count, 
        }
      ).catch((error) => {
        
      });

      this.words = data.data;

      for(let i = 0; i < 4; i += 1) {
        this.select.push(data.data[0]);
      }

      this.alternative = data.data[1];
      this.pointer = 1;
    },

    async onNetworkCommit(answer) {
      const { data } = await commit(answer).catch((error) => {
        
      });
    },

    async onNetworkMark(marker) {
      const { data } = await mark(marker).catch((error) => {

      });
    }
  },
};
</script>

<style lang="scss" scoped>
#app {
  min-height: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

// .word-list,
// .marker-list {
//   // height: 100%;
// }

.shadow-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.category-list {
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .category-container {
    margin-left: 10px;
    margin-bottom: 10px;
  }
}

.word-list {
  // position: fixed;
  display: flex;
  // flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-shadow: 2px 0px 4px 0 rgba(40, 120, 255, 0.08);

  // width: 200px;
  height: 200px;
  top: 0px;

  padding: 10px 20px;
  // background-color: #1e1e1e;
  background: linear-gradient(to bottom right, #135fab, #32a5ee);

  .word-container {
    margin-bottom: 10px;
    margin-left: 10px;
  }
}

.marker-list {
  padding-top: 10px;
  padding: 40px;

  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  .marker-container {
    margin-left: 10px;
    margin-bottom: 10px;
  }
}
</style>
