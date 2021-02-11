const LOCAL_HOST = 'localhost:3000';
const BASE_URL = `http://${LOCAL_HOST}`;
const SOCKET_URL = `ws://${LOCAL_HOST}`;

let ws = new WebSocket(SOCKET_URL);

/**
 * Separate Vue instance which listens to the WebSocket client and passes those
 * messages on to the main Vue instance.
 */
const socket = new Vue({
    name: 'socket',
    data: {
        ws: ws
    },
    methods: {
        send: function(data) {
            this.ws.send(JSON.stringify(data));
        }
    },
    created: function() {
        // Initialise WebSocket event listeners which emit events to Vue components 
        this.ws.onopen = () => this.$emit('socket-connect');
        this.ws.onclose = () => this.$emit('socket-disconnect');
        
        // TODO: need to emit different types of events to components
        this.ws.onmessage = message => this.$emit('incoming-message', message);
    }
});

