<template>
  <div class="textarea-wrap">
    <div
        class="custom-textarea"
        ref='mTextarea'
        @input="input"
        :style="style"
        contenteditable="true"
        :placeholder="placeholder"
        @setFocus = 'setFocus'
        @blur="blurEventHandler"
    >
    </div>
  </div>
</template>
<script>
export default {
  name: 'customTextarea',
  props: {
    // 输入提示，非必传
    placeholder: {
      type: String,
      default: ''
    },
    // 最大字数，非必传
    maxlength: {
      type: Number,
      default: 99999
    },
    // 行数，非必传
    rows: {
      type: Number,
      default: 6
    },
    // 字体大小，非必传
    fontSize: {
      type: Number,
      default: 28
    },
    // 行高，非必传
    lineHeight: {
      type: Number,
      default: 1.4
    },
    // 值，必传
    value: String
  },
  computed: {
    style () {
      return {
        fontSize: this.fontSize / 36 + 'rem',
        lineHeight: this.lineHeight,
        maxHeight: this.rows * this.fontSize / 36 * this.lineHeight + 'rem'
      }
    }
  },
  data () {
    return {
      mTextarea: null
    }
  },
  watch: {
    value () {
      // 清空
      if (!this.value) {
        this.mTextarea.innerText = ''
      }
    }
  },
  mounted () {

    this.$nextTick(() => {
      this.mTextarea = this.$refs.mTextarea
      // 回显
      this.mTextarea.innerText = this.value
    })
  },
  methods: {
    setFocus(){
      this.$refs.mTextarea.focus()
    },
    blurEventHandler(){
      this.$emit('blurEvent')
      console.log("ss")
    },
    input () {
      let innerText = this.mTextarea.innerText
      this.$emit('input', innerText)
    },
  }
}
</script>
<style lang="less" scoped>
.textarea-wrap{
  background: #f8f8f8;;
  padding: 10px 5px;
  border-radius: 2px;
  font-size: 20px;
  &:active{
    background: #eee;
  }
  .custom-textarea{
    width: 100%;
    display: inline-block;
    outline: none;
    overflow: auto;
    //// 加了可实现纯textarea功能，不加则像富文本一样可以写入css样式和HTML标签
    //user-modify: read-write-plaintext-only;
    -webkit-user-modify: read-write-plaintext-only;
    // 必须加，不然移动端有些浏览器无光标
    user-select: auto;
    -webkit-user-select: auto;
    // placeholder属性
    &:empty:before{
      content:attr(placeholder);
      font-size: 36/36rem;
      color: #999;
    }
  }
}

.custom-textarea img{
  width: 20px;
  height: 20px;
}
</style>


