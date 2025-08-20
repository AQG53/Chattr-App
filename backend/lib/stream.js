import {StreamChat} from "stream-chat";
import "dotenv/config"

const apikey = process.env.STEAM_API_KEY
const apisecret = process.env.STEAM_API_SECRET

if(!apikey || !apisecret) {
    console.error("Stream API key or Secret is missing!");
}
const streamClient = StreamChat.getInstance(apikey, apisecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUser(userData);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream User: ", error);
    }
};

export const generateStreamToken = (userId) => {
    try {
        //ensuring userId is a string
        const userIdstr = userId.toString();
        return streamClient.createToken(userIdstr);
    } catch (error) {
        console.error("Error generating Stream token: ", error);
    }
};