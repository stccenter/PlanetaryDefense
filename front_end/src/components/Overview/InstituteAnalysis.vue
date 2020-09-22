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
    count(arr) {
      Array.prototype.pushNoRepeat = function() {
        for (var i = 0; i < arguments.length; i++) {
          var ele = arguments[i];
          if (this.indexOf(ele) == -1) {
            this.push(ele);
          }
        }
      };
      var inst = [];
      var count = {};
      let tmp = [];
      arr.forEach(x => {
        if (x.institute != null) {
          tmp = [];
          for (var i = 0; i < x.institute.length; i++) {
            let key = x.institute[i];
            if (key.search("Jet Propulsion") != -1 || key == 'JPL') {
              tmp.pushNoRepeat("NASA");
              tmp.pushNoRepeat("CALTECH");
            } else if (key.search("NASA") != -1) {
              tmp.pushNoRepeat("NASA");
            } else {
              tmp.pushNoRepeat(
                key
                  .replace(/^\s+|\s+$/g, "") //strip
                  .replace("HQ", "Headquarters")
                  .replace("Hq", "Headquarters")
                  .replace("Natl Lab", "National Laboratory")
                  // .replace("University of", "Univ ")
                  .replace(/^Univ\s/g, "University of ")
                  .replace(/Univ$/g, "University")
                  .replace("LLNL", "Lawrence Livermore Lational Laboratory")
                  .replace("Sci Inst", "Science Institute")
                  .replace("SW", "Southwest")
                  .replace("Res Inst", "Research Institute")
                  .replace("The", "")
                  .replace("  ", " ")
              );
            }
          }
          inst = inst.concat(tmp);
        }
      });
      for (var j = 0; j < inst.length; j++) {
        count[inst[j]] = count[inst[j]] + 1 || 1;
      }
      var p = [];
      Object.keys(count).forEach(v => {
        if (v != "") {
          p.push({ name: v, data: count[v] });
        }
      });
      return p;
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
    initChart() {
      let arr = this.data;
      var data = this.count(arr);
      data.sort(function(a, b) {
        return a.data - b.data;
      });
      console.log(data);
      let endValue = data.length;
      let span = window.innerHeight / 35;
      let startValue = endValue - span;
      let dataMax = data[data.length - 1].data;

      this.chart.setOption({
        color: "#105bd8",
        title: {
          top: 20,
          text: "Contribution of Institutions\n",
          textStyle: {
            fontWeight: "normal",
            fontSize: this.fontSize(0.3),
            color: "#666666"
          },
          left: "2%"
        },
        grid: {
          top: this.fontSize(1),
          left: "5%",
          right: "10%",
          bottom: "5%",
          containLabel: true
        },
        tooltip: {
          formatter: "{b}: {c}"
        },
        yAxis: {
          type: "category",
          data: data.map(v => v.name),
          axisLabel: {
            interval: 0,
            fontSize: this.fontSize(0.18),
            color: "#666666",
            formatter: function(d) {
              if (d.length > 25) {
                return d.substring(0, 25) + "...";
              } else {
                return d;
              }
            }
          },
          axisLine: {
            lineStyle: {
              color: "#999999"
            }
          }
        },
        dataZoom: [
          {
            show: true,
            type: "slider",
            startValue: startValue,
            endValue: endValue,
            maxValueSpan: span,
            minValueSpan: span,
            orient: "vertical"
          },
          {
            type: "inside",
            startValue: startValue,
            endValue: endValue,
            maxValueSpan: span,
            minValueSpan: span,
            orient: "vertical"
          }
        ],
        xAxis: {
          name: "(paper)",
          min: 0,
          max: dataMax,
          splitNumber: 5,
          nameTextStyle: {
            fontSize: this.fontSize(0.2),
            fontWeight: "bolder"
          },
          type: "value",
          minInterval: 1,
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
        },
        series: [
          {
            data: data.map(v => v.data),
            type: "bar",
            label: {
              normal: {
                show: false,
                position: "right"
              }
            }
          }
        ]
      });
      this.chart.hideLoading();
      let that = this;
      this.chart.on("click", function(params) {
        var list = [];
        arr.forEach(v => {
          if (v.institute) {
            for (let i = 0; i < v.institute.length; i++) {
              if (v.institute[i].replace(/^\s+|\s+$/g, "") == params.name) {
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
