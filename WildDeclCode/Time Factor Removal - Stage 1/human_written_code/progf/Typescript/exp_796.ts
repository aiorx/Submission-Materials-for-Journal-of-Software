var Chat = require('../../../entities/Chat');
var User = require('../../../entities/User');
var GetChatQueryArgs = require('../../../types/graph').GetChatQueryArgs;
var GetChatResponse = require('../../../types/graph').GetChatResponse;
var Resolvers = require('../../../types/resolvers').Resolvers;
var privateResolver = require('../../../utils/privateResolver');

const resolvers: Resolvers = {
  Query: {
    GetChat: privateResolver(
      async (_, args: GetChatQueryArgs, { req }): Promise<GetChatResponse> => {
        const user: User = req.user;
        try {
          const chat = await Chat.findOne(
            {
              id: args.chatId
            },
            { relations: ["messages"] }
          );
          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              return {
                ok: true,
                error: null,
                chat
              };
            } else {
              return {
                ok: false,
                error: "Not authorized to see this chat",
                chat: null
              };
            }
          } else {
            return {
              ok: false,
              error: "Not found",
              chat: null
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            chat: null
          };
        }
      }
    )
  }
};

module.exports = resolvers;
