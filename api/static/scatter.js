var margin = { top: 50, right: 20, bottom: 50, left: 20 },
    outerWidth = 1440,
    outerHeight = 700,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "Time Asleep",
    yCat = "Intensity";

d3.csv(STATIC_URL + "cereal.csv", function(data) {
  data.forEach(function(d) {
    d["Time Asleep"] = +d["Time Asleep"];
    d.Intensity = +d.Intensity;
  });

  var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
      xMin = d3.min(data, function(d) { return d[xCat]; }),
      xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
      yMin = d3.min(data, function(d) { return d[yCat]; }),
      yMin = yMin > 0 ? 0 : yMin;

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  var color = d3.scale.category10();

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "<img src= '" + STATIC_URL + "pos1.png' id ='tip-pic' width='70px' height='150px' />";
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .attr("fill", "white")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .attr("fill", "white")
      .text(xCat);

  // svg.append("g")
  //     .classed("y axis", true)
  //     .call(yAxis)
  //   .append("text")
  //     .classed("label", true)
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", -margin.left)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text(yCat);

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);


  var dots = objects.selectAll(".dot").data(data);
    dots.enter().append("svg:image")
      .classed("dot", true)
      .attr("xlink:href", STATIC_URL + "star.png")
      .attr("width", "15")
      .attr("height", "15")
      .attr("transform", transform)
      .style("opacity", myRandom)         
      .on("mouseover", function(d) {
        d3.select(this)
        .attr("width", "20")                /// determine size based off of data from pedram (duration of breath 10-20px)
         .attr("height", "20")               /// determine size based off of data from pedram (duration of breath 10-20px)
      })
      .on("mouseover", tip.show)
      .on("mouseout", function(d) {
        d3.select(this).attr("width", "15")
          .attr("height", "15")
      })
      .on("mouseout", tip.hide);

  d3.select("input").on("click", change);

  function change() {
    xMax = d3.max(data, function(d) { return d[xCat]; });
    xMin = d3.min(data, function(d) { return d[xCat]; });

    zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

    var svg = d3.select("#scatter").transition();

    svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

    objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
  }

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
});

/***************************************************************************
                            GRADIENT GRAPH
***************************************************************************/  

d3.csv(STATIC_URL + "cereal.csv", function(error, data) {
  var gapsDiv = document.getElementsByClassName('gaps')[0];
  var num = 0;
  var widthArray = [];

  for (var i=0; i<data.length; i++) {
    var width = mapX(data[i]) - num;
    widthArray[i] = width;
    num = mapX(data[i]);
  }

  var totalWidth = 0;
  for (var width in widthArray) {
    totalWidth += widthArray[width];
  }

  totalWidth = parseInt(totalWidth);
  console.log(totalWidth);

  for (var i=0; i<widthArray.length; i++) {
    var gSection = document.createElement('div');
    gSection.className = 'gradient-block';
    gSection.style.width = ((widthArray[i]/totalWidth)*100)+"%";

    if (i == 0) {
      if (widthArray[i] <= 30) {
        gSection.style.backgroundColor = "white";
      } else if (widthArray[i] > 30 && widthArray[i] <= 60 ) {
        gSection.style.backgroundColor = "#00ccff";
      } else {
        gSection.style.backgroundColor = "#0113ff";
      }
      continue;
    }

    // white checks
    if (widthArray[i] <= 30) {
      if (widthArray[i-1] <= 30) {
        gSection.style.backgroundColor = "white";
      }
      else if (widthArray[i-1] > 30 && widthArray[i-1] <= 60) {
        gSection.style.background = "linear-gradient(to left, white, #00ccff)";
      }
      else {
        gSection.style.background = "linear-gradient(to left, white, #0113ff)";
      }
    }
    // yellow checks
    else if (widthArray[i] > 30 && widthArray[i] <= 60) {
      if (widthArray[i-1] <= 30) {
        gSection.style.background = "linear-gradient(to left, #00ccff, white)";
      }
      else if (widthArray[i-1] > 30 && widthArray[i-1] <= 60) {
        gSection.style.backgroundColor = "#00ccff";
      }
      else {
        gSection.style.background = "linear-gradient(to left, #00ccff, #0113ff)";
      }
    }
    // red checks
    else {
      if (widthArray[i-1] <= 30) {
        gSection.style.background = "linear-gradient(to left, #0113ff, white)";
      }
      else if (widthArray[i-1] > 30 && widthArray[i-1] <= 60) {
        gSection.style.background = "linear-gradient(to left, #0113ff, #00ccff)";
      }
      else {
        gSection.style.backgroundColor = "#0113ff";
      }
    }
    gapsDiv.appendChild(gSection);
  }

});


/***************************************************************************
                            UTILS
***************************************************************************/  
function myRandom() {
  var num = Math.random();
  return num + 0.4;
}

var xValue = function(d) { return d[xCat];};

function mapX(d) { 
  return x(xValue(d));
}
