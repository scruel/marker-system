<template>
    <section class="search-container">
        <div class="input-item">
            <input
                type="text"
                v-model="keyword"
            >
        </div>
        <img
            src="../assets/image/search.png"
            alt=""
            @click="handlerSearch"
        >
    </section>
</template>
    
<script>
export default {
  data() {
    return {
        keyword: '',
    }
  },

  props: {
      value: {
          type: String,
          default: '',
      }
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
        window.location.href = `https://www.baidu.com`
      }
  }
}
</script>
    
<style lang="scss" scope>
.search-container {
  padding: 5px 10px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
    2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px 2px 2px 0 rgba(40, 120, 255, 0.08);

  .input-item {
    input {
      padding: 10px 0px;
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