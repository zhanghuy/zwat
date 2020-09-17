<!--
 * @Author: your name
 * @Date: 2020-04-16 16:01:32
 * @LastEditTime: 2020-05-11 17:52:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yy-admin\src\components\common\asasas.vue
 -->
<template>
  <div class="page_table_main page_table page_card">
    <el-table
      border
      stripe
      :max-height="maxHeight"
      :data="tableList"
      v-if="tableColumn.length"
      :height="height"
      :row-class-name="rowClassName"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <!-- checkbox列 -->
      <el-table-column
        v-if="selection"
        type="selection"
        :key="item.name"
        :reserve-selection="reserveSelection"
        :selectable="checkSelectable"
        fixed="left"
        width="55px"
      ></el-table-column>
      <!-- 列数 -->
      <el-table-column v-if="hasIndex" fixed type="index" width="'55px'"></el-table-column>
      <template v-for="item in tableColumn">
        <!--正常列-->
        <el-table-column
          v-if="!item.render && item.name !== 'oper'"
          show-overflow-tooltip
          :key="item.name"
          :prop="item.name"
          :label="item.label"
          :width="item.width"
        >
          <!-- 正常列空值处理 -->
          <template slot-scope="scope">
            <span>
              {{
              scope.row[item.name] === '' ? '-' : scope.row[item.name]
              }}
            </span>
          </template>
        </el-table-column>
        <!--自定义渲染列-->
        <el-table-column
          v-else-if="item.name === 'oper'"
          :key="item.name"
          :prop="item.name"
          :label="item.label"
          fixed="right"
          :width="item.width || '180px'"
        >
          <template slot-scope="scope">
            <!-- <div class="btn-box"> -->
            <!-- <div class="left-btn"> -->
            <el-button
              v-for="bItem in getOperBtns(scope.$index, scope.row).slice(0, 3)"
              :role="bItem.role"
              size="small"
              :disabled="bItem.disabled || false"
              :key="bItem.label"
              :type="bItem.disabled ? '' : 'text'"
              @click="operationEvent(scope.$index, scope.row, bItem.role)"
              :icon="bItem.icon"
            >{{ bItem.label }}</el-button>
            <!-- </div> -->
            <el-dropdown
              class="btn_dropdown right-btn"
              trigger="click"
              v-show="getOperBtns(scope.$index, scope.row).length > 3"
            >
              <el-button type="text" class="btn_more">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in getOperBtns(scope.$index, scope.row).slice(3)"
                  :key="item.role"
                  :role="item.role"
                  @click.native="
                    operationEvent(scope.$index, scope.row, item.role)
                  "
                >{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- </div> -->
          </template>
        </el-table-column>
        <!--自定义渲染-->
        <!-- v-else -->
        <el-table-column
          v-else
          :key="item.name"
          :prop="item.name"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <table-body-render
              :index="scope.$index"
              :row="scope.row"
              :col="item"
              :config-render="item.render"
            ></table-body-render>
          </template>
        </el-table-column>
      </template>
      <!--操作列-->
      <el-table-column
        v-if="hasButton"
        class="table_operation"
        prop="operation"
        label="操作"
        fixed="right"
        :width="180"
      >
        <template slot-scope="scope">
          <el-button
            v-for="bItem in getButtonArr(scope.$index, scope.row)"
            :role="bItem.role"
            size="small"
            :disabled="bItem.disabled || false"
            :key="bItem.label"
            :type="bItem.disabled ? '' : 'text'"
            @click="operationEvent(scope.$index, scope.row, bItem.role)"
            :icon="bItem.icon"
          >{{ bItem.label }}</el-button>
          <el-dropdown
            class="btn_dropdown"
            trigger="click"
            v-show="getDropdownArr(scope.$index, scope.row).length"
          >
            <el-button type="text" class="btn_more">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in getDropdownArr(scope.$index, scope.row)"
                :key="item.role"
                :role="item.role"
                @click.native="
                  operationEvent(scope.$index, scope.row, item.role)
                "
              >{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import TableBodyRender from "./table-body-render.vue";
// import { isEmpty } from 'lodash';
// import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';

// @Component({ components: { TableBodyRender } })
export default {
  name: 'TempTable',
  components: {
    TableBodyRender
  },
  data () {
    return {
      maxHeight: 500,
      hasButton: this.tableBtns && this.tableBtns.length
    };
  },
  props: [
    "tableColumn",
    "tableList",
    "tableBtns",
    "columnWidth",
    "operationBtnWidth",
    "height",
    "selection",
    "hasIndex",
    "reserveSelection",
    "loading",
    "checkSelectable",
    "rowClassName"
  ],

  // @Prop({ type: Array }) tableColumn!: any[];
  // @Prop({ type: Array }) tableList!: any[];
  // @Prop({ type: Array }) tableBtns!: any[];
  // @Prop() columnWidth?: number;
  // @Prop() operationBtnWidth?: number;
  // @Prop() height?: number;

  // @Prop() selection?: boolean;
  // @Prop({ default: false }) hasIndex?: boolean;
  // @Prop({ default: true }) reserveSelection?: boolean;
  // @Prop({ default: false }) loading?: boolean;

  // @Prop({
  //   type: Function,
  //   default: () => {
  //     return true;
  //   }
  // })
  // checkSelectable?: Function;
  // @Prop() rowClassName?: Function;
  methods: {
    // get hasButton () {
    //   return this.tableBtns && this.tableBtns.length;
    // },

    // methods
    getOperBtns (index, row) {
      return row.oper;
    },

    /**
     * 行数据中按钮计算个数，超过3个时候，显示两个按钮，其余在下拉中展示
     * @param arr 按钮数组
     */
    getDropdownArr (index, row) {
      let arr = [];
      if (this.hasButton) {
        const btns = this.filterFalseBtns(index, row);
        const length = btns.length;
        arr = length <= 3 ? [] : btns.slice(2, length);
      }
      return arr;
    },

    getRowKeys (row) {
      // 唯一标识,根据后端字段来定,影响排序,影响多选分页回显
      // 以这几个任何一个值的返回值不能出现一样的值，courseId有的时候会出现相同的，所以要借助id
      return row.id || row.recommendId || row.courseId;
    },
    getButtonArr (index, row) {
      let arr = [];
      if (this.hasButton) {
        const btns = this.filterFalseBtns(index, row);
        const length = btns.length;
        arr = length <= 3 ? btns : btns.slice(0, 2);
      }
      return arr;
    },
    /**
     * 当数据中有操作按钮时，按钮的单击事件
     * @param arr 按钮数组
     */
    filterFalseBtns (index, row) {
      let arr = [];
      if (this.tableBtns.length !== 0) {
        arr = this.tableBtns.filter((item) => {
          // 过滤掉showHandler值为false的按钮
          const tag = typeof item.showHandler;
          switch (tag) {
            case "function":
              return item.showHandler(index, row, row.role);
            case "boolean":
              return item.showHandler;
            case "undefined":
              return true;
            default:
              return true;
          }
        });
      }
      return arr;
    },
    /**
     * 当数据中有操作按钮时，按钮的单击事件
     * @param index 操作行index
     * @param row   操作行数据
     * @param role  按钮角色
     */
    operationEvent (index, row, role) {
      this.$emit("operationEvent", row, role, index);
    },
    /**
     * table的左侧checkbox改变触发事件
     * @param {Array} rowList 选中的行所成的数组
     */
    handleSelectionChange (rowList) {
      this.$emit("getCheckedRow", rowList);
    }
  },
  created () {
    // console.log(this.tableColumn);
    // console.log(this.tableList);
  },
  mounted () {
    // 大屏增大表格固定高度
    this.$nextTick(() => {
      const windowWidth = window.screen.width;
      this.maxHeight = windowWidth > 1400 ? 600 : 375;
    });
  }
};
</script>
<style lang="less">
.page_table_main {
  .el-button {
    min-width: 0;
    margin: 0 2px;
    padding: 0 px;
  }
  .btn_dropdown {
    float: right;
    line-height: 28px;
  }
  .btn_more {
    span {
      color: #444444 !important;
    }
    .el-icon-arrow-down {
      background: none;
    }
  }
  .btn-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    .left-btn {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    .right {
      width: 60px;
    }
  }
}
.table_operation {
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
