<template>
  <!-- <div id="title">Collaboration of Nations</div> -->
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as d3 from "d3";
import resize from "./mixins/resize";
import { requestData } from "@/api/result";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "svg"
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
      // console.log("W: " + clientWidth / 1920 + ", H: " + clientHeight / 720);`
      return res * fontSize;
    },
    findIndex(s, d) {
      for (var i = 0; i < d.length; i++) {
        if (d[i] == s) {
          return i;
        }
      }
      return;
    },
    addRelation(i, j, d, m) {
      i = i.replace(/^\s+|\s+$/g, "")
      j = j.replace(/^\s+|\s+$/g, "")
      let id1 = this.findIndex(i, d);
      let id2 = this.findIndex(j, d);
      // console.log(i,id1,j,id2)
      if (id1 == id2) {
        // console.log('before same add', m[id1])
        m[id1][id2]++;
        return m;
      }
      m[id1][id2]++;
      m[id2][id1]++;
      return m;
    },
    count(arr) {
      var ctry = [];
      var dict = [];
      arr.forEach(x => {
        if (x.nation) {
          ctry = ctry.concat(x.nation);
        }
      });
      ctry.sort();
      dict.push(ctry[0]);
      for (var j = 1; j < ctry.length; j++) {
        if (ctry[j] !== ctry[j - 1]) {
          dict.push(ctry[j].replace(/^\s+|\s+$/g, ""));
        }
      }
      let matrix = [];
      for (var k = 0; k < dict.length; k++) {
        matrix[k] = new Array();
        for (var t = 0; t < dict.length; t++) {
          matrix[k][t] = 0;
        }
      }
      arr.forEach(x => {
        if (x.nation) {
          for (var m = 0; m < x.nation.length; m++) {
            if (x.institute && x.institute.length > 1) {
              if (x.nation.length == 1) {
                matrix = this.addRelation(
                  x.nation[m],
                  x.nation[m],
                  dict,
                  matrix
                );
              }
              for (var n = m + 1; n < x.nation.length; n++) {
                if (x.nation[m] != x.nation[n]) {
                  matrix = this.addRelation(
                    x.nation[m],
                    x.nation[n],
                    dict,
                    matrix
                  );
                } else {
                  continue;
                }
              }
            }
          }
        }
      });
      var data = {};
      data.matrix = matrix;
      data.country = dict;
      return data;
    },
    getData() {
      let that = this;
      requestData(this.$store.getters.params)
        .then(res => {
          that.data = res;
        })
        .then(res => {
          that.chordDiagram();
        });
    },
    handleClick() {
      var list = [];
      var p = {};

      p.list = list;
      this.$router.push({ name: "ReferenceList", params: p });
    },
    chordDiagram() {
      var data = this.count(this.data);
      let country = data.country;
      let matrix = data.matrix;
      let width = 900;
      let height = 900;

      let svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr(
          "viewBox",
          "0 0 " + Math.min(width, height) + " " + Math.min(width, height)
        )
        .attr("preserveAspectRatio", "xMidYMid meet");

      let chord = d3
        .chord()
        .padAngle(0.03)
        .sortSubgroups(d3.ascending);

      let nodes = chord(matrix)["groups"];
      let arcs = chord(matrix).map(item => {
        return item;
      });
      let color = d3
        .scaleOrdinal()
        .domain(d3.range(4))
        .range([
          "#c1cbd7",
          "#afb0b2",
          "#8696a7",
          "#939391",
          "#96a48b",
          "#e3ddbd",
          "#869f82",
          "#d3c2ba"
        ]);
      // 添加g元素确定弦图的中心
      let gChord = svg
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      // 添加一个装节点的g
      let innerRadius = (width / 2) * 0.7;
      let outerRadius = innerRadius * 1.05;
      let arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

      gChord
        .append("g")
        // .attr('class', 'innerPath')
        .selectAll("path")
        .data(nodes)
        .enter()
        .append("path")
        .attr("fill", d => color(d.index))
        // .attr("stroke", d => d3.rgb(color(d.index)).darker())
        .attr("stroke", d => d3.color(d.index))
        .attr("d", arc)
        .on("mouseover", function(a, b) {
          gChord
            .selectAll(".innerPath path")
            .filter(function(a) {
              return a.source.index != b && a.target.index != b;
            })
            .transition()
            .style("opacity", 0.1);
        })
        .on("mouseout", function(a, b) {
          gChord
            .selectAll(".innerPath path")
            .filter(function(a) {
              return a.source.index != b && a.target.index != b;
            })
            .transition()
            .style("opacity", 1);
        });
      // console.log(data)
      let gOuter = gChord
        .append("g")
        .attr("class", "groups")
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .each(function(d, i) {
          // 为绑定的数据添加变量
          d.angle = (d.startAngle + d.endAngle) / 2; // 弧的中心角度
          d.name = country[i];
        })
        .attr(
          "transform",
          d => `
          rotate(${(d.angle * 180) / Math.PI - 90})
          translate(${innerRadius + 26})
        `
        );
      // 节点文字绘制
      gOuter
        .append("text")
        .attr("font-size", this.fontSize(0.2))
        .attr("dy", ".35em")
        .attr("transform", function(d) {
          return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
        })
        .attr("text-anchor", d => (d.angle > Math.PI ? "end" : null))
        .text(function(d) {
          if (d.name.length > 15) {
            return d.name.substring(0, 15) + "...";
          } else {
            return d.name;
          }
        });
      // 添加内部的弦
      let ribbon = d3.ribbon().radius(innerRadius);
      gChord
        .append("g")
        .attr("class", "innerPath")
        .selectAll("path")
        .data(arcs)
        .enter()
        .append("path")
        .attr("d", ribbon)
        .style("fill", function(d) {
          return color(d.target.index);
        })
        // .style('stroke', function (d) { return d3.rgb(color(d.target.index)).darker() })
        .style("stroke", function(d) {
          return color(d.target.index);
        })
        .style("opacity", 1);
    }
  }
};
</script>