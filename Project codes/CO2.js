d3.csv("https://raw.githubusercontent.com/GordonHuy/Data_Visualization_Project/master/Datasets/Change%20in%20annual%20CO%E2%82%82%20emissions.csv", function(d) {
    return {
        country: d.Entity,
        year: new Date(+d.Year, 0, 1),
        emission_rate: d['Annual CO2 emissions']
    };
},
    function(data) {
        //console.log(data);
        
        var nested = d3.nest()
                        .key(function (d) { return d3.timeFormat('%Y')(d.year); })
                        .rollup(function(leaves){
                            return d3.sum(leaves, function(d){
                                return d.emission_rate;
                            });
                        }).entries(data);

        console.log(nested);

        const w = 1500;
        const h = 1000;
        var padding = 40;

        var xScale = d3.scaleTime()
                .domain(d3.extent(nested, function(d) { return d.key; }))
                .range([padding, w - padding]);

        // var xScale = d3.scaleLinear()
        //                 .domain([d3.min(data, (d) => d.year), d3.max(data, (d) => d.year)])
        //                 .range([padding, w - padding]);
        // var xScale = d3.scaleLinear()
        //                 .domain([d3.min(data, (d) => d.year), d3.max(data, (d) => d.year)])
        //                 .range([padding, w - padding]);
            
        var yScale = d3.scaleLinear()
                    .domain([d3.min(nested, (d => d.value)), d3.max(nested, (d => d.value))])
                    .range([h - padding , padding])
        
        // var aScale = d3.scaleSqrt()
        //             .domain([d3.min(data, (d => d.emission_rate)), d3.max(data, (d) => d.emission_rate)])
        //             .range([0, 1]);

        var line = d3.line()
                        .x((d) => xScale(d.key))
                        .y((d) => yScale(d.value));

        var svg = d3.select("#d3-CO2")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);
        
        // svg.selectAll('.temp-path')
        //     .data(nested)
        //     .enter()
        //     .append('path')
        //     .attr('d', function(d) {
        //         return line(d.value)
        //     })
        //     .attr('fill', 'none')
        //     .attr('stroke', 'blue');

        svg.append("path")
        .datum(nested)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return xScale(d.key) })
        .y(function(d) { return yScale(d.value) })
        );
        
        svg.selectAll("circle")
        .data(nested)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.key))
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 5)
        .attr("fill", "red");

        var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 0 + ")");

        g.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(d3.axisBottom(xScale));

                
        g.append("g")
            .attr("class", "yAxis")
            .call(d3.axisLeft(yScale).tickFormat(function(d){
                return d;
            }).ticks(10))
            .append("text")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("value");
        
});