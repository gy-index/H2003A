<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/route' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-col style="margin-top:20px;">
      <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              clearable
              v-model="queryInFo.query"
              @clear="getdata"
            >
              <el-button @click="getdata" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>

        <el-table :data="orderslist" border style="width: 100% ">
          <el-table-column type="index" label="#" width="50"></el-table-column>
          <el-table-column prop="order_number" label="订单编号"></el-table-column>
          <el-table-column prop="order_price" label="订单价格" width="150"></el-table-column>
          <el-table-column prop="pay_status" label="是否付款">
            <template slot-scope="scope">
              <el-tag type="primary" effect="dark" v-if="scope.row.pay_status === '1'">已付款</el-tag>
              <el-tag type="danger" effect="dark" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货"></el-table-column>
          <el-table-column prop="create_time" label="下单时间">
            <template slot-scope="scope">{{scope.row.create_time | time}}</template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location-outline" @click="showBox1"></el-button>
          </el-table-column>
        </el-table>

       <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInFo.pagenum"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="queryInFo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-card>
    </el-col>

    <!-- 修改区域 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%">
      <span slot="footer" class="dialog-footer">
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="省市区/县" prop="address">
            <el-cascader :data="cityData"  v-model="addressForm.address"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address1">
            <el-input v-model="addressForm.address1"></el-input>
          </el-form-item>
        </el-form>

        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示进度区域 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线区域 -->

      <el-timeline>
        
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      orderslist: [],
      queryInFo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },

      cityData:[],
      total: null,
      addressVisible: false,

      progressVisible: false,

      progressInfo: [],

      addressForm: {
        address: [],
        address1: ""
      },

      addressFormRules: {
        address: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        address1: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      }
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
    this.getdata();
  },

  computed: {},
  methods: {
    getdata() {
      this.$axios.get("orders", { params: this.queryInFo }).then(res => {
        // console.log(res);
        if (res.meta.status == 200) {
          this.orderslist = res.data.goods;
        }
      });
    },

    // citydata(){
    //   this.$axios.post('../citydata.js').then(res=>{
    //     console.log(res)
    //   })
    // },

    //修改地址
    showBox() {
      this.addressVisible = true;
    },

    //查看地址
    showBox1() {
      this.$axios.get("/kuaidi/804909574412544580").then(res => {
        // console.log(res)
        if (res.meta.status == 200) {
          this.progressInfo = res.data;
          this.$message.success("获取物流信息进度成功!");
        } else {
          this.$message.error("获取物流信息进度失败!");
        }
      });
      this.progressVisible = true;

      console.log(this.progressInfo);
    },

    //分页逻辑代码
    handleSizeChange(size) {
      this.queryInFo.pagesize = size;
      this.getdata();
    },
    handleCurrentChange(page) {
      this.queryInFo.pagenum = page;
      this.getdata();
    }
  }
};
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}

.block {
  margin-top: 20px;
}

.el-cascader{
width: 100%;
}
</style>
