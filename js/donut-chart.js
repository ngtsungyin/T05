// Donut Chart: Energy Consumption by Screen Technology (All Sizes)

function drawDonutChart() {
    const container = d3.select("#donut-chart");
    container.selectAll("*").remove();

    const width = container.node().clientWidth;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv").then(data => {
        data.forEach(d => {
            d["Mean(Labelled energy consumption (kWh/year))"] =
                +d["Mean(Labelled energy consumption (kWh/year))"];
        });

        const color = d3.scaleOrdinal(d3.schemeSet2);

        const pie = d3.pie()
            .value(d => d["Mean(Labelled energy consumption (kWh/year))"]);

        const arc = d3.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius);

        svg.selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.Screen_Tech))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        svg.selectAll("text")
            .data(pie(data))
            .enter()
            .append("text")
            .text(d => d.data.Screen_Tech)
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .style("text-anchor", "middle")
            .style("font-size", 12);
    });
}

drawDonutChart();
window.addEventListener("resize", () => {
    clearTimeout(window.donutResizeTimer);
    window.donutResizeTimer = setTimeout(drawDonutChart, 300);
});
