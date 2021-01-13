<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header class="header">
      <h2>电商管理后台管理系统</h2>
      <div>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <!-- 左侧菜单栏区域 -->
    <el-container>
      <el-aside width="200px" id="aside">
        <!-- 进行菜单折叠和展开功能 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          :collapse-transition="false"  
          :collapse="iscollapse"
          active-text-color="#409eff"
          :unique-opened="true"
          :default-active="active"
          router
        >
          <!-- 一级菜单区域 -->
          <el-submenu :index="item.id+''" v-for="(item,index) in goodslist" :key="index">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单区域 -->
            <el-menu-item
              :index="'/'+item.path"
              v-for="(item,index) in goodslist[index].children"
              :key="index"
              @click="saveNavState('/'+item.path)"
            >
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主要主体部分 -->
      <el-main class="main">
        
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      goodslist: [],
      iscollapse: false,
      active:''
    };
  },

  mounted() {
    this.getdata();
    this.active = window.sessionStorage.getItem("active")
  },

  computed: {},
  methods: {
    //点击退出返回登录yemian
    logout() {
      window.sessionStorage.clear();

      this.$router.push("/login");
    },

    //利用接口获取左侧菜单栏数据
    getdata() {
      this.$axios.get("menus").then(res => {
        //console.log(res);
        if (res.meta.status == 200) {
          this.$message({
            type: "success",
            message: res.meta.msg
          });
          this.goodslist = res.data;
        }
      });
    },

    //点击折叠将左侧菜单进行折叠
    changMenu() {
      this.iscollapse = !this.iscollapse;
      if (this.iscollapse == true) {
        aside.style.width = "64px";
      } else {
        aside.style.width = "200px";
      }
    },

    //保存链接的激活状态
    saveNavState(active){
      window.sessionStorage.setItem("active",active)
      this.active = active
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 50px;
  background-color: #000;
  display: flex;
  color: #fff;
  justify-content: space-between;
  align-items: center;
}

.home_container {
  height: 100%;
}

.el-aside {
  background: #333744;
  .el-menu{
    border-right: none;
  }
}

.main {
  background-color: #ddd;
}

.l-top {
  width: 200px;
  height: 35px;
  background: #4a5064;
  text-align: center;
  color: #fff;
  line-height:35px;
  cursor: pointer;
}
</style>
