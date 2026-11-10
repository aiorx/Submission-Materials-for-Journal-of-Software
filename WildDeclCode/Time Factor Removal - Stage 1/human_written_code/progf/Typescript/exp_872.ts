// npm
var net = require('net');
var crypto = require('crypto');

// database
var UserEntity = require('server/database/user').UserEntity;

// classes
var packetSecurity = require('server/classes/packet-security').packetSecurity;
var packet = require('server/classes/packet').packet;

class GameClient {
	private socket: net.Socket;
	public id: string;
	public state: 'connection' | 'login' | 'password' | 'characters' | 'game' = 'connection';

	public user!: UserEntity;

	public constructor(socket: net.Socket) {
		this.socket = socket;
		this.id = crypto.randomBytes(10).toString('hex');

		this.socket.on('data', this.onDataReceived);
	}

	private onDataReceived = function (buffer: Buffer) {
		if (this.state === 'connection') {
			if (buffer.length === 4 || buffer.length === 120) {
				this.state = 'login';

				if (buffer.length === 120) {
					this.onDataReceived(buffer.slice(4));
				}
			} else {
				this.close();
			}
		} else {
			packetSecurity.decrypt(buffer);

			packet.controller(this, buffer);
		}
	};

	public send = function (buffer: Buffer) {
		packetSecurity.encrypt(buffer);

		this.socket.write(buffer);
	};

	public close = function () {
		this.socket.destroy();
	};
}
