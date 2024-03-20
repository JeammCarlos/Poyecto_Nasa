const NASA_Api = 'zNjGmzCpc4IYl4M1qYWdtTdITZ4T5XeQvFiljH91';
const UrlNasa = 'https://api.nasa.gov/planetary/apod?api_key=' + NASA_Api;

fetch(UrlNasa)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Hubo un problema con la petición Fetch:' + error.message);
  });