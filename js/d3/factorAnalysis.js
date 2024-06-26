import { CORRELATION } from "../analysis/correlation.js";

const object_correlation = new CORRELATION();

class FACTORANALYSIS {
    // constructor

// 262759, ff9c20
// allVar = ["Listening", "Speaking", "Writing", "Reading"];
// allVar = ["Endurance", "Coordinate", "Skill", "Movement"];
// allVar = ["Movement", 'D (FH)', 'D (BH)', 'S (FH)', 'S (BH)', 'V (FH)', 'V (BH)', 'CC (FH)', 'CC (BH)', 'RS (FH)', 'RS (BH)', 'B (FH)', 'B (BH)'];

    // methods
    loadCorrelogram(data, programme, length) {
        if(programme === 'English') {
            this.makeCorrelogram_scatterplot(data, "#correlogram_English", ["Listening", "Speaking", "Writing", "Reading"], "#262759");
        }
        else if (programme === 'Squash') {
        
            this.makeCorrelogram_scatterplot(data, "#correlogram_Squash1", ["Endurance", "Coordinate", "Skill", "Movement"], "#ff9c20");
            if(length > 4) {
                // this.makeCorrelogram_number(data, "#correlogram_Squash2", ["Movement", 'D (FH)', 'D (BH)', 'S (FH)', 'S (BH)', 'V (FH)', 'V (BH)', 'CC (FH)', 'CC (BH)', 'RS (FH)', 'RS (BH)', 'B (FH)', 'B (BH)'], "#ff9c20");
                this.makeCorrelogram_number_circle(data, "#correlogram_Squash2", ["Movement", 'D (FH)', 'D (BH)', 'S (FH)', 'S (BH)', 'V (FH)', 'V (BH)', 'CC (FH)', 'CC (BH)', 'RS (FH)', 'RS (BH)', 'B (FH)', 'B (BH)']);
            }
        }
    }
    
    makeCorrelogram_scatterplot(data, id, allVar, colour) {
        // Dimension of the whole chart. Only one size since it has to be square
        const marginWhole = {top: 10, right: 10, bottom: 10, left: 10};
        const sizeWhole = 640 - marginWhole.left - marginWhole.right;

        // Create the svg area
        const svg = d3.select(id)
            .append("svg")
            .attr("width", sizeWhole + marginWhole.left + marginWhole.right)
            .attr("height", sizeWhole + marginWhole.top + marginWhole.bottom)
            .append("g")
            .attr("transform", `translate(${marginWhole.left},${marginWhole.top})`);

        // What are the numeric variables in this dataset? How many do I have
        const numVar = allVar.length;

        // Now I can compute the size of a single chart
        const mar = 20;
        const size = sizeWhole / numVar;

        // Scales
        const position = d3.scalePoint()
            .domain(allVar)
            .range([0, sizeWhole - size]);

        // Add charts
        for (let i = 0; i < numVar; i++) {
            for (let j = 0; j < numVar; j++) {
                const var1 = allVar[i];
                const var2 = allVar[j];

                // If var1 == var2, skip that
                if (var1 === var2) continue;

                // Add X Scale of each graph
                const xextent = d3.extent(data, d => +d[var1]);
                const x = d3.scaleLinear()
                    .domain(xextent).nice()
                    .range([0, size - 2 * mar]);

                // Add Y Scale of each graph
                const yextent = d3.extent(data, d => +d[var2]);
                const y = d3.scaleLinear()
                    .domain(yextent).nice()
                    .range([size - 2 * mar, 0]);

                // Add a 'g' at the right position
                const tmp = svg
                    .append('g')
                    .attr("transform", `translate(${position(var1) + mar},${position(var2) + mar})`);

                // Add X and Y axis in tmp
                tmp.append("g")
                    .attr("transform", `translate(0,${size - mar * 2})`)
                    .call(d3.axisBottom(x).ticks(3));
                tmp.append("g")
                    .call(d3.axisLeft(y).ticks(3));

                // Add circles
                tmp.selectAll("myCircles")
                    .data(data)
                    .join("circle")
                    .attr("cx", d => x(+d[var1]))
                    .attr("cy", d => y(+d[var2]))
                    .attr("r", 2)
                    .attr("fill", colour);
            }
        }

        // Add variable names = diagonal
        for (let i = 0; i < numVar; i++) {
            for (let j = 0; j < numVar; j++) {
                // If var1 != var2, skip that
                if (i !== j) continue;

                // Add text
                const var1 = allVar[i];
                svg.append('g')
                    .attr("transform", `translate(${position(var1)},${position(var1)})`)
                    .append('text')
                    .attr("x", size / 2)
                    .attr("y", size / 2)
                    .text(var1)
                    .attr("text-anchor", "middle");
            }
        }
    }

    makeCorrelogram_number(data, id, allVar, colour) {
        // Dimension of the whole chart. Only one size since it has to be square
        const marginWhole = {top: 10, right: 10, bottom: 10, left: 10};
        const sizeWhole = 480 - marginWhole.left - marginWhole.right;
    
        // Create the svg area
        const svg = d3.select(id)
            .append("svg")
            .attr("width", sizeWhole + marginWhole.left + marginWhole.right)
            .attr("height", sizeWhole + marginWhole.top + marginWhole.bottom)
            .append("g")
            .attr("transform", `translate(${marginWhole.left},${marginWhole.top})`);
    
        // What are the numeric variables in this dataset? How many do I have
        const numVar = allVar.length;
    
        // Now I can compute the size of a single chart
        const size = sizeWhole / numVar;
    
        // Scales
        const position = d3.scalePoint()
            .domain(allVar)
            .range([0, sizeWhole]);
    
        // Add rectangles and text
        for (let i = 0; i < numVar; i++) {
            for (let j = 0; j < numVar; j++) {
                const var1 = allVar[i];
                const var2 = allVar[j];
    
                // Calculate correlation coefficient between var1 and var2
                const values1 = data.map(d => ({ value: +d[var1] }));
                const values2 = data.map(d => ({ value: +d[var2] }));
                const correlation = object_correlation.calculateCorrelation(values1, values2);
    
                // Add a 'g' at the right position
                const tmp = svg
                    .append('g')
                    .attr("transform", `translate(${position(var1)},${position(var2)})`);
    
                // Add rectangles for background
                tmp.append('rect')
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", size)
                    .attr("height", size)
                    .attr("fill", "white")
                    .attr("stroke", "grey");
    
                // Add text for correlation coefficient
                tmp.append('text')
                    .attr("x", size / 2)
                    .attr("y", size / 2)
                    .text(correlation.toFixed(2)) // Displaying correlation coefficient rounded to 2 decimal places
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle");
                // if(correlation<1) {
                //     tmp.append('text')
                //         .attr("x", size / 2)
                //         .attr("y", size / 2)
                //         .text(correlation.toFixed(2)) // Displaying correlation coefficient rounded to 2 decimal places
                //         .attr("text-anchor", "middle")
                //         .attr("dominant-baseline", "middle");
                // }
            }
        }
    
        // Add variable names = diagonal
        for (let i = 0; i < numVar; i++) {
            const var1 = allVar[i];
            svg.append('g')
                .attr("transform", `translate(${position(var1) + size / 2},${position(var1) + size / 2})`)
                .append('text')
                .text(var1)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle");
        }
    }

    makeCorrelogram_number_circle(data, id, allVar) {
        // Dimensions and margins
        const margin = {top: 10, right: 33, bottom: 10, left: 10},
            width = 640 - margin.left - margin.right,
            height = 640 - margin.top - margin.bottom;
    
        // Create the svg area
        const svg = d3.select(id)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // List of all variables and number of them
        const numVar = allVar.length;
    
        // Create a color scale
        const color = d3.scaleLinear()
            .domain([-1, 0, 1])
            .range(["#B22222", "#fff", "#000080"]);
    
        // Create a size scale for bubbles on top right. Must be a rootscale!
        const size = d3.scaleSqrt()
            .domain([0, 1])
            .range([0, 9]);
    
        // X scale
        const x = d3.scalePoint()
            .range([0, width])
            .domain(allVar);
    
        // Y scale
        const y = d3.scalePoint()
            .range([0, height])
            .domain(allVar);
    
        // Compute the correlation matrix
        const correlationMatrix = [];
        for (let i = 0; i < numVar; i++) {
            for (let j = 0; j < numVar; j++) {
                const var1 = allVar[i];
                const var2 = allVar[j];
                const values1 = data.map(d => +d[var1]);
                const values2 = data.map(d => +d[var2]);
                const correlation = calculateCorrelation(values1, values2);
                correlationMatrix.push({
                    x: var1,
                    y: var2,
                    value: correlation
                });
            }
        }
    
        // Create one 'g' element for each cell of the correlogram
        const cor = svg.selectAll(".cor")
            .data(correlationMatrix)
            .join("g")
            .attr("class", "cor")
            .attr("transform", d => `translate(${x(d.x)}, ${y(d.y)})`);
    
        // Low left part + Diagonal: Add the text with specific color
        cor.filter(d => allVar.indexOf(d.x) <= allVar.indexOf(d.y))
            .append("text")
            .attr("y", 5)
            .text(d => d.x === d.y ? d.x : d.value.toFixed(2))
            .style("font-size", 11)
            .style("text-align", "center")
            .style("fill", d => d.x === d.y ? "#000" : color(d.value));
    
        // Up right part: add circles
        cor.filter(d => allVar.indexOf(d.x) > allVar.indexOf(d.y))
            .append("circle")
            .attr("r", d => size(Math.abs(d.value)))
            .style("fill", d => color(d.value))
            .style("opacity", 0.8);
    
        // Function to calculate the Pearson correlation coefficient
        function calculateCorrelation(x, y) {
            const n = x.length;
            const meanX = d3.mean(x);
            const meanY = d3.mean(y);
            const num = d3.sum(x.map((xi, i) => (xi - meanX) * (y[i] - meanY)));
            const denX = Math.sqrt(d3.sum(x.map(xi => (xi - meanX) ** 2)));
            const denY = Math.sqrt(d3.sum(y.map(yi => (yi - meanY) ** 2)));
            return num / (denX * denY);
        }
    }

    deleteChart(id) {
        d3.select(id + " svg").remove();
    }
}

export { FACTORANALYSIS };
