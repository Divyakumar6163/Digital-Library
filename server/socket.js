const { Server } = require("socket.io");
const Bookschema = require("./models/bookmodel");
const { log } = require("handlebars");
function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://digital-library-alpha.vercel.app",
      ],
      methods: ["GET", "POST", "DELETE", "PUT"],
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
    socket.on("remove-chapter", async ({ bookId, chapterId }) => {
      if (!bookId || chapterId === undefined) return;

      const book = await Bookschema.findById(bookId);
      if (!book) return;

      book.chapters = book.chapters.filter(
        (chp) => chp._id.toString() !== chapterId
      );
      await book.save();
      socket.to(bookId).emit("chapter-removed", chapterId);
    });
    socket.on("update-chapter-title", ({ bookId, chpId, title }) => {
      try {
        if (!bookId || !chpId || typeof title !== "string") {
          return;
        }

        // 🚀 Instant broadcast to collaborators
        socket.to(bookId).emit("chapter-title-updated", {
          chpId,
          title,
        });
      } catch (err) {
        console.error("update-chapter-title error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

module.exports = initSocket;
