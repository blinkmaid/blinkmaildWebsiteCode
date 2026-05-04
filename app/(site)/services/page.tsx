"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, ChevronRight, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Service {
  id: number;
  name: string;
  description: string;
  image_url?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      const { data: sData } = await supabase.from("services").select("*").returns<Service[]>();
      if (sData) {
        const seen = new Set<string>();
        const unique = sData.filter((s) => {
          const normalized = s.name.trim().toLowerCase();
          if (seen.has(normalized)) return false;
          seen.add(normalized);
          return true;
        });
        setServices(unique);
      }
    }
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-rose-600">

      {/* --- SECTION 1: HERO --- */}
      <section className="relative h-[70vh] flex items-center px-6 overflow-hidden bg-black">
        {/* Background Image - Removed Grayscale */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://5.imimg.com/data5/SELLER/Default/2021/3/FZ/GL/YD/8248982/placement-services-for-babysitter-500x500.jpg"
            className="w-full h-full object-cover opacity-60"
            alt="Luxury Interior"
          />
          {/* Subtle Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-rose-500 font-black text-xs uppercase tracking-[0.5em] block mb-4">Premium Selection</span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 uppercase text-white">
              The <span className="text-rose-600">Services.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-md font-medium tracking-tight">
              Select a tier of care designed specifically for your residence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 2: UNIFIED LUXURY GRID --- */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Increased gap for better curve visibility */}
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => router.push(`/services/${service.id}`)}
                className="group relative h-[480px] bg-[#111] border border-white/5 rounded-[2rem] overflow-hidden cursor-pointer"
              >
                {/* Background Image Container */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={service.image_url || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80"}

                    className="w-full h-full object-cover opacity-30 rounded-[2rem] group-hover:opacity-60 group-hover:scale-110 transition-all duration-[1.5s] ease-out"
                    alt={service.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 h-full p-10 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-rose-600 tracking-[0.3em]">
                      SVR / 0{idx + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-rose-600/50 group-hover:bg-rose-600 transition-all duration-500">
                      <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none group-hover:text-rose-500 transition-colors duration-300">
                      {service.name}
                    </h3>
                    <p className="text-white/40 text-sm font-medium line-clamp-2 mb-6 group-hover:text-white/70 transition-colors duration-500">
                      {service.description}
                    </p>
                    <div className="h-[2px] w-0 bg-rose-600 group-hover:w-full transition-all duration-700" />
                  </div>
                </div>

                {/* Glassmorphism Border Overlay - Match the rounding here too */}
                <div className="absolute inset-0 border-2 border-transparent rounded-[2rem] group-hover:border-rose-600/20 transition-all duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}