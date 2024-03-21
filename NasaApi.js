// Variables globales
const NASA_Api = 'zNjGmzCpc4IYl4M1qYWdtTdITZ4T5XeQvFiljH91';
const UrlNasa = `https://api.nasa.gov/planetary/apod?api_key=${NASA_Api}&count=10`; // Solicitar imágenes.

// Función para obtener datos de la API de la NASA
const fetchData = async (hdurl) => {
    try {
        const response = await fetch(hdurl);
        if (!response.ok) {
            throw new Error('La respuesta de la API no fue exitosa');
        }
        return await response.json();
    } catch (error) {
        console.error('Hubo un problema con la petición Fetch: ' + error.message);
        return null;
    }
};

// Función para renderizar las imágenes y el índice
const renderImages = (data) => {
    const carouselInner = document.querySelector('.carousel-inner');
    const imageIndex = document.getElementById('imageIndex');

    data.forEach((imageData, index) => {
        // Renderizar imagen en el carrusel
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
            carouselItem.classList.add('active');
        }
        carouselItem.innerHTML = `
            <img src="${imageData.hdurl}" class="d-block w-100" alt="${imageData.title}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${imageData.title}</h5>
                <p>${imageData.explanation}</p>
                <p><strong>Fecha de Captura:</strong> ${imageData.date}</p>
            </div>
        `;
        carouselInner.appendChild(carouselItem);

        // Renderizar enlace en el índice
        const indexItem = document.createElement('li');
        indexItem.classList.add('list-group-item');
        const indexLink = document.createElement('a');
        indexLink.href = `#image${index}`;
        indexLink.textContent = imageData.title;
        indexItem.appendChild(indexLink);
        imageIndex.appendChild(indexItem);
    });
};

// Evento que se dispara cuando se carga el DOM
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Obtener datos de la API de la NASA
        const data = await fetchData(UrlNasa);
        
        if (data) {
            // Renderizar imágenes y el índice
            renderImages(data);

            // Inicializar el carrusel de Bootstrap
            const carousel = new bootstrap.Carousel(document.getElementById('imageCarousel'));

            // Agregar eventos de clic para el índice
            document.querySelectorAll('#imageIndex a').forEach((link, index) => {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    carousel.to(index);

                    const imageId = `#image${index}`;
                    const targetImage = document.querySelector(imageId);
                    targetImage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });
            
        } else {
            console.error('No se pudieron obtener los datos de la API.');
        }
    } catch (error) {
        console.error('Error al cargar los datos: ' + error.message);
    }
});
