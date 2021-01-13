import Vue from  "vue";

import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        message:"hello Vuex",

        loading:false,//标志页面加载效果
        
        //商品列表
        goodslist:[],

        //购物车列表
        cartelist:[],
    },
    //操作state中的数据
    mutations:{

        addGoodsList(state,data){
            state.goodslist = data;
        },

        incr(state,index){
            state.goodslist[index].count++;
        },

        addfile(state,index){
            state.cartelist.push(index)
        },

        //修改state中的数据,payload额外的传递参数
        changeMsg(state,payload){

            //console.log(payload)

            state.message = payload;
        },
        //修改Loading的值
        changeLoading(state,loading){
           // console.log(loading)

            state.loading = loading
        },

        //设置面包屑
        setBread(state,bread){
            state.bread = bread;
        },

        //设置面包屑导航的数据
        setRouteBread(state,route){
            state.router_brand.push(route)
        }
    },

    //类似于VUE中的计算属性  对于state中的数据紧急性计算
    getters:{

    },

    //操作muntatios中的方法  同步操作
    cactios:{

    },

    //把vuex=进行模块处理
    modules:{
        
    }
})