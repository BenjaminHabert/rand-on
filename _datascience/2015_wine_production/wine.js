var w = 600;
var h = 500;
var w_margin = 50;

var dataset;
var svg;
var data;



var listScale = d3.scale.ordinal()
                    .domain(d3.range(10))
                    .rangeRoundBands([w_margin+10, h-1], 0.1);

var surfScale = d3.scale.linear()
                    .domain([0, 120000])
                    .rangeRound([ w/2 - w_margin , 15]);

var wineScale = d3.scale.linear()
                    .domain([0, 3000000])
                    .rangeRound([w/2 + w_margin , w-15])
                .clamp(true);

var wineAxis = d3.svg.axis()
                .scale(wineScale)
                .orient('top')
                .tickFormat(d3.format('s'))
                .ticks(5);

var surfAxis = d3.svg.axis()
                .scale(surfScale)
                .orient('top')
                .tickFormat(d3.format('s'))
                .ticks(5);



var sort_by = 'wine'; // can be 'wine' or 'surface'
var selected_wines = [];


function wine_fill_color(wine_color) {
    // wine color can be rouge, blanc, rose
    switch(wine_color){
        case 'rouge' :
            return 'rgb(153, 0, 18)';
        case 'rose' :
            return 'rgb(237,157    ,174)';
        case 'blanc' :
            return 'rgb(230, 237, 157)';
    }
}

function wine_production(d, wine_color) {
    // wine color can be rouge, blanc, rose
    // d is json data
    switch(wine_color){
        case 'rouge' :
            return d.prod_aop_rouge;
        case 'rose' :
            return d.prod_aop_rose;
        case 'blanc' :
            return d.prod_aop_blanc;
    }
}

// SCRIPT STARTS HERE
//d3.json("production_2013_numbers.json", function(error, json) {
d3.json("production_2013_numbers.json", function(error, json) {
      if (error) return console.warn(error);
      dataset = json;

      svg = d3.select("#mycanvas")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);


    // add axis
    svg.append('g')
        .attr('class','wine axis')
        .attr('width',w/5)
        .attr('transform','translate( 0, '+w_margin+')')
        .call(wineAxis)
        .append('text')
        .attr('text-anchor','end')
        .text('Wine Production (hL)')
        .attr('transform','translate('+wineScale( wineScale.domain()[1] )+', 10)');

    svg.append('g')
        .attr('class','surf axis')
        .attr('width',w/5)
        .attr('transform','translate( 0, '+w_margin+')')
        .call(surfAxis)
        .append('text')
        .text('Vineyard Surface (ha)')
        .attr('transform','translate('+surfScale( surfScale.domain()[1] )+', 10)');

    svg.selectAll('.axis path')
        .attr('fill','none')
        .attr('stroke','black')
        .attr('shape-rendering', 'crispEdges');

    svg.selectAll('.axis line')
        .attr('fill','none')
        .attr('stroke','black')
        .attr('shape-rendering', 'crispEdges');

    svg.selectAll('.axis text')
        .attr('font-family','sans-serif')
        .attr('font-size','11px');


    //title
    svg.append('text')
        .text("2013 France Wine Production (AOP)")
        .attr('x',10)
        .attr('y',15)
        .attr('font-size',15);

    //buttons
    var add_wine_select= function(wine_color, position)  {
        var idname = "check_"+wine_color;
        var g = svg.append('g')
                    .attr('transform','translate('+Number(wineScale(0)+position)+',10)');



        g.append("foreignObject")
            .attr("width", 100)
            .attr("height", 30)
            .attr("x",0)
            .attr('font-size',13)
            //.append("xhtml:div")
            .html('<label><input type=checkbox id='+idname+" checked=True/>"+wine_color+"</label>")

            .on("click", function(d, i){
                update_all();
                //console.log(svg.select("#"+idname).node().checked);
            });

        g.append('rect')
                    .attr('class', 'legend')
                    .attr('width',25)
                    .attr('height',15)
                    .attr('fill',wine_fill_color(wine_color));
    }
    add_wine_select('rouge',0);
    add_wine_select('rose',80);
    add_wine_select('blanc',160);

    update_all();
}); //end of d3.json


function update_all() {

    //update selected wines
    selected_wines = [];
    var wines = ['rouge','rose','blanc'];
    for(j=0;j<3;j++) {
        //check if the input checkbox is checked
        var id = "#check_"+ wines[j];
        if(d3.select(id).node().checked) {
            selected_wines.push(wines[j]);
        }
    }
    // if no wine is selected, we sort by surface
    if(selected_wines.length < 1) {
        sort_by = 'surface';
    }else {
        sort_by = 'wine' ;
    }


    update_data();
    update_viz();
}



function update_data() {
    //sort dataset by prodution or surface and select first 20 elements
    data = dataset.sort(function(a, b){
        if(sort_by == 'surface') {
            return b.surf_aop - a.surf_aop;
        }
        else {
            //sort by wine production (the total of selected wines)
            var comp = 0;
            for(var j=0; j<selected_wines.length;j++) {
                comp += wine_production(b, selected_wines[j] ) - wine_production(a, selected_wines[j] );
            }
            return comp;
        }
        })
        .slice(0,20);


    //update scales to the selected elements
    wineScale
            .domain([0, d3.max(data, function(d) {
                        var total = 0;
                        for(j=0;j<selected_wines.length;j++) {
                            total += wine_production(d, selected_wines[j]) ;
                        }
                        return total;
                    })])
            .nice();


    listScale.domain(d3.range(data.length));
    surfScale.domain([0, d3.max(data, function(d) { return d.surf_aop; })])
                    .nice();

}




function update_viz() {

    //update axis
    svg.selectAll("g.wine.axis")
        .transition()
        .duration(1000)
        .call(wineAxis);

   svg.selectAll("g.surf.axis")
           .transition()
        .duration(1000)
        .call(surfAxis);


    //link departement groups with selected data
    var  departements = svg.selectAll('g.dep')
        .data(data, function(d) { return d.departement; });

    //select new departements added
    var dpts = departements.enter()
        .append('g')
        .attr('class','dep')
        .attr('transform',function(d, i) {return 'translate('+(-w)+',' + listScale(i) +')'; }) ;
                //note that the new departements are added far left
                // out of the render window
        //.attr('pointer-events','none');

    // add name of departement
    dpts.append('text')
        .text(function(d){ return d.departement; })
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr('font-size',10)
        .attr('fill','black')
        .attr('font-weight','bold')
        .attr('x',w/2)
        .attr('y',function(d,i){ return Math.round(listScale.rangeBand()/2 +4); })
        .attr('pointer-events','none');

    //prepare tooltip
    var number_format = d3.format('.2s');
    var tip = svg.append('g')
        .attr('class','tooltip')
        .style("opacity",1);
    /*
    tip.append('rect')
        .attr('fill','rgba(255,255,255,0.7)')
        .attr('width',100)
        .attr('height',20)
        .attr('x',-10);

*/
    var dy = 0;
    var add_tip_text = function(t) {
        var style;
        if(dy == 0) {
            style = 'font-size: 12; font-weight:bold';
        }
        else {
            style = 'font-size: 12;';
        }
        tip.append('text')
                .text(t)
                .attr('style',style)
                .attr('y', dy+15+listScale.rangeBand());
        dy += 15;
    };
    var remove_tip_text = function() {
        tip.selectAll('text').remove();
        dy = 0;
    };

    //add surface data
    dpts.append('rect')
        .attr('class','surface')
        .attr('x', function(d) { return  surfScale(d.surf_aop); })
        .attr('y',0)
        .attr('height',listScale.rangeBand())
        .attr('width',function(d) { return surfScale(0) - surfScale(d.surf_aop);})
        .attr('fill','rgb(115, 150, 39 )')
        //.attr('pointer-events','none');
        .on('mouseover', function(d,i){
            d3.select(this).attr("style","stroke: black; stroke-width: 1");

            var translate =d3.select(this.parentNode).attr('transform');
            tip.attr('transform',translate)

            add_tip_text(d.departement);
            add_tip_text("Wineyard surface: "+number_format(d.surf_aop)+' ha');
            add_tip_text("Surface p/ producer : "+number_format(d.surf_aop/d.nb_recoltes)+' ha');

        })
        .on('mouseout', function(d) {
            remove_tip_text();
            d3.select(this).attr("style","");
        });


    //add wine production data. Default position and width is 0
    var add_wine_init = function(wine_color) {
        // wine_color can be 'rouge', 'blanc', 'rose'
        dpts.append('rect')
            .attr('class',wine_color)
            .attr('x',wineScale(0))
            .attr('width',0)
            .attr('y', 0)
            .attr('height', listScale.rangeBand())
            .attr('fill',wine_fill_color(wine_color))
            .on('mouseover', function(d,i){
                d3.select(this).attr("style","stroke: black; stroke-width: 1");

                var translate =d3.select(this.parentNode).attr('transform');
                tip.attr('transform',translate)

                add_tip_text(d.departement);
                add_tip_text("Wine type: "+wine_color);
                add_tip_text("Produced : "+number_format(wine_production(d, wine_color))+' hL');
                add_tip_text("per producer : "+number_format(wine_production(d, wine_color)/d.nb_recoltes)+' hL');

            })
            .on('mouseout', function(d) {
                remove_tip_text();
                d3.select(this).attr("style","");
            });



    }
    add_wine_init('rouge');
    add_wine_init('rose');
    add_wine_init('blanc');
/*
    departements.selectAll('rect')

*/

    var transition_delay = 0;
    var transition_time = 500;
    //update width and position of wine production rect
    var winecolors = ['rouge','rose','blanc'];
    for(var j=0;j<3;j++) {
            //width and x parameters for a given rectangle depend on the width and position of the previous rectangles
            departements.selectAll('rect.'+winecolors[j])
                .transition()
                .duration(transition_time)
                .delay(transition_delay)
                .attr('width',function(d) {
                    if(selected_wines.indexOf(winecolors[j])<0 ){
                        return 0;
                    }
                    else {
                        var prod = wine_production(d, winecolors[j]);
                        return wineScale(prod) - wineScale(0);
                    }
                })
                .attr('x', function(d) {
                    var x0 = wineScale(0);
                    for(k=0;k<j;k++) {
                        if( selected_wines.indexOf(winecolors[k]) >= 0 ) {
                            var prod = wine_production(d, winecolors[k]);
                            x0 += wineScale(prod) - wineScale(0);
                        }
                    }
                    return x0;
                });
    }
    transition_delay += transition_time;
    // CAREFULL: TRANSITION SHOULD NOT OVERLAP. OTHERWISE WEIRD RESULTS


    // the departements that are no longer linked to data a shifted to the right and removed
    departements.exit()
        .transition()
        .duration(transition_time)
        .delay(transition_delay)
        .attr('transform',function() {
            // get current transform attribute
            tr = d3.select(this).attr('transform'); //we extract the previous translation parameter
            return tr.replace('(0,', '('+w+',');
        })
        .remove();
    transition_delay += transition_time;

    //update departements vertical position
    departements
        .transition()
        .duration(transition_time)
        .delay(transition_delay)
        .attr('transform', function(d,i){ return "translate("+0+","+listScale(i)+")";} );
    transition_delay += transition_time;

    //move the new departements into position
    dpts.transition()
        .duration(transition_time)
        .delay(transition_delay)
        .attr('transform',function(d, i) { return 'translate(0,' + listScale(i)+ ')'; });


}

/* ADD THIS TO HTML
    <center >
        <div id="mycanvas" >
        <script type="text/javascript" src="/assets/wine_production/wine3.js"></script>
        </div>
    </center>
    */
