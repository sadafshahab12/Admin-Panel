// components/Footer.tsx

import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 Sadaf Shahab</p>
        <div className="flex justify-center space-x-6">
          <Link
            href="https://github.com/sadafshahab12"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/sadaf-shahab-ssr123"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            LinkedIn
          </Link>
          <Link
            href="mailto:sadafshahabsr12@gmail.com"
            className="hover:text-blue-400"
          >
            Gmail
          </Link>
          <Link
            href="mailto:sadafshahab123@yahoo.com"
            className="hover:text-blue-400"
          >
            Yahoo Mail
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
