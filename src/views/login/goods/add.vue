<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/user' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索与添加区域 -->
    <el-card>
      <!-- 图标区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧TAB选项卡 -->
      <el-form
        :model="addForm"
        :rules="rules"
        ref="ruleForm"
        label-position="top"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-tabs
          tabPosition="left"
          v-model="activeIndex"
          :before-leave="beforeTab"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight ">
              <el-input v-model="addForm.goods_weight "></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :options="cartdlist"
                :props="addFormlist"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <!-- 多选框区域 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="ite" v-for="(ite,ind) in item.attr_vals" :key="ind" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item :label="item.attr_name" v-for="item in selTabData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              :action="headerURL"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :on-success="headleSuccess"
              :headers="headerobj"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>

            <el-button type="primary" @click="addclick">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible.sync="peviewVisible" width="50%">
      <img :src="previewPath" class="images" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash"
export default {
  name: "",
  data() {
    return {
      active: 0,
      activeIndex: "0",
      //添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        //商品所属分类数组
        goods_cat: [],
        pics: [],
        goods_introduce: "",

        attrs:[]
      },
      //商品校验
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ]
      },

      // 商品分类
      addFormlist: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 商品分类数据
      cartdlist: [],
      //  商品参数数据
      manyTabData: [],

      selTabData: [],

      headerURL: "https://www.liulongbin.top:8888/api/private/v1/upload",

      headerobj: {
        Authorization: window.sessionStorage.getItem("token")
      },

      previewPath: "",
      peviewVisible: false
    };-kl789
  },
  mounted() {
    this.getdata();
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  },
  methods: {
    // 获取商品分类数据
    getdata() {
      this.$axios.get("categories").then(res => {
        console.log(res);
        if (res.meta.status == 200) {
          this.cartdlist = res.data;
          return this.$message.success("获取商品分类成功!");
        } else {
          return this.$message.error("获取商品分类失败!");
        }
      });
    },

    //级联选择器
    handleChange() {
      console.log(this.addForm.goods_cat);
    },
    // 点击tab选卡时的切换判断事件
    beforeTab(activeName, oldActiveName) {
      // console.log("即将离开的页面" + oldActiveName);
      // console.log("即将进入的页面" + activeName);
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类!");

        return false;
      }
    },

    tabClicked() {
      if (this.activeIndex === "1") {
        this.$axios
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "many" }
          })
          .then(res => {
            // console.log(res);
            res.data.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            });
            this.manyTabData = res.data;
          });
      } else if (this.activeIndex === "2") {
        this.$axios
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "only" }
          })
          .then(res => {
            this.selTabData = res.data;
          });
      }
    },

    //图处理预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;

      this.peviewVisible = true;
    },

    //处理图片删除
    handleRemove(file) {
      // console.log(file)
      const filePath = file.response.data.tmp_path;

      // console.log(filePath)
      const imd = this.addForm.pics.findIndex(x => x.pic === filePath);

      this.addForm.pics.splice(imd, 1);

      //  console.log(this.addForm)
    },

    //图片上传成功时的事件
    headleSuccess(response) {
      // console.log(response)
      const picIofo = { pic: response.data.tmp_path };

      this.addForm.pics.push(picIofo);

      // console.log(this.addForm)
    },

    addclick() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          console.log(this.addForm.attrs)
          this.manyTabData.forEach(item => {
            const newIofo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(",")
            };

            this.addForm.attrs.push(newIofo);
          });
          
          this.selTabData.forEach(item => {
            const newIofo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };

            this.addForm.attrs.push(newIofo);
          });
          form.attrs = this.addForm.attrs
          console.log(form)

          this.$axios.post('goods',form).then(res=>{
            console.log(res)
          if(res.meta.status == 201){
            this.$message.success('添加商品成功!')

            this.$router.push('/goods')
          }

          })
        } else {
          return this.$message.error("请填写必要的表单项!");
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

.el-steps {
  margin-top: 20px;
}

.images {
  width: 100%;
  height: 100%;
}

.quill-editor {
  height: 300px;
  margin-bottom: 50px;
}
</style>
