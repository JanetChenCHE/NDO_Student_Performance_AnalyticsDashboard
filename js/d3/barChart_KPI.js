class BARCHART_KPI{
    // constructor

    //method
    loadBarChart(data, id) {
        // console.log(data);
        this.deleteBarChart(id);
        // set the dimensions and margins of the graph
        // const margin = {top: 30, right: 30, bottom: 70, left: 60},
        //     width = 460 - margin.left - margin.right,
        //     height = 400 - margin.top - margin.bottom;

        const margin = { top: 5, right: 5, bottom: 50, left: 30 },
            width = 350 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(id)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Parse the Data


        // X axis
        const x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(d => d[0]))
        .padding(0.6);
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        const y = d3.scaleLinear()
        .domain([0, 6])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
        .data(data)
        .join("rect")
            .attr("x", d => x(d[0]))
            .attr("y", d => y(d[1]))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d[1]))
            .attr("fill", "#69b3a2")

    }

    loadBarChart_horizontal(data, id) {
        this.deleteBarChart(id);

        const margin = { top: 5, right: 5, bottom: 50, left: 30 },
            width = 350 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(id)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


        // X axis
        const x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(d => d[0]))
        .padding(0.6);
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        const y = d3.scaleLinear()
        .domain([0, 6])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
        .data(data)
        .join("rect")
            .attr("x", d => x(d[0]))
            .attr("y", d => y(d[1]))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d[1]))
            .attr("fill", "#69b3a2")

    }

    deleteBarChart(id) {
        d3.select(id + ' svg').remove();
    }
}

export { BARCHART_KPI };