<template>
  <div class="emoji-container clearfix">

    <div class="input-area" ref="editableInputAreaDiv" contenteditable="true">
      halo world
      <img src="https://cdn.sunofbeaches.com/emoji/1.png" alt="">
    </div>

    <div class="input-area-bar">
      <span class="emoji-txt" @click="emojiShow = !emojiShow">表情</span>
      <span class="emoji-btn" @click="publish">发布</span>
    </div>

    <div class="emoji-item-container" v-show="true">
      <div class="emoji-item-area">
        <img v-for="(emoji, key) in 130" :key="key" @click="addEmoji(emoji)"
             :src="'https://cdn.sunofbeaches.com/emoji/' + emoji + '.png'" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmojiTextarea",
  data() {
    return {
      emojiShow: false,
      lastEditRange: null,
    }
  },
  mounted() {
    this.$refs['editableInputAreaDiv'].onclick = () => {
      // 获取选定对象
      let selection = window.getSelection()
      console.log(selection, selection.rangeCount, 'selection');
      // 设置最后光标对象
      if (selection.rangeCount > 0) {
        // 记录光标最后点击可编辑div中所选择的位置
        this.lastEditRange = selection.getRangeAt(0);
        console.log(selection.getRangeAt(0));
      }
    }
  },
  methods: {
    publish() {
      this.$refs['editableInputAreaDiv'].focus()
      // let selection = window.getSelection()

    },
    addEmoji(emoji) {
      let edit = this.$refs['editableInputAreaDiv']

      edit.focus()
      let selection = window.getSelection()
      // 如果存在最后的光标对象
      if (this.lastEditRange) {
        console.log('last');
        // 选区对象清除所有光标
        selection.removeAllRanges();
        // 并添加最后记录的光标，以还原之前的状态
        selection.addRange(this.lastEditRange);

        // 创建表情图
        let img = document.createElement('img');
        img.src = 'https://cdn.sunofbeaches.com/emoji/' + emoji + '.png';
        console.log(img);
        /*
        // 也可以这样创建img
        let image = new Image();
        image.src = 'https://cdn.sunofbeaches.com/emoji/' + emoji + '.png'; */

        // 获取到最后选择的位置
        var range = selection.getRangeAt(0);

        // 在此位置插入表情图
        range.insertNode(img)
        // range.insertNode(image) // 或者这样插入

        // false，表示将Range对象所代表的区域的起点移动到终点处
        range.collapse(false)

        // 记录最后的位置
        this.lastEditRange = selection.getRangeAt(0);
      } else {
        console.log('new')
        // 创建一个img标签（表情）
        let img = document.createElement('img');
        img.src = 'https://cdn.sunofbeaches.com/emoji/' + emoji + '.png';
        console.log(img);
        // 将表情添加到可编辑的div中，作为可编辑div的子节点
        edit.appendChild(img)
        // 使用选取对象，选取可编辑div中的所有子节点
        selection.selectAllChildren(edit)
        // 合并到最后面，即实现了添加一个表情后，把光标移到最后面
        selection.collapseToEnd()
        return
      }


    }
  }
}
</script>

<style scoped lang="scss">
.emoji-container {
  width: 400px;
  height: 160px;
  margin: 10px auto;
  border-radius: 5px;
  padding: 10px;

  background-color: #fff;

  ::v-deep .input-area {
    height: 100px;
    border: 1px solid #e9e9e9;
    outline: none;
    padding: 10px;
    font-size: 16px;

    &:focus {
      border: 1px solid red;
    }

    img {
      width: 20px;
      height: 20px;
      vertical-align: bottom;
      margin: 0 2px;
    }
  }

  .input-area-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 5px;
    line-height: 20px;
    height: 30px;

    .emoji-txt {
      color: #4485f9;
      cursor: pointer;
    }


    .emoji-btn {
      background-color: #4485f9;
      cursor: pointer;
      padding: 0px 10px;
      color: #fff;
      height: 100%;
      line-height: 28px;
      border-radius: 5px;
    }
  }
}

.emoji-item-container {
  background-color: #fff;
  height: 200px;
  border-radius: 5px;
  padding: 5px;
  overflow-y: auto;
  margin-top: 14px;
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, .028);

  .emoji-item-area {

    img {
      cursor: pointer;
      width: 20px;
      height: 20px;
      margin: 2px;
      padding: 9px;
      border-radius: 8px;
      vertical-align: bottom;
      transition: all .28s;

      &:hover {
        transform: scale(1.2);
      }

      &:hover {
        background-color: #eaeaea;
      }
    }
  }

}

.clearfix::before,
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.12);
  background: rgba(0, 0, 0, 0.2);
}

/*::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: rgba(0,0,0,0.1);
    }*/
</style>

