<template>
  <div class="login-container login-background" :style="background">
    <el-card style="display: flex;justify-content: center;align-items: center;height: 100vh;">
      <div style="width: 20vw;">

        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
                 label-position="left">

          <div class="title-container">
            <h3 class="title">登录页</h3>
          </div>

          <el-form-item prop="username">
        <span class="svg-container">
        </span>
            <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="Username"
                type="text"
                tabindex="1"
                autocomplete="on"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
              </span>
              <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="Password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd"/>
            </el-form-item>
          </el-tooltip>

          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                     @click.native.prevent="handleLogin">登录
          </el-button>
        </el-form>
      </div>
    </el-card>
    <el-image :src="require('@/assets/logo.png')"></el-image>
  </div>
</template>

<script>
import request from "@/utils/request";
import {setToken} from "@/utils/auth";

export default {
  name: 'loginD',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于六位'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{required: true, trigger: 'blur', msg: "账号不允许为空"}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },
      background: {

        backgroundImage: 'url(' + require('@/assets/logo.png') + ')',
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  methods: {
    checkCapslock(e) {
      const {key} = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          request.get("/api/login/" + this.loginForm.username + '/' + this.loginForm.password).then(res => {
            setToken(res.token)
            this.$router.push("/")
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
  },
  created() {
  },
  computed: {
  }
}
</script>


<style>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-background {
  background-image: url('@/assets/logo.png');
}

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>