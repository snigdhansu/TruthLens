/** @format */

// contentScript.js

// Function to extract main content from any webpage
function getMainContent() {
	const element = document.querySelector('body');
	if (element) {
		console.log(`Extracting content from body:`); // Log which selector is used
		return element.innerText.trim();
	}
}

// Function to extract live captions
function getCaptions() {
	const captions = document.querySelector('.caption-window');
	return captions ? captions.innerText.trim() : '';
}

// Keep track of the last sent caption and current query
let accumulatedCaptions = '';
let pendingCaptions = ''; // Store new captions while waiting for fact check
let lastRequestTime = 0;
let isFactCheckPending = false;
const MIN_REQUEST_INTERVAL = 2000; // 5 seconds
const MAX_WORD_COUNT = 30;
const POPUP_DURATION = 16000; // 16 seconds for popup display

// Detect if the site is YouTube
const isYouTube = window.location.hostname.includes('youtube.com');
// Helper function to count words
function countWords(text) {
	return text.split(/\s+/).filter((word) => word.length > 0).length;
}

// Function to trim excess words to maintain max word count
function trimToMaxWords(text) {
	const words = text.split(/\s+/).filter((word) => word.length > 0);
	if (words.length <= MAX_WORD_COUNT) {
		return text;
	}
	return words.slice(-MAX_WORD_COUNT).join(' ');
}

// Function to send result.text to the backend server via POST
function sendToBackend(claimText) {
	const backendURL = 'http://localhost:8004/check';
	fetch(backendURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: claimText,
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			console.log('✅ Sent claim to backend successfully:', data);
		})
		.catch((error) => {
			console.error('❌ Error sending claim to backend:', error);
			console.error('Request details:', {
				url: backendURL,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					statement: claimText,
				}),
			});
		});
}

// Variable to store the last query text
let lastQueryText = '';

// Function to perform fact check
function performFactCheck(text) {
	isFactCheckPending = true;
	console.log('Sending message for fact-checking:', text);
	lastQueryText = text; // Store the query text externally
	chrome.runtime.sendMessage({ type: 'FACT_CHECK', text: text }, (response) => {
		if (chrome.runtime.lastError) {
			console.error('Error sending message:', chrome.runtime.lastError);
			isFactCheckPending = false;
		}
		// If no result is found, redirect to frontend with the query
		else if (
			!response ||
			response.status !== 'success' ||
			!response.claimReview ||
			response.claimReview.length === 0
		) {
			console.log('No valid fact check results found.'); // Log that no results were found
			if (!isYouTube) {
				const queryText = text; // Ensure this variable holds the correct text
				console.log('Query text before redirect:', queryText); // Log the query text
				redirectToFrontend(queryText); // Pass the correct text to the redirect function
			} else {
				console.log('This is a YouTube video, not redirecting.'); // Log if it's a YouTube video
			}
		}
	});
}

// Redirect function to frontend with the query for further fact-checking
function redirectToFrontend(queryText) {
	if (!queryText) {
		console.error('No query text provided for redirection.'); // Log an error if queryText is undefined
		return; // Exit the function if queryText is not valid
	}

	const frontendURL = `https://truthlens.tech/?q=${encodeURIComponent(
		queryText,
	)}`;
	console.log('Redirecting to frontend with URL:', frontendURL); // Log the URL being redirected to
	window.open(frontendURL, '_blank'); // Open frontend in a new tab for fact-checking
	sendToBackend(queryText); // Perform backend check with selected text as query
}

// Add styles to the document
function injectStyles() {
	const styleSheet = document.createElement('style');
	styleSheet.textContent = `
        @keyframes rainbow-border {
            0% { border-color: #ff0000; }
            17% { border-color: #ff8000; }
            33% { border-color: #ffff00; }
            50% { border-color: #00ff00; }
            67% { border-color: #0000ff; }
            83% { border-color: #8000ff; }
            100% { border-color: #ff0000; }
        }
        
        @keyframes rainbow-text {
            0% { color: #ff0000; }
            17% { color: #ff8000; }
            33% { color: #ffff00; }
            50% { color: #00ff00; }
            67% { color: #0000ff; }
            83% { color: #8000ff; }
            100% { color: #ff0000; }
        }

        .fact-check-popup {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(255, 255, 255, 0.95);
            border: 3px solid #ff0000;
            border-radius: 12px;
            padding: 15px;
            z-index: 9999;
            max-width: 350px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            animation: rainbow-border 5s linear infinite;
            backdrop-filter: blur(5px);
        }

        .fact-check-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            animation: rainbow-text 5s linear infinite;
        }

        .fact-check-claim {
            font-style: italic;
            margin-bottom: 12px;
            padding: 8px;
            background-color: rgba(0,0,0,0.05);
            border-radius: 6px;
        }

        .fact-check-source {
            margin-bottom: 8px;
            font-weight: 500;
        }

        .fact-check-rating {
            margin-bottom: 10px;
            border-radius: 15px;
            display: inline-block;
            font-weight: bold;
            animation: rainbow-text 5s linear infinite;
        }

        .fact-check-link {
            display: inline-block;
            margin-top: 8px;
            color: #1a73e8;
            text-decoration: none;
            transition: color 0.3s;
        }

        .fact-check-link:hover {
            text-decoration: underline;
            animation: rainbow-text 5s linear infinite;
        }
    `;
	document.head.appendChild(styleSheet);
}

// Inject styles when script loads
injectStyles();

// Function to display a fact-check button when text is selected
function displayFactCheckButton() {
	const selectedText = window.getSelection().toString().trim();
	if (selectedText) {
		// Create button if not already created
		let button = document.querySelector('#fact-check-button');
		if (!button) {
			button = document.createElement('button');
			button.id = 'fact-check-button';
			button.innerText = 'Fact-Check Selection';
			document.body.appendChild(button);

			// Style the button
			button.style.position = 'absolute';
			button.style.zIndex = '10000';
			button.style.padding = '8px 12px';
			button.style.fontSize = '14px';
			button.style.backgroundColor = '#ff0000';
			button.style.color = '#ffffff';
			button.style.border = 'none';
			button.style.borderRadius = '8px';
			button.style.cursor = 'pointer';

			// Add click event to perform fact-checking
			button.addEventListener('click', () => {
				performFactCheck(selectedText);
				button.remove(); // Remove button after use
			});
		}

		// Position the button near the selection
		const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
		button.style.top = `${rect.top + window.scrollY - 40}px`;
		button.style.left = `${rect.left + window.scrollX}px`;
	} else {
		// Remove button if no text is selected
		const button = document.querySelector('#fact-check-button');
		if (button) button.remove();
	}
}
// Check if the current site is YouTube
if (window.location.hostname.includes('youtube.com')) {
	let newText = '';
	setInterval(() => {
		const currentTime = Date.now();
		const newCaption = getCaptions(); // Get captions from YouTube
		if (newCaption) {
			newText = newCaption; // Use newCaption for YouTube
		}
		// Store new text while waiting
		if (newText) {
			pendingCaptions += ' ' + newText;
			pendingCaptions = pendingCaptions.trim();
			console.log('📝 New content captured:', {
				content: newText,
				pendingCaptions: pendingCaptions,
			});
		}

		// Only process if enough time has passed since last request
		if (currentTime - lastRequestTime >= MIN_REQUEST_INTERVAL) {
			lastRequestTime = currentTime;

			// If we have pending content, append them to accumulated captions
			if (pendingCaptions) {
				if (accumulatedCaptions) {
					accumulatedCaptions += ' ' + pendingCaptions;
				} else {
					accumulatedCaptions = pendingCaptions;
				}
				pendingCaptions = ''; // Reset pending captions
			}

			// Ensure we don't exceed MAX_WORD_COUNT words
			if (countWords(accumulatedCaptions) > MAX_WORD_COUNT) {
				accumulatedCaptions = trimToMaxWords(accumulatedCaptions);
			}

			// Perform fact check if we have content and no pending check
			if (!isFactCheckPending && accumulatedCaptions) {
				performFactCheck(accumulatedCaptions);
			}
		}
	}, 1000);
} else {
	const newContent = getMainContent();
	const currentTime = Date.now(); // Get main content from blogs or other sites
	if (newContent) {
		newText = newContent; // Use newContent for blogs
	}
	// Store new text while waiting
	if (newText) {
		pendingCaptions += ' ' + newText;
		pendingCaptions = pendingCaptions.trim();
		console.log('📝 New content captured:', {
			content: newText,
			pendingCaptions: pendingCaptions,
		});
	}

			// Style the button
			button.style.position = 'absolute';
			button.style.zIndex = '10000';
			button.style.padding = '8px 12px';
			button.style.fontSize = '14px';
			button.style.backgroundColor = '#ff0000';
			button.style.color = '#ffffff';
			button.style.border = 'none';
			button.style.borderRadius = '8px';
			button.style.cursor = 'pointer';

		// If we have pending content, append them to accumulated captions
		if (pendingCaptions) {
			if (accumulatedCaptions) {
				accumulatedCaptions += ' ' + pendingCaptions;
			} else {
				accumulatedCaptions = pendingCaptions;
			}
			pendingCaptions = ''; // Reset pending captions
			// Add click event to perform fact-checking
			button.addEventListener('click', () => {
				console.log('Fact-check button clicked, selectedText:', selectedText); // Debugging log
				if (selectedText) {
					performFactCheck(selectedText); // Call performFactCheck with selectedText
				}
				button.remove(); // Remove button after use
			});
		}

		// Position the button near the selection
		const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
		button.style.top = `${rect.top + window.scrollY - 40}px`;
		button.style.left = `${rect.left + window.scrollX}px`;
	} else {
		// Remove button if no text is selected
		const button = document.querySelector('#fact-check-button');
		if (button) button.remove();
	}
}

// Check if the current site is YouTube
if (window.location.hostname.includes('youtube.com')) {
	let newText = '';
	setInterval(() => {
		const currentTime = Date.now();
		const newCaption = getCaptions(); // Get captions from YouTube
		if (newCaption) {
			newText = newCaption; // Use newCaption for YouTube
		}
		// Store new text while waiting
		if (newText) {
			pendingCaptions += ' ' + newText;
			pendingCaptions = pendingCaptions.trim();
			console.log('📝 New content captured:', {
				content: newText,
				pendingCaptions: pendingCaptions,
			});
		}

		// Only process if enough time has passed since last request
		if (currentTime - lastRequestTime >= MIN_REQUEST_INTERVAL) {
			lastRequestTime = currentTime;

			// If we have pending content, append them to accumulated captions
			if (pendingCaptions) {
				if (accumulatedCaptions) {
					accumulatedCaptions += ' ' + pendingCaptions;
				} else {
					accumulatedCaptions = pendingCaptions;
				}
				pendingCaptions = ''; // Reset pending captions
			}

			// Ensure we don't exceed MAX_WORD_COUNT words
			if (countWords(accumulatedCaptions) > MAX_WORD_COUNT) {
				accumulatedCaptions = trimToMaxWords(accumulatedCaptions);
			}

			// Perform fact check if we have content and no pending check
			if (!isFactCheckPending && accumulatedCaptions) {
				performFactCheck(accumulatedCaptions);
			}
		}
	}, 1000);

}

// Listen for fact-check results from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'FACT_CHECK_RESULT') {
		isFactCheckPending = false;

		if (
			message.data.status === 'success' &&
			message.data.claimReview &&
			message.data.claimReview.length > 0
		) {
			showFactCheckPopup(message.data);
			sendToBackend(message.data.text); // Send to backend

			// Ensure that the query text is set correctly
			const queryText = message.data.text; // Set queryText to the fact-checked text
			console.log('Query text before redirect:', queryText); // Log the query text
			//redirectToFrontend(queryText); // Pass the correct text to the redirect function

			accumulatedCaptions = ''; // Reset only when a fact is found
			pendingCaptions = ''; // Clear any pending captions
		} else {
			console.warn('No valid fact check results found:', message.data); // Log if no valid results
			// Ensure that the query text is set correctly
			if (!isYouTube) {
				redirectToFrontend(lastQueryText);
			} // Pass the correct text to the redirect function

			accumulatedCaptions = ''; // Reset only when a fact is found
			pendingCaptions = ''; // Clear any pending captions
		}
	}
});

// Maximum allowed length for a URL query string
const MAX_URL_LENGTH = 2000;

// Function to truncate text if it's too long
function truncateText(text, maxLength) {
	return text.length > maxLength ? text.substring(0, maxLength) : text;
}

// Modify showFactCheckPopup function to check for large text
function showFactCheckPopup(result) {
	const existingPopup = document.querySelector('.fact-check-popup');
	if (existingPopup) {
		existingPopup.remove();
	}

	const popup = document.createElement('div');
	popup.className = 'fact-check-popup';
	console.log('Displaying popup with result:', result);

	// Ensure result.text is not undefined before building URLs
	let factText = result.text || '';
	console.log(factText);
	// If the factText is too large, truncate it
	if (factText.length > MAX_URL_LENGTH) {
		factText = truncateText(factText, MAX_URL_LENGTH);
		console.warn('Text too long, truncating to fit in URL');
	}

	// Condition to check if a fact was found and display accordingly
	if (
		result.status === 'success' &&
		result.claimReview &&
		result.claimReview.length > 0
	) {
		const claimReview = result.claimReview[0];
		const webAppSearchLink = `https://truthlens.tech/?q=${encodeURIComponent(
			factText,
		)}`; // Local web app search link

		popup.innerHTML = `
            <div class="fact-check-title">Fact Check Result</div>
            <div class="fact-check-claim">"${factText}"</div>
            <div class="fact-check-source"><strong>Source:</strong> ${
							result.claimant || 'Unknown'
						}</div>
            <div><strong>Verified by:</strong> ${
							claimReview.publisher.name
						}</div>
            <div class="fact-check-rating"><strong>Rating:</strong> ${
							claimReview.textualRating
						}</div>
            <a href="${
							claimReview.url
						}" target="_blank" class="fact-check-link">Read Full Review</a>
            <a href="${webAppSearchLink}" target="_blank" class="fact-check-link">Search in Web App</a>
        `;
	} else if (!isYouTube && factText) {
		// Redirect to frontend and trigger backend call if no fact found, but only if not on YouTube
		const webAppSearchLink = `https://truthlens.tech/?q=${encodeURIComponent(
			factText,
		)}`;
		console.log(
			'Redirecting to frontend for additional fact check:',
			webAppSearchLink,
		);
		window.location.href = webAppSearchLink;
		return;
	} else {
		popup.innerHTML = `<div class="fact-check-title">No Results Found</div>`;
	}

	document.body.appendChild(popup);

	setTimeout(() => {
		if (popup && popup.parentElement) {
			popup.remove();
		}
	}, POPUP_DURATION);
}

// Event listener to detect when text is selected
document.addEventListener('mouseup', displayFactCheckButton);
