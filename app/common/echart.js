import * as echarts from "../assets/echarts.min.3x";
function initEcharts(dom, options) {
  var echarts_ = echarts.init(dom);
  echarts_.setOption(options, true);
}

function linearGradient(v1,v2,v3,v4,v5) {
  return new echarts.graphic.LinearGradient(v1, v2, v3, v4, v5, false);
}


exports.initEcharts = initEcharts;
exports.linearGradient = linearGradient;