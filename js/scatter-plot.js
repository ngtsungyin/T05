async function createScatterPlot() {
    // Load actual data
    const data = await d3.csv("./data/Ex5_TV_energy.csv");
    

        try {
        const data = await d3.csv("./data/Ex5_TV_energy.csv");
        console.log("Scatter plot data loaded:", data.length, "rows");
        console.log("First row:", data[0]);


    // Process data - convert strings to numbers and filter if needed
    const processedData = data.map(d => ({
        starRating: +d.star2, // Using star2 column for rating
        energyConsumption: +d.energy_consumpt
    })).filter(d => !isNaN(d.starRating) && !isNaN(d.energyConsumption));

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const container = d3.select("#scatter-plot");
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

    // Create scales with dynamic domains based on actual data
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.starRating) + 0.5])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.energyConsumption) + 50])
        .range([height, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
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
        .text("Star Rating");

    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .text("Energy Consumption (kWh/year)");

    // Add chart title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", -10)
        .text("Energy Consumption vs Star Rating");

    // Create circles for data points
    svg.selectAll(".dot")
        .data(processedData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.starRating))
        .attr("cy", d => yScale(d.energyConsumption))
        .attr("r", 3)
        .style("fill", "steelblue")
        .style("opacity", 0.6);

              // Rest of your chart code...
        
    } catch (error) {
        console.error("Error in scatter plot:", error);
    }
}