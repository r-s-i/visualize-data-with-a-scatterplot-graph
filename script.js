import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// For production:
const prodValueX = 50;
const prodValueY = 410;
const prodOffset = 20;
const prodValueWidth = 300;
const prodValueHeight = 390;

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
const xScale = d3
  .scaleTime()
  .range([0, prodValueWidth])
  .domain([new Date(1993, 0, 1), new Date(2016, 0, 1)]);
const xAxis = d3.axisBottom(xScale).ticks(5);

svg
  .append("g")
  .attr("transform", `translate(${prodValueX}, ${prodValueY})`)
  .attr("id", "x-axis")
  .call(xAxis);

const yScale = d3
  .scaleTime()
  .range([0, prodValueHeight])
  .domain([new Date(0, 0, 0, 0, 35, 0, 0), new Date(0, 0, 0, 0, 40, 0, 0)]);

const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

svg
  .append("g")
  .attr(
    "transform",
    `translate(${prodValueX}, ${prodValueY - prodValueHeight})`
  )
  .attr("id", "y-axis")
  .call(yAxis);

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((r) => r.json())
  .then((d) => {
    // Adding the dots:
    svg
      .selectAll("circle")
      .data(d)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => {
        const timeArr = d.Time.split(":");
        return new Date(0, 0, 0, 0, timeArr[0], timeArr[1]);
      });

    d.forEach((e) => {
      console.log(e);
    });
  });
