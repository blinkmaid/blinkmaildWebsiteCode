"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Mail, Phone, User, MessageSquare,
  CheckCircle2, Clock, Search, Eye, X, Filter
} from "lucide-react";
import { useToast } from "@/app/components/toast/ToastContext";
// 1. Define the shape of your data
interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  created_at: string;
}

export default function ContactsAdmin() {
  // 2. Assign the interface to the state
  const [contacts, setContacts] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  // 3. Type the selected contact state as well
  const [selectedContact, setSelectedContact] = useState<ContactEnquiry | null>(null);

  const { showToast } = useToast();

  const fetchContacts = async () => {
    setLoading(true);
    // TypeScript will now correctly map 'data' to ContactEnquiry[]
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setContacts(data as ContactEnquiry[]);
    }
    setLoading(false);
  };


  useEffect(() => { fetchContacts(); }, []);

  // 🔹 Quick Status Update
  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("contacts")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      showToast(`Contact moved to ${newStatus}`, "success");
      fetchContacts();
    }
  };

  // 🔹 Filtering Logic (Search + Tabs)
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "All") return matchesSearch;
    return matchesSearch && c.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-800 to-black p-8 text-white rounded-b-[2.5rem] shadow-2xl">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Contact <span className="opacity-60">Inbox</span></h1>
            <p className="text-red-100 text-sm mt-1">Filter and manage customer support requests.</p>
          </div>
          <div className="flex bg-black/20 p-1 rounded-xl backdrop-blur-md">
            {["All", "Pending", "Done"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                  ? "bg-white text-red-800 shadow-lg"
                  : "text-white hover:bg-white/10"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="p-8 -mt-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 border-b bg-white flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search name or email..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="text-sm font-medium text-gray-400">
              Showing {filteredContacts.length} Enquiries
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[11px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Sender Details</th>
                  <th className="px-8 py-5">Message Content</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="group hover:bg-red-50/20 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-gray-900">{contact.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail size={12} /> {contact.email}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm text-gray-600 truncate max-w-[250px]">
                          {contact.message}
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${contact.status === 'Done'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                          }`}>
                          {contact.status === 'Done' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {contact.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-3">
                          {contact.status !== 'Done' && (
                            <button
                              onClick={() => updateStatus(contact.id, 'Done')}
                              className="text-xs font-bold text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-all"
                            >
                              Mark as Done
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="p-2 bg-gray-50 text-gray-400 group-hover:text-red-600 rounded-xl transition-all"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                   <td colSpan={4} className="py-20 text-center text-gray-400 font-medium">
                      No contacts found in {activeTab}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Detail Modal (Same as before but styled to match) */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="font-black text-2xl text-gray-900">Message Details</h3>
                <p className="text-gray-400 text-xs mt-1">Received on {new Date(selectedContact.created_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setSelectedContact(null)} className="p-3 bg-white shadow-sm rounded-2xl text-gray-400 hover:text-black transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="text-[10px] uppercase font-black text-red-600 tracking-widest block mb-2">Full Name</label>
                  <p className="font-bold text-gray-900">{selectedContact.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="text-[10px] uppercase font-black text-red-600 tracking-widest block mb-2">Phone Number</label>
                  <p className="font-bold text-gray-900">{selectedContact.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <label className="text-[10px] uppercase font-black text-red-600 tracking-widest block mb-2">Email</label>
                <p className="font-bold text-gray-900">{selectedContact.email}</p>
              </div>

              <div className="bg-red-50/50 p-6 rounded-[2rem] border border-red-100 relative">
                <MessageSquare className="absolute -top-3 -right-3 text-red-200" size={60} />
                <label className="text-[10px] uppercase font-black text-red-600 tracking-widest block mb-3">Customer Message</label>
                <p className="text-gray-800 leading-relaxed font-medium relative z-10 text-lg">"{selectedContact.message}"</p>
              </div>
            </div>

            <div className="p-8 bg-gray-50 flex gap-4">
              {selectedContact.status !== 'Done' && (
                <button
                  onClick={() => { updateStatus(selectedContact.id, 'Done'); setSelectedContact(null); }}
                  className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                >
                  Mark as Completed
                </button>
              )}
              <button
                onClick={() => setSelectedContact(null)}
                className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}