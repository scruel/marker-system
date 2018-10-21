<template>
  <div id="app">
    <div class="container">
      <login-container
        :visible="visible"
        @login="onStudentLogin"
        @error="onHandleError"
      />
      <user-container :username="username" />
      <div class="word-list">
        <word-container :word="word" />
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
        <switch-container
          :direction="false"
          @prev="onPrevWord"
        />
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
        <switch-container
          :direction="true"
          @next="onNextWord"
        />
      </div>
      <tip-container
        :message="message"
        ref="tip"
      />
      <count-container
        :count="count"
        :task="task"
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
import CountContainer from "./components/count-container";
import UserContainer from "./components/user-container";

import Marker from "./config/marker";
import Category from "./config/category";

import { login, subject, commit, mark, valid } from "./api/api";
import Cookies from './lib/cookies';
import category from './config/category';

export default {
  name: 'App',

  data() {
    return {
      categorys: Category.data,
      markers: Marker.data,
      token: '',
      visible: true,
      alternative: null,
      pointer: 0,
      word: {},
      words: [],
      category: null,
      answer: [],
      message: '',
      count: 0,
      colors: ['#4caf50', '#607d8b', '#e24045', '#ffc700'], 
      username: '',
      task: 0,
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
    UserContainer,
  },

  created() {
   const token =  Cookies.getCookie('token');

   const count =  window.sessionStorage.getItem('count');
   const username = window.sessionStorage.getItem('username');
   const task = window.sessionStorage.getItem('task');
   this.count = Number.parseInt(count);
   this.task = Number.parseInt(task);
   this.username = username;

   if (token) {
     this.visible = false;
     this.token = token;
     this.onNetworkValid(token);
     this.onNetworkSubject(token);
   }
  },

  watch: {
    pointer(n) {
      if (n && !(n % 75)) {
        this.onNetworkSubject(this.token);
      }
    },
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

    onSelectMarker(marker) {
      const { word } = this;

      let temp = word.mark_list;

      if (!temp) {
        this.word = Object.assign({}, word, {
          mark_list: [marker.uuid],
        });
        return;
      }

      let instance = temp.find(item => item === marker.uuid);
      if (instance) {
        let ntemp = temp.filter(item => item !== marker.uuid);
        this.word = Object.assign({}, word, {
          mark_list: ntemp,
        });
        return;
      }

      temp.push(marker.uuid);
      this.word = Object.assign({}, word, {
        mark_list: temp,
      });
    },

    onCancalMarker() {
      this.marker = null;
    },

    onBuildAnswer(serial) {
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
      let { pointer, answer } = this;

      if (0 >= pointer) {
        return;
      }

      pointer -= 1;
      
      let temp  = answer[pointer];
      this.word = Object.assign({}, temp, {
        old_mark_list: [].concat(temp.mark_list) ,
      });
      
      this.pointer = pointer;
      this.category = null;
    },

    onNextWord() {
      const { pointer, words, word, token } = this;
      
      if (pointer >= words.length) {
        return;
      }

      let mark_result = {
        token,
        word_id: word.id,
        mark_list: word.mark_list || [],
      };

      if (word.old_mark_list) {
        mark_result = Object.assign({}, mark_result, {
          old_mark_list: word.old_mark_list,
        });
      } else {
        this.answer.push(word);
        this.count += 1;        
        window.sessionStorage.setItem('count', this.count);
      }

      this.onNetworkMark(mark_result);

      this.word = pointer + 1 < this.answer.length ? Object.assign({}, this.answer[pointer + 1], {
        old_mark_list: [].concat(this.answer[pointer + 1].mark_list),
      }) : Object.assign({}, words[pointer + 1], {
        mark_list: [],
        color: {
          'background-color': this.colors[(pointer + 1) % 4]
        },
      });
      this.pointer += 1;
      this.category = null;
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

      if(data.status) {
        this.message = data.msg;
        this.$refs.tip.handlerError();
        return;
      }

      Cookies.setCookie('token', data.token);
      this.visible = false;
      this.username = student_id,
      this.token = data.token;
      window.sessionStorage.setItem('username', student_id);
      this.count = data.action_cnt;
      this.task = data.require_cnt;
      window.sessionStorage.setItem('task', data.require_cnt);
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

      if (data.status) {
        this.visible = true;
        Cookies.setCookie('token', '');
        window.sessionStorage.setItem('username', '');
        return;
      }

      const temp = data.data.filter(id => !!id).map(item =>  Object.assign({}, item, {
        count: 0,
      }));

      if(this.pointer > 1) {
        this.words = this.words.concat(temp);
        return;
      }

      this.words = temp;
      this.word = Object.assign({}, temp[0], {
        mark_list: [],
      });
    },

    async onNetworkMark(marker) {
      const { data } = await mark(marker).catch((error) => {});
      
      if(data.status) {
        Cookies.setCookie('token', '');
        this.visible = true;
        return;
      }
    },

    async onNetworkValid(token) {
      const { data } = await valid({
        token,
      }).catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });

      if(data.status) {
        Cookies.setCookie('token', '');
        this.visible = true;
        return;
      }

      // this.token = data.token;
      this.count = data.action_cnt;
    },
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
  justify-content: center;
  box-shadow: 2px 0px 4px 0 rgba(40, 120, 255, 0.08);

  font-size: 32px;

  // width: 200px;
  height: 120px;
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
  padding: 20px 30px;

  flex: 1;
  display: flex;
  // flex-wrap: wrap;
  align-items: center;
  // justify-content: center;
  justify-content: space-between;

  .marker-container {
    margin-left: 20px;
    margin-bottom: 10px;
  }

  .switch-container:nth-of-type(1) {
    border-radius: 50%;
    background-color: #288fd9;
  }

  .switch-container:nth-of-type(2) {
    border-radius: 50%;
    background-color: #288fd9;
  }
}
</style>
