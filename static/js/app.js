const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
const dataSamples = d3.json(url);

dataSamples.then(function(data) {
    let samples = data.samples;

    let top_OTUs_vals = samples.sort((a,b) => b.sample_values - a.sample_values);

    let top_10_OTUs_vals = [];
    let top_10_OTUs_ids = [];

    //console.log(top_OTUs_vals);

    for (row in top_OTUs_vals) {

        sample_values_10 = top_OTUs_vals[row].sample_values.slice(0,10);
        top_10_OTUs_vals.push(sample_values_10);

        otu_ids_10 = top_OTUs_vals[row].otu_ids.slice(0,10);
        top_10_OTUs_ids.push(otu_ids_10);
    };

    //console.log(top_10_OTUs_vals);
    //console.log(top_10_OTUs_ids);

    d3.selectAll("#selDataset").on("change", updatePlotly);

    function updatePlotly() {
        let dropdownMenu = d3.select("#selDataset");
        let dataset = dropdownMenu.property("value");
        
    }
    
    // let trace1 = {
    //     x: ,
    //     y: ,
    //     type: "bar",
    //     orientation: "h"
    // };
    // let graph_data = [trace1];

    // let graph_layout = {
    //     title: "Top 10 OTUs"
    // }

    // Plotly.newPlot("plot", graph_data, graph_layout);

});



//variables only accessible inside function
//other way?