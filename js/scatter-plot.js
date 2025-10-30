// Scatter Plot: Energy Consumption vs Star Rating

function drawScatterPlot() {
    const container = d3.select("#scatter-plot");
    container.selectAll("*").remove();

    const width = container.node().clientWidth;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.csv("data/Ex5_TV_energy.csv").then(data => {
        data.forEach(d => {
            d.energy_consumpt = +d.energy_consumpt;
            d.star2 = +d.star2;
        });

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.star2))
            .nice()
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain(d3.extent(data, d => d.energy_consumpt))
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.star2))
            .attr("cy", d => y(d.energy_consumpt))
            .attr("r", 4)
            .attr("fill", "#4e79a7")
            .attr("opacity", 0.7);

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .attr("text-anchor", "middle")
            .text("Star Rating");

        svg.append("text")
            .attr("x", -height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Energy Consumption (kWh)");
    });
}

drawScatterPlot();
window.addEventListener("resize", () => {
    clearTimeout(window.scatterResizeTimer);
    window.scatterResizeTimer = setTimeout(drawScatterPlot, 300);
});
