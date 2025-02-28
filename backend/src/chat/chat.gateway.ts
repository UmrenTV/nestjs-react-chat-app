import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
    cors: {
        origin: '*', // TODO: Adjust this for real environments (the frontend URL, etc)
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly chatService: ChatService,
        private readonly authService: AuthService,
    ) {}

    async handleConnection(socket: Socket) {
        try {
            // For token-based auth, the client would send a query param or handshake header
            const token = socket.handshake.auth?.token;
            if (!token) {
                socket.disconnect();
                return;
            }
            const decoded = this.authService.verifyToken(token);
            console.log(`Client connected: ${decoded.username}`);

            // Could store user info in socket.data if needed
            // TODO: Add user to online list

            // Optionally, emit all existing messages so a newly connected user sees the history
            const messages = await this.chatService.getAllMessages();
            socket.emit('allMessages', messages);
        } catch (error) {
            console.log('Connection error', error.message);
            socket.disconnect();
        }
    }

    handleDisconnect(socket: Socket) {
        console.log(`Client disconnected: ${socket.id}`);
    }

    // Listen for 'sendMessage' events from the client
    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody() data: { content: string },
        @ConnectedSocket() socket: Socket,
    ) {
        // Get user info from the token again or from socket data
        const token = socket.handshake.auth?.token;
        const decoded = this.authService.verifyToken(token);

        const messageDoc = await this.chatService.createMessage(
            decoded.username,
            data.content,
        );

        console.log('newMessage', messageDoc);

        // Broadcast the new message to all clients
        this.server.emit('newMessage', messageDoc);
    }
}
