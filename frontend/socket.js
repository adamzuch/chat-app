const LOCAL_HOST = 'localhost:3000';
const BASE_URL = `http://${LOCAL_HOST}`;
const SOCKET_URL = `ws://${LOCAL_HOST}`;

let ws = new WebSocket(SOCKET_URL);

const socket = new Vue({
    name: 'socket',
    el: '#socket',
    data: {
        ws: ws
    },
    created: function() {
        // Initialise WebSocket event listeners which emit events to Vue components 
        this.ws.onopen = () => this.$emit('socket-connect');
        this.ws.onclose = () => this.$emit('socket-disconnect');
        // TODO: need to emit different types of events to components
        this.ws.onmessage = message => this.$emit('new-message', message);
    }
});

