import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// For production:
const prodValueX = 20;
const prodValueY = 400;
const prodValueWidth = 300;
const prodValueHeight = 300;

// Adding title:
d3.select("body")
  .append("h1")
  .text(
    "35 Quickest Alpe d'Huez Climbs - Athletes with and without Doping Allegations"
  )
  .attr("id", "title");

// Adding Canvas:
let width = d3.select("body").node().getBoundingClientRect().width;
let height = d3.select("body").node().getBoundingClientRect().height;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Adding x-axis:
const xScale = d3.scaleLinear().range([0, prodValueWidth]).domain([1993, 2016]);
const xAxis = d3.axisBottom(xScale).ticks(5);
svg
  .append("g")
  .attr("transform", `translate(${prodValueX}, ${prodValueY})`)
  .attr("id", "x-axis")
  .call(xAxis);
