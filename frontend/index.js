
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
    app.connected = true;
}

ws.onmessage = event => {
    app.message = event.data;
}

const app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        connected: false
    },
    methods: {
        sendMessage: function() {
            if (ws.readyState == 1) ws.send('Hello from Vue');
        }
    }
});