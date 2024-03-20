const NASA_Api = 'zNjGmzCpc4IYl4M1qYWdtTdITZ4T5XeQvFiljH91';
const UrlNasa = 'https://api.nasa.gov/planetary/apod?api_key=' + NASA_Api + '&count=3'; // Solicitar imágenes.

const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('La respuesta de la API no fue exitosa');
        }
        return await response.json();
    } catch (error) {
        console.error('Hubo un problema con la petición Fetch: ' + error.message);
        return null;
    }
};

const renderImages = (data) => {
    const carouselInner = document.querySelector('.carousel-inner');
    const imageIndex = document.getElementById('imageIndex');

    data.forEach((imageData, index) => {
        const imageUrl = imageData.url;
        const imageTitle = imageData.title;

        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
            carouselItem.classList.add('active');
        }

        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.alt = imageTitle;
        imageElement.classList.add('d-block', 'w-100');

        const carouselCaption = document.createElement('div');
        carouselCaption.classList.add('carousel-caption', 'd-none', 'd-md-block');
        carouselCaption.innerHTML = `
            <h5>${imageTitle}</h5>
            <p>${imageData.explanation}</p>
            <p><strong>Fecha de Captura:</strong> ${imageData.date}</p>
        `;

        carouselItem.appendChild(imageElement);
        carouselItem.appendChild(carouselCaption);

        carouselInner.appendChild(carouselItem);

        const indexItem = document.createElement('li');
        indexItem.classList.add('list-group-item');

        const indexLink = document.createElement('a');
        indexLink.href = `#image${index}`;
        indexLink.textContent = imageTitle;

        indexItem.appendChild(indexLink);

        imageIndex.appendChild(indexItem);
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await fetchData(UrlNasa);
        
        if (data) {
            renderImages(data);

            const carousel = new bootstrap.Carousel(document.getElementById('imageCarousel'));

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
