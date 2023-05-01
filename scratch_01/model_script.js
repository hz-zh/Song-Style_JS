const model = await tf.loadGraphModel('./image_model/model.json');
const imageLoader = document.getElementById('imageLoader');
const image = document.getElementById('image');

imageLoader.addEventListener('change', e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const tensor = tf.browser.fromPixels(img).resizeNearestNeighbor([128, 128]).toFloat().div(tf.scalar(255));
      const prediction = model.predict(tensor);
      console.log(prediction.dataSync());
    };
    img.src = reader.result;
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});
