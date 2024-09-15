document.getElementById('checkScores').addEventListener('click', async () => {
    console.log('Check Product Scores button clicked');
    alert("Fetching product scores...");

    // Fetch product ID (update this to get the actual product ID)
    const productId = getProductId(); // Replace with actual function to get product ID

    if (!productId) {
        alert('Product ID is missing');
        return;
    }

    try {
        // Make a request to your Flask backend
        const response = await fetch(`http://localhost:5000/get_product_info?product_id=${encodeURIComponent(productId)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            // Ensure elements exist before updating
            const productNameElement = document.getElementById('productName');
            const healthScoreElement = document.getElementById('healthScore');
            const priceElement = document.getElementById('price');

            if (productNameElement && healthScoreElement && priceElement) {
                productNameElement.textContent = `Product Name: ${data.product_name}`;
                healthScoreElement.textContent = `Health Score: ${data.health_score}`;
                priceElement.textContent = `Price: $${data.price}`;
            } else {
                alert('One or more elements are missing from the page.');
            }
        }
    } catch (error) {
        alert(`Error fetching product scores: ${error.message}`);
    }
});

// Example function to get product ID (replace with actual logic)
function getProductId() {
    // Implement logic to fetch or extract the product ID
    return 'example_product_id'; // Replace with actual ID retrieval
}
