// Define the URL for your data
const dataURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


function init() {
    
    d3.json(dataURL)
        .then(function(data) {
            
            const individualIDs = data.names;
            const selectDataset = document.getElementById("selDataset");
            
            individualIDs.forEach(function(id) {
                const option = document.createElement("option");
                option.text = id;
                option.value = id;
                selectDataset.appendChild(option);
            });
            
            
            updateDashboard(individualIDs[0], data);
            updateBubbleChart(individualIDs[0], data);
            updateGaugeChart(individualIDs[0],data)
        })
        .catch(function(error) {
            console.error("Error loading data:", error);
        });
}


function updateDashboard(selectedID, data) {
    
    const metadataPanel = document.getElementById("sample-metadata");
    const selectedMetadata = data.metadata.find(metadata => metadata.id == selectedID);

   
    metadataPanel.innerHTML = "";

    
    for (const [key, value] of Object.entries(selectedMetadata)) {
        const metadataItem = document.createElement("p");
        metadataItem.innerHTML = `<strong>${key}:</strong> ${value}`;
        metadataPanel.appendChild(metadataItem);
    }

    
    const selectedSample = data.samples.find(sample => sample.id == selectedID);

    const otuIds = selectedSample.otu_ids.slice(0, 10).reverse();
    const sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
    const otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();

    const trace = {
        x: sampleValues,
        y: otuIds.map(id => `OTU ${id}`),
        text: otuLabels,
        type: "bar",
        orientation: "h"
    };

    const layout = {
        title: `Top 10 OTUs for Test Subject ${selectedID}`,
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU ID" }
    };

    
    Plotly.purge("bar");

    
    Plotly.newPlot("bar", [trace], layout);
}


function updateBubbleChart(selectedID, data) {
    
    const selectedSample = data.samples.find(sample => sample.id == selectedID);

  
    const trace = {
    x: selectedSample.otu_ids,
    y: selectedSample.sample_values,
    text: selectedSample.otu_labels,
    mode: 'markers',
    marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: 'Viridis',
        opacity: 0.6
    }
};


const layout = {
    title: `Bubble Chart for Test Subject ${selectedID}`,
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Values' }
};


    
    Plotly.purge('bubble');

    
    Plotly.newPlot('bubble', [trace], layout);
}


function updateGaugeChart(selectedID, data) {
    
    const selectedMetadata = data.metadata.find(metadata => metadata.id == selectedID);

    
    const washingFrequency = selectedMetadata.wfreq;

    const trace = {
        type: "indicator",
        mode: "gauge+number+delta+needle",
        value: washingFrequency,
        title: { text: "Weekly Washing Frequency", font: { size: 24 } },
        gauge: {
            axis: { range: [0, 9] }, 
            steps: [
                { range: [0, 1], color: "red" },
                { range: [1, 2], color: "orange" },
                { range: [2, 3], color: "yellow" },
                { range: [3, 4], color: "lightgreen" },
                { range: [4, 5], color: "CYAN" },
                { range: [5, 6], color: "blue" },
                { range: [6, 7], color: "black" },
                { range: [7, 8], color: "grey" },
                { range: [8, 9], color: "MAGENTA" },
            ],
            threshold: {
                line: { color: "purple", width: 8 },
                thickness: 0.75,
                value: washingFrequency,}
        },
    };
    const layout = {
        
        width: 400,
        height: 300,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        
        needle: {
            value: 5,          
            type: "arrow",     
            width: 2           
        }
        
        
    };

    
    Plotly.purge("gauge");
    Plotly.newPlot("gauge", [trace], layout);
}

function optionChanged(selectedValue) {
    d3.json(dataURL)
        .then(function(data) {
            updateDashboard(selectedValue, data);
            updateBubbleChart(selectedValue, data);
            updateGaugeChart(selectedValue, data); 
        })
        .catch(function(error) {
            console.error("Error loading data:", error);
        });
}

init();





