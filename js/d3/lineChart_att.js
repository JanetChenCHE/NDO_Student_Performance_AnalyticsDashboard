class LINECHART_ATT {
    // constructor

    // Method to format data into the required structure
    formatData(data) {
        const formattedData = [];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        data.forEach(entry => {
            const month = monthNames[parseInt(entry[0]) - 1];
            const value = entry[2];
            // console.log(value);
            formattedData.push({ date: month, value: value });
        });
        return formattedData.filter(d => d.value !== 0);
    }

    // Method to load the line chart
    loadLineChart(data1, id, switch_showLable) {
        // Data cleaning
        const data = this.formatData(data1);

        // set the dimensions and margins of the graph
        const document_id = id.replace('#', '');
        const container = document.getElementById(document_id);
        const margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = container.clientWidth - margin.left - margin.right,
        height = 340 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(id)
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
            // .domain([0, d3.max(data, d => d.value)])
            .domain([0, 100])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#ff9c20")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.date) + x.bandwidth() / 2)
                .y(d => y(d.value))
            );

        // Add the point
        svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.date) + x.bandwidth() / 2)
        .attr('cy', d => y(d.value))
        .attr("r", 5)
        .attr("stroke", "#262759")
        .attr("stroke-width", 2)
        .attr("fill", "white");

        if(switch_showLable) {
            // Add text labels
            svg.append('g')
                .selectAll('text')
                .data(data)
                .enter()
                .append('text')
                .attr('x', d => x(d.date) + x.bandwidth() / 2)
                .attr('y', d => y(d.value) - 10)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .text(d => d.value.toFixed(1) + '%');
        }

    }

    // Method to delete the existing chart
    deleteLineChart(id){
        d3.select(id + ' svg').remove();
    }
}

export { LINECHART_ATT };
