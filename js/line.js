  var margin = {top: 20, right: 10, bottom: 20, left: 40},
  width = 1000 - margin.left - margin.right,
  height = 540 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%d-%m-%Y").parse;
  dataCirclesGroup = null;

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

  var pointRadius = 4;
  var attributes = ['active_editors', 'new_editors', 'total_editors',
    'new_articles', 'total_articles'];

    var languages = [{name:'Hindi', code:'hi'},
    {name:'Bengali', code:'bn'},
    {name:'Marathi', code:'mr'},
    {name: 'Telugu', code:'te'},
    {name: 'Tamil', code:'ta'},
    {name: 'Urdu', code:'ur'},
    {name: 'Kannada', code:'kn'},
    {name: 'Gujarati', code:'gu'},
    {name: 'Sindhi', code:'sd'},
    {name: 'Bhojpuri', code:'bh'},
    {name: 'Malayalam', code:'ml'},
    {name: 'Oriya', code:'or'},
    {name: 'Punjabi', code:'pa'},
    {name: 'Assamese', code:'as'},
    {name: 'Newari', code:'new'},
    {name: 'Kashmiri', code:'ks'},
    {name: 'Nepali', code:'ne'},
    {name: 'Bishnupriya', code:'bpy'},
    {name: 'Sanskrit', code:'sa'},
    {name: 'Pali', code:'pi'}];

var data, svg;

function capitalise(string)
{   
    split = string.split('_');
    return split[0].charAt(0).toUpperCase() + split[0].slice(1) + ' ' + split[1].charAt(0).toUpperCase() + split[1].slice(1);
}

d3.csv("/indicwiki/data/data.csv", function(error, csv) {data = csv;});

function initialize() {
  var hindi = data.filter(filterLanguage('hi'));
    hindi.forEach(function(d) {
    d.date = parseDate(d.date);
    d.active_editors = +d.active_editors;
    // console.log(d.date);
  });

  svg = d3.select('#active_editors').append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var line = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.active_editors); });

  x.domain(d3.extent(hindi, function(d) { return d.date; }));
  y.domain(d3.extent(hindi, function(d) { return d.active_editors; }));

    svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text(capitalise('active_editors'));

  svg.append("path")
  .datum(hindi)
  .attr("class", "line")
  .attr("d", line);
  
  if (!dataCirclesGroup) {
    dataCirclesGroup = svg.append('svg:g');
  }

  filtered = hindi.filter(function(d) { if (d.active_editors!=0){return d};});

  var circles = dataCirclesGroup.selectAll('.data-point')
  .data(filtered);

  circles
  .enter()
  .append('svg:circle')
  .attr('class', 'data-point')
  .style('opacity', 1e-6)
  .attr('cx', function(d) { return x(d.date) })
  .attr('cy', function() { return y(0) })
  .attr('r', function() { return (2)})
        // .attr('r', function() { return (hindi.length <= 50) ? pointRadius : 0 })
        .transition()
        .duration(2000)
        .style('opacity', 1)
        .attr('cx', function(d) { return x(d.date) })
        .attr('cy', function(d) { return y(d.active_editors) });

        circles
        .transition()
        .duration(2000)
        .attr('cx', function(d) { return x(d.date) })
        .attr('cy', function(d) { return y(d.active_editors) })
        .attr('r', function() { return (3)})
      // .attr('r', function() { return (hindin.new_articles.length <= 50) ? pointRadius : 0 })
      .style('opacity', 1);

      $('svg circle').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
          var d = this.__data__;
          var pDate = d.date;
          return 'Date: ' + pDate.getDate() + "-" + pDate.getMonth() + "-" + pDate.getFullYear() + '<br>Value: ' + d.new_articles; 
        }
    });
    }
  // parseData('hi');



function filterLanguage(code) {
  return (function(d) {return (d.language == code);});
}

// function parseData(code) {
//     filteredData = data.filter(filterLanguage(code));
//     for(var a=0; a<attributes.length; a++) {
//       draw(filteredData, attributes[a]);
//     }
// }

// function draw(data, div) {
  
//   data.forEach(function(d) {
//     d.date = parseDate(d.date);
//     d[div] = +d[div];
//   });

//   var line = d3.svg.line()
//   .x(function(data) { return x(data.date); })
//   .y(function(data) { return y(data[div]); });
  

// }
 

  // var svg = d3.select("#line").append("svg")
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  // .append("g")
  // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // d3.csv("/indicwiki/data/data.csv", function(error, data) {
  //   var hindi = data.filter(filterLanguage('ml'));
  // // console.log(hindi);
  // hindi.forEach(function(d) {
  //   d.date = parseDate(d.date);
  //   d.new_articles = +d.new_articles;
  //   // console.log(d.date);
  // });

  
  // x.domain(d3.extent(hindi, function(d) { return d.date; }));
  // // x.domain(d3.extent(years, function(d) { return d; }));
  // y.domain(d3.extent(hindi, function(d) { return d.new_articles; }));

  // svg.append("g")
  // .attr("class", "x axis")
  // .attr("transform", "translate(0," + height + ")")
  // .call(xAxis);

  // svg.append("g")
  // .attr("class", "y axis")
  // .call(yAxis)
  // .append("text")
  // .attr("transform", "rotate(-90)")
  // .attr("y", 6)
  // .attr("dy", ".71em")
  // .style("text-anchor", "end")
  // .text("New Articles");

  // svg.append("path")
  // .datum(hindi)
  // .attr("class", "line")
  // .attr("d", line);


  // if (!dataCirclesGroup) {
  //   dataCirclesGroup = svg.append('svg:g');
  // }

  // filtered = hindi.filter(function(d) { if (d.new_articles!=0){return d};});

  // var circles = dataCirclesGroup.selectAll('.data-point')
  // .data(filtered);

  // circles
  // .enter()
  // .append('svg:circle')
  // .attr('class', 'data-point')
  // .style('opacity', 1e-6)
  // .attr('cx', function(d) { return x(d.date) })
  // .attr('cy', function() { return y(0) })
  // .attr('r', function() { return (2)})
  //       // .attr('r', function() { return (hindi.length <= 50) ? pointRadius : 0 })
  //       .transition()
  //       .duration(2000)
  //       .style('opacity', 1)
  //       .attr('cx', function(d) { return x(d.date) })
  //       .attr('cy', function(d) { return y(d.new_articles) });

  //       circles
  //       .transition()
  //       .duration(2000)
  //       .attr('cx', function(d) { return x(d.date) })
  //       .attr('cy', function(d) { return y(d.new_articles) })
  //       .attr('r', function() { return (3)})
  //     // .attr('r', function() { return (hindin.new_articles.length <= 50) ? pointRadius : 0 })
  //     .style('opacity', 1);

  //     $('svg circle').tipsy({ 
  //       gravity: 'w', 
  //       html: true, 
  //       title: function() {
  //         var d = this.__data__;
  //         var pDate = d.date;
  //         return 'Date: ' + pDate.getDate() + "-" + pDate.getMonth() + "-" + pDate.getFullYear() + '<br>Value: ' + d.new_articles; 
  //       }
    //   });
    // });
