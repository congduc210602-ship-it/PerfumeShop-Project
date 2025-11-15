import api from "./axiosConfig";

export const postChatMessage = (message) => {
    return api.post("/chat", { message: message }); // Gửi đi theo format ChatRequest
};