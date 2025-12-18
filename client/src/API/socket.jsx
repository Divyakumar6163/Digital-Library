import { io } from "socket.io-client";

// export const socket = io("http://localhost:5000", {
//   transports: ["websocket"],
// });
export const socket = io("https://digital-library-cryf.onrender.com", {
  transports: ["websocket"],
});
