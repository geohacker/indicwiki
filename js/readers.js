var margin = {top: 40, right: 10, bottom: 20, left: 70},
width = $('.row-fluid').width() - margin.left - margin.right,
height = 540 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y/%m/%d").parse;

var x = d3.time.scale()
.range([0, width]);

var y = d3.scale.linear()
.range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");

var languages = [{name: 'Assamese', code:'as'},
{name:'Bengali', code:'bn'},
{name: 'Bishnupriya Manipuri', code:'bpy'},
{name: 'Bhojpuri', code:'bh'},
{name: 'Gujarati', code:'gu'},
{name:'Hindi', code:'hi'},
{name: 'Kannada', code:'kn'},
{name: 'Kashmiri', code:'ks'},
{name: 'Malayalam', code:'ml'},
{name:'Marathi', code:'mr'},
{name: 'Nepali', code:'ne'},
{name: 'Newari', code:'new'},
{name: 'Oriya', code:'or'},
{name: 'Pali', code:'pi'},
{name: 'Punjabi', code:'pa'},
{name: 'Sanskrit', code:'sa'},
{name: 'Sindhi', code:'sd'},
{name: 'Tamil', code:'ta'},
{name: 'Telugu', code:'te'},
{name: 'Urdu', code:'ur'}];

var months = [{name: 'January', code: 'jan'},
{name: 'February', code: 'feb'},
{name: 'March', code: 'mar'},
{name: 'April', code: 'apr'},
{name: 'May', code: 'may'},
{name: 'June', code: 'jun'},
{name: 'July', code: 'jul'},
{name: 'August', code: 'aug'},
{name: 'September', code: 'sep'},
{name: 'October', code: 'oct'},
{name: 'November', code: 'nov'},
{name: 'December', code: 'dec'}];

d3.csv("/indicwiki/data/page_views_2.csv", function(error, csv) {
  data = csv;
  data.forEach(function(d){
    d['date'] = parseDate(d['date']);
    d['views'] = Number(d['views']);
    });
});

d3.csv("/indicwiki/data/num_articles_2.csv", function(error, csv) {
  articles = csv;
  articles.forEach(function(d){d['date'] = parseDate(d['date']);});
  initialize();
});

var svg = d3.select('#chart').append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var line = d3.svg.line()
.x(function(d) { return x(d['date']);})
.y(function(d) { return y(d['views']); });

function drawLine(data) {

  var dataCirclesGroup = null;

  x.domain(d3.extent(data, function(d) { return d['date']; }));
  y.domain(d3.extent(data, function(d) { return d['views']; }));

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 14)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text('Page Views');

  svg.append("path")
  .datum(data)
  .attr("class", "line")
  .attr("d", line);

  if (!dataCirclesGroup) {
    dataCirclesGroup = svg.append('svg:g');
  }

  filtered = data.filter(function(d) { if (d['views']!=0){return d};});

  var circles = dataCirclesGroup.selectAll('.data-point')
  .data(filtered);

  circles
  .enter()
  .append('svg:circle')
  .attr('class', 'data-point')
  .style('opacity', 1e-6)
  .attr('cx', function(d) { return x(d['date']) })
  .attr('cy', function() { return y(0) })
  .attr('r', function() { return (2)})
  .transition()
  .duration(1000)
  .style('opacity', 1)
  .attr('cx', function(d) { return x(d['date']) })
  .attr('cy', function(d) { return y(d['views']) });

  circles
  .transition()
  .duration(1000)
  .attr('cx', function(d) { return x(d['date']) })
  .attr('cy', function(d) { return y(d['views']) })
  .attr('r', function() { return (3)})
  .style('opacity', 1);

  $('svg circle').tipsy({ 
    gravity: 'w', 
    html: true, 
    title: function() {
      var d = this.__data__;
      var pDate = d['date'];
      return pDate.getDate() + " " + months[pDate.getMonth()].name + " " + pDate.getFullYear() + '<br>' + 'Views: ' + d['views']; 
    }
  });

}

function redrawLine(newData) {

  // var line = d3.svg.line()
  x.domain(d3.extent(newData, function(d) { return d['date']; }));
  y.domain(d3.extent(newData, function(d) { return d['views']; }));

  console.log(y.domain());

  d3.selectAll("path.line")
  .datum(newData)
  .attr("class", "line")
  .attr("d", line);

  d3.select('.y').remove();

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 14)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text('Page Views');
}

function drawBar(barData) {
  var xBar = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var yBar = d3.scale.linear()
    .range([height, 0]);

xBar.domain(barData.map(function(d) { return d['date']; }));
yBar.domain([0, d3.max(barData, function(d) { return d['articles']; })]);

  svg.selectAll(".bar")
    .data(barData)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return xBar(d['date']); })
    .attr("width", xBar.rangeBand())
    .attr("y", function(d) {return yBar(d['articles']); })
    .attr("height", function(d) { return height - yBar(d['articles']); });

// svg.selectAll("text")
//    .data(barData)
//    .enter()
//    .append("text")
//    .text(function(d, i) {return i;})
//    .attr("text-anchor", "middle")
//    .attr("x", function(d, i) {return xBar(d['date'])+8;})
//    .attr("y", function(d) {return yBar(d['articles']);});
}

function filterLanguage(code) {
  return (function(d) {return (d.language == code);});
}

function changeLanguage(code) {
    filteredData = data.filter(filterLanguage(code));
    articleData = articles.filter(filterLanguage(code));
    // console.log(filteredData)
    // redrawBar(articleData);
    redrawLine(filteredData);
  }

function initialize() {
  
  languages.forEach(function(d) {
  d3.select("#search").append("option")
  .attr("value", function() {return d.code})
  .text(function() {return d.name});
  });

  $("#search").on("change", function(e){changeLanguage(e.val)});

  drawLine(data.filter(filterLanguage('ml')));
  $('#search').select2("val", 'ml');

}

$('#search').select2({placeholder: 'Select a Language', width: '160px'});
