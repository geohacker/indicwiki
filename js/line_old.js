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

  var line = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.new_articles); });

  var svg = d3.select("#line").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  function filterLanguage(code) {
    return (function(d) {return (d.language == code);});
  }
  var pointRadius = 4;
  var years = ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'];
  d3.csv("/indicwiki/data/data.csv", function(error, data) {
    var hindi = data.filter(filterLanguage('ml'));
  // console.log(hindi);
  hindi.forEach(function(d) {
    d.date = parseDate(d.date);
    d.new_articles = +d.new_articles;
    // console.log(d.date);
  });

  
  x.domain(d3.extent(hindi, function(d) { return d.date; }));
  // x.domain(d3.extent(years, function(d) { return d; }));
  y.domain(d3.extent(hindi, function(d) { return d.new_articles; }));

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
  .text("New Articles");

  svg.append("path")
  .datum(hindi)
  .attr("class", "line")
  .attr("d", line);


  if (!dataCirclesGroup) {
    dataCirclesGroup = svg.append('svg:g');
  }

  filtered = hindi.filter(function(d) { if (d.new_articles!=0){return d};});

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
        .attr('cy', function(d) { return y(d.new_articles) });

        circles
        .transition()
        .duration(2000)
        .attr('cx', function(d) { return x(d.date) })
        .attr('cy', function(d) { return y(d.new_articles) })
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
    });
