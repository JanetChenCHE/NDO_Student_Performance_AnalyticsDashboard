class DONUTCHART_CLASSSTUDENTCOUNT {
    // constructor

    // method
    loadDonutChart(data, percentage_text) {
        this.deleteDonutChart();
        
        // set the dimensions and margins of the graph
        const width = 150,
            height = 150,
            margin = 10,
            legendWidth = 200; // Width allocated for the legend
    
        // The radius of the pie plot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(width, height) / 2 - margin;
    
        // append the svg object to the div called 'donutchart_classStudentCount'
        const svg = d3.select("#donutchart_classStudentCount")
            .append("svg")
            .attr("width", width + legendWidth) // Add extra width for the legend
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);
    
        // set the color scale
        const color = d3.scaleOrdinal()
            .range(["#262759", "#ff9c20", "#f51505"]);
    
        // Compute the position of each group on the pie:
        const pie = d3.pie()
            .value(d => d[1]);
    
        const data_ready = pie(Object.entries(data));
    
        // Calculate total value for percentage calculation
        const totalValue = Object.values(data).reduce((a, b) => a + b, 0);
    
        // Define the arc generator
        const arc = d3.arc()
            .innerRadius(radius - 25)  // Adjust the inner radius for the size of the donut hole
            .outerRadius(radius);
    
        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
            .selectAll('path')
            .data(data_ready)
            .join('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data[0]))
            .attr("stroke", "black")
            .style("stroke-width", "2px");
    
        // Add the text in the center of the donut chart
        const textLines = percentage_text.split('\n');
        textLines.forEach((line, index) => {
            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("y", index * 20 - 10)  // Adjust the vertical spacing between lines
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .text(line);
        });
    
        // Add the legend
        const legend = svg.append("g")
            .attr("transform", `translate(${radius + margin * 3}, ${-radius})`); // Adjust position as needed
    
        const legendData = Object.keys(data);
        legendData.forEach((key, i) => {
            const legendItem = legend.append("g")
                .attr("transform", `translate(0, ${i * 20})`); // Adjust vertical spacing as needed
    
            legendItem.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", color(key));
    
            legendItem.append("text")
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", "0.35em")
                .style("font-size", "12px")
                .text(`${key}`);
        });
    }
    
    loadBarChart(data) {
        this.deleteBarChart(); // Function to remove any existing chart before drawing a new one
    
        // set the dimensions and margins of the graph
        const margin = { top: 5, right: 20, bottom: 5, left: 65 },
            width = 350 - margin.left - margin.right,
            height = 150 - margin.top - margin.bottom;
    
        // append the svg object to the div called 'barchart_classStudentCount'
        const svg = d3.select("#barchart_classStudentCount")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // set the color scale
        const color = d3.scaleOrdinal()
            .range(["#262759", "#ff9c20", "#f51505"]);
            //"#262759", "#ff9c20", "#f51505"
            //"#3b82f6", "#22d3ee", "#a78bfa", "#34d399", "#fbbf24"
    
        // Parse the data
        const keys = Object.keys(data);
        const values = Object.values(data);
    
        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, d3.max(values)])
            .range([0, width]);
    
        // Add Y axis
        const y = d3.scaleBand()
            .range([0, height])
            .domain(keys)
            .padding(0.1);
    
        svg.append("g")
            .call(d3.axisLeft(y));
    
        // Bars
        svg.selectAll("myRect")
            .data(keys)
            .enter()
            .append("rect")
            .attr("x", x(0))
            .attr("y", d => y(d))
            .attr("width", d => x(data[d]))
            .attr("height", y.bandwidth())
            .attr("fill", d => color(d));
    
        // Add the percentage text inside the bars
        svg.selectAll("myText")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", d => x(data[d]) - 5)
            .attr("y", d => y(d) + y.bandwidth() / 2 + 5)
            .attr("text-anchor", "end")
            .style("fill", "white")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text(d => `${((data[d] / d3.sum(values)) * 100).toFixed(1)}%`);
    
        // Add the count text outside the bars
        svg.selectAll("myCountText")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", d => x(data[d]) + 5)
            .attr("y", d => y(d) + y.bandwidth() / 2 + 5)
            .attr("text-anchor", "start")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text(d => data[d]);
    }
    

    deleteDonutChart() {
        d3.select('#donutchart_classStudentCount svg').remove();
    }
    deleteBarChart() {
        d3.select('#barchart_classStudentCount svg').remove();
    }
}

export { DONUTCHART_CLASSSTUDENTCOUNT };
