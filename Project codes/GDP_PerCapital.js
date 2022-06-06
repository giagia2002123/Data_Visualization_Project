d3.csv("https://raw.githubusercontent.com/GordonHuy/Data_Visualization_Project/master/Datasets/gdp-per-capita-worldbank.csv", function(d) {
    console.log("Test")
    return {
        country: d.Entity,
        day: parseFloat(d.Year),
        value: (d['GDP per capita, PPP (constant 2017 international $)'] || 0) ? parseFloat(d['GDP per capita, PPP (constant 2017 international $)']) : parseFloat(0.0),
    };
  }, 
    function(data) {
        console.log(data);
        // var nested_data = d3.nest()
        //                     .key(function(d) { return d.country; })
        //                     .entries(data);
        // console.log(nested_data)

        const w = 1000;
        const h = 700;

        const padding = 50;

        var xScale = d3.scaleLinear()
                        .domain([d3.min(data, (d) => d.day), d3.max(data, (d) => d.day)])
                        .range([padding, w - padding]);

        var yScale = d3.scaleLinear()
                        .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
                        .range([h - padding, padding]);

        var aScale = d3.scaleSqrt()
                        .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
                        .range([0, 365]);

        var svg = d3.select("#d3-scatter")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

        svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.day))
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 5)
        .attr("fill", function(d) {
            return "rgb(" + Math.round(aScale(d.value)) + ", 0, 0)";
        })
        .on("mouseover", function(d) {
            d3.select(this)
                .attr("fill", "yellow")
                .attr("opacity", (d) => aScale(d.value));
            var xPosition = parseFloat(d3.select(this).attr("cx")) + w / 2;
            var yPosition = parseFloat(d3.select(this).attr("cy") / 2 + h / 2);

            d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .select("#value")
                .text(d.country + "_ Year: " + d.day +  "_ GDP: " + d.value);
            
            d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(400)
                .attr("fill", "rgb(" + Math.round(aScale(d.value)) + ", 0, 0)")
                .attr("opacity", 1);
            d3.select("#tooltip").classed("hidden", true);
        });

        var xAxis = d3.axisBottom(xScale)
                        .ticks(10);

        const yAxis = d3.axisLeft(yScale)
                        .ticks(10);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (padding) + ", 0)")
            .call(yAxis);
    });