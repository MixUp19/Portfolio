const points = [
    { cx: "20%", cy: "10%" },
    { cx: "80%", cy: "10%" },
    { cx: "90%", cy: "25%" },
    { cx: "80%", cy: "39%" },
    { cx: "20%", cy: "39%" },
    { cx: "10%", cy: "53%" },
    { cx: "20%", cy: "67%" },
    { cx: "80%", cy: "67%" }
];

function getAbsoluteCoordinates(svg, point) {
    const svgRect = svg.getBoundingClientRect();
    return {
        x: parseFloat(point.cx) / 100 * svgRect.width,
        y: parseFloat(point.cy) / 100 * svgRect.height
    };
}

function createPath() {
    const svg = document.getElementById("train-svg");
    let pathData = "";

    points.forEach((point, index) => {
        const { x, y } = getAbsoluteCoordinates(svg, point);
        if (index === 0) {
            pathData += `M ${x} ${y}`;
        } else {
            const prevPoint = points[index - 1];
            const prevCoords = getAbsoluteCoordinates(svg, prevPoint);
            const midX = (prevCoords.x + x) / 2;
            const midY = (prevCoords.y + y) / 2;
            pathData += ` Q ${prevCoords.x},${prevCoords.y} ${midX},${midY} T ${x},${y}`;
        }
    });

    document.getElementById("train-path").setAttribute("d", pathData);
    updateTrainAnimation();
}

function updateTrainAnimation() {
    const path = anime.path('#train-path');
    const currentProgress = animation ? animation.progress : 0;

    animation = anime({
        targets: '#train',
        translateX: path('x'),
        translateY: path('y'),
        rotate: path('angle'),
        easing: 'linear',
        duration: 5000,
        autoplay: false,
        update: function(anim) {
            const progress = Math.round(anim.progress);
            if (progress >= stations[currentStation]) {
                animation.pause();
                showPopup(stations[currentStation]);
            }
        }
    });

    animation.seek(animation.duration * (currentProgress / 100));
}

window.addEventListener("resize", createPath);
window.addEventListener("load", createPath);

const stations = [0, 25, 50, 75, 100];  // Percentages at which to stop
let currentStation = 0;
let animation;

createPath(); // Inicializa el path y la animación del tren

function showPopup(progress) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('show'));
    sections.forEach(section => section.classList.add('hide'));

    let sectionToShow;
    if (progress === 0) {
        sectionToShow = document.getElementById('resume');
    } else if (progress === 25) {
        sectionToShow = document.getElementById('education');
    } else if (progress === 50) {
        sectionToShow = document.getElementById('abilities');
    } else if (progress === 75) {
        sectionToShow = document.getElementById('projects');
    } else if (progress === 100) {
        sectionToShow = document.getElementById('end');
    }

    anime({
        targets: sectionToShow,
        opacity: [0, 1],
        translateY: [-50, 0],
        duration: 500,
        easing: 'easeOutExpo',
        begin: function() {
            sectionToShow.classList.remove('hide');
            sectionToShow.classList.add('show');
        }
    });
}

function hidePopup() {
    const sectionToHide = document.querySelector('.section.show');
    if (sectionToHide) {
        anime({
            targets: sectionToHide,
            opacity: [1, 0],
            translateY: [0, 50],
            duration: 500,
            easing: 'easeInExpo',
            complete: function() {
                sectionToHide.classList.remove('show');
                sectionToHide.classList.add('hide');
                if (currentStation >= stations.length - 1) {
                    currentStation = 0; // Reset the station to the beginning
                    animation.restart();
                } else {
                    currentStation++;
                }
                animation.play();
            }
        });
    } else {
        if (currentStation >= stations.length - 1) {
            currentStation = 0; // Reset the station to the beginning
            animation.restart();
        } else {
            currentStation++;
        }
        animation.play();
    }
}

function avanzar() {
    hidePopup();
}