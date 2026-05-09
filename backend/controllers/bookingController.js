const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { name, phone, weddingDate, location, message } = req.body;

    if (!name || !phone || !weddingDate || !location) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const booking = new Booking({
      name,
      phone,
      weddingDate,
      location,
      message,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
