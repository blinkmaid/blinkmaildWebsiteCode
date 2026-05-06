"use client";

import React, { useRef, useState, useEffect } from "react"; // ✅ Added useEffect
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import {
    HiOutlineHome,
    HiOutlineOfficeBuilding,
    HiOutlineCog,
    HiOutlineTruck,
    HiOutlineCheckCircle,
    HiOutlineUserGroup,
    HiSupport,
    HiOutlineSparkles,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineLocationMarker,
} from "react-icons/hi";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useToast } from "@/app/components/toast/ToastContext";
import { useRouter } from "next/navigation";

// --- Existing Carousel & Card Components (omitted for brevity) ---
// (Keep Carousel, CarouselContent, CarouselItem, CarouselButton, Card, CardContent as they are)

function Carousel({ children, className = "" }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const router = useRouter();

    const updateButtons = () => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    };

    React.useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", updateButtons);
        updateButtons();
        // Clean up event listener on unmount
        return () => emblaApi.off("select", updateButtons);
    }, [emblaApi]);

    const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
    const scrollNext = () => emblaApi && emblaApi.scrollNext();

    return (
        <div className={`relative ${className}`}>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">{children}</div>
            </div>
            <CarouselButton direction="left" onClick={scrollPrev} disabled={!canScrollPrev} />
            <CarouselButton direction="right" onClick={scrollNext} disabled={!canScrollNext} />
        </div>
    );
}

function CarouselContent({ children }) {
    return (
        <div className="flex">
            {React.Children.map(children, (child) =>
                React.cloneElement(child, {
                    className:
                        "flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] p-3",
                })
            )}
        </div>
    );
}

function CarouselItem({ children, className = "" }) {
    return <div className={className}>{children}</div>;
}

function CarouselButton({ direction, onClick, disabled }) {
    const Icon = direction === "left" ? ChevronLeft : ChevronRight;
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`absolute ${direction === "left" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 bg-blinkblack/80 text-blinkwhite p-3 rounded-full hover:bg-blinkred transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm`}
        >
            <Icon size={24} />
        </button>
    );
}

function Card({ children, className = "" }) {
    return (
        <div className={`bg-blinkwhite rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-blinkred/10 ${className}`}>
            {children}
        </div>
    );
}

function CardContent({ children }) {
    return <div className="p-6">{children}</div>;
}

// Helper function to assign icons based on service name (customizable)
const getServiceIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('home') || lowerName.includes('cleaning')) return <HiOutlineHome size={48} className="text-blinkred" />;
    if (lowerName.includes('office')) return <HiOutlineOfficeBuilding size={48} className="text-blinkred" />;
    if (lowerName.includes('vehicle') || lowerName.includes('car')) return <HiOutlineTruck size={48} className="text-blinkred" />;
    if (lowerName.includes('maintenance') || lowerName.includes('repair')) return <HiOutlineCog size={48} className="text-blinkred" />;
    if (lowerName.includes('staff') || lowerName.includes('professional')) return <HiOutlineUserGroup size={48} className="text-blinkred" />;
    if (lowerName.includes('support')) return <HiSupport size={48} className="text-blinkred" />;
    return <HiOutlineSparkles size={48} className="text-blinkred" />; // Default icon
};

// ✅ Main Home Page
export default function Home() {
    const [imageError, setImageError] = useState(false);
    const [video2Error, setVideo2Error] = useState(false);
    const [testimonials, setTestimonials] = useState([]); // ✅ New state for testimonials
    const [loadingTestimonials, setLoadingTestimonials] = useState(true); // ✅ New state for loading
    const [services, setServices] = useState([]); // ✅ New state for services
    const [loadingServices, setLoadingServices] = useState(true); // ✅ New state for loading services

    // --- Data Fetching Logic (Updated) ---
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                // Fetch reviews that have status 'active' and order by creation date
                const { data, error } = await supabase
                    .from("website_reviews")
                    .select("id, name, rating, review") // Select only necessary columns
                    .eq("status", "active") // Filter for active reviews
                    .order("created_at", { ascending: false }); // Order by newest first

                if (error) {
                    console.error("Error fetching testimonials:", error);
                    toast.error("Failed to load reviews.");
                    return;
                }

                // Map the fetched data to match a simpler structure if needed, or use as-is.
                // Since the table columns map nicely to what's needed, we can use the data directly.
                const processedTestimonials = data.map(item => ({
                    name: item.name,
                    role: "Verified Client", // Using a default role as the schema doesn't include one
                    message: item.review, // Mapping 'review' to 'message'
                    rating: item.rating,
                }));

                setTestimonials(processedTestimonials);
            } catch (error) {
                console.error("Unexpected error in fetchTestimonials:", error);
                toast.error("An unexpected error occurred while loading reviews.");
            } finally {
                setLoadingTestimonials(false);
            }
        };

        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from("services")
                    .select("id, name, description, image_url")
                    .order("id", { ascending: true });

                if (error) {
                    console.error("Error fetching services:", error);
                    toast.error("Failed to load services.");
                    return;
                }

                // Filter to show only unique services based on normalized name (case-insensitive, trimmed)
                if (data) {
                    const seen = new Set();
                    const uniqueServices = data.filter(service => {
                        const normalizedName = service.name.trim().toLowerCase();
                        if (seen.has(normalizedName)) return false;
                        seen.add(normalizedName);
                        return true;
                    });
                    setServices(uniqueServices);
                } else {
                    setServices([]);
                }
            } catch (error) {
                console.error("Unexpected error in fetchServices:", error);
                toast.error("Unexpected error while loading services.");
            } finally {
                setLoadingServices(false);
            }
        };


        fetchTestimonials();
        fetchServices();
    }, []); // Run once on component mount
    // ---------------------------------

    // Removed the old hardcoded 'services' array
    // const services = [...]

    // ✅ Background image for hero (changed from video to image since it's a JPG)
    const bgImage = "/bg_pic.jpg"; // Hero section background image
    const router = useRouter();

    // ✅ Background video for second section
    const bgClip2 = "/videos/clip.mp4"; // Second video section

    // ✅ Fallback background image (ensure you have this in public/images/)
    const fallbackBg = "/images/fallback-bg.jpg"; // Add a fallback image in public/images/

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
            {/* --- HERO BACKGROUND (Height: 50vh mobile / 60vh desktop) --- */}
            <div className="absolute top-0 left-0 w-full h-[50vh] md:h-[60vh] z-0 overflow-hidden">
                {!imageError ? (
                    <video
                        src="/videos/hero-bg.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Image
                        src={bgImage}
                        alt="Hero Background"
                        fill
                        priority
                        className="object-cover"
                    />
                )}
                {/* Overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-blinkblack/80 via-blinkblack/60 to-blinkred/70"></div>
            </div>

            {/* --- HERO TEXT SECTION (Matches background height exactly) --- */}
            <section className="relative flex flex-col justify-center items-center text-center h-[50vh] md:h-[60vh] px-6 z-10">
                <motion.h1
                    className="text-5xl md:text-7xl font-black text-blinkwhite drop-shadow-2xl mb-4"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    Welcome to <span className="text-blinkred bg-gradient-to-r from-blinkred to-pink-400 bg-clip-text text-transparent">BlinkMaid</span>
                </motion.h1>

                <motion.p
                    className="text-lg md:text-2xl text-gray-200 mt-2 max-w-3xl leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    Your one-stop platform for cleaning, maintenance, and convenience.
                </motion.p>

                <motion.a
                    href="/services"
                    className="mt-8 px-10 py-4 bg-gradient-to-r from-blinkred to-blinkblack hover:from-blinkblack hover:to-blinkred text-blinkwhite rounded-full font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Explore Services
                </motion.a>
            </section>


            {/* Services Section - Premium Single Row with Images */}
            <section id="services" className="relative bg-[#0a0a0a] py-10 overflow-hidden">

                {/* Background Decorative Element */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blinkred/5 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto px-6 mb-6 ">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
                            Our <span className="text-blinkred">Services</span>
                        </h2>
                        <div className="h-1 w-20 bg-blinkred"></div>
                    </motion.div>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="relative group">
                    {!loadingServices && services.length > 0 && (
                        <div className="overflow-x-auto flex gap-6 px-[5%] pb-12 scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing">
                            {services.map((s, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-shrink-0 w-[300px] md:w-[400px] snap-center"
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.6 }}
                                >
                                    <div className="group relative h-[550px] rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl border border-white/10">

                                        {/* Service Image Background */}
                                        <img
                                            src={
                                                s.image_url
                                                    ? s.image_url
                                                    : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                                            }
                                            alt={s.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                                        />


                                        {/* Gradient Overlay (Ensures text readability) */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

                                        {/* Content Overlay */}
                                        <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                                            <div className="mb-4">
                                                <span className="inline-block px-3 py-1 rounded-full bg-blinkred text-white text-[10px] font-bold tracking-widest uppercase mb-3">
                                                    Service 0{i + 1}
                                                </span>
                                                <h3 className="text-3xl font-bold text-white leading-tight">
                                                    {s.name}
                                                </h3>
                                            </div>

                                            <p className="text-gray-300 text-sm leading-relaxed mb-8 transform transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                                                {s.description}
                                            </p>

                                            <motion.a
                                                onClick={() => router.push(`/services/${s.id}`)}
                                                className="inline-flex items-center justify-center w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold hover:bg-blinkred hover:border-blinkred transition-all duration-300 group/btn"
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                ENQUIRE NOW
                                                <span className="ml-2 transform group-hover/btn:translate-x-2 transition-transform">→</span>
                                            </motion.a>
                                        </div>

                                        {/* Top Right Icon/Element */}
                                        <div className="absolute top-6 right-6 z-20">
                                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-blinkred animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Custom CSS for hiding scrollbars */}
                <style jsx>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
            </section>

            {/* Testimonials Section (UPDATED) */}
            <section className="relative bg-[#E31E24] py-10 overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-black/30 rounded-full blur-[100px]" />
                    {/* Decorative Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="relative flex flex-col items-center mb-12 px-6">
                        {/* Subtle Backdrop Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-10 bg-blinkred/20 blur-[80px] pointer-events-none" />

                        {/* 1. Status Badge - Ultra Slim */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 mb-8 shadow-2xl"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blinkred opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blinkred"></span>
                            </span>
                            <span className="text-white/80 text-[9px] font-black tracking-[0.25em] uppercase italic">
                                Live Feed
                            </span>
                        </motion.div>

                        {/* 2. Main Title - Kinetic Typography style */}
                        <div className="relative max-w-4xl text-center">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter uppercase"
                            >
                                Loved by <span className="text-white/30">homeowners,</span> <br />
                                <span className="relative inline-block mt-2">
                                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-blinkred">
                                        Trusted for excellence.
                                    </span>
                                    {/* Decorative Underline Accent */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        transition={{ delay: 0.5, duration: 1 }}
                                        className="absolute -bottom-2 left-0 h-[3px] bg-blinkred rounded-full opacity-50"
                                    />
                                </span>
                            </motion.h2>
                        </div>

                        {/* 3. Review Summary - Horizontal "Metric" Style */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-10 flex items-center gap-4 py-2 px-6 rounded-2xl bg-white/5 border border-white/5"
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-blinkred bg-gray-800 flex items-center justify-center text-[8px] text-white font-bold">
                                        ★
                                    </div>
                                ))}
                            </div>
                            <div className="h-4 w-[1px] bg-white/20" />
                            <p className="text-white/50 text-[11px] font-bold tracking-tight uppercase">
                                <span className="text-white">4.9/5 Rating</span>
                                <span className="mx-2 opacity-30">•</span>
                                500+ Genuine Reviews
                            </p>
                        </motion.div>
                    </div>

                    {/* Loading State */}
                    {loadingTestimonials && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        </div>
                    )}

                    {/* Testimonials Bento Grid */}
                    {!loadingTestimonials && testimonials?.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[1fr]">
                            {testimonials.map((t, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    // This logic creates a masonry/bento effect
                                    className={`group relative flex flex-col justify-between p-8 md:p-10 rounded-[3rem] bg-white/5 backdrop-blur-md border border-white/20 hover:border-white/50 transition-all duration-500 shadow-2xl overflow-hidden
                                    ${i === 0 ? 'md:col-span-3 lg:col-span-8' :
                                            i === 1 ? 'md:col-span-3 lg:col-span-4' :
                                                'md:col-span-3 lg:col-span-4'}
                                `}
                                >
                                    {/* Floating Icon */}
                                    <Quote className="absolute top-8 right-10 text-white/5 group-hover:text-white/10 transition-colors w-24 h-24 rotate-12" />

                                    <div className="relative z-10">
                                        {/* Rating */}
                                        <div className="flex gap-1 mb-8 bg-black/20 w-fit px-3 py-1.5 rounded-full border border-white/5">
                                            {[...Array(5)].map((_, idx) => (
                                                <Star
                                                    key={idx}
                                                    size={14}
                                                    className={`${idx < t.rating ? 'fill-white text-white' : 'text-white/20'}`}
                                                />
                                            ))}
                                        </div>

                                        {/* Message */}
                                        <blockquote className={`text-white font-bold leading-tight tracking-tight mb-12 
                                        ${i === 0 ? 'text-2xl md:text-4xl' : 'text-xl'}
                                    `}>
                                            "{t.message}"
                                        </blockquote>
                                    </div>

                                    {/* Author Info */}
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#E31E24] font-black text-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                                {t.name.charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-4 border-[#E31E24] rounded-full shadow-lg" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-lg uppercase leading-none tracking-tight">
                                                {t.name}
                                            </h4>
                                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">
                                                {t.role || "Verified Partner"}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Subscription Section - Modern Glassmorphism Design */}
            <section id="pricing" className="relative bg-white py-10 overflow-hidden">

                {/* Background Decorative Blurs */}
                <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-blinkred/5 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-blinkred/10 rounded-full blur-[150px] -z-10 animate-pulse" />

                <div className="max-w-7xl mx-auto px-6">

                    {/* Compact, Premium Header */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="px-4 py-1.5 rounded-full bg-blinkred/5 border border-blinkred/20 text-blinkred text-[10px] font-black tracking-[0.3em] uppercase mb-6"
                        >
                            Pricing Strategy
                        </motion.div>
                        <motion.h2
                            className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                        >
                            Invest in <span className="italic font-serif text-blinkred">Reliability.</span>
                        </motion.h2>
                        <motion.p
                            className="mt-6 text-gray-500 text-lg max-w-xl font-medium"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Professional staffing solutions tailored for long-term peace of mind.
                            Save up to 20% with our annual plans.
                        </motion.p>
                    </div>

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                duration: "3 Months",
                                tagline: "Essential Support",
                                price: 5999,
                                features: ["1 Free Replacement", "Priority Staffing", "24/7 Dedicated Support"],
                                popular: false
                            },
                            {
                                duration: "6 Months",
                                tagline: "Family Choice",
                                price: 11999,
                                features: ["2 Free Replacements", "10% Salary Discount", "Premium Candidate Pool", "24/7 Support"],
                                popular: true
                            },
                            {
                                duration: "12 Months",
                                tagline: "Ultimate Peace",
                                price: 19999,
                                features: ["Unlimited Replacements", "15% Salary Discount", "Background Verifications", "Direct Manager Support"],
                                popular: false
                            }
                        ].map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className={`relative group h-full rounded-[2.5rem] p-8 border transition-all duration-500 ${plan.popular
                                    ? 'bg-zinc-900 text-white border-zinc-800 shadow-2xl scale-105 z-10'
                                    : 'bg-white text-gray-900 border-gray-100 hover:border-blinkred/30 shadow-sm'
                                    }`}
                            >
                                {/* Best Seller Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blinkred text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">
                                        Most Popular
                                    </div>
                                )}

                                {/* Card Header */}
                                <div className="mb-10">
                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${plan.popular ? 'text-blinkred' : 'text-gray-400'}`}>
                                        {plan.tagline}
                                    </p>
                                    <h3 className="text-4xl font-bold tracking-tighter">{plan.duration}</h3>
                                </div>

                                {/* Pricing */}
                                <div className="mb-10">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black">₹{plan.price.toLocaleString()}</span>
                                        <span className={`text-sm font-medium ${plan.popular ? 'text-gray-500' : 'text-gray-400'}`}>/plan</span>
                                    </div>
                                </div>

                                {/* Feature List */}
                                <ul className="space-y-4 mb-12 flex-grow">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-blinkred/20 text-blinkred' : 'bg-gray-100 text-blinkred'}`}>
                                                <HiOutlineCheckCircle size={14} />
                                            </div>
                                            <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                              {/* Subtle Background Icon */}
                                <div className="absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
                                    <HiOutlineCheckCircle size={150} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Trust Badge */}
                    <motion.p
                        className="text-center mt-16 text-gray-400 text-xs font-bold uppercase tracking-widest"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                    >
                        All plans include a <span className="text-gray-900">100% Satisfaction Guarantee</span>
                    </motion.p>
                </div>
            </section>

            {/* Cinematic Video Section - Premium Layout */}
            <section className="relative h-[80vh] flex items-center overflow-hidden">
                {/* Video/Image Layer */}
                <div className="absolute inset-0 z-0">
                    {!video2Error ? (
                        <video
                            src={bgClip2}
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster={fallbackBg}
                            onError={() => setVideo2Error(true)}
                            className="w-full h-full object-cover scale-105" // Slight scale for a zoom effect
                        />
                    ) : (
                        <Image
                            src={fallbackBg}
                            alt="Fallback Background"
                            fill
                            className="object-cover"
                        />
                    )}
                    {/* Advanced Multi-layered Overlay */}
                    <div className="absolute inset-0 bg-black/40" /> {/* Darken for readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" /> {/* Side fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" /> {/* Bottom shadow */}
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        {/* Minimalist Pill Label */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <div className="h-[1px] w-12 bg-blinkred" />
                            <span className="text-white/80 text-[11px] font-black tracking-[0.4em] uppercase">
                                The Modern Standard
                            </span>
                        </motion.div>

                        {/* High-End Typography Header */}
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-6xl md:text-8xl font-bold text-white leading-[0.9] tracking-tighter mb-8"
                        >
                            Reliable. <br />
                            Smart. <span className="text-blinkred italic font-serif">Clean.</span>
                        </motion.h2>

                        {/* Description with refined width and line-height */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-gray-300 text-lg md:text-xl max-w-lg leading-relaxed mb-10 font-medium"
                        >
                            BlinkMaid simplifies your cleaning experience through <span className="text-white font-bold">modern technology</span> and a curated network of trusted professionals.
                        </motion.p>

                        {/* Premium Button with Glassmorphism interaction */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap gap-4"
                        >
                            <a
                                href="#contact"
                                className="group relative px-10 py-5 bg-blinkred overflow-hidden rounded-full transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10 text-white font-black text-xs uppercase tracking-widest">
                                    Start Your Journey
                                </span>
                            </a>

                            {/* Secondary 'Watch' Button for "Well-Designed" feel */}
                            <button className="flex items-center gap-3 px-8 py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-all">
                                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-black border-b-[4px] border-b-transparent ml-0.5" />
                                </div>
                                <span className="text-white font-bold text-[10px] uppercase tracking-widest">How it works</span>
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Elegant Scroll Indicator - The "Designer" touch */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.3em]">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
                </div>
            </section>


            {/* Enquiry Form Section - Dark Premium Dashboard */}
            <section id="contact" className="relative py-24 bg-white overflow-hidden">

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="flex flex-col lg:flex-row gap-0 items-stretch rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100">

                        {/* Left Side: Dark Info Panel */}
                        <motion.div
                            className="lg:w-1/3 bg-[#111111] p-12 text-white flex flex-col justify-between"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div>
                                <div className="w-12 h-1 bg-blinkred mb-8"></div>
                                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                    Let's Start Your <br />
                                    <span className="text-blinkred">Journey.</span>
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed mb-10">
                                    Submit your details and experience the gold standard of professional cleaning.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="group flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blinkred transition-colors duration-500">
                                        <HiSupport size={24} className="text-blinkred group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Fast Response</p>
                                        <p className="text-white font-bold">Within 2 Hours</p>
                                    </div>
                                </div>

                                <div className="group flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blinkred transition-colors duration-500">
                                        <HiOutlineCheckCircle size={24} className="text-blinkred group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Verified Pros</p>
                                        <p className="text-white font-bold">100% Background Checked</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side: The Form (Darker Accents) */}
                        <motion.div
                            className="lg:w-2/3 w-full bg-[#1a1a1a] p-8 md:p-16"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <form
                                className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = {
                                        number_of_workers: e.target.number_of_workers.value,
                                        type_of_work: e.target.type_of_work.value,
                                        full_name: e.target.full_name.value,
                                        email: e.target.email.value,
                                        phone_number: e.target.phone_number.value,
                                        preferred_contact_time: e.target.preferred_contact_time.value,
                                        message: e.target.message.value,
                                    };
                                    try {
                                        const { error } = await supabase.from("enquiries").insert([formData]);
                                        if (error) throw error;
                                        toast.success("Enquiry submitted successfully!");
                                        e.target.reset();
                                    } catch (err) {
                                        toast.error("Failed to submit enquiry");
                                    }
                                }}
                            >
                                {/* Custom Styled Inputs - Dark Mode */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-blinkred tracking-[0.2em]">Service Type</label>
                                    <select
                                        name="type_of_work"
                                        className="w-full bg-[#222222] border-none rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-blinkred transition-all appearance-none cursor-pointer outline-none"
                                        required
                                    >
                                        <option value="" className="bg-[#222222]">Select Service</option>
                                        <option className="bg-[#222222]">Cooking</option>
                                        <option className="bg-[#222222]">Baby Care</option>
                                        <option className="bg-[#222222]">Senior Care</option>
                                        <option className="bg-[#222222]">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-blinkred tracking-[0.2em]">Team Size</label>
                                    <input
                                        type="number"
                                        name="number_of_workers"
                                        placeholder="e.g. 2"
                                        className="w-full bg-[#222222] border-none rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-blinkred transition-all outline-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-blinkred tracking-[0.2em]">Your Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        placeholder="Full Name"
                                        className="w-full bg-[#222222] border-none rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-blinkred transition-all outline-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-blinkred tracking-[0.2em]">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        className="w-full bg-[#222222] border-none rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-blinkred transition-all outline-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-blinkred tracking-[0.2em]">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        placeholder="Mobile Number"
                                        className="w-full bg-[#222222] border-none rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-blinkred transition-all outline-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-blinkred tracking-[0.2em]">Best Time to Call</label>
                                    <input
                                        type="text"
                                        name="preferred_contact_time"
                                        placeholder="Morning / Evening"
                                        className="w-full bg-[#222222] border-none rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-blinkred transition-all outline-none"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-black uppercase text-blinkred tracking-[0.2em]">Your Message</label>
                                    <textarea
                                        name="message"
                                        rows="3"
                                        placeholder="Anything else we should know?"
                                        className="w-full bg-[#222222] border-none rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-blinkred transition-all outline-none"
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2 pt-6">
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02, backgroundColor: "#ffffff", color: "#000000" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-blinkred py-5 rounded-2xl text-white font-black uppercase tracking-[0.2em] shadow-2xl transition-all duration-300"
                                    >
                                        Confirm Inquiry
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
{/* Premium Brand Section - blinkred Background */}
<section className="relative bg-blinkred py-24 overflow-hidden">
    
    {/* Subtle Texture Overlay for Professional Depth */}
    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
    
    {/* Soft Glow to prevent the red from looking "flat" */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Left side: High-contrast typography */}
            <div className="max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 mb-6"
                >
                    <span className="h-[1px] w-8 bg-white/60" />
                    <span className="text-white/80 text-[10px] font-black tracking-[0.4em] uppercase">
                        Premium Quality
                    </span>
                </motion.div>
                
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-8"
                >
                    Experience the <br />
                    <span className="italic font-serif text-black/20">Blink Standard.</span>
                </motion.h2>
            </div>

            {/* Right side: Compact Stats / Trust Box */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2.5rem] md:w-80 shadow-2xl"
            >
                <div className="space-y-6">
                    <div>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Success Rate</p>
                        <h4 className="text-4xl font-black text-white">99.9%</h4>
                    </div>
                    <div className="h-[1px] w-full bg-white/10" />
                    <div>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Response Time</p>
                        <h4 className="text-4xl font-black text-white">Instant</h4>
                    </div>
                    
                    <button className="w-full py-4 bg-white text-blinkred rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300">
                        Book Now
                    </button>
                </div>
            </motion.div>

        </div>
    </div>
</section>
            {/* Contact Section - Premium Location & Contact Info */}
     {/* Contact Section - Boutique Concierge Design */}
<section id="contact-info" className="relative bg-white py-10 overflow-hidden">
    
    {/* Minimalist Background Accents */}
    <div className="absolute top-0 right-0 w-1/3 h-full bg-zinc-50/50 -z-10" />
    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blinkred/5 rounded-full blur-[120px] -z-10" />

    <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
            
            {/* Left Column: Brand Statement */}
            <div className="lg:w-1/3">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-blinkred text-[10px] font-black tracking-[0.4em] uppercase mb-6 block">
                        Available 24/7
                    </span>
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[0.9] tracking-tighter mb-8">
                        Let’s start a <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blinkred to-pink-600 italic font-serif">
                            conversation.
                        </span>
                    </h2>
                    <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10">
                        Whether you need a dedicated professional or a quick consultation, our concierge team is ready to assist you.
                    </p>
                    
                    {/* Social/Trust Indicator */}
                    <div className="pt-10 border-t border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Official Channels</p>
                        <div className="flex gap-4">
                            {['Instagram', 'LinkedIn', 'WhatsApp'].map((social) => (
                                <span key={social} className="text-sm font-bold text-gray-900 hover:text-blinkred cursor-pointer transition-colors">
                                    {social}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Contact Cards */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    {
                        icon: <HiOutlineMail size={24} />,
                        title: "Email Support",
                        detail: "support@blinkmaid.com",
                        sub: "Expert assistance in < 2 hrs",
                        color: "bg-blue-500"
                    },
                    {
                        icon: <HiOutlinePhone size={24} />,
                        title: "Priority Line",
                        detail: "+91 93804 19755",
                        sub: "Available Mon - Sun, 9am - 9pm",
                        color: "bg-blinkred"
                    },
                    {
                        icon: <HiOutlineLocationMarker size={24} />,
                        title: "Bengaluru HQ",
                        detail: "Telecom Layout, Thanisandra",
                        sub: "No. 33, Shop 01, PIN 560077",
                        color: "bg-zinc-900",
                        wide: true
                    }
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        className={`group relative p-8 rounded-[2rem] border border-gray-100 bg-white transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] ${item.wide ? 'md:col-span-2' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="flex items-start justify-between mb-12">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500">
                                {item.icon}
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-2 h-2 rounded-full bg-blinkred animate-ping" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-xl font-bold text-gray-900 group-hover:text-blinkred transition-colors duration-300">
                                {item.detail}
                            </p>
                            <p className="mt-2 text-sm text-gray-500 font-medium">
                                {item.sub}
                            </p>
                        </div>

                        {/* Subtle interactive line */}
                        <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gray-50 group-hover:bg-blinkred transition-all duration-500 scale-x-0 group-hover:scale-x-100 transform origin-left" />
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
</section>

        </div>
    );
}