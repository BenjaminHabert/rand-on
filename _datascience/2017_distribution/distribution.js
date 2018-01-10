var width=700,
    height=300;

var bar_width = 10,
    nbars = Math.ceil(width / bar_width),
    data = d3.range(nbars).map(function(i){
    return 1 - 4 * Math.pow(((i+0.5) / nbars - 0.5), 2)
})

var is_mouse_down = false;
document.body.onmousedown = function(){is_mouse_down = true}
document.body.onmouseup = function(){is_mouse_down = false}

var main_div = d3.select("#divford3")


var svg = main_div
    .append("svg")
    .attr('width', width)
    .attr('height', height)


var svg_for_histo = main_div
    .append("svg")
    .attr('width', width)
    .attr('height', height)

main_div
    .append('label').html('minimum: ')
    .append('input').attr("id", 'min_distribution')
    .attr('type', 'text').attr('value', "0")
    .on('input', function(){update_distribution()});

main_div
    .append('label').html('   maximum: ')
    .append('input').attr('id', 'max_distribution')
    .attr('type', 'text').attr('value', "10")
    .on('input', function(){update_distribution()})

main_div.append('p').html('1000 random numbers with this distribution (histogram above):')

var text = main_div.append('textarea')
    .attr('cols', 30)
    .attr("rows", 20)


function draw_interactive_bars(){
    svg.selectAll("rect")
        .data(Array.from(data))  // only a copy as this is drawn only once
        .enter()
        .append('rect')
        .attr('height', height)
        .attr('width', bar_width)
        .attr('x', function(d, i){return i * bar_width})
        .attr('y', 0)
        .on('mouseover', function(){
            d3.select(this).classed('highlighted', true)
        })
        .on('mouseout', function(){
            d3.select(this).classed('highlighted', false)
        })
        .on('mousemove', function(d, i){
            if(is_mouse_down){
                change_data_from_mouse(i, this);
            }
        })
        .on('click', function(d, i){change_data_from_mouse(i, this);})
}

function change_data_from_mouse(i, container){
    data[i] = Math.max(1 - d3.mouse(container)[1] / height, 0);
    draw_circles();
    update_distribution();
}

function draw_circles(){
    console.log('starting draw')
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function(d, i){return i * bar_width + bar_width / 2})
        .attr('r', bar_width / 2)

    svg.selectAll("circle")
        .attr('cy', function(d, i){return height*(1-d)})
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function draw_distribution(random_numbers){
    var min = Number(d3.select('#min_distribution').node().value) || 0,
        max = Number(d3.select('#max_distribution').node().value) || 1;

    var formatCount = d3.format(",.0f");
    var svg = svg_for_histo;
    svg.selectAll("*").remove();

    var margin = {top: 30, right: 8, bottom: 30, left: 8},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .rangeRound([0, width])
        .domain([min, max]);

    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(20))
        (random_numbers);

    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })])
        .range([height, 0]);

    var bar = g.selectAll(".bar")
      .data(bins, function(d, i){return i})
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });


    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr("height", function(d) { return height - y(d.length); });

    bar.append("text")
        // .attr("dy", ".75em")
        .attr("y", -10)
        .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.length); });

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
}
var update_distribution = debounce(function(){

    var domain = [0],
        range = [0],
        sum_until_now = 0;
    for(var i = 0; i<data.length; i++){
        domain.push((i+1)/data.length);
        sum_until_now += data[i];
        range.push(sum_until_now);
    }
    for(var i = 0; i<range.length; i++){
        range[i] = range[i] / sum_until_now;
    }

    var interpolation = d3.scaleLinear()
            .domain(domain)
            .range(range)

    let random_numbers = [],
        min = Number(d3.select('#min_distribution').node().value) || 0,
        max = Number(d3.select('#max_distribution').node().value) || 1;
    console.log(d3.select('#max_distribution'))
    for(var i = 0; i<1000; i++){
        random_numbers.push(min + (max-min) * interpolation.invert(Math.random()));
    }
    draw_distribution(random_numbers);

    text.html(random_numbers.join(',\n'))
}, 500);



draw_interactive_bars();
draw_circles();
update_distribution();
