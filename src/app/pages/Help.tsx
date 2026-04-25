import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import {
  Mail,
  MessageSquare,
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

      const requestId = await submitHelpRequest({
        name,
        email,
        subject,
        message,
      });

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_HELP_TEMPLATE_ID,
        {
          request_id: requestId,
          name,
          email,
          subject,
          message,
          type: 'Support Request',
        },
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      );

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }, 3000);
    } catch (err: any) {
      console.error('Support request error:', err);
      setError(err.message || 'Failed to send support request.');
    } finally {
      setSubmitting(false);
    }
  };

  const supportCategories = [
    {
      icon: HelpCircle,
      title: 'General Questions',
      description: 'Learn more about RiskLens features and capabilities',
    },
    {
      icon: Book,
      title: 'Technical Support',
      description: 'Get help with installation and troubleshooting',
    },
    {
      icon: FileQuestion,
      title: 'Account Issues',
      description: 'Assistance with your account and settings',
    },
  ];

  const faqs = [
    {
      question: 'How do I install the RiskLens extension?',
      answer:
        'Visit the Chrome Web Store or Firefox Add-ons page, search for "RiskLens", and click "Add to Browser". The extension will be installed automatically.',
    },
    {
      question: 'Is RiskLens free to use?',
      answer:
        'Yes! RiskLens offers a free tier with all essential security features. Premium features are available for advanced users.',
    },
    {
      question: 'How is the risk score calculated?',
      answer:
        'Our advanced machine learning model flags URLs based on irregularities in domain patterns, suspicious structures, and known threat signatures. The system then analyzes critical security data including recent data breaches, SSL certificate validity, tracking scripts, phishing indicators, and historical security incidents to calculate a comprehensive risk score from 0-100, where lower scores indicate safer websites.',
    },
    {
      question: 'Can I trust the risk scores?',
      answer:
        'RiskLens uses verified data sources and AI analysis to provide accurate risk assessments. However, we recommend using it as one tool in your security toolkit.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <HelpCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How Can We Help?
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get support, find answers to common questions, or reach out to our team directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {supportCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:shadow-md transition-shadow"
              >
                <category.icon className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h2>
              <p className="text-gray-600 mb-6">
                Send us a message and our team will get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600">
                    We've received your message and will respond to your email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name <span className="text-red-600">*</span>
                    </label>
                    <Input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Question</option>
                      <option value="technical">Technical Support</option>
                      <option value="account">Account Issue</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-600">*</span>
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      placeholder="Please describe your issue or question in detail..."
                      className="w-full resize-none"
                      required
                    />
                  </div>

                  {error && <p className="text-red-600 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12 font-medium"
                    disabled={submitting || !name || !email || !subject || !message}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Other Ways to Reach Us
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a href="mailto:risklens0@gmail.com" className="text-green-600 hover:underline">
                        risklens0@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <a href="tel:+1-800-RISKLENS" className="text-gray-700">
                        1-800-RISKLENS
                      </a>
                      <p className="text-sm text-gray-500">Mon-Fri, 9am-5pm EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                      <p className="text-gray-700">700 University Dr.</p>
                      <p className="text-gray-700">Prairie View, Tx 77446</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Expected Response Times</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Email: Within 24 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Phone: Immediate during business hours
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">Quick answers to common questions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}