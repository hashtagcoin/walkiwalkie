export interface ChatMessage {
  id: string;
  playerId: number;
  message: string;
  timestamp: number;
}

const greetings = [
  "Let's go! 🚀",
  "Ready to walk! 💪",
  "Here we go! 🎯",
  "Time to move! 🏃",
  "Let's do this! 🔥",
];

const encouragements = [
  "You got this! 💪",
  "Keep it up! 👏",
  "Looking good! ✨",
  "Nice pace! 🏃",
  "Awesome! 🌟",
  "Great job! 👍",
  "You're crushing it! 💥",
];

const taunts = [
  "Catch me if you can! 😂",
  "Too slow! 🐌",
  "Is that all you got? 😆",
  "I'm way ahead! 🤣",
  "Eat my dust! 💨",
  "See ya at the finish! 👋",
  "Better hurry up! ⏰",
];

const reactions = [
  "Whoa! 😮",
  "No way! 😱",
  "Haha! 😂",
  "OMG! 🤯",
  "Seriously?! 😲",
  "LOL! 🤣",
  "Nice one! 😄",
];

const celebrations = [
  "Yes! I did it! 🎉",
  "Victory is mine! 🏆",
  "Champion! 👑",
  "First place baby! 🥇",
  "I'm the best! 🌟",
  "Unbeatable! 💪",
  "Winner winner! 🎊",
];

const frustrations = [
  "Oh come on! 😤",
  "Not fair! 😠",
  "Ugh! 😫",
  "This is hard! 😰",
  "I can't keep up! 😩",
  "Wait for me! 😭",
];

const midGameBanter = [
  "This is fun! 😊",
  "My legs are burning! 🔥",
  "Almost there! 🏁",
  "Don't give up! 💯",
  "Push harder! 💪",
  "I love this game! ❤️",
  "Who's winning? 🤔",
  "Keep walking! 👣",
];

const emojis = ["😂", "🤣", "😆", "😎", "🔥", "💪", "✨", "🎯", "🚀", "💯", "👏", "🌟"];

export class ChatGenerator {
  private lastMessageTime: { [playerId: number]: number } = {};
  private messageHistory: ChatMessage[] = [];

  generateMessage(playerId: number, gameProgress: number, playerPosition: number, totalPlayers: number): ChatMessage | null {
    const now = Date.now();
    const lastTime = this.lastMessageTime[playerId] || 0;
    
    // Limit message frequency (2-5 seconds between messages per player)
    if (now - lastTime < 2000 + Math.random() * 3000) {
      return null;
    }

    // Higher chance to send a message
    if (Math.random() > 0.4) {
      return null;
    }

    let messagePool: string[] = [];

    // Select message based on game state
    if (gameProgress < 0.1) {
      messagePool = greetings;
    } else if (gameProgress > 0.9) {
      if (playerPosition === 1) {
        messagePool = [...celebrations, ...taunts];
      } else {
        messagePool = [...frustrations, ...encouragements];
      }
    } else {
      // Mid-game logic
      if (playerPosition === 1) {
        messagePool = [...taunts, ...midGameBanter, ...reactions];
      } else if (playerPosition === totalPlayers) {
        messagePool = [...frustrations, ...encouragements, ...midGameBanter];
      } else {
        messagePool = [...midGameBanter, ...encouragements, ...reactions];
      }
    }

    // Sometimes add random emoji
    let message = messagePool[Math.floor(Math.random() * messagePool.length)];
    if (Math.random() > 0.7) {
      message += " " + emojis[Math.floor(Math.random() * emojis.length)];
    }

    const chatMessage: ChatMessage = {
      id: `${playerId}-${now}`,
      playerId,
      message,
      timestamp: now,
    };

    this.lastMessageTime[playerId] = now;
    this.messageHistory.push(chatMessage);

    // Keep only last 20 messages
    if (this.messageHistory.length > 20) {
      this.messageHistory.shift();
    }

    return chatMessage;
  }

  generateReactionTo(originalPlayerId: number, reactingPlayerId: number): ChatMessage | null {
    if (originalPlayerId === reactingPlayerId) return null;
    
    const now = Date.now();
    const reactionMessages = [
      "Haha nice one! 😂",
      "You wish! 😏",
      "Dream on! 💭",
      "That's what you think! 🤔",
      "We'll see about that! 😤",
      "Challenge accepted! 💪",
      "Bring it on! 🔥",
      "LOL good luck! 🤣",
    ];

    const message = reactionMessages[Math.floor(Math.random() * reactionMessages.length)];

    return {
      id: `${reactingPlayerId}-${now}`,
      playerId: reactingPlayerId,
      message,
      timestamp: now,
    };
  }

  reset() {
    this.lastMessageTime = {};
    this.messageHistory = [];
  }
}