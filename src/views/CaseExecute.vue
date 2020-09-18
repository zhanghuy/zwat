<template>
  <div class="caseExecute">
    <el-button type="button" @click="dialogFormVisible = true" class="addBtn">上传</el-button>
    <TempSearch
      searchTitle="用例执行"
      :search-data="searchData"
      :search-btns="searchBtns"
      @searchBtnEvent="searchBtnEvent"
    ></TempSearch>
    <TempTable
      v-loading="loading"
      :table-column="tableColumn"
      :table-btns="tableBtns"
      :table-list="tableList"
      :has-index="hasIndex"
      @operationEvent="operationEvent"
    ></TempTable>
    <TempPagination
      :pagination-init="paginationInit"
      @changePage="handlePageChange"
      @changeSizes="handleSizeChange"
    ></TempPagination>
    <el-dialog title="上传小程序包" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="项目">
          <el-select v-model="projectValue" placeholder="请选择">
            <el-option
              v-for="item in searchData[0].options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
        <el-upload
        action="/upload/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="executeCase">执行case</el-button>
      </div>
    </el-dialog>
    <!-- 编辑等级弹框 -->
    <!-- <el-dialog
      title="编辑本月等级"
      :visible.sync="isShowEditDialog"
      width="30%"
      @close="isShowEditDialog = false"
    >
      <el-radio-group v-model="curRank" @change="changeRank">
        <el-radio
          :label="item.label"
          v-for="(item, index) in rankList"
          :key="index"
          >{{ item.value }}</el-radio
        >
      </el-radio-group>
      <span slot="footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveMonthRank">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
// import moment from "moment";
// import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import TempSearch from "../components/temp-search.vue";
import TempTable from "../components/temp-table.vue";
import TempPagination from "../components/temp-pagination.vue";
// import $http from '@/api/api.ts';

const defaultSearchData = {
  year: null,
  month: null,
  keyword: null,
  pn: 1,
  rn: 50,
};

export default {
  name: "CaseExecute",
  components: {
    TempSearch,
    TempTable,
    TempPagination,
  },
  data () {
    return {
      fileList: [],
      searchData: [
        {
          type: "select",
          label: "项目:",
          name: "projects",
          placeholder: "请选择项目",
          defaultValue: "yingyu",
          options: [
            {
              label: "英语",
              value: "yingyu",
            },
          ],
        },
      ],
      // 搜索功能按钮
      searchBtns: [
        {
          name: "重置",
          role: "reset",
          type: "",
        },
        {
          name: "搜索",
          role: "search",
        },
      ],
      // 表头
      tableColumn: [
        {
          name: "project",
          label: "项目",
          width: "180px",
        },
        {
          name: "operator",
          label: "操作人",
          width: "180px",
        },
        {
          name: "time",
          label: "时间",
          width: "180px",
        },
        {
          name: "log",
          label: "日志",
          width: "180px",
        },
      ],
      // 操作按钮
      tableBtns: [
        {
          label: "编辑",
          type: "operation",
          role: "edit",
        },
      ],
      // 项目名称
      // 表格内容
      tableList: [],
      loading: false,
      // 页码
      paginationInit: {
        page: 1,
        total: 0,
        pageSize: 50,
        sizes: [50, 100, 200],
      },
      hasIndex: false, // 显示表格序列号
      searchFormData: defaultSearchData,
      isShowEditDialog: false, // 默认不显示生成小程序码弹框
      editRow: 0, // 当前设置等级行
      curRank: "",
      projectValue: "",
      dialogFormVisible: false,
    };
  },
  methods: {
    // 执行case
    executeCase () {
      this.projectValue = false
      const data = {
        'project-value': this.projectValue
      }
      this.$axios({
        method: "post",
        url: "/execute-case", // （必填）
        data: data,
        needLoading: false,
        needQsParse: false,
        vm: this,
        success: res => {
          console.log(res);
          this.$message("已经开始执行啦，请稍等");
        },
        error: (res) => {
          console.log(res);
          this.$message(res.errStr);
        }
      })
    },
    // 搜索功能区事件
    searchBtnEvent (btnObj, formData) {
      switch (btnObj.role) {
        case "reset":
          this.handleReset();
          break;
        case "search": // 查询
          console.log(formData);
          this.handleSearch(formData);
          break;
        default:
          break;
      }
    },
    // 表格操作事件
    operationEvent (row, btnRole, index) {
      switch (btnRole) {
        case "edit":
          this.editRow = row.id;
          console.log(row, this.editRow);
          if (row.level) {
            this.curRank = row.level;
          } else {
            this.curRank = "";
          }
          this.$nextTick(() => {
            this.isShowEditDialog = true;
          });
          break;
        default:
          break;
      }
    },
    // 重置
    handleReset () {
      this.searchFormData = defaultSearchData;
      this.paginationInit.page = 1;
      // this.getTeacherRankList();
    },
    // 按条件搜索
    handleSearch (formData) {
      // let year = null;
      // let month = null;
      // if (formData.cycle !== "全部") {
      //   const arr = formData.cycle.split("-");
      //   year = arr[0] && Number(arr[0]);
      //   month = arr[1] && Number(arr[1]);
      // }
      // this.paginationInit.page = 1;
      // this.searchFormData = {
      //   ...this.searchFormData,
      //   year: year,
      //   month: month,
      //   keyword: formData.keyword ? formData.keyword : null
      // };
      // this.getTeacherRankList();
    },
    add () {
      return "";
    },
    // 翻页
    handlePageChange (pageIndex) {
      // this.getTeacherRankList(pageIndex);
    },
    // 修改每页条数
    handleSizeChange (pageSizes) {
      this.paginationInit.page = 1;
      this.paginationInit.pageSize = pageSizes;
      // this.getTeacherRankList();
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log(file);
    },
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
  created () {
    console.log(this.searchData);
  }
};
</script>

<style lang="less" scoped>
.caseExecute {
  position: relative;
  /deep/ .page_search_form {
    padding-top: 50px;
  }
  .addBtn {
    position: absolute;
    right: 20px;
    top: 22px;
  }
}
</style>
