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
        <!-- <switch-container
          :direction="false"
          @prev="onPrevWord"
        /> -->
        <div />
        <div class="shadow-block">
          <word-container
            v-for="(item, index) in select"
            :key="index"
            :serial="index"
            :word="item"
            :alternative="alternative"
            :marker="marker"
            @select="onSelectWord"
            @cancal="onCannalWord"
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
          <div
            class="category-container"
            :class="{active: !this.category}"
            @click="onHandlerCategoryReset"
          >
            <span>全部</span>
          </div>
          <category-container
            v-for="(item, index) in categorys"
            :key="index"
            :channel="category"
            :category="item"
            :word="word"
            @category="onHandlerCategory"
          />
        </div>
        <!-- <search-container @search="onHandlerSearch" /> -->
        <div />
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
      <count-container :count="count" />
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
import CountContainer from "./components/count-container";

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
      work_count: 0,
      words: [],
      marker: null,
      markers: Marker.data,
      categorys: Category.data,
      category: null,
      message: '',
      answer: new Map(),
      answer_serial: [],
      count: 0,
      colors: ['#4caf50', '#607d8b', '#e24045', '#ffc700'], 
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
    CountContainer,
  },

  created() {
   const token =  Cookies.getCookie('token');

   const count =  window.sessionStorage.getItem('count');

   if (token) {
     this.visible = false;
     this.token = token;
     this.onNetworkSubject(token);
   }
  },

  watch: {
    pointer(n) {
      if (!(n % 75)) {
        this.onNetworkSubject(this.token);
      }
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

    onCannalWord() {
      this.word = null;
    },

    onSelectMarker(marker) {
      this.marker = marker;
    },

    onCancalMarker() {
      this.marker = null;
    },

    onBuildAnswer(serial) {
      const { answer, answer_serial, marker, word, shadow } = this;

      this.words = this.words.map(item => {
        if (item.id == word.id) {
          item.count = item.count + 1;
        }
        return item;
      });

      const model = answer.get(word.id) || [];
      
      model.push(marker.uuid);

      answer.set(word.id, model);
      
      // if (shadow && shadow.id != word.id) {
      //   answer_serial.push(shadow.id);
      //   let temp = [];
      //   for (let i = 0; i < 3 - model.length; i++) {
      //     temp.push(Object.assign({}, word, {
      //       color: {
      //         'background-color': this.colors[0],
      //       },
      //     }));
      //   }
      //   for (let i = 0; i < 1 + model.length; i++) {
      //     temp.push(Object.assign({}, this.words[this.pointer + 1], {
      //       color: {
      //         'background-color': this.colors[1],
      //       },
      //     }));
      //   } 
      //   this.select = temp;
      //   this.pointer += 1;
      // } else {
      //   this.select[serial] = Object.assign({}, this.alternative, {
      //     color: {
      //       'background-color': this.colors[1],
      //     },
      //   }) ;
      //   this.alternative = this.words[this.pointer];
      // }

      if (shadow && shadow.id != word.id) {
        answer_serial.push(shadow.id);
        let temp = [];
        for (let i = 0; i < 4 - model.length; i++) {
          temp.push(Object.assign({}, word, {
            color: {
              'background-color': this.colors[0],
            },
          }));
        }
        for (let i = 0; i < model.length; i++) {
          temp.push(Object.assign({}, this.words[this.pointer + 1], {
            color: {
              'background-color': this.colors[1],
            },
          }));
        } 
        this.select = temp;
        this.pointer += 1;
      } else {
        this.select[serial] = Object.assign({}, this.alternative, {
          color: {
            'background-color': this.colors[1],
          },
        });
        this.alternative = this.words[this.pointer];
        this.work_count += 1;
      }

      if(this.work_count == 4) {
        this.pointer += 1;
        this.select = this.select.map(item => Object.assign({}, item, {
          color: {
            'background-color': this.colors[0],
          },
        }));
        this.work_count = 0;
      }

      this.shadow = word;
      this.word = null;
      this.marker = null;

      console.log('====================================');
      console.log(answer_serial);
      console.log('====================================');

      if (this.answer.size && !(this.answer.size % 3)) {
        const word_id = answer_serial.shift();
        const token = this.token;
        const mark_list = this.answer.get(word_id);
        this.onNetworkMark({
          token,
          word_id,
          mark_list,
        });
        this.answer.delete(word_id);
        this.count += 1;
        window.sessionStorage.setItem('count', this.count);
      }

      console.log('====================================');
      console.log(answer_serial);
      console.log('====================================');

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
      if (!category) {
        this.category = null;
        return;
      }
      
      if (this.category && this.category.name == category.name) {
        this.category = null;
        return;
      }

      this.category = category;
    },

    onHandlerCategoryReset() {
      this.category = null;
    },

    onPrevWord() {
      const { pointer, words } = this;
      
      if (0 < pointer) {
        return;
      }
      
      const work = this.words[pointer - 1];
      let temp = [];

      for (let i = 0; i < 4; i++) {
        temp.push(word);
      }

      this.select = temp;
      this.pointer -= 1;
    },

    onNextWord() {
      const { pointer, answer, words, token } = this;
      
      if (pointer > words.length) {
        return;
      }
      
      const word = words[pointer];

      let temp = [];

      for (let i = 0; i < 4; i++) {
        temp.push(Object.assign({}, word, {
          color: {
            'background-color': this.colors[0],
          },
        }));
      }

      this.select = temp;
      this.pointer = this.pointer + 1;
      this.alternative = this.words[this.pointer + 1];

      const mark_list = answer.get(words[pointer - 1].id) || [];

      this.onNetworkMark({
        token,
        word_id: words[pointer - 1].id,
        mark_list,
      });

      if(answer.get(words[pointer - 1].id)) {
        this.answer.delete(word_id);
      }

      this.count += 1;
      window.sessionStorage.setItem('count', this.count);
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
      this.token = data.token;
      this.count = data.action_cnt;
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
        this.visible = true;
      });

      const temp = data.data.filter(id => !!id).map(item =>  Object.assign({}, item, {
        count: 0,
      }));

      if(this.pointer > 1) {
        this.words = this.words.concat(temp);
        return;
      }

      this.words = temp;
      
      for(let i = 0; i < 4; i += 1) {
        this.select.push(Object.assign({}, data.data[0], {
          color: {
            'background-color': this.colors[0],
          }
        }));
      }

      this.alternative = data.data[1];
      this.pointer = 1;
    },

    async onNetworkCommit(answer) {
      const { data } = await commit(answer).catch((error) => {
        
      });
    },

    async onNetworkMark(marker) {
      const { data } = await mark(marker).catch((error) => {});
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
    margin-left: 5px;
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
  height: 150px;
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
  padding: 30px;

  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  .marker-container {
    margin-left: 20px;
    margin-bottom: 10px;
  }
}
</style>
