/**
 * Chat Interface JavaScript
 * Handles typing animations and chat functionality for Mitansh's AI Assistant
 */

class ChatInterface {
  constructor() {
    this.typingSpeed = 3; // milliseconds between characters
    this.initialDelay = 1000; // delay before starting typing
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.startInitialMessage();
      this.setupSuggestionButtons();
      this.setupSendButton();
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
    const typingElement = document.getElementById('typingMessage');
    const typingElementPhone = document.getElementById('typingMessagePhone');
    
    const welcomeMessage = "Hi there! 👋 I'm Mitansh's AI assistant. Ask me anything about his experience, projects, or skills!";
    
    // Handle laptop version
    if (typingElement) {
      setTimeout(() => {
        this.showTypingIndicatorInMessage(typingElement);
        setTimeout(() => {
          this.typeMessage(typingElement, welcomeMessage);
        }, 2000);
      }, this.initialDelay);
    }
    
    // Handle phone version
    if (typingElementPhone) {
      setTimeout(() => {
        this.showTypingIndicatorInMessage(typingElementPhone);
        setTimeout(() => {
          this.typeMessage(typingElementPhone, welcomeMessage);
        }, 2000);
      }, this.initialDelay);
    }
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
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    
    suggestionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const message = button.getAttribute('data-message');
        
        // Determine if this is laptop or phone based on parent container
        const isPhone = button.closest('#chatSuggestionsPhone');
        const chatInput = isPhone ? 
          document.getElementById('chatInputPhone') : 
          document.getElementById('chatInput');
        const suggestions = isPhone ? 
          document.getElementById('chatSuggestionsPhone') : 
          document.getElementById('chatSuggestions');
        
        // Fill the input with the suggestion
        if (chatInput) {
          chatInput.value = message;
          chatInput.focus();
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
    // Laptop version
    const sendButton = document.getElementById('sendButton');
    const chatInput = document.getElementById('chatInput');
    
    // Phone version
    const sendButtonPhone = document.getElementById('sendButtonPhone');
    const chatInputPhone = document.getElementById('chatInputPhone');

    // Laptop send button click handler
    if (sendButton) {
      sendButton.addEventListener('click', () => {
        this.handleSendMessage('laptop');
      });
    }

    // Phone send button click handler
    if (sendButtonPhone) {
      sendButtonPhone.addEventListener('click', () => {
        this.handleSendMessage('phone');
      });
    }

    // Laptop enter key press handler
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSendMessage('laptop');
        }
      });
    }
    
    // Phone enter key press handler
    if (chatInputPhone) {
      chatInputPhone.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSendMessage('phone');
        }
      });
    }
  }

  /**
   * Handles sending a message
   * @param {string} device - 'laptop' or 'phone'
   */
  handleSendMessage(device = 'laptop') {
    const chatInput = device === 'phone' ? 
      document.getElementById('chatInputPhone') : 
      document.getElementById('chatInput');
    const suggestions = device === 'phone' ? 
      document.getElementById('chatSuggestionsPhone') : 
      document.getElementById('chatSuggestions');
    
    if (!chatInput) return;
    
    const message = chatInput.value.trim();
    if (!message) return; // Don't send empty messages
    
    // Add user message to chat
    this.addMessage(message, 'user', false, device);
    
    // Clear input
    chatInput.value = '';
    
    // Hide suggestions after first message
    if (suggestions) {
      suggestions.classList.add('hidden');
    }
    
    // Show typing indicator
    this.showTypingIndicator(device);
    
    // Call AWS Bedrock API
    this.callBedrockAPI(message, device);
  }

  /**
   * Calls the AWS Bedrock API
   * @param {string} message - User message
   * @param {string} device - 'laptop' or 'phone'
   */
  async callBedrockAPI(message, device = 'laptop') {
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
      this.hideTypingIndicator(device);
      
      // Add AI response with typing animation
      this.addMessage(data.response || 'Sorry, I didn\'t receive a proper response.', 'bot', true, device);
      
    } catch (error) {
      console.error('Error calling Bedrock API:', error);
      
      // Hide typing indicator
      this.hideTypingIndicator(device);
      
      // Show error message
      this.addMessage("Sorry, I'm having trouble connecting right now. Please try again in a moment.", 'bot', false, device);
    }
  }

  /**
   * Shows typing indicator
   * @param {string} device - 'laptop' or 'phone'
   */
  showTypingIndicator(device = 'laptop') {
    const chatMessages = device === 'phone' ? 
      document.getElementById('chatMessagesPhone') : 
      document.getElementById('chatMessages');
    if (!chatMessages) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = device === 'phone' ? 'typingIndicatorPhone' : 'typingIndicator';
    
    typingDiv.innerHTML = `
      <div class="message-content">
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
   * @param {string} device - 'laptop' or 'phone'
   */
  hideTypingIndicator(device = 'laptop') {
    const typingIndicator = device === 'phone' ? 
      document.getElementById('typingIndicatorPhone') : 
      document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  /**
   * Adds a new message to the chat
   * @param {string} message - Message content
   * @param {string} type - 'user' or 'bot'
   * @param {boolean} animate - Whether to animate bot messages
   * @param {string} device - 'laptop' or 'phone'
   */
  addMessage(message, type = 'bot', animate = false, device = 'laptop') {
    const chatMessages = device === 'phone' ? 
      document.getElementById('chatMessagesPhone') : 
      document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageParagraph = document.createElement('p');
    
    if (animate && type === 'bot') {
      // Use typing animation for bot messages
      this.typeMessage(messageParagraph, message);
    } else {
      messageParagraph.textContent = message;
    }
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = 'Just now';
    
    messageContent.appendChild(messageParagraph);
    messageContent.appendChild(timeSpan);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Initialize chat interface
const chatInterface = new ChatInterface();

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChatInterface;
}