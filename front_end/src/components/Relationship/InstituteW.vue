<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
import "echarts-wordcloud";
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
          document.body.clientWidth;
      if (!clientWidth) return;
      let fontSize = 100 * (clientWidth / 1920);
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
      let tmp = [];
      arr.forEach(x => {
        if (x.institute != null) {
          tmp = [];
          for (var i = 0; i < x.institute.length; i++) {
            let key = x.institute[i];
            if (key.search("Jet Propulsion") != -1 || key == "JPL") {
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
      var p = [];
      // var low = inst.map(v=> v.toLowerCase());
      // console.log(low)
      inst.sort();
      for (var i = 0; i < inst.length; ) {
        var count = 0;
        for (var j = i; j < inst.length; j++) {
          if (inst[i] == inst[j]) {
            count++;
          }
        }
        p.push({ name: inst[i], value: count });
        i += count;
      }
      var re = p.filter(ele => ele.value > 0);
      // console.table(re)
      return re;
    },
    initChart() {
      let arr = this.data;
      let data = this.count(arr);
      this.chart.setOption({
        // title: {
        //   top: 20,
        //   // text: 'worldcould of Institute',
        //   textStyle: {
        //     fontWeight: "normal",
        //     fontSize: 22,
        //     color: "#666666"
        //   },
        //   left: "1%"
        // },
        backgroundColor: "#FFFFFF",
        tooltip: {
          show: true
        },
        series: [
          {
            name: "keywords analysis",
            type: "wordCloud",
            shape: "circle",
            width: "90%",
            height: "90%",
            sizeRange: [this.fontSize(0.15), this.fontSize(0.5)],
            rotationRange: [-90, 90],
            textPadding: 0,
            autoSize: {
              enable: true,
              minSize: 6
            },
            textStyle: {
              normal: {
                fontFamily: "sans-serif",
                fontWeight: "bold",
                color: function() {
                  return (
                    "rgb(" +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160)
                    ].join(",") +
                    ")"
                  );
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: "#333"
              }
            },
            data: data
          }
        ]
      });
      this.chart.hideLoading();

      let that = this;
      this.chart.on("click", function(params) {
        // console.log(params)
        var list = [];
        arr.forEach(v => {
          if (v.institute) {
            for (let i = 0; i < v.institute.length; i++) {
              if (v.institute[i] == params.name) {
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
