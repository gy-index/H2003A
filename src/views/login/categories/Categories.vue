<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/route' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-col style="margin-top:20px;">
      <el-card>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>

        <tree-table
          :data="cardlist"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          index-text="#"
          border
          :show-row-hover="false"
        >
          <!-- 是否有效区域 -->
          <template slot="isok" slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color:lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="color:red"></i>
          </template>

          <!-- 排序区域 -->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" effect="dark" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" effect="dark" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="mini" effect="dark" type="warning" v-else>三级</el-tag>
          </template>

          <!-- 操作区域 -->
          <template slot="opt" scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeById(scope.row.attr_id)"
            >删除</el-button>
          </template>
        </tree-table>

        <!-- 分页区域 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="getCardList.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="querIoFn.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-card>
    </el-col>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="addCateDialogVisble" width="50%">
      <!-- 分类名称区域 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <!-- 父级分类区域 -->
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectdKeys"
            expand-trigger="hover"
            :props="cascaderPtions"
            :options="parentslist"
            @change="handleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      cardlist: [],

      //分页
      querIoFn: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },

      //分页总条数
      total: null,

      //为table指定列的定义
      columns: [
        { label: "分类名称", prop: "cat_name" },
        { label: "是否有效", prop: "", type: "template", template: "isok" },
        { label: "排序", prop: "", type: "template", template: "order" },
        { label: "操作", prop: "", type: "template", template: "opt" }
      ],

      //对话框的显示与隐藏
      addCateDialogVisble: false,

      //添加分类对象数据
      addCateForm: {
        cat_name: "",
        //父级
        cat_pid: 0,
        cat_level: 0
      },

      //添加分类表单数据验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },

      //父类数据
      parentslist: [],

      //联级选择器数据渲染
      cascaderPtions: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },

      //父级分类的ID数组
      selectdKeys: []
    };
  },

  mounted() {
    this.getCardList();
  },

  computed: {},
  methods: {
    //获取分类数据
    getCardList() {
      this.$axios.get("categories", { params: this.querIoFn }).then(res => {
        console.log(res);

        if (res.meta.status == 200) {
          this.cardlist = res.data.result;
          this.total = res.data.total;
          return this.$message.success("获取商品分类成功");
        } else {
          return this.$message.error("获取商品分类失败");
        }
      });
    },

    //分页逻辑代码
    handleSizeChange(size) {
      this.querIoFn.pagesize = size;
      this.getCardList();
    },
    handleCurrentChange(page) {
      this.querIoFn.pagenum = page;
      this.getCardList();
    },

    //点击按钮展示添加商品对话框
    showAddCateDialog() {
      this.getParentCateList();

      this.addCateDialogVisble = true;
    },

    getParentCateList() {
      this.$axios
        .get("categories", {
          params: { type: 2 }
        })
        .then(res => {
          if (res.meta.status == 200) {
            this.parentslist = res.data;
            return this.$message.success("获取商品分类列表数据成功");
          } else {
            return this.$message.error("获取商品分类列表数据失败");
          }
          // console.log(res.data);
        });
    },

    //选中数据发生函数
    handleChange() {
      console.log(this.selectdKeys);

      if (selectdKeys.length > 0) {
        this.addCateForm.car_pid = this.selectdKeys[
          this.selectdKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectdKeys.length;
        return;
      } else {
        this.addCateForm.car_pid = 0;

        this.addCateForm.cat_level = 0;
      }
    },

    //添加分类
    addCate() {
      console.log(this.addCateForm);
    },

    //删除用户
    async removeById(attr_id) {
      // console.log(id)
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

      const { data: res } = await this.$axios.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );

      if (res == 200) {
        return this.$message.error("删除用户失败!");
      }

      this.$message.success("删除用户成功!");
      this.getCardList();
    }
  }
};
</script>

<style scoped>
.block {
  margin-top: 20px;
}

.el-button {
  margin-bottom: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
