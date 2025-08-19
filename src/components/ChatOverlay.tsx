import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { ChatBubble } from './ChatBubble';
import { ChatGenerator, ChatMessage } from '../services/ChatGenerator';

interface ChatOverlayProps {
  players: Array<{
    id: number;
    name: string;
    color: string;
    progress: number;
  }>;
  gameProgress: number;
}

interface ActiveChat extends ChatMessage {
  position: { x: number; y: number };
  color: string;
  name: string;
}

const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
const PLAYER_NAMES = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

export const ChatOverlay: React.FC<ChatOverlayProps> = ({ players, gameProgress }) => {
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const chatGenerator = useRef(new ChatGenerator()).current;

  useEffect(() => {
    // Generate initial message immediately for testing
    const testChat: ActiveChat = {
      id: 'test-' + Date.now(),
      playerId: 1,
      message: "Let's go! 🚀",
      timestamp: Date.now(),
      position: { x: 50, y: 150 },
      color: '#FF6B6B',
      name: 'You',
    };
    setActiveChats([testChat]);

    const interval = setInterval(() => {
      // Sort players by progress to determine positions
      const sortedPlayers = [...players].sort((a, b) => b.progress - a.progress);
      
      players.forEach((player, index) => {
        const position = sortedPlayers.findIndex(p => p.id === player.id) + 1;
        const message = chatGenerator.generateMessage(
          player.id,
          gameProgress,
          position,
          players.length
        );

        if (message) {
          const chatPosition = getChatPosition(index);
          const newChat: ActiveChat = {
            ...message,
            position: chatPosition,
            color: player.color || PLAYER_COLORS[index],
            name: player.name || PLAYER_NAMES[index],
          };

          setActiveChats(prev => {
            // Limit to 5 active chats
            const updated = [...prev, newChat];
            if (updated.length > 5) {
              return updated.slice(-5);
            }
            return updated;
          });

          // Sometimes generate a reaction from another player
          if (Math.random() > 0.8) {
            setTimeout(() => {
              const otherPlayerId = players.find(p => p.id !== player.id)?.id;
              if (otherPlayerId) {
                const reaction = chatGenerator.generateReactionTo(player.id, otherPlayerId);
                if (reaction) {
                  const reactingPlayerIndex = players.findIndex(p => p.id === otherPlayerId);
                  const reactionChat: ActiveChat = {
                    ...reaction,
                    position: getChatPosition(reactingPlayerIndex),
                    color: players[reactingPlayerIndex].color || PLAYER_COLORS[reactingPlayerIndex],
                    name: players[reactingPlayerIndex].name || PLAYER_NAMES[reactingPlayerIndex],
                  };
                  setActiveChats(prev => {
                    const updated = [...prev, reactionChat];
                    if (updated.length > 5) {
                      return updated.slice(-5);
                    }
                    return updated;
                  });
                }
              }
            }, 500 + Math.random() * 1000);
          }
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [players, gameProgress]);

  const getChatPosition = (playerIndex: number) => {
    const positions = [
      { x: 20, y: 100 },   // Top left
      { x: 180, y: 100 },  // Top right
      { x: 20, y: 250 },   // Bottom left
      { x: 180, y: 250 },  // Bottom right
    ];
    return positions[playerIndex % 4];
  };

  const handleChatComplete = (chatId: string) => {
    setActiveChats(prev => prev.filter(chat => chat.id !== chatId));
  };

  // Debug logging
  useEffect(() => {
    console.log('Active chats:', activeChats.length);
    activeChats.forEach(chat => {
      console.log('Chat:', chat.name, chat.message, chat.position);
    });
  }, [activeChats]);

  return (
    <View style={styles.container} pointerEvents="none">
      {activeChats.map(chat => (
        <ChatBubble
          key={chat.id}
          message={chat.message}
          playerColor={chat.color}
          playerName={chat.name}
          position={chat.position}
          onAnimationComplete={() => handleChatComplete(chat.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 999,
  },
});