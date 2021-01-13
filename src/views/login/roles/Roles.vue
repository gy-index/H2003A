<template>
  <div class="container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/route' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-col style="margin-top:20px;">
      <el-card>
        <el-button type="primary">添加用户</el-button>
        <el-table :data="navslist" border style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row
                :class="['btbottom', index === 0? 'btop':'','views']"
                v-for="(item,index) in scope.row.children"
                :key="index.id"
                effect="dark"
              >
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                  <el-tag effect="dark" size="small" closable @close="removeById(scope.row, item.id)">{{item.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级、三级权限 -->
                <el-col :span="19">
                  <el-row
                    :class="[ind === 0?'':'btop','views']"
                    v-for="(ite,ind) in item.children"
                    :key="ind.id"
                   
                  >
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        effect="dark"
                        size="small"
                        @close="removeById(scope.row, ite.id)"
                      >{{ite.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        closable
                        effect="dark"
                        size="small"
                        type="warning"
                        v-for="(item1,index1) in ite.children"
                        :key="index1.id"
                        @close="removeById(scope.row, item1.id)"
                      >{{item1.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>

          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="校色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showditDialog(scope.row.id)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="remove(scope.row.id)"
              >删除</el-button>
              <el-button
                @click="showSetright(scope.row)"
                size="mini"
                type="warning"
                icon="el-icon-share"
              >分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible">
      <el-form
        @close="DialogClose"
        :rules="editFormRules"
        ref="editFormRef"
        :model="editsForm"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="输入角色名称" v-model="editsForm.roleName" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="输入角色描述" v-model="editsForm.roleDesc " />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editUserInfo">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限全区域 -->
    <el-dialog
      title="分配权限"
      @close="setRightDialogClosed"
      :visible.sync="setRightDialogVisible"
      width="60%"
    >
      <!-- 树形框架区域 -->
      <el-tree
        show-checkbox
        node-key="id"
        ref="treeRef"
        default-expand-all
        :default-checked-keys="defKeys"
        :data="rightslist"
        :props="treeProps"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allReadYes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      navslist: [],
      //权限列表
      rightslist: [],
      //树形控件
      treeProps: {
        label: "authName",
        children: "children"
      },

      editsForm: {},

      //控制修改用户对话框的显示与隐藏
      editDialogVisible: false,

      //编辑角色名称和角色描述的验证规则
      editFormRules: {
        roleName: [
          {
            required: true,
            message: "角色名称长度在2~8个字符之间",
            trigger: "blur"
          }
        ],
        roleDesc: [
          {
            required: true,
            message: "角色描述长度在1~15个字符之间",
            trigger: "blur"
          }
        ]
      },

      //默认选中的值
      defKeys: [],

      //当前分配权限的角色
      roleId: "",

      setRightDialogVisible: false
    };
  },

  mounted() {
    this.getdatas();
  },

  computed: {},
  methods: {
    //获取角色列表数据
    getdatas() {
      this.$axios.get("roles").then(res => {
        // console.log(res);

        if (res.meta.status == 200) {
          this.navslist = res.data;
          // console.log(this.navslist);
        }
      });
    },

    // 展示编辑用户的对话框
    showditDialog(id) {
      this.editDialogVisible = true;
      //console.log(id);
      this.$axios.get("roles/" + id).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error("查询用户信息失败!");
        }
        this.editsForm = res.data;
      });
    },

    //修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        //console.log(valid);

        if (!valid) return;

        //发起修改用户确定提交
        const { data: res } = await this.$axios.put(
          "roles/" + this.editsForm.id,
          {
            roleName: this.editsForm.roleName,
            roleDesc: this.editsForm.roleDesc
          }
        );
        //console.log(this.editsForm.mobile)
        if (res !== 200) {
          return this.$message.error("更新用户信息失败!");
        }
        //关闭对话框
        this.editDialogVisible = false;

        //刷新数据列表
        this.getdatas();

        //提示修改成功
        this.$message.success("更新用户信息成功!");
      });
    },

    //监听修改用户对话框
    DialogClose() {
      this.$refs.editFormRef.resetFields();
    },

    //删除用户
    async remove(id) {
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

      const { data: res } = await this.$axios.delete("roles/" + id);

      if (res == 200) {
        return this.$message.error("删除用户失败!");
      }

      this.$message.success("删除用户成功!");
      this.getdatas();
    },

    //根据ID删除权限
    async removeById(roles, rights) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("用户取消删除");
      }

      const data = await this.$axios.delete(
        `roles/${roles.id}/rights/${rights}`
      );
      console.log(data);

      if (data.meta.status !== 200) {
        return this.$message.error("用户删除权限失败!");
      }

      roles.children = data.data;
    },

    //展示分配权限的时间
    showSetright(role) {
      this.roleId = role.id;
      this.$axios.get("rights/tree").then(res => {
        console.log(res);

        if (res.meta.status !== 200) {
          return this.$message.error("获取权限列表失败!");
        }

        this.rightslist = res.data;

        console.log(this.rightslist);

        this.setRightDialogVisible = true;

        this.gettleafkeys(role, this.defKeys);
      });
    },

    //通过递归的方式获取角色所有数据
    gettleafkeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach(item => {
        this.gettleafkeys(item, arr);
      });
    },

    //监听分配权限对话框的关闭
    setRightDialogClosed() {
      this.defKeys = [];
    },

    //确定所选数据据并完成添加
    allReadYes() {
      let keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];

      let idStr = (keys = keys.join(","));

      this.$axios
        .post(`roles/${this.roleId}/rights`, { rids: idStr })
        .then(res => {
          if (res.meta.status == 200) {
            this.$message.success("分配权限成功!");
          } else {
            this.$message.error("分配权限失败!");
          }
        });

      this.setRightDialogVisible = false;
    }
  }
};
</script>

<style scoped>
.el-table {
  margin-top: 10px;
}

.el-tag {
  margin: 7px;
}

.btop {
  border-top: 1px solid #eee;
}

.btbottom {
  border-bottom: 1px solid #eee;
}

.views {
  display: flex;
  align-items: center;
}
</style>
