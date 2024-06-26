class LINECHART {
    //constructor

    //method
    formatData(data) {
        let new_array = [];
        let month = [];
        let value = [];
        new_array.push(data[0]);
        for(let i=0; i<data[1].length; i++) {
            if((Object.keys(data[2][i])[0]) === 'OS') {
                const OS_value = data[2][i];
                if(!isNaN(Object.values(OS_value))) {
                    month.push(data[1][i]);
                    value.push(data[2][i]);
                }
            }
        }
        new_array.push(month);
        new_array.push(value);

        // console.log(new_array);
        return new_array;
    }

    // Function to transform data into att format
    transformData(data1) {
        const data = this.formatData(data1);

        const months = data[1];
        const values = data[2].map(obj => obj.OS); // Extracting values
        const att = months.map((month, index) => ({
            date: month,
            value: values[index] // Using the corresponding value for each month
        }));
    
        return att;
    }

    loadLineChart(data1, data2, switch_showLable) {
        const new_data1 = this.formatData(data1);
        const new_data2 = this.formatData(data2);
    
        // Set the dimensions and margins of the graph
        const container = document.getElementById('line_chart');
        const margin = { top: 30, right: 30, bottom: 70, left: 60 },
            width = container.clientWidth - margin.left - margin.right,
            height = 340 - margin.top - margin.bottom;
    
        // Append the svg object to the body of the page
        const svg = d3.select('#line_chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
    
        // Data extraction
        const uniq_months1 = [...new Set(new_data1[1])];
        const uniq_months2 = [...new Set(new_data2[1])];
        let months;
        if(uniq_months1.length >= uniq_months2.length) {
            months = uniq_months1;
        }
        else {
            months = uniq_months2;
        }
    
        const OS_ENG = new_data1[2]
            .filter(item => item.hasOwnProperty('OS'))
            .map(item => isNaN(item.OS) ? 0 : item.OS)
            .filter(d => d !== 0);
    
        const OS_SQU = new_data2[2]
            .filter(item => item.hasOwnProperty('OS'))
            .map(item => isNaN(item.OS) ? 0 : item.OS)
            .filter(d => d !== 0);
    
        // Define the domain for the band scale
        const xDomain = months;
    
        // Add x-axis
        const x = d3.scaleBand()
            .domain(xDomain)
            .range([0, width])
            .padding(0.1);
    
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');
    
        // Add y-axis
        const y = d3.scaleLinear()
            .domain([0, 6])
            .range([height, 0]);
        svg.append('g')
            .call(d3.axisLeft(y));
    
        // Define line generators
        const line = d3.line()
            .x((d, i) => x(months[i]) + x.bandwidth() / 2)
            .y(d => y(d));
    
        // Add the line (English)
        svg.append('path')
            .datum(OS_ENG)
            .attr('fill', 'none')
            .attr('stroke', '#262759')
            .attr('stroke-width', 1.5)
            .attr('d', line);
    
        // Add the line (Squash)
        svg.append('path')
            .datum(OS_SQU)
            .attr('fill', 'none')
            .attr('stroke', '#ff9c20')
            .attr('stroke-width', 1.5)
            .attr('d', line);
    
        // Add the points (English)
        svg.append('g')
            .selectAll('circle')
            .data(OS_ENG)
            .enter()
            .append('circle')
            .attr('cx', (d, i) => x(months[i]) + x.bandwidth() / 2)
            .attr('cy', d => y(d))
            .attr("r", 5)
            .attr("stroke", "#262759")
            .attr("stroke-width", 2)
            .attr("fill", "white");

        // Add the points (Squash)
        svg.append('g')
            .selectAll('circle')
            .data(OS_SQU)
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
                .data(OS_ENG)
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
                .data(OS_SQU)
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
    
    

    loadLineChart_yearly(data1){
        this.deleteLineChart_yearly();

        let countNOTNaN = 0;
        data1.forEach((subArray) => {
            if (!isNaN(subArray[1])) {
                countNOTNaN++;
            }
        });

        if(countNOTNaN <= 1) {
            document.getElementById('noPrediction').innerText = 'Only joined for less than a year: No Forecasting';
        }
        else{
            document.getElementById('noPrediction').innerText = '';

            //set the dimensions and margins of the graph
            const container = document.getElementById('line_chart_yearly');
            const margin = {top: 30, right: 30, bottom: 70, left: 60},
            width = container.clientWidth - margin.left - margin.right,
            height = 340 - margin.top - margin.bottom;

            //append the svg object to the body of the page
            const svg = d3.select('#line_chart_yearly')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            //data1 Extraction
            //get the month and mark from data1 (x-axis & y-axis)
            const currentYear = new Date().getFullYear();

            const years = data1.map(subArray => subArray[0]);

            const OS_ENG = data1.map(subArray => subArray[1]);

            // Group data based on whether the year is before or after the current year
            // English
            let dataBeforeCurrentYear_OS_ENG = [];
            let dataAfterCurrentYear_OS_ENG = [];
            for(let i=0; i<data1.length; i++) {
                if(data1[i][0] <= currentYear) {
                    dataBeforeCurrentYear_OS_ENG.push(data1[i][1]);
                }
                else {
                    dataAfterCurrentYear_OS_ENG.push(data1[i][1]);
                }
            }

            // Define the domain for the band scale
            const xDomain = years;

            //add x-axis
            const x = d3.scaleBand()
                .domain(xDomain)
                .range([0, width])
                .padding(0.1); // adjust padding as needed

            svg.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .selectAll('text')
                .attr('transform', 'translate(-10,0)rotate(-45)')
                .style('text-anchor', 'end');

            //add y-axis
            const y = d3.scaleLinear()
                .domain([0, 6])
                .range([height, 0]);
            svg.append('g')
                .call(d3.axisLeft(y));

            // Create tooltip
            const tooltip = d3.select('#line_chart_teacher_selectedCohort')
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
                tooltip.html('Value: ' + d)
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
            
            // Define line generators
            const line = d3.line()
                .x((d, i) => x(years[i]) + x.bandwidth() / 2) // center the line within each band
                .y(d => y(d));

            // Add the line (english)
            svg.append('path')
                .datum(OS_ENG)
                .attr('fill', 'none')
                .attr('stroke', '#9a9bb8')
                .attr('stroke-width', 1.5)
                .attr('d', line);
            svg.append('path')
                .datum(dataBeforeCurrentYear_OS_ENG)
                .attr('fill', 'none')
                .attr('stroke', '#262759')
                .attr('stroke-width', 1.5)
                .attr('d', line);
                // .on('mouseover', mousemove)
                // .on('mouseleave', mouseleave)
                // .on('mouvemove', mousemove);
            svg.append('g')
            .selectAll('circle')
            .data(dataBeforeCurrentYear_OS_ENG)
            .enter()
            .append('circle')
            .attr('cx', (d,i) => x(years[i]) + x.bandwidth() / 2)
            .attr('cy', d => y(d))
            .attr("r", 3)
            .attr('fill', "#262759");
            // .attr('stroke-width', 2)
            // .attr('fill', 'white')

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


    deleteLineChart(){
        // Remove existing chart if any
        d3.select('#line_chart svg').remove();
    }
    deleteLineChart_yearly(){
        // Remove existing chart if any
        d3.select('#line_chart_yearly svg').remove();
    }
}

//Export
export { LINECHART };
