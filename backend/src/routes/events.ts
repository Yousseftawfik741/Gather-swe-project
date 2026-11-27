
import { Router } from "express";
import { z } from "zod";

const router = Router();

// Event data structure
type Event = {
  id: number;
  title: string;
  description: string;
};

// Validate event information
const eventSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required")
});

// Temporary event storage
const events: Event[] = [];
let nextEventId = 1;

// GET /api/events - Retrieve all events
router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Events retrieved successfully!",
    data: events
  });
});

// POST /api/events - Create a new event
router.post("/", (req, res) => {
  const validation = eventSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Invalid event data",
      errors: validation.error.flatten()
    });
    return;
  }

  const { title, description } = validation.data;

  const newEvent: Event = {
    id: nextEventId++,
    title,
    description
  };

  events.push(newEvent);

  res.status(201).json({
    success: true,
    message: "Event created successfully!",
    data: newEvent
  });
});

// GET /api/events/:id - Retrieve one event
router.get("/:id", (req, res) => {
  const eventId = Number(req.params.id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    res.status(400).json({
      success: false,
      message: "Invalid event ID"
    });
    return;
  }

  const event = events.find((item) => item.id === eventId);

  if (!event) {
    res.status(404).json({
      success: false,
      message: "Event not found"
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Event retrieved successfully!",
    data: event
  });
});

// PUT /api/events/:id - Update an existing event
router.put("/:id", (req, res) => {
  const eventId = Number(req.params.id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    res.status(400).json({
      success: false,
      message: "Invalid event ID"
    });
    return;
  }

  const event = events.find((item) => item.id === eventId);

  if (!event) {
    res.status(404).json({
      success: false,
      message: "Event not found"
    });
    return;
  }

  const validation = eventSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Invalid event data",
      errors: validation.error.flatten()
    });
    return;
  }

  const { title, description } = validation.data;

  event.title = title;
  event.description = description;

  res.status(200).json({
    success: true,
    message: "Event updated successfully!",
    data: event
  });
});

// DELETE /api/events/:id - Delete an event
router.delete("/:id", (req, res) => {
  const eventId = Number(req.params.id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    res.status(400).json({
      success: false,
      message: "Invalid event ID"
    });
    return;
  }

  const eventIndex = events.findIndex(
    (item) => item.id === eventId
  );

  if (eventIndex === -1) {
    res.status(404).json({
      success: false,
      message: "Event not found"
    });
    return;
  }

  const deletedEvent = events.splice(eventIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: "Event deleted successfully!",
    data: deletedEvent
  });
});

export default router;
