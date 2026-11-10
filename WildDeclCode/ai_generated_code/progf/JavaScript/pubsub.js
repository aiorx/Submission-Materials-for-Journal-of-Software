/** Simple pubsub lib
 * Import: import { pub, sub, unsub, inspect } from "/shared/pubsub.js"
 * Example usage
 *   const button = html.pubButton('pubButton', 'psst')
 *   const subscriptionToken = sub('message', data => {}, true)
 *   // 'data' is passed as arg to a function intended as a reaction
 * Co-Supported via standard programming aids 3.5 (scaffolding)
 */

// Object to hold subscriptions
const subscriptions = {};

// Function to publish events
export function pub(eventId, data = {}) {
  console.log('→Pub', [eventId, data])
  
  const subs = subscriptions[eventId];
  if (subs) {
    subs.forEach(sub => {
      if (! sub.stay) {
        // Remove the subscription unless tasked to stay
        unsub(sub.token);
      }
      // Otherwise invisible: data is passed to func on call
      sub.func(data);
    });
  }
}

// Function to subscribe to events
export function sub(eventId, func, stay = true) {
  if (!subscriptions[eventId]) {
    subscriptions[eventId] = [];
  }

  const token = Array.from(crypto.getRandomValues(new Uint8Array(16))).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  subscriptions[eventId].push({ token, func, stay });

  console.log('↑Sub', [eventId, func, stay ? 'stay' : 'once']);

  return token; // Return subscription token
}

// Function to unsubscribe from events
export function unsub(...tokens) {
  tokens.forEach(token => {
    for (const eventId in subscriptions) {
      const subs = subscriptions[eventId];
      const index = subs.findIndex(sub => sub.token === token);
      if (index !== -1) {
        subs.splice(index, 1);
        if (subs.length === 0) {
          delete subscriptions[eventId]; // Remove empty event
        }
        break; // Exit loop after unsubscribing once
      }
    }
  });
}

// Function to inspect current subscriptions (for debugging purposes)
export function inspect() {
  return subscriptions;
}

// Function to bounce from one topic to another
export function bounce(subTopic, pubTopic) {
  // Subscribe to the subTopic
  sub(subTopic, (data) => {
    console.log(`Bouncing from ${subTopic} to ${pubTopic} with data`, data);
    // When a message is received on subTopic, publish it to pubTopic
    pub(pubTopic, data);
  });
}