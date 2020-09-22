<template>
  <div class="search-container">
    <el-form
      ref="searchForm"
      :model="searchForm"
      class="search-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <p class="title">Publication Analysis</p>
      </div>

      <el-form-item prop="keywords">
        <el-input
          placeholder="planetary defense"
          v-model="searchForm.text"
          class="input-with-select"
          clearable
        >
          <el-select v-model="searchForm.type" slot="prepend">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              style="font-size:20px"
            ></el-option>
          </el-select>
        </el-input>
      </el-form-item>

      <div class="year-picker-container">
        <el-date-picker
          class="year-picker-right"
          v-model="searchForm.end"
          type="year"
          placeholder="end year"
          value-format="yyyy"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <el-date-picker
          class="year-picker-left"
          v-model="searchForm.start"
          type="year"
          placeholder="start year"
          value-format="yyyy"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;font-size:20px"
        @click.native.prevent="handleSearch"
      >Search</el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">keywords: admin</span>
        <span> password: any</span>
      </div>-->
    </el-form>
  </div>
</template>

<script>
import { requestData } from "@/api/result";
import { MessageBox, Message } from "element-ui";

export default {
  name: "Search",
  data() {
    return {
      options: [
        {
          value: "1",
          label: "content"
        },
        {
          value: "2",
          label: "author"
        },
        {
          value: "3",
          label: "nation"
        },
        {
          value: "4",
          label: "keyword"
        },
        {
          value: "5",
          label: "institution"
        }
      ],
      pickerOptions:{
        disabledDate(time){
          return time >= Date.now() || time.getFullYear() <= '1991'
        }
      },
      searchForm: {
        text: "",
        type: "1",
        start: "",
        end: ""
      },
      loading: false
    };
  },
  methods: {
    handleSearch() {
      this.loading = true;
      if (this.searchForm.start > this.searchForm.end) {
        Message({
          message: "invalid year range",
          type: "info",
          duration: 5 * 1000
        });
        this.loading = false;
      } else {
        requestData(this.searchForm)
          .then(response => {
            this.$store.dispatch("app/setParams", this.searchForm);
            // console.log(this.$store.getters.params);
            this.loading = false;
            Message({
              message: response.length + " records found",
              type: "success",
              duration: 5 * 1000
            });
            // console.log(this.$router.options.routes);
            this.$router.push({
              name: "Publication Statistic",
              query: {
                t: +new Date()
              }
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>

<style lang="scss">
.search-container {
  .el-form-item {
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    margin-bottom: 0px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #ffffff;
$light_black: #1f1f1f;
.input-with-select {
  font-size: 20px;
}

.year-picker-left {
  font-size: 18px;
  float: left;
  margin: 10px 0;
  width: 49%;
}

.year-picker-right {
  font-size: 18px;
  float: right;
  margin: 10px 0;
  width: 49%;
}
// .year-picker-container {
//   margin: 10px 0;
// }

.search-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .el-select {
    font-size: 20px;
    width: 135px;
    color: $light_black;
  }

  .search-form {
    position: relative;
    width: 700px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #000000;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .title-container {
    position: relative;

    .title {
      font-size: 35px;
      color: $light_black;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: 400;
    }
  }
}
</style>
