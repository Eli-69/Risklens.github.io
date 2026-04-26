import { motion } from 'motion/react';
import { Button } from './ui/button';

const EXTENSION_DOWNLOAD_URL =
  'https://www.dropbox.com/scl/fi/ps7etwundoqoqsvwvbyvu/2af5fb087f874d69888b-0.4.2.xpi?rlkey=3dml3inbmfrgsf9bi8z9h1dds&st=e1fnz0nr&dl=1';

export function CTA() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="mb-10 text-5xl font-bold text-gray-900">
            Try it for yourself.
          </h2>

          <a
            href={EXTENSION_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 h-12"
            >
              Let&apos;s Move
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}