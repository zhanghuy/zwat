<template>
  <div class="page_pagination_main page_card page_card_padding">
    <div v-if="!paginationInit.sizes">
      <el-pagination
        v-if="paginationInit.total > paginationInit.pageSize"
        @current-change="handleCurrentChange"
        :current-page="paginationInit.page"
        :page-size="paginationInit.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="paginationInit.total"
      ></el-pagination>
    </div>
    <el-pagination
      v-else
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginationInit.page"
      :page-sizes="paginationInit.sizes"
      :page-size="paginationInit.size"
      :total="paginationInit.total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: 'TempPagination',
  data () {
    return {};
  },
  props: ["paginationInit", "total", "page", "pageSize", "sizes"],
  methods: {
    // 页面改变事件（当前页）
    handleCurrentChange (currentPage) {
      this.$emit("changePage", currentPage);
    },
    // 切换页面展示条数
    handleSizeChange (pageSizesr) {
      this.$emit("changeSizes", pageSizesr);
    }
  }
};
</script>
