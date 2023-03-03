// Variable setup:
let width = d3.select("body").node().getBoundingClientRect().width * 0.9;
let height = d3.select("body").node().getBoundingClientRect().height * 0.7;
let valueX = width * 0.2;
let valueY = height * 0.85;
let offset = width * 0.1;
let valueWidth = width * 0.6;
let valueHeight = valueY - offset;

// Adding title:
d3.select("body")
  .append("h1")
  .text(
    "34 Quickest Alpe d'Huez Climbs - Athletes With and Without Doping Allegations"
  )
  .attr("id", "title");

// Adding Canvas:
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Adding x-axis:
const xScale = d3
  .scaleTime()
  .range([0, valueWidth])
  .domain([new Date(1993, 0, 1), new Date(2016, 0, 1)]);
const xAxis = d3.axisBottom(xScale).ticks(5);

svg
  .append("g")
  .attr("transform", `translate(${valueX}, ${valueY})`)
  .attr("id", "x-axis")
  .call(xAxis);

const yScale = d3
  .scaleTime()
  .range([0, valueHeight])
  .domain([new Date(0, 0, 0, 0, 36, 0, 0), new Date(0, 0, 0, 0, 40, 0, 0)]);

const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

svg
  .append("g")
  .attr("transform", `translate(${valueX}, ${valueY - valueHeight})`)
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
    d = d.filter((e) => e.Name !== "Jose Azevedo"); // No allegations found
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
      .attr("r", 6)
      .attr("cx", (d) => {
        // for 2 datapoint with same x and y:
        if (d.Name === "Santos Gonzalez") {
          return xScale(new Date(d.Year, 0, 0)) + valueX + 6;
        }
        // for 3 datapoint with same x and y:
        if (d.Name === "Michael Rasmussen") {
          return xScale(new Date(d.Year, 0, 0)) + valueX + 6;
        } else if (d.Name === "Pietro Caucchioli") {
          return xScale(new Date(d.Year, 0, 0)) + valueX + 12;
        }
        return xScale(new Date(d.Year, 0, 0)) + valueX;
      })
      .attr(
        "cy",
        (d) =>
          yScale(
            new Date(0, 0, 0, 0, d.Time.split(":")[0], d.Time.split(":")[1])
          ) +
          valueY -
          valueHeight
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
      .attr("id", "legend")
      .attr("x", width - width * 0.4)
      .attr("y", valueHeight * 0.33)
      .attr("width", width * 0.3)
      .attr("height", height * 0.4)
      .html(
        "Without doping allegations <div class='color-box green'></div> <br>With doping allegations <div class='color-box red'></div>"
      )
      .style("fill", "white");
  });

function update() {
  width = d3.select("body").node().getBoundingClientRect().width * 0.9;
  height = d3.select("body").node().getBoundingClientRect().height * 0.7;
  valueX = width * 0.2;
  valueY = height * 0.85;
  offset = width * 0.1;
  valueWidth = width * 0.6;
  valueHeight = valueY - offset;

  xScale.range([0, valueWidth]);
  yScale.range([0, valueHeight]);

  d3.select("#x-axis")
    .attr("transform", `translate(${valueX}, ${valueY})`)
    .call(xAxis);

  d3.select("#y-axis")
    .attr("transform", `translate(${valueX}, ${valueY - valueHeight})`)
    .call(yAxis);

  svg.attr("width", width).attr("height", height);

  svg
    .selectAll("circle")
    .attr("cx", (d) => xScale(new Date(d.Year, 0, 0)) + valueX)
    .attr(
      "cy",
      (d) =>
        yScale(
          new Date(0, 0, 0, 0, d.Time.split(":")[0], d.Time.split(":")[1])
        ) + offset
    );

  // Legend:
  svg
    .select("#legend")
    .attr("x", width - width * 0.4)
    .attr("y", valueHeight * 0.33)
    .attr("width", width * 0.3)
    .attr("height", height * 0.4);
}

window.addEventListener("resize", update);
