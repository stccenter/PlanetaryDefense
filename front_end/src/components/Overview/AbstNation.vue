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
          // console.log(that.data)
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
      Array.prototype.pushNoRepeat = function() {
        for (var i = 0; i < arguments.length; i++) {
          var ele = arguments[i];
          if (this.indexOf(ele) == -1) {
            this.push(ele);
          }
        }
      };
      let nation_list = [];
      arr.forEach(v => {
        if (v.nation) {
          for (let j = 0; j < v.nation.length; j++) {
            nation_list.pushNoRepeat(v.nation[j].replace(/^\s+|\s+$/g, ""));
          }
        }
      });
      //initialize matrix & two dicts
      let nation_dict = {};
      let year_dict = {};
      let init = false;
      let d = new Array(nation_list.length);
      for (var k = 0; k < d.length; k++) {
        nation_dict[nation_list[k]] = k;
        d[k] = new Array(xAxisData.length);
        for (var index = 0; index < d[k].length; index++) {
          if (init) {
            year_dict[xAxisData[index]] = index;
          }
          d[k][index] = 0;
        }
        init = true;
      }

      let tmp = [];
      arr.forEach(x => {
        if (x.nation) {
          tmp = [];
          for (let m = 0; m < x.nation.length; m++) {
            tmp.pushNoRepeat(x.nation[m].replace(/^\s+|\s+$/g, ""));
          }
          for (let n = 0; n < tmp.length; n++)
            d[nation_dict[tmp[n]]][year_dict[x.year]]++;
        }
      });

      let p = [];
      for (let q = 0; q < nation_list.length; q++) {
        p.push({
          name: nation_list[q],
          data: d[q],
          type: "line",
          stack: "total",
          smooth: true,
          areaStyle: { normal: {} }
        });
      }
      return p;
    },
    compare(prop) {
      return function(a, b) {
        var v1 = a[prop];
        var v2 = b[prop];
        var x = 0;
        var y = 0;
        for (let i = 0; i < v1.length; i++) {
          x += v1[i];
          y += v2[i];
        }
        return x - y;
      };
    },
    initChart() {
      var arr = this.data;
      var xAxisData = this.countX(arr);
      var data = this.countY(arr, xAxisData);
      data = data.sort(this.compare("data"));
      this.chart.setOption({
        color: ["#5E27E8", "#2427E7", "#205FE5", "#1D97E3", "1DCEDE"],
        backgroundColor: "#ffffff",
        title: {
          top: 20,
          text: "Contribution of Nations by Year\n",
          textStyle: {
            fontWeight: "normal",
            fontSize: this.fontSize(0.3),
            color: "#666666"
          },
          subtext: "select to hide",
          subtextStyle: {
            fontSize: this.fontSize(0.15)
          },
          itemGap: 0,
          left: "1%"
        },
        tooltip: {
          trigger: "axis",
          confine: true,
          axisPointer: {
            lineStyle: {
              color: "#666666"
            }
          },
          formatter: function(params) {
            let newParams = [];
            let tooltipString = [];
            newParams = [...params];
            newParams.sort((a, b) => {
              return b.value - a.value;
            });
            newParams.forEach(p => {
              const cont =
                p.marker + " " + p.seriesName + ": " + p.value + "<br/>";
              if (p.value > 0) {
                tooltipString.push(cont);
              }
            });
            return tooltipString.join("");
          }
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true, title: "save as image" }
          }
        },
        legend: {
          top: this.fontSize(0.85),
          left: "8%",
          type: "scroll",
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: data.map(x => x.name).reverse(),
          right: "4%",
          // orient:'vertical',
          textStyle: {
            fontSize: this.fontSize(0.2),
            color: "#666666"
          }
        },
        grid: {
          top: this.fontSize(1.5),
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
                fontSize: this.fontSize(0.25)
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
        series: data,
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
      // this.chart.on("mouseover", function(params) {
      //   console.log(params);
      // });
      this.chart.on("click", function(params) {
        var list = [];
        arr.forEach(v => {
          if (v.nation && v.year == params.name) {
            for (let i = 0; i < v.nation.length; i++) {
              if (v.nation[i] == params.seriesName) {
                list.push(v);
                break;
              }
            }
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
