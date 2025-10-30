async function createLineChart() {
    // Load actual data
    const data = await d3.csv("./data/Ex5_ARE_Spot_Prices.csv");
    
    // Process data - using average price
    const processedData = data.map(d => ({
        year: +d.Year,
        price: +d["Average Price (notTas-Snowy)"]
    })).filter(d => !isNaN(d.year) && !isNaN(d.price));

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const container = d3.select("#line-chart");
    const containerWidth = container.node().getBoundingClientRect().width;
    const width = containerWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous chart
    container.selectAll("*").remove();

    const svg = container.append("svg")
        .attr("width", containerWidth)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLinear()
        .domain([1998, 2024])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.price) + 50])
        .range([height, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Add axis labels
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Year");

    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .text("Average Price ($/MWh)");

    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.price))
        .curve(d3.curveMonotoneX);

    // Draw the line
    svg.append("path")
        .datum(processedData)
        .attr("class", "line")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "steelblue")
        .style("stroke-width", 2);

    // Add dots for data points
    svg.selectAll(".dot")
        .data(processedData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.price))
        .attr("r", 4)
        .style("fill", "steelblue");
}