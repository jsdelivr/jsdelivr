var socket = io.connect();

let queue = [];
let data = [];
let count = 0;

var margin = { top: 20, right: 20, bottom: 20, left: 20 };
var width = 700 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select('.chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//-----------------------------------------------------------
socket.on('sendStreamData', (allData) => {

    queue = queue.concat(allData);

    if (allData.length >= 50) {
      allData = allData.slice(-49);
    }
if(allData) {

  var xScale = d3.scaleLinear()
    // .domain([0, 200])
    .domain([
      d3.min(allData, d => d.xScale),
      Math.max(50, d3.max(allData, d => d.xScale))
    ])
    .range([0, width]);
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)

  svg
    .select('g')
    .call(d3.axisBottom(xScale).ticks(10));

  // Add the text label for the x axis
  svg.append("text")
    .attr('transform', 'translate(' + (width) + ' ,' + (height + margin.bottom) + ')')
    .style('text-anchor', 'end')
    .style('font-family', 'sans-serif')
    .style('font-size', '13px')
    .text('');

  var yScale = d3.scaleLinear()
    .domain([0, 35])
    .range([height, 0]);

  svg
    .append('g')
    .attr('class', 'yAxis');
  
  svg.select('.yAxis')
    .call(d3.axisLeft(yScale).ticks(10));

  svg.append("text")
        .attr("transform", "rotate(0)")
        .attr("y",-10)
        .attr("x", -40)
        .attr("dy", "1em")
        .attr('class', 'yLabel')
        .style("text-anchor", "end")
        .style('font-family', 'sans-serif')
        .style('font-size', '13px')
        .text("");

  var line = d3.line()
    .x(d => xScale(d.xScale))
    .y(d => yScale(d.yScale))
    //.curve(d3.curveCatmullRom.alpha(.5));

  d3.selectAll('path.line').remove();
  d3.selectAll('.dot').remove();

  svg
    .selectAll('.line')
    .data(allData)
    .enter()
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(allData))
    .style('stroke', '#5176B6')
    .style('stroke-width', 1)
    .style('fill', 'none')
    .style('stroke-linejoin','round');


svg.selectAll('.dot')
  .data(allData)
  .enter()
  .append('circle')
    .attr('class', 'dot')
    .attr('cx', line.x())
    .attr('cy', line.y())
    .attr('r', 3)
    .style('fill', 'white')
    .style('stroke-width', 1.5)
    .style('stroke', 'DodgerBlue');
}

})

setInterval(() => {
  if(queue.length > 1) {
    data.push(queue[count]);
    count++;
  }
}, 1000);



 

