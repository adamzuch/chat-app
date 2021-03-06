
/**
 * Displays the user's id.
 */
Vue.component('connection-status', { 
    props: { 
        connected: Boolean,
        userId: String 
    },
    template: 
        `<div class="connection-status">
            <div>id: {{ userId.length > 0 ? userId : 'None' }}</div> 
        </div>`
});

/**
 * Displays the list of messages.
 */
Vue.component('chat-window', {
    props: {
        userId: String
    },
    data: function() {
        return {
            messageList: []
        };
    },
    methods: {
        incomingMessage: function(inc) {
            this.messageList.push(JSON.parse(inc.data));
            this.$nextTick(() => this.scrollToEnd());
        },
        outgoingMessage: function(out) {
            this.messageList.push(out);
            this.$nextTick(() => this.scrollToEnd());
        },
        scrollToEnd: function() {
            const chatWindow = this.$refs.chatWindow;
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    },
    created: function() {
        socket.$on('incoming-message', this.incomingMessage);  // incoming comes from WebSocet server
        this.$root.$on('outgoing-message', this.outgoingMessage);  // outgoing comes from client event
    },
    template: 
        `<div class="chat-window" ref="chatWindow">                               
            <chat-message 
                :userId="userId"                  
                v-for="item in messageList" 
                :message="item"             
                :key="item.id"              
            ></chat-message>               
        </div>`
});

/**
 * Displays a single message.
 */
Vue.component('chat-message', {
    props: { 
        userId: String,
        message: Object 
    },
    template: 
        `<div :class="'chat-message ' + (userId == message.userId ? 'outgoing' : 'incoming')">
            {{ message.text }}
            <div class="message-footer">
                {{ userId == message.userId ? 'You' : message.userId }} @ {{ message.time }}
            </div> 
        </div>`
});

/**
 * Handles user input and sends outgoing messages.
 */
Vue.component('chat-input', {
    props: {
        connected: Boolean,
        userId: String
    },
    data: function() {
        return {
            inputText: ''
        };
    },
    methods: {
        outgoingMessage: function() {
            datetime = new Date();
            const out = {
                userId: this.$props.userId,
                type: 200,
                time: datetime.toLocaleTimeString() + " " + datetime.toLocaleDateString(),
                text: this.inputText
            }
            this.$root.$emit('outgoing-message', out);  // emit event which chat window listens to.
            if (this.$props.connected) socket.send(out);

            this.inputText = ''; // reset form
        }
    },
    template: 
        `<div class="chat-input">
            <input id="chat-input-text" placeholder="Write your message..." v-model="inputText" @keyup.enter="outgoingMessage">
            <button id="chat-input-button" :disabled="!(inputText.length) > 0" @click="outgoingMessage"><b>SEND</b></button>
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
