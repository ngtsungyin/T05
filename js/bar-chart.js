async function createBarChart() {
    // Load actual data
    const data = await d3.csv("./data/Ex5_TV_energy_55inchtv_byScreenType.csv");
    
    // Process data
    const processedData = data.map(d => ({
        technology: d.Screen_Tech,
        consumption: +d["Mean(Labelled energy consumption (kWh/year))"]
    }));

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const container = d3.select("#bar-chart");
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
    const xScale = d3.scaleBand()
        .domain(processedData.map(d => d.technology))
        .range([0, width])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.consumption) + 50])
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
        .text("Screen Technology");

    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .text("Energy Consumption (kWh/year)");

    // Create bars
    svg.selectAll(".bar")
        .data(processedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.technology))
        .attr("y", d => yScale(d.consumption))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.consumption))
        .attr("fill", "steelblue")
        .style("opacity", 0.8);

    // Add value labels on bars
    svg.selectAll(".bar-label")
        .data(processedData)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.technology) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.consumption) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.consumption.toFixed(0))
        .style("font-size", "12px")
        .style("font-weight", "bold");
}