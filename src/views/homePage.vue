<template>
  <div class="article-container my-animation-slide-bottom">
    <!-- 评论 -->
    <div style="width: 50vw;">
      <comment-components :type="'article'"></comment-components>
    </div>
  </div>
</template>

<script>
import commentComponents from "@/views/comment/commentComponents.vue";

export default {
  components:{
    commentComponents
  },
  name: "homePage",
  data() {
    return {}
  },
  methods: {},
  created() {
  },
  computed: {}
}
</script>


<style scoped>

.article-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.my-animation-slide-bottom {
  animation-name: slide-bottom
}


</style>