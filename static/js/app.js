// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata
    console.log("Metadata: ", metadata)

    // Filter the metadata for the object with the desired sample number
    let metadataSample = metadata.filter(number => number.id == sample)[0];
    console.log("MetadataSample: ", metadataSample)

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");
    console.log("Panel: ", panel)

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metadataSample).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples
    console.log("Samples: ", samples);

    // Filter the samples for the object with the desired sample number
    let dataSample = samples.filter(sampleObject => sampleObject.id == sample)[0];
    console.log("Sample Field Data: ", dataSample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = dataSample.otu_ids;
    let otu_labels = dataSample.otu_labels;
    let sample_values = dataSample.sample_values;

    console.log("otu_ids Data: ", otu_ids);
    console.log("otu_labels Data: ", otu_labels);
    console.log("sample_values Data: ", sample_values);

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      type: 'scatter',
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'Earth'
      }
    };

    let bubbleData = [trace1];

    // Render the Bubble Chart
    let bubbleLayout = {
      title: {text: 'Bacteria Cultures Per Sample'},
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'},
      showlegend: false
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = [];

    for (let i = 0; i < 10 && i < otu_ids.length; i++) {
      yticks.push(`OTU ${otu_ids[i]}`);
    }
    yticks.reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      type: 'bar',
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    };

    let barData = [trace2];

    // Render the Bar Chart
    let barLayout = {
      title: {text: 'Top 10 Bacteria Cultures Found'},
      xaxis: {title: 'Number of Bacteria'},
      margin: {l: 140, t: 30}
    };

    Plotly.newPlot('bar', barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;
    console.log("Names: ", names);

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");
    console.log("Dropdown: ", dropdown);

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      dropdown.append("option").text(names[i]).property("value", names[i]);
      }

    // Get the first sample from the list
    let firstSample = names[0];
    console.log("First Sample: ", firstSample);

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {

  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  console.log("New Sample: ",newSample);

}

// Initialize the dashboard
init();
