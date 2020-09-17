<script>
// import { isEmpty, isArray } from 'lodash';
// import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';

export default {
  name: 'tableBodyRender',
  props: ["configRender", "index", "row"],
  methods: {
    render (h) {
      // 自定义render
      // 只能返回一个Vnode节点
      // h:createElement
      // index:表格当前行下标
      // row: 表格当前行数据
      // 例如 customRender(h, {index, row}){}
      const Vnodes = this.configRender(h, { index: this.index, row: this.row });
      if (Vnodes.length !== 0) {
        return Array.isArray(Vnodes) ? Vnodes.pop() : Vnodes;
      }
      return "";
    }
  }
};
</script>
