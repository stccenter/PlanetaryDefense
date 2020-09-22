<template>
  <div class="table-container">
    <el-table v-loading="loading" :data="list" style="width: 100%">
      <el-table-column
        prop="reference"
        label="Reference List"
        :sortable="true"
        :sort-method="sortByInitial"
      ></el-table-column>
      <el-table-column prop="doi" label="Resource Link" min-width="15%">
        <template slot-scope="scope">
          <el-button size="medium" @click="handleURL(scope.row)">Jump</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="sliceList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: "ReferenceList",
  components: { Pagination },
  data() {
    return {
      data: [],
      list: [],
      loading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.data = this.$route.params.list;
      this.total = this.data.length;
      this.data = this.data.sort(this.sortByInitial);
      this.sliceList();
      this.loading = false;
      //   console.log(this.data.length);
    },
    handleURL(row) {
      console.log(row.doi);
      row.doi ? window.open(row.doi) : alert("doi not available");
    },
    sliceList() {
      this.list = this.data.slice(
        (this.listQuery.page - 1) * this.listQuery.limit,
        this.listQuery.page * this.listQuery.limit
      );
    },
    sortByInitial(obj1, obj2) {
      let a = obj1.reference;
      let b = obj2.reference;
      if (a == null || b == null) {
        return 1;
      }
      return a
        .replace(/^\s+|\s+$/g, "")
        .slice(0, 6)
        .toLowerCase()
        .localeCompare(
          b
            .replace(/^\s+|\s+$/g, "")
            .slice(0, 6)
            .toLowerCase()
        );
    }
  }
};
</script>

<style lang="scss">
.table-container {
  min-height: 100%;
  width: 100%;
}
</style>