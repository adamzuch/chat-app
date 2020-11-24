
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
    vm.connected = true;
}

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
})

const vm = new Vue({
    el: '#app',
    data: {
        messageList: [
            { id: 0, text: 'Hey' },
            { id: 1, text: 'How' },
        ]
    },
    methods: {
        sendMessage: function() {
            if (ws.readyState == 1) ws.send('Hello from Vue');
        }
    }
});
