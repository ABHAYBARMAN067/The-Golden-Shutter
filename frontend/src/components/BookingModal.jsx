import { useState } from 'react';
import axios from 'axios';
import API_URL from '../api';

const BookingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    weddingDate: '',
    location: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await axios.post(`${API_URL}/api/bookings`, formData);
      setSuccessMessage('Thank you! We will contact you shortly.');
      setFormData({
        name: '',
        phone: '',
        weddingDate: '',
        location: '',
        message: '',
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setErrorMessage('Failed to submit booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;


  return (
  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="relative bg-[#F5F1E8] border border-gray-200 rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[#2C2C2C]/80 hover:text-[#2C2C2C] transition-colors"
        aria-label="Close modal"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <h2 className="text-3xl font-serif italic text-[#2C2C2C]">
        Book Your Shoot
      </h2>

      <p className="text-[#2C2C2C]/70 mt-2">
        Share your details and we'll get back to you shortly.
      </p>

      {successMessage && (
        <div className="mt-4 p-4 rounded-2xl bg-green-500/20 border border-green-500/50 text-green-700">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-4 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm text-[#2C2C2C]/70 mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full rounded-2xl bg-white border border-gray-300 p-3 text-[#2C2C2C] placeholder-gray-500 focus:border-amber-400/50 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#2C2C2C]/70 mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            required
            className="w-full rounded-2xl bg-white border border-gray-300 p-3 text-[#2C2C2C] placeholder-gray-500 focus:border-amber-400/50 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#2C2C2C]/70 mb-2">
            Wedding Date
          </label>
          <input
            type="date"
            name="weddingDate"
            value={formData.weddingDate}
            onChange={handleChange}
            required
            className="w-full rounded-2xl bg-white border border-gray-300 p-3 text-[#2C2C2C] focus:border-amber-400/50 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#2C2C2C]/70 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Wedding Location"
            required
            className="w-full rounded-2xl bg-white border border-gray-300 p-3 text-[#2C2C2C] placeholder-gray-500 focus:border-amber-400/50 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#2C2C2C]/70 mb-2">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your story..."
            rows="4"
            className="w-full rounded-2xl bg-white border border-gray-300 p-3 text-[#2C2C2C] placeholder-gray-500 focus:border-amber-400/50 focus:outline-none transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full px-6 py-3 bg-amber-400 text-black font-semibold hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
        >
          {isSubmitting ? 'Submitting...' : 'Book Now'}
        </button>
      </form>
    </div>
  </div>
);
};

export default BookingModal;