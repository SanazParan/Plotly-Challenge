
function buildMetadata(sample) {
  //var url =`/metadata/${sample}`;
  var url =`/metadata/`+ sample;
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(sample) {
  
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata= d3.select("#sample-metadata");
    //console.log(response);
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sample).forEach(([key, value]) => {
      var row = sample_metadata.append("h6");
      row.text(`${key}: ${value}`);
    })
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url =`/samples/${sample}`;
  d3.json(url).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    //* Use `otu_ids` for the x values.
    //* Use `sample_values` for the y values.
    //* Use `sample_values` for the marker size.
    //* Use `otu_ids` for the marker colors.
    //* Use `otu_labels` for the text values
      var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels, 
      mode: 'markers',
      marker: {
        color: data.otu_ids,
        size:data.sample_values
        }
    };
    var data = [trace1];
    // Define the plot layout
var layout = {
  //title: "",
  xaxis: { title: "otu_ids" },
  yaxis: { title: "sample_values" },
  width: 1000
};

  Plotly.newPlot('bubble', data, layout);  
});
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
d3.json(url).then(function(data) {

  var trace2 = {
    labels: data.otu_ids.slice(0,10),
    values: data.sample_values.slice(0,10),
    type: "pie"
  };
  var data=[trace2];
  Plotly.newPlot('pie', data);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
