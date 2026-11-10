import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
var NestGateway = require('@nestjs/websockets/interfaces/nest-gateway.interface').NestGateway;
var ChatService = require('./chat.service').ChatService;
var Bind = require('@nestjs/common').Bind;
var UseInterceptors = require('@nestjs/common').UseInterceptors;
var Chat = require('./chat.entity').Chat;

@WebSocketGateway()
class ChatGateway implements NestGateway {
  constructor(private chatService: ChatService) { }

  afterInit(server: any) {
    // console.log('Init', server);
  }

  handleConnection(socket: any) {
    const query = socket.handshake.query;
    console.log('Connect', query);
    this.chatService.userConnected(query.userName, query.registrationToken);
    process.nextTick(async function () {
      socket.emit('allChats', await this.chatService.getChats());
    });
  }

  handleDisconnect(socket: any) {
    const query = socket.handshake.query;
    console.log('Disconnect', socket.handshake.query);
    this.chatService.userDisconnected(query.userName);
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('chat')
  async handleNewMessage(chat: Chat, sender: any) {
    console.log('New Chat', chat);
    await this.chatService.saveChat(chat);
    sender.emit('newChat', chat);
    sender.broadcast.emit('newChat', chat);
    await this.chatService.sendMessagesToOfflineUsers(chat);
  }
}
