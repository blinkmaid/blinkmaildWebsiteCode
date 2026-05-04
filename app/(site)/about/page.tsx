"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Target, Eye, Handshake, CheckCircle, Shield, 
  Star, Quote, ArrowRight, Award, Users, Heart 
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Review {
  id: number;
  name: string;
  review: string;
  status: string;
}

export default function About() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("website_reviews")
        .select("*")
        .eq("status", "active")
        .order("id", { ascending: false })
        .limit(3);
      if (data) setReviews(data as Review[]);
    };
    fetchReviews();
  }, []);

  const commitments = [
    {
      icon: Handshake,
      title: "Trusted Service",
      desc: "Carefully vetted professionals delivering spotless, reliable home services.",
      tag: "Verified",
    },
    {
      icon: CheckCircle,
      title: "Unyielding Quality",
      desc: "High standards of cleanliness, consistency, and professionalism.",
      tag: "Standard",
    },
    {
      icon: Shield,
      title: "Verified & Secure",
      desc: "Rigorous background checks ensuring absolute safety and peace of mind.",
      tag: "Security",
    },
  ];

  return (
    <div ref={containerRef} className="bg-[#FCFCFC] text-blinkblack min-h-screen selection:bg-blinkred selection:text-white">
      
      {/* ---------------- SECTION 1: HERO BANNER ---------------- */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden py-10 mb-10">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://t3.ftcdn.net/jpg/14/86/25/86/240_F_1486258647_sIR9w4l4NrqyGFpQShL8Dcvzd7oWIgEk.jpg" 
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-[#FCFCFC] via-transparent to-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="h-[2px] w-12 bg-blinkred" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-white">Est. 2024 • Excellence</span>
            </div>
            <h1 className="text-6xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter">
              PURE<br />LEGACY.
            </h1>
            <p className="text-white/90 max-w-md text-sm uppercase tracking-widest font-bold">
              Connecting families with the gold standard of domestic care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---------------- SECTION 2: BENTO COMMITMENTS ---------------- */}
      <section className="max-w-7xl mx-auto px-6 py-10 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {commitments.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="group relative p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blinkred transition-colors duration-500">
                  <item.icon className="w-6 h-6 text-blinkblack group-hover:text-white" />
                </div>
                <span className="text-[10px] font-black text-blinkred uppercase tracking-[0.3em] mb-4 block opacity-60">{item.tag}</span>
                <h3 className="text-xl font-black uppercase mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blinkblack group-hover:text-blinkred transition-colors">
                  Details <ArrowRight className="w-3 h-3" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gray-50 rounded-full group-hover:scale-[6] transition-transform duration-700 z-0" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- SECTION 3: VISION SPECTRUM ---------------- */}
      <section className="bg-blinkblack text-white py-20 mb-10 overflow-hidden rounded-[3rem] mx-4 md:mx-10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              OUR CARE <br /> <span className="text-blinkred italic lowercase font-serif">spectrum.</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-10">
              <div className="space-y-4">
                <Target className="w-8 h-8 text-blinkred" />
                <h4 className="font-bold uppercase tracking-widest text-sm">Our Mission</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Delivering peace of mind via thoroughly vetted, compassionate staff.</p>
              </div>
              <div className="space-y-4">
                <Eye className="w-8 h-8 text-blinkred" />
                <h4 className="font-bold uppercase tracking-widest text-sm">Our Vision</h4>
                <p className="text-gray-400 text-sm leading-relaxed">To be the undisputed standard for trusted home management.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2031&auto=format&fit=crop" 
              className="rounded-3xl grayscale hover:grayscale-0 transition-all duration-1000 border-8 border-white/5"
              alt="Care"
            />
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 4: TESTIMONIALS ---------------- */}
      <section className="max-w-7xl mx-auto px-6 py-10 mb-10">
        <div className="mb-16">
          <h2 className="text-5xl font-black tracking-tighter uppercase">Voices of <span className="text-blinkred">Trust.</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <div key={r.id} className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <Quote className="w-8 h-8 text-blinkred/20 mb-6" />
              <p className="text-blinkblack font-medium italic mb-8">"{r.review}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blinkblack text-white rounded-full flex items-center justify-center font-bold text-xs">{r.name.charAt(0)}</div>
                <p className="font-black uppercase text-xs tracking-widest">{r.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SECTION 5: CALL TO ACTION ---------------- */}
      <section className="max-w-7xl mx-auto px-6 py-10 mb-10">
        <div className="bg-blinkblack rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-8">Ready to Restore <br/> <span className="text-blinkred">Harmony?</span></h2>
            <button 
              onClick={() => router.push('/services')}
              className="bg-white text-blinkblack px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] flex items-center gap-3 mx-auto hover:bg-blinkred hover:text-white transition-all text-xs"
            >
              Book Your Service <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}