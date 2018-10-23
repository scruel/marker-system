<template>
  <section
    class="search-container"
  >
    <div class="input-item">
      <input
        type="text"
        :placeholder="placeholder"
        v-model="keyword"
      >
    </div>
    <a
      :href="HrefProxy"
      target="view_window"
    >
      <img
        src="../assets/image/search.png"
        alt=""
      >
    </a>
  </section>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      href: '',
      placeholder: '',
    };
  },

  props: {
    value: {
      type: String,
      default: '',
    },

    word: {
      type: Object,
      default: () => ({}),
    },

    category: {
      type: Object,
      default: () => ({}),
    },
  },

  watch: {
    word(n) {
      this.keyword = '';
      this.placeholder = n.word;
    },

    category(n) {
      this.keyword = '';

      if (n) {
        /* eslint-disable */
        this.placeholder = `${this.word.word} ${n.name}`;
        /* eslint-disable */
        return;
      }

      this.placeholder = this.word.word;
    },
  },

  computed: {
    HrefProxy() {
      const { keyword, placeholder } = this;

      if (keyword) {
        return `https://www.baidu.com/s?wd=${keyword}`;
      }

      return `https://www.baidu.com/s?wd=${placeholder}`;
    },
  },

  methods: {
    handlerChange(e) {
      this.$emit('input', e.target.value);
    },

    handlerSearch() {
      //   if (!this.keyword) {
      //       return;
      //   }
      //   this.$emit('search', this.keyword)
    },
  },
};
</script>

<style lang="scss" scope>
.search-container {
  // padding: 0px 10px;
  height: 100%;
  display: flex;
  align-items: center;
  // margin-bottom: 10px;
  border-radius: 4px;
  // box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
  //   2px -2px 2px 0 rgba(40, 120, 255, 0.08),
  //   -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
  //   -2px 2px 2px 0 rgba(40, 120, 255, 0.08);

  .input-item {
    input {
      padding: 10px 5px;
      border: 0px;
      outline: 0px;
      color: #616366;
      font-size: 16px;
      border-bottom: 1px solid #e2e2e2;
    }
  }

  img {
    // user-select: none;
    width: 20px;
    height: 20px;
  }
}
</style>
