// Function to check if the script should run on the current page
function isProductPage() {
    // Add logic to check if the current page is a product page
    return document.querySelector('.product-title') && document.querySelector('.price');
}

// Function to create and show the overlay with scores
function showOverlay(scores) {
    let overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '10px';
    overlay.style.right = '10px';
    overlay.style.width = '300px';
    overlay.style.padding = '20px';
    overlay.style.backgroundColor = '#fff';
    overlay.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    overlay.style.borderRadius = '8px';
    overlay.style.zIndex = '10000';
    overlay.style.fontFamily = 'Arial, sans-serif';
    overlay.style.color = '#333';
    overlay.style.border = '1px solid #ddd';

    // Create the close button
    let closeButton = document.createElement('button');
    closeButton.innerText = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50%';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '5px 10px';
    closeButton.style.fontSize = '16px';

    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    // Append close button to overlay
    overlay.appendChild(closeButton);

    // Add the scores to the overlay
    overlay.innerHTML += `
        <h3>ConsumeWise Scores</h3>
        <p><strong>Health:</strong> ${scores.health_score}/100</p>
        <p><strong>Price:</strong> $${scores.price}</p>
    `;

    // Append overlay to the body
    document.body.appendChild(overlay);
}

// Function to extract product information from the current page
function extractProductInfo() {
    const productTitle = document.querySelector('.product-title')?.innerText || 'Product title not found';
    const price = document.querySelector('.price')?.innerText || 'Price not available';

    return { product: productTitle, price: price };
}

// Function to fetch product scores based on the product title
async function getProductScores(productTitle) {
    try {
        const response = await fetch(`http://localhost:5000/get_product_info?product_id=${encodeURIComponent(productTitle)}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (data.error) {
            console.error(`Error: ${data.error}`);
            return { error: data.error };
        } else {
            return {
                health_score: data.health_score,
                price: data.price
            };
        }
    } catch (error) {
        console.error(`Error fetching product scores: ${error.message}`);
        return { error: error.message };
    }
}

// Main logic
if (isProductPage()) {
    const { product } = extractProductInfo();

    // Fetch product scores dynamically
    getProductScores(product).then(scores => {
        if (!scores.error) {
            showOverlay(scores);
        } else {
            console.error(`Error fetching scores: ${scores.error}`);
        }
    });
}
