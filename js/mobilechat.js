/**
 * Mobile Chat Interface JavaScript
 * Handles typing animations and chat functionality for Mitansh's AI Assistant on mobile devices
 */

class MobileChatInterface {
  constructor() {
    this.typingSpeed = 30; // milliseconds between characters
    this.initialDelay = 1000; // delay before starting typing
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.startInitialMessage();
      this.setupSuggestionButtons();
      this.setupSendButton();
      this.setupMobileOptimizations();
    });
  }

  /**
   * Mobile-specific optimizations
   */
  setupMobileOptimizations() {
    // Prevent zoom on input focus
    const chatInput = document.getElementById('mobileChatInput');
    if (chatInput) {
      chatInput.addEventListener('focus', () => {
        document.querySelector('meta[name=viewport]').setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      });
      
      chatInput.addEventListener('blur', () => {
        document.querySelector('meta[name=viewport]').setAttribute('content', 
          'width=device-width, initial-scale=1.0');
      });
    }

    // Auto-scroll to bottom when keyboard appears
    window.addEventListener('resize', () => {
      const chatMessages = document.getElementById('mobileChatMessages');
      if (chatMessages) {
        setTimeout(() => {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
      }
    });
  }

  /**
   * Creates typing animation effect
   * @param {HTMLElement} element - Element to type into
   * @param {string} message - Message to type
   * @param {number} speed - Speed of typing (ms per character)
   */
  typeMessage(element, message, speed = this.typingSpeed) {
    let i = 0;
    element.innerHTML = '';
    
    const typeChar = () => {
      if (i < message.length) {
        element.innerHTML += message.charAt(i);
        i++;
        setTimeout(typeChar, speed);
      }
    };
    
    typeChar();
  }

  /**
   * Starts the initial AI greeting message with typing indicator
   */
  startInitialMessage() {
    const typingElement = document.getElementById('mobileTypingMessage');
    
    if (!typingElement) {
      console.warn('Mobile typing element not found');
      return;
    }

    const welcomeMessage = "Hi there! 👋 I'm Mitansh's AI assistant. Ask me anything about his experience, projects, or skills!";
    
    // Show typing indicator first
    setTimeout(() => {
      this.showTypingIndicatorInMessage(typingElement);
      
      // After 2 seconds, start the actual message
      setTimeout(() => {
        this.typeMessage(typingElement, welcomeMessage);
      }, 2000);
    }, this.initialDelay);
  }

  /**
   * Shows typing indicator with "Mitansh is typing..." in the message area
   * @param {HTMLElement} element - Element to show typing indicator in
   */
  showTypingIndicatorInMessage(element) {
    element.innerHTML = `
      <span class="typing-indicator-text">Mitansh is typing</span>
      <span class="typing-dots">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </span>
    `;
  }

  /**
   * Sets up suggestion button functionality
   */
  setupSuggestionButtons() {
    const suggestionButtons = document.querySelectorAll('.mobile-suggestion-btn');
    const chatInput = document.getElementById('mobileChatInput');
    const suggestions = document.getElementById('mobileChatSuggestions');

    suggestionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const message = button.getAttribute('data-message');
        
        // Fill the input with the suggestion
        if (chatInput) {
          chatInput.value = message;
          chatInput.focus(); // Focus on the input after filling
        }
        
        // Hide suggestions after first use
        if (suggestions) {
          suggestions.classList.add('hidden');
        }
      });
    });
  }

  /**
   * Sets up send button and input field functionality
   */
  setupSendButton() {
    const sendButton = document.getElementById('mobileSendButton');
    const chatInput = document.getElementById('mobileChatInput');

    // Send button click handler
    if (sendButton) {
      sendButton.addEventListener('click', () => {
        this.handleSendMessage();
      });
    }

    // Enter key press handler
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent default to avoid form submission
          this.handleSendMessage();
        }
      });
    }
  }

  /**
   * Handles sending a message
   */
  handleSendMessage() {
    const chatInput = document.getElementById('mobileChatInput');
    const suggestions = document.getElementById('mobileChatSuggestions');
    
    if (!chatInput) return;
    
    const message = chatInput.value.trim();
    if (!message) return; // Don't send empty messages
    
    // Add user message to chat
    this.addMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    
    // Hide suggestions after first message
    if (suggestions) {
      suggestions.classList.add('hidden');
    }
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Call AWS Bedrock API
    this.callBedrockAPI(message);
  }

  /**
   * Calls the AWS Bedrock API
   * @param {string} message - User message
   */
  async callBedrockAPI(message) {
    // Using CORS proxy for reliable cross-origin requests
    const apiEndpoint = 'https://corsproxy.io/?https://l74l39ru2b.execute-api.us-east-2.amazonaws.com/chat';
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Hide typing indicator
      this.hideTypingIndicator();
      
      // Add AI response with typing animation
      this.addMessage(data.response || 'Sorry, I didn\'t receive a proper response.', 'bot', true);
      
    } catch (error) {
      console.error('Error calling Bedrock API:', error);
      
      // Hide typing indicator
      this.hideTypingIndicator();
      
      // Show error message
      this.addMessage("Sorry, I'm having trouble connecting right now. Please try again in a moment.", 'bot');
    }
  }

  /**
   * Shows typing indicator
   */
  showTypingIndicator() {
    const chatMessages = document.getElementById('mobileChatMessages');
    if (!chatMessages) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'mobile-message mobile-bot-message';
    typingDiv.id = 'mobileTypingIndicator';
    
    typingDiv.innerHTML = `
      <div class="mobile-message-content">
        <span class="typing-indicator-text">Mitansh is typing</span>
        <span class="typing-dots">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </span>
      </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /**
   * Hides typing indicator
   */
  hideTypingIndicator() {
    const typingIndicator = document.getElementById('mobileTypingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  /**
   * Adds a new message to the chat
   * @param {string} message - Message content
   * @param {string} type - 'user' or 'bot'
   * @param {boolean} animate - Whether to animate bot messages
   */
  addMessage(message, type = 'bot', animate = false) {
    const chatMessages = document.getElementById('mobileChatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `mobile-message mobile-${type}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'mobile-message-content';
    
    const messageParagraph = document.createElement('p');
    
    if (animate && type === 'bot') {
      // Use typing animation for bot messages
      this.typeMessage(messageParagraph, message);
    } else {
      messageParagraph.textContent = message;
    }
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'mobile-message-time';
    timeSpan.textContent = 'Just now';
    
    messageContent.appendChild(messageParagraph);
    messageContent.appendChild(timeSpan);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Initialize mobile chat interface
const mobileChatInterface = new MobileChatInterface();

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileChatInterface;
}