"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  User, MapPin, Briefcase, IndianRupee, CheckCircle, 
  ArrowRight, ShieldCheck, Zap, Camera, X, Award
} from "lucide-react";

export default function MaidRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    address: { house: "", street: "", area: "", landmark: "", city: "", pincode: "" },
    experience: "",
    salary: "",
    workTypes: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Auto-progression logic for the side-stepper
  useEffect(() => {
    if (formData.workTypes.length > 0) setActiveStep(3);
    else if (formData.experience && formData.salary) setActiveStep(2);
    else if (Object.values(formData.address).some(v => v !== "")) setActiveStep(1);
    else setActiveStep(0);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        workTypes: checked ? [...prev.workTypes, value] : prev.workTypes.filter(i => i !== value),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setPhotoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Image must be under 2MB");
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Prepare data matching your database schema
      const { data, error } = await supabase
        .from("maids")
        .insert([
          {
            name: formData.name,
            number: formData.number,
            address: formData.address, // Supabase handles JSONB automatically
            experience: parseInt(formData.experience),
            salary: parseInt(formData.salary),
            work_types: formData.workTypes, // Supabase handles text[] automatically
            photo_base64: photoBase64,
            status: 'pending' // Default value as defined in your table
          },
        ]);

      if (error) throw error;

      toast.success("Application Received Successfully!");
      
      // Reset form
      setFormData({
        name: "",
        number: "",
        address: { house: "", street: "", area: "", landmark: "", city: "", pincode: "" },
        experience: "",
        salary: "",
        workTypes: [],
      });
      setPhotoPreview(null);
      setPhotoBase64(null);

    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const workOptions = ["Cooking", "Cleaning", "Baby Care", "Elderly Care", "Washing", "Ironing"];

  return (
    <div className="bg-[#fafafa] text-black font-sans selection:bg-black selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://as1.ftcdn.net/v2/jpg/07/89/20/88/1000_F_789208828_dbryx91mavLaoIHAKncu6FChHkfnMbmM.jpg"
            className="w-full h-full object-cover"
            alt="Luxury Service"
          />
        </motion.div>
        
   <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blinkred/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Top Tagline */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <motion.span 
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-[2px] bg-blinkred hidden sm:block"
            ></motion.span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] text-white/90">
              Join the Elite
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-6 sm:mb-8">
            EXCELLENCE <br /> 
            IS A <span className="text-blinkred italic font-serif">STANDARD.</span>
          </h1>

          {/* Subtext */}
          <p className="text-white/60 text-base sm:text-lg md:text-xl max-w-xl font-light leading-relaxed mb-10 sm:mb-14 border-l-2 border-white/10 pl-6">
            Your professional journey deserves a premium platform. 
            Apply today to serve our exclusive network of homes.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.a
              href="#portal"
              whileHover={{ scale: 1.02, backgroundColor: "#e21d27" }} // Assuming blinkred hex
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-4 bg-white text-black px-8 sm:px-12 py-4 sm:py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs transition-all shadow-[0_20px_50px_rgba(226,29,39,0.2)] group"
            >
              Start Application 
              <ArrowRight 
                size={18} 
                className="group-hover:translate-x-2 transition-transform duration-300" 
              />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      </section>

      {/* --- BENTO INFO GRID --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 grid md:grid-cols-3 gap-6">
        {[
          { label: "Earnings", title: "Premium Tier", val: "₹25k - ₹45k", icon: IndianRupee },
          { label: "Trust", title: "Gold Verified", val: "Bank Grade", icon: ShieldCheck },
          { label: "Growth", title: "Career Path", val: "Skill Training", icon: Award },
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
              <item.icon className="text-blinkred" size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
            <h3 className="text-xl font-bold mt-1">{item.title}</h3>
            <p className="text-gray-500 mt-2 font-medium">{item.val}</p>
          </motion.div>
        ))}
      </section>

      {/* --- REGISTRATION PORTAL --- */}
      <section id="portal" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16">
            
            {/* Left Sidebar (Progress) */}
            <div className="md:w-1/4">
              <div className="sticky top-12">
                <h2 className="text-4xl font-bold tracking-tighter mb-12">PARTNER <br/>APPLICATION</h2>
                <div className="space-y-8">
                  {["Identity", "Geography", "Expertise", "Specialization"].map((step, i) => (
                    <div key={i} className={`flex items-center gap-4 transition-opacity ${activeStep >= i ? "opacity-100" : "opacity-30"}`}>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${activeStep >= i ? "bg-black border-black text-white" : "border-gray-200"}`}>
                        {activeStep > i ? <CheckCircle size={14}/> : i + 1}
                      </div>
                      <span className="uppercase text-[10px] font-black tracking-widest">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side (Form) */}
            <div className="md:w-3/4 space-y-12">
              <form onSubmit={handleSubmit} className="space-y-12">
                
                {/* 01. Personal Info */}
                <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-10">
                    <span className="text-4xl font-serif italic text-gray-200">01</span>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em]">Personal Identity</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <InputField label="Legal Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
                    <InputField label="WhatsApp Number" name="number" value={formData.number} onChange={handleChange} placeholder="98765 43210" />
                    
                    <div className="md:col-span-2 mt-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Profile Portrait</label>
                      <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                          {photoPreview ? (
                            <img src={photoPreview} className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="text-gray-300" />
                          )}
                        </div>
                        <label className="cursor-pointer bg-black text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-widest hover:bg-blinkred transition-colors">
                          UPLOAD PHOTO
                          <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 02. Location */}
                <div className="bg-gray-900 text-white p-8 md:p-12 rounded-[3rem] shadow-2xl">
                  <div className="flex items-center gap-4 mb-10">
                    <span className="text-4xl font-serif italic text-white/20">02</span>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em]">Work Geography</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.keys(formData.address).map((key) => (
                      <div key={key}>
                        <label className="text-[9px] font-bold uppercase text-white/40 mb-2 block">{key}</label>
                        <input 
                          name={key}
                          value={formData.address[key]}
                          onChange={handleAddressChange}
                          className="w-full bg-white/5 border-b border-white/20 py-2 outline-none focus:border-blinkred transition-colors font-medium text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 03. Experience & Skills */}
                <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-10">
                    <span className="text-4xl font-serif italic text-gray-200">03</span>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em]">Career Details</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-10 mb-12">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Years of Experience</label>
                        <select 
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blinkred transition-all font-bold appearance-none"
                        >
                          <option value="">Select Tier</option>
                          {[1,2,3,5,10].map(y => <option key={y} value={y}>{y}+ Years</option>)}
                        </select>
                    </div>
                    <InputField label="Expected Salary (Monthly)" name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="e.g. 25000" />
                  </div>

                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 block">Service Specializations</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {workOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                            const exists = formData.workTypes.includes(option);
                            setFormData(prev => ({
                                ...prev,
                                workTypes: exists ? prev.workTypes.filter(t => t !== option) : [...prev.workTypes, option]
                            }));
                        }}
                        className={`py-4 rounded-2xl text-[10px] font-black tracking-widest border-2 transition-all ${
                            formData.workTypes.includes(option) ? "bg-blinkred border-blinkred text-white" : "border-gray-100 hover:border-black"
                        }`}
                      >
                        {option.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-black text-white py-8 rounded-[2rem] font-black tracking-[0.4em] text-xs hover:bg-blinkred transition-colors flex items-center justify-center gap-4"
                >
                  {loading ? "PROCESSING..." : "SUBMIT APPLICATION"}
                  <ArrowRight size={16} />
                </motion.button>
                
                <p className="text-center text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                  Our team will review your profile within 48 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const InputField = ({ label, ...props }) => (
  <div className="w-full">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">{label}</label>
    <input
      {...props}
      className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none border border-transparent focus:border-blinkred focus:bg-white transition-all font-bold placeholder:text-gray-200"
    />
  </div>
);