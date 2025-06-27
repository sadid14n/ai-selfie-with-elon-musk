import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/90 backdrop-blur-sm border-t border-white/10 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-between items-center gap-4 text-center md:text-left">
          <p className="text-white/70 text-sm">
            © {currentYear} AiSelfieWithElonMusk. All rights reserved.
          </p>

          <p className="text-white/70 text-sm italic">
            This app is not affiliated with, endorsed by, or associated with
            Elon Musk. Created for entertainment purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
