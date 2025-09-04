// controllers/newsletterController.js
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: 'Email already subscribed' });

    const newSubscriber = new NewsletterSubscriber({ email });
    await newSubscriber.save();

    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

export const getAllSubscribers = async (req, res) => {
    const { search = "", page = 1, limit = 10 } = req.query;
  
    const query = {
      email: { $regex: search, $options: "i" },
    };
  
    const total = await NewsletterSubscriber.countDocuments(query);
    const subscribers = await NewsletterSubscriber.find(query)
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
  
    res.status(200).json({ total, subscribers });
  };
  
export const deleteSubscriber = async (req, res) => {
    try {
      await NewsletterSubscriber.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Subscriber deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete subscriber" });
    }
  };
  