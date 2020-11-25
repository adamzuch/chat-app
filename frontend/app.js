/**
 * Displays a single message.
 */
Vue.component('chat-message', {
    props: { message: Object },
    template: '<li>{{ message.text }}</li>'
});

/**
 * Displays the list of messages between client and server.
 */
Vue.component('chat-window', {
    props: [],
    data: function() {
        return {
            messageList: []
        }
    },
    methods: {
        handleMessage: function(message) {
            const m = {
                id: this.messageList.length,
                text: message.data
            }
            this.messageList.push(m);
        },
    },
    created: function() {
        // new message event listener
        socket.$on('new-message', this.handleMessage);
    },
    template: 
        `<div>
            <ul>                               
                <chat-message                   
                    v-for="item in messageList" 
                    :message="item"             
                    :key="item.id"              
                ></chat-message>               
            </ul>
        </div>`
});

/**
 * Responsible for handling user input.
 */
Vue.component('chat-input', {
    props: { connected: Boolean },
    data: function() {
        return {
            inputText: ''
        }
    },
    methods: {
        sendMessage: function() {
            if (this.$props.connected) socket.ws.send(this.inputText);
        }
    },
    template: 
        `<div>
            <input v-model="inputText"><button @click="sendMessage">Send</button>
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
            {{ connected ? 'CONNECTED' : 'NOT CONNECTED' }}
            <div v-if="userId.length > 0">id: {{ userId }}</div> 
        </div>`
})

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
            response = await axios.get('http://localhost:3000/api/idgen');
            this.userId = response.data.id; 
        } catch (error) {
            console.log(error);
        }
    }
});
