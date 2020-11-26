/**
 * Displays a single message.
 */
Vue.component('chat-message', {
    props: { message: Object },
    template: '<div>{{ message.text }}</div>'
});

/**
 * Displays the list of messages and handles incoming and outgoing messages.
 */
Vue.component('chat-window', {
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
        incomingMessage: function(message) {
            const m = {
                id: this.messageList.length,
                text: message.data
            }
            this.messageList.push(m);
        },
        outgoingMessage: function() {
            if (this.$props.connected) socket.ws.send(this.inputText);
        }
    },
    created: function() {
        // new message event listener
        socket.$on('new-message', this.incomingMessage);
    },
    template: 
        `<div>
            <p><div>                               
                <chat-message                   
                    v-for="item in messageList" 
                    :message="item"             
                    :key="item.id"              
                ></chat-message>               
            </div>
            <p><div>
                <input v-model="inputText"><button @click="outgoingMessage">Send</button>
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
            console.log(error);
        }
    }
});
