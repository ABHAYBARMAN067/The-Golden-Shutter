import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../api';

const ContactForm = ({ onClose = () => {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', or null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await axios.post(`${API_URL}/api/contact`, formData);
      
      if (response.status === 201) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setStatus(null);
          onClose();
        }, 3000);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Status Messages */}
      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
           Message sent successfully! We'll get back to you soon.
        </div>
      )}
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
          Failed to send message. Please try again.
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-amber-400 focus:outline-none transition"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-amber-400 focus:outline-none transition"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-amber-400 focus:outline-none transition"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="e.g., Wedding Photography Inquiry"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-amber-400 focus:outline-none transition"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Tell us about your event and photography needs..."
            rows="6"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-amber-400 focus:outline-none transition resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>

        <p className="text-xs text-white/50 text-center">
          We typically respond within 24 hours.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
