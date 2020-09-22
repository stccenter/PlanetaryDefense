<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
import { requestData } from "@/api/result";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "200px"
    },
    height: {
      type: String,
      default: "200px"
    }
  },
  data() {
    return {
      chart: null,
      data: []
    };
  },
  mounted() {
    this.getData();
    // this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    fontSize(res) {
      let docEl = document.documentElement,
        clientWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth,
        clientHeight = window.innerHeight;
      if (!clientWidth || !clientHeight) return;
      let fontSize = 100 * Math.min(clientWidth / 1920, clientHeight / 720);
      // console.log("W: " + clientWidth / 1920 + ", H: " + clientHeight / 720);
      return res * fontSize;
    },
    getData() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.chart.showLoading({
        text: "loading",
        color: "#105bd8"
      });
      let that = this;
      requestData(this.$store.getters.params)
        .then(res => {
          that.data = res;
        })
        .then(res => {
          that.initChart();
        });
    },
    countX(arr) {
      var temp = [];
      let count = [];
      arr.forEach(x => {
        if (x.year) {
          temp.push(x.year);
        }
      });
      for (var i = 0; i < temp.length; i++) {
        if (count.indexOf(temp[i]) == -1) {
          count.push(temp[i]);
        }
      }
      count.sort(function(a, b) {
        return a - b;
      });
      return count;
    },
    countY(arr, xAxisData) {
      let a = new Array(xAxisData.length);
      for (var index = 0; index < a.length; index++) {
        a[index] = 0;
      }
      for (var i = 0; i < xAxisData.length; i++) {
        arr.forEach(x => {
          if (x.year == xAxisData[i]) {
            a[i]++;
          }
        });
      }
      return a;
    },
    initChart() {
      var arr = this.data;
      var xAxisData = this.countX(arr);
      var data = this.countY(arr, xAxisData);
      this.chart.setOption({
        backgroundColor: "#ffffff",
        color: ["#105bd8"],
        title: {
          top: 20,
          text: "Publication Number by Year",
          textStyle: {
            fontWeight: "normal",
            fontSize: this.fontSize(0.3),
            color: "#666666"
          },
          left: "5%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#666666"
            }
          }
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true, title: 'save as image' }
          }
        },
        grid: {
          // top: 60 + this.fontSize(0.3),
          top: this.fontSize(1),
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: xAxisData,
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#999999"
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: this.fontSize(0.2)
              }
            }
          }
        ],
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#999999"
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: this.fontSize(0.2)
            }
          },
          splitLine: {
            lineStyle: {
              color: "#cccccc"
            }
          }
        },
        series: [
          {
            name: "Total number",
            type: "line",
            smooth: true,
            data: data,
            label: {
              normal: {
                show: true,
                position: "top",
                fontSize: this.fontSize(0.2)
              }
            }
          }
        ],
        animationEasing: "elasticOut",
        animationEasingUpdate: "elasticOut",
        animationDelay(idx) {
          return idx * 20;
        },
        animationDelayUpdate(idx) {
          return idx * 20;
        }
      });

      this.chart.hideLoading();
      let that = this;
      this.chart.on("click", function(params) {
        var list = [];
        var year = params.name;
        arr.forEach(v => {
          if (v.year == year) {
            list.push(v);
          }
        });
        let p = {};
        p.list = list;
        that.$router.push({ name: "ReferenceList", params: p });
      });
    }
  }
};
</script>
