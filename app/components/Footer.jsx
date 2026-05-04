"use client";

import { motion } from "framer-motion";
import React from "react";
import { HiOutlineMail, HiOutlinePhone, HiOutlineArrowRight } from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa6";
import Image from "next/image";

export default function Footer() {
  const linkClass = "relative text-gray-400 hover:text-white transition-all duration-300 group flex items-center text-sm font-semibold tracking-wide";

  return (
    <footer className="relative bg-[#050505] pt-32 pb-12 overflow-hidden border-t border-white/5">
      
      {/* --- CINEMATIC BACKGROUND ELEMENTS --- */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blinkred/10 rounded-full blur-[140px] -z-10 animate-pulse" />
      <div className="absolute -bottom-24 right-0 w-96 h-96 bg-blinkred/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">

          {/* --- COLUMN 1: BRAND IDENTITY --- */}
          <motion.div
            className="lg:col-span-4 space-y-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <Image
                src="/footer_img.png"
                alt="Blinkmaid Logo"
                width={160}
                height={50}
                className="object-contain brightness-110"
              />
              <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
                Redefining the <span className="text-white font-bold italic font-serif">gold standard</span> of professional maintenance. We curate environments for peak living.
              </p>
            </div>

            {/* Social Icons with Glassmorphism */}
            <div className="flex gap-3">
              {[
                { icon: <FaFacebookF />, href: "#" },
                { icon: <FaInstagram />, href: "#" },
                { icon: <FaTwitter />, href: "#" },
                { icon: <FaLinkedinIn />, href: "#" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -8, backgroundColor: "rgba(230, 57, 70, 1)", borderColor: "transparent" }}
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 transition-all duration-500 backdrop-blur-md"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* --- COLUMN 2: QUICK LINKS --- */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blinkred">Navigation</h3>
            <ul className="space-y-5">
              {['Home', 'Services', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`/${item.toLowerCase().replace(' ', '')}`} className={linkClass}>
                    <span className="w-0 group-hover:w-4 h-[1.5px] bg-blinkred mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* --- COLUMN 3: SUPPORT --- */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blinkred">Support</h3>
            <ul className="space-y-5">
              {['Privacy Policy', 'Terms of Use', 'Help Center'].map((item) => (
                <li key={item}>
                  <a href="#" className={linkClass}>
                    <span className="w-0 group-hover:w-4 h-[1.5px] bg-blinkred mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* --- COLUMN 4: NEWSLETTER & CONTACT --- */}
          <motion.div
            className="lg:col-span-4 space-y-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blinkred">Stay Connected</h3>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-blinkred/50 transition-all placeholder:text-gray-600"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blinkred rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform">
                  <HiOutlineArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 text-gray-400 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blinkred group-hover:bg-blinkred group-hover:text-white transition-all duration-500 border border-white/5">
                  <HiOutlinePhone size={18} />
                </div>
                <span className="text-sm font-bold tracking-tight group-hover:text-white transition-colors">+91 93804 19755</span>
              </div>

              <div className="flex items-center gap-4 text-gray-400 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blinkred group-hover:bg-blinkred group-hover:text-white transition-all duration-500 border border-white/5">
                  <HiOutlineMail size={18} />
                </div>
                <span className="text-sm font-bold tracking-tight group-hover:text-white transition-colors">support@blinkmaid.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] text-center md:text-left">
            &copy; {new Date().getFullYear()} <span className="text-white">Blinkmaid</span> — All Rights Reserved.
          </p>

          <div className="flex items-center gap-6">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em]">
              Designed & Developed by <span className="text-white">Rakvih</span>
            </p>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            <div className="flex gap-4">
               {/* Small dot indicators for a 'Tech' feel */}
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Operational</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}