class LINECHART_CLASS {
    // constructor

    // method
    loadLineChart(data1, data2, switch_showLable){
        // Set the dimensions and margins of the graph
        const container = document.getElementById('line_chart_class');
        const margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = container.clientWidth - margin.left - margin.right,
        height = 340 - margin.top - margin.bottom;

        // Append the SVG object to the body of the page
        const svg = d3.select('#line_chart_class')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Data Extraction
        // Get the month names and OS values
        const months = data1.map(entry => entry[0]);
        // const OS_eng = data1.map(entry => entry[1].OS);
        // const OS_squ = data2.map(entry => entry[1].OS); 
        const OS_eng = data1
        .filter(entry => entry[1].OS !== undefined && !isNaN(entry[1].OS))
        .map(entry => entry[1].OS);

        const OS_squ = data2
        .filter(entry => entry[1].OS !== undefined && !isNaN(entry[1].OS))
        .map(entry => entry[1].OS);


        // Add x-axis
        const x = d3.scaleBand()
            .domain(months)
            .range([0, width])
            .padding(0.1); // adjust padding as needed;
        
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');

        // Add y-axis
        const y = d3.scaleLinear()
            .domain([0, 6]) // Adjust the domain based on OS data
            .range([height, 0]);
        
        svg.append('g')
            .call(d3.axisLeft(y));

        // Add the line (OS_eng)
        svg.append('path')
            .datum(OS_eng)
            .attr('fill', 'none')
            .attr('stroke', '#262759')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x((d, i) => x(months[i]) + x.bandwidth() / 2) // Use month as x-coordinate
                .y(d => y(d))
            );

        // Add the line (OS_squ)
        svg.append('path')
        .datum(OS_squ)
        .attr('fill', 'none')
        .attr('stroke', '#ff9c20')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
            .x((d, i) => x(months[i]) + x.bandwidth() / 2) // Use month as x-coordinate
            .y(d => y(d))
        );

        // Add the points (OS_eng)
        svg.append('g')
            .selectAll('circle')
            .data(OS_eng)
            .enter()
            .append('circle')
            .attr('cx', (d, i) => x(months[i]) + x.bandwidth() / 2)
            .attr('cy', d => y(d))
            .attr("r", 5)
            .attr("stroke", "#262759")
            .attr("stroke-width", 2)
            .attr("fill", "white");
    
        // Add the points (OS_squ)
        svg.append('g')
            .selectAll('circle')
            .data(OS_squ)
            .enter()
            .append('circle')
            .attr('cx', (d, i) => x(months[i]) + x.bandwidth() / 2)
            .attr('cy', d => y(d))
            .attr("r", 5)
            .attr("stroke", "#ff9c20")
            .attr("stroke-width", 2)
            .attr("fill", "white");
        
        if(switch_showLable) {
            // Add text labels (English)
            svg.append('g')
                .selectAll('text')
                .data(OS_eng)
                .enter()
                .append('text')
                .attr('x', (d, i) => x(months[i]) + x.bandwidth() / 2)
                .attr('y', d => y(d) - 10)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .text(d => d.toFixed(1));
    
            // Add text labels (Squash)
            svg.append('g')
                .selectAll('text')
                .data(OS_squ)
                .enter()
                .append('text')
                .attr('x', (d, i) => x(months[i]) + x.bandwidth() / 2)
                .attr('y', d => y(d) - 10)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .text(d => d.toFixed(1));
        }

        // add legend
        const legendData = [
            { label: 'English', color: '#262759' },
            { label: 'Squash', color: '#ff9c20' }
        ];

        const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${(width - 120) / 2}, ${height + margin.top + 20})`);

        legend.selectAll('rect')
            .data(legendData)
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * 100)
            .attr('y', 0)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', d => d.color);

        legend.selectAll('text')
            .data(legendData)
            .enter()
            .append('text')
            .attr('x', (d, i) => i * 100 + 15)
            .attr('y', 9)
            .text(d => d.label)
            .style('font-size', '13px')
            .attr('alignment-baseline', 'middle');
    }

    // Method to delete the existing chart
    deleteLineChart(){
        d3.select('#line_chart_class svg').remove();
    }
}

// Export
export { LINECHART_CLASS };
