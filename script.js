document.addEventListener('DOMContentLoaded', function() {
    // Círculo cromático aprimorado
    const circuloSVG = `
        <svg viewBox="0 0 200 200">
            <defs>
                ${createGradients()}
            </defs>
            
            <circle cx="100" cy="100" r="80" fill="none" stroke="#ddd" stroke-width="2"/>
            ${createColorWheel()}
            
            <!-- Marcadores de cor -->
            <circle cx="100" cy="20" r="4" fill="#FF0000"/>
            <circle cx="169.3" cy="130" r="4" fill="#00FF00"/>
            <circle cx="30.7" cy="130" r="4" fill="#0000FF"/>
        </svg>
    `;

    document.querySelector('.circle-container').innerHTML = circuloSVG;

    // Adicionar interatividade
    const cores = document.querySelectorAll('.cor');
    cores.forEach(cor => {
        cor.addEventListener('click', () => {
            showColorInfo(cor.style.backgroundColor);
        });
    });

    loadHarmonyImages();
});

function createGradients() {
    const colors = [
        ['#FF0000', '#FF7F00'], // Vermelho para Laranja
        ['#FF7F00', '#FFFF00'], // Laranja para Amarelo
        ['#FFFF00', '#00FF00'], // Amarelo para Verde
        ['#00FF00', '#00FFFF'], // Verde para Ciano
        ['#00FFFF', '#0000FF'], // Ciano para Azul
        ['#0000FF', '#FF00FF'], // Azul para Magenta
        ['#FF00FF', '#FF0000']  // Magenta para Vermelho
    ];

    return colors.map((color, i) => `
        <linearGradient id="grad${i}" gradientTransform="rotate(${i * 51.43})">
            <stop offset="0%" stop-color="${color[0]}"/>
            <stop offset="100%" stop-color="${color[1]}"/>
        </linearGradient>
    `).join('');
}

function createColorWheel() {
    let paths = '';
    for (let i = 0; i < 7; i++) {
        const startAngle = i * 51.43;
        const endAngle = (i + 1) * 51.43;
        paths += `
            <path d="
                M 100 100
                L ${100 + 80 * Math.cos(startAngle * Math.PI / 180)} ${100 + 80 * Math.sin(startAngle * Math.PI / 180)}
                A 80 80 0 0 1 ${100 + 80 * Math.cos(endAngle * Math.PI / 180)} ${100 + 80 * Math.sin(endAngle * Math.PI / 180)}
                Z
            " fill="url(#grad${i})" />
        `;
    }
    return paths;
}

function showColorInfo(color) {
    // Criar elemento de informação
    const info = document.createElement('div');
    info.className = 'color-description modern-card';
    
    // Get color name using an array of common colors
    const colorName = getColorName(color);
    
    info.innerHTML = `
        <h3>Cor Selecionada</h3>
        <div class="color-preview" style="background-color: ${color}"></div>
        <p>Valor: ${color}</p>
        <p>Nome aproximado: ${colorName}</p>
        <p>Sugestão de uso: ${getColorUsageSuggestion(colorName)}</p>
    `;
    
    // Encontrar ou criar container
    let container = document.querySelector('.color-info-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'color-info-container';
        document.querySelector('.circle-container').after(container);
    }
    
    container.innerHTML = '';
    container.appendChild(info);
}

function getColorName(color) {
    // Simplified color naming logic
    const colors = {
        '#FF0000': 'Vermelho',
        '#00FF00': 'Verde',
        '#0000FF': 'Azul',
        '#FFFF00': 'Amarelo',
        '#FF00FF': 'Magenta',
        '#00FFFF': 'Ciano',
        '#FF7F00': 'Laranja'
    };
    return colors[color.toUpperCase()] || 'Cor personalizada';
}

function getColorUsageSuggestion(colorName) {
    const suggestions = {
        'Vermelho': 'Ótimo para chamadas à ação e alertas',
        'Verde': 'Ideal para feedback positivo e elementos naturais',
        'Azul': 'Perfeito para links e elementos corporativos',
        'Amarelo': 'Bom para destacar informações importantes',
        'Magenta': 'Útil para elementos decorativos e criativos',
        'Ciano': 'Adequado para elementos tecnológicos e modernos',
        'Laranja': 'Excelente para botões de call-to-action secundários'
    };
    return suggestions[colorName] || 'Pode ser usado de acordo com o contexto do design';
}

async function loadHarmonyImages() {
    try {
        const harmonies = [
            {
                name: "Monocromática",
                prompt: "Professional color palette showing monochromatic blue colors, minimalist flat design"
            },
            {
                name: "Análoga",
                prompt: "Professional color palette showing analogous colors - blue, blue-green, and green, minimalist flat design"
            },
            {
                name: "Complementar",
                prompt: "Professional color palette showing complementary colors - blue and orange, minimalist flat design"
            },
            {
                name: "Triádica",
                prompt: "Professional color palette showing triadic colors - blue, red, and yellow, minimalist flat design"
            },
            {
                name: "Complementar Dividida",
                prompt: "Professional color palette showing split complementary colors - blue with yellow-orange and red-orange, minimalist flat design"
            },
            {
                name: "Quadrupla",
                prompt: "Professional color palette showing tetradic colors - blue, green, orange, and red, minimalist flat design"
            }
        ];

        for (const harmony of harmonies) {
            const result = await websim.imageGen({
                prompt: harmony.prompt,
                aspect_ratio: "16:9",
            });
            
            const imgContainer = document.querySelector(`.harmonia-${harmony.name.toLowerCase()} .harmony-image`);
            if (imgContainer) {
                imgContainer.style.backgroundImage = `url(${result.url})`;
            }
        }
    } catch (error) {
        console.error('Error loading harmony images:', error);
    }
}