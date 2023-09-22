const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
const dataSamples = d3.json(url);

//access the data
dataSamples.then(function(data) {
    
    //----------------------------------------------------------------------------
    //----- Top 10 Data Prep -----
    //----------------------------------------------------------------------------

    //data contains names, metadata, samples
    //samples contains sample_values, otu_ids
    let samples = data.samples;

    //create dict that contains all the sample data
    //all_dict[id] = []
    let all_dict = {};
    for (row in samples) {

        //grab row values, gets rid of keys
        let row_values = Object.values(samples[row]);
        //id
        let row_id = row_values.slice(0,1);
        //[otu_ids, sample_values, otu_labels]
        let row_data = row_values.slice(1,7);
        //all_dict[id] = [otu_ids, sample_values, otu_labels]
        all_dict[row_id] = row_data;
    };

    let sorted_dict = {};
    let top_10_dict = {};
    //sort based on sample_values in desc order
    let samples_sorted = samples.sort((a,b) => b.sample_values - a.sample_values);
    for (row in samples_sorted) {

        //grab row values, gets rid of keys
        let row_values = Object.values(samples_sorted[row]);
        //id
        let row_id = row_values.slice(0,1);
        //[otu_ids, sample_values, otu_labels]
        let row_data = row_values.slice(1,7);
        //all_dict[id] = [otu_ids, sample_values, otu_labels]
        sorted_dict[row_id] = row_data;

        let row_top_10 = [];
        for (let i = 0; i < 3; i++) {

            //grab top 10 for each (otu_ids, sample_values, otu_labels)
            row_top_10.push(sorted_dict[row_id][i].slice(0,10));
        };
        //top_10_dict[id] = [otu_ids, sample_values, otu_labels]
        top_10_dict[row_id] = row_top_10;
    };

    //grab all ids
    let dropdown_ids = Object.keys(all_dict);
    //grab selector
    let selector = d3.select("#selDataset");
    //populate dropdown menu with ids
    for(let i =0; i < dropdown_ids.length; i++) {
        
        selector.append("option").text(dropdown_ids[i]).property("value", dropdown_ids[i]);
        ////////////https://stackoverflow.com/questions/43121679/how-to-append-option-into-select-combo-box-in-d3
    };

    //----------------------------------------------------------------------------
    //----- Bar Plot -----
    //----------------------------------------------------------------------------

    //top_10_dict[id] = [otu_ids, sample_values, otu_labels]
    //used id = 940 as the starter id for the website
    //reverse each so that the largest value is on the top of the graph

    //make each otu_id display as "OTU otu_id"
    let bar_otu_ids = top_10_dict[940][0].reverse().map(otu => `OTU ${otu}`);
    let bar_sample_values = top_10_dict[940][1].reverse();
    let bar_otu_labels = top_10_dict[940][2].reverse();

    let bar_data = [{
    
        x: bar_sample_values,
        y: bar_otu_ids,
        text: bar_otu_labels,        
        type: "bar",
        orientation: "h"
    }];
    Plotly.newPlot("bar", bar_data);

    //----------------------------------------------------------------------------
    //----- Bubble Plot -----
    //----------------------------------------------------------------------------
    
    //want to display all the data (not just top 10) so used all_dict
    //all_dict[id] = [otu_ids, sample_values, otu_labels]

    let bubble_otu_ids = all_dict[940][0];
    let bubble_sample_values = all_dict[940][1];
    let bubble_otu_labels = all_dict[940][2];
    
    let bubble_data = [{
        
        x: bubble_otu_ids,
        y: bubble_sample_values,
        text: bubble_otu_labels,
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
    //----- Sample Metadata -----
    //----------------------------------------------------------------------------
    
    //grab metadata
    let metadata = data.metadata;
    //grab first metadata (which has id = 940) to use as starter
    let sample_metadata = metadata[0];

    let metadata_keys = Object.keys(sample_metadata);
    let metadata_values = Object.values(sample_metadata);

    let metadata_text = "";
    //want a string of the form:
    //"key: value <br> key: value <br> ..."
    for (let i = 0; i < metadata_keys.length; i++) {

        //create string of form:
        //"key: value <br>"
        let key_value_text = `${metadata_keys[i]}: ${metadata_values[i]} <br>`;
        //concat to add "key: value <br>"" to overall string
        metadata_text = metadata_text.concat(key_value_text);
    }

    //grab and populate sample_metadata
    //convert string to html so that the <br>s work
    let select_sample_metadata =  d3.select("#sample-metadata");
    select_sample_metadata.html(metadata_text);
    //////////https://stackoverflow.com/questions/70926924/can-i-inject-br-tag-into-string-and-make-it-work-as-an-actual-html-tag

    //----------------------------------------------------------------------------
    //----- Update Page -----
    //----------------------------------------------------------------------------

    //when new dropdown menu value is selected, run updatePage
    d3.select("#selDataset").on("change", updatePage);
    function updatePage() {
        
        updatePlotly();
        updateMetadata();
    };

    //----------------------------------------------------------------------------
    //----- Update Plots -----
    //----------------------------------------------------------------------------
    
    //update bar and bubble Plotlys with x, y, text of new dropdown menu value
    function updatePlotly() {
        
        //store dropdown_menu
        let dropdown_menu = d3.select("#selDataset");
        //store current dropdown_menu value selected
        let selected_id = dropdown_menu.property("value");

        //same format as bar_sample_values, bar_otu_ids
        let new_bar_otu_ids = top_10_dict[selected_id][0].map(otu => `OTU ${otu}`).reverse();
        let new_bar_sample_values = top_10_dict[selected_id][1].reverse();
        let new_bar_otu_labels = top_10_dict[selected_id][2].reverse();
        //use restyle to update bar Plotly with new x,y values and text
        Plotly.restyle("bar", "x", [new_bar_sample_values]);
        Plotly.restyle("bar", "y", [new_bar_otu_ids]);
        Plotly.restyle("bar", "text", [new_bar_otu_labels]);

        let new_bubble_otu_ids = all_dict[selected_id][0];
        let new_bubble_sample_values = all_dict[selected_id][1];
        let new_bubble_otu_labels = all_dict[selected_id][2].reverse();
        Plotly.restyle("bubble", "x", [new_bubble_otu_ids]);
        Plotly.restyle("bubble", "y", [new_bubble_sample_values]);
        Plotly.restyle("bubble", "text", [new_bubble_otu_labels]);
        
        var marker_update = {

            size: new_bubble_sample_values,
            color: new_bubble_otu_ids,
            colorscale: 'Earth'
            //////////https://plotly.com/javascript/colorscales/
        };
        Plotly.restyle("bubble", "marker", marker_update);
        
    }

    //----------------------------------------------------------------------------
    //----- Update Metadata -----
    //----------------------------------------------------------------------------

    //create and populate dict with metadata info
    //key = id
    //values = ethnicity, gender, ...
    let metadata_dict = {};
    for (row in metadata) {
        //id
        let meta_id =  Object.values(metadata[row]).slice(0,1)[0];
        //other data (ethnicity, gender, ...)
        let meta_vals =  Object.values(metadata[row]).slice(1,7);
        metadata_dict[meta_id] = meta_vals;
    };

    function updateMetadata() {
        //grab new id
        let selected_id = d3.select("#selDataset").property("value");
        //grab corresponding metadata
        let new_metadata = metadata_dict[selected_id];
        //grab keys
        let key_names = Object.keys(metadata[0]);

        //same concept as original metadata string
        let new_metadata_text = `${key_names[0]}: ${selected_id} <br>`;
        for (let i = 1; i < key_names.length; i++) {

            let new_text = `${key_names[i]}: ${new_metadata[i]} <br>`;
            new_metadata_text = new_metadata_text.concat(new_text);
        }
        
        select_sample_metadata.html(new_metadata_text);
    };
});
