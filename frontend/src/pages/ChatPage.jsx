import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import { StreamChat } from "stream-chat"
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react"
import ChatLoader from '../components/ChatLoader';
import toast from 'react-hot-toast';
import CallButton from '../components/CallButton';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  const {id:targetUserId} = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const {authUser} = useAuthUser();

  const {data:tokenId} = useQuery({
    queryKey:["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser // to only run when authUser is avaiable 
                        // !! is javascript trick to turn value to boolean
  });

  useEffect(() => {
    const initChat = async () => {
      if(!tokenId?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);
        console.log(STREAM_API_KEY);

        console.log(tokenId.token)
        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        }, tokenId.token)

        const channelId = [authUser._id, targetUserId].sort().join("-");
        // sort is to make sure we don't make 2 different channels for the same 2 person
        // chatting with each other

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
        


      } catch (error) {
        console.error("Error in initializing chat: ", error);
        toast.error("Could not connect to chat. Please try again.")
      } finally {
        setLoading(false);
      }
    }

    initChat()
  }, [tokenId, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if(loading || !chatClient || !channel) return <ChatLoader />

  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage