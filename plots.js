function init() {
    var selector = d3.select("#selDataset");

    //this code makes a dropdown menu of id numbers dynamically (not hardcoded into html)
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
    });
}

init();

//This code is called in html by this: <select id="selDataset" onchange="optionChanged(this.value)"></select>
//newSample and this.value are the same, since this.value is being passed as the argument into optionChanged
function optionChanged(newSample) {
    console.log(newSample);
    //The demographic information panel is populated with a specific volunteer's information
    buildMetadata(newSample);
    //The volunteer's data is visualized in a separate div
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        //console.log(result)
        var PANEL = d3.select("#sample-metadata")

        PANEL.html("");
        //PANEL.append("h6").text(result.location);
        Object.entries(result).forEach(([key,value]) => {
            console.log(key, ":", value)
            PANEL.append("h6").text(`${key.toUpperCase()} : ${value}`);
        });
    })
}

