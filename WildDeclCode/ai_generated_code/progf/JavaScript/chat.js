// Aided with basic GitHub coding tools

class PolyMindChat {
    constructor() {
        this.apiBaseUrl = window.location.origin;
        this.wsUrl = `ws://${window.location.host}/ws/chat`;
        this.messages = [];
        this.isTyping = false;
        this.selectedAgent = 'deepseek';
        this.websocket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        
        // Logging và debugging
        this.messageStats = {
            sent: 0,
            received: 0,
            errors: 0,
            connections: 0,
            reconnects: 0
        };
        this.messageLog = [];
        this.enableDetailedLogging = true;
        
        this.init();
    }

    /**
     * Log chi tiết message với timestamp và preview
     * @param {string} direction - 'SEND' hoặc 'RECEIVE'
     * @param {object} data - Dữ liệu message
     * @param {string} status - 'SUCCESS' hoặc 'ERROR'
     */
    logMessage(direction, data, status = 'SUCCESS') {
        const timestamp = new Date().toISOString();
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const logEntry = {
            id: messageId,
            timestamp,
            direction,
            status,
            data: JSON.parse(JSON.stringify(data)), // Deep clone
            agent: this.selectedAgent,
            size: JSON.stringify(data).length,
            preview: this.getMessagePreview(data)
        };
        
        // Thêm vào message log
        this.messageLog.push(logEntry);
        
        // Giới hạn số lượng log entries (giữ 100 entries gần nhất)
        if (this.messageLog.length > 100) {
            this.messageLog = this.messageLog.slice(-100);
        }
        
        // Update stats
        if (direction === 'SEND') {
            this.messageStats.sent++;
        } else if (direction === 'RECEIVE') {
            this.messageStats.received++;
        }
        
        if (status === 'ERROR') {
            this.messageStats.errors++;
        }
        
        // Console logging với màu sắc
        if (this.enableDetailedLogging) {
            const emoji = direction === 'SEND' ? '📤' : '📥';
            const statusEmoji = status === 'SUCCESS' ? '✅' : '❌';
            const color = direction === 'SEND' ? '#4CAF50' : '#2196F3';
            
            console.group(`%c${emoji} ${direction} ${statusEmoji}`, `color: ${color}; font-weight: bold;`);
            console.log(`🕒 Time: ${new Date(timestamp).toLocaleTimeString('vi-VN')}`);
            console.log(`🎯 Agent: ${this.selectedAgent}`);
            console.log(`📏 Size: ${logEntry.size} bytes`);
            console.log(`👀 Preview: ${logEntry.preview}`);
            console.log(`📦 Full Data:`, data);
            console.groupEnd();
        }
        
        return logEntry;
    }
    
    /**
     * Tạo preview ngắn gọn của message
     * @param {object} data - Dữ liệu message
     * @returns {string} Preview string
     */
    getMessagePreview(data) {
        if (typeof data === 'string') {
            return data.substring(0, 50) + (data.length > 50 ? '...' : '');
        }
        
        if (data.content) {
            const content = data.content.substring(0, 50);
            return content + (data.content.length > 50 ? '...' : '');
        }
        
        if (data.type) {
            return `[${data.type}] ${JSON.stringify(data).substring(0, 30)}...`;
        }
        
        return JSON.stringify(data).substring(0, 50) + '...';
    }
    
    /**
     * Log kết nối WebSocket
     * @param {string} event - 'CONNECT', 'DISCONNECT', 'RECONNECT'
     * @param {object} details - Chi tiết bổ sung
     */
    logConnection(event, details = {}) {
        const timestamp = new Date().toISOString();
        
        const logEntry = {
            timestamp,
            event,
            details,
            readyState: this.websocket?.readyState,
            reconnectAttempts: this.reconnectAttempts,
            url: this.wsUrl
        };
        
        // Update stats
        if (event === 'CONNECT') {
            this.messageStats.connections++;
        } else if (event === 'RECONNECT') {
            this.messageStats.reconnects++;
        }
        
        // Console logging
        const eventEmojis = {
            'CONNECT': '🔌',
            'DISCONNECT': '🔌❌',
            'RECONNECT': '🔄'
        };
        
        const emoji = eventEmojis[event] || '🔌';
        console.log(`%c${emoji} WebSocket ${event}`, 'color: #FF9800; font-weight: bold;', logEntry);
        
        return logEntry;
    }
    
    /**
     * Lấy thống kê chi tiết về messages
     * @returns {object} Statistics object
     */
    getMessageStats() {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        const recentMessages = this.messageLog.filter(log => 
            new Date(log.timestamp).getTime() > oneHourAgo
        );
        
        return {
            ...this.messageStats,
            totalMessages: this.messageLog.length,
            recentMessages: recentMessages.length,
            averageMessageSize: this.messageLog.length > 0 ? 
                Math.round(this.messageLog.reduce((sum, log) => sum + log.size, 0) / this.messageLog.length) : 0,
            errorRate: this.messageStats.sent > 0 ? 
                Math.round((this.messageStats.errors / this.messageStats.sent) * 100) : 0,
            connectionStatus: this.websocket?.readyState === WebSocket.OPEN ? 'CONNECTED' : 'DISCONNECTED',
            uptime: this.getUptime()
        };
    }
    
    /**
     * Lấy thời gian hoạt động
     * @returns {string} Uptime string
     */
    getUptime() {
        if (!this.startTime) return 'Unknown';
        
        const uptime = Date.now() - this.startTime;
        const minutes = Math.floor(uptime / 60000);
        const seconds = Math.floor((uptime % 60000) / 1000);
        
        return `${minutes}m ${seconds}s`;
    }
    
    /**
     * Debug helper - in ra thống kê console
     */
    printStats() {
        const stats = this.getMessageStats();
        
        console.group('📊 PolyMind Chat Statistics');
        console.table(stats);
        console.groupEnd();
        
        return stats;
    }
    
    /**
     * Debug helper - in ra message log gần đây
     * @param {number} limit - Số lượng messages gần nhất
     */
    printRecentMessages(limit = 10) {
        const recent = this.messageLog.slice(-limit);
        
        console.group(`📋 Recent Messages (${recent.length})`);
        recent.forEach(log => {
            const emoji = log.direction === 'SEND' ? '📤' : '📥';
            const statusEmoji = log.status === 'SUCCESS' ? '✅' : '❌';
            console.log(`${emoji}${statusEmoji} [${new Date(log.timestamp).toLocaleTimeString()}] ${log.preview}`);
        });
        console.groupEnd();
        
        return recent;
    }

    init() {
        this.startTime = Date.now();
        this.setupEventListeners();
        this.setupTextarea();
        this.updateWelcomeTime();
        this.setupAgentSelector();
        this.connectWebSocket();
        this.setupSidebar();
        
        console.log('🧠 PolyMind Chat initialized with enhanced logging');
        console.log('💡 Use debugChat() for debug helpers');
    }
    /**
     * Khởi tạo WebSocket connection với error handling cải tiến
     */    
    connectWebSocket() {
        try {
            console.log(`🔌 [WebSocket] Attempting to connect to: ${this.wsUrl}`);
            this.websocket = new WebSocket(this.wsUrl);
            
            this.websocket.onopen = () => {
                console.log('✅ [WebSocket] Connection established successfully');
                console.log(`📊 [WebSocket] Ready state: ${this.websocket.readyState}`);
                this.updateConnectionStatus('connected');
                this.reconnectAttempts = 0;
                
                // Thêm animation cho status dot khi connected
                this.animateStatusDot('success');
                
                // Log kết nối thành công
                this.logConnection('CONNECT');
            };

            this.websocket.onmessage = (event) => {
                console.log('📥 [WebSocket] Message received from server:', {
                    timestamp: new Date().toISOString(),
                    dataSize: event.data.length,
                    rawData: event.data
                });
                
                try {
                    const data = JSON.parse(event.data);
                    console.log('📦 [WebSocket] Parsed message data:', {
                        type: data.type,
                        agent: data.agent,
                        model: data.model,
                        contentLength: data.content?.length || 0,
                        timestamp: data.timestamp
                    });
                    
                    // Log message nhận được
                    this.logMessage('RECEIVE', data);
                    
                    this.handleWebSocketMessage(data);
                } catch (parseError) {
                    console.error('❌ [WebSocket] Failed to parse message:', parseError);
                    console.error('🔍 [WebSocket] Raw message data:', event.data);
                }
            };

            this.websocket.onclose = () => {
                console.log('❌ [WebSocket] Connection closed');
                console.log(`📊 [WebSocket] Final ready state: ${this.websocket?.readyState || 'undefined'}`);
                console.log(`🔄 [WebSocket] Reconnect attempt: ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                
                this.updateConnectionStatus('disconnected');
                this.animateStatusDot('error');
                this.attemptReconnect();
                
                // Log ngắt kết nối
                this.logConnection('DISCONNECT');
            };

            this.websocket.onerror = (error) => {
                console.error('� [WebSocket] Connection error occurred:', {
                    timestamp: new Date().toISOString(),
                    error: error,
                    readyState: this.websocket?.readyState,
                    url: this.wsUrl
                });
                this.updateConnectionStatus('disconnected');
                this.animateStatusDot('error');
            };

        } catch (error) {
            console.error('🚨 [WebSocket] Failed to initialize connection:', error);
            this.updateConnectionStatus('disconnected');
            this.animateStatusDot('error');
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.updateConnectionStatus('connecting');
            
            setTimeout(() => {
                console.log(`🔄 Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                this.connectWebSocket();
            }, 2000 * this.reconnectAttempts);
        }
    }    handleWebSocketMessage(data) {
        console.log('🎯 [WebSocket] Processing received message:', {
            timestamp: new Date().toISOString(),
            rawData: data
        });

        // Handle format từ sandbox server: {"sender": "ai", "message": "..."}
        if (data.sender && data.message) {
            console.log('💬 [WebSocket] Handling server response format:', {
                sender: data.sender,
                messagePreview: data.message.substring(0, 100) + (data.message.length > 100 ? '...' : '')
            });
            
            this.hideTyping();
              switch(data.sender) {
                case 'ai':
                    // Hiển thị AI response với hiệu ứng streaming (typing effect)
                    this.addMessage(data.message, 'ai', false, true, 30);
                    break;
                case 'system':
                    this.addMessage(data.message, 'ai', true);
                    break;
                default:
                    // Các message khác cũng có thể dùng streaming effect
                    this.addMessage(data.message, 'ai', false, true, 30);
                    break;
            }
            return;
        }

        // Handle format cũ với type: {"type": "ai_response", "content": "..."}
        console.log('🎯 [WebSocket] Processing message with type format:', {
            messageType: data.type,
            agent: data.agent,
            model: data.model,
            hasContent: !!data.content,
            contentLength: data.content?.length || 0
        });

        switch(data.type) {            case 'ai_response':
                console.log('💬 [WebSocket] Handling AI response:', {
                    agent: data.agent,
                    model: data.model,
                    contentPreview: data.content?.substring(0, 100) + (data.content?.length > 100 ? '...' : ''),
                    serverTimestamp: data.timestamp
                });
                this.hideTyping();
                // Hiển thị AI response với hiệu ứng streaming (typing effect)
                this.addMessage(data.content, 'ai', false, true, 30);
                break;
                
            case 'ai_typing':
                console.log('⌨️ [WebSocket] Agent typing indicator:', {
                    agent: data.agent,
                    serverTimestamp: data.timestamp
                });
                // Handle typing indicator if needed
                break;
                
            case 'ai_chunk':
                console.log('📝 [WebSocket] Received streaming chunk:', {
                    agent: data.agent,
                    chunkLength: data.content?.length || 0,
                    serverTimestamp: data.timestamp
                });
                // Handle streaming chunks if needed
                break;
                
            case 'error':
                console.error('🚨 [WebSocket] Server error received:', {
                    errorContent: data.content,
                    serverTimestamp: data.timestamp
                });
                this.hideTyping();
                this.addMessage(data.content || 'Đã xảy ra lỗi từ server', 'ai', true);
                break;
                
            default:
                console.warn('❓ [WebSocket] Unknown message type:', {
                    type: data.type,
                    data: data
                });
                break;
        }
    }/**
     * Cập nhật trạng thái kết nối với UI cải tiến
     * @param {string} status - Trạng thái kết nối ('connected', 'disconnected', 'connecting')
     */
    updateConnectionStatus(status) {
        const connectionStatus = document.getElementById('connectionStatus');
        const statusText = document.getElementById('statusText');
        
        if (!connectionStatus) return;
        
        connectionStatus.className = `connection-status ${status}`;
        
        // Map trạng thái sang text tiếng Việt
        const statusMessages = {
            'connected': 'Đã kết nối',
            'disconnected': 'Mất kết nối',
            'connecting': 'Đang kết nối...'
        };
        
        const message = statusMessages[status] || 'Không xác định';
        
        // Cập nhật tooltip
        connectionStatus.setAttribute('data-status', message);
        
        // Cập nhật text element nếu có
        if (statusText) {
            statusText.textContent = message;
        }
        
        // Log cho debugging
        console.log(`🔌 Connection status: ${status} (${message})`);
    }    setupEventListeners() {
        // Chat form submission
        const chatForm = document.getElementById('chat-form');
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        // Textarea auto-resize and shortcuts
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('input', () => {
                this.updateCharCount();
                this.autoResizeTextarea();
                this.updateSendButton();
            });

            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Send button (using class selector since no ID)
        const sendButton = document.querySelector('.send-btn');
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }
    }    setupTextarea() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.style.height = 'auto';
            this.updateSendButton();
        }
    }    setupAgentSelector() {
        const agentSelector = document.getElementById('agentSelector');
        if (agentSelector) {
            agentSelector.addEventListener('change', (e) => {
                this.selectedAgent = e.target.value;
                this.addSystemMessage(`Đã chuyển sang ${e.target.options[e.target.selectedIndex].text}`);
            });
        }
    }

    updateWelcomeTime() {
        const welcomeTime = document.getElementById('welcomeTime');
        if (welcomeTime) {
            welcomeTime.textContent = new Date().toLocaleTimeString('vi-VN');
        }
    }    updateCharCount() {
        const chatInput = document.getElementById('chat-input');
        const charCount = document.getElementById('charCount');
        
        if (!chatInput || !charCount) return;
        
        const currentLength = chatInput.value.length;
        const maxLength = parseInt(chatInput.getAttribute('maxlength')) || 2000;
        
        charCount.textContent = `${currentLength}/${maxLength}`;
        
        // Change color if approaching limit
        if (currentLength > maxLength * 0.8) {
            charCount.style.color = 'var(--warning-color)';
        } else if (currentLength > maxLength * 0.9) {
            charCount.style.color = 'var(--error-color)';
        } else {
            charCount.style.color = 'var(--text-light)';
        }
    }    autoResizeTextarea() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.style.height = 'auto';
            chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
        }
    }    updateSendButton() {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.querySelector('.send-btn');
        
        if (!chatInput || !sendButton) return;
        
        const hasText = chatInput.value.trim().length > 0;
        
        sendButton.disabled = !hasText || this.isTyping;
    }    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message || this.isTyping || !chatInput) return;

        // Check WebSocket connection
        if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
            this.addMessage('Kết nối bị gián đoạn. Đang thử kết nối lại...', 'ai', true);
            this.connectWebSocket();
            return;
        }

        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        this.updateCharCount();
        this.autoResizeTextarea();
        this.updateSendButton();

        // Show typing indicator
        this.showTyping();        try {
            // Send message via WebSocket - sử dụng format mà server expect
            const messageData = {
                message: message,  // Đổi từ 'content' thành 'message' để match với server
                agent: this.selectedAgent,
                timestamp: new Date().toISOString()
            };
            
            console.log('📤 [WebSocket] Sending message to server:', {
                timestamp: new Date().toISOString(),
                messageLength: message.length,
                agent: this.selectedAgent,
                readyState: this.websocket.readyState,
                messagePreview: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
                fullData: messageData
            });
            
            // Log message gửi đi
            this.logMessage('SEND', messageData);
            
            this.websocket.send(JSON.stringify(messageData));
            
            console.log('✅ [WebSocket] Message sent successfully');
            
        } catch (error) {
            console.error('❌ [WebSocket] Error sending message:', {
                timestamp: new Date().toISOString(),
                error: error,
                message: error.message,
                readyState: this.websocket?.readyState,
                messageLength: message.length
            });
            this.hideTyping();
            this.addMessage('Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.', 'ai', true);
        }
    }    /**
     * Thêm message vào chat với support streaming - Aided with basic GitHub coding tools
     * @param {string} content - Nội dung message
     * @param {string} sender - 'user' hoặc 'ai'
     * @param {boolean} isError - Có phải error message không
     * @param {boolean} streaming - Có dùng streaming effect không
     * @param {number} streamSpeed - Tốc độ streaming (ms per character)
     */
    async addMessage(content, sender, isError = false, streaming = false, streamSpeed = 50) {
        const chatMessages = document.getElementById('chat-log');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString('vi-VN');
        const messageId = 'msg_' + Date.now();

        messageDiv.className = `message ${sender}`;
        messageDiv.id = messageId;

        const avatarContent = sender === 'user' ? 
            '<i class="fas fa-user"></i>' : 
            '<i class="fas fa-robot"></i>';

        const senderName = sender === 'user' ? 'Bạn' : 'AI Assistant';
        const messageClass = isError ? 'error-message' : '';

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${avatarContent}
            </div>
            <div class="message-bubble">
                <div class="message-content ${messageClass}" id="content-${messageId}">
                    ${!streaming ? this.formatMessage(content) : ''}
                </div>
                <div class="message-time">${senderName} • ${timestamp}</div>
            </div>
        `;

        // Insert before typing indicator
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            chatMessages.insertBefore(messageDiv, typingIndicator);
        } else {
            chatMessages.appendChild(messageDiv);
        }

        // Animate message appearance
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);

        // Handle streaming effect cho AI response
        if (streaming && sender === 'ai' && !isError) {
            const contentElement = document.getElementById(`content-${messageId}`);
            console.log(`🎬 [Streaming] Starting streaming effect for AI message`);
            
            // Thêm typing cursor CSS class
            contentElement.classList.add('typing-cursor');
            
            try {
                // Dùng typeText cho streaming effect
                await this.typeText(contentElement, content, streamSpeed);
                
                // Remove typing cursor sau khi hoàn thành
                contentElement.classList.remove('typing-cursor');
                
                console.log(`✅ [Streaming] Completed streaming effect`);
            } catch (error) {
                console.error('❌ [Streaming] Error during streaming:', error);
                // Fallback: hiển thị text ngay lập tức
                contentElement.innerHTML = this.formatMessage(content);
                contentElement.classList.remove('typing-cursor');
            }
        }

        // Scroll to bottom
        this.scrollToBottom();

        // Store message
        this.messages.push({
            id: messageId,
            content,
            sender,
            timestamp: Date.now(),
            agent: this.selectedAgent
        });
    }addSystemMessage(content) {
        const chatMessages = document.getElementById('chat-log');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        
        messageDiv.innerHTML = `
            <div style="text-align: center; margin: var(--spacing-md) 0;">
                <div style="display: inline-block; background: var(--bg-primary); color: var(--text-secondary); padding: var(--spacing-xs) var(--spacing-md); border-radius: 20px; font-size: 0.875rem;">
                    <i class="fas fa-info-circle"></i> ${content}
                </div>
            </div>
        `;

        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            chatMessages.insertBefore(messageDiv, typingIndicator);
        } else {
            chatMessages.appendChild(messageDiv);
        }
        this.scrollToBottom();
    }    /**
     * Type text với effect streaming từng chữ - Aided with basic GitHub coding tools
     * @param {HTMLElement} element - Element để type text vào
     * @param {string} text - Text cần type
     * @param {number} speed - Tốc độ type (ms per character)
     * @returns {Promise} Promise resolve khi hoàn thành
     */
    async typeText(element, text, speed = 50) {
        return new Promise((resolve) => {
            let i = 0;
            const formattedText = this.formatMessage(text);
            
            // Tạo một div tạm để parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = formattedText;
            const textContent = tempDiv.textContent || tempDiv.innerText;
            
            element.textContent = '';
            
            const typeTimer = setInterval(() => {
                if (i < textContent.length) {
                    const currentText = textContent.substring(0, i + 1);
                    // Apply formatting to current text
                    const partialFormatted = this.formatMessage(currentText);
                    element.innerHTML = partialFormatted;
                    i++;
                    // Auto scroll khi đang type
                    this.scrollToBottom();
                } else {
                    clearInterval(typeTimer);
                    // Đảm bảo formatting hoàn chính sau khi type xong
                    element.innerHTML = formattedText;
                    resolve();
                }
            }, speed);
        });
    }

    /**
     * Stream text với effect typing chunked - Aided with basic GitHub coding tools
     * @param {HTMLElement} element - Element để stream text vào
     * @param {string} text - Text cần stream
     * @param {number} chunkSize - Kích thước chunk
     * @param {number} chunkDelay - Delay giữa các chunk (ms)
     * @returns {Promise} Promise resolve khi hoàn thành
     */
    async streamText(element, text, chunkSize = 3, chunkDelay = 100) {
        return new Promise((resolve) => {
            let i = 0;
            element.textContent = '';
            
            const streamTimer = setInterval(() => {
                if (i < text.length) {
                    const chunk = text.slice(i, i + chunkSize);
                    element.textContent += chunk;
                    i += chunkSize;
                    // Auto scroll khi đang stream
                    this.scrollToBottom();
                } else {
                    clearInterval(streamTimer);
                    resolve();
                }
            }, chunkDelay);
        });
    }

    formatMessage(content) {
        // Basic message formatting
        return content
            .replace(/\n/g, '<br>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    }    showTyping() {
        this.isTyping = true;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
        }
        this.updateSendButton();
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
        this.updateSendButton();
    }

    async simulateAIResponse(userMessage) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Generate response based on agent type and user message
        const response = this.generateAIResponse(userMessage);
        this.addMessage(response, 'ai');
    }    generateAIResponse(userMessage) {
        const responses = {
            deepseek: [
                `Cảm ơn bạn đã hỏi "${userMessage}". Tôi sẽ sử dụng DeepSeek V3 để phân tích và trả lời chi tiết.`,
                `Đây là một câu hỏi thú vị về "${userMessage}". Với khả năng reasoning mạnh mẽ, tôi sẽ đưa ra câu trả lời toàn diện.`,
                `Tôi hiểu bạn muốn biết về "${userMessage}". DeepSeek V3 sẽ giúp tôi cung cấp insights sâu sắc về vấn đề này.`
            ],
            coding: [
                `Về vấn đề lập trình "${userMessage}", tôi sẽ giúp bạn với code example và best practices.`,
                `Đây là một câu hỏi technical hay về "${userMessage}". Hãy để tôi giải thích chi tiết.`,
                `Tôi sẽ hỗ trợ bạn với "${userMessage}" bằng cách đưa ra solution và giải thích từng bước.`
            ],
            analysis: [
                `Tôi sẽ phân tích dữ liệu về "${userMessage}" và đưa ra insights quan trọng.`,
                `Về "${userMessage}", tôi sẽ thực hiện analysis chi tiết và đưa ra recommendations.`,
                `Dựa trên "${userMessage}", tôi sẽ cung cấp data-driven insights và visualizations.`
            ],
            creative: [
                `Tôi sẽ sáng tạo nội dung về "${userMessage}" với style độc đáo và engaging.`,
                `Về chủ đề "${userMessage}", tôi sẽ viết một cách creative và compelling.`,
                `Hãy để tôi tạo ra nội dung thú vị về "${userMessage}" với góc nhìn mới mẻ.`
            ]
        };

        const agentResponses = responses[this.selectedAgent] || responses.deepseek;
        const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
        
        return randomResponse + '\n\nBạn có muốn tôi giải thích thêm chi tiết về vấn đề này không?';
    }    scrollToBottom() {
        const chatMessages = document.getElementById('chat-log');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }    clearChat() {
        const chatMessages = document.getElementById('chat-log');
        if (!chatMessages) return;
        
        const messages = chatMessages.querySelectorAll('.message');
        
        messages.forEach(message => {
            if (!message.classList.contains('ai') || message.querySelector('.message-content p')) {
                message.remove();
            }
        });

        this.messages = [];
        this.addSystemMessage('Đã xóa lịch sử chat');
    }

    /**
     * Tạo animation cho status dot
     * @param {string} type - Loại animation ('success', 'error', 'warning')
     */
    animateStatusDot(type) {
        const statusDot = document.querySelector('.status-dot');
        if (!statusDot) return;
        
        // Xóa animation cũ
        statusDot.classList.remove('animate-success', 'animate-error', 'animate-warning');
        
        // Thêm animation mới
        statusDot.classList.add(`animate-${type}`);
        
        // Xóa class animation sau khi hoàn thành
        setTimeout(() => {
            statusDot.classList.remove(`animate-${type}`);
        }, 600);
    }

    /**
     * Toggle sidebar visibility trên mobile
     */    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (!sidebar) return;
        
        sidebar.classList.toggle('open');
        
        // Tạo overlay nếu chưa có
        if (!overlay) {
            const newOverlay = document.createElement('div');
            newOverlay.className = 'sidebar-overlay';
            newOverlay.addEventListener('click', () => this.closeSidebar());
            document.body.appendChild(newOverlay);
        }
        
        // Toggle overlay
        const currentOverlay = document.querySelector('.sidebar-overlay');
        if (sidebar.classList.contains('open')) {
            currentOverlay?.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        } else {
            currentOverlay?.classList.remove('show');
            document.body.style.overflow = '';
        }
    }    /**
     * Đóng sidebar
     */
    closeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        sidebar?.classList.remove('open');
        overlay?.classList.remove('show');
        document.body.style.overflow = '';
    }    /**
     * Setup sidebar event listeners
     */
    setupSidebar() {
        // Mobile menu toggle button
        const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleSidebar());
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.sidebar');
            const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
            
            if (window.innerWidth <= 768 && 
                sidebar?.classList.contains('open') &&
                !sidebar.contains(e.target) &&
                e.target !== mobileMenuBtn &&
                !mobileMenuBtn?.contains(e.target)) {
                this.closeSidebar();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSidebar();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });

        // Setup chat history items
        this.setupChatHistory();
    }/**
     * Setup chat history functionality
     */
    setupChatHistory() {
        const historyItems = document.querySelectorAll('.chat-item');
        historyItems.forEach(item => {
            // Click handler
            item.addEventListener('click', (e) => {
                this.handleChatItemSelection(e, item, historyItems);
            });
            
            // Keyboard handler for accessibility
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleChatItemSelection(e, item, historyItems);
                }
            });
        });
    }

    /**
     * Handle chat item selection (click or keyboard)
     */
    handleChatItemSelection(e, item, historyItems) {
        e.preventDefault();
        
        // Remove active class from all items
        historyItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to selected item
        item.classList.add('active');
        
        // Load chat history (placeholder)
        const chatId = item.dataset.chatId || item.querySelector('.chat-item-title')?.textContent || 'unknown';
        this.loadChatHistory(chatId);
        
        // Close sidebar on mobile after selection
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }
    }

    /**
     * Load chat history (placeholder)
     * @param {string} chatId - ID của chat cần load
     */
    loadChatHistory(chatId) {
        // TODO: Implement actual chat history loading
        console.log(`Loading chat history: ${chatId}`);
        this.addSystemMessage(`Đã chuyển sang cuộc trò chuyện: ${chatId}`);
    }

    /**
     * Get debug information for troubleshooting
     * @returns {Object} Debug information object
     */
    getDebugInfo() {
        return {
            websocket: {
                url: this.wsUrl,
                readyState: this.websocket?.readyState,
                readyStateText: this.getReadyStateText(),
                isConnected: this.websocket?.readyState === WebSocket.OPEN,
                reconnectAttempts: this.reconnectAttempts,
                maxReconnectAttempts: this.maxReconnectAttempts
            },
            chat: {
                selectedAgent: this.selectedAgent,
                messageCount: this.messages.length,
                isTyping: this.isTyping,
                lastMessage: this.messages[this.messages.length - 1]
            },
            session: {
                startTime: this.sessionStartTime || 'Not recorded',
                uptime: this.sessionStartTime ? Date.now() - this.sessionStartTime : 0
            }
        };
    }

    /**
     * Get human-readable WebSocket ready state
     * @returns {string} Ready state description
     */
    getReadyStateText() {
        if (!this.websocket) return 'Not initialized';
        
        const states = {
            [WebSocket.CONNECTING]: 'CONNECTING',
            [WebSocket.OPEN]: 'OPEN',
            [WebSocket.CLOSING]: 'CLOSING',
            [WebSocket.CLOSED]: 'CLOSED'
        };
        
        return states[this.websocket.readyState] || 'UNKNOWN';
    }

    /**
     * Log comprehensive session statistics
     */
    logSessionStats() {
        const stats = {
            timestamp: new Date().toISOString(),
            session: {
                duration: this.sessionStartTime ? Date.now() - this.sessionStartTime : 0,
                messagesSent: this.messages.filter(m => m.sender === 'user').length,
                messagesReceived: this.messages.filter(m => m.sender === 'ai').length,
                reconnectAttempts: this.reconnectAttempts
            },
            connection: {
                currentState: this.getReadyStateText(),
                url: this.wsUrl,
                selectedAgent: this.selectedAgent
            },
            performance: {
                totalMessages: this.messages.length,
                averageMessageLength: this.messages.reduce((sum, msg) => sum + msg.content.length, 0) / this.messages.length || 0
            }
        };

        console.log('📊 [Session] Comprehensive statistics:', stats);
        return stats;
    }

    /**
     * Test streaming effect - Aided with basic GitHub coding tools
     * Để test hiệu ứng streaming cho development
     */
    testStreamingEffect() {
        const testMessage = `Đây là một test message dài để kiểm tra hiệu ứng streaming. 
        
**Các tính năng chính:**
- Streaming từng chữ một cách mượt mà
- Hỗ trợ formatting như **bold**, *italic*, và \`code\`
- Auto-scroll khi đang type
- Cursor nhấp nháy trong lúc streaming

Bạn có thể thấy text này được hiển thị từng chữ với tốc độ 30ms/ký tự. Đây là một cách tuyệt vời để tạo trải nghiệm tương tác với AI!`;

        console.log('🎬 [Test] Starting streaming effect demo');
        this.addMessage(testMessage, 'ai', false, true, 30);
    }

    // ...existing code...
}

// Global functions for HTML onclick handlers
window.clearChat = function() {
    if (window.polymindChat) {
        if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) {
            window.polymindChat.clearChat();
        }
    }
};

window.exportChat = function() {
    if (window.polymindChat) {
        window.polymindChat.exportChat();
    }
};

// Global debugging functions
window.debugChat = function() {
    if (window.polymindChat) {
        const debugInfo = window.polymindChat.getDebugInfo();
        console.log('🔍 [Debug] Chat debug information:', debugInfo);
        return debugInfo;
    } else {
        console.warn('⚠️ [Debug] PolyMind chat not initialized');
        return null;
    }
};

window.chatStats = function() {
    if (window.polymindChat) {
        return window.polymindChat.logSessionStats();
    } else {
        console.warn('⚠️ [Debug] PolyMind chat not initialized');
        return null;
    }
};

window.testWebSocket = function() {
    if (window.polymindChat && window.polymindChat.websocket) {
        const ws = window.polymindChat.websocket;
        console.log('🧪 [Test] WebSocket test message:', {
            readyState: ws.readyState,
            readyStateText: window.polymindChat.getReadyStateText(),
            url: ws.url
        });
        
        if (ws.readyState === WebSocket.OPEN) {
            const testMessage = {
                content: "Test message from browser console",
                agent: window.polymindChat.selectedAgent,
                timestamp: new Date().toISOString()
            };
            ws.send(JSON.stringify(testMessage));
            console.log('✅ [Test] Test message sent successfully');
        } else {
            console.warn('⚠️ [Test] WebSocket not in OPEN state');
        }
    } else {
        console.warn('⚠️ [Test] WebSocket not available');    }
};

// Test streaming effect function - Aided with basic GitHub coding tools
window.testStreaming = function() {
    if (window.polymindChat) {
        window.polymindChat.testStreamingEffect();
    } else {
        console.error('❌ [Test] PolyMind Chat not available');
    }
};

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.polymindChat = new PolyMindChat();        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus input
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const chatInput = document.getElementById('chat-input');
                if (chatInput) chatInput.focus();
            }
            
            // Escape to blur input
            if (e.key === 'Escape') {
                const chatInput = document.getElementById('chat-input');
                if (chatInput) chatInput.blur();
            }
        });
});

// Expose for debugging
window.PolyMindChat = {
    instance: null,
    version: '1.0.0',
    debug: () => window.polymindChat ? window.polymindChat.getDebugInfo() : null,
    stats: () => window.polymindChat ? window.polymindChat.logSessionStats() : null,
    testWS: () => window.testWebSocket(),    /**
     * Helper method for debugging
     */    help() {
        console.log(`
🧠 PolyMind Chat Debug Console Help

📊 Statistics & Info:
- debugChat()               - Get debug information
- chatStats()               - Get session statistics  
- window.chat.printStats()  - Print detailed stats table
- window.chat.printRecentMessages(10) - Print recent messages

🔧 Testing & Utils:
- testWebSocket()           - Send test message via WebSocket
- testStreaming()           - Test streaming typing effect
- window.chat.getMessageStats() - Get raw statistics object
- window.chat.messageLog    - Access full message log array

🎯 Agent & Connection:
- window.chat.selectedAgent - Current selected agent
- window.chat.websocket     - WebSocket connection object
- window.chat.messageStats  - Live message statistics

💡 Examples:
  > debugChat()
  > chatStats()  
  > testWebSocket()
  > window.chat.printRecentMessages(5)
        `);
        return this.getMessageStats();
    }
}

// Initialize PolyMind Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chat = new PolyMindChat();
    
    // Global debug helpers - Aided with basic GitHub coding tools
    window.debugChat = () => {
        console.group('🧠 PolyMind Chat Debug Info');
        console.log('Agent:', window.chat.selectedAgent);
        console.log('WebSocket State:', window.chat.websocket?.readyState);
        console.log('Connection URL:', window.chat.wsUrl);
        console.log('Reconnect Attempts:', window.chat.reconnectAttempts);
        console.log('Message Stats:', window.chat.getMessageStats());
        console.log('Recent Messages:', window.chat.messageLog.slice(-5));
        console.groupEnd();
        return window.chat.getMessageStats();
    };
    
    window.chatStats = () => {
        return window.chat.printStats();
    };
    
    window.testWebSocket = () => {
        if (!window.chat.websocket || window.chat.websocket.readyState !== WebSocket.OPEN) {
            console.warn('⚠️ WebSocket not connected');
            return false;
        }
        
        const testMessage = {
            content: 'Test message from debug console - ' + new Date().toISOString(),
            agent: window.chat.selectedAgent,
            timestamp: new Date().toISOString()
        };
        
        console.log('🧪 Sending test message via WebSocket:', testMessage);
        window.chat.websocket.send(JSON.stringify(testMessage));
        return true;
    };
    
    // Make PolyMindChat available globally for advanced debugging
    window.PolyMindChat = window.chat;
      console.log('🧠 PolyMind Chat initialized with enhanced logging');
    console.log('💡 Type debugChat() for debug helpers');
    console.log('📊 Type chatStats() for statistics');
    console.log('🧪 Type testWebSocket() to test connection');
    console.log('🎬 Type testStreaming() to test streaming effect');
});