<template>
  <div class="login_container">
    <video class="bgimg" autoplay="autoplay" loop="loop" muted="muted">
      <source class="bgimg" src="http://xmadmin.exrick.cn/lib/video/Ipad.mp4" type="video/mp4" />
    </video>
    <div class="login_box">
      <div class="avatar_box">
        <img
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604064579837&di=12456eb14d210e23092e06bbbc0ef7ba&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3D4ade172e8ad4b31cf03c94b3b7d7276f%2Fe5452d55b319ebc4b7767af48326cffc1f1716c0.jpg"
        />
      </div>

      <el-form ref="loginForm" :model="user" :rules="Rules" label-width="0px" class="login_of">
        <!-- 用户名区域 -->
        <el-form-item prop="username">
          <el-input v-model="user.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码区域 -->
        <el-form-item prop="password">
          <el-input v-model="user.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="warning" @click="resete">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      user: {
        username: "admin",
        password: "123456"
      },

      //表单的验证规则
      Rules: {
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        //验证密码是否正确
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  computed: {},

  // 当登录成功时返回首页页面
  beforeRouteEnter(to, from, next) {
    let data = sessionStorage.getItem("data");
    if (data != null) {
      next("/route");
    }
    next();
  },
  methods: {
    //点击重置按钮 重置登录信息
    resete() {
      this.$refs.loginForm.resetFields();
    },

    login() {
      this.$refs.loginForm.validate(valid => {
        //console.log(valid);

        if (!valid) return;

        this.$axios.post("login", this.user).then(res => {
        //  console.log(res);
          if (res.meta.status == 200) {
            this.$message({
              type: "success",
              message: res.meta.msg
            });
            sessionStorage.setItem("token", res.data.token);
            //点击登陆后跳转到用户管理
            this.$router.push("/route");
          } else {
            this.$message({
              type: "error",
              message: res.meta.msg
            });
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.bgimg {
  margin: auto;
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  visibility: visible;
  width: 100%;
}

.login_container {
  height: 100%;
}

.login_box {
  width: 500px;
  height: 300px;
  background: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  width: 130px;
  height: 130px;
  padding: 10px;
  border: 1px solid #efefef;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #efefef;
  }
}

.login_of {
  position: absolute;
  bottom: 0px;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
