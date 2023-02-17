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
  .domain([new Date(0, 0, 0, 0, 36, 0, 0), new Date(0, 0, 0, 0, 40, 0, 0)]);

const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

svg
  .append("g")
  .attr(
    "transform",
    `translate(${prodValueX}, ${prodValueY - prodValueHeight})`
  )
  .attr("id", "y-axis")
  .call(yAxis);

// Adding tooltip:
let tooltip = d3
  .select("body")
  .append("section")
  .attr("id", "tooltip")
  .style("visibility", "hidden")
  .text("tooltip")
  .style("fill", "white");

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
      .attr("id", (d, i) => i)
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => {
        const timeArr = d.Time.split(":");
        return new Date(0, 0, 0, 0, timeArr[0], timeArr[1]);
      })
      .attr("r", 4)
      .attr("cx", (d) => xScale(new Date(d.Year, 0, 0)) + prodValueX)
      .attr(
        "cy",
        (d) =>
          yScale(
            new Date(0, 0, 0, 0, d.Time.split(":")[0], d.Time.split(":")[1])
          ) +
          prodValueY -
          prodValueHeight
      )
      .style("fill", (d) => {
        return d.Doping ? "red" : "rgb(0, 184, 0)";
      })
      .on("mouseover", (d) => {
        // Tooltip style:
        d.target.style.fill = "white";
        tooltip
          .attr("data-year", d.target.__data__.Year)
          .style("visibility", "visible");
        // Tooltip content:
        tooltip.html(
          `Year: ${d.target.__data__.Year} <br> Name: ${
            d.target.__data__.Name
          } <br> Nationality: ${d.target.__data__.Nationality} <br> Time: ${
            d.target.__data__.Time
          } <br> ${d.target.__data__.Doping ? d.target.__data__.Doping : ""}`
        );
        // Tooltip position:
        const timeArr = d.target.__data__.Time.split(":");
        tooltip
          .style(
            "left",
            xScale(new Date(d.target.__data__.Year, 0, 0)) + 60 + "px"
          )
          .style(
            "top",
            yScale(new Date(0, 0, 0, 0, timeArr[0], timeArr[1])) + +60 + "px"
          );
      })
      .on("mouseout", (d) => {
        d.target.style.fill = d.target.__data__.Doping
          ? "red"
          : "rgb(0, 184, 0)";
        tooltip.attr("data-year", d.Year).style("visibility", "hidden");
      });

    // Adding legend:
    svg
      .append("foreignObject")
      .attr("width", 200)
      .attr("height", 100)
      .attr("id", "legend")
      .html(
        "Riders with no doping allegations <div class='color-box green'></div> <br> Riders with doping allegations <div class='color-box red'></div>"
      )
      .style("fill", "white")
      .attr("x", prodValueWidth)
      .attr("y", prodValueHeight / 2);
  });
