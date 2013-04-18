  var margin = {top: 40, right: 10, bottom: 20, left: 70},
  width = $('.row-fluid').width() - margin.left - margin.right,
  height = 540 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y/%m/%d").parse;
var parseNumber = d3.format(',');

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

  var data;
  var flag = 0;

  d3.csv("/indicwiki/data/data.csv", function(error, csv) {
    data = csv;
    initialize();
  });

  function filterLanguage(code) {
    return (function(d) {return (d.language == code);});
  }

  var pointRadius = 4;
  
  var attributes = ['page_views', 'active_editors', 'new_editors', 'total_editors',
  'new_articles', 'total_articles'];

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

  function capitalise(string)
  {   
    split = string.split('_');
    return split[0].charAt(0).toUpperCase() + split[0].slice(1) + ' ' + split[1].charAt(0).toUpperCase() + split[1].slice(1);
  }



function clear () {
  d3.selectAll('svg').remove();
}


function draw(data, attribute) {

  var dataCirclesGroup = null;

  x.domain(d3.extent(data, function(d) { return d['date']; }));
  y.domain(d3.extent(data, function(d) { return d[attribute]; }));

  var svg = d3.select('#'+attribute).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var line = d3.svg.line()
  .x(function(d) { return x(d['date']); })
  .y(function(d) { return y(d[attribute]); });

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
  .attr("class", "ylabel")
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text(capitalise(attribute));

  svg.append("path")
  .datum(data)
  .attr("class", "line")
  .attr("d", line);

  if (!dataCirclesGroup) {
    dataCirclesGroup = svg.append('svg:g');
  }

  filtered = data.filter(function(d) { if (d[attribute]!=0){return d};});

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
  .attr('cy', function(d) { return y(d[attribute]) });

  circles
  .transition()
  .duration(1000)
  .attr('cx', function(d) { return x(d['date']) })
  .attr('cy', function(d) { return y(d[attribute]) })
  .attr('r', function() { return (3)})
  .style('opacity', 1);

  $('svg circle').tipsy({ 
    gravity: 'w', 
    html: true, 
    title: function() {
      var d = this.__data__;
      var pDate = d['date'];
      return pDate.getDate() + " " + months[pDate.getMonth()].name + " " + pDate.getFullYear() + '<br>' +capitalise(attribute)+ ': ' + parseNumber(d[attribute]); 
    }
  });

}

var date;
function changeLanguage(code) {


    filteredData = data.filter(filterLanguage(code));
      if (flag==1) {
    clear();
    }

    else {

    flag = 1;
    };
    
    for (var a = 0; a<attributes.length; a++) {
      attribute = attributes[a];

    filteredData.forEach(function(d) {

      if (typeof(d['date']) != "object") {
     
        d['date'] = parseDate(d['date']);

      }

      d[attribute] = +d[attribute];

    });

    draw(filteredData, attribute);
  }


}


function initialize() {
  
languages.forEach(function(d) {
  d3.select("#search").append("option")
  .attr("value", function() {return d.code})
  .text(function() {return d.name});

});

  $('#search').select2({placeholder: 'Select a language', width: '140px'});
  $("#search").on("change", function(e){window.location.search = '?project='+e.val;});

  url  = window.location.search;
  slug = url.split('=')[0];
  project = url.split('=')[1];
  if (slug == '?project' && project) {
    changeLanguage(project);
    $('#search').select2("val", project);
  }

  else {
    changeLanguage('hi');
    $('#search').select2("val", "hi");
  }
}