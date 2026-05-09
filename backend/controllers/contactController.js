const Contact = require('../models/Contact');
const transporter = require('../config/email');

exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields: name, email, subject, message' });
    }

    // Create contact in database
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    await contact.save();

    // Send email notification to admin
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #d4af37; text-align: center;">New Contact Submission</h2>
              
              <div style="margin-top: 20px; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              </div>

              <div style="margin-top: 20px;">
                <h3 style="color: #333;">Subject: ${subject}</h3>
                <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
                <p>Submitted on: ${new Date().toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        `,
        replyTo: email,
      });
    } catch (emailError) {
      console.log('⚠️ Email notification failed:', emailError.message);
      // Don't fail the request if email fails - still save to database
    }

    // Send confirmation email to user
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'We received your message - THE GOLDEN SHUTTER',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #d4af37; text-align: center;">THE GOLDEN SHUTTER</h2>
              <p style="color: #666; text-align: center;">Thank you for reaching out</p>

              <div style="margin-top: 30px;">
                <p>Hi ${name},</p>
                <p style="color: #666; line-height: 1.6;">
                  Thank you for contacting us! We've received your message and will get back to you as soon as possible.
                </p>
                <p style="color: #666; line-height: 1.6;">
                  We're excited to discuss your wedding photography needs and create something beautiful together.
                </p>
              </div>

              <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #d4af37;">
                <p style="color: #333; margin: 0;"><strong>Your Message Summary:</strong></p>
                <p style="color: #666; margin: 10px 0 0 0;"><strong>Subject:</strong> ${subject}</p>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999;">
                <p>The Golden Shutter © 2024 | All rights reserved</p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.log('⚠️ Confirmation email failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      contact,
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    // Mark as read
    contact.read = true;
    await contact.save();

    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact deleted', contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
