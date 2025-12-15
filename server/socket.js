const { Server } = require("socket.io");
const Bookschema = require("./models/bookmodel");
function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://digital-library-alpha.vercel.app",
      ],
      methods: ["GET", "POST","DELETE","PUT"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socket.on("join-book", (bookId) => {
        socket.join(bookId);
        console.log(`Socket ${socket.id} joined book ${bookId}`);
        });

        socket.on("leave-book", (bookId) => {
        socket.leave(bookId);
    });

    socket.on("add-chapter", async ({ bookId, chapter }) => {
        if (!bookId || !chapter) return;
        await Bookschema.findByIdAndUpdate(
            bookId,
            { $push: { chapters: chapter } },
            { new: true }
        );
        socket.to(bookId).emit("chapter-added", chapter);

        console.log(`Chapter added to book ${bookId}`);
    });
    socket.on("remove-chapter", async ({ bookId, chapterIndex }) => {
        if (!bookId || chapterIndex === undefined) return;

        const book = await Bookschema.findById(bookId);
        if (!book) return;

        book.chapters.splice(chapterIndex, 1);
        await book.save();
        socket.to(bookId).emit("chapter-removed", book.chapters );
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

module.exports = initSocket;
