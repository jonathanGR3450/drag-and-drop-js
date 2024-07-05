// script.js
document.addEventListener('DOMContentLoaded', (event) => {
    const options = document.querySelectorAll('.option');
    const points = document.querySelectorAll('.point');
    let completed = 0;
    let startTime = Date.now();
    let timerInterval;

    // Iniciar el temporizador
    startTimer();

    options.forEach(option => {
        option.addEventListener('dragstart', dragStart);
    });

    points.forEach(point => {
        point.addEventListener('dragover', dragOver);
        point.addEventListener('drop', drop);
    });

    function startTimer() {
        const timerElement = document.getElementById('timer');
        timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            if (elapsedTime < 60) {
                timerElement.textContent = `Tiempo: ${elapsedTime} segundos`;
            } else {
                const minutes = Math.floor(elapsedTime / 60);
                const seconds = elapsedTime % 60;
                timerElement.textContent = `Tiempo: ${minutes} minutos y ${seconds} segundos`;
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function dragStart(e) {
        e.dataTransfer.setData('text', e.target.id);
        e.dataTransfer.setData('target', e.target.dataset.target);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const draggedElementId = e.dataTransfer.getData('text');
        const targetId = e.dataTransfer.getData('target');
        const draggedElement = document.getElementById(draggedElementId);

        if (e.target.id === targetId) {
            e.target.appendChild(draggedElement);
            draggedElement.draggable = false;
            draggedElement.classList.add('correct');
            draggedElement.style.position = 'absolute';
            draggedElement.style.top = '0';
            draggedElement.style.left = '0';
            completed++;
            checkWin();
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Punto incorrecto, vuelve a intentarlo!"
            });
        }
    }

    function checkWin() {
        if (completed === options.length) {
            stopTimer();
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            var tiempoFormateado = "";
            if (elapsedTime < 60) {
                tiempoFormateado = ` ${elapsedTime} segundos`
            } else {
                const minutes = Math.floor(elapsedTime / 60);
                const seconds = elapsedTime % 60;
                tiempoFormateado = ` ${minutes} minutos y ${seconds} segundos`
            }
            setInterval(generarGlobos, 1000);
            Swal.fire({
                title: "Buen trabajo!",
                text: `¡Ganaste el juego en ${tiempoFormateado}!`,
                icon: "success"
            });
        }
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function generarGlobos() {
        const container = document.getElementById('balloonsContainer');
        for (let i = 0; i < 30; i++) {
            let balloon = document.createElement('div');
            balloon.classList.add('balloon');
            balloon.style.left = Math.random() * window.innerWidth + 'px';
            balloon.style.bottom = '-100px';
            balloon.style.backgroundColor = getRandomColor();
            container.appendChild(balloon);
            anime({
                targets: balloon,
                translateY: -window.innerHeight - 100,
                opacity: 1,
                duration: 4000 + Math.random() * 2000,
                easing: 'easeInOutQuad',
                complete: function(anim) {
                    balloon.remove();
                }
            });
        }
    }
});
