<template>
  <div>
    <el-header class="nav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/route' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-card class="box-card">
      <div id="main" :style="{width:'1000px',height:'600px'}"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },

  mounted() {
    
    // 基于准备好的dom，初始化echarts实例
    var myChart = this.$echarts.init(document.getElementById("main")); // echartsExample是显示echart的元素id
    // 绘制图表
    myChart.setOption({
      title: {
        text: "用户来源"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      legend: {
        data: ["华东", "华南", "华北", "西部", "其他"]
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: [
            "2017-12-27",
            "2017-12-28",
            "2017-12-29",
            "2017-12-30",
            "2017-12-31",
            "2018-1-1"
          ]
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "华东",
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: [2999, 3111, 4100, 3565, 3528, 6000]
        },
        {
          name: "华南",
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: [5090, 2500, 3400, 6000, 6400, 7800]
        },
        {
          name: "华北",
          stack: "总量",
          type: "line",
          areaStyle: {},
          data: [6888, 4000, 8010, 12321, 13928, 12984]
        },
        {
          name: "西部",
          stack: "总量",
          type: "line",
          areaStyle: {},
          data: [9991, 4130, 7777, 12903, 13098, 14028]
        },
        {
          name: "其他",
          stack: "总量",
          type: "line",
          label: {
            normal: {
              show: true,
              position: "top"
            }
          },
          areaStyle: {},
          data: [15212, 5800, 10241, 14821, 15982, 14091]
        }
      ]
    });
  },

  computed: {},
  methods: {}
};
</script>

<style scoped>
.box {
  width: 100%;
  height: 600px;
  background: #fff;
}
#echartsExample {
  width: 500px;
  height: 500px;
}
</style>
