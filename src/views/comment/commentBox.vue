<template>
  <div>
    <!-- 框 -->
    <textarea
      class="comment-textarea"
      v-model="commentContent"
      placeholder="写下点什么..."
      maxlength="1000"/>
    <!-- 按钮 -->
    <div class="myBetween" style="margin-bottom: 10px">
      <div style="display: flex">
        <div :class="{'emoji-active':showEmoji}"
             @click="showEmoji = !showEmoji">
          <i class="el-icon-orange myEmoji"></i>
        </div>
        <div @click="openPicture()">
          <i class="el-icon-picture myPicture"></i>
        </div>
      </div>

      <div style="display: flex">
<!--        <proButton :info="'涂鸦'"-->
<!--                   v-show="!$common.mobile() && !disableGraffiti"-->
<!--                   @click.native="showGraffiti()"-->
<!--                   :before="$constant.before_color_1"-->
<!--                   :after="$constant.after_color_1"-->
<!--                   style="margin-right: 6px">-->
<!--        </proButton>-->
        <proButton :info="'提交'"
                   @click.native="submitComment()"
                   :before="constant.before_color_2"
                   :after="constant.after_color_2"
        >
        </proButton>
      </div>
    </div>
    <!-- 表情 -->
    <emoji @addEmoji="addEmoji" :showEmoji="showEmoji"></emoji>

    <el-dialog title="图片"
               :visible.sync="showPicture"
               width="25%"
               :append-to-body="true"
               :close-on-click-modal="false"
               destroy-on-close
               center>
      <div>
        <uploadPicture :prefix="'commentPicture'" @addPicture="addPicture" :maxSize="2"
                       :maxNumber="1"></uploadPicture>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import emoji from "@/views/comment/emojiComponents.vue";
  import proButton from "@/views/comment/proButton.vue";
  import uploadPicture from "@/views/comment/uploadPicture.vue";
  import constant from "@/utils/constant";
  import common from "@/utils/common";

  export default {
    computed: {
      constant() {
        return constant
      }
    },
    components: {
      emoji,
      proButton,
      uploadPicture
    },
    props: {
      disableGraffiti: {
        type: Boolean,
        default: false
      },
      username: {
        type: String
      }
      
    },
    data() {
      return {
        commentContent: "",
        showEmoji: false,
        showPicture: false,
        picture: {
          url: ""
        }
      };
    },
    methods: {
      openPicture() {
        if (common.isEmpty(this.username)) {
          this.$message({
            message: "请先登录！",
            type: "error"
          });
          return;
        }

        this.showPicture = true;
      },

      addPicture(res) {
        this.picture.url = res;
        this.savePicture();
      },
      savePicture() {
        let img = "[" + this.picture.name + "," + this.picture.url + "]";
        this.commentContent += img;
        this.picture.url = "";
        this.showPicture = false;
      },
      addEmoji(key) {
        this.commentContent += key;
      },
      showGraffiti() {

        this.commentContent = "";
        this.$emit("showGraffiti");
      },
      submitComment() {
        this.$emit("submitComment", this.commentContent.trim());
        this.commentContent = "";
      }
    }
  }
</script>

<style scoped>
  .comment-textarea {
    border: 1px solid var(--lightGray);
    width: 100%;
    font-size: 14px;
    padding: 15px;
    min-height: 180px;
    /* 不改变大小 */
    resize: none;
    /* 不改变边框 */
    outline: none;
    border-radius: 4px;
    background-image: var(--commentURL);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 100%;
    margin-bottom: 10px;
  }

  .comment-textarea:focus {
    border-color: var(--themeBackground);
  }

  .myEmoji {
    font-size: 18px;
    cursor: pointer;
    transition: all 0.5s;
    margin-right: 12px;
  }

  .myEmoji:hover {
    transform: rotate(360deg);
    font-size: 22px;
  }

  .myPicture {
    font-size: 18px;
    cursor: pointer;
  }

  .emoji-active {
    color: var(--red);
  }
</style>
