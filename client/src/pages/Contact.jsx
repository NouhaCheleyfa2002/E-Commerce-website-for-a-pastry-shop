import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperclip } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '', file: null });
  const [faqOpen, setFaqOpen] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    alert('Your message has been sent!');
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-5 text-[#bc6c25] mt-5">Contact Us</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg">
          <div className="mb-4">
            <label className="block font-semibold">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Subject</label>
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required className="w-full p-2 border rounded h-24"></textarea>
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Upload File (Custom Cake Request)</label>
            <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
          </div>
          <button type="submit" className="w-full bg-[#C24952] text-white p-2 rounded">Send Message</button>
        </form>
        
        {/* Contact Info & FAQ */}
        <div>
          <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-3">Our Contact Details</h3>
            <p><FaPhone className="inline mr-2" /> +216 98 257 679</p>
            <p><FaEnvelope className="inline mr-2" /> milandasweets@gmail.com</p>
            <p><FaMapMarkerAlt className="inline mr-2" />Avenue Habib Bourguiba, Mahdia</p>
            <p><FaMapMarkerAlt className="inline mr-2" />Avenue Yasser Arafet,Sousse</p>
          </div>
          
          {/* FAQ Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Frequently Asked Questions</h3>
            {['Do you deliver?', 'Can I customize my order?', 'What are your opening hours?'].map((q, index) => (
              <div key={index} className="mb-2 border-b pb-2 cursor-pointer" onClick={() => setFaqOpen(faqOpen === index ? null : index)}>
                  <p className="font-semibold">{q}</p>
                  {faqOpen === index && (
                  <p className="text-gray-600 mt-1">
                    {q === "Do you deliver?" && "Yes, we offer delivery services."}
                    {q === "Can I customize my order?" && "Absolutely! You can customize your order to your preference."}
                    {q === "What are your opening hours?" && "We are open from 8:00 AM to 8:30 PM."}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="mt-8">
      <iframe
          title="Google Maps - Mahdia"
          className="w-full h-64 rounded-lg"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3188.663656853136!2d11.0589!3d35.5047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd34c2f7f1e46b%3A0xb37cf670b334cc54!2sAvenue%20Habib%20Bourguiba%2C%20Mahdia!5e0!3m2!1sen!2stn!4v1647594296887!5m2!1sen!2stn"
          allowFullScreen
        ></iframe>
        <iframe
          title="Google Maps - Yasser Arafet"
          className="w-full h-64 rounded-lg"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3188.663656853136!2d11.0589!3d35.5047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd34c2f7f1e46b%3A0xb37cf670b334cc54!2sAvenue%20Yasser%20Arafet!5e0!3m2!1sen!2stn!4v1647594296887!5m2!1sen!2stn"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
