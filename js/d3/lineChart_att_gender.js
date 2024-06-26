class LINECHART_ATT_GENDER {
    // constructor


    // Method to format data into the required structure
    formatData(data) {
        const formattedData = {};
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        data.forEach(entry => {
            const month = monthNames[parseInt(entry[0]) - 1];
            const gender = entry[1];
            const value = entry[2];
            if (!formattedData[month]) {
                formattedData[month] = { date: month };
            }
            formattedData[month][gender.toLowerCase()] = value;
        });
        return Object.values(formattedData).filter(d => d.male !== 0 || d.female !== 0);
    }

    //method
    // Method to delete the existing chart
    loadLineChart(data1) {
        // data cleaning
        const data = this.formatData(data1);
    
        // set the dimensions and margins of the graph
        const container = document.getElementById('line_chart_att_gender');
        const margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = container.clientWidth - margin.left - margin.right,
        height = 340 - margin.top - margin.bottom;
    
        // append the svg object to the body of the page
        const svg = d3.select("#line_chart_att_gender")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // Add X axis --> it is a date format
        const x = d3.scaleBand()
            .domain(data.map(d => d.date))
            .range([0, width])
            .padding(0.1);
    
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');
    
        // Add Y axis
        const y = d3.scaleLinear()
            // .domain([0, d3.max(data, d => Math.max(d.male, d.female))])
            .domain([0, 100])
            .range([height, 0]);
    
        svg.append("g")
            .call(d3.axisLeft(y));
    
        // Create tooltip
        const tooltip = d3.select('#line_chart_att_gender')
            .append('div')
            .style('opacity', 0)
            .attr('class', 'tooltip')
            .style('background-color', 'white')
            .style('border', 'solid')
            .style('border-width', '1px')
            .style('border-radius', '5px')
            .style('padding', '10px')
            .style('position', 'absolute')
            .style('z-index', '10');
    
        // Tooltip functions
        const mouseover = (event, d) => {
            tooltip.html('Value: ' + d.value)
                .style('opacity', 1);
        };
    
        const mousemove = (event, d) => {
            const tooltipX = event.pageX + 10;
            const tooltipY = event.pageY - 30;
            tooltip.style('transform', 'translateY(-55%)')
                .style('left', tooltipX + 'px')
                .style('top', tooltipY + 'px');
        };
    
        const mouseleave = (event, d) => {
            tooltip.style('opacity', 0);
        };
    
        // Add the lines
        const line = d3.line()
            .x(d => x(d.date) + x.bandwidth() / 2)
            .y(d => y(d.value));
    
        const maleData = data.map(d => ({ date: d.date, value: d.male }));
        const femaleData = data.map(d => ({ date: d.date, value: d.female }));
    
        svg.append("path")
            .datum(maleData)
            .attr("fill", "none")
            .attr("stroke", "#262759")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    
        svg.append("path")
            .datum(femaleData)
            .attr("fill", "none")
            .attr("stroke", "#ff9c20")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    
        // Add the points
        svg.selectAll("circle.male")
            .data(maleData)
            .enter()
            .append("circle")
            .attr("class", "male")
            .attr("cx", d => x(d.date) + x.bandwidth() / 2)
            .attr("cy", d => y(d.value))
            .attr("r", 5)
            .attr("stroke", "#262759")
            .attr("stroke-width", 2)
            .attr("fill", "white")
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave);
    
        svg.selectAll("circle.female")
            .data(femaleData)
            .enter()
            .append("circle")
            .attr("class", "female")
            .attr("cx", d => x(d.date) + x.bandwidth() / 2)
            .attr("cy", d => y(d.value))
            .attr("r", 5)
            .attr("stroke", "#ff9c20")
            .attr("stroke-width", 2)
            .attr("fill", "white")
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave);
    
        // Legend
        const legendData = [
            { label: 'Male', color: '#262759' },
            { label: 'Female', color: '#ff9c20' }
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
            .style('fill', d => d.color);
    
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
    

    deleteLineChart(){
        d3.select('#line_chart_att_gender svg').remove();
    }
}

export { LINECHART_ATT_GENDER };
