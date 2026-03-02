import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { ref, push } from '@firebase/database';
import { database } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send email notification via FormSubmit AJAX API
      await fetch('https://formsubmit.co/ajax/softspera01@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: 'New Contact Enquiry - Softspera',
          name: formData.name,
          email: formData.email,
          message: formData.message,
        })
      });

      // Also save to Firebase
      await push(ref(database, 'contact/messages'), {
        ...formData,
        createdAt: new Date().toISOString(),
      });

      setFormData({ name: '', email: '', message: '' });
      toast.success('Message sent successfully! We will contact you soon.');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Softspera</title>
        <meta
          name="description"
          content="Get in touch with Softspera for innovative IT solutions. We're here to help transform your business with cutting-edge technology."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              className="text-4xl font-bold md:text-5xl"
              variants={fadeInUp}
            >
              Contact Us
            </motion.h1>
            <motion.p
              className="mt-6 text-xl text-gray-600"
              variants={fadeInUp}
            >
              Have a project in mind? We'd love to hear from you. Send us a
              message and we'll respond as soon as possible.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold">Get in Touch</h2>
                <p className="mt-4 text-gray-600">
                  We're here to help and answer any questions you might have. We
                  look forward to hearing from you.
                </p>
              </motion.div>

              <motion.div
                className="space-y-6"
                variants={fadeInUp}
              >
                <a href="mailto:softspera01@gmail.com" className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all group">
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Email</h3>
                    <p className="text-gray-600">softspera01@gmail.com</p>
                  </div>
                </a>

                <a href="https://wa.me/917666579089" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all group">
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <Phone className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#25D366] transition-colors">WhatsApp & Phone</h3>
                    <p className="text-gray-600">+91 7666579089</p>
                  </div>
                </a>

                <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all group">
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Address</h3>
                    <p className="text-gray-600">
                      Office No. 402, 4th Floor,
Regus Business Center,
World Trade Center,
Kharadi – Hadapsar Road,
Pune – 411014, Maharashtra, India
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div
                className="h-64 overflow-hidden rounded-lg"
                variants={fadeInUp}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-73.935242!3d40.730610!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM0LCsDQzJzUwLjIiTiA3M8KwNTYnMDYuOSJX!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl bg-white p-8 shadow-lg"
                variants={fadeInUp}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="input mt-1"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="input mt-1"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    className="input mt-1"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </motion.form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
