<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
import $ from "jquery";

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
      chart: null
    };
  },
  mounted() {
    this.initChart();
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
          document.body.clientWidth;
      if (!clientWidth) return;
      let fontSize = 100 * (clientWidth / 1920);
      return res * fontSize;
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      const word = [
        "asteroid",
        "planetary defense",
        "asteroid deflection",
        "kinetic impactor",
        "deflection",
        "neo",
        "near-earth objects",
        "astrometry",
        "characterization",
        "follow-up",
        "mitigation",
        "neoshield"
      ];
      const value = [
        [15, 23, 28, 33],
        [4, 11, 14, 25],
        [3, 18, 6, 12],
        [3, 15, 8, 11],
        [3, 13, 10, 6],
        [7, 5, 10, 17],
        [7, 3, 8, 10],
        [1, 5, 11, 13],
        [2, 7, 7, 6],
        [3, 0, 10, 11],
        [2, 4, 7, 10],
        [3, 2, 8, 7]
      ];
      const xAxisData = ["2013", "2015", "2017", "2019"];
      var p = [];
      for (var i = 0; i < word.length; i++) {
        p.push({
          name: word[i],
          data: value[i],
          type: "line",
          stack: "total",
          areaStyle: { normal: {} }
        });
      }
      // console.table(p)
      this.chart.setOption({
        backgroundColor: "#ffffff",
        // color: ['#E8187F','#E318B9','#CA19DD','#8C1AD7','#5E27E8','#2427E7','#205FE5','#1D97E3','#1DCEDE'],
        title: {
          top: 20,
          text: "Keywords analysis by year (Top 12)\n",
          textStyle: {
            fontWeight: "normal",
            fontSize: this.fontSize(0.4),
            color: "#666666"
          },
          left: "1%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#999999"
            }
          }
        },
        legend: {
          top: 80,
          left: "1%",
          type: "scroll",
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: p.map(x => x.name),
          right: "4%",
          textStyle: {
            fontSize: this.fontSize(0.27),
            color: "#666666"
          }
        },
        grid: {
          top: 140,
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
        series: p.reverse(),
        animationEasing: "elasticOut",
        animationEasingUpdate: "elasticOut",
        animationDelay(idx) {
          return idx * 20;
        },
        animationDelayUpdate(idx) {
          return idx * 20;
        }
      });
    }
  }
};
</script>
