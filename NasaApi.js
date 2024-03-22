// Variables globales
const NASA_Api = 'zNjGmzCpc4IYl4M1qYWdtTdITZ4T5XeQvFiljH91';
const UrlNasa = `https://api.nasa.gov/planetary/apod?api_key=${NASA_Api}&count=10`; // Solicitar imágenes.
let imageData; // Variable global para almacenar los datos de las imágenes

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

// Función para obtener la traducción de la explicación de la imagen
const fetchTranslatedExplanation = async (explanation) => {
    try {
        const response = await fetch('https://rapidapi.p.rapidapi.com/language/translate/v2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
                'x-rapidapi-key': '481464685cmsh0012ff715b6643ap1575acjsn23660fd1a2f9'
            },
            body: JSON.stringify({
                q: explanation,
                target: 'en',
                source: 'es'
            })
        });
        const data = await response.json();
        return data.data.translations[0].translatedText;
    } catch (error) {
        console.error('Hubo un problema al traducir la explicación: ' + error.message);
        return explanation; // Si hay un error, devolver la explicación original
    }
};

// Función para renderizar las imágenes y el índice
const renderImages = async (data) => {
    const carouselInner = document.querySelector('.carousel-inner');
    const imageIndex = document.getElementById('imageIndex');

    for (let i = 0; i < data.length; i++) {
        const imageData = data[i];

        // Obtener la explicación traducida
        const translatedExplanation = await fetchTranslatedExplanation(imageData.explanation);

        // Renderizar imagen en el carrusel
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (i === 0) {
            carouselItem.classList.add('active');
        }
        carouselItem.innerHTML = `
            <img src="${imageData.hdurl}" class="d-block w-100" alt="${imageData.title}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${imageData.title}</h5>
                <p>${translatedExplanation}</p>
                <p><strong>Fecha de Captura:</strong> ${imageData.date}</p>
            </div>
        `;
        carouselInner.appendChild(carouselItem);

        // Renderizar enlace en el índice
        const indexItem = document.createElement('li');
        indexItem.classList.add('list-group-item');
        const indexLink = document.createElement('a');
        indexLink.href = `#image${i}`;
        indexLink.textContent = imageData.title;
        indexItem.appendChild(indexLink);
        imageIndex.appendChild(indexItem);
    }

    // Agregar eventos de clic para el índice nuevamente
    document.querySelectorAll('#imageIndex a').forEach((link, index) => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const carousel = new bootstrap.Carousel(document.getElementById('imageCarousel'));
            carousel.to(index);

            const imageId = `#image${index}`;
            const targetImage = document.querySelector(imageId);
            targetImage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
};

// Función para realizar la búsqueda de imágenes utilizando los títulos disponibles
const searchImagesByTitle = async () => {
    try {
        // Obtener el término de búsqueda ingresado por el usuario
        const searchTerm = searchInput.value.trim().toLowerCase();

        // Filtrar las imágenes disponibles utilizando el término de búsqueda
        const filteredData = imageData.filter(image => image.title.toLowerCase().includes(searchTerm));

        // Limpiar el carrusel y el índice antes de renderizar los nuevos resultados
        const carouselInner = document.querySelector('.carousel-inner');
        carouselInner.innerHTML = '';
        const imageIndex = document.getElementById('imageIndex');
        imageIndex.innerHTML = '';

        // Renderizar las imágenes de los resultados de la búsqueda
        if (filteredData.length > 0) {
            renderImages(filteredData);
        } else {
            // Si no se encuentran resultados, renderizar todas las imágenes
            renderImages(imageData);
        }
    } catch (error) {
        console.error('Error al realizar la búsqueda: ' + error.message);
    }
};
// Función para volver al estado inicial (Mostrar todas las imágenes)
const showAllImages = async () => {
    try {
        // Limpiar el campo de búsqueda
        searchInput.value = '';

        // Limpiar el carrusel y el índice antes de renderizar los nuevos resultados
        const carouselInner = document.querySelector('.carousel-inner');
        carouselInner.innerHTML = '';
        const imageIndex = document.getElementById('imageIndex');
        imageIndex.innerHTML = '';

        // Renderizar todas las imágenes
        renderImages(imageData);
        
        // Agregar eventos de clic para el índice nuevamente
        document.querySelectorAll('#imageIndex a').forEach((link, index) => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const carousel = new bootstrap.Carousel(document.getElementById('imageCarousel'));
                carousel.to(index);

                const imageId = `#image${index}`;
                const targetImage = document.querySelector(imageId);
                targetImage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // Reasignar los eventos de clic para el botón de búsqueda
        const searchButton = document.getElementById('searchButton');
        searchButton.addEventListener('click', searchImagesByTitle);
        
    } catch (error) {
        console.error('Error al mostrar todas las imágenes: ' + error.message);
    }
};

// Evento que se dispara cuando se carga el DOM
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Obtener datos de la API de la NASA
        const data = await fetchData(UrlNasa);
        const searchInput = document.getElementById('searchInput');
        const homeButton = document.getElementById('homeButton');
        const searchButton = document.getElementById('searchButton');

        if (data) {
            // Almacenar los datos de la API de la NASA en una variable global
            imageData = data;

            // Renderizar imágenes y el índice
            await renderImages(data);

            // Inicializar el carrusel de Bootstrap con una velocidad de transición más lenta
            const carousel = new bootstrap.Carousel(document.getElementById('imageCarousel'), {
                interval: 8000 // Cambia el valor según sea necesario (en milisegundos)
            });

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

            // Agregar event listener al botón de búsqueda
            searchButton.addEventListener('click', searchImagesByTitle);

            // Agregar event listener al botón de inicio
            homeButton.addEventListener('click', showAllImages);

            // Event listener para la tecla Enter en el input de búsqueda
            searchInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    searchImagesByTitle();
                }
            });
            
        } else {
            console.error('No se pudieron obtener los datos de la API.');
        }
    } catch (error) {
        console.error('Error al cargar los datos: ' + error.message);
    }
});


