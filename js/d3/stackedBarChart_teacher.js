class STACKEDBARCHART_TEACHER {
    //constructor

    // methods
    loadStackedBarChart(data, id, switch_showLable) {
      // Transpose data
      const transposedData = data.slice(1).map(d => d.slice(1));
      // Stack the data? --> stack per subgroup
      const keys = Array.from({ length: data[0].length - 1 }, (_, i) => i);
      const stackedData = d3.stack()
        .keys(keys)
        (transposedData);
    
      // Dimensions
      const document_id = id.replace('#', '');
      const container = document.getElementById(document_id);
      const margin = {top: 30, right: 30, bottom: 30, left: 50},
      width = container.clientWidth - margin.left - margin.right,
      height = 340 - margin.top - margin.bottom;
    
      // append the svg object to the body of the page
      const svg = d3.select(id)
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom + 100)
        .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);
    
      // List of subgroups = header of the csv files = soil condition here
      const subgroups = data[0].slice(1);
    
      // List of groups = species here = value of the first column called group -> I show them on the X axis
      const groups = data.slice(1).map(d => (d[0]));
    
      // Add X axis
      const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');
    
    // Calculate the maximum value from the stacked data
    const maxDataValue = d3.max(stackedData, stackedGroup => d3.max(stackedGroup, d => d[1]));

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, Math.max(24, maxDataValue)])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));
    
      // Color palette = one color per subgroup
      const customColors = [
        "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
        "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
        "#393b79", "#5254a3", "#6b6ecf", "#9c9ede", "#637939",
        "#8ca252", "#b5cf6b", "#cedb9c", "#8c6d31", "#bd9e39",
      ];
  
      const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(customColors);
    
        
      // Show the bars
      if(switch_showLable) {
        // Show the bars with value on the respective bars
        svg.append("g")
          .selectAll("g")
          .data(stackedData)
          .join("g")
            .attr("fill", d => color(subgroups[d.key]))
          .selectAll("rect")
          .data(d => d)
          .join("rect")
            .attr("x", (d, i) => x(groups[i]))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
          .each(function(d, i) {
            const rect = d3.select(this);
            const textValue = d[1] - d[0];
            if (!isNaN(textValue) && textValue.toFixed(1) > 0) { // Only display text if value is not NaN and > 0
              svg.append("text")
                .attr("x", parseFloat(rect.attr("x")) + x.bandwidth() / 2)
                .attr("y", parseFloat(rect.attr("y")) + (y(d[0]) - y(d[1])) / 2)
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .style("fill", "black")
                .text(textValue.toFixed(1))
                .style("font-size", "10px");
            }
          });
          // Add total value at the top of each bar
          groups.forEach((group, i) => {
            const total = stackedData.reduce((sum, d) => {
              if (!isNaN(d[i][1]) && !isNaN(d[i][0])) {
                return sum + (d[i][1] - d[i][0]);
              }
            else {
              return sum;
            }}, 0);
            if (!isNaN(total) && total > 0) { // Only display text if value is not NaN and > 0
              svg.append("text")
              .attr("x", x(group) + x.bandwidth() / 2)
              .attr("y", y(total) - 5)  // Positioning just above the top of the bar
              .attr("text-anchor", "middle")
              .style("fill", "black")
              .style("font-weight", "bold")
              .text(total.toFixed(1))
              .style("font-size", "14px");
            }
          });
      }
      else {
        // Show the bars
        svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .join("g")
          .attr("fill", d => color(subgroups[d.key]))
          .selectAll("rect")
          // enter a second time = loop subgroup per subgroup to add all rectangles
          .data(d => d)
          .join("rect")
            .attr("x", (d, i) => x(data[i + 1][0]))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width",x.bandwidth());
      }

        // Calculate legend properties
    const legendSpacing = 70;
    const legendItemHeight = 20;
    const itemsPerRow = Math.floor(width / legendSpacing);

    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${(width - itemsPerRow * legendSpacing) / 2},${height + 40})`);

    const legendItem = legend.selectAll(".legend-item")
      .data(subgroups)
      .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${(i % itemsPerRow) * legendSpacing}, ${Math.floor(i / itemsPerRow) * legendItemHeight + 20})`);

    legendItem.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", d => color(d)); // Corrected color assignment

    legendItem.append("text")
      .attr("x", 15)
      .attr("y", 9)
      .text(d => d)
      .attr("fill", d => color(d))
      .attr("text-anchor", "start")
      .style("alignment-baseline", "middle")
      .style("font-size", "13px"); // Reduce font size


    }
    
    deleteStackedBarChart_teacher(id) {
        // Remove existing chart if any
        d3.select(id + ' svg').remove();
    }
}
export { STACKEDBARCHART_TEACHER };