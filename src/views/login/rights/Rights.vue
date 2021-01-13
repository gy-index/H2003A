<template>
  <div class="container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/route' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card>
      <el-table :data="quanslist" border style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="描述"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag prop="level" size="mini" v-show="scope.row.level == 0">一级</el-tag>
            <el-tag prop="level" size="mini" type="success" v-show="scope.row.level == 1">二级</el-tag>
            <el-tag prop="level" size="mini" type="warning" v-show="scope.row.level == 2">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      quanslist: []
    };
  },

  mounted() {
    this.getdatas();
  },
  computed: {},
  methods: {
    getdatas() {
      this.$axios.get("rights/list").then(res => {
        console.log(res);

        if (res.meta.status == 200) {
          this.quanslist = res.data;
        }
      });
    }
  }
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
</style>
