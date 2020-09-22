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
      var p = [];
      var low = arr.map(v => v.toLowerCase());
      low.sort();
      for (var i = 0; i < low.length; ) {
        var count = 0;
        for (var j = i; j < low.length; j++) {
          if (low[i] == low[j]) {
            count++;
          }else{
            break
          }
        }
        p.push({ name: low[i], value: count });
        i += count;
      }
      var re = p.filter(ele => ele.value > 0);
      // console.table(re)
      return re;
    },
    initChart() {
      let arr = this.data;
      let keywords = [];
      arr.forEach(x => {
        if (x.keyword) {
          for (var i = 0; i < x.keyword.length; i++) {
            keywords.push(x.keyword[i]);
          }
        }
      });
      var data = this.count(keywords);
      this.chart.setOption({
        // title: {
        //   top: 20,
        //   textStyle: {
        //     fontWeight: "normal",
        //     fontSize: this.fontSize(0.3),
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
            name: "keywords frequency",
            type: "wordCloud",
            shape: "circle",
            width: "90%",
            height: "90%",
            sizeRange: [this.fontSize(0.15), this.fontSize(0.5)],
            rotationRange: [-45, 45],
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
        var list = [];
        arr.forEach(v => {
          if (v.keyword) {
            for (let i = 0; i < v.keyword.length; i++) {
              if (v.keyword[i].toLowerCase() == params.name) {
                list.push(v);
                break;
              }
            }
          }
        });
        let p = {}
        p.list = list;
        that.$router.push({ name: "ReferenceList", params: p });
      });
    }
  }
};
</script>
