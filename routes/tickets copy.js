const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

/* THIS FILE TICKETS COPY IS NOT ACTUALLY USED, IT IS ACTUALLY KEEPED FOR TESTING */
/* THIS FILE TICKETS COPY IS NOT ACTUALLY USED, IT IS ACTUALLY KEEPED FOR TESTING */
/* THIS FILE TICKETS COPY IS NOT ACTUALLY USED, IT IS ACTUALLY KEEPED FOR TESTING */
/* THIS FILE TICKETS COPY IS NOT ACTUALLY USED, IT IS ACTUALLY KEEPED FOR TESTING */

// import Models
const Tickets = require("../models/Tickets");

// ------------- ROUTE CREATE -----------------

router.post("/user/create_tickets", isAuthenticated, async (req, res) => {
  console.log("/user/create_tickets");

  try {
    // CHECK if the ticket doesn't already in the database with the function findOne
    const tickets = await Tickets.findOne({
      owner: req.fields.userId,
      name: req.fields.name,
      comment: req.fields.comment,
      ticketId: req.fields.ticketId,
    });

    // If the ticket does exist in the database
    // Create a new file thanks to the data send with Postman
    if (!tickets) {
      const newTickets = new Tickets({
        owner: req.fields.userId,
        name: req.fields.name,
        comment: req.fields.comment,
        ticketId: req.fields.ticketId,
      });

      // save the new ticket in the database
      await newTickets.save();
      res.status(200).json({
        owner: newTickets.owner,
        name: newTickets.name,
        image: newTickets.image,
        gameId: newTickets.gameId,
      });
    } else {
      res.status(409).json({ message: "This ticket is already created" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ------------- ROUTE GET ALL-----------------

router.get("/user/get_tickets/:id", async (req, res) => {
  console.log("route : /user/get_tickets");
  try {
    const userId = req.params.id;
    console.log(userId);
    // We search thanks to the function find(), all the documents of the collection 'tickets' :
    const tickets = await Tickets.find({ owner: userId });

    // We return then all the documents founded

    res.status(200).json({ tickets: tickets });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error.message);
  }
});

// ------------- ROUTE UPDATE -----------------

router.post("/user/update_tickets", isAuthenticated, async (req, res) => {
  console.log("route : /user/update_tickets");

  try {
    // If the Id and the name have been transfered

    // we search the ticket to update from its Id
    const ticket = await Tickets.findOne({
      owner: req.fields.userId,
      name: req.fields.name,
      comment: req.fields.comment,
      ticketId: req.fields.ticketId,
    });

    if (ticket) {
      // Autre manière de trouver un document à partir d'un `id` :
      // const ticket = await Tickets.findOne({ _id: req.fields.id });
      // We modify the key "name" for the object "ticket" founded:
      ticket.name = req.fields.name;
      ticket.comment = req.fields.comment;

      // We save the modifications in the database:
      await ticket.save();
      // We return the document "ticket"
      res.json(ticket);
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ------------- ROUTE DELETE -----------------

router.post("/user/delete_tickets", async (req, res) => {
  console.log("route :/ delete_tickets");
  try {
    // if the Id has been transfered

    // We search the "ticket" to modify from its id and we delete it:
    const ticketToDelete = await Tickets.findOne({
      owner: req.fields.userId,
      name: req.fields.name,
      comment: req.fields.comment,
      ticketId: req.fields.ticketId,
    });

    if (ticketToDelete) {
      await ticketToDelete.delete();
      // We answer to the user :
      res.json({ message: "Ticket removed" });
    } else {
      // if no id has been transfered
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
