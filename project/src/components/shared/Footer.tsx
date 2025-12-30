import { Heart, Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-400 text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for Indonesian Culture
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-neutral-400 hover:text-neutral-100 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-neutral-100 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-neutral-500">
          © 2024 Sendratari Performance. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
