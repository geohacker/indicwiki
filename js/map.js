width = 960;
height = 1000;

var proj = d3.geo.mercator()
            .center([78, 21])
            .scale(1400).translate([width/2, height/2]);

var path = d3.geo.path().projection(proj);
// var t = proj.translate(); // the projection's default translation
// var s = proj.scale() // the projection's default scale


var map = d3.select("#map").append("svg:svg")
    .attr("width", width)
    .attr("height", height)

var india = map.append("svg:g").attr("id", "india");

d3.json("/indicwiki/data/india_topo.json", function (json) {
    console.log(json);
  india.selectAll("path")
      .data(topojson.feature(json, json.objects.india).features)
    .enter().append("svg:path")
      .attr("d", path);
});