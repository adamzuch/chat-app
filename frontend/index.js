
const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = event => {
    const text = event.data;
    const newMessage = {
        id: vm.messageList.length,
        text: text
    } 
    vm.messageList.push(newMessage);
}

Vue.component('chat-message', {
    props: ['message'],
    template: '<li>{{ message.text }}</li>'
});

Vue.component('chat-window', {
    props: ['messageList'],
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

Vue.component('chat-input', {
    props: [],
    data: function() {
        return {
            inputText: ''
        }
    },
    methods: {
        sendMessage: function() {
            if (ws.readyState == 1) ws.send(this.inputText);
        }
    },
    template: 
        `<div>
            <input v-model="inputText"><button @click="sendMessage">Send</button>
            <div>{{ inputText }}</div>
        </div>`
});

const vm = new Vue({
    el: '#app',
    data: {
        messageList: [
            { id: 0, text: 'Hey' },
            { id: 1, text: 'How' },
        ]
    },
    methods: {}
});
