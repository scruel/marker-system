<template>
  <div id="app">
    <div class="container">
      <login-container
        :visible="visible"
        @login="onStudentLogin"
        @error="onHandleError"
      />
      <div
        class="navbar-block"
      >
        <div
          class="shadow-block"
        >
          <img
            class="logo"
            src="./assets/image/logo.png"
            alt=""
          >
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
        <div
          class="shadow-block"
        >
          <search-container
            :word="word"
            @search="onHandlerSearch"
          />
          <div
            class="username"
          >{{username}}</div>
          <user-container/>
        </div>
      </div>
      <!-- <div class="category-list">
        <div class="shadow-block">
        </div>
        <div />
      </div>-->
      <div
        class="marker-list"
      >
        <marker-container
          v-for="(item, index) in MarkersProxy"
          :key="index"
          :marker="item"
          :word="word"
          @select="onSelectMarker"
          @cancal="onCancalMarker"
        />
      </div>
      <div class="word-list">
        <switch-container
          :direction="false"
          @prev="onPrevWord"
        />
        <div
          class="word-block"
        >
          <word-container
            :word="word"
          />
          <span
            v-if="word_tip"
            class="word-tip"
          >至多可选 4 个分类</span>
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
      <result-container
        :complete="complete"
      />
    </div>
  </div>
</template>

<script>
import MarkerContainer from './components/marker-contianer';
import WordContainer from './components/word-container';
import LoginContainer from './components/login-container';
import TipContainer from './components/tip-container';
import SwitchContainer from './components/switch-container';
import CategoryContainer from './components/category-container';
import SearchContainer from './components/search-container';
import CountContainer from './components/count-container';
import UserContainer from './components/user-container';
import ResultContainer from './components/result-container';

import Marker from './config/marker';
import Category from './config/category';

import { login, subject, commit, mark, valid } from './api/api';
import Cookies from './lib/cookies';

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
      word_tip: false,
      complete: false,
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
    ResultContainer,
  },

  created() {
    const token = Cookies.getCookie('token');

    const count = window.sessionStorage.getItem('count');
    const username = window.sessionStorage.getItem('username');
    const task = window.sessionStorage.getItem('task');
    this.count = Number.parseInt(count) || 0;
    this.task = Number.parseInt(task) || 0;
    this.username = username;

    if (this.count >= this.task) {
      this.complete = true;
    }

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
    word(n) {
      // clearTimeout(this.timer);

      if (n.mark_list && n.mark_list.length === 4) {
        // this.word_tip = true;
        // this.timer = setTimeout(() => {
        //   this.word_tip = false;
        // }, 300);
        this.word_tip = true;
        return;
      }

      this.word_tip = false;
    },
  },

  computed: {
    MarkersProxy() {
      if (!this.category) return this.markers;

      return this.markers.filter(item => item.belong === this.category.name);
    },
    // UsernameProxy() {
    //   return String.prototype.toUpperCase.apply(this.username);
    // }
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

    onBuildAnswer(serial) {},

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
      let { pointer, answer, word } = this;

      if (0 >= pointer) {
        return;
      }

      answer[pointer] = word;

      pointer -= 1;

      let temp = answer[pointer];

      this.word = Object.assign({}, temp, {
        old_mark_list: [].concat(temp.mark_list),
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
        this.answer[pointer] = word;
        mark_result = Object.assign({}, mark_result, {
          old_mark_list: word.old_mark_list,
        });
      } else {
        this.answer.push(word);
        this.count += 1;
        window.sessionStorage.setItem('count', this.count);
      }

      this.onNetworkMark(mark_result);

      this.word =
        pointer + 1 < this.answer.length
          ? Object.assign({}, this.answer[pointer + 1], {
              old_mark_list: [].concat(this.answer[pointer + 1].mark_list),
            })
          : Object.assign({}, words[pointer + 1], {
              mark_list: [],
              color: {
                'background-color': this.colors[(pointer + 1) % 4],
              },
            });
      this.pointer += 1;
      this.category = null;

      if (this.task && this.count === this.task) {
        this.complete = true;
      }
    },

    async onNetworkLogin(student_id) {
      const { data } = await login({
        student_id,
      }).catch(error => {
        this.message = '抱歉，你无权进行数据标记';
        this.$refs.tip.handlerError();
      });

      if (data.status) {
        this.message = data.msg;
        this.$refs.tip.handlerError();
        return;
      }

      Cookies.setCookie('token', data.token);
      this.visible = false;
      this.username = student_id;
      this.token = data.token;
      window.sessionStorage.setItem('username', student_id);
      this.count = data.action_cnt;
      this.task = data.require_cnt;
      window.sessionStorage.setItem('task', data.require_cnt);

      if (data.action_cnt >= data.require_cnt) {
        this.complete = true;
        return;
      }
      // 获取题目
      this.onNetworkSubject(data.token);
    },

    async onNetworkSubject(token, count = 100) {
      const { data } = await subject({
        token,
        count,
      }).catch(error => {
        this.visible = true;
      });

      if (data.status) {
        this.visible = true;
        Cookies.setCookie('token', '');
        window.sessionStorage.setItem('username', '');
        return;
      }

      if (data.data && !data.data.length) {
        window.location.reload();
        return;
      }

      const temp = data.data.filter(id => !!id).map(item =>
        Object.assign({}, item, {
          count: 0,
        }),
      );

      if (this.pointer > 1) {
        this.words = this.words.concat(temp);
        return;
      }

      this.words = temp;
      this.word = Object.assign({}, temp[0], {
        mark_list: [],
      });
    },

    async onNetworkMark(marker) {
      const { data } = await mark(marker).catch(error => {});

      if (data.status) {
        Cookies.setCookie('token', '');
        this.visible = true;
        return;
      }
    },

    async onNetworkValid(token) {
      const { data } = await valid({
        token,
      }).catch(err => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });

      if (data.status) {
        Cookies.setCookie('token', '');
        this.visible = true;
        return;
      }

      // this.token = data.token;
      this.count = data.action_cnt;
    },

    async onNetworkCommit() {
      const { data } = await commit().catch(err => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
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

.navbar-block {
  // position: fixed;
  // top: 0px;
  padding: 5px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // background-color: #1c74bf;
  border-bottom: 1px solid #03ddff;
  box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
    2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px 2px 2px 0 rgba(40, 120, 255, 0.08);

  .logo {
    width: 42px;
    height: 42px;
    margin-right: 10px;
  }

  .search-container {
    margin-right: 10px;
  }

  .username {
    display: block;
    color: #2280ca;
    height: 36px;
    border-radius: 2px;
    padding: 0px 10px;
    line-height: 36px;

    margin-right: 10px;
  }
}

.shadow-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.category-list {
  padding: 20px 80px 0px 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .category-container {
    margin-left: 10px;
    // margin-bottom: 10px;
  }
}

.word-list {
  position: fixed;
  bottom: 0px;
  width: 100%;
  display: flex;
  flex: 1;
  // flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-shadow: 2px 0px 4px 0 rgba(40, 120, 255, 0.08);

  font-size: 32px;

  // width: 200px;
  height: 120px;

  padding: 20px 40px;
  // background-color: #1e1e1e;
  background: linear-gradient(to bottom right, #135fab, #32a5ee);

  .word-container {
    margin-bottom: 10px;
    // margin-left: 10px;
  }

  .word-block {
    display: flex;
    flex-direction: column;
    align-items: center;

    .word-tip {
      position: absolute;
      bottom: 10px;
      padding: 5px 10px;
      border-radius: 2px;
      color: #ffffff;
      font-size: 12px;
      text-align: center;
      background-color: #c72923;

      box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
        2px -2px 2px 0 rgba(40, 120, 255, 0.08),
        -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
        -2px 2px 2px 0 rgba(40, 120, 255, 0.08);
    }
  }
}

.marker-list {
  padding: 50px 30px 120px;

  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  // justify-content: space-between;

  .marker-container {
    margin-left: 20px;
    margin-bottom: 10px;
  }
}

.switch-container:nth-of-type(1) {
  border-radius: 50%;
  background-color: #288fd9;
}

.switch-container:nth-of-type(2) {
  border-radius: 50%;
  background-color: #288fd9;
}
</style>
