let ws = new WebSocket('ws://localhost:3000');

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

