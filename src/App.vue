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
            :category="category"
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
      <!-- <div
        class="marker-list marker-bottom"
      >
        <marker-container
          v-for="(item, index) in MarkersProxyList"
          :key="index"
          :marker="item"
          :word="word"
          @select="onSelectMarker"
          @cancal="onCancalMarker"
        />
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
          @tip="onTipMarker"
        />
      </div>
      <div class="word-list">
        <switch-container
          :direction="false"
          @prev="onPrevWord"
          :class="{forbid: !pointer}"
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
          >至多可选 6 个分类</span>
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
        @complete="onHandleComplete"
        @answer="onHandleNextAnswer"
      />
      <commit-container
        :commit="commit"
        @commit="onHanlerCommit"
        @close="onHanlerClose"
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
import CommitContainer from './components/commit-container';

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
      visible: true, // 登陆弹框
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
      word_tip: false, // 显示词语弹框
      complete: false, // 显示完成弹框
      log_time: 0,
      commit: false, // 显示确认提交弹框
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
    CommitContainer,
  },

  created() {
    const token = Cookies.getCookie('token');

    const count = window.sessionStorage.getItem('count');
    const username = window.sessionStorage.getItem('username');
    const task = window.sessionStorage.getItem('task');
    this.count = Number.parseInt(count, 10) || 0;
    this.task = Number.parseInt(task, 10) || 0;
    this.username = username;

    // 防止无限提交
    if (this.task && this.count >= this.task) {
      this.complete = true;
    }

    if (token) {
      this.visible = false;
      this.token = token;
      this.onNetworkValid({
        token,
      });
      this.onNetworkSubject(token);
    } else {
      // 初始化工作
      this.visible = true;
    }
  },

  watch: {
    pointer(n) {
      if (n && this.words.length - n < 20) {
        this.onNetworkSubject(this.token);
      }
    },
    // word(n) {
    //   // clearTimeout(this.timer);

    //   if (n.mark_list && n.mark_list.length === 6) {
    //     // this.word_tip = true;
    //     // this.timer = setTimeout(() => {
    //     //   this.word_tip = false;
    //     // }, 300);
    //     this.word_tip = true;
    //     return;
    //   }

    //   this.word_tip = false;
    // },
  },

  computed: {
    MarkersProxy() {
      if (!this.category) return this.markers;

      return this.markers.filter(item => item.belong === this.category.name);
    },
    // UsernameProxy() {
    //   return String.prototype.toUpperCase.apply(this.username);
    // }

    // MarkersProxyList() {
    //   return this.markers.splice(20);
    // },
  },

  destroyed() {
    document.onkeydown = null;
    this.timer = null;
  },

  methods: {
    onStudentLogin(user) {
      this.onNetworkLogin(user);
    },

    onSelectMarker(marker) {
      const { word } = this;

      const temp = word.mark_list;

      if (!temp) {
        this.word = Object.assign({}, word, {
          mark_list: [marker.uuid],
        });
        return;
      }

      const instance = temp.find(item => item === marker.uuid);

      if (instance) {
        const ntemp = temp.filter(item => item !== marker.uuid);
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

    onTipMarker() {
      if (this.ctimer) {
        clearTimeout(this.ctimer);
      }

      if (this.word.mark_list <= 6) {
        this.word_tip = false;
        return;
      }

      this.word_tip = true;

      this.ctimer = setTimeout(() => {
        this.word_tip = false;
      }, 300);
    },

    onBuildAnswer() {},

    onHandleError(error) {
      const { message } = error;
      this.message = message;
      this.$refs.tip.handlerError();
    },

    onHandlerSearch() {
      // const rege = new RegExp();
    },

    onHandlerCategory(category) {
      if (!category) {
        this.category = null;
        return;
      }

      if (this.category && this.category.name === category.name) {
        this.category = null;
        return;
      }

      this.category = category;
    },

    onHandlerCategoryReset() {
      this.category = null;
    },

    onPrevWord() {
      /* eslint-disable */
      let { pointer, answer, word } = this;

      if (pointer <= 0) {
        return;
      }

      answer[pointer] = word;

      pointer -= 1;

      const temp = answer[pointer];

      this.word = Object.assign({}, temp, {
        old_mark_list: [].concat(temp.mark_list),
      });

      this.pointer = pointer;
      this.category = null;
      /* eslint-disable */
    },

    onNextWord() {
      const timestamp = new Date().getTime();

      if (timestamp - this.log_time < 1500) {
        this.message = '操作太频繁, 请稍等';
        this.log_time = timestamp;
        this.$refs.tip.handlerError();
        return;
      }

      // 防止无限点击
      if (this.task && this.count >= this.task) {
        this.complete = true;
        return;
      }

      if (!this.commit && this.count + 1 === this.task) {
        this.commit = true;
        return;
      }

      this.commit = false;

      this.log_time = timestamp;

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

      if (pointer + 1 < this.answer.length) {
        let temp = {};

        if (this.answer[pointer + 1].old_mark_list) {
          temp = Object.assign({}, this.answer[pointer + 1], {
            old_mark_list: [].concat(this.answer[pointer + 1].mark_list),
          });
        } else {
          temp = this.answer.pop();
        }

        this.word = temp;
      } else {
        this.word = Object.assign({}, words[pointer + 1], {
          mark_list: [],
          color: {
            'background-color': this.colors[(pointer + 1) % 4],
          },
        });
      }

      this.pointer += 1;
      this.category = null;

      if (this.task && this.count === this.task) {
        this.complete = true;
      }
    },

    onHanlerCommit() {
      this.onNextWord();
    },

    onHanlerClose() {
      this.commit = false;
    },

    onKeydownEvent() {
      /* eslint-disable */
      document.onkeydown = event => {
        if (this.timer) {
          clearTimeout(this.timer);
        }

        if (event.keyCode === 39) {
          if (this.count >= this.task) {
            return;
          }
          this.timer = setTimeout(() => {
            this.onNextWord();
          }, 200);
        }

        if (event.keyCode === 37) {
          this.onPrevWord();
        }
      };
      /* eslint-disable */
    },

    onHandleComplete() {
      this.onNetworkCommit({
        token: this.token,
      });
    },

    onHandleNextAnswer() {
      const { token } = this;

      this.onNetworkCommit({
        token,
        more_require_cnt: 50,
      });
    },

    async onNetworkLogin(user) {
      const { data } = await login(user).catch(error => {
        this.message = '抱歉，你无权进行数据标记';
        this.$refs.tip.handlerError();
      });

      if (data.status === 1) {
        this.message = data.msg;
        this.$refs.tip.handlerError();
        return;
      }

      if (data.status !== 0) {
        this.message = data.msg;
        this.$refs.tip.handlerError();
        return;
      }

      // 初始化工作
      window.sessionStorage.removeItem('count');
      window.sessionStorage.removeItem('task');
      window.sessionStorage.removeItem('username');
      this.pointer = 0;
      this.answer = [];

      // 初值设定
      Cookies.setCookie('token', data.token);
      this.visible = false;
      this.username = username;
      this.token = data.token;
      window.sessionStorage.setItem('username', username);
      this.count = data.action_cnt;
      this.task = data.require_cnt;
      window.sessionStorage.setItem('count', data.action_cnt);
      window.sessionStorage.setItem('task', data.require_cnt);

      // if (data.action_cnt >= data.require_cnt) {
      //   this.complete = true;
      //   return;
      // }

      this.onKeydownEvent();
      // 获取题目
      this.onNetworkSubject(data.token);
    },

    async onNetworkSubject(token, count = 50) {
      const { data } = await subject({
        token,
        count,
        /* eslint-disable */
      }).catch(error => {
        this.visible = true;
        console.log('====================================');
        console.log();
        console.log('====================================');
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

      if (this.pointer > 0) {
        this.words = this.words.concat(temp);
        return;
      }

      this.words = temp;
      this.word = Object.assign({}, temp[0], {
        mark_list: [],
      });
    },

    async onNetworkMark(marker) {
      /* eslint-disable */
      const { data } = await mark(marker).catch(error => {});

      if (data.status) {
        Cookies.setCookie('token', '');
        this.visible = true;
      }
    },

    async onNetworkValid(entity) {
      /* eslint-disable */
      const { data } = await valid(entity).catch(err => {});

      if (data.status) {
        Cookies.setCookie('token', '');
        this.visible = true;
        return;
      }

      // this.token = data.token;
      this.username = data.username;
      this.count = data.action_cnt;
      this.task = data.require_cnt;

      // 防止一开始就显示提交问卷
      if (this.task && this.count < this.task) {
        this.complete = false;
      }
      window.sessionStorage.setItem('count', data.action_cnt);
      window.sessionStorage.setItem('task', data.require_cnt);
      this.onKeydownEvent();
    },

    async onNetworkCommit(entity) {
      if (this.task && this.count < this.task) {
        return;
      }
      /* eslint-disable */
      const { data } = await commit(entity).catch(err => {
        /* eslint-disable */
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        /* eslint-disable */
      });

      if (entity.more_require_cnt) {
        this.onNetworkSubject(entity.token, entity.more_require_cnt);
        this.complete = false;
        this.task = this.task + 50;
        window.sessionStorage.setItem('task', this.task);
        return;
      }

      if (data.status) {
        this.message = data.msg;
        this.$refs.tip.handlerError();
        return;
      }

      Cookies.setCookie('token', '');
      window.location.reload();
      window.sessionStorage.setItem('count', 0);
      window.sessionStorage.setItem('task', 0);
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
      bottom: 150px;
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
  padding: 20px 30px 120px;

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

.marker-bottom {
  padding-bottom: 0px;
}

.switch-container:nth-of-type(1) {
  border-radius: 50%;
  background-color: #288fd9;
}

.switch-container:nth-of-type(2) {
  border-radius: 50%;
  background-color: #288fd9;
}

.forbid {
  background-color: #c72923 !important;
}
</style>
