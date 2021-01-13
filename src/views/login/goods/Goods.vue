<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/route' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-col style="margin-top:20px;">
      <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              clearable
              v-model="query.query"
              @clear="getdatalist"
            >
              <el-button @click="getdatalist" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="goodto">添加商品</el-button>
          </el-col>
        </el-row>

        <!-- 列表渲染区域 -->
        <el-table :data="goodslist" border style="width: 100%';margin-top:15px;">
          <el-table-column type="index" label="#" width="50"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="850"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="180"></el-table-column>
          <el-table-column prop="add_time" label="创建时间">
            <template slot-scope="scope">{{scope.row.add_time| time}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
              <!-- 删除数据 -->
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeById(scope.row.goods_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <div class="block" style="margin-top:15px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.pagenum"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="query.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      query: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      goodslist: []
    };
  },

  //格式化日期对象
  filters: {
    time(index) {
      let value = new Date();
      let year = value.getFullYear(); //年
      let month = value.getMonth() + 1; //月
      let day = value.getDate(); //日
      let hour = value.getHours(); //时
      let minutes = value.getMinutes(); //分
      let seconds = value.getSeconds(); //秒

      return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
    }
  },

  mounted() {
    this.getdatalist();
  },
  computed: {},
  methods: {
    getdatalist() {
      this.$axios.get("goods", { params: this.query }).then(res => {
        // console.log(res);
        if (res.meta.status == 200) {
          this.goodslist = res.data.goods;
          this.total = res.data.total;
        }
      });
    },

    //分页逻辑代码
    handleSizeChange(size) {
      this.query.pagesize = size;
      this.getdatalist();
    },
    handleCurrentChange(page) {
      this.query.pagenum = page;
      this.getdatalist();
    },

    //删除用户
    async removeById(id) {
      console.log(id);
      //询问用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("用户已取消删除!");
      }

      const { data: res } = await this.$axios.delete("goods/" + id);

      if (res == 200) {
        return this.$message.error("删除用户失败!");
      }

      this.$message.success("删除用户成功!");
      this.getdatalist();
    },

    //跳转到添加商品页
    goodto(){
      this.$router.push('/goods/add')
    }
  }
};
</script>

<style scoped>
</style>
