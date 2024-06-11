<template>
  <div>
    <!-- 评论框 -->
    <div style="margin-bottom: 40px">
      <div class="comment-head">
        <i class="el-icon-edit-outline" style="font-weight: bold;font-size: 22px;"></i> 留言
      </div>
      <div>
        <!-- 文字评论 -->
        <div>
          <commentBox @showGraffiti="isGraffiti = !isGraffiti" :username="info.username"
                      @submitComment="submitComment">
          </commentBox>
        </div>
<!--        画笔-->
<!--        <div v-show="isGraffiti">-->
<!--          <graffiti-components @showComment="isGraffiti = !isGraffiti"-->
<!--                               @addGraffitiComment="addGraffitiComment">-->
<!--          </graffiti-components>-->
<!--        </div>-->
      </div>
    </div>

    <!-- 评论内容 -->
    <div v-if="comments.length > 0">
      <!-- 评论数量 -->
      <div class="commentInfo-title">
        <span style="font-size: 1.15rem">Comments | </span>
        <span>{{ total }} 条留言</span>
      </div>
      <!-- 评论详情 -->
      <div id="comment-content" class="commentInfo-detail"
           v-for="(item, index) in comments"
           :key="index">
        <!-- 头像 -->
        <el-avatar shape="square" class="commentInfo-avatar" :size="35" v-if="item.avatar"
                   :src="item.avatar"></el-avatar>
        <el-avatar shape="square" class="commentInfo-avatar" :size="30" v-else
                   src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>


        <div style="flex: 1;padding-left: 12px">
          <!-- 评论信息 -->
          <div style="display: flex;justify-content: space-between">
            <div>
              <span class="commentInfo-username">{{ item.senderName }}</span>
              <span class="commentInfo-master" v-if="info.userId === item.senderUserId">主人翁</span>
              <span class="commentInfo-other">{{ item.createDate }}</span>
              <!--              <span class="commentInfo-other">{{ common.getDateDiff(item.createDate) }}</span>-->
            </div>
            <div style="display:flex;">
              <span class="commentInfo-deleted" @click="deletedComment(item)">删除</span>
              <div class="commentInfo-reply" @click="replyDialog(item, item.id)">评论</div>
            </div>

          </div>
          <!-- 评论内容 -->
          <div class="commentInfo-content">
            <span v-html="item.comment"></span>
          </div>
          <!-- 回复模块 -->
          <div>
            <div class="commentInfo-detail" v-for="(childItem, i) in item.children" :key="i">
              <!-- 头像 -->

              <el-avatar shape="square" class="commentInfo-avatar" :size="30" v-if="childItem.avatar"
                         :src="childItem.avatar"></el-avatar>
              <el-avatar shape="square" class="commentInfo-avatar" :size="30" v-else
                         src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>

              <div style="flex: 1;padding-left: 12px">
                <!-- 评论信息 -->
                <div style="display: flex;justify-content: space-between">
                  <div>
                    <span class="commentInfo-username-small">{{ childItem.senderName }}</span>
                    <span class="commentInfo-master" v-if="childItem.senderUserId === info.userId">主人翁</span>
                    <span class="commentInfo-other">{{ childItem.createDate }}</span>
                  </div>
                  <div>
                    <span class="commentInfo-deleted" @click="deletedComment(childItem)">删除</span>
                    <span class="commentInfo-reply" @click="replyDialog(childItem, childItem.id)">回复</span>
                  </div>
                </div>
                <!-- 评论内容 -->
                <div class="commentInfo-content">
                  <template v-if="childItem.receiverUserId !== info.senderUserId ">
                    <span style="color: var(--blue)">@{{ childItem.receiverName }} </span>:
                  </template>
                  <span v-html="childItem.comment"></span>
                </div>
              </div>
            </div>
            <!-- 分页 -->
            <div class="pagination-wrap" v-if="item.children.length < item.children.total">
              <div class="pagination"
                   @click="toChildPage(item)">
                展开
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
<!--      <proPage :current="pagination.current"-->
<!--               :size="pagination.size"-->
<!--               :total="pagination.total"-->
<!--               :buttonSize="6"-->
<!--               :color="constant.commentPageColor"-->
<!--               @toPage="toPage">-->
<!--      </proPage>-->
    </div>

    <div v-else class="myCenter" style="color: var(--greyFont)">
      <i>来发第一个留言啦~</i>
    </div>

    <el-dialog title="留言"
               :visible.sync="dialog.isShow"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               :close-on-click-modal="false"
               destroy-on-close
               center>
      <div>
        <commentBox :disableGraffiti="true"
                    @submitComment="submitReply">
        </commentBox>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import commentBox from "@/views/comment/commentBox.vue";
// import proPage from "@/views/comment/proPage.vue";
import common from "@/utils/common";
import constant from "@/utils/constant";


export default {
  components: {
    commentBox,
    // eslint-disable-next-line no-undef
    // proPage
  },
  props: {
    source: {
      type: Number
    },
    type: {
      type: String
    },
  },
  data() {
    return {
      isGraffiti: true,
      total: 0,
      comments: [
        {
          "id": 1,
          "senderUserId": 1,
          "senderName": "",
          "receiverName": "",
          "receiverUserId": "",
          "parentId": "",
          "comment": " ",
          "commentObjectType": "",
          "commentObjectId": "",
          "createDate": "",
          "layer": 1,
          "children": [],
          "childrenCount": null
        },
      ],
      dialog: {
        sendItem: {},
        isShow: false,
        parentId: '',
      },

      commentObjectType: "视频",
      commentObjectId: "4",
      pagination: {
        current: 1,
        size: 10,
        total: 0,
        source: this.source,
        commentType: this.type,
        floorCommentId: null
      },
      info: {
        username: '',
        userId: 1,
      },
    };
  },

  computed: {
    common() {
      return common
    },
    constant() {
      return constant
    },
  },

  created() {
    this.comments = []
    this.getUserInfo()
    this.getComments();
    // this.getTotal();
  },
  methods: {
    deletedComment(item){
      request.post("/api/comment/checkUserId/deletedById", {
        id: item.id,
        senderUserId: item.senderUserId
      }).then(res => {
        console.log(res)

      }).catch(error => {
        console.log(error)
      })
    },

    toPage(page) {
      this.pagination.current = page;
      window.scrollTo({
        top: document.getElementById('comment-content').offsetTop
      });
      this.getComments(this.pagination);
    },
    getUserInfo() {
      request.get("/api/getInfo", {}).then(res => {
        this.info.username = res.data.username
        this.info.userId = res.data.id
      }).catch(error => {
        console.log(error)
      })
    },
    getComments() {
      request.get("/api/comment/query", {
        params: {
          commentObjectType: this.commentObjectType,
          commentObjectId: this.commentObjectId,
          parentId: '-1',

        }
      }).then(res => {
        this.comments = res.data
        res.total = res.total !== undefined ? res.total : 0
        this.total = res.total
        this.emoji(this.comments, true);
        this.$nextTick(() => {
          // common.imgShow("#comment-content .pictureReg");
        });
      }).catch(error => {
        console.log(error)
      })
    },
    // eslint-disable-next-line no-unused-vars
    toChildPage(floorComment) {
      // floorComment.childComments.current += 1;
      // let pagination = {
      //   current: floorComment.childComments.current,
      //   size: 5,
      //   total: 0,
      //   source: this.source,
      //   commentType: this.type,
      //   floorCommentId: floorComment.id
      // }
      // this.getComments(pagination, floorComment, true);
    },
    // eslint-disable-next-line no-unused-vars
    emoji(comments, flag) {
      comments.forEach(c => {
        c.comment = c.comment.replace(/\n/g, '<br/>');
        c.comment = common.faceReg(c.comment);
        c.comment = common.pictureReg(c.comment);
        if (flag) {
          if (!common.isEmpty(c.children) && !common.isEmpty(c.children)) {
            c.children.forEach(cc => {
              c.comment = c.comment.replace(/\n/g, '<br/>');
              cc.comment = common.faceReg(cc.comment);
              cc.comment = common.pictureReg(cc.comment);
            });
          }
        }
      });
    },
    addGraffitiComment(graffitiComment) {
      this.submitComment(graffitiComment);
    },
    // 提交主
    submitComment(commentContent) {
      // eslint-disable-next-line no-unused-vars
      let comment = {
        // senderUserId: this.info.userId,
        // senderName: this.info.username,
        parentId: '-1',
        comment: commentContent,
        commentObjectType: this.commentObjectType,
        commentObjectId: this.commentObjectId
      };

      // eslint-disable-next-line no-undef
      request.post(
          constant.baseURL + "/comment/send", comment)
          // eslint-disable-next-line no-unused-vars
          .then((res) => {
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.getComments();
            // this.getTotal();
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
    },

    // 提交评论
    submitReply(commentContent) {
      let comment = {
        parentId: this.dialog.parentId,
        receiverUserId: this.dialog.sendItem.senderUserId,
        receiverName: this.dialog.sendItem.senderName,
        commentObjectType: this.commentObjectType,
        commentObjectId: this.commentObjectId,
        comment: commentContent
      };
      request.post(constant.baseURL + "/comment/send", comment)
          // eslint-disable-next-line no-unused-vars
          .then((res) => {
            this.$message({
              type: 'success',
              message: '回复成功！'
            });
            this.getComments();
            // this.getTotal();
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      this.handleClose();
    },
    replyDialog(item, parentId) {
      this.dialog.isShow = true
      this.dialog.sendItem = item
      this.dialog.parentId = parentId
      console.log(item, parentId)
    },
    handleClose() {
      this.dialog.isShow = false
      this.dialog.sendItem = {}
      this.dialog.parentId = -1
    }
  }
}
</script>
<style scoped>

.comment-head {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin: 40px 0 20px 0;
  user-select: none;
  color: var(--themeBackground);
}

.commentInfo-title {
  margin-bottom: 20px;
  color: var(--greyFont);
  user-select: none;
}

#comment-content {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.commentInfo-detail {
  display: flex;
}

.commentInfo-avatar {
  border-radius: 5px;
}

.commentInfo-username {
  color: var(--orangeRed);
  font-size: 16px;
  font-weight: 600;
  margin-right: 5px;
}

.commentInfo-username-small {
  color: var(--orangeRed);
  font-size: 14px;
  font-weight: 600;
  margin-right: 5px;
}

.commentInfo-master {
  color: var(--green);
  border: 1px solid var(--green);
  border-radius: 0.2rem;
  font-size: 12px;
  padding: 2px 4px;
  margin-right: 5px;
}

.commentInfo-other {
  font-size: 12px;
  color: var(--greyFont);
  user-select: none;
}

.commentInfo-reply {
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  color: var(--white);
  background: var(--themeBackground);
  border-radius: 0.2rem;
  padding: 3px 6px;
}

.commentInfo-deleted {
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  margin-right: 10px;
  color: var(--white);
  background: var(--red);
  border-radius: 0.2rem;
  padding: 3px 6px;
}

.commentInfo-content {
  margin: 15px 0 25px;
  padding: 18px 20px;
  background: var(--commentContent);
  border-radius: 12px;
  color: var(--black);
  word-break: break-word;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.pagination {
  padding: 6px 20px;
  border: 1px solid var(--lightGray);
  border-radius: 3rem;
  color: var(--greyFont);
  user-select: none;
  cursor: pointer;
  text-align: center;
  font-size: 12px;
}

.pagination:hover {
  border: 1px solid var(--themeBackground);
  color: var(--themeBackground);
  box-shadow: 0 0 5px var(--themeBackground);
}
</style>
