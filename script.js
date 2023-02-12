import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Adding title:
d3.select("body")
  .append("h1")
  .text(
    "35 Quickest Alpe d'Huez Climbs - Athletes with and without Doping Allegations"
  )
  .attr("id", "title");
