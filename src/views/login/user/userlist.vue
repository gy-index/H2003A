<template>
  <div class="container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/route' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-col style="margin-top:20px;">
      <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入内容"
              class="input-with-select"
              clearable
              @clear="getdata"
            >
              <el-button @click="getdata" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addDialog = true">添加用户</el-button>
          </el-col>
        </el-row>

        <!-- 列表渲染区域 -->
        <el-table :data="userslist" border style="width: 100%">
          <el-table-column type="index" label="#" width="60px"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#409EFF"
                inactive-color="#DCDFE6"
                @change="userstat(scope.row.id,scope.row.mg_state)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                content="修改用户"
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showditDialog(scope.row.id)"
              ></el-button>
              <el-button
                content="删除用户"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeById(scope.row.id)"
              ></el-button>
              <el-button
                content="分配角色"
                placement="top"
                :enterable="false"
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="setRole(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-card>
    </el-col>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      @close="addDialogs"
      :visible.sync="addDialog"
      width="50%"
      class="demo-ruleForm"
    >
      <el-form
        :model="addForm"
        status-icon
        :rules="addFormRules"
        ref="ruleFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="create_time">
          <el-input v-model="addForm.create_time"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible">
      <el-form
        @close="DialogClose"
        :rules="editFormRules"
        ref="editFormRef"
        :model="editsForm"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input placeholder="输入用户名" v-model="editsForm.username" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="输入用户邮箱" v-model="editsForm.email" />
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input placeholder="输入用户电话" v-model="editsForm.mobile" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editUserInfo">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisble"
      width="50%"
      @close="setRoleDialogVisible"
    >
      <div>
        <p>当前的用户 : {{userInFo.username}}</p>
        <p>当前的角色 : {{userInFo.role_name}}</p>
        <p>
          分配新角色 :
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleslist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { MessageBox } from "element-ui";
export default {
  name: "",
  data() {
    //验证邮箱校验规则
    let checkEmail = (rule, value, cb) => {
      const regemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regemail.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的邮箱地址"));
    };

    //验证手机校验规则
    let checkcreate = (rule, value, cb) => {
      const regmobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regmobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的手机号"));
    };
    return {
      userslist: [],
      plain: false,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: null,
      //控制添加用户的显示和隐藏
      editDialogs: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户信息验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkcreate, trigger: "blur" }
        ]
      },
      //控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      editsForm: {},
      //修改用户的手机和邮箱的验证规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkcreate, trigger: "blur" }
        ]
      },
      //查询到的用户信息对象
      addDialog: false,

      //分配角色权限
      setRoleDialogVisble: false,

      //分配角色数据
      userInFo: {},

      //所有角色的数据列表
      roleslist: [],

      //已选中的角色数据
      selectedRoleId: ""
    };
  },

  mounted() {
    this.getdata();
  },

  computed: {},
  methods: {
    //请求接口获取数据
    getdata() {
      this.$axios.get("/users", { params: this.queryInfo }).then(res => {
        // console.log(res);
        if (res.meta.status == 200) {
          this.userslist = res.data.users;
          this.total = res.data.total;
        }
      });
    },

    //分页逻辑代码
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getdata();
    },
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page;
      this.getdata();
    },

    //修改状态事件
    async userstat(uId, bool) {
      // console.log(userinfo);
      const { data: res } = await this.$axios.put(`users/${uId}/state/${bool}`);
      this.$message({
        message: "修改用户状态成功",
        type: "success"
      });
      this.getdata();
    },

    //监听添加用户的对话框的关闭事件为初始化
    addDialogs() {
      this.$refs.ruleFormRef.resetFields();
    },

    //点击按钮添加新用户
    adduser() {
      this.$refs.ruleFormRef.validate(async valid => {
        //console.log(valid);

        if (!valid) return;

        //可以添加用户的网络请求
        const { data: res } = await this.$axios.post("users", this.addForm);
        this.$message({
          message: "添加用户成功",
          type: "success"
        });
        // console.log(res);
        this.addDialog = false;
        this.getdata();
      });
    }, 
    // 修改用户状态 userid用户的id，state要修改的状态
    updateUserState(userid, state) {
      // console.log(userid, state);
      // 调用接口修改用户的状态
      this.$axios.put(`users/${userId}/state/${state}`).then(res => {
        //  console.log(res);
        if (res.meta.status == 200) {
          this.$message.success(res.meta.msg);
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },

    // 展示编辑用户的对话框
    showditDialog(id) {
      this.editDialogVisible = true;
      //console.log(id);
      this.$axios.get("users/" + id).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error("查询用户信息失败!");
        }
        this.editsForm = res.data;
      });
    },

    //监听修改用户对话框
    DialogClose() {
      this.$refs.editFormRef.resetFields();
    },

    //修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        //console.log(valid);

        if (!valid) return;

        //发起修改用户确定提交
        const { data: res } = await this.$axios.put(
          "users/" + this.editsForm.id,
          {
            email: this.editsForm.email,
            mobile: this.editsForm.mobile
          }
        );
        //console.log(this.editsForm.mobile)
        if (res.meta == 200) {
          return this.$message.error("跟新用户信息失败!");
        }
        //关闭对话框
        this.editDialogVisible = false;

        //刷新数据列表
        this.getdata();

        //提示修改成功
        this.$message.success("更新用户信息成功!");
      });
    },

    //删除用户
    async removeById(id) {
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

      const { data: res } = await this.$axios.delete("users/" + id);

      if (res == 200) {
        return this.$message.error("删除用户失败!");
      }

      this.$message.success("删除用户成功!");
      this.getdata();
    },

    //展示分配角色的对话框
    setRole(userInFo) {
      this.$axios.get(`roles`).then(res => {
        console.log(res);

        if (res.meta.status == 200) {
          this.roleslist = res.data;
        } else {
          return this.$message.error("获取角色列表失败");
        }
      });

      this.userInFo = userInFo;
      this.setRoleDialogVisble = true;
    },

    //点击确定按钮   添加选中分配
    saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配角色!");
      }

      this.$axios
        .put(`users/${this.userInFo.id}/role`, {
          rid: this.selectedRoleId
        })
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error("更新角色失败!");
            this.getdata();
          }else{
            this.$message.success("更新角色成功!");
            
          }

          this.getdata();
        })

      this.setRoleDialogVisble = false;
    },
    //监听对话框的关闭事件
    setRoleDialogVisible() {
      this.selectedRoleId = "";

      this.userInFo = {};
    },

    adduserinfo() {
      this.$refs.eidsFormRef.validate(valid => {
        //console.log(valid);
      });
    }
  }
};
</script>

<style scoped>
.el-table {
  margin-top: 15px;
  margin-bottom: 15px;
}

.el-card {
  box-shadow: 0 1px 1px rgb(0, 0, 0, 0.2) !important;
}
</style>
