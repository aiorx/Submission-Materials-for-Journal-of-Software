var createContext = require('react').createContext;
var Socket = require('socket.io-client').Socket;

export interface ISocketContextState {
    socket: Socket | undefined;
    uid: string;
    users: string[];
}

const defaultSocketContextState: ISocketContextState = {
    socket: undefined,
    uid: '',
    users: []
};

export type TSocketContextActions = 'update_socket' | 'update_uid' | 'update_users' | 'remove_user';
export type TSocketContextPayload = string | string[] | Socket;

export interface ISocketContextActions {
    type: TSocketContextActions;
    payload: TSocketContextPayload;
}

const SocketReducer = function (state: ISocketContextState, action: ISocketContextActions) {
    console.log('Message recieved - Action: ' + action.type + ' - Payload: ', action.payload);

    switch (action.type) {
        case 'update_socket':
            return { ...state, socket: action.payload as Socket };
        case 'update_uid':
            return { ...state, uid: action.payload as string };
        case 'update_users':
            return { ...state, users: action.payload as string[] };
        case 'remove_user':
            return { ...state, users: state.users.filter((uid) => uid !== (action.payload as string)) };
        default:
            return state;
    }
};

export interface ISocketContextProps {
    SocketState: ISocketContextState;
    SocketDispatch: React.Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
    SocketState: defaultSocketContextState,
    SocketDispatch: function () {}
});

const SocketContextConsumer = SocketContext.Consumer;
const SocketContextProvider = SocketContext.Provider;

module.exports = SocketContext;
