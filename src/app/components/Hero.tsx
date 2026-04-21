import { motion, AnimatePresence } from 'motion/react';
import { Shield, ArrowRight, Search, Download, Globe, Mail, MessageCircle, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';

export function Hero() {
  const [url, setUrl] = useState('');
  const [selectedTld, setSelectedTld] = useState('.com');
  const [isPaused, setIsPaused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  const tlds = [
    '.com',
    '.org',
    '.net',
    '.edu',
    '.gov',
    '.io',
    '.co',
    '.info',
    '.mil',
    '.shop',
    '.store',
    '.app',
    '.us',
    '.uk',
    '.ca',
    '.de',
    '.fr',
    '.jp',
    '.cn',
    '.in',
    '.au',
  ];

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    try {
      setSearchLoading(true);
      setSearchError('');

      let domain = url.trim();

      domain = domain.replace(/^https?:\/\//, '');
      domain = domain.replace(/^www\./, '');
      domain = domain.split('/')[0];

      if (!domain.includes('.')) {
        domain = `${domain}${selectedTld}`;
      }

      const response = await fetch('/api/resolve-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: domain }),
      });

      const data = await response.json();
      console.log('RESOLVE SITE RESPONSE:', data);

      if (!response.ok) {
        setSearchError(data.error || data.details || 'Something went wrong while checking that site.');
        return;
      }

      if (!data.found || !data.resolvedUrl) {
        setSearchError('Could not find a real website from that search.');
        return;
      }

      navigate(`/insights/${encodeURIComponent(data.resolvedUrl)}`);
    } catch (err) {
      console.error('Resolve site error:', err);
      setSearchError('Something went wrong while checking that site.');
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 15000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="relative overflow-hidden bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-6">
        <AnimatePresence mode="wait">
          {currentSlide === 0 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900">
                    Know the risks.
                    <br />
                    <span className="text-green-600">Browse with confidence.</span>
                  </h1>
                  <p className="text-gray-600 mb-8 text-lg">
                    Check if your websites are safe
                  </p>

                  <Button className="bg-green-600 text-white hover:bg-green-700 rounded-full px-8 h-12 mb-6">
                    Add to browser
                  </Button>

                  <div className="relative">
                    <div className="relative flex items-center bg-green-600 rounded-full h-14">
                      <Input
                        type="text"
                        placeholder="Check your sites"
                        value={url}
                        onFocus={() => setIsPaused(true)}
                        onChange={(e) => {
                          setIsPaused(true);
                          setUrl(e.target.value);
                          if (searchError) setSearchError('');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        className="flex-1 h-full pl-6 pr-4 rounded-l-full bg-transparent border-0 text-white placeholder:text-white/80 text-base focus:outline-none focus:ring-0"
                      />

                      <div className="h-8 w-px bg-white/30" />

                      <div className="relative">
                        <select
                          value={selectedTld}
                          onChange={(e) => setSelectedTld(e.target.value)}
                          onFocus={() => setIsPaused(true)}
                          className="h-14 pl-4 pr-10 bg-transparent border-0 text-white text-base cursor-pointer appearance-none focus:outline-none focus:ring-0 min-w-[90px]"
                          style={{
                            backgroundImage: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                          }}
                        >
                          {tlds.map((tld) => (
                            <option
                              key={tld}
                              value={tld}
                              className="bg-green-600 text-white"
                            >
                              {tld}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-white pointer-events-none" />
                      </div>

                      <div className="h-8 w-px bg-white/30 mr-2" />

                      <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={searchLoading}
                        className="text-white hover:text-white/80 transition-colors p-2 pr-4 disabled:opacity-60"
                      >
                        <Search className="size-5" />
                      </button>
                    </div>

                    {searchError && (
                      <p className="mt-3 text-sm text-red-600">
                        {searchError}
                      </p>
                    )}

                    {searchLoading && (
                      <p className="mt-3 text-sm text-gray-600">
                        Checking website...
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758874573279-2709f2ce5d73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB3b3JraW5nJTIwbGFwdG9wJTIwYnJvd3Npbmd8ZW58MXx8fHwxNzcxMDMwODk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Person browsing safely on laptop"
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentSlide === 1 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900">
                    How to use
                    <br />
                    <span className="text-green-600">RiskLens Extension</span>
                  </h1>
                  <p className="text-gray-600 mb-8 text-lg">
                    Get started in 3 simple steps
                  </p>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Install the Extension</h3>
                        <p className="text-gray-600">Download RiskLens from your browser&apos;s extension store</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Browse Normally</h3>
                        <p className="text-gray-600">Visit any website and RiskLens will automatically analyze it</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">View Security Score</h3>
                        <p className="text-gray-600">Click the extension icon to see detailed risk analysis and insights</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="bg-green-600 text-white hover:bg-green-700 rounded-full px-8 h-12 mt-8">
                      <Download className="mr-2 size-4" />
                      Add to Browser
                    </Button>

                    <Link to="/how-it-works">
                      <Button
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50 rounded-full px-8 h-12 mt-8"
                      >
                        Learn More
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1551650975-87deedd944c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93c2VyJTIwZXh0ZW5zaW9uJTIwY2hyb21lfGVufDF8fHx8MTc3MTA0Mzk5OXww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Browser extension interface"
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentSlide === 2 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900">
                    Connect with us
                    <br />
                    <span className="text-green-600">We&apos;re here to help</span>
                  </h1>
                  <p className="text-gray-600 mb-8 text-lg">
                    Have questions or feedback? Get in touch with our team
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <Mail className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email Us</h3>
                        <p className="text-gray-600">support@risklens.com</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <Globe className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Community Forum</h3>
                        <p className="text-gray-600">Join our user community</p>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-green-600 text-white hover:bg-green-700 rounded-full px-8 h-12">
                    <Link to="/help">
                      Contact Support
                    </Link>
                  </Button>
                </div>

                <div className="relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHN1cHBvcnQlMjB0ZWFtfGVufDF8fHx8MTc3MTA0Mzk5OXww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Customer support team"
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-12">
          <button
            onClick={() => setCurrentSlide(0)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              currentSlide === 0 ? 'bg-green-600' : 'bg-gray-300'
            }`}
            aria-label="Go to slide 1"
          />
          <button
            onClick={() => setCurrentSlide(1)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              currentSlide === 1 ? 'bg-green-600' : 'bg-gray-300'
            }`}
            aria-label="Go to slide 2"
          />
          <button
            onClick={() => setCurrentSlide(2)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              currentSlide === 2 ? 'bg-green-600' : 'bg-gray-300'
            }`}
            aria-label="Go to slide 3"
          />
        </div>
      </div>
    </section>
  );
}