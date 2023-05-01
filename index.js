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

// train / predict from a model in TensorFlow.js.  Edit this code
// and refresh the index.html to quickly explore the API.


// Tiny TFJS train / predict example.
async function run() {
  
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
        console.log(image)
        const imageTensor = tf.browser.fromPixels(image).toFloat().resizeNearestNeighbor([128, 128]).div(255.0).expandDims(0);
        // set the first dimension of imageTensor to -1
        imageTensor[0] = -1
        console.log(imageTensor)
        tensor = tf.cast(imageTensor, 'float32')
        //console.log(tensor)

       predict(tensor)
      };
      img.src = reader.result;
      image.src = reader.result;
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
//console.log(model)
  const output = model.predict(tensor, {batchSize: 1}, true);
  //console.log(output)
  let predictionArr = []
  for (let i = 0; i < output.length; i++) {
    predictionArr.push(output[i].dataSync());
  }
  let predictions = []
  for (let i = 0; i < output.length; i++) {
    predictions.push(predictionArr[i][0]);
    console.log(predictions[i])
  }
  // reverse the order of predictions
  //predictions.reverse();
  //console.log(predictionArr)

  //find index of the highest 3 values in predictions
  //let maxPrediction = predictions.indexOf(Math.max(...predictions));
  const maxPredictions = findMaxPredictions(predictions);
  //maxPredictions.reverse()
  console.log(maxPredictions);
  const classNames = ["Arched_Eyebrows", "Bags_Under_Eyes", "Bangs", "Black_Hair", "Blond_Hair", "Brown_Hair", "Eyeglasses", "Gray_Hair", "Heavy_Makeup", "High_Cheekbones", "Mouth_Slightly_Open", "Mustache", "Narrow_Eyes", "Rosy_Cheeks", "Smiling", "Straight_Hair", "Wavy_Hair", "Wearing_Earrings", "Wearing_Hat", "Wearing_Lipstick", "Wearing_Necklace"];
  //const predictedClassName = classNames[maxPrediction];
  //console.log(predictedClassName, ": ", predictions[maxPrediction]);
  const predictedClassNames = [];
  for (let i = 0; i < maxPredictions.length; i++) {
    predictedClassNames.push(classNames[maxPredictions[i]]);
}
  const outputText = document.getElementById('output')
  /// set outputText.innerText to be all entries in predictedClassNames with a comma and a space between each
  outputText.innerText = predictedClassNames.join(', ');
  //outputText.innerText = predictedClassNames
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
