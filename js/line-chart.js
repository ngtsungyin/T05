// js/line-chart.js
// Line chart: Spot Power Prices (1998–2024)

d3.csv("data/Ex5_ARE_Spot_Prices.csv").then(function(data) {
    data.forEach(d => {
        d.Year = +d.Year;
        d["Average Price (notTas-Snowy)"] = +d["Average Price (notTas-Snowy)"];
    });

    const margin = { top: 30, right: 30, bottom: 50, left: 60 },
          width = 600 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([0, width]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Average Price (notTas-Snowy)"])])
        .nice()
        .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d["Average Price (notTas-Snowy)"]))
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Add labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .text("Average Price ($/MWh)");
});
