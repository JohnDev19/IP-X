const ipAddress = document.getElementById('ipAddress');
const ipInfo = document.getElementById('ipInfo');
const mapContainer = document.getElementById('map');
const startSpeedTest = document.getElementById('startSpeedTest');
const downloadSpeed = document.getElementById('downloadSpeed');
const uploadSpeed = document.getElementById('uploadSpeed');
const ping = document.getElementById('ping');
const browserInfo = document.getElementById('browserInfo');
const darkModeToggle = document.getElementById('darkModeToggle');

const typeEffect = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                resolve();
            }
        }, speed);
    });
};

const addLoadingSpinner = (element) => {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.style.border = '4px solid #f3f3f3';
    spinner.style.borderTop = '4px solid var(--accent-color)';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '40px';
    spinner.style.height = '40px';
    spinner.style.animation = 'spin 1s linear infinite';
    spinner.style.margin = '20px auto';
    element.appendChild(spinner);

    if (!document.querySelector('style#spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
};

const removeLoadingSpinner = (element) => {
    const spinner = element.querySelector('.loading-spinner');
    if (spinner) {
        element.removeChild(spinner);
    }
};

const fetchIPInfo = async () => {
    addLoadingSpinner(ipAddress.parentElement);
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        removeLoadingSpinner(ipAddress.parentElement);
        await typeEffect(ipAddress, data.ip, 50);
        
        ipInfo.innerHTML = '';
        const infoItems = [
            { label: 'Country', value: data.country_name },
            { label: 'Region', value: data.region },
            { label: 'City', value: data.city },
            { label: 'ISP', value: data.org },
            { label: 'Latitude', value: data.latitude },
            { label: 'Longitude', value: data.longitude },
            { label: 'Timezone', value: data.timezone },
        ];

        infoItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'info-item';
            div.innerHTML = `<span class="info-label">${item.label}:</span> ${item.value}`;
            ipInfo.appendChild(div);
        });

        initializeMap(data.latitude, data.longitude);

        addInfoItemHoverEffects();

    } catch (error) {
        console.error('Error fetching IP info:', error);
        ipAddress.textContent = 'Error fetching IP address';
        removeLoadingSpinner(ipAddress.parentElement);
    }
};

const initializeMap = (latitude, longitude) => {
    try {
        const map = L.map(mapContainer).setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([latitude, longitude]).addTo(map);
    } catch (error) {
        console.error('Error initializing map:', error);
        mapContainer.textContent = 'Error loading map';
    }
};

const addInfoItemHoverEffects = () => {
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });
};

startSpeedTest.addEventListener('click', () => {
    startSpeedTest.disabled = true;
    startSpeedTest.textContent = 'Testing...';
    startSpeedTest.classList.add('pulse');

    setTimeout(() => {
        const download = (Math.random() * 100 + 10).toFixed(2);
        const upload = (Math.random() * 50 + 5).toFixed(2);
        const pingValue = Math.floor(Math.random() * 50 + 10);

        downloadSpeed.textContent = download;
        uploadSpeed.textContent = upload;
        ping.textContent = pingValue;

        startSpeedTest.disabled = false;
        startSpeedTest.textContent = 'Start Speed Test';
        startSpeedTest.classList.remove('pulse');

        [downloadSpeed, uploadSpeed, ping].forEach(el => {
            el.style.animation = 'pulse 0.5s';
            el.addEventListener('animationend', () => {
                el.style.animation = '';
            });
        });
    }, 3000);
});

const populateBrowserInfo = () => {
    const browserInfoItems = [
        { label: 'Browser', value: navigator.userAgent },
        { label: 'Platform', value: navigator.platform },
        { label: 'Screen Resolution', value: `${window.screen.width}x${window.screen.height}` },
        { label: 'Color Depth', value: `${window.screen.colorDepth}-bit` },
        { label: 'Languages', value: navigator.languages.join(', ') },
    ];

    browserInfo.innerHTML = '';
    browserInfoItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'info-item';
        div.innerHTML = `<span class="info-label">${item.label}:</span> ${item.value}`;
        browserInfo.appendChild(div);
    });
};

darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
animateOnScroll();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const addBackToTopButton = () => {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '&uarr;';
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '20px';
    backToTopButton.style.right = '20px';
    backToTopButton.style.fontSize = '24px';
    backToTopButton.style.backgroundColor = 'var(--accent-color)';
    backToTopButton.style.color = '#fff';
    backToTopButton.style.border = 'none';
    backToTopButton.style.borderRadius = '50%';
    backToTopButton.style.width = '50px';
    backToTopButton.style.height = '50px';
    backToTopButton.style.cursor = 'pointer';
    backToTopButton.style.display = 'none';
    backToTopButton.style.transition = 'opacity 0.3s, transform 0.3s';
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
            backToTopButton.style.opacity = '1';
            backToTopButton.style.transform = 'translateY(0)';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.transform = 'translateY(20px)';
        }
    });
};

const addDarkModeTooltip = () => {
    const tooltip = document.createElement('div');
    tooltip.textContent = 'Toggle Dark Mode';
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'var(--accent-color)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.top = '100%';
    tooltip.style.right = '0';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.3s';
    darkModeToggle.parentElement.style.position = 'relative';
    darkModeToggle.parentElement.appendChild(tooltip);

    darkModeToggle.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
    });

    darkModeToggle.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });
};

const init = () => {
    fetchIPInfo();
    populateBrowserInfo();
    addBackToTopButton();
    addDarkModeTooltip();
};

init();