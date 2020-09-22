<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
import { requestData } from "@/api/result";

export default {
  mixins: [resize],
  option: {},
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
    findId(dict, name) {
      for (var ele of dict) {
        if (ele.name == name) {
          return ele.id;
        }
      }
    },
    manageData(d) {
      Array.prototype.pushNoRepeat = function() {
        for (var i = 0; i < arguments.length; i++) {
          var ele = arguments[i];
          if (this.indexOf(ele) == -1) {
            this.push(ele);
          }
        }
      };
      var nodes = [];
      var lines = [];
      var authors = [];
      var author_full = [];
      d.forEach(v => {
        if (v.author) {
          for (var i of v.author) {
            author_full.push(i);
            // authors.pushNoRepeat(i);
          }
        }
      });
      let dict = {};
      author_full.forEach(item => {
        dict[item] ? (dict[item] += 1) : (dict[item] = 1);
      });
      authors = Object.keys(dict).sort((a,b)=>{
        return dict[b] - dict[a]
      })
      authors = authors.slice(0, 100);
      var index = 0;
      authors.forEach(v => {
        nodes.push({ id: index, name: v });
        index++;
      });
      var dr = [];
      var index2 = 0;
      d.forEach(v => {
        if (v.author && v.author.length > 1) {
          for (var a = 0; a < v.author.length - 1; a++) {
            for (var b = a + 1; b < v.author.length; b++) {
              lines.push({
                id: index2,
                name: null,
                source: this.findId(nodes, v.author[a]),
                target: this.findId(nodes, v.author[b])
              });
              index2++;
            }
          }
        }
      });
      lines.forEach(v => {
        v.lineStyle = { normal: {} };
      });
      nodes.forEach(v => {
        v.itemStyle = { color: "#5E27E8" };
        v.label = { show: true };
        v.symbolSize = 10;
        v.value = v.symbolSize;
        // v.category = v.attributes.modularity_class;
        v.x = v.y = null;
        v.draggable = false;
      });
      console.log("count nodes: " + nodes.length);
      console.log("count links: " + lines.length);
      var re = {};
      re.nodes = nodes;
      re.links = lines;
      return re;
    },
    initChart() {
      var graph = this.manageData(this.data);
      this.chart.setOption({
        title: {
          top: 10,
          text: "Collaboration of Authors",
          textStyle: {
            fontWeight: "normal",
            fontSize: this.fontSize(0.35),
            color: "#666666"
          },
          left: "1%"
        },
        series: [
          {
            name: "Authors",
            type: "graph",
            layout: "force",
            circular: {
              rotateLabel: true
            },
            data: graph.nodes,
            links: graph.links,
            silent: true,
            roam: true,
            nodeScaleRatio: 0.6,
            focusNodeAdjacency: true,
            label: {
              show: false,
              normal: {
                position: "right",
                formatter: "{b}",
                color: "#666666"
              }
            },
            force: {
              initLayout: "circular",
              gravity: "0.03",
              repulsion: 200
            },
            animationDurationUpdate: function(idx) {
              return idx * 100;
            }
            // animation: false
          }
        ]
      });
      this.chart.hideLoading();
    }
  }
};
</script>
