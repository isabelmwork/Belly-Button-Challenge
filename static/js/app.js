const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
const dataSamples = d3.json(url);

//access the data
dataSamples.then(function(data) {
    
    //----------------------------------------------------------------------------
    //----- Data Prep -----
    //----------------------------------------------------------------------------

    //data contains names, metadata, samples
    //samples contains sample_values, otu_ids
    let samples = data.samples;

    let OTUs_vals = [];
    let OTUs_ids = [];
    //let OTUs_labels = [];

    for (row in samples) {

        //store otu_ids
        let row_otu_ids = samples[row].otu_ids;
        OTUs_ids.push(row_otu_ids);

        //store sample_values
        let row_sample_values = samples[row].sample_values;
        OTUs_vals.push(row_sample_values);

        // //store otu_labels
        // let row_labels= samples[row].otu_labels;
        // OTUs_labels.push(row_labels);
    };

    //sort by sample_values in desc order
    let samples_sorted = samples.sort((a,b) => b.sample_values - a.sample_values);
    
    //lists for storing data
    let top_10_OTUs_vals = [];
    let top_10_OTUs_ids = [];
    let dropdown_ids = [];
    //let top_10_OTUs_labels = [];

    //loop through the rows in samples
    //populate lists
    for (row in samples_sorted) {

        //store id
        let id = samples_sorted[row].id;
        dropdown_ids.push(id);

        //store top 10 otu_ids
        let otu_ids_10 = samples_sorted[row].otu_ids.slice(0,10);
        top_10_OTUs_ids.push(otu_ids_10);

        //store top 10 sample_values
        let sample_values_10 = samples_sorted[row].sample_values.slice(0,10);
        top_10_OTUs_vals.push(sample_values_10);

        //store top 10 otu_lables
        // let otu_labels_10 = samples_sorted[row].otu_labels.slice(0,10);
        // top_10_OTUs_labels.push(otu_labels_10);
    };

    //dict for storing lists
    //used for easy look up when using dropdown menu
    var all_dict = {};
    var top_10_dict = {};
    
    //select id
    //selector will store ids for dropdown menu
    let selector = d3.select("#selDataset");
    
    //loop through ids
    //populate dropdown menu and dict
    for(let i =0; i < dropdown_ids.length; i++) {
        
        //add id to dropdown menu
        selector.append("option").text(dropdown_ids[i]).property("value", dropdown_ids[i]);
        ////////////https://stackoverflow.com/questions/43121679/how-to-append-option-into-select-combo-box-in-d3

        //key = id
        //value = [[otu_ids], [sample_values]]
        top_10_dict[dropdown_ids[i]] = [top_10_OTUs_ids[i], top_10_OTUs_vals[i]];

        all_dict[dropdown_ids[i]] = [OTUs_ids[i], OTUs_vals[i]];

    };

    //----------------------------------------------------------------------------
    //----- Bar Plot -----
    //----------------------------------------------------------------------------

    //x = top_10_dict[id][sample_values]
    //reverse so that graph has largest x on top
    let bar_sample_values = top_10_dict[dropdown_ids[0]][1].reverse();

    //y = top_10_dict[id][otu_ids]
    //map so y = "OTU (otu_id)", for each otu_id
    let bar_otu_ids = top_10_dict[dropdown_ids[0]][0].reverse().map(otu => `OTU ${otu}`);

    //populate website with bar plot of id = 940 (the first id in the dropdown menu)
    let bar_data = [{
    
        x: bar_sample_values,
        y: bar_otu_ids,        
        type: "bar",
        orientation: "h"
    }];
    Plotly.newPlot("bar", bar_data);

    //----------------------------------------------------------------------------
    //----- Bubble Plot -----
    //----------------------------------------------------------------------------
    
    let bubble_sample_values = all_dict[dropdown_ids[0]][1];
    let bubble_otu_ids = all_dict[dropdown_ids[0]][0];
    
    let bubble_data = [{
        
        x: bubble_otu_ids,
        y: bubble_sample_values,
        mode: "markers",
        marker: {

            size: bubble_sample_values,
            color: bubble_otu_ids,
            colorscale: 'Earth'
            //////////https://plotly.com/javascript/colorscales/
        }
    }];
    Plotly.newPlot("bubble", bubble_data);

    //----------------------------------------------------------------------------
    //----- Update Plot -----
    //----------------------------------------------------------------------------
    
    //when new dropdown menu value is selected, run updatePlotly()
    d3.select("#selDataset").on("change", updatePlotly);
    
    //update Plotly with x, y of new dropdown menu value
    function updatePlotly() {
        
        //store dropdown_menu
        let dropdown_menu = d3.select("#selDataset");
        
        //store current dropdown_menu value selected
        let selected_id = dropdown_menu.property("value");

        //same format as bar_sample_values, bar_otu_ids
        let new_bar_sample_values = top_10_dict[selected_id][1].reverse();
        let new_bar_otu_ids = top_10_dict[selected_id][0].map(otu => `OTU ${otu}`).reverse();

        //use restyle to update bar Plotly with new x,y values
        Plotly.restyle("bar", "x", [new_bar_sample_values]);
        Plotly.restyle("bar", "y", [new_bar_otu_ids]);

        let new_bubble_sample_values = all_dict[selected_id][1];
        let new_bubble_otu_ids = all_dict[selected_id][0];

        Plotly.restyle("bubble", "x", [new_bubble_otu_ids]);
        Plotly.restyle("bubble", "y", [new_bubble_sample_values]);
    }
});

//FIX TEXT!!!


//why doesnt this work?
//console.log(samples.id);

//variables only accessible inside function
//other way?