<template>
  <div v-if="total > size" class="myCenter">
    <ul class="page-content">
      <li class="page-item" v-if="current !== 1" @click="toPage(-1)">
        👈
      </li>
      <template v-if="current === 1">
        <li class="page-item"
            :style="{background: index === 1 ? color : '', color: index === 1 ? 'var(--white)' : ''}"
            v-for="index of realButtonSize"
            :key="index"
            @click="toPage(index)">
          {{index}}
        </li>
      </template>
      <template v-else-if="current === totalSize">
        <li class="page-item"
            :style="{background: index === realButtonSize ? color : '', color: index === realButtonSize ? 'var(--white)' : ''}"
            v-for="index of realButtonSize"
            :key="index"
            @click="toPage(current - (realButtonSize - index))">
          {{current - (realButtonSize - index)}}
        </li>
      </template>
      <template v-else>
        <li class="page-item"
            :style="{background: Math.ceil(realButtonSize/2) - index === 0 ? color : '', color: Math.ceil(realButtonSize/2) - index === 0 ? 'var(--white)' : ''}"
            v-for="index of realButtonSize"
            :key="index"
            @click="toPage(current - (Math.ceil(realButtonSize/2) - index))">
          {{current - (Math.ceil(realButtonSize/2) - index)}}
        </li>
      </template>
      <li class="page-item" v-if="current !== totalSize" @click="toPage(-2)">
        👉
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      current: {
        type: Number,
        default: 1
      },
      size: {
        type: Number,
        default: 10
      },
      total: {
        type: Number,
        default: 0
      },
      buttonSize: {
        type: Number,
        default: 3
      },
      color: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        totalSize: 0,
        realButtonSize: 0
      }
    },

    computed: {},

    watch: {
      // eslint-disable-next-line no-unused-vars
      total(newVal) {
        this.totalSize = Math.ceil(this.total / this.size);
        this.realButtonSize = this.buttonSize < this.totalSize ? this.buttonSize : this.totalSize;
      }
    },

    created() {
      this.totalSize = Math.ceil(this.total / this.size);
      this.realButtonSize = this.buttonSize < this.totalSize ? this.buttonSize : this.totalSize;
    },

    mounted() {

    },

    methods: {
      toPage(flag) {
        if (flag === -1) {
          this.$emit("toPage", this.current - 1);
        } else if (flag === -2) {
          this.$emit("toPage", this.current + 1);
        } else {
          this.$emit("toPage", flag);
        }
      }
    }
  }
</script>

<style scoped>

  .page-content {
    display: flex;
    padding: 0;
    margin: 15px 0;
  }

  .page-item {
    margin: 0 10px;
    list-style: none;
    border: 1px solid var(--lightGray);
    width: 40px;
    height: 40px;
    line-height: 38px;
    text-align: center;
    border-radius: 50%;
    color: var(--black);
    font-size: 14px;
    cursor: pointer;
  }

  .page-item:hover {
    border: 1px solid var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
  }
</style>
