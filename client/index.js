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
// index.js //


async function predict(tensor) {
  const loadingWheel = document.createElement("div");
  loadingWheel.classList.add("loading-wheel");
  document.querySelector(".left-col").appendChild(loadingWheel);
  
  tf.ENV.set("WEBGL_PACK", false);
  const model = await tf.loadGraphModel('./image_models/model_02/model.json');
  
  const output = model.predict(tensor, {batchSize: 1}, true);
  let predictionArr = []
  for (let i = 0; i < output.length; i++) {
    predictionArr.push(output[i].dataSync());
  }
  let predictions = []
  for (let i = 0; i < output.length; i++) {
    predictions.push(predictionArr[i][0]);
  }
  loadingWheel.remove();
  outputMaker(predictions);
}

function outputMaker(predictions) {
  // make a copy of predictions
  const predictionsCopy = predictions.slice();

  // find index of the highest 5 values in predictions
  const maxPredictions = findMaxPredictions(predictionsCopy);

  // class order
  const classNames = ["Straight Hair", "High Cheekbones", "Mustache", "Wearing Hat", "Wavy Hair", "Eyeglasses", "Rosy Cheeks", "Mouth Slightly Open", "Bags Under Eyes", "Black Hair", "Wearing Lipstick", "Narrow Eyes", "Wearing Earrings", "Wearing Necklace", "Gray Hair", "Arched Eyebrows", "Smiling", "Bangs", "Heavy Makeup", "Brown Hair", "Blond Hair"];

  const tableContainer = document.getElementById('table-container');

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
     tableContainer.style.opacity = 1;
     tableContainer.classList.add('show');    
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

async function checkLoginStatus() {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    console.log('No JWT found; user is not logged in');
    throw new Error('No JWT found; user is not logged in');
  }
  else try {
    console.log(`JWT: ${jwt}`)
    const response = await fetch('http://localhost:5557/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${jwt}`
      }
    });
    const data = await response.json();
    if (data.ok) {
      console.log('User is logged in: ' + data.message)
      return true;
    }
    else {
      alert('Please login to continue');
      // un-comment the line below to redirect to login page
      //window.location.href = './login.html';
      if (jwt) {
        localStorage.removeItem('jwt');
      }
      throw new Error(data.message)
    }
  } catch (error) {
    console.error('Error checking login status: ', error);
    return false;
  }
}

function run() {
  const tableContainer = document.getElementById('table-container');
  const imageLoader = document.getElementById('file-upload');
  const image = document.getElementById('image');
  const loginOut = document.getElementById('login-out-button');

  if (!localStorage.getItem('jwt')) {
    loginOut.textContent = 'Login';
  } 
  else if (!checkLoginStatus()) {
    loginOut.textContent = 'Login';
  }
  else {
    loginOut.textContent = 'Logout';
  }

  loginOut.addEventListener('click', e => {
    if (loginOut.textContent === 'Login') {
      window.location.href = './login.html';
    }
    else if (loginOut.textContent === 'Logout') {
      localStorage.removeItem('jwt');
      loginOut.textContent = 'Login';
    }
  });
 
  imageLoader.addEventListener('change', e => {
    checkLoginStatus();

    tableContainer.style.opacity = 0;
    tableContainer.classList.remove('show');
    image.style.opacity = 0;

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        image.src = reader.result;
        image.style.opacity = 1;
        const imageTensor = tf.browser.fromPixels(image).toFloat().resizeNearestNeighbor([128, 128]).div(255.0).expandDims(0);
     
       imageTensor[0] = -1
       predict(imageTensor)
      };
      img.src = reader.result;
    };  
    reader.readAsDataURL(file);
  }); 
}
run();