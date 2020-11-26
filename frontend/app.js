/**
 * Displays a single message.
 */
Vue.component('chat-message', {
    props: { 
        userId: String,
        message: Object 
    },
    template: 
        `<div class="chat-message">
            <{{ userId == message.userId ? 'YOU' : message.userId }} @{{ message.time }}> 
            <b>{{ message.text }}</b> 
        </div>`
});

/**
 * Displays the list of messages and handles incoming and outgoing messages.
 */
Vue.component('chat', {
    props: {
        connected: Boolean,
        userId: String
    },
    data: function() {
        return {
            messageList: [],
            inputText: ''
        }
    },
    methods: {
        incomingMessage: function(inc) {
            this.messageList.push(JSON.parse(inc.data));
            this.$nextTick(() => this.scrollToEnd());
        },
        outgoingMessage: function() {
            const out = {
                userId: this.$props.userId,
                type: 200,
                time: new Date().toISOString(),
                text: this.inputText
            }
            this.messageList.push(out);
            if (this.$props.connected) socket.send(out);

            this.inputText = ''; // reset form
            this.$nextTick(() => this.scrollToEnd());
        },
        scrollToEnd: function() {
            const chatWindow = this.$refs.chatWindow;
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    },
    created: function() {
        // new message event listener
        socket.$on('new-message', this.incomingMessage);
    },
    template: 
        `<div>
            <p><div class="chat-window" ref="chatWindow">                               
                <chat-message 
                    :userId="userId"                  
                    v-for="item in messageList" 
                    :message="item"             
                    :key="item.id"              
                ></chat-message>               
            </div>
            <p><div class="chat-input">
                <input v-model="inputText" @keyup.enter="outgoingMessage">
                <button :disabled="!(inputText.length) > 0" @click="outgoingMessage">SEND</button>
            </div>
        </div>`
});

/**
 * Displays the status of the WebSocket connection.
 */
Vue.component('connection-status', { 
    props: { 
        connected: Boolean,
        userId: String 
    },
    template: 
        `<div>
            status: {{ connected ? 'CONNECTED' : 'NOT CONNECTED' }}
            <div>id: {{ userId.length > 0 ? userId : 'None' }}</div> 
        </div>`
});

/**
 * The root Vue instance.
 */
const vm = new Vue({
    name: 'app',
    el: '#app',
    data: {
        connected: false,
        userId: ''
    },
    created: async function() {
        // socket connection event listeners
        socket.$on('socket-connect', () => this.connected = true);
        socket.$on('socket-disconnect', () => this.connected = false);

        // get user id
        try {
            const response = await fetch(`${BASE_URL}/api/id`);
            this.userId = (await response.json()).id;
        } catch (error) {
            this.userId = 'ERROR'
            console.log(error);
        }
        // register connection with socket
        socket.send({
            userId: this.userId,
            type: 100
        });
    }
});
