console.log("Hello")

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    console.log(data)
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Bar and Bubble charts
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data)
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    // 5. Create a variable that holds the first sample in the array.
    var samplesResult = samplesArray.filter(sampleObj => sampleObj.id == sample)[0];
    console.log(samplesResult)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids_var = samplesResult.otu_ids;
    console.log(otu_ids_var)
    var otu_labels_var = samplesResult.otu_labels;
    var sample_values_var = samplesResult.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    tenSortedIds = otu_ids_var.slice(0,10).map(otu => `OTU ${otu}`).reverse();
    //map(id => ).reverse().slice(0,10);
    console.log(tenSortedIds)
    var yticks = tenSortedIds
    var xvalues = sample_values_var.slice(0,10).reverse()
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xvalues,
      y: yticks,
      type: "bar",
      text: otu_labels_var,
      orientation: "h"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title : "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [ {
      x : otu_ids_var,
      y : sample_values_var,
      text : otu_labels_var, 
      mode : "markers",
      marker : {size: sample_values_var,
                color: otu_ids_var,
                colorscale: 'Earth'}
    
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title : "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      height: 500,
      width: 1000,
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
    // 4. Create the trace for the gauge chart.
    var metadataObj = data.metadata.filter(person => person.id ==sample)[0];
    var washFrequency = parseFloat(metadataObj.wfreq);
    console.log(`wash frequency is: ${washFrequency}`)

    var gaugeData = [ {
      value : washFrequency,
      type : "indicator",
      mode : "gauge+number", 
      gauge: { axis: { range: [null, 10]}, 
               bar: { color: "black" },
               steps: [
                  { range: [0, 2], color: "red" },
                  { range: [2, 4], color: "orange" },
                  { range: [4, 6], color: "yellow" },
                  { range: [6, 8], color: "yellowgreen" },
                  { range: [8, 10], color: "green" },
                ]
              }
      //title: "Scrubs per Week"
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      title : "<b>Belly Button Washing Frequency</b><br>Scrubs per Week</br>", "titlefont": {
        "size": 20
      }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });

}
