import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  HelpCircle,
  Book,
  FileQuestion,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { submitHelpRequest } from '../services/helpService';

export function Help() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError('');

      // 1️⃣ Save to Firebase
      const requestId = await submitHelpRequest({
        name,
        email,
        subject,
        message,
      });

      // 2️⃣ Send Email via EmailJS (HELP TEMPLATE)
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_HELP_TEMPLATE_ID,
        {
          request_id: requestId,
          name,
          email,
          subject,
          message,
        },
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      );

      // 3️⃣ Success state
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }, 3000);
    } catch (err: any) {
      console.error('Help request error:', err);
      setError(err.message || 'Failed to send request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <HelpCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              How Can We Help?
            </h1>
            <p className="text-gray-600">
              Send us a message and our team will get back to you.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            {submitted ? (
              <div className="text-center py-10">
                <Send className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Message Sent!
                </h2>
                <p className="text-gray-600">
                  We’ll respond to your email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                {/* Email */}
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {/* Subject */}
                <Input
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />

                {/* Message */}
                <Textarea
                  placeholder="Describe your issue..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                />

                {/* Error */}
                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={submitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-10 space-y-4 text-center">
            <p className="text-gray-700">
              <Mail className="inline w-4 h-4 mr-2" />
              risklens0@gmail.com
            </p>
            <p className="text-gray-700">
              <Phone className="inline w-4 h-4 mr-2" />
              1-800-RISKLENS
            </p>
            <p className="text-gray-700">
              <MapPin className="inline w-4 h-4 mr-2" />
              Prairie View, TX
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}