<!--
 * @Author: your name
 * @Date: 2020-04-16 16:01:32
 * @LastEditTime: 2020-04-19 23:06:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yy-admin\src\components\common\temp-search.vue
 -->
<template>
  <div class="page_search_main tools">
    <div class="page_search_form page_card page_card_padding" v-show="searchData.length > 0">
      <h1 class="page_title">
        {{ searchTitle }}
        <!-- <span
          v-if="searchData.length && showExpand"
          class="open_search"
          @click="changeSearch"
        >
          {{ isExpand ? '收缩筛选' : '展开筛选' }}
          <span class="icon_arrow">
            <i :class="downOrup"></i>
          </span>
        </span> -->
      </h1>
      <el-form
        :model="form"
        :inline="true"
        ref="commonForm"
        class="page_form"
        :label-width="labelWidth || '80px'"
        :style="curSearchMaxHeight"
      >
        <template>
          <el-form-item
            v-for="item in searchData"
            :label="item.label"
            :rules="item.rules"
            :prop="item.name"
            :label-width="item.labelWidth"
            :key="item.name"
          >
            <!-- input级联选择器 -->
            <el-cascader
              size="eleSize"
              :props="item.props"
              v-if="item.type == 'cascader'"
              v-model="form[item.name]"
              :options="item.options"
            ></el-cascader>
            <!-- input输入框 -->
            <el-input
              v-if="item.type == 'text'"
              :size="eleSize"
              :placeholder="item.placeholder"
              v-model.trim="form[item.name]"
              :clearable="item.clearable"
              :disabled="item.disabled"
              @input="updateAttribute"
            ></el-input>
            <!-- input的number输入框 -->
            <el-input
              v-if="item.type == 'number'"
              :size="eleSize"
              type="number"
              :placeholder="item.placeholder"
              v-model.number="form[item.name]"
              :clearable="item.clearable"
              :disabled="item.disabled"
              @input="updateAttribute"
            ></el-input>
            <!-- select选择器 -->
            <el-select
              v-if="item.type == 'select'"
              :size="eleSize"
              v-model="form[item.name]"
              :multiple="item.multiple"
              :collapse-tags="item.multiple"
              :clearable="item.clearable"
              :disabled="item.disabled"
              :placeholder="item.placeholder"
              @change="handleMultChange(...arguments, item.name, item.multiple)"
            >
              <el-option
                v-for="option in item.options"
                :label="option.label"
                :value="option.value"
                :key="option.value"
              ></el-option>
            </el-select>
            <!--select远程搜索-->
            <el-select
              v-if="item.type == 'remote'"
              :size="eleSize"
              v-model="form[item.name]"
              :clearable="item.clearable"
              filterable
              remote
              :remote-method="item.remoteMethod"
              :loading="item.loading"
              :disabled="item.disabled"
              :placeholder="item.placeholder"
              @change="updateAttribute"
            >
              <el-option
                v-for="option in item.options"
                :label="option.label"
                :value="option.value"
                :key="option.value"
              ></el-option>
            </el-select>
            <!-- checkbox多选框 -->
            <el-checkbox-group
              v-if="item.type == 'checkbox-group'"
              v-model="form[item.name]"
              @change="updateAttribute"
            >
              <el-checkbox
                v-for="option in item.options"
                :label="option.label"
                :value="option.value"
                :disabled="option.disabled"
                :key="option.value"
              ></el-checkbox>
            </el-checkbox-group>
            <!-- 日期选择器 -->
            <el-date-picker
              v-if="item.type === 'date'"
              v-model="form[item.name]"
              :size="eleSize"
              type="date"
              align="right"
              unlink-panels
              placeholder="请选择"
              :picker-options="item.options"
              @change="handleDateChange(...arguments, item.name)"
              :value-format="item.valueFormat || 'timestamp'"
            ></el-date-picker>
            <!-- 日期选择器 范围-->
            <el-date-picker
              v-if="item.type == 'datePicker'"
              v-model="form[item.name]"
              :format="item.format"
              :value-format="item.valueFormat"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="item.options"
              @change="updateAttribute"
            ></el-date-picker>
            <!-- 日期时间选择器 -->
            <el-date-picker
              v-if="item.type == 'datetimerange'"
              v-model="form[item.name]"
              :format="item.format"
              :value-format="item.valueFormat"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="item.options"
              @change="updateAttribute"
            ></el-date-picker>
            <!--年选择器-->
            <el-date-picker
              v-if="item.type === 'year'"
              v-model="form[item.name]"
              type="year"
              value-format="yyyy"
              placeholder="请选择"
              @change="updateAttribute"
            ></el-date-picker>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <!-- 按钮集合 -->
    <div class="page_search_btn page_card page_card_padding">
      <section class="search_tips">
        <slot name="left"></slot>
      </section>
      <section class="btn_group">
        <div class="page_search_btn_wrapper" v-for="(item, index) in searchBtns" :key="index">
          <el-button-group v-if="Array.isArray(item)">
            <el-button
              v-for="(btnList, index) in item"
              :key="index"
              :type="btnList.type === undefined ? 'primary' : item.type"
              @click="onBtnClick(btnList)"
            >{{ btnList.name }}</el-button>
          </el-button-group>
          <el-dropdown
            trigger="click"
            v-for="btnList in item.btnList"
            :key="btnList.role"
            v-else-if="item.dropDown"
            @command="onBtnClick"
          >
            <el-button :type="btnList.type === undefined ? 'primary' : btnList.type">
              {{ btnList.name }}
              <i class="el-icon-arrow-down el-icon--right btn_icon_type"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="dropList in btnList.dropList"
                :command="dropList"
                :key="dropList.role"
              >{{ dropList.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-else
            :type="item.type === undefined ? 'primary' : item.type"
            @click="onBtnClick(item)"
          >{{ item.name }}</el-button>
        </div>
      </section>
    </div>
    <!--信息变动展示-->
    <div class="page_search_btn page_card page_card_padding page_card_bottom" v-if="$slots.bottom">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script>
// import { map } from 'lodash';
export default {
  name: 'TempSearch',
  data () {
    return {
      showExpand: true,
      isExpand: false,
      form: {}, // 查询表单数据
      openFilter: "展开筛选",
      curSearchMaxHeight: null,
      isExpandSelect: false,
      screenWidth: document.body.clientWidth,
      container: null, // 表单项容器
      children: null, // 表单项数组
      childHeight: 0, // 表单项高度，不包含margin值
      timer: false // 控制视窗改变时，计算高度函数截流
    };
  },
  props: [
    "searchData",
    "searchBtns",
    "isShowTitle",
    "clearable",
    "eleSize",
    "searchTitle",
    "labelWidth"
  ],

  // @Prop({ type: Array, default: [] }) searchData!: any[]; // 搜索选项
  // @Prop({ type: Array, default: [] }) searchBtns!: any[]; // 搜索按钮

  // @Prop({ default: true }) isShowTitle?: boolean;
  // @Prop({ default: true }) clearable?: boolean;

  // @Prop({ type: String, default: 'large' }) eleSize?: string; // 筛选框大小
  // @Prop({ type: String, default: '' }) searchTitle?: string; // 搜索部分标题
  // @Prop() labelWidth?: string; // 搜索lableWidth
  methods: {
    getSearchLen () {
      return this.searchData.length;
    },
    downOrup () {
      return this.isExpand
        ? "icon_arrow_up icon_arrow_common"
        : "icon_arrow_down icon_arrow_common";
    },

    // methods

    // 更新查询条件
    updateAttribute () {
      this.$emit("updateQueryFormValue", this.form);
    },

    // 多选框改变时触发
    // 处理'全部'和其他互斥关系
    handleMultChange (val, name, multiple) {
      this.$emit("handleMultChange", val, name);
      if (multiple) {
        let select = [];
        const len = val.length;
        const value = len > 0 ? val[len - 1] : true;
        if (len > 0 && (value || typeof value === "number")) {
          select = val.filter((item) => item !== "");
        } else if (value === "") {
          select = [""];
        }
        this.form[name] = [].concat(select);
      }
      this.updateAttribute();
    },

    // 日期变化时抛出事件
    handleDateChange (val, name) {
      this.$emit("handleChange", name, val, this.form);
      this.updateAttribute();
    },

    // 初始化默认选择项
    setDefault () {
      const formObject = {};
      if (this.searchData && this.searchData.length > 0) {
        this.searchData.forEach((item, index) => {
          formObject[item.name] =
            item.defaultValue || item.defaultValue === 0
              ? item.defaultValue
              : "";
        });
      }
      this.form = formObject;
    },

    // 收缩事件
    changeSearch () {
      this.isExpand = !this.isExpand;
    },

    // 改变容器高度
    changeSearchHeight () {
      this.$nextTick(() => {
        this.curSearchMaxHeight = this.isExpand
          ? `height:${this.calculateSearchHeight()}px`
          : `height:${this.childHeight}px`;
      });
    },

    // 计算容器高度
    calculateSearchHeight () {
      const child = this.children[0]; // 单个表单项
      const childStyle = window.getComputedStyle(child); // 单个表单项dom属性
      const childMargin =
        parseInt(childStyle.marginBottom) + parseInt(childStyle.marginTop); // 变量后加!, 进行非空断言。
      const childHeight = this.childHeight + childMargin; // 单个表单项绝对高度
      const widthArr = this.serializeChildWidth(this.children);
      const rowNum = this.getRowNum(widthArr); // 获取表单项行数
      return rowNum * childHeight - childMargin;
    },

    // 序列化元素宽度
    // 返回所有表单元素的宽度
    serializeChildWidth (nodes) {
      const arr = [];
      const getStyle = (child) => window.getComputedStyle(child);
      // arr = map(nodes, (node) => {
      //   return (
      //     parseInt(getStyle(node).width) + parseInt(getStyle(node).marginRight)
      //   );
      // });
      nodes.forEach((node) => {
        arr.push(parseInt(getStyle(node).width) + parseInt(getStyle(node).marginRight))
      });
      return arr;
    },

    // 对序列化宽度分组获取容器可容纳行数
    getRowNum (array) {
      let rowNum = 1; // 行数
      let total = 0;
      array.forEach((item, index) => {
        total = total + item;
        if (this.isOverWidth(total)) {
          total = item;
          rowNum++;
        }
      });
      return rowNum;
    },

    // 是否超出容器最大宽度
    isOverWidth (accum) {
      const containerWidth = parseInt(this.container.offsetWidth); // 容器宽度
      return accum > containerWidth;
    },

    // reset
    resetForm () {
      this.$nextTick(() => {
        // this.$refs.commonForm.resetFields(); // 清空表单验证提示 注;报错，样下面方式写
        const ref = this.$refs.commonForm;
        ref.resetFields(); // 清空表单验证提示
        this.setDefault();
      });
    },

    // 按钮点击事件
    onBtnClick (item) {
      if (item.role === "reset") {
        this.$nextTick(() => {
          // this.$refs.commonForm.resetFields(); // 清空表单验证提示 注;报错，样下面方式写
          const ref = this.$refs.commonForm;
          ref.resetFields(); // 清空表单验证提示
          this.setDefault();
        });
      }
      // else if (item.role === 'search') {
      //   // 表单验证
      //   this.$refs.commonForm.validate(valid => {
      //     if (!valid) {
      //       return false;
      //     }
      //   });
      // }
      this.$emit("searchBtnEvent", item, this.form, this.$refs.commonForm);
    },

    // 设置表单项默认初始高度
    setSearchDefaultHeight () {
      // this.container = this.$refs.commonForm.$el;
      const ref = this.$refs.commonForm;
      this.container = ref.$el;
      if (this.container) {
        this.children = this.container.querySelectorAll(".el-form-item");
        if (this.children.length) {
          const childStyle = window.getComputedStyle(this.children[0]);
          this.childHeight = parseInt(childStyle.height);
          this.$nextTick(() => {
            this.curSearchMaxHeight = `height:${this.childHeight}px`;
            this.showExpand = this.isShowExpand();
          });
        }
      }
    },

    // 表单大于一行时展示操作按钮
    isShowExpand () {
      const widthArr = this.serializeChildWidth(this.children);
      const rowNum = this.getRowNum(widthArr); // 获取表单项行数
      return rowNum > 1;
    },

    // 获取当前筛选表单值
    getSearchVal () {
      return this.form;
    },

    // 设置当前表单的筛选值
    setSearchVal (form) {
      this.$nextTick(() => {
        this.form = Object.assign({}, this.form, form);
      });
    },
    mounted () {
      this.setDefault(); // 设置初始默认值
      this.setSearchDefaultHeight();
      // 视窗拉伸后重新绑定screenWidth值
      window.onresize = () => {
        return (() => {
          this.screenWidth = document.body.clientWidth;
        })();
      };
    }
  },
  Watch: {
    routechange (val) {
      if (val) {
        this.isExpand = false;
        this.setDefault();
      }
    },
    onIsExpandChanged (val) {
      this.changeSearchHeight();
    },
    // 视窗值改变后重新计算容器高度
    onScreenWidthChanged (val) {
      if (!this.timer) {
        this.timer = true;
        setTimeout(() => {
          this.changeSearchHeight();
          this.timer = false;
        }, 200);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.tools {
  /deep/ .el-select,
  /deep/ .el-input {
    width: 163px !important;
  }
  .page_search_btn {
    display: flex;
    .search_tips {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
    .btn_group {
      display: inline-block;
      flex: 0 0 auto;
    }
  }
  .icon_arrow {
    &_common {
      display: inline-block;
      width: 14px;
      height: 14px;
      vertical-align: text-bottom;
      background: url("../assets/imgs/ic_arrowdown_normal.png") no-repeat 0 0;
      background-size: cover !important;
      transition: all 0.2s ease-in-out;
    }
    &_up {
      transform: rotate(180deg);
    }
  }
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 15px !important;
  }
  /deep/ .el-date-editor {
    padding: 0 !important;
    &.el-input {
      width: 163px !important;
    }
    .el-range__icon {
      margin-left: 0;
    }
  }
  /deep/ .el-form-item__label {
    font-weight: 500;
  }
  /deep/ .el-range-editor {
    width: 416px !important;
  }
}
</style>
