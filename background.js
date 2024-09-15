// Log when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log('ConsumeWise Extension installed');
    // Optionally, you can set up initial configurations here
    // For example, setting default values in storage
    chrome.storage.local.set({ initialized: true }, () => {
        console.log('Initial configuration set.');
    });
});

// Handle clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked');

    // Inject the content script into the active tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    }, () => {
        if (chrome.runtime.lastError) {
            console.error('Failed to inject content script:', chrome.runtime.lastError);
        } else {
            console.log('Content script injected successfully');
        }
    });
});

// Handle messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received:', message);

    switch (message.action) {
        case 'getProductInfo':
            // Handle the request to retrieve product information from the page
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const activeTab = tabs[0];
                if (activeTab) {
                    // Inject content script into the active tab to get product information
                    chrome.scripting.executeScript({
                        target: { tabId: activeTab.id },
                        function: extractProductInfo
                    }, (result) => {
                        if (chrome.runtime.lastError) {
                            console.error('Failed to retrieve product info:', chrome.runtime.lastError);
                            sendResponse({ error: 'Failed to retrieve product info' });
                        } else {
                            // Pass the extracted product info back to the sender
                            sendResponse(result[0]?.result || { error: 'No result returned' });
                        }
                    });
                } else {
                    sendResponse({ error: 'Active tab not found' });
                }
            });
            break;

        case 'exampleAction':
            // Handle other actions
            sendResponse({ response: 'Example action handled' });
            break;

        default:
            sendResponse({ response: 'Unknown action' });
    }

    // Indicate that the response is asynchronous
    return true;
});

// Function to extract product information from the current page
function extractProductInfo() {
    const productTitle = document.querySelector('.product-title')?.innerText || 'Product title not found';
    const price = document.querySelector('.price')?.innerText || 'Price not available';

    return { product: productTitle, price: price };
}
