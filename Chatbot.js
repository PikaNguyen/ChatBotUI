import React, { useState, useEffect } from 'react';
import { GiftedChat, MessageImage } from 'react-native-gifted-chat';
import axios from 'axios';
import { View, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [dotOpacity] = useState(new Animated.Value(1));

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Xin chào! Tôi là Travel Bot Đà Lạt. Hãy hỏi tôi về các điểm đến!\n- Địa điểm du lịch truyền thống.\n- Địa điểm du lịch check-in view đẹp\n Hoặc đặc sản nổi tiếng ở Đà Lạt:\n-Đặc sản nông sản\n-Đặc sản món ăn',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Travel Bot',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const animateDots = () => {
    Animated.sequence([
      Animated.timing(dotOpacity, {
        toValue: 0.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(dotOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => animateDots());
  };

  useEffect(() => {
    animateDots();
  }, []);

  const onSend = async (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    try {
      const botTypingMessage = {
        _id: Math.random().toString(36).substring(7),
        text: (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Animated.Text
              style={{ fontSize: 16, opacity: dotOpacity }}
            >
              .
            </Animated.Text>
            <Animated.Text
              style={{ fontSize: 16, opacity: dotOpacity, marginLeft: 4 }}
            >
              .
            </Animated.Text>
            <Animated.Text
              style={{ fontSize: 16, opacity: dotOpacity, marginLeft: 4 }}
            >
              .
            </Animated.Text>
          </View>
        ),
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Travel Bot',
          avatar: 'https://placeimg.com/140/140/any',
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [botTypingMessage])
      );
      const response = await axios.post(
        'http://172.16.18.96:5005/webhooks/rest/webhook',
        { message: newMessages[0].text }
      );
    
      
      const botMessages = response.data.map((message) => {
        if (message.hasOwnProperty('buttons')) {
          return {
            _id: Math.random().toString(36).substring(7),
            text: message.text,
            createdAt: new Date(),
            quickReplies: {
              type: 'radio',
              values: message.buttons.map((button) => {
                return { title: button.title, value: button.payload };
              }),
            },
            user: {
              _id: 2,
              name: 'Travel Bot',
              avatar: 'https://placeimg.com/140/140/any',
            },
          };
        } else {
          // Check if message has image
          if (message.hasOwnProperty('image')) {
            // If it has image, create a MessageImage component to display it
            return {
              _id: Math.random().toString(36).substring(7),
              createdAt: new Date(),
              image: message.image,
              user: {
                _id: 2,
                name: 'Travel Bot',
                avatar: 'https://placeimg.com/140/140/any',
              },
            };
          } else {
            // Otherwise, display normal text message
            return {
              _id: Math.random().toString(36).substring(7),
              text: message.text,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'Travel Bot',
                avatar: 'https://placeimg.com/140/140/any',
              },
            };
          }
        }
      });
      setTimeout(() => {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, botMessages)
        );
        setMessages((previousMessages) =>
          previousMessages.filter((message) => message._id !== botTypingMessage._id)
        );
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: 1,
      }}
      renderMessageImage={(props) => <MessageImage {...props} />}
    />
  );
};

export default ChatBot;