var withFilter = require('graphql-yoga').withFilter;
var Chat = require('../../../entities/Chat');
var User = require('../../../entities/User');

const resolvers = {
  Subscription: {
    MessageSubscription: {
      subscribe: withFilter(
        function (_, __, { pubSub }) { return pubSub.asyncIterator("newChatMessage"); },
        async function (payload, _, { context }) {
          const user: User = context.currentUser;
          const {
            MessageSubscription: { chatId }
          } = payload;
          try {
            const chat = await Chat.findOne({ id: chatId });
            if (chat) {
              return chat.driverId === user.id || chat.passengerId === user.id;
            } else {
              return false;
            }
          } catch (error) {
            return false;
          }
        }
      )
    }
  }
};

module.exports = resolvers;
