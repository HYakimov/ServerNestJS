import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: { origin: '*' },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.log('WebSocket server initialized');
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    sendUpdate() {
        this.server.emit('update');
    }

    onNewEntryOrEdit(id: number) {
        this.server.emit('newOrEdit', { id: id });
    }
}  