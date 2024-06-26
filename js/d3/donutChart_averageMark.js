class DONUTCHART_AVERAGEMARK {
    // constructor

    // method
    loadDonutChart(data, percentage_text, id, colour) {
        // console.log(data);
        this.deleteDonutChart(id);
        // set the dimensions and margins of the graph
        const width = 120,
            height = 120,
            margin = 3;

        // The radius of the pie plot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(width, height) / 2 - margin;

        // append the svg object to the div called 'donutchart_classStudentCount'
        const svg = d3.select(id)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // set the color scale
        const color = d3.scaleOrdinal()
            .range([colour, '#ffffff']);

        // Compute the position of each group on the pie:
        const pie = d3.pie()
            .value(d => d[1]);

        const data_ready = pie(Object.entries(data));

        // Define the arc generator
        const arc = d3.arc()
            .innerRadius(radius - 25)  // Adjust the inner radius for the size of the donut hole
            .outerRadius(radius)
            .cornerRadius(20);  // Add rounded corners

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
            .selectAll('path')
            .data(data_ready)
            .join('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data[0]));
            // .attr("stroke", "black")
            // .style("stroke-width", "0.2px");

        // Add the colored circle in the center of the donut chart
        svg
            .append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", radius - 25)
            .attr("fill", colour)
            .attr("opacity", 0.3);
            
        // Add the text in the center of the donut chart
        svg
            .append("text")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            // .style("font-weight", "bold")
            .text(percentage_text);
    }

    deleteDonutChart(id) {
        d3.select(id + ' svg').remove();
    }
}

export { DONUTCHART_AVERAGEMARK };
