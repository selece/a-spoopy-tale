'use strict';

const socket = io.connect();

console.log('Connected to server!');

// chat overrides
$(document).ready(() => {
    $('#chat-controls').submit((event) => {
        event.preventDefault(event);

        let message_clean = escape_html($('#chat-input').val());
        if (message_clean !== '') {
            console.log('Sending chat: ', message_clean);
            socket.emit('ev_client', {
                type: 'chat',
                data: message_clean
            });

            $('#chat-input').val('');
        }
    });
});

// html escape for safe chat
const html_entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escape_html(input_string) {
    return String(input_string).replace(/[&<>"'`=\/]/g, (str) => {
        return html_entities[str];
    });
}