

document.addEventListener("DOMContentLoaded", () => {
    const carousel3Dswiper = new Swiper(".carousel-3D-swiper", {
        loop: true,
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 3,
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 500,
            modifier: 1,
            slideShadows: false
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        speed: 700,
    });

    // Establecer la primera imagen como activa al inicio
    const slides = document.querySelectorAll('.carousel-3D-swiper .swiper-slide img');
    if (slides.length > 0) {
        slides[0].classList.add('active-image'); // Agregar la clase a la primera imagen
        slides[0].style.opacity = '1'; // Restaurar opacidad de la primera imagen
    }
    
    carousel3Dswiper.on('slideChange', () => {
        const slides = document.querySelectorAll('.carousel-3D-swiper .swiper-slide img');
        slides.forEach((img, index) => {
            img.classList.remove('active-image'); // Quitar la clase de todas las imágenes
            img.style.opacity = '0.2'; // Reducir opacidad de las imágenes no activas
        });
        const activeSlide = slides[carousel3Dswiper.activeIndex];
        if (activeSlide) {
            activeSlide.classList.add('active-image'); // Agregar la clase a la imagen activa
            activeSlide.style.opacity = '1'; // Restaurar opacidad de la imagen activa
        }

        // Establecer opacidad para la imagen anterior y siguiente
        const prevIndex = (carousel3Dswiper.activeIndex - 1 + slides.length) % slides.length;
        const nextIndex = (carousel3Dswiper.activeIndex + 1) % slides.length;
        slides[prevIndex].style.opacity = '0.7'; // Opacidad de la imagen anterior
        slides[nextIndex].style.opacity = '0.7'; // Opacidad de la imagen siguiente
    });
});


let map;


    function updateHref() {
        const botonBajada2 = document.querySelector('#botonBajada2 a');
        if (window.innerWidth < 768) { // Cambia el valor según el tamaño de pantalla deseado
            botonBajada2.setAttribute('href', '#cabanas');
        } else {
            botonBajada2.setAttribute('href', '#recinto');
        }
    }

    window.addEventListener('resize', updateHref);
    window.addEventListener('load', updateHref);


document.querySelectorAll('.togglePanoramas').forEach(toggle => {
    let isAnimating = false;
    const sidebar = document.getElementById('sidebarPanoramas');
    const ul = sidebar.querySelector('ul');
    const items = Array.from(ul.children);
    
    // Guardar posición original
    const originalIndexes = new Map(items.map((item, index) => [item, index]));

    toggle.addEventListener('click', async (event) => {
        event.stopPropagation(); // Prevent the click from propagating to the document

        if (isAnimating) return;
        isAnimating = true;

        const currentItem = toggle.parentElement;
        const dropdown = toggle.nextElementSibling;
        const wasActive = currentItem.classList.contains('active-item');

        if (window.innerWidth < 768) { // Only on medium and small screens
            if (!wasActive) {
                // Hide the existing content inside the aside
                const originalContent = Array.from(sidebar.children);
                originalContent.forEach(child => child.style.display = 'none');

                // Create a new container
                const newContainer = document.createElement('div');
                newContainer.classList.add('new-container');
                newContainer.style.display = 'flex';
                
                newContainer.style.alignItems = 'center';
                newContainer.style.justifyContent = 'space-between';
                newContainer.style.width = '100%';
                newContainer.style.height = '100%'; // Ensure it fills the aside
                newContainer.style.position = 'relative'; // Position relative to the aside
                newContainer.style.backgroundColor = 'white'; // Set a background color

                // Create arrows
                const leftArrow = document.createElement('button');
                leftArrow.innerHTML = '<';
                leftArrow.classList.add('arrow');
                leftArrow.style.cursor = 'pointer';

                const rightArrow = document.createElement('button');
                rightArrow.innerHTML = '>';
                rightArrow.classList.add('arrow');
                rightArrow.style.cursor = 'pointer';

                // Create items container
                const itemsContainer = document.createElement('div');
                itemsContainer.classList.add('items-container'); // Add class for styling
                itemsContainer.style.display = 'flex';
                itemsContainer.style.overflowX = 'auto';
                itemsContainer.style.flexGrow = '1';

                // Add the li elements associated with the dropdown
                const dropdownItems = Array.from(dropdown.querySelectorAll('li'));
                dropdownItems.forEach(item => {
                    const clone = item.cloneNode(true);
                    clone.style.flex = '0 0 auto'; // Align horizontally
                    clone.style.listStyle = 'none'; // Remove bullet points
                    itemsContainer.appendChild(clone);
                });

                // Add arrows and items to the new container
                newContainer.appendChild(leftArrow);
                newContainer.appendChild(itemsContainer);
                newContainer.appendChild(rightArrow);

                // Append new container to the aside
                sidebar.appendChild(newContainer);

                // Add functionality to arrows
                leftArrow.addEventListener('click', () => {
                    itemsContainer.scrollBy({
                        left: -itemsContainer.clientWidth,
                        behavior: 'smooth'
                    });
                });

                rightArrow.addEventListener('click', () => {
                    itemsContainer.scrollBy({
                        left: itemsContainer.clientWidth,
                        behavior: 'smooth'
                    });
                });

                // Restore original content when clicking outside the aside
                document.addEventListener('click', function restoreContent(e) {
                    if (!sidebar.contains(e.target)) {
                        newContainer.remove();
                        originalContent.forEach(child => child.style.display = '');
                        document.removeEventListener('click', restoreContent);
                    }
                });
            }
        } else {
            // Large screen functionality (unchanged)
            if (!wasActive) {
                // Fase de apertura
                currentItem.classList.add('active-item');
                
                // 1. Ocultar otros elementos
                items.forEach(item => {
                    if (item !== currentItem) {
                        item.style.transform = 'translateX(-100%)';
                        item.style.opacity = '0';
                    }
                });

                // 2. Mover elemento al tope
                ul.prepend(currentItem);
                
                // 3. Abrir dropdown después de 200ms
                setTimeout(() => {
                    dropdown.style.maxHeight = `${dropdown.scrollHeight}px`;
                    dropdown.style.opacity = '1';
                }, 200);
                
            } else {
                // Fase de cierre
                // 1. Cerrar dropdown inmediatamente
                dropdown.style.maxHeight = '0';
                dropdown.style.opacity = '0';
                
                // 2. Esperar 100ms y mover elemento a posición original
                setTimeout(() => {
                    currentItem.classList.remove('active-item');
                    const targetPosition = items[originalIndexes.get(currentItem)];
                    ul.insertBefore(currentItem, targetPosition.nextSibling);
                    
                    // 3. Restaurar otros elementos después de 200ms
                    setTimeout(() => {
                        items.forEach(item => {
                            item.style.transform = 'translateX(0)';
                            item.style.opacity = '1';
                        });
                    }, 200);
                }, 100);
            }
        }

        // Resetear estado
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const mensajes = [
        "Date un respiro",
        "Disfruta de panoramas",
        "Encuéntrate con la naturaleza"
    ];
    
    const inicioCarrusel = () => {
        const imgCarrusel = [
            document.getElementById('imgCarrusel1'),
            document.getElementById('imgCarrusel2'),
            document.getElementById('imgCarrusel3')
        ];

        const textoDinamico = document.getElementById('textoDinamico'); // Elemento para mostrar mensajes
        let currentIndex = 0; // Índice de la imagen actual
        const duration = 5000; // Duración de cada transición (zoom y opacidad)
        const durationOut = 500;

        const showImageAndMessage = (currentIndex, nextIndex) => {
            const currentImg = imgCarrusel[currentIndex];
            const nextImg = imgCarrusel[nextIndex];

            // Imagen actual: Desaparece (fade-out y zoom-out)
            currentImg.style.transition = `transform ${durationOut}ms , opacity ${durationOut}ms `;
            currentImg.style.transform = 'scale(1.2)';
            currentImg.style.opacity = '0';

            // Mensaje actual: Desaparece
            textoDinamico.classList.remove('animate-slide-in');
            textoDinamico.classList.add('animate-slide-out');

            // Imagen siguiente: Aparece (fade-in y zoom-in)
            nextImg.style.transition = `transform ${duration}ms, opacity ${durationOut}ms `;
            nextImg.style.transform = 'scale(1)';
            nextImg.style.opacity = '1';

            // Mensaje siguiente: Aparece
            setTimeout(() => {
                textoDinamico.textContent = mensajes[nextIndex]; // Cambiar el mensaje
                textoDinamico.classList.remove('animate-slide-out');
                textoDinamico.classList.add('animate-slide-in');
            }, durationOut); // Esperar a que la imagen actual desaparezca
        };

        const cycleImages = () => {
            const nextIndex = (currentIndex + 1) % imgCarrusel.length; // Siguiente imagen
            showImageAndMessage(currentIndex, nextIndex);
            currentIndex = nextIndex; // Actualizar índice
            setTimeout(cycleImages, duration); // Iniciar siguiente transición
        };

        cycleImages(); // Iniciar el ciclo
    };

    inicioCarrusel();
});






//FUNCION MENU HAMBURGUESA

const menuHamburguesa = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuHamburguesa.addEventListener('click', () => {
    // Alternar el menú
    if (mobileMenu.classList.contains('max-h-0')) {
        mobileMenu.classList.remove('max-h-0'); // Mostrar el menú
        mobileMenu.classList.add('max-h-screen'); // Permitir que se expanda
    } else {
        mobileMenu.classList.remove('max-h-screen'); // Ocultar el menú
        mobileMenu.classList.add('max-h-0'); // Colapsar el menú
    }
});

// Cerrar el menú móvil al hacer clic en un enlace
const menuLinks = document.querySelectorAll('.menuMob');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('max-h-0'); // Cierra el menú
        mobileMenu.classList.add('max-h-0'); // Colapsar el menú
        mobileMenu.classList.remove('max-h-screen'); // Asegúrate de que no se muestre
    });
});


/* FUNCION PARA NAVBAR */
document.addEventListener('DOMContentLoaded', () => {
    const navbarLinks = document.querySelectorAll('#navbar a, #navbar2 a,#botonBanner, #botonPopup, #mobile-menu a, #botonBajada a, #botonBajada2 a'); // Selecciona todos los enlaces del navbar y el botón con ID

    navbarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Evitar el comportamiento predeterminado del enlace
            console.log(`Clicked link: ${this.getAttribute('href')}`); // Verificar el clic

            const targetId = this.getAttribute('href'); // Obtiene el ID del destino
            const targetElement = document.querySelector(targetId); // Selecciona el elemento destino
            
            // Verificar si el elemento de destino existe
            if (!targetElement) {
                console.error(`Elemento no encontrado: ${targetId}`);
                return; // Salir si el elemento no existe
            }
            
            const navbar = document.getElementById("navbar");
            let navbarHeight = navbar ? navbar.offsetHeight : 0; // Cambiar a let para permitir la reasignación
            
            // Establecer navbarHeight en 40 solo si el enlace tiene la clase 'animate-bounce'
            if (link.classList.contains('animate-bounce')) {
                navbarHeight = 40; // Asignar 40 si tiene la clase
            }   

            // Verificar si el enlace pertenece a navbar2
            if (this.closest('#navbar2')) {
                navbarHeight = navbar.offsetHeight; // Usar la altura del navbar
            }

            // Verificar si el h2 existe antes de calcular la posición
            const h2Element = targetElement.querySelector('h2'); // Selecciona el h2 dentro de la sección
            if (!h2Element) {
                console.error(`Elemento h2 no encontrado en: ${targetId}`);
                return; // Salir si el h2 no existe
            }
            
            // Calcula la posición del h2 ajustada por el alto de la navbar
            const targetPosition = h2Element.getBoundingClientRect().top + window.pageYOffset; 
            
            // Asegúrate de que el h2 esté visible en la parte superior del viewport
            const adjustedPosition = targetPosition - navbarHeight - 20; // Ajusta la posición para que el h2 quede visible (20px de margen)

            const startPosition = window.pageYOffset; // Posición actual del scroll
            const distance = adjustedPosition - startPosition; // Distancia a recorrer
            const duration = 800; // Duración de la animación en milisegundos
            let startTime = null;

            console.log(`Target Position: ${adjustedPosition}, Start Position: ${startPosition}, Distance: ${distance}`);

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1); // Progreso de la animación
                const ease = easeInOutCubic(progress); // Función de easing
                window.scrollTo(0, startPosition + distance * ease); // Desplaza la ventana ajustada por el alto de la navbar
                if (timeElapsed < duration) requestAnimationFrame(animation); // Continúa la animación
            }

            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // Nueva función de easing
            }

            requestAnimationFrame(animation); // Inicia la animación
        });
    });
});




//funciones de manejo de mapa recinto

function isPointInside(area, px, py) {
    const { minX, maxX, minY, maxY } = area.bounds;
    return px >= minX && px <= maxX && py >= minY && py <= maxY;
}

class Area {
    constructor(id, x1, y1, x2, y2, x3, y3, x4, y4) {
        this.id = id;
        this.coordinates = { x1, y1, x2, y2, x3, y3, x4, y4 };
        this.bounds = {
            minX: Math.min(x1, x2, x3, x4),
            maxX: Math.max(x1, x2, x3, x4),
            minY: Math.min(y1, y2, y3, y4),
            maxY: Math.max(y1, y2, y3, y4)
        };
    }

    getAdjustedCoordinates(scaleX, scaleY) {
        return {
            minX: this.bounds.minX * scaleX,
            maxX: this.bounds.maxX * scaleX,
            minY: this.bounds.minY * scaleY,
            maxY: this.bounds.maxY * scaleY,
        };
    }
}

const areas = [
    new Area(1, 955, 315, 1070, 340, 765, 535, 930, 565),
    new Area(1, 471, 506, 543, 569, 320, 608, 454, 654),
    new Area(5, 689, 269, 812, 308, 477, 505, 582, 560),
    new Area(2, 712, 597, 840, 597, 712, 728, 884, 695),
    new Area(3, 1216, 537, 1313, 496, 1216, 667, 1467, 559),
    //new Area(3, 858, 308, 937, 308, 606, 600, 663, 627),//
    new Area(3,543,616,650,616,417,801,649,802),
    new Area(3,428,312,560,312.395,491,415,491),
    new Area(3,351,444,394,444,319,518,373,516),
    new Area(4,393,186,569,149,426,307,621,273),
    new Area(6,192,332,416,361,162,418,390,419),
    new Area(7,337,274,380,263,361,319,410,310),
    new Area(7,611,224,673,207,639,263,700,249),
    new Area(8,150,564,250,564,175,688,275,675),
    new Area(9,248,267,334,283,248,325,334,325),
    new Area(9,1125,458,1239,413,1189,534,1300,492)
];



// Crear el pop-up
const popup = document.createElement('div');
    popup.classList.add('popup', 'absolute', 'opacity-0', 'transition-opacity', 'duration-500', 'ease-in-out', 'hidden');
    document.body.appendChild(popup);


 function mostrarImagen(img) {
        // Muestra una imagen al eliminar la clase de opacidad 0 y agregar la de opacidad 100.
        img.classList.remove('opacity-0');
        img.classList.add('opacity-100');
    }

function ocultarImagen(img) {
        // Oculta una imagen al eliminar la clase de opacidad 100 y agregar la de opacidad 0.
        img.classList.remove('opacity-100');
        img.classList.add('opacity-0');
    }

const imgRecintos = [];

    // Agrega las imágenes al array.
for (let i = 1; i <= 10; i++) {
        const img = document.getElementById(`imgRecinto${i}`);
        if (img) {
            imgRecintos.push(img);
        }
}


//agrego las imagenes de recinto a la constante
document.addEventListener('DOMContentLoaded', () => {
    const imgRecintoActual = document.getElementById("imgRecintoActual");
    

    imgRecintoActual.addEventListener('mousemove', (event) => {
        const rect = imgRecintoActual.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const scaleX = rect.width / imgRecintoActual.naturalWidth;
        const scaleY = rect.height / imgRecintoActual.naturalHeight;
        let foundArea = null;

        // Eliminar setTimeout para que la lógica se ejecute inmediatamente
        for (const area of areas) {
            const adjustedBounds = area.getAdjustedCoordinates(scaleX, scaleY);
            if (isPointInside({ bounds: adjustedBounds }, x, y)) {
                foundArea = area; // Área encontrada.
                break;
            }
        }    
        
        if (foundArea) {
            imgRecintoActual.style.cursor = 'pointer';
        } else {
            imgRecintoActual.style.cursor = 'default';
        }
    });


//todo lo que ocurre al hacer click en la imagen de recinto
    imgRecintoActual.addEventListener("click", (event) => {

            //obtener las coordenadas del click
            const rect = imgRecintoActual.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const scaleX = rect.width / imgRecintoActual.naturalWidth;
            const scaleY = rect.height / imgRecintoActual.naturalHeight;

            // desaparece el pop-up y desaparece la imagen de click
            popup.classList.add('hidden', 'opacity-0');
            popup.classList.remove('opacity-100');
            
            ocultarImagen(document.getElementById('imagenClick'));
            ocultarImagen(document.getElementById('imagenClick2'));

            
            //busca la area del click devuelve el id de la area
            setTimeout(() => {
                let foundArea = null;
                // Busca el área correspondiente al clic.
                for (const area of areas) {
                    const adjustedBounds = area.getAdjustedCoordinates(scaleX, scaleY);
                    if (isPointInside({ bounds: adjustedBounds }, x, y)) {
                        foundArea = area; // Área encontrada.
                        break;
                    }
                }


                //si encuentra la area entra a hacer todo esto
                if (foundArea) {
                    console.log(`Cambiando imagen a la del área: ${foundArea.id}`);
                    //cambia la imagen de recinto por la del id de la area


                    //cambia el nombre de la instancia por el id de la area
                    let nombreInstancias = "";
                    switch(foundArea.id){
                        case 1: nombreInstancias = "Cabañas 2 a 4 personas"; imgRecintos.forEach(img => ocultarImagen(img));
                        mostrarImagen(imgRecintos[0]);break;
                        case 2: nombreInstancias = "Recepcion"; imgRecintos.forEach(img => ocultarImagen(img));
                        mostrarImagen(imgRecintos[1]);break;
                        case 3: nombreInstancias = "Jardines y senderos"; imgRecintos.forEach(img => ocultarImagen(img));
                        mostrarImagen(imgRecintos[2]);break;
                        case 4: nombreInstancias = "Suites"; imgRecintos.forEach(img => ocultarImagen(img));
                        mostrarImagen(imgRecintos[3]);break;
                        case 5: nombreInstancias = "Cabañas 5 a 7 personas"; imgRecintos.forEach(img => ocultarImagen(img));
                        mostrarImagen(imgRecintos[4]);break;
                        case 6: nombreInstancias = "Piscina"; imgRecintos.forEach(img => ocultarImagen(img));
                        mostrarImagen(imgRecintos[5]);break;
                        case 7: nombreInstancias = "Quinchos"; imgRecintos.forEach(img => ocultarImagen(img));
                        mostrarImagen(imgRecintos[6]);break;
                        case 8: nombreInstancias = "Lavanderia"; imgRecintos.forEach(img => ocultarImagen(img));
                        mostrarImagen(imgRecintos[7]);break;
                        case 9: nombreInstancias = "Juegos de niños"; imgRecintos.forEach(img => ocultarImagen(img));
                        mostrarImagen(imgRecintos[8]);break;
                    }
                    //cambia el nombre de la href por el id de la area
                    let nombreHref = "";
                    switch (nombreInstancias) {
                        case "Cabañas 2 a 4 personas":
                            nombreHref = "cabanas";
                            document.getElementById('selectCabanas').value = 'cabaña de 2 a 4 personas';
                            document.getElementById('tituloCabanas').textContent = 'Cabaña de 2 a 4 personas';
                            break;
                        case "Suites": nombreHref = "suites"; break;
                        case "Cabañas 5 a 7 personas":
                            nombreHref = "cabanas";
                            document.getElementById('selectCabanas').value = 'cabaña de 5 a 7 personas';
                            document.getElementById('tituloCabanas').textContent = 'Cabañas de 5 a 7 personas';
                            break;
                        case "Jardines y senderos":
                        case "Piscina":
                        case "Quinchos":
                        case "Juegos de niños":
                            nombreHref = "instalaciones";
                            break;
                    }

                    // Crear el contenido del pop-up
                    popup.innerHTML = `
                        <div class="smooth-scroll relative flex flex-col items-center justify-center p-4 rounded-md bg-fondoCrema">
                            <button class="absolute top-0 right-[2px] text-black close-popup" id="close-popup">[x]</button>
                            <img class="m-4 w-64 rounded-xl" src="https://ik.imagekit.io/kirt8tkpk/img/fotosTarjetas/${foundArea.id}.webp" alt="Imagen"><br>
                            <h4 class="font-whisper text-3xl">${nombreInstancias}</h4>
                           

                            <a id="botonPopup" href="#${nombreHref}">
                                <button class="px-4 m-4 text-fondoCrema bg-green-700 font-antic rounded-sm">Mas informacion</button>
                            </a>
                        </div>`;

                    let botonPopup = document.getElementById('botonPopup');
                    const h4Element = document.querySelector('h4');

                    botonPopup.addEventListener('click', () => {
                        const h4Text = h4Element.textContent;

                        if (h4Text === 'Piscina') {
                            crearOverlay(document.getElementById('instalacionPiscina'));
                        } else if (h4Text === 'Jardines y senderos') {
                            crearOverlay(document.getElementById('instalacionJardin'));
                        } else if (h4Text === 'Quinchos') {
                            crearOverlay(document.getElementById('instalacionQuincho'));
                        } else if (h4Text === 'Juegos de niños') {
                            crearOverlay(document.getElementById('instalacionJuegos'));
                        }
                    });

                    // Posicionar y mostrar el pop-up con la transición `fade-in`
                    popup.style.left = `${event.pageX}px`;
                    popup.style.top = `${event.pageY}px`;

                    //aparece el pop-up
                    setTimeout(() => {
                        popup.classList.remove('hidden', 'opacity-0');
                        popup.classList.add('opacity-100');
                    }, 50);

                    //posiciona el pop-up por encima de la imagen
                    requestAnimationFrame(() => {
                        if ([2, 3, 8].includes(foundArea.id)) {
                            popup.style.top = `${event.pageY - popup.offsetHeight}px`;
                        }
                     });
                }
                else{
                    console.log("No se encontró área");
                    //si no encuentra la area vuelve a la imagen base
                    imgRecintos.forEach(img => ocultarImagen(img));
                    mostrarImagen(imgRecintoActual);
                    mostrarImagen(document.getElementById('imagenClick'));
                    mostrarImagen(document.getElementById('imagenClick2'));
                }
            
        
    

    // Función para cerrar el pop-up
    function closePopup() {
        popup.classList.remove('opacity-100');
        popup.classList.add('opacity-0');
        imgRecintos.forEach(img => ocultarImagen(img));
        mostrarImagen(imgRecintoActual);
        mostrarImagen(document.getElementById('imagenClick'));
        mostrarImagen(document.getElementById('imagenClick2'));
        setTimeout(() => {
            popup.classList.add('hidden');
        }, 500);
    }

    // Evento de cierre del pop-up
    document.addEventListener('click', (event) => {
        if (event.target.id === 'close-popup') {
            closePopup();
        }
    });

    })
})





document.getElementById('logoWsp').addEventListener('mouseover', () => {
    const duda = document.getElementById('duda');
    
    duda.classList.remove('hidden'); // Asegúrate de que el elemento sea visible
    duda.classList.remove('fade-out'); // Remueve la clase de fade-out
    duda.classList.add('fade-in'); // Agrega la clase de fade-in
    duda.classList.add('flex');

});

document.getElementById('logoWsp').addEventListener('mouseout', () => {
    const duda = document.getElementById('duda');
    
    duda.classList.remove('fade-in'); // Remueve la clase de fade-in
    duda.classList.add('fade-out'); // Agrega la clase de fade-out

    // Esperar a que termine la transición antes de ocultar el elemento
    duda.addEventListener('transitionend', () => {
        if (duda.classList.contains('fade-out')) {
            duda.classList.add('hidden'); // Agregar hidden solo después de la transición
            duda.classList.remove('flex'); // Remover flex
        }
    })
})})






//funcion para modal para mandar arriendo
const botonEnvioSuites=document.getElementById('botonEnvioSuites');
// Temporariamente desactivar la funcionalidad del botón
botonEnvioSuites.addEventListener('click',(event)=>  
{   

    function mandarWSP(mensaje) {
        const url = `https://wa.me/56979004253?text=${mensaje}`; // El enlace que deseas abrir
        window.open(url, '_blank'); // Abre el enlace en una nueva ventana o pestaña
    }
    event.preventDefault();
   
    let adicional = document.getElementById('adicional').value || ''; // Guardar como texto vacío si no hay contenido
    const fechaInicio = new Date(document.getElementById('fechaInicio').value); // Obtener el valor del input
    const fechaTermino = new Date(document.getElementById('fechaTermino').value); // Obtener el valor del input
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const diaCheckIn = String(fechaInicio.getUTCDate()).padStart(2, '0'); // Corregido: padStart debe aplicarse después de convertir a String
    const mesCheckIn = meses[fechaInicio.getMonth()]; // Obtener el nombre del mes
    const anioCheckin = fechaInicio.getFullYear();
    const diaCheckOut = String(fechaTermino.getUTCDate()).padStart(2, '0'); // Corregido: padStart debe aplicarse después de convertir a String
    const mesCheckOut = meses[fechaTermino.getMonth()]; // Obtener el nombre del mes
    const anioCheckOut = fechaTermino.getFullYear();
    const checkboxSuite=document.getElementById('checkboxSuite');

    const inputs = ['selectSuites','cantidadPersonas', 'infantesSuite'];
    const [selectSuites, cantidadPersonas, infantes] = inputs.map(id => document.getElementById(id).value);
    console.log(selectSuites, fechaInicio, fechaTermino, cantidadPersonas, infantes);

    
    if (fechaInicio > fechaTermino) {
        alert("La fecha de inicio no puede ser después de la fecha de término.");
        return; // Salir de la función si la validación falla
    }
    if (fechaTermino < fechaInicio) {
        alert("La fecha de término no puede ser antes de la fecha de inicio.");
        return; // Salir de la función si la validación falla
    }

    if (cantidadPersonas === "0" || cantidadPersonas < 1) { // Verifica si es 0 o negativo
        alert("Tiene que especificar un número de personas."); // Alerta si el valor es 0 o negativo
        return; // Salir de la función si la validación falla
    }

    if (infantes !== "Sí" && infantes !== "No") {
        alert("Tiene que especificar si viene con infantes");
        return; // Salir de la función si la validación falla
    }
    
    if(!checkboxSuite.checked){
        alert("Tiene que indicar que leyó todo lo que incluye la cabaña");
        return;
    }

    let mensaje = `Hola!\nMe gustaría reservar una ${selectSuites} con check-in el ${diaCheckIn} de ${mesCheckIn} del ${anioCheckin} y check-out el ${diaCheckOut} de ${mesCheckOut} del ${anioCheckOut}.\nLa cantidad de personas es ${cantidadPersonas}.\n${infantes} contamos con infante acompañante.\n${adicional}`; // Corregido: espacio agregado antes de "desde"

    mensaje = encodeURIComponent(mensaje);
    mandarWSP(mensaje);
    document.getElementById('fechaInicio').value=''
    document.getElementById('fechaTermino').value=''
    // Reiniciar los valores de todos los inputs
    inputs.forEach(id => {
        document.getElementById(id).value = ''; // Establecer el valor de cada input a vacío
    });
    document.getElementById('adicional').value = ''; // Asegurarse de reiniciar el campo adicional
});



const botonEnvioCabanas=document.getElementById('botonEnvioCabanas');
botonEnvioCabanas.addEventListener('click',(event)=> 
{   event.preventDefault();

    function mandarWSP(mensaje) {
        const url = `https://wa.me/56979004253?text=${mensaje}`; // El enlace que deseas abrir
        window.open(url, '_blank'); // Abre el enlace en una nueva ventana o pestaña
    }
    
    let adicional = document.getElementById('adicionalC').value || ''; // Guardar como texto vacío si no hay contenido
    const fechaInicio = new Date(document.getElementById('fechaInicioC').value); // Obtener el valor del input
    const fechaTermino = new Date(document.getElementById('fechaTerminoC').value); // Obtener el valor del input
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const diaCheckIn = String(fechaInicio.getUTCDate()).padStart(2, '0'); // Corregido: padStart debe aplicarse después de convertir a String
    const mesCheckIn = meses[fechaInicio.getMonth()]; // Obtener el nombre del mes
    const anioCheckin = fechaInicio.getFullYear();
    const diaCheckOut = String(fechaTermino.getUTCDate()).padStart(2, '0'); // Corregido: padStart debe aplicarse después de convertir a String
    const mesCheckOut = meses[fechaTermino.getMonth()]; // Obtener el nombre del mes
    const anioCheckOut = fechaTermino.getFullYear();
    const checkboxCabana = document.getElementById('checkboxCabana')
    const inputs = ['selectCabanas','cantidadPersonasC', 'mascotaC'];
    const [selectCabanas, cantidadPersonas, mascotas] = inputs.map(id => document.getElementById(id).value);
    console.log(selectCabanas, fechaInicio, fechaTermino, cantidadPersonas, mascotas);


    if (fechaInicio > fechaTermino) {
        alert("La fecha de inicio no puede ser después de la fecha de término.");
        return; // Salir de la función si la validación falla
    }
    if (fechaTermino < fechaInicio) {
        alert("La fecha de término no puede ser antes de la fecha de inicio.");
        return; // Salir de la función si la validación falla
    }

    if (cantidadPersonas === "0" || cantidadPersonas < 1) { // Verifica si es 0 o negativo
        alert("Tiene que especificar un número de personas."); // Alerta si el valor es 0 o negativo
        return; // Salir de la función si la validación falla
    }

    if (mascotas !== "Si" && mascotas !== "No") {
        alert("Tiene que especificar si viene con mascotas");
        return; // Salir de la función si la validación falla
    }
    
    if(!checkboxCabana.checked){
        alert("Tiene que indicar que leyó todo lo que incluye la cabaña");
        return;
    }

    let mensaje = `Hola!\nMe gustaría reservar una ${selectCabanas} con check-in el ${diaCheckIn} de ${mesCheckIn} del ${anioCheckin} y check-out el ${diaCheckOut} de ${mesCheckOut} del ${anioCheckOut}.\nLa cantidad de personas es ${cantidadPersonas}.\n${mascotas} contamos con mascota.\n${adicional}`; // Corregido: espacio agregado antes de "desde"


    mensaje = encodeURIComponent(mensaje);
    mandarWSP(mensaje);
    
    document.getElementById('fechaInicioC').value=''
    document.getElementById('fechaTerminoC').value=''
    // Reiniciar los valores de todos los inputs
    inputs.forEach(id => {
        document.getElementById(id).value = ''; // Establecer el valor de cada input a vacío
    });
    document.getElementById('adicionalC').value = ''; // Asegurarse de reiniciar el campo adicional

});

const cabana1 = `<br>En el primer piso cuenta con una pieza con cama de dos plazas con baño en suite, living-comedor con cocina y baño independiente. En el segundo piso hay una habitación abierta y otra cerrada. En la abierta hay tres camas de una plaza, y en la cerrada hay dos camas de una plaza (<i>opción de futón extra por costo adicional y según disponibilidad</i>) <b>Admite mascotas</b>.<br><br>
<strong>Incluye:</strong>
    <br>-Ropa de cama, juego de toallas (de cuerpo x6, de mano x2, de pie x2).
    <br>-Rollo de papel higiénico(x2), jabón líquido(2x 30ml), shampoo(2x 30ml) y acondicionador(2x 30ml).
    <br>-Vajilla, tetera, refrigerador, microondas, detergente lavalozas, y fósforos.
    <br>-Televisor con DirecTV.
    <br>-Quincho privado con comedor en terraza.
    <br>-Estacionamiento privado.
    <br>-Acceso a juegos infantiles.
    <br>-Calefacción (de otoño a primavera).
    <br>-Acceso a piscinas al aire libre (10:30~20:30hrs) <b>SOLO desde diciembre hasta Semana Santa</b>. <br><br>

<strong>IMPORTANTE: Se deja GARANTÍA DE 20mil con devolución contra entrega de llaves y revisión del inmueble. La cabaña no cuenta con Wi-Fi.</strong><br><br>`;

const cabana2 = `<br>En el primer piso cuenta con una pieza con cama dos plazas, living-comedor con cocina y baño independiente. En el segundo piso abierto, se encuentran dos camas de una plaza (<i>opción de futón extra por costo adicional y según disponibilidad</i>). <b>Admite mascotas</b>.<br><br>
<strong>Incluye:</strong>

    <br>-Ropa de cama, juego de toallas (de cuerpo x4, de mano x1, de pie x1).
    <br>-Rollo de papel higiénico(x1), jabón líquido(30ml), shampoo(30ml) y acondicionador(30ml).
    <br>-Vajilla, tetera, refrigerador, microondas, detergente lavalozas, y fósforos.
    <br>-Televisor con DirecTV.
    <br>-Quincho privado con comedor en terraza.
    <br>-Estacionamiento privado.
    <br>-Acceso a juegos infantiles.
    <br>-Calefacción (de otoño a primavera).
    <br>-Acceso a piscinas al aire libre (10:30~20:30hrs) <b>SOLO desde diciembre hasta Semana Santa</b>. <br><br>

<strong>IMPORTANTE: Se solicitará una GARANTÍA DE $20.000, la cual será reembolsada al momento de la entrega de las llaves y tras la revisión del inmueble. Las cabañas no disponen de conexión Wi-Fi.</strong><br><br>`;

const selectCabanas = document.getElementById('selectCabanas');

// --- INICIO: CÓDIGO AÑADIDO PARA EL ESTADO INICIAL ---

// 1. Establecer el título por defecto.
document.getElementById('tituloCabanas').textContent = 'Cabaña de 2 a 4 personas';

// 2. Establecer el párrafo de descripción por defecto.
document.getElementById('parrafoCabanas').innerHTML = cabana2;

// 3. (Opcional) Asegurarse de que el <select> muestre la opción correcta.
//    Esto es útil si tienes más de dos opciones.
selectCabanas.value = 'cabaña de 2 a 4 personas'; 

// --- FIN: CÓDIGO AÑADIDO ---


selectCabanas.addEventListener('change', () => {
    const titulo = document.getElementById('tituloCabanas');
    const imagenes = [
        document.getElementById('imagenCabana1'),
        document.getElementById('imagenCabana2'),
        document.getElementById('imagenCabana3'),
        document.getElementById('imagenCabana4'),
        document.getElementById('imagenCabana5')
    ];
    const parrafoCabanas = document.getElementById('parrafoCabanas');

    // Añadir clase de fade-out
    imagenes.forEach(img => img.classList.add('fade-out'));
    parrafoCabanas.classList.add('fade-out');
    titulo.classList.add('fade-out');

    // Esperar a que termine la animación de desvanecimiento
    setTimeout(() => {
        if (selectCabanas.value === 'cabaña de 5 a 7 personas') {
            document.getElementById('imagenCabana1').src = 'https://ik.imagekit.io/kirt8tkpk/img/cabanas/5.jpg?v=2';
            document.getElementById('imagenCabana2').src = 'https://ik.imagekit.io/kirt8tkpk/img/cabanas/6.jpg?v=2';
            document.getElementById('imagenCabana3').src = 'https://ik.imagekit.io/kirt8tkpk/img/cabanas/7.jpg?v=2';
            document.getElementById('imagenCabana4').src = 'https://ik.imagekit.io/kirt8tkpk/img/cabanas/8.jpg?v=2';
            document.getElementById('imagenCabana5').src = 'https://ik.imagekit.io/kirt8tkpk/img/cabanas/10.png';
            parrafoCabanas.innerHTML = cabana1;
            titulo.textContent = 'Cabaña de 5 a 7 personas';
        } else {
            // Corregí un pequeño error en tu URL (tenía doble //)
            document.getElementById('imagenCabana1').src = 'https://ik.imagekit.io/kirt8tkpk/img/cabanas/1.webp';
            document.getElementById('imagenCabana2').src = 'https://ik.imagekit.io/kirt8tkpk/img/cabanas/2.webp';
            document.getElementById('imagenCabana3').src = 'https://ik.imagekit.io/kirt8tkpk/img/cabanas/3.webp';
            document.getElementById('imagenCabana4').src = 'https://ik.imagekit.io/kirt8tkpk/img/cabanas/4.webp';
            document.getElementById('imagenCabana5').src = 'https://ik.imagekit.io/kirt8tkpk/img/cabanas/9.png';
            parrafoCabanas.innerHTML = cabana2;
            titulo.textContent = 'Cabaña de 2 a 4 personas';
        }

        // Remover clase de fade-out y añadir fade-in
        imagenes.forEach(img => {
            img.classList.remove('fade-out');
            img.classList.add('fade-in');
        });

        parrafoCabanas.classList.remove('fade-out');
        parrafoCabanas.classList.add('fade-in');
        titulo.classList.remove('fade-out');
        titulo.classList.add('fade-in');

        // Desplazar el scroll hacia arriba
        parrafoCabanas.scrollTop = 0;
    }, 300);
});

const suitesInfo = {
    'Superior de 1 a 2 personas': {
        imagenes: [
            'https://ik.imagekit.io/kirt8tkpk/img/suites/1.jpg?v=2',
            'https://ik.imagekit.io/kirt8tkpk/img/suites/2.jpg?v=2',
            'https://ik.imagekit.io/kirt8tkpk/img/suites/3.jpg?v=2',
            'https://ik.imagekit.io/kirt8tkpk/img/suites/4.jpg?v=2'
        ],
        parrafo: `<br>Se encuentra en un 1er piso con vista al jardín, y cuenta con una cama de dos plazas, una mini cocina, un baño con ducha, una ducha frente a la cama, y una mesita con dos sillas (<i>opción de cama inflable extra por costo adicional y según disponibilidad</i>). <b>No admite mascotas</b>. <br><br><strong>Incluye:</strong><br>-Ropa de cama, juego de toallas (de cuerpo x2, de mano x1, de pie x1), secador de cabello. <br>-Rollo de papel higiénico(x1), jabón líquido(20ml), shampoo/acondicionador(20ml) y crema humectante(20ml). <br>-Vajilla, frigobar, cocinilla eléctrica, tetera, y detergente lavalozas. <br>-Televisor con DirecTV. <br>-Acceso a quinchos grandes y comedores comunitarios al exterior. <br>-Estacionamiento. <br>-Acceso a juegos infantiles. <br>-Acceso a piscinas al aire libre (10:30~20:30hrs) <b>SOLO desde diciembre hasta Semana Santa</b>. <br><br> <strong>IMPORTANTE: Se solicitará una GARANTÍA DE $20.000, la cual será reembolsada al momento de la entrega de llaves y tras la revisión del inmueble. Las suites no disponen de conexión Wi-Fi. Se prohíben los ruidos y la música a alto volumen; a partir de las 21:00 horas, se solicita mantener el silencio para favorecer el descanso de todos los huéspedes. Por seguridad, no se permite conectar aparatos de alto consumo eléctrico.</strong><br><br>`
    },
    'Deluxe de 1 a 2 personas': {
        imagenes: [
            'https://ik.imagekit.io/kirt8tkpk/img/suites/5.jpg?v=2',
            'https://ik.imagekit.io/kirt8tkpk/img/suites/6.jpg?v=2',
            'https://ik.imagekit.io/kirt8tkpk/img/suites/7.jpg?v=2',
            'https://ik.imagekit.io/kirt8tkpk/img/suites/8.jpg?v=2'
        ],
        parrafo: `<br>Se encuentra en un 2do piso con balcón y vista a la piscina, y cuenta con una cama de dos plazas, una mini cocina, un baño con ducha, y una mesita con dos sillas. (<i>opción de cama inflable extra por costo adicional y según disponibilidad</i>). <b>No admite mascotas</b>. <br><br><strong>Incluye:</strong><br>-Ropa de cama, juego de toallas (de cuerpo x2, de mano x1, de pie x1), y secador de cabello. <br>-Rollo de papel higiénico(x1), jabón líquido(20ml), shampoo/acondicionador(20ml) y crema humectante(20ml). <br>-Vajilla, frigobar, cocinilla eléctrica, tetera, y detergente lavalozas. <br>-Televisor con DirecTV y ventilador. <br>-Acceso a quinchos grandes y comedores comunitarios al exterior. <br>-Estacionamiento. <br>-Acceso a juegos infantiles. <br>-Acceso a piscinas al aire libre (10:30~20:30hrs) <b>SOLO desde diciembre hasta Semana Santa</b>. <br><br> <strong>IMPORTANTE: Se solicitará una GARANTÍA DE $20.000, la cual será reembolsada al momento de la entrega de llaves y tras la revisión del inmueble. Las suites no disponen de conexión Wi-Fi. Se prohíben los ruidos y la música a alto volumen; a partir de las 21:00 horas, se solicita mantener el silencio para favorecer el descanso de todos los huéspedes. Por seguridad, no se permite conectar aparatos de alto consumo eléctrico.</strong><br><br>`
    },
    'Standard de 1 a 2 personas': {
        imagenes: [
            'https://ik.imagekit.io/kirt8tkpk/img/suites/9.jpg?v=3',
            'https://ik.imagekit.io/kirt8tkpk/img/suites/10.jpg?v=5',
            'https://ik.imagekit.io/kirt8tkpk/img/suites/11.jpg?v=3',
            'https://ik.imagekit.io/kirt8tkpk/img/suites/12.jpg?v=3'
        ],
        parrafo: `<br>Se encuentra en un 2do piso con vista trasera, y cuenta con una cama de dos plazas, un baño con ducha, y una mesita con dos sillas. <b>No cuenta con cocinilla ni hervidor</b> (<i>opción de cama inflable extra por costo adicional y según disponibilidad</i>). <b>No admite mascotas</b>. <br><br><strong>Incluye:</strong><br>-Ropa de cama, juego de toallas (de cuerpo x2, de mano x1, de pie x1), y secador de cabello. <br>-Rollo de papel higiénico(x1), jabón líquido(20ml), shampoo/acondicionador(20ml) y crema humectante(20ml). <br>-Vajilla, frigobar, y detergente lavalozas. <br>-Televisor con DirecTV. <br>-Acceso a quinchos grandes y comedores comunitarios al exterior. <br>-Estacionamiento. <br>-Acceso a juegos infantiles. <br>-Acceso a piscinas al aire libre (10:30~20:30hrs) <b>SOLO desde diciembre hasta Semana Santa</b>. <br><br> <strong>IMPORTANTE: Se solicitará una GARANTÍA DE $20.000, la cual será reembolsada al momento de la entrega de llaves y tras la revisión del inmueble. Las suites no disponen de conexión Wi-Fi. Se prohíben los ruidos y la música a alto volumen; a partir de las 21:00 horas, se solicita mantener el silencio para favorecer el descanso de todos los huéspedes. Por seguridad, no se permite conectar aparatos de alto consumo eléctrico.</strong><br><br>`
    }
};

// 2. Referencias a los elementos del DOM
const selectSuites = document.getElementById('selectSuites');
selectSuites.value = 'Superior de 1 a 2 personas';
const tituloSuites = document.getElementById('tituloSuites');
const parrafoSuites = document.getElementById('parrafoSuites');
const imagenesSuiteElements = [
    document.getElementById('imagenSuite1'),
    document.getElementById('imagenSuite2'),
    document.getElementById('imagenSuite3'),
    document.getElementById('imagenSuite4')
];

// 3. Función única y reutilizable para actualizar el contenido
function actualizarContenidoSuites() {
    const valorSeleccionado = selectSuites.value;
    const info = suitesInfo[valorSeleccionado];

    if (!info) {
        console.error(`No se encontró información para la suite: ${valorSeleccionado}`);
        return; 
    }

    const elementosParaAnimar = [tituloSuites, parrafoSuites, ...imagenesSuiteElements];
    
    elementosParaAnimar.forEach(el => el.classList.add('fade-out'));

    setTimeout(() => {
        tituloSuites.textContent = valorSeleccionado;
        parrafoSuites.innerHTML = info.parrafo;
        imagenesSuiteElements.forEach((img, index) => {
            if (img) img.src = info.imagenes[index];
        });

        elementosParaAnimar.forEach(el => {
            el.classList.remove('fade-out');
            el.classList.add('fade-in');
        });

        parrafoSuites.scrollTop = 0;
    }, 300);
}

// 4. LLAMADAS A LA FUNCIÓN
// Se ejecuta una vez al cargar la página para establecer el estado inicial correcto.
actualizarContenidoSuites();

// Se ejecuta cada vez que el usuario cambia la opción en el <select>.
selectSuites.addEventListener('change', actualizarContenidoSuites);





const contenedorInstalaciones = document.getElementById('contenedorInstalaciones');
const instalaciones = [
    document.getElementById('instalacionJardin'),
    document.getElementById('instalacionPiscina'),
    document.getElementById('instalacionJuegos'),
    document.getElementById('instalacionQuincho'),
    document.getElementById('instalacionAmenidades')
];

const parrafoJardin = `Nuestros jardines y senderos son un refugio de tranquilidad y belleza natural. Con una variedad de plantas y árboles autóctonos, flores vibrantes y caminos serpenteantes, son el lugar perfecto para relajarse y disfrutar de la brisa marina. El diseño incluye zonas de descanso estratégicamente ubicadas para que puedas contemplar el paisaje, leer un libro o simplemente descansar. Ideal para desconectar y reconectar con la naturaleza.
<br><br>
<b>Desafío</b>: ¡Encuentra e identifica nuestros jardines!
<br>Jardín de los Duendecitos, Jardín Puente Rojo, Jardín de la Virgen, Jardín de los Pinos, Jardín de las Zarzamoras.`;

const parrafoPiscina = `Disfruta de nuestras dos piscinas al aire libre: una piscina pequeña para niños, y una piscina más grande para jóvenes y adultos. <br><br>Rodeadas de vegetación, con reposaderas, mesas, sillas, y zonas de sombra, ofreciendo el lugar perfecto para disfrutar en familia en verano.`

const parrafoQuincho = `Disfruta de un asado en nuestros quinchos equipados con parrillas, mesas, sillas y áreas de sombra. Rodeados de jardines, son perfectos para reuniones en un entorno tranquilo y acogedor.<br><br> Nuestras cabañas cuentan con su propio quincho privado, y nuestras suites con un quincho grande común. <br><br><strong>*Si estás alojando en nuestras suites, tienes acceso libre a quinchos</strong><br><br>
🧱<strong>ARRIENDO DE QUINCHO GRANDE <br> Horario 10:30hrs – 21:30hrs
(Aplican términos y condiciones de arriendo de quincho según temporadas).</strong><br><br>
<strong>CARBÓN: $5.000 por bolsa (2,4kg aprox.)</strong><br><br>

<strong>TEMPORADA ALTA (incluye baño, estacionamiento, acceso a ducha y piscinas)<br>
Fijo: $25.000.-<br></strong>
Joven/adulto (desde 16 años): <b>$8.000</b>
<br>Niñ@ (hasta 15 años): <b>$6.000</b>
<br>Mascota: <b>$4.000</b><br><br>

<strong>TEMPORADA MEDIA (incluye baño y estacionamiento).<br>
Fijo: $20.000.-</strong><br>
Joven/adulto (desde 16 años): <b>$7.000</b>
<br>Niñ@ (hasta 15 años): <b>$5.000</b>
<br>Mascota: <b>$3.000</b><br><br>

<strong>TEMPORADA BAJA (incluye baño y estacionamiento).<br>
Fijo: $15.000.-</strong><br>
Joven/adulto (desde 16 años): <b>$6.000</b>
<br>Niñ@ (hasta 15 años): <b>$4.000</b>
<br>Mascota: <b>$2.000</b><br><br>`

const parrafoJuegos = `¡Diversión para los pequeños en nuestra área de juegos! <br> <br> Con columpios, resbalines, camas saltarinas y áreas verdes con asientos para poder supervisar a tus niños cómodamente.`;

const parrafoAmenidades = `
    <strong>PAPEL HIGIÉNICO: $500 por rollo.</strong><br> <br>
    <strong>CARBÓN: $5.000 por bolsa (2,4kg aprox.)</strong><br><br>
    🍵 <strong>BEBIDAS CALIENTES DE MÁQUINA: $1.200 vaso 200ml.</strong> <br>Puedes elegir entre cappuccino, té chai latte, y chocolate caliente.
    Retirar en recepción o pedir que se lo lleven a su cabaña/suite.<br><br>
    🧼👕 <strong>SERVICIO DE LAVANDERÍA: $5.000 por bolsa (40x30x120cm). <br>Horario de servicio: 10:30hrs – 15:30hrs.</b></strong> <br>Incluye detergente, lavado, secado al aire libre, y doblado sin planchar (<b>NO SE RECIBE ROPA INTERIOR</b>). Una vez solicitado el servicio, le será entregada la bolsa en su cabaña/suite para que puedan llenarla con la ropa a lavar.<br><br>
    ♟🧩 <strong>JUEGOS DE MESA: !Te los prestamos por 2 horas sin costo! <br>Horario de servicio: 11:00 – 20:00hrs</strong> <br>Simplemente avisar por WhatsApp y acércarse a recepción, dejar una garantía de $5.000 para retirar el juego (máx. 2 por cabaña/suite). 
    Al pasar las 2 horas, puedes consultar por WhatsApp para seguir usándolo por 2 horas adicionales según disponibilidad. <i>Luego de las 20:30hrs se devuelve al día siguiente</i>.
   <br><strong>Al devolverlo, debes entregarlo en las mismas condiciones y completo para la devolución de garantía, de lo contrario, se cobrará la garantía.</strong><br><br>
   `;



// Función para crear el overlay
function crearOverlay(div) {
    div.classList.toggle('girando');
    let nombre = "";
    let img = "";
    let parrafo = "";
    let iconoFondo = "";

    switch (div.id) {
        case 'instalacionJardin': nombre = 'Jardines y senderos'; img = 'jardin'; parrafo = parrafoJardin; iconoFondo = iconoPlanta; break;
        case 'instalacionPiscina': nombre = 'Piscina'; img = 'Piscina1'; parrafo = parrafoPiscina; iconoFondo = iconoPiscina; break;
        case 'instalacionJuegos': nombre = 'Area de juegos de niños'; img = 'JuegosNinos'; parrafo = parrafoJuegos; iconoFondo = iconoNinos; break;
        case 'instalacionQuincho': nombre = 'Quinchos'; img = 'Quincho'; parrafo = parrafoQuincho; iconoFondo = iconoQuincho; break;
        case 'instalacionAmenidades': nombre = 'Amenidades y servicios'; img = 'amenidades'; parrafo = parrafoAmenidades; break;
    }

    const overlay = document.createElement('div');
    overlay.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'lg:h-[90%]', 'bg-white', 'flex', 'items-center', 'justify-center', 'z-9999', 'opacity-0', 'transition-opacity', 'duration-500', 'ease-in');
    
    overlay.innerHTML = `
        <div class="p-0 lg:p-4 flex items-center justify-center flex-col lg:flex-row relative w-full h-full mx-auto">
          
            <div class="w-full lg:w-1/2  mx-8 relative  h-1/2 lg:h-full overflow-y-auto overflow-x-hidden scrollbar-thin">
          
                <div class="absolute top-[15%] object-fit lg:top-[15%] flex w-full justify-center items-center opacity-20">${iconoFondo}</div>
                
                <h2 class="text-3xl lg:text-6xl text-black font-whisper font-bold mb-4 text-center sticky top-0 bg-white pt-2">${nombre}</h2>
    
                <!-- Texto sin overflow -->
                <p class="font-antic text-sm lg:text-lg  w-full px-8 text-center ">${parrafo}</p>
            </div>
            
            <img src="https://ik.imagekit.io/kirt8tkpk/img/instalaciones/${img}.webp?v=2" class="relative w-full h-1/2 lg:h-full lg:w-1/2 object-cover overflow-hidden">
            <button id="close-overlay" style="position: absolute; top: 3px; right: 10px;">${iconoCierre}</button>
        </div>`;

    contenedorInstalaciones.appendChild(overlay);

    // Usar setTimeout para permitir que el DOM se actualice antes de cambiar la opacidad
    setTimeout(() => {
        overlay.classList.remove('opacity-0'); // Remover la opacidad cero para hacer fade in
        overlay.classList.add('opacity-100'); // Agregar opacidad completa
    }, 10); // Un pequeño retraso para permitir que el navegador procese el DOM

    // Agregar evento para cerrar el overlay
    overlay.querySelector('#close-overlay').addEventListener('click', () => {
        overlay.classList.remove('opacity-100'); // Remover opacidad completa para hacer fade out
        overlay.classList.add('opacity-0'); // Agregar opacidad cero

        // Esperar a que termine la transición antes de eliminar el overlay
        setTimeout(() => {
            contenedorInstalaciones.removeChild(overlay); // Eliminar el overlay del DOM
        }, 500); // Debe coincidir con la duración de la transición
    });
}

// Agregar el evento de clic a cada instalación
instalaciones.forEach(instalacion => {
    instalacion.addEventListener('click', () => crearOverlay(instalacion));
});

instalaciones.forEach(instalacion => {
    const imagen = instalacion.querySelector('img'); // Selecciona la imagen dentro de la instalación
    instalacion.addEventListener('mouseenter', () => {
        imagen.style.transform = 'scale(1.1)'; // Escalar la imagen al hacer hover
    });
    instalacion.addEventListener('mouseleave', () => {
        imagen.style.transform = 'scale(1)'; // Volver al tamaño original al salir del hover
    });
});


const botonCabanas=document.getElementById('botonCabanas')
botonCabanas.addEventListener('click',()=> {
    const modal = document.getElementById('crud-modal');
    const subtituloModalCabana=document.getElementById('subtituloModalCabana')
    subtituloModalCabana.innerHTML = `${selectCabanas.value.charAt(0).toUpperCase()}${selectCabanas.value.slice(1)}`;
    modal.classList.remove('hidden');
    
    // Esperar un breve momento para permitir que la clase 'hidden' se elimine antes de cambiar la opacidad
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        modal.classList.add('flex')
    }, 10); // 10 ms de retraso para permitir la transición
})

const cerrarModal1=document.getElementById('cerrarModal1')
cerrarModal1.addEventListener('click',()=> {
    const modal = document.getElementById('crud-modal');
    
    // Cambiar la opacidad a 0 para aplicar fade-out
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');

    // Esperar a que termine la transición antes de ocultar el modal
    setTimeout(() => {
        modal.classList.add('hidden'); // Ocultar el modal
        modal.classList.remove('flex'); // Remover la clase flex
    }, 500); // Debe coincidir con la duración de la transición
})

const botonsuites=document.getElementById('botonSuites')
botonsuites.addEventListener('click',()=> {
    const subtituloModalSuite=document.getElementById('subtituloModalSuite')
    subtituloModalSuite.innerHTML = `${selectSuites.value.charAt(0).toUpperCase()}${selectSuites.value.slice(1)}`
    const modal = document.getElementById('crud-modal2');
    
    modal.classList.remove('hidden');
    
    // Esperar un breve momento para permitir que la clase 'hidden' se elimine antes de cambiar la opacidad
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        modal.classList.add('flex')
    }, 10); // 10 ms de retraso para permitir la transición
})

const cerrarModal2=document.getElementById('cerrarModal2')
cerrarModal2.addEventListener('click',()=> {
    const modal = document.getElementById('crud-modal2');
    
    // Cambiar la opacidad a 0 para aplicar fade-out
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');

    // Esperar a que termine la transición antes de ocultar el modal
    setTimeout(() => {
        modal.classList.add('hidden'); // Ocultar el modal
        modal.classList.remove('flex'); // Remover la clase flex
    }, 500); // Debe coincidir con la duración de la transición
})



const ruta = (inicio, final, arrayRuta) => {
    // Dibuja la ruta con una línea
    L.polyline(arrayRuta, { color: 'green' }).addTo(map); // Usar arrayRuta directamente

    // Agrega marcadores solo en el inicio y el final
    if (arrayRuta.length > 0) {
        L.marker(arrayRuta[0]).bindPopup(inicio).addTo(map); // Marcador en el inicio
    }
    if (arrayRuta.length > 1) {
        L.marker(arrayRuta[arrayRuta.length - 1]).bindPopup(final).addTo(map); // Marcador en el final
    }
}

const mapa = (zoom, arrayRuta, inicio, final) => {
    if (map) {
        map.remove(); // Eliminar el mapa anterior si existe
    }

    // Inicializa el mapa
    map = L.map('map', {
        center: arrayRuta[Math.round((arrayRuta.length - 1) / 2)],
        zoom: zoom,
        zoomControl:false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    ruta(inicio, final, arrayRuta); // Llamar a la función ruta


};


let imagenPanorama = document.getElementById('imagenPanorama')

let textoYeco =`Destino perfecto para escapadas íntimas o en familia. Con sus arenas cálidas y doradas, invita a disfrutar del sol, relajarse en un ambiente tranquilo y conectarse con la naturaleza. Ideal para aventureros, su acceso —un pintoresco sendero de 10 minutos desde el estacionamiento, con escaleras y caminos rodeados de vegetación— añade un toque de exploración. Destaca por su pozón natural ideal para refrescarse y sus olas aptas para surfistas, combinando serenidad con emoción.`

let textoKartingGo = `Ofrece pistas de karts emocionantes y seguras para todas las edades, con vehículos adaptados desde niños hasta adultos. Compite en carreras llenas de adrenalina en un circuito profesional, disfruten de modernas instalaciones con boxes temáticos y tecnología de última generación, y celebren cumpleaños o reuniones con paquetes especiales que incluyen snacks y premios. Ideal para familias que buscan combinar acción, risas y trabajo en equipo, en un ambiente controlado y con supervisión experta.   <br><br><strong><a href="https://gokartcenter.cl/nuestras-sedes/algarrobo/" target="_blank">[Pagina web]</a></strong>  <strong><a href="https://www.instagram.com/gokart_center/" target="_blank">[Instagram]</a></strong> <br><br><h6 class= "text-center text-lg">*Servicios externos a Cabañas La Campiña. Siempre consultar directamente con los que ofrecen dichos servicios. No somos responsable de estos servicios*`

let textoKarting = `Centro de entretenimiento activo donde podrás vivir la emoción de las carreras en un circuito profesional de karts, con curvas desafiantes y rectas veloces aptas para todas las edades. Además del karting, el lugar ofrece cuatrimotos para explorar terrenos variados, paseos a caballo por senderos naturales cercanos y una cancha de paintball equipada para partidas estratégicas en grupo.

Después de la adrenalina, descansa en su zona de comida, con opciones locales para reponer energías, o disfruta de un picnic en áreas habilitadas. Ideal para familias, amigos o eventos corporativos, el espacio combina seguridad (con equipos certificados y monitores profesionales) y diversión al aire libre. ¿Buscas un plan completo? Aquí encontrarás deporte, naturaleza y momentos para compartir, todo en un mismo lugar.`

let textoLancha = 'Ubicado en el encantador muelle artesanal de Playa El Yachting en Algarrobo, este paseo de 30 minutos les permitirá navegar junto a la costa sur, disfrutando de vistas panorámicas de las playas Canelo-Canellilo y avistando los santuarios naturales de Islote Pájaro Niño y Peña Blanca. Ideal para familias que buscan combinar relax, conexión con la naturaleza y descubrimiento, el recorrido ofrece un ambiente seguro y apto para todas las edades, donde niños y adultos podrán maravillarse con la biodiversidad costera.'

let textoBuceo = '¡Vive una aventura submarina en familia con Buceo Algarrobo! Ofrecen cursos adaptados para todas las edades, incluyendo programas especiales para niños, donde aprenderán a bucear de forma segura con instructores certificados por PADI. Disfruten juntos de inmersiones guiadas en lugares mágicos como Isla Pájaro Niño, alquilen equipo de calidad y capturen recuerdos únicos con fotografía submarina. Ideal para familias que buscan combinar diversión, aprendizaje y conexión con la naturaleza, desde pozones tranquilos para principiantes hasta emocionantes exploraciones nocturnas. ¡Una experiencia en el Pacífico chileno que unirá a su familia con el mar!'

let textoTunquen= `Santuario de la naturaleza en Chile, es un destino único que combina belleza escénica y valor ecológico. Con aguas someras y tranquilas, dunas en forma de semicircunferencia, y el emblemático humedal formado por el estero Casablanca, este lugar es un refugio para la biodiversidad nativa. Ideal para quienes buscan relajarse en un entorno exclusivo, explorar ecosistemas protegidos como la Laguna Seca y la Quebrada Seca, o capturar fotografías de paisajes vírgenes, Tunquén ofrece una experiencia íntima con la naturaleza. Perfecta para el ecoturismo, esta playa invita a desconectar, disfrutar de la pesca y conectar con corredores biológicos únicos en la región.`

let textoMirasol=`De arena dorada y clima agradable durante casi todo el año, es un destino ideal para turistas que buscan relajarse frente al mar y surfistas atraídos por sus consistentes olas. Además de disfrutar del sol, los visitantes pueden  explorar miradores panorámicos, y ademas recrearse junto a los mas pequeños en áreas de juegos infantiles que la convierten en una opción familiar.`

let textoAlgarroboNorte=`Se consolida como un refugio de tranquilidad y espacio abierto, ideal para quienes buscan desconectar en un entorno sereno y seguro. Con baja afluencia en verano, especialmente recomendada para evitar aglomeraciones, es perfecta para relajarse bajo el sol, caminar descalzo por su arena limpia de tonos únicos o disfrutar partidas de paletas junto a tu mascota. Sus amplias extensiones invitan a paseos solitarios que pueden extenderse hasta la cercana Playa de la Cueva del Pirata, mientras que las puestas de sol pintan el cielo con tonalidades espectaculares, un paraíso para fotógrafos y enamorados de la naturaleza. La limpieza impecable de su entorno, sumada a estacionamientos accesibles y calles bien mantenidas, complementa una experiencia que brinda calma en todas las estaciones, siendo el invierno un momento mágico para contemplar su belleza sin prisas.`

let textoPlayaInternacional=`Reconocida por su costa rocosa y oleaje abierto al mar y al viento del norte, es un destino ideal para quienes buscan tranquilidad y espacios amplios sin aglomeraciones. Al no ser apta para el baño, se convierte en el lugar perfecto para relajarse en familia, disfrutar de caminatas solitarias o sentarse a contemplar el mar en completa calma. Sus atardeceres son un espectáculo natural, con cielos que se tiñen de colores vibrantes, ideal para fotógrafos o simplemente para desconectar. Cercano a la playa, un acogedor local ofrece café y kuchen, mientras que un restaurante cercano sirve platos como pescados frescos y empanadas de camarón con queso, típicas de la zona. Con estacionamiento accesible y ambiente familiar, es una opción sencilla pero encantadora para disfrutar de la naturaleza sin prisas.`

let textoPlayaLosTubos=`Ubicada frente a la Quebrada Las Tinajas en el sector norte de Algarrobo, es un rincón de serenidad y singularidad geológica. De superficie angosta y aguas calmas, su nombre proviene de los vestigios de un antiguo muelle construido sobre tubos de cemento, ahora cubiertos por coloridos mosaicos que añaden un toque artístico a su paisaje rocoso. Ideal para familias, sus aguas bajas y pozas naturales son seguras para que los niños exploren, mientras que los adultos pueden relajarse en su ambiente tranquilo y poco concurrido. Destaca por sus formaciones rocosas únicas, tubos sumergidos y cavernas submarinas, atrayendo a buzos y amantes del snorkel. Además, junto a la playa se encuentra una plataforma geológica con fósiles de hace 65 a 55 millones de años, un atractivo para curiosos y apasionados por la historia natural. Con estampas panorámicas que combinan mar, rocas y vestigios históricos, es un lugar perfecto para desconectar, disfrutar de caminatas o simplemente contemplar la calma del entorno`

let textoPlayaCanelillo=`Playa de arena blanca y aguas cristalinas con tonos turquesa, ideal para nadar, practicar surf o disfrutar del sol. Su ambiente tranquilo y semi-privado se debe a su ubicación resguardada entre cerros cubiertos de vegetación, lo que la protege del viento y crea un entorno íntimo. En su extremo sur, un pequeño estero forma un paisaje único, combinando mar y humedal. A pocos minutos se encuentra la Reserva Nacional Parque El Canelo, donde es posible avistar pingüinos de Humboldt, garumas y otras aves costeras, especialmente en temporada de primavera y verano. Para los amantes del trekking, la reserva ofrece senderos que recorren el borde costero con vistas al mar o rutas por cerros con miradores naturales. Es un destino perfecto para combinar relax en la playa con exploración de ecosistemas protegidos y vida silvestre.`

let textoPlayaLasCadenas=`Una de las playas más populares de la comuna, especialmente durante el verano. Sus arenas suaves y aguas tranquilas la convierten en un lugar ideal para familias con niños, quienes pueden nadar, jugar en la orilla o disfrutar de los juegos infantiles instalados en temporada. Su cercanía al centro de Algarrobo —a solo pasos— facilita el acceso y ofrece una amplia oferta de servicios, como restaurantes, hostales y comercios locales cerca de la costa. Además, cuenta con paseos peatonales, zonas de picnic y áreas sombreadas, perfectas para pasar un día relajado junto al mar. Combinando comodidad, seguridad y un ambiente familiar, es una opción destacada para quienes buscan disfrutar del mar sin alejarse de la vida urbana.`


let textoPlayaElPejerrey=`Es una de las más visitadas de la zona gracias a su fácil acceso y ambiente animado. Sus aguas cristalinas de oleaje suave y arenas claras y finas la hacen ideal para el baño, especialmente para familias con niños. Es un punto destacado para practicar actividades náuticas como buceo, paseos en bote o simplemente disfrutar de masajes en la orilla. Detrás de su costanera, encontrarás una variada oferta comercial: restaurantes, artesanías locales y servicios turísticos.
El paseo costero invita a caminatas panorámicas, perfectas para fotografías, mientras que su emblemático muelle de madera añade un atractivo histórico y funcional: desde allí parten embarcaciones hacia la cercana Isla Pájaro Niño, un destino favorito para explorar la biodiversidad del litoral. Con su combinación de servicios, seguridad y belleza natural, esta playa es una opción versátil para disfrutar del mar en un entorno activo y accesible.`

let textoPlayaElCanelillo=`Joya natural de arena blanca y aguas cristalinas con tonos turquesa, perfecta para nadar, surfear o disfrutar del sol en un ambiente tranquilo. Su ubicación entre cerros cubiertos de vegetación la protege del viento, creando un entorno íntimo y semiprivado, al que se accede a través de un bosque de pinos que añade un toque de serenidad. En su extremo sur, un pequeño estero forma un paisaje único donde el mar se mezcla con un humedal, ideal para explorar.

A pocos minutos, la Reserva Nacional Parque El Canelo ofrece senderos de trekking con vistas panorámicas al mar o rutas por cerros con miradores naturales. Aquí, entre primavera y verano, es común avistar pingüinos de Humboldt, garumas y otras aves costeras. Combinando relax playero con aventura, esta playa es ideal para familias, amantes de la naturaleza o quienes buscan desconectar sin alejarse de la comodidad: cerca hay servicios básicos y la posibilidad de sumergirse en ecosistemas protegidos. Un destino versátil donde el bosque, el mar y la vida silvestre se unen.`

let textoHumedalElMembrillo=`Este humedal es una reserva ecológica que alberga una rica biodiversidad, incluyendo aves migratorias, reptiles y una variedad de plantas acuáticas. Su importancia radica en su papel como refugio para la fauna y flora costera, así como en su valor ecológico y estético. El humedal es un lugar ideal para observadores de aves, amantes de la naturaleza y aquellos que buscan desconectar en un entorno sereno y tranquilo.`

let textoLaCuevaDeTunquen=`Este enclave costero es un paraíso para los amantes de la aventura y la naturaleza en estado puro: un refugio rocoso junto al mar, ideal para escalar, donde el rugido de las olas y las formaciones geológicas desafiantes atraen a entusiastas del riesgo. Aunque su acceso requiere esfuerzo —una caminata por la playa seguida de un trayecto hacia la cueva—, la recompensa es un paisaje mágico y sereno, alejado del bullicio, con una extensa playa de belleza salvaje y una cueva cuya cima regala vistas impresionantes. Perfecto para buscar tranquilidad o adrenalina, su ambiente poco intervenido cautiva, aunque se recomienda precaución: la zona es peligrosa para niños pequeños. Un destino donde el esfuerzo del camino se paga con la grandiosidad de lo natural.`

let textoHumedalTunquen=`Este santuario de más de 95 hectáreas despliega un mosaico de paisajes únicos: dunas, desierto, estero, humedal y praderas que albergan una biodiversidad asombrosa. En su franja costera mediterránea subhúmeda, conviven ecosistemas frágiles y diversos, como el bosque esclerófilo costero —dominado por peumos, molles y boldos, junto a arbustos como el mayú y el voqui negro—, hogar de reptiles endémicos como la lagartija tenue y aves como el cachudito y la turca. El humedal destaca como un eslabón clave en la ruta migratoria continental, siendo refugio para aves playeras como la gaviota de Franklin, el zarapito trinador y el piquero, especies altamente sensibles a perturbaciones humanas. Además, resguarda fauna vulnerable como el pejerrey de escama chica, la rana chilena y el lagarto chileno, junto a aves como el rayador y el siete colores, que tejen relaciones ecológicas complejas más allá de sus límites. Un tesoro natural donde la armonía entre ambientes áridos, boscosos y acuáticos coexiste bajo la sombra de amenazas ambientales, invitando a la conservación de su riqueza silvestre.`

let textoLaCuevaDelPirata=`Esta cueva costera combina aventura y paisajes impresionantes. El trayecto hacia la cueva es un descenso de 15 a 20 minutos por escalones demarcados ofrece sectores con sombra, bancas para descansar y vistas panorámicas, aunque la subida y miradores impresionantes hacia la playa y el humedal. La playa adyacente, de arena extensa y agua templada, cautiva con su oleaje potente y rompientes fuertes, pero no es apta para bañarse por las corrientes peligrosas; si se ingresa al mar, es clave no alejarse de la orilla. Aunque no hay baños ni kioscos en la playa, un almacén cerca del sendero provee suministros básicos, y vendedores ambulantes ofrecen ocasionalmente snacks y bebidas. Un destino ideal para caminantes y amantes de la naturaleza bravía, donde la belleza salvaje convive con precauciones necesarias `

let textoPueblitoLosArtesanos=`Este encantador espacio combina arte, naturaleza y cultura local en un ambiente acogedor y auténtico. Destaca por su feria de artesanías genuinas —tejidos, ropa, adornos, cuadros, productos naturales y dulces artesanales—, donde todo es hecho a mano, evitando baratijas comerciales. Aunque los puestos son limitados y faltan opciones más económicas, la calidad y originalidad de los productos justifican sus precios. El entorno se enriquece con un jardín impecable de suculentas y plantas grasas, que invita a relajarse, junto a una cafetería con café en grano y un rincón de lectura tranquilo. Por las mañanas, se venden hortalizas locales, mientras que las noches cobran vida con música en vivo (jazz bossa, rock, cuentacuentos, entre otros) que anima el ambiente, aunque se extrañan opciones de comida para prolongar la visita. Recientemente remodelado, el lugar cuenta con estacionamiento señalizado, accesibilidad familiar y atención cordial. Ideal para apoyar el comercio local, disfrutar de la calma diurna o el ritmo cultural nocturno, siempre respetando su filosofía ecoamigable: "No bote basura". Un rincón mágico que celebra lo handmade y lo autóctono, perfecto para souvenirs con alma. `

// Crear el pop-up para la imagen


// Cambiar el evento de clic en las imágenes para mostrar el pop-up
const htmlImagenes = (nombre) => {
    const imagenes = [];
    for (let i = 1; i <= 4; i++) {
        const imgSrc = `https://ik.imagekit.io/kirt8tkpk/img/panoramas/${nombre}/${i}.jpg?tr=f-webp`;
        imagenes.push(`
            <div class=" flex items-end justify-center relative">
                <img class=" h-64 w-64 object-cover" src="${imgSrc}" alt="">
                <button class="imagenPanoramas absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <svg class="imagenPanoramas" xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#FFFFFF">
                        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-440q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                    </svg>
                </button>
            </div>
        `);
    }
    return imagenes.join(''); // Unir todas las imágenes en un solo string
};



// Asegurarse de que el listener solo se agregue una vez
if (!imagenPanorama.dataset.listenerAdded) {
    imagenPanorama.addEventListener('click', (event) => {
        event.stopPropagation(); // Evitar que el evento se propague

        // Asegurarse de que el clic provenga de una imagen o un botón relacionado
        if (event.target.classList.contains('imagenPanoramas') || event.target.closest('.imagenPanoramas')) {
            // Verificar si ya existe un popup y eliminarlo si es necesario
            const existingPopup = document.querySelector('.popup-imagen');
            if (existingPopup) {
                existingPopup.remove(); // Eliminar el popup existente
            }

            // Obtener la imagen más cercana
            const imgElement = event.target.closest('div').querySelector('img'); // Selecciona la imagen más cercana
            const imgSrc = imgElement.src; // Obtiene la ruta de la imagen

            // Verificar si imgSrc es válido
            if (imgSrc) {
                // Mostrar la imagen en tamaño real
                const popupImagen = document.createElement('div');
                popupImagen.classList.add('popup-imagen', 'hidden', 'fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-75');
                document.body.appendChild(popupImagen);
                
                // Variables para el índice de la imagen
                let currentIndex = parseInt(imgSrc.match(/(\d+)\.jpg/)[1]); // Extraer el índice actual de la imagen
                const baseImgSrc = imgSrc.substring(0, imgSrc.lastIndexOf('/') + 1); // Obtener la parte base de la ruta de la imagen

                const updatePopupContent = () => {
                    popupImagen.innerHTML = `
                        <button class="nav-arrow left-arrow" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: white;">&#10094;</button>
                        <img src="${baseImgSrc}${currentIndex}.jpg" class="max-w-full max-h-full" alt="Imagen en tamaño real">
                        <button class="nav-arrow right-arrow" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: white;">&#10095;</button>
                        <button class="close-popup" style="position: absolute; top: 20px; right: 20px; color: white;">Cerrar</button>
                    `;

                    // Agregar eventos a las flechas
                    popupImagen.querySelector('.left-arrow').addEventListener('click', () => {
                        currentIndex = (currentIndex - 1 < 1) ? 4 : currentIndex - 1; // Decrementar el índice, reiniciar a 4 si es menor que 1
                        updatePopupContent(); // Actualizar el contenido del popup
                    });

                    popupImagen.querySelector('.right-arrow').addEventListener('click', () => {
                        currentIndex = (currentIndex + 1 > 4) ? 1 : currentIndex + 1; // Incrementar el índice, reiniciar a 1 si es mayor que 4
                        updatePopupContent(); // Actualizar el contenido del popup
                    });
                };

                updatePopupContent(); // Inicializar el contenido del popup
                popupImagen.classList.remove('hidden');

                // Evento para cerrar el popup
                popupImagen.addEventListener('click', (event) => {
                    if (event.target.classList.contains('close-popup') || event.target === popupImagen) {
                        popupImagen.classList.add('hidden');
                    }
                });

                console.log('Imagen clickeada:', imgSrc); // Verifica que se está clickeando la imagen
            } else {
                console.error('La imagen no tiene una fuente válida.'); // Mensaje de error si imgSrc es undefined
            }
        }
    });
    imagenPanorama.dataset.listenerAdded = true; // Marcar que el listener ha sido agregado
}

document.querySelectorAll('.botonUbicacion').forEach(boton => {
    boton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
        const contenidoPanoramasInicial = document.getElementById('contenidoPanoramasInicial')
        contenidoPanoramasInicial.classList.add('hidden')
        contenidoPanoramasInicial.classList.remove('flex')
        const contenidoPanoramas = document.getElementById('contenidoPanoramas')
        contenidoPanoramas.classList.remove('hidden')
        contenidoPanoramas.classList.add('flex')
        switch (event.target.textContent) {
            //actividades
            case 'Karting':
                document.getElementById('tituloPanorama').innerHTML = 'Karting'
                mapa(15, arrayKartingGo, 'La Campiña', 'Go Kart Center Algarrobo');
                mostrarTiempoViaje(arrayKartingGo);
                textoPanorama.innerHTML = textoKartingGo
                imagenPanorama.innerHTML = htmlImagenes('karting')

                break;

            case 'Cabalgatas, juegos mecánicos y otros':
                document.getElementById('tituloPanorama').innerHTML = 'Cabalgatas, juegos mecánicos <br>y otros'
                mapa(15, arrayKarting, 'La Campiña', 'Karting Algarrobo');
                mostrarTiempoViaje(arrayKarting);
                textoPanorama.innerHTML = textoKarting
                imagenPanorama.innerHTML = htmlImagenes('kartingAlg')
                break;

            case 'Paseos en Lancha':
                document.getElementById('tituloPanorama').innerHTML = 'Paseos en Lancha'
                mapa(13, arrayLancha, 'La Campiña', 'Paseos en Lancha');
                mostrarTiempoViaje(arrayLancha);
                textoPanorama.innerHTML = textoLancha
                imagenPanorama.innerHTML = htmlImagenes('paseos en lancha')
                break;

            case 'Buceo':
                document.getElementById('tituloPanorama').innerHTML = 'Buceo'
                mapa(13, buceo, 'La Campiña', 'Buceo');
                mostrarTiempoViaje(buceo);
                textoPanorama.innerHTML = textoBuceo
                imagenPanorama.innerHTML = htmlImagenes('buceo')
                break;
                //arrays playas

            case 'Playa Tunquen':
                document.getElementById('tituloPanorama').innerHTML = 'Playa Tunquen'
                mapa(12, playaTunquen, 'La Campiña', 'Playa Tunquen');
                mostrarTiempoViaje(playaTunquen);
                textoPanorama.innerHTML = textoTunquen
                imagenPanorama.innerHTML = htmlImagenes('playa tunquen')
                break;

            case 'Playa Grande El Yeco':
                document.getElementById('tituloPanorama').innerHTML = 'Playa Grande El Yeco'
                mapa(13, arrayPlayaGrande, 'La Campiña', 'Playa Grande El Yeco');
                mostrarTiempoViaje(arrayPlayaGrande);
                textoPanorama.innerHTML = textoYeco
                imagenPanorama.innerHTML = htmlImagenes('playa grande el yeco')
                break;

         

            case 'Playa El Mirasol':
                document.getElementById('tituloPanorama').innerHTML = 'Playa El Mirasol'
                mapa(15, arrayMirasol, 'La Campiña', 'Playa El Mirasol');
                mostrarTiempoViaje(arrayMirasol);
                textoPanorama.innerHTML = textoMirasol
                imagenPanorama.innerHTML = htmlImagenes('playa mirasol')
                break;

            case 'Playa Algarrobo Norte':
                document.getElementById('tituloPanorama').innerHTML = 'Playa Algarrobo Norte'
                mapa(15, arrayAlgaNorte, 'La Campiña', 'Playa Algarrobo Norte');
                mostrarTiempoViaje(arrayAlgaNorte);
                textoPanorama.innerHTML = textoAlgarroboNorte
                imagenPanorama.innerHTML = htmlImagenes('playa algarrobo norte')
                break;

            case 'Playa Internacional':
                document.getElementById('tituloPanorama').innerHTML = 'Playa Internacional'
                mapa(14, arrayPlayaInternacional, 'La Campiña', 'Playa Internacional');
                mostrarTiempoViaje(arrayPlayaInternacional);
                textoPanorama.innerHTML = textoPlayaInternacional
                imagenPanorama.innerHTML = htmlImagenes('playa internacional')
                break;
            
            case 'Playa Los Tubos':
                document.getElementById('tituloPanorama').innerHTML = 'Playa Los Tubos'
                mapa(13, arrayPlayaTubos, 'La Campiña', 'Playa Los Tubos');
                mostrarTiempoViaje(arrayPlayaTubos);
                textoPanorama.innerHTML = textoPlayaLosTubos
                imagenPanorama.innerHTML = htmlImagenes('playa los tubos')
                break;

            case 'Playa El Canelo / El Canelillo':
                document.getElementById('tituloPanorama').innerHTML = 'Playa El Canelo / El Canelillo'
                mapa(13, arrayPlayaCanelillo, 'La Campiña', 'Playa El Canelo / El Canelillo');
                mostrarTiempoViaje(arrayPlayaCanelillo);
                textoPanorama.innerHTML = textoPlayaCanelillo
                imagenPanorama.innerHTML = htmlImagenes('playa el canelo')
                break;

            case 'Playa Las Cadenas':
                document.getElementById('tituloPanorama').innerHTML = 'Playa Las Cadenas'
                mapa(14, arrayPlayaLasCadenas, 'La Campiña', 'Playa Las Cadenas');
                mostrarTiempoViaje(arrayPlayaLasCadenas);
                textoPanorama.innerHTML = textoPlayaLasCadenas
                imagenPanorama.innerHTML = htmlImagenes('playa las cadenas')
                break;

            case 'Playa El Pejerrey':
                document.getElementById('tituloPanorama').innerHTML = 'Playa El Pejerrey'
                mapa(13, arrayPlayaElPejerrey, 'La Campiña', 'Playa El Pejerrey');
                mostrarTiempoViaje(arrayPlayaElPejerrey);
                textoPanorama.innerHTML = textoPlayaElPejerrey
                imagenPanorama.innerHTML = htmlImagenes('playa el pejerrey')
                break;

            case 'Playa El Canelillo':
                document.getElementById('tituloPanorama').innerHTML = 'Playa El Canelillo'
                mapa(13, arrayPlayaElCanelillo, 'La Campiña', 'Playa El Canelillo');
                mostrarTiempoViaje(arrayPlayaElCanelillo);
                textoPanorama.innerHTML = textoPlayaElCanelillo
                imagenPanorama.innerHTML = htmlImagenes('playa el canelillo')
                break;

            case 'Humedal El Membrillo':
                document.getElementById('tituloPanorama').innerHTML = 'Humedal El Membrillo'
                mapa(15, arrayHumedalElMembrillo, 'La Campiña', 'Humedal El Membrillo');
                mostrarTiempoViaje(arrayHumedalElMembrillo);
                textoPanorama.innerHTML = textoHumedalElMembrillo
                imagenPanorama.innerHTML = htmlImagenes('humedal el membrillo')
                break;

            case 'La Cueva de Tunquen':
                document.getElementById('tituloPanorama').innerHTML = 'La Cueva de Tunquen'
                mapa(12, arrayLaCuevaDeTunquen, 'La Campiña', 'La Cueva de Tunquen');
                mostrarTiempoViaje(arrayLaCuevaDeTunquen);
                textoPanorama.innerHTML = textoLaCuevaDeTunquen
                imagenPanorama.innerHTML = htmlImagenes('cueva tunquen')
                break;

            case 'Humedal de Tunquen':
                document.getElementById('tituloPanorama').innerHTML = 'Humedal de Tunquen'
                mapa(12, arrayHumedalTunquen, 'La Campiña', 'Humedal de Tunquen');
                mostrarTiempoViaje(arrayHumedalTunquen);
                textoPanorama.innerHTML = textoHumedalTunquen
                imagenPanorama.innerHTML = htmlImagenes('humedal de tunquen')
                break;

            case 'La Cueva del Pirata':
                document.getElementById('tituloPanorama').innerHTML = 'La Cueva del Pirata'
                mapa(14, arrayLaCuevaDelPirata, 'La Campiña', 'La Cueva del Pirata');
                mostrarTiempoViaje(arrayLaCuevaDelPirata);
                textoPanorama.innerHTML = textoLaCuevaDelPirata
                imagenPanorama.innerHTML = htmlImagenes('cueva del pirata')
                break;

            case 'Pueblito Los Artesanos':
                document.getElementById('tituloPanorama').innerHTML = 'Pueblito Los Artesanos'
                mapa(14, arrayPueblitoLosArtesanos, 'La Campiña', 'Pueblito Los Artesanos');
                mostrarTiempoViaje(arrayPueblitoLosArtesanos);
                textoPanorama.innerHTML = textoPueblitoLosArtesanos
                imagenPanorama.innerHTML = htmlImagenes('pueblito artesanos')
                break;
        }
    });
});

//arrays playas

const arrayPueblitoLosArtesanos=[[-33.342974491878266, -71.64707433736787],[-33.34285700006838, -71.64862140013906],[-33.3452759171303, -71.64875376914621],[-33.345531627292516, -71.64881168058685],[-33.34841778012551, -71.65036106143525],[-33.35307636017557, -71.65283590745241],[-33.353570668579074, -71.65300872436752],[-33.35383356150425, -71.65303081079611],[-33.35401343515349, -71.65301976758181],[-33.35510650552289, -71.65282651133174],[-33.35531866104412, -71.65284859776031],[-33.35532788518549, -71.65288172740318],[-33.35543396274095, -71.65297559472465],[-33.35551236780755, -71.65308050526042],[-33.3556230571931, -71.65293142186748],[-33.35548930750117, -71.65247312847443]]

const arrayLaCuevaDelPirata=[[-33.34296732924232, -71.64711165621746],[-33.34286295511482, -71.64857969787009],[-33.33635237166003, -71.64784567704379],[-33.33158981292126, -71.64500329846712],[-33.33151152211135, -71.6450189159315],[-33.32745335197625, -71.64464409672793],[-33.32739561251487, -71.64460972485242],[-33.32735965202939, -71.6445945348423],[-33.32728773101392, -71.644642636541],[-33.32731099958425, -71.64473124493333],[-33.32688158769477, -71.6450198551255],[-33.323918089160024, -71.6491345718609],[-33.32353613167055, -71.64920494375617],[-33.32352261838752, -71.64932853204586],[-33.32353299933716, -71.64940583455707],[-33.32356760249368, -71.6494900390782],[-33.32332307321962, -71.64975231547498],[-33.32317081880096, -71.65015125164892],[-33.32293205564358, -71.65040938683964],[-33.32277864709301, -71.65050877578263],[-33.32270828669002, -71.65076691095399],[-33.322457757411634, -71.65047974105241],[-33.322305445446936, -71.6507506295661],[-33.32181466063881, -71.65102911308486]]

const arrayHumedalTunquen=[[-33.342833, -71.648583],[-33.336443, -71.647961],[-33.336228, -71.647886],[-33.335170, -71.647392],[-33.331737, -71.645010],[-33.331369, -71.644938],[-33.327378, -71.644588],[-33.326841247023445, -71.64513486923767],[-33.3222783807929, -71.64457348167286],[-33.32206515690185, -71.64505831638792],[-33.3210843202839, -71.64482865783867],[-33.3211482882259, -71.64503279877135],[-33.32070051164599, -71.64536452778691],[-33.320401992647994, -71.64546659825325],[-33.32012479552003, -71.64536452778691],[-33.31925055264944, -71.64383347079198],[-33.319207906431444, -71.64368036509248],[-33.31916526019257, -71.64286380136184],[-33.31882408953048, -71.64250655472968],[-33.31831233103344, -71.64227689618043],[-33.310914427146386, -71.6433543582796],[-33.30897381754477, -71.6421550303002],[-33.30809946276283, -71.64103225509866],[-33.30586022171527, -71.63575010846607],[-33.30586022171527, -71.63572459084949],[-33.30479389624451, -71.63467836856961],[-33.30137756672967, -71.6336748101404],[-33.30062314121297, -71.63299357149907],[-33.29976906671518, -71.6313756297259],[-33.2988153403094, -71.63074548398266],[-33.294359733887966, -71.63076251489952],[-33.29366219025872, -71.63120532001638],[-33.29364795461638, -71.63122235098243],[-33.293263591395174, -71.63227827087648],[-33.29235250144026, -71.63314685014421],[-33.29047334836128, -71.63658710528294],[-33.29043063986642, -71.63701287943378],[-33.29055876528831, -71.63805176836182],[-33.290444876033696, -71.6391076882559],[-33.289690355899864, -71.63932909084687],[-33.28910666608968, -71.63990814369203],[-33.28860839121139, -71.64140686870294],[-33.288537208853654, -71.64314402723835],[-33.29058723746069, -71.64387635904498],[-33.290459112080605, -71.64467681444856],[-33.29074383489197, -71.6452047743956],[-33.29115668131818, -71.64549430081814],[-33.2915410538211, -71.64609038462932],[-33.291099737099664, -71.64651615880332],[-33.29061570974183, -71.64648209687125],[-33.29058723746069, -71.6469589639202],[-33.28960493807208, -71.64821925540666],[-33.289291738840575, -71.64811706961046],[-33.28873651925832, -71.64770832642566],[-33.287426756504125, -71.64849175086319],[-33.2875548863367, -71.6489515869461],[-33.28728438980284, -71.64929220626676],[-33.28724167974717, -71.6493092372328],[-33.28722744305729, -71.6501778165005],[-33.287697252596686, -71.65039921905895],[-33.287569122973146, -71.65085905514184],[-33.28828095183439, -71.65266433754138]]

const arrayHumedalElMembrillo=[[-33.342964002292995, -71.6470634007079],[-33.342877840209105, -71.64858268160759],[-33.345360508549014, -71.6487543429818],[-33.34554872239582, -71.64884017366892],[-33.345459096799644, -71.65092156785587]]

const playaTunquen=[[-33.342833, -71.648583],[-33.336443, -71.647961],[-33.336228, -71.647886],[-33.335170, -71.647392],[-33.331737, -71.645010],[-33.331369, -71.644938],[-33.327378, -71.644588],[-33.326841247023445, -71.64513486923767],[-33.3222783807929, -71.64457348167286],[-33.32206515690185, -71.64505831638792],[-33.3210843202839, -71.64482865783867],[-33.3211482882259, -71.64503279877135],[-33.32070051164599, -71.64536452778691],[-33.320401992647994, -71.64546659825325],[-33.32012479552003, -71.64536452778691],[-33.31925055264944, -71.64383347079198],[-33.319207906431444, -71.64368036509248],[-33.31916526019257, -71.64286380136184],[-33.31882408953048, -71.64250655472968],[-33.31831233103344, -71.64227689618043],[-33.310914427146386, -71.6433543582796],[-33.30897381754477, -71.6421550303002],[-33.30809946276283, -71.64103225509866],[-33.30586022171527, -71.63575010846607],[-33.30586022171527, -71.63572459084949],[-33.30479389624451, -71.63467836856961],[-33.30137756672967, -71.6336748101404],[-33.30062314121297, -71.63299357149907],[-33.29976906671518, -71.6313756297259],[-33.2988153403094, -71.63074548398266],[-33.294359733887966, -71.63076251489952],[-33.29366219025872, -71.63120532001638],[-33.29364795461638, -71.63122235098243],[-33.293263591395174, -71.63227827087648],[-33.29235250144026, -71.63314685014421],[-33.29047334836128, -71.63658710528294],[-33.29043063986642, -71.63701287943378],[-33.29055876528831, -71.63805176836182],[-33.290444876033696, -71.6391076882559],[-33.289690355899864, -71.63932909084687],[-33.28910666608968, -71.63990814369203],[-33.28860839121139, -71.64140686870294],[-33.288537208853654, -71.64314402723835],[-33.29058723746069, -71.64387635904498],[-33.290459112080605, -71.64467681444856],[-33.29074383489197, -71.6452047743956],[-33.29115668131818, -71.64549430081814],[-33.2915410538211, -71.64609038462932],[-33.291099737099664, -71.64651615880332],[-33.29061570974183, -71.64648209687125],[-33.29058723746069, -71.6469589639202],[-33.28960493807208, -71.64821925540666],[-33.289291738840575, -71.64811706961046],[-33.28873651925832, -71.64770832642566],[-33.287426756504125, -71.64849175086319],[-33.2875548863367, -71.6489515869461],[-33.28728438980284, -71.64929220626676],[-33.28724167974717, -71.6493092372328],[-33.28722744305729, -71.6501778165005],[-33.287697252596686, -71.65039921905895],[-33.287569122973146, -71.65085905514184],[-33.28828095183439, -71.65266433754138]]


const arrayPlayaGrande=[[-33.342833, -71.648583],[-33.336443, -71.647961],[-33.336228, -71.647886],[-33.335170, -71.647392],[-33.331737, -71.645010],[-33.331369, -71.644938],[-33.327378, -71.644588],[-33.326838, -71.645020],[-33.322383, -71.644626],[-33.322076, -71.645125],[-33.321209, -71.644888],[-33.320561, -71.645558],[-33.320122, -71.645427],[-33.319288, -71.643956],[-33.319255, -71.643903],[-33.319233, -71.643234],[-33.319069, -71.642761],[-33.319069, -71.642761],[-33.318586, -71.642288],[-33.318114, -71.642117],[-33.311839, -71.643303],[-33.310751, -71.643335],[-33.308883, -71.642769],[-33.308865, -71.642661],[-33.308435, -71.642894],[-33.309740, -71.647463],[-33.309740, -71.647463],[-33.311176, -71.649559],[-33.311757, -71.650047],[-33.311897, -71.650176],[-33.312466, -71.651506],[-33.312664, -71.651390],[-33.312848, -71.651578],[-33.312957, -71.651605],[-33.313062, -71.651587],[-33.313057, -71.651584],[-33.313368, -71.651441]]


//array actividades

const arrayKartingGo = [[-33.343041, -71.647049],[-33.342934, -71.648616],[-33.341598, -71.648425],[-33.341724, -71.647835]];

const arrayKarting = [[-33.34296651651474, -71.64706854531225],[-33.34286915579859, -71.6485755850234],[-33.34518228271694, -71.64876848611786],[-33.34621244556918, -71.64909460430891],[-33.34736552582238, -71.64975319856447],[-33.347282625137176, -71.64921188821742]];

const arrayLancha =[[-33.34296570363092, -71.64707191436429],[-33.34288036944729, -71.64859020810826],[-33.345242543956175, -71.64878521833636],[-33.35342928311007, -71.65292529802709],[-33.355054300167936, -71.65281386362669],[-33.35545376271855, -71.65297637213139],[-33.35561664983435, -71.65325031503933],[-33.35560501505048, -71.65478718118385],[-33.35641944618644, -71.65859452342627],[-33.357179575050964, -71.65931884710008],[-33.35736572803873, -71.66040533253154],[-33.359033330826, -71.66347442183421],[-33.36082853196377, -71.66532772002333],[-33.36145395610781, -71.66696067309181],[-33.3612429701563, -71.66810644677804],[-33.36116008267825, -71.66909884918341],[-33.36093402551869, -71.67001907686841],[-33.360888814016306, -71.67054234359125],[-33.36109226559204, -71.67094832639346],[-33.3613258575554, -71.67098441375366],[-33.36129571669214, -71.6715437678367]]

const buceo =[[-33.34296570363092, -71.64707191436429],[-33.34288036944729, -71.64859020810826],[-33.345242543956175, -71.64878521833636],[-33.35342928311007, -71.65292529802709],[-33.355054300167936, -71.65281386362669],[-33.35545376271855, -71.65297637213139],[-33.35561664983435, -71.65325031503933],[-33.35560501505048, -71.65478718118385],[-33.35641944618644, -71.65859452342627],[-33.357179575050964, -71.65931884710008],[-33.35736572803873, -71.66040533253154],[-33.359033330826, -71.66347442183421],[-33.36082853196377, -71.66532772002333],[-33.36145395610781, -71.66696067309181],[-33.3612429701563, -71.66810644677804],[-33.36274678095118, -71.6715189609879],[-33.36341037140802, -71.67244481417201]]

const arrayMirasol=[[-33.34295430942102, -71.64700696544438],[-33.3428109041592, -71.64861629082755],[-33.336249860892345, -71.6478652723154],[-33.33501288752662, -71.64720008449035],[-33.33524594172491, -71.6478223569708],[-33.33296915381785, -71.64934585166688],[-33.33201898063607, -71.64913127494913],[-33.33171420591089, -71.64979646277418]]

const arrayAlgaNorte=[[-33.342951536497026, -71.64706281848507],[-33.342887584565034, -71.64861939303228],[-33.33640687862102, -71.6479048997975],[-33.33510641572054, -71.64739454748693],[-33.33525565015429, -71.64785386456644],[-33.33517037336631, -71.64787938218197],[-33.33359273773022, -71.64895112203415],[-33.33418968430407, -71.65027803804162],[-33.33640687862102, -71.6505332141969]]

const arrayPlayaInternacional=[[-33.34301378785888, -71.64707649534816],[-33.34301378785888, -71.64850862311756],[-33.34533475805078, -71.64876640611607],[-33.35342177905739, -71.65309143197969],[-33.35382850287584, -71.65300550431353],[-33.35516828554265, -71.65271907875965],[-33.35557500120043, -71.65306278942431],[-33.355742471801264, -71.65334921497819],[-33.35559892559171, -71.65495319807994],[-33.35602956351015, -71.65690089184633]]

const arrayPlayaTubos=[[-33.342846680545335, -71.64695685560038],[-33.342774977855335, -71.64867346931428],[-33.34564303940456, -71.64893096137136],[-33.35338633371567, -71.65305083428467],[-33.355200011974475, -71.65291198224271],[-33.355421210002085, -71.65300258107968],[-33.35563459307812, -71.65323249912113],[-33.35563459307812, -71.65330913846827],[-33.35559191651147, -71.65475677063407],[-33.35599734311355, -71.65682603300714],[-33.356424105917675, -71.65863131540668],[-33.357142485282374, -71.65930403867263],[-33.35735586413856, -71.66035144308368],[-33.35924780047889, -71.66383427574824],[-33.360904989118914, -71.66539260922255],[-33.36144552450236, -71.6668913342335],[-33.36126771718101, -71.66814311023694],[-33.36283952135477, -71.67168555130027],[-33.36364319309579, -71.67269889392917],[-33.3643899610177, -71.67447862987966]]

const arrayPlayaCanelillo=[[-33.342846680545335, -71.64695685560038],[-33.342774977855335, -71.64867346931428],[-33.34564303940456, -71.64893096137136],[-33.35338633371567, -71.65305083428467],[-33.355200011974475, -71.65291198224271],[-33.355421210002085, -71.65300258107968],[-33.35563459307812, -71.65323249912113],[-33.35563459307812, -71.65330913846827],[-33.35559191651147, -71.65475677063407],[-33.35599734311355, -71.65682603300714],[-33.356424105917675, -71.65863131540668],[-33.357142485282374, -71.65930403867263],[-33.35735586413856, -71.66035144308368],[-33.35924780047889, -71.66383427574824],[-33.360904989118914, -71.66539260922255],[-33.36144552450236, -71.6668913342335],[-33.36272600296361, -71.67151418333702],[-33.363417014612665, -71.67159297935757],[-33.36414092569263, -71.6722102148519],[-33.368624828943844, -71.66831517693642],[-33.36956045005095, -71.66855103171025],[-33.378195674850375, -71.68397047485385],[-33.37970003659079, -71.68554912883435],[-33.37754429365224, -71.68556770123412],[-33.377141055227504, -71.68595772162931],[-33.37391508048648, -71.69353526095549],[-33.37236408851835, -71.69427815694631]]

const arrayPlayaLasCadenas=[[-33.342846680545335, -71.64695685560038],[-33.342774977855335, -71.64867346931428],[-33.34564303940456, -71.64893096137136],[-33.35338633371567, -71.65305083428467],[-33.355200011974475, -71.65291198224271],[-33.355421210002085, -71.65300258107968],[-33.35563459307812, -71.65323249912113],[-33.35563459307812, -71.65330913846827],[-33.35559191651147, -71.65475677063407],[-33.35599734311355, -71.65682603300714],[-33.356424105917675, -71.65863131540668],[-33.357142485282374, -71.65930403867263],[-33.35735586413856, -71.66035144308368],[-33.35924780047889, -71.66383427574824]]

const arrayPlayaElPejerrey=[[-33.34296570363092, -71.64707191436429],[-33.34288036944729, -71.64859020810826],[-33.345242543956175, -71.64878521833636],[-33.35342928311007, -71.65292529802709],[-33.355054300167936, -71.65281386362669],[-33.35545376271855, -71.65297637213139],[-33.35561664983435, -71.65325031503933],[-33.35560501505048, -71.65478718118385],[-33.35641944618644, -71.65859452342627],[-33.357179575050964, -71.65931884710008],[-33.35736572803873, -71.66040533253154],[-33.359033330826, -71.66347442183421],[-33.36082853196377, -71.66532772002333],[-33.36145395610781, -71.66696067309181],[-33.36143309734807, -71.66735515658351],[-33.361279362667474, -71.66799938451246],[-33.3612976644294, -71.66818344963501],[-33.36154290766793, -71.66877947003185],[-33.361217136648115, -71.66905118521277],[-33.361154910584254, -71.66912568776236],[-33.36103411868622, -71.66962967559793],[-33.36093019525557, -71.67006271258577],[-33.36088533976154, -71.67041358391104],[-33.36094215671674, -71.67067494724515]]

const arrayPlayaElCanelillo=[[-33.342846680545335, -71.64695685560038],[-33.342774977855335, -71.64867346931428],[-33.34564303940456, -71.64893096137136],[-33.35338633371567, -71.65305083428467],[-33.355200011974475, -71.65291198224271],[-33.355421210002085, -71.65300258107968],[-33.35563459307812, -71.65323249912113],[-33.35563459307812, -71.65330913846827],[-33.35559191651147, -71.65475677063407],[-33.35599734311355, -71.65682603300714],[-33.356424105917675, -71.65863131540668],[-33.357142485282374, -71.65930403867263],[-33.35735586413856, -71.66035144308368],[-33.35924780047889, -71.66383427574824],[-33.360904989118914, -71.66539260922255],[-33.36144552450236, -71.6668913342335],[-33.36272600296361, -71.67151418333702],[-33.363417014612665, -71.67159297935757],[-33.36414092569263, -71.6722102148519],[-33.368624828943844, -71.66831517693642],[-33.36956045005095, -71.66855103171025],[-33.378195674850375, -71.68397047485385],[-33.37970003659079, -71.68554912883435],[-33.37754429365224, -71.68556770123412],[-33.377141055227504, -71.68595772162931],[-33.37391508048648, -71.69353526095549],[-33.37236408851835, -71.69427815694631]]

const obtenerTiempoViaje = async (inicio, final, modo) => {
    const apiKey = '5b3ce3597851110001cf62487e358f23a94f4f46a5be5249037ef900'; // Reemplaza con tu clave de API de OpenRouteService
    const url = `https://api.openrouteservice.org/v2/directions/${modo}?api_key=${apiKey}&start=${inicio}&end=${final}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Verificar si hay características en la respuesta
        if (data && data.features && data.features.length > 0) {
            const duration = data.features[0].properties.summary.duration; // Acceder a duration
            return Math.ceil(duration / 60); // Retornar el tiempo en minutos sin decimales, redondeando hacia arriba
        } else {
            console.error('No se encontraron características en la respuesta de la API.');
        }
    } catch (error) {
        console.error('Error al obtener el tiempo de viaje:', error);
    }
}


const mostrarTiempoViaje = async (latLngArray) => {
    let [lat, lng] = latLngArray[0]; // Desestructurar las coordenadas
    let inicio = [lng, lat]; // Invertir las coordenadas
    let [lat2, lng2] = latLngArray[latLngArray.length - 1]; // Desestructurar las coordenadas
    let final = [lng2, lat2]; // Invertir las coordenadas

    const tiempoAPie = await obtenerTiempoViaje(inicio, final, 'foot-walking');
    const tiempoEnAuto = await obtenerTiempoViaje(inicio, final, 'driving-car');

    // Verificar si los tiempos son válidos
    if (tiempoAPie > 0 && tiempoEnAuto >0) {
        document.getElementById('tiempoViaje').innerHTML = `<div class="flex flex-row ">${iconoTiempo}${iconoCaminata} a pie: ${tiempoAPie} minutos.</div><div class="flex flex-row">${iconoTiempo}${iconoAuto} en auto: ${tiempoEnAuto} minutos</div>`;
    }
}




// Agregar clases CSS para la animación
const navbar = document.getElementById('navbar');
navbar.classList.add('transition-opacity', 'duration-500', 'opacity-0', 'hidden'); // Inicialmente oculta

// Función para mostrar la navbar al entrar en la sección 'bajada'
function mostrarNavbar() {
    const carruselSection = document.getElementById('carrusel'); // Cambiado a 'carrusel'
    const rect = carruselSection.getBoundingClientRect();

    // Verifica si la sección 'carrusel' está completamente fuera de la ventana
    if (rect.bottom < 0) { // Cambiado para verificar si está fuera
        navbar.classList.remove('hidden'); // Mostrar la navbar
        navbar.classList.remove('opacity-0'); // Hacerla visible
        navbar.classList.add('flex', 'opacity-100'); // Asegúrate de que sea visible
    } else {
        navbar.classList.remove('opacity-100'); // Ocultar con animación
        navbar.classList.add('opacity-0'); // Asegúrate de que sea invisible

        // Agregar un pequeño retraso antes de ocultar completamente
        setTimeout(() => {
            if (navbar.classList.contains('opacity-0')) {
                navbar.classList.add('hidden'); // Ocultar la navbar si está completamente transparente
            }
        }, 500); // Debe coincidir con la duración de la transición
    }
}

// Agregar el evento de scroll
window.addEventListener('scroll', mostrarNavbar);

// Llamar a la función al cargar la página para verificar la posición inicial
mostrarNavbar();






/* ICONOS */

const iconoTiempo = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2D5132"><path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></svg>'

const iconoCaminata ='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2D5132"><path d="m280-40 112-564-72 28v136h-80v-188l202-86q14-6 29.5-7t29.5 4q14 5 26.5 14t20.5 23l40 64q26 42 70.5 69T760-520v80q-70 0-125-29t-94-74l-25 123 84 80v300h-80v-260l-84-64-72 324h-84Zm260-700q-33 0-56.5-23.5T460-820q0-33 23.5-56.5T540-900q33 0 56.5 23.5T620-820q0 33-23.5 56.5T540-740Z"/></svg>'

const iconoAuto='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2D5132"><path d="M240-200v40q0 17-11.5 28.5T200-120h-40q-17 0-28.5-11.5T120-160v-320l84-240q6-18 21.5-29t34.5-11h440q19 0 34.5 11t21.5 29l84 240v320q0 17-11.5 28.5T800-120h-40q-17 0-28.5-11.5T720-160v-40H240Zm-8-360h496l-42-120H274l-42 120Zm-32 80v200-200Zm100 160q25 0 42.5-17.5T360-380q0-25-17.5-42.5T300-440q-25 0-42.5 17.5T240-380q0 25 17.5 42.5T300-320Zm360 0q25 0 42.5-17.5T720-380q0-25-17.5-42.5T660-440q-25 0-42.5 17.5T600-380q0 25 17.5 42.5T660-320Zm-460 40h560v-200H200v200Z"/></svg> '

const iconoCierre='<svg xmlns="http://www.w3.org/2000/svg" class="h-5 lg:h-10 w-5 lg:w-10"  viewBox="0 -960 960 960"  fill="#2D5132"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-440q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>'

const iconoPlanta='<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover lg:h-[500px] lg:w-[500px] " viewBox="0 -960 960 960" fill="#2D5132"><path d="M440-120v-319q-64 0-123-24.5T213-533q-45-45-69-104t-24-123v-80h80q63 0 122 24.5T426-746q31 31 51.5 68t31.5 79q5-7 11-13.5t13-13.5q45-45 104-69.5T760-720h80v80q0 64-24.5 123T746-413q-45 45-103.5 69T520-320v200h-80Zm0-400q0-48-18.5-91.5T369-689q-34-34-77.5-52.5T200-760q0 48 18 92t52 78q34 34 78 52t92 18Zm80 120q48 0 91.5-18t77.5-52q34-34 52.5-78t18.5-92q-48 0-92 18.5T590-569q-34 34-52 77.5T520-400Zm0 0Zm-80-120Z"/></svg>'

const iconoPiscina='<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover lg:h-[500px] lg:w-[500px] " viewBox="0 -960 960 960"  fill="#2d4551"><path d="M80-120v-80q38 0 57-20t75-20q56 0 77 20t57 20q36 0 57-20t77-20q56 0 77 20t57 20q36 0 57-20t77-20q56 0 75 20t57 20v80q-59 0-77.5-20T748-160q-36 0-57 20t-77 20q-56 0-77-20t-57-20q-36 0-57 20t-77 20q-56 0-77-20t-57-20q-36 0-54.5 20T80-120Zm0-180v-80q38 0 57-20t75-20q56 0 77.5 20t56.5 20q36 0 57-20t77-20q56 0 77 20t57 20q36 0 57-20t77-20q56 0 75 20t57 20v80q-59 0-77.5-20T748-340q-36 0-55.5 20T614-300q-57 0-77.5-20T480-340q-38 0-56.5 20T346-300q-59 0-78.5-20T212-340q-36 0-54.5 20T80-300Zm196-204 133-133-40-40q-33-33-70-48t-91-15v-100q75 0 124 16.5t96 63.5l256 256q-17 11-33 17.5t-37 6.5q-36 0-57-20t-77-20q-56 0-77 20t-57 20q-21 0-37-6.5T276-504Zm392-336q42 0 71 29.5t29 70.5q0 42-29 71t-71 29q-42 0-71-29t-29-71q0-41 29-70.5t71-29.5Z"/></svg>'

const iconoNinos='<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover lg:h-[500px] lg:w-[500px] " viewBox="0 -960 960 960" fill="#6F4C3E"><path d="M480-480q0-91 64.5-155.5T700-700q91 0 155.5 64.5T920-480H480ZM260-260q-91 0-155.5-64.5T40-480h440q0 91-64.5 155.5T260-260Zm220-220q-91 0-155.5-64.5T260-700q0-91 64.5-155.5T480-920v440Zm0 440v-440q91 0 155.5 64.5T700-260q0 91-64.5 155.5T480-40Z"/></svg>'

const iconoQuincho='<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover lg:h-[500px] lg:w-[500px] "  viewBox="0 -960 960 960"  fill="#512d45"><path d="M640-320q50 0 85 35t35 85q0 50-35 85t-85 35q-38 0-68.5-22T528-160H274l-40 62q-9 14-25.5 17.5T178-86q-14-9-17.5-25.5T166-142l158-242q-72-33-118-101.5T160-640h560q0 86-46 154.5T556-384l23 36q-21 10-34.5 20T515-300l-40-62q-8 2-17 2h-36q-9 0-17-2l-79 122h202q13-36 43.5-58t68.5-22Zm0 160q17 0 28.5-11.5T680-200q0-17-11.5-28.5T640-240q-17 0-28.5 11.5T600-200q0 17 11.5 28.5T640-160ZM440-440q60 0 109.5-33t74.5-87H256q26 54 75 87t109 33ZM336-680q5-29-1.5-49T307-775q-20-26-26.5-49.5T279-880h40q-5 29 1.5 48.5T348-786q21 26 27 49.5t1 56.5h-40Zm100 0q5-29-1-49t-27-46q-21-25-27.5-48.5T379-880h40q-5 29 1.5 48.5T448-786q20 25 26.5 48.5T476-680h-40Zm100 0q5-29-1-49t-27-46q-21-25-27.5-48.5T479-880h40q-5 29 1.5 48.5T548-786q20 25 26.5 48.5T576-680h-40Zm-96 240Z"/></svg>'

function setImageOpacity(images, opacities) {
    images.forEach((img, index) => {
        img.classList.toggle('opacity-1', opacities[index] === 1);
        img.classList.toggle('opacity-0', opacities[index] === 0);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('sidebarPanoramas'); // Usa el contenedor adecuado

    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('botonUbicacion')) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
        const contenidoPanoramasInicial = document.getElementById('contenidoPanoramasInicial')
        contenidoPanoramasInicial.classList.add('hidden')
        contenidoPanoramasInicial.classList.remove('flex')
        const contenidoPanoramas = document.getElementById('contenidoPanoramas')
        contenidoPanoramas.classList.remove('hidden')
        contenidoPanoramas.classList.add('flex')
        switch (event.target.textContent) {
            //actividades
            case 'Karting':
                document.getElementById('tituloPanorama').innerHTML = 'Karting'
                mapa(15, arrayKartingGo, 'La Campiña', 'Go Kart Center Algarrobo');
                mostrarTiempoViaje(arrayKartingGo);
                textoPanorama.innerHTML = textoKartingGo
                imagenPanorama.innerHTML = htmlImagenes('karting')

                break;

            case 'Cabalgatas, juegos mecánicos y otros':
                document.getElementById('tituloPanorama').innerHTML = 'Cabalgatas, juegos mecánicos <br> y otros'
                mapa(15, arrayKarting, 'La Campiña', 'Karting Algarrobo');
                mostrarTiempoViaje(arrayKarting);
                textoPanorama.innerHTML = textoKarting
                imagenPanorama.innerHTML = htmlImagenes('kartingAlg')
                break;

            case 'Paseos en Lancha':
                document.getElementById('tituloPanorama').innerHTML = 'Paseos en Lancha'
                mapa(13, arrayLancha, 'La Campiña', 'Paseos en Lancha');
                mostrarTiempoViaje(arrayLancha);
                textoPanorama.innerHTML = textoLancha
                imagenPanorama.innerHTML = htmlImagenes('paseos en lancha')
                break;

            case 'Buceo':
                document.getElementById('tituloPanorama').innerHTML = 'Buceo'
                mapa(13, buceo, 'La Campiña', 'Buceo');
                mostrarTiempoViaje(buceo);
                textoPanorama.innerHTML = textoBuceo
                imagenPanorama.innerHTML = htmlImagenes('buceo')
                break;
                //arrays playas

            case 'Playa Tunquen':
                document.getElementById('tituloPanorama').innerHTML = 'Playa Tunquen'
                mapa(12, playaTunquen, 'La Campiña', 'Playa Tunquen');
                mostrarTiempoViaje(playaTunquen);
                textoPanorama.innerHTML = textoTunquen
                imagenPanorama.innerHTML = htmlImagenes('playa tunquen')
                break;

            case 'Playa Grande El Yeco':
                document.getElementById('tituloPanorama').innerHTML = 'Playa Grande El Yeco'
                mapa(13, arrayPlayaGrande, 'La Campiña', 'Playa Grande El Yeco');
                mostrarTiempoViaje(arrayPlayaGrande);
                textoPanorama.innerHTML = textoYeco
                imagenPanorama.innerHTML = htmlImagenes('playa grande el yeco')
                break;

         

            case 'Playa El Mirasol':
                document.getElementById('tituloPanorama').innerHTML = 'Playa El Mirasol'
                mapa(15, arrayMirasol, 'La Campiña', 'Playa El Mirasol');
                mostrarTiempoViaje(arrayMirasol);
                textoPanorama.innerHTML = textoMirasol
                imagenPanorama.innerHTML = htmlImagenes('playa mirasol')
                break;

            case 'Playa Algarrobo Norte':
                document.getElementById('tituloPanorama').innerHTML = 'Playa Algarrobo Norte'
                mapa(15, arrayAlgaNorte, 'La Campiña', 'Playa Algarrobo Norte');
                mostrarTiempoViaje(arrayAlgaNorte);
                textoPanorama.innerHTML = textoAlgarroboNorte
                imagenPanorama.innerHTML = htmlImagenes('playa algarrobo norte')
                break;

            case 'Playa Internacional':
                document.getElementById('tituloPanorama').innerHTML = 'Playa Internacional'
                mapa(14, arrayPlayaInternacional, 'La Campiña', 'Playa Internacional');
                mostrarTiempoViaje(arrayPlayaInternacional);
                textoPanorama.innerHTML = textoPlayaInternacional
                imagenPanorama.innerHTML = htmlImagenes('playa internacional')
                break;
            
            case 'Playa Los Tubos':
                document.getElementById('tituloPanorama').innerHTML = 'Playa Los Tubos'
                mapa(13, arrayPlayaTubos, 'La Campiña', 'Playa Los Tubos');
                mostrarTiempoViaje(arrayPlayaTubos);
                textoPanorama.innerHTML = textoPlayaLosTubos
                imagenPanorama.innerHTML = htmlImagenes('playa los tubos')
                break;

            case 'Playa El Canelo / El Canelillo':
                document.getElementById('tituloPanorama').innerHTML = 'Playa El Canelo / El Canelillo'
                mapa(13, arrayPlayaCanelillo, 'La Campiña', 'Playa El Canelo / El Canelillo');
                mostrarTiempoViaje(arrayPlayaCanelillo);
                textoPanorama.innerHTML = textoPlayaCanelillo
                imagenPanorama.innerHTML = htmlImagenes('playa el canelo')
                break;

            case 'Playa Las Cadenas':
                document.getElementById('tituloPanorama').innerHTML = 'Playa Las Cadenas'
                mapa(14, arrayPlayaLasCadenas, 'La Campiña', 'Playa Las Cadenas');
                mostrarTiempoViaje(arrayPlayaLasCadenas);
                textoPanorama.innerHTML = textoPlayaLasCadenas
                imagenPanorama.innerHTML = htmlImagenes('playa las cadenas')
                break;

            case 'Playa El Pejerrey':
                document.getElementById('tituloPanorama').innerHTML = 'Playa El Pejerrey'
                mapa(13, arrayPlayaElPejerrey, 'La Campiña', 'Playa El Pejerrey');
                mostrarTiempoViaje(arrayPlayaElPejerrey);
                textoPanorama.innerHTML = textoPlayaElPejerrey
                imagenPanorama.innerHTML = htmlImagenes('playa el pejerrey')
                break;

            case 'Playa El Canelillo':
                document.getElementById('tituloPanorama').innerHTML = 'Playa El Canelillo'
                mapa(13, arrayPlayaElCanelillo, 'La Campiña', 'Playa El Canelillo');
                mostrarTiempoViaje(arrayPlayaElCanelillo);
                textoPanorama.innerHTML = textoPlayaElCanelillo
                imagenPanorama.innerHTML = htmlImagenes('playa el canelillo')
                break;

            case 'Humedal El Membrillo':
                document.getElementById('tituloPanorama').innerHTML = 'Humedal El Membrillo'
                mapa(15, arrayHumedalElMembrillo, 'La Campiña', 'Humedal El Membrillo');
                mostrarTiempoViaje(arrayHumedalElMembrillo);
                textoPanorama.innerHTML = textoHumedalElMembrillo
                imagenPanorama.innerHTML = htmlImagenes('humedal el membrillo')
                break;

            case 'La Cueva de Tunquen':
                document.getElementById('tituloPanorama').innerHTML = 'La Cueva de Tunquen'
                mapa(12, arrayLaCuevaDeTunquen, 'La Campiña', 'La Cueva de Tunquen');
                mostrarTiempoViaje(arrayLaCuevaDeTunquen);
                textoPanorama.innerHTML = textoLaCuevaDeTunquen
                imagenPanorama.innerHTML = htmlImagenes('cueva tunquen')
                break;

            case 'Humedal de Tunquen':
                document.getElementById('tituloPanorama').innerHTML = 'Humedal de Tunquen'
                mapa(12, arrayHumedalTunquen, 'La Campiña', 'Humedal de Tunquen');
                mostrarTiempoViaje(arrayHumedalTunquen);
                textoPanorama.innerHTML = textoHumedalTunquen
                imagenPanorama.innerHTML = htmlImagenes('humedal de tunquen')
                break;

            case 'La Cueva del Pirata':
                document.getElementById('tituloPanorama').innerHTML = 'La Cueva del Pirata'
                mapa(14, arrayLaCuevaDelPirata, 'La Campiña', 'La Cueva del Pirata');
                mostrarTiempoViaje(arrayLaCuevaDelPirata);
                textoPanorama.innerHTML = textoLaCuevaDelPirata
                imagenPanorama.innerHTML = htmlImagenes('cueva del pirata')
                break;

            case 'Pueblito Los Artesanos':
                document.getElementById('tituloPanorama').innerHTML = 'Pueblito Los Artesanos'
                mapa(14, arrayPueblitoLosArtesanos, 'La Campiña', 'Pueblito Los Artesanos');
                mostrarTiempoViaje(arrayPueblitoLosArtesanos);
                textoPanorama.innerHTML = textoPueblitoLosArtesanos
                imagenPanorama.innerHTML = htmlImagenes('pueblito artesanos')
                break;
            // Resto de tu lógica de manejo de clics
        }}
    });
});


