// import package
const mongoose = require("mongoose");

// Creation Model
const Tickets = mongoose.model("Tickets", {
  name: String,
  comment: String,
  //   ticketId: Number,
  //   // Link the type and the Favorites because it's going to concern only the owner
  //   owner: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   },
});

module.exports = Tickets;
