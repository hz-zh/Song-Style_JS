/**
 * @license
 * Copyright 2023 Henry Zelenak. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http:// www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ==============================================================================
 */


//import * as tf from './node_modules/@tensorflow/tfjs';
function run() {
  
  const imageLoader = document.getElementById('file-upload');
  const image = document.getElementById('image');

  imageLoader.addEventListener('change', e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Load the image
        //const imageElement = document.getElementById('image');
        //console.log(image)
        image.src = reader.result;
        const imageTensor = tf.browser.fromPixels(image).toFloat().resizeNearestNeighbor([128, 128]).div(255.0).expandDims(0);
        // set the first dimension of imageTensor to -1
        //imageTensor[0] = -1
        //console.log(imageTensor.dataSync())
        // convert imageTensor to an image and render it to the page
        
       // tensor = tf.cast(imageTensor, 'float32')
        //console.log(imageTensor)
       imageTensor[0] = -1
       predict(imageTensor)
      };
      img.src = reader.result;
      //image.src = reader.result;
    };  
    reader.readAsDataURL(file);
}); 

}
run();


async function predict(tensor) {
  
  tf.ENV.set("WEBGL_PACK", false);
  const model = await tf.loadGraphModel('./image_models/model_02/model.json');
 // tfvis.show.modelSummary({name: 'Model Summary'}, model);
// test to see if the model is loaded properly
//console.log(model.summary())
  const output = model.predict(tensor, {batchSize: 1}, true);
  console.log(output)
  let predictionArr = []
  for (let i = 0; i < output.length; i++) {
    predictionArr.push(output[i].dataSync());
  }
  let predictions = []
  for (let i = 0; i < output.length; i++) {
    predictions.push(predictionArr[i][0]);
    console.log(predictions[i])
  }
  outputMaker(predictions);
}

function outputMaker(predictions) {
  // make a copy of predictions
  const predictionsCopy = predictions.slice();

  // find index of the highest 5 values in predictions
  const maxPredictions = findMaxPredictions(predictionsCopy);
 
  // old class order
  /*const classNames = ["Arched_Eyebrows", "Bags_Under_Eyes", "Bangs", "Black_Hair", "Blond_Hair", "Brown_Hair", "Eyeglasses", "Gray_Hair", "Heavy_Makeup", "High_Cheekbones", "Mouth_Slightly_Open", "Mustache", "Narrow_Eyes", "Rosy_Cheeks", "Smiling", "Straight_Hair", "Wavy_Hair", "Wearing_Earrings", "Wearing_Hat", "Wearing_Lipstick", "Wearing_Necklace"];*/
  // new class order
  const classNames = ["Straight Hair", "High Cheekbones", "Mustache", "Wearing Hat", "Wavy Hair", "Eyeglasses", "Rosy Cheeks", "Mouth Slightly Open", "Bags Under Eyes", "Black Hair", "Wearing Lipstick", "Narrow Eyes", "Wearing Earrings", "Wearing Necklace", "Gray Hair", "Arched Eyebrows", "Smiling", "Bangs", "Heavy Makeup", "Brown Hair", "Blond Hair"];

  const outputTable = document.getElementById('outputTable');
      const tbody = outputTable.getElementsByTagName('tbody')[0];
      tbody.innerHTML = '';
      
      for (let i = 0; i < maxPredictions.length; i++) {
        const index = maxPredictions[i];
        const className = classNames[index];
        const percentage = (predictions[index] * 100).toFixed(2);
        
        const row = document.createElement('tr');
        const classNameCell = document.createElement('td');
        const percentageCell = document.createElement('td');
        
        classNameCell.textContent = className;
        percentageCell.textContent = percentage + '%';
        
        row.appendChild(classNameCell);
        row.appendChild(percentageCell);
        tbody.appendChild(row);
      }
    
  /*
  const predictedClassNames = [];
  for (let i = 0; i < maxPredictions.length; i++) {
    predictedClassNames.push(classNames[maxPredictions[i]]);
  }

  const outputText = document.getElementById('output')
  // set outputText.innerText to be all entries in predictedClassNames followed by maxPredictions[i] with a comma and a space between each
  console.log(predictions[0])

  let outputArr = [];
  for (let i = 0; i < 5; i++) {
    outputArr.push(predictedClassNames[i] + ": " +  (predictions[maxPredictions[i]] * 100).toFixed(2) + "%");
  }
  outputText.innerText = outputArr.join(", "); 
  */
}


function findMaxPredictions(arr) {
  const maxPredictions = [];
  
  // Find the index of the 5 highest numbers in the array
  for (let i = 0; i < 5; i++) {
    let maxIndex = 0;
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] > arr[maxIndex]) {
        maxIndex = j;
      }
    }
    maxPredictions.push(maxIndex);
    arr[maxIndex] = -Infinity; // Set the value to -Infinity to exclude it from the next iteration
  }
  return maxPredictions;
}
