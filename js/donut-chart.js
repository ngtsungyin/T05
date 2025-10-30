async function createDonutChart() {
    // Load actual data
    const data = await d3.csv("./data/Ex5_TV_energy_Allsizes_byScreenType.csv");
    
    // Process data
    const processedData = data.map(d => ({
        technology: d.Screen_Tech,
        consumption: +d["Mean(Labelled energy consumption (kWh/year))"]
    }));

    const margin = { top: 40, right: 30, bottom: 30, left: 30 };
    const container = d3.select("#donut-chart");
    const containerWidth = container.node().getBoundingClientRect().width;
    const width = containerWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    // Clear previous chart
    container.selectAll("*").remove();

    const svg = container.append("svg")
        .attr("width", containerWidth)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${containerWidth / 2},${(height + margin.top) / 2})`);

    // Create color scale
    const color = d3.scaleOrdinal()
        .domain(processedData.map(d => d.technology))
        .range(d3.schemeCategory10);

    // Create pie generator
    const pie = d3.pie()
        .value(d => d.consumption)
        .sort(null);

    // Create arc generator
    const arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius);

    // Create arcs
    const arcs = svg.selectAll(".arc")
        .data(pie(processedData))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Draw arcs
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.technology))
        .style("opacity", 0.8);

    // Add labels with percentages
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => {
            const total = d3.sum(processedData, x => x.consumption);
            const percentage = ((d.data.consumption / total) * 100).toFixed(1);
            return `${percentage}%`;
        })
        .style("font-size", "12px")
        .style("font-weight", "bold");

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(processedData)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${radius + 20},${i * 25 - height / 4})`);

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => color(d.technology));

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => `${d.technology}: ${d.consumption.toFixed(0)} kWh`)
        .style("font-size", "12px");
}