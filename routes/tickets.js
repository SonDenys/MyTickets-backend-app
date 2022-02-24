const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

// import Models
const Tickets = require("../models/Tickets");

// ------------- ROUTE CREATE -----------------

router.post("/user/create_tickets", isAuthenticated, async (req, res) => {
  console.log("/user/create_tickets");

  try {
    // CHECK if the ticket doesn't already in the database with the function findOne
    const tickets = await Tickets.findOne({
      name: req.fields.name,
      comment: req.fields.comment,
    });

    // If the ticket does exist in the database
    // Create a new file thanks to the data send with Postman
    if (!tickets) {
      const newTickets = new Tickets({
        name: req.fields.name,
        comment: req.fields.comment,
      });

      // save the new ticket in the database
      await newTickets.save();
      res.json({ message: "The ticket has been created !" });
    } else {
      res.status(409).json({ message: "This ticket is already created" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ------------- ROUTE READ ALL-----------------

router.get("/user/get_tickets", async (req, res) => {
  console.log("route : /user/get_tickets");
  try {
    // Creation of an object in which we will store our different filters
    let filters = {};

    if (req.fields.name) {
      filters.name = new RegExp(req.query.name, "i");
    }

    // We search thanks to the function find(), all the documents of the collection 'tickets' :
    const tickets = await Tickets.find();

    // this line will return the number of tickets found according to the filters
    const count = await Tickets.countDocuments(filters);

    // We return then all the documents founded :
    res.json({ tickets: tickets, count: count });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  }
});

// ------------- ROUTE UPDATE -----------------

router.post("/user/update_tickets", isAuthenticated, async (req, res) => {
  console.log("route : /user/update_tickets");

  try {
    // If the Id and the name have been transfered
    if (req.fields.id && req.fields.name && req.fields.comment) {
      // we search the ticket to update from its Id
      const ticket = await Tickets.findById(req.fields.id);
      // Autre manière de trouver un document à partir d'un `id` :
      // const student = await Tickets.findOne({ _id: req.fields.id });

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
    if (req.fields.id) {
      // if the Id has been transfered

      // We search the "ticket" to modify from its id and we delete it:
      await Tickets.findByIdAndDelete(req.fields.id);

      // We answer to the user :
      res.json({ message: "Ticket removed" });
    } else {
      // si aucun id n'a été transmis :
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
