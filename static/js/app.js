// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
let mresult=data.metadata;

    // Filter the metadata for the object with the desired sample number
mresult=mresult.filter(obj=>obj.id==sample);
let sresult=mresult[0];

    // Use d3 to select the panel with id of `#sample-metadata`

let panel=d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
Object.entries(sresult).forEach(([key, value])=>
  {panel.append("h6").text(`${key}:${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
sampleresult=data.samples;

    // Filter the samples for the object with the desired sample number

sampleresult=sampleresult.filter(obj=>obj.id==sample)

    // Get the otu_ids, otu_labels, and sample_values

otu_ids=sampleresult[0].otu_ids;
otu_labels=sampleresult[0].otu_labels
sample_values=sampleresult[0].sample_values

    // Build a Bubble Chart
let trace1={
  x: otu_ids,
  y: sample_values,
  text: otu_labels,
  mode:'markers', 
  marker:{color: otu_ids, opacity: 0.8, size:sample_values}
}

var data = [trace1];

var layout = {
  title: 'Bacteria Cultures Per Sample',
  xlabel: "OTU ID",
  ylabel: "Number of Bacteria",
  showlegend: false
};
    // Render the Bubble Chart
Plotly.newPlot('bubble', data, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
let yTicks= Array.isArray(otu_ids) ? otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse() : [];


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately

let trace2={
  x: sample_values.slice(0,10).reverse(),
  y: yTicks,
  text: otu_labels.slice(0,10).reverse(),
  type:'bar',
  orientation: "h"
   };


  var data2=[trace2];

  var layout2={
   title: "Top 10 Bacteria Cultures Found",
   margin: {l:100, r:100,t:100, b:100}
 };
   

    // Render the Bar Chart

    Plotly.newPlot('bar', data2, layout2);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    nameresult=data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let drodownMenu=d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    nameresult.forEach((name)=>{drodownMenu.append("option").text(name).property("value",name)});

    // Get the first sample from the list
    let firstSample=nameresult[0];
    console.log("First Sample:", firstSample);

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample)
    buildCharts(firstSample)

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
// Clear existing data and charts
d3.select("#sample-metadata").html("");
Plotly.purge('bar');
Plotly.purge('bubble');

//rebuilding new charts and metadata panel
buildMetadata(newSample);
buildCharts(newSample);
console.log("Sample:", newSample);
}

// Initialize the dashboard
init();
