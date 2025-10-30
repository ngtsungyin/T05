// Bar Chart: Energy Consumption for 55-inch TVs

function drawBarChart() {
    const container = d3.select("#bar-chart");
    container.selectAll("*").remove();

    const width = container.node().clientWidth;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv").then(data => {
        data.forEach(d => {
            d["Mean(Labelled energy consumption (kWh/year))"] =
                +d["Mean(Labelled energy consumption (kWh/year))"];
        });

        const x = d3.scaleBand()
            .domain(data.map(d => d.Screen_Tech))
            .range([margin.left, width - margin.right])
            .padding(0.3);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d["Mean(Labelled energy consumption (kWh/year))"])])
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.Screen_Tech))
            .attr("y", d => y(d["Mean(Labelled energy consumption (kWh/year))"]))
            .attr("width", x.bandwidth())
            .attr("height", d => height - margin.bottom - y(d["Mean(Labelled energy consumption (kWh/year))"]))
            .attr("fill", "#f28e2b");
    });
}

drawBarChart();
window.addEventListener("resize", () => {
    clearTimeout(window.barResizeTimer);
    window.barResizeTimer = setTimeout(drawBarChart, 300);
});
