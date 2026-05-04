"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  MapPin, Plus, Trash2, Search, Map, 
  X, AlertTriangle, Loader2, Upload, ImageIcon, Edit3 
} from "lucide-react";
import { useToast } from "@/app/components/toast/ToastContext";
interface City {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
}
export default function CitiesDashboard() {
  const [cities, setCities] = useState<City[]>([]);
  
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // 3. (Optional but recommended) Update your editingCity state type as well
  const [editingCity, setEditingCity] = useState<City | null>(null);
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form & Selection States
  const [deleteId, setDeleteId] = useState(null);
  const [cityName, setCityName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const { showToast } = useToast();

  const fetchCities = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("cities").select("*").order("name", { ascending: true });
    if (!error) setCities(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCities(); }, []);

  // Open Modal for Edit
  const handleEditClick = (city) => {
    setEditingCity(city);
    setCityName(city.name);
    setSelectedFile(null); // Reset file input
    setShowAddModal(true);
  };

  // Open Modal for Add
  const handleAddClick = () => {
    setEditingCity(null);
    setCityName("");
    setSelectedFile(null);
    setShowAddModal(true);
  };

  const handleSaveCity = async (e) => {
    e.preventDefault();
    if (!cityName.trim()) return;
    setUploading(true);

    let imagePath = editingCity?.image_url || null;

    // 1. Handle Image Upload if a new file is picked
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('city-icons')
        .upload(fileName, selectedFile);

      if (uploadError) {
        showToast("Image upload failed", "error");
        setUploading(false);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('city-icons').getPublicUrl(fileName);
      imagePath = publicUrl;
    }

    // 2. Insert or Update
    const payload = { name: cityName, image_url: imagePath };
    
    const { error } = editingCity 
      ? await supabase.from("cities").update(payload).eq("id", editingCity.id)
      : await supabase.from("cities").insert([payload]);

    if (!error) {
      showToast(editingCity ? "City updated!" : "City added!", "success");
      setShowAddModal(false);
      fetchCities();
    } else {
      showToast("Error saving data", "error");
    }
    setUploading(false);
  };

  const handleDeleteFinal = async () => {
    const { error } = await supabase.from("cities").delete().eq("id", deleteId);
    if (!error) {
      showToast("City deleted successfully", "success");
      fetchCities();
    } else {
      showToast("Delete failed", "error");
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-black px-8 py-8 rounded-b-3xl shadow-lg text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Location <span className="opacity-70">Manager</span></h1>
            <p className="text-red-100 mt-1">Manage cities and their display images.</p>
          </div>
          <button 
            onClick={handleAddClick}
            className="bg-white text-red-700 font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-md"
          >
            <Plus size={20} /> Add City
          </button>
        </div>
      </header>

      <main className="p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Filter cities..."
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">City Name</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cities.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((city) => (
                  <tr key={city.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-6 py-4">
                      {city.image_url ? (
                        <img src={city.image_url} alt={city.name} className="w-12 h-12 rounded-lg object-cover border shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{city.name}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(city.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEditClick(city)}
                          className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => { setDeleteId(city.id); setShowDeleteModal(true); }}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Save Modal (Add & Edit) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">
                {editingCity ? "Edit City Details" : "Create New City"}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black"><X /></button>
            </div>
            <form onSubmit={handleSaveCity} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">City Name</label>
                <input 
                  required
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-gray-50"
                  placeholder="Enter city name..."
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">
                  {editingCity ? "Change Image (Optional)" : "Display Image"}
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-4 hover:border-red-400 transition-colors bg-gray-50">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Upload size={24} className="text-red-500" />
                    <span className="text-sm font-medium text-center px-2">
                      {selectedFile ? selectedFile.name : "Click to upload image"}
                    </span>
                  </div>
                </div>
                {editingCity && !selectedFile && editingCity.image_url && (
                  <p className="text-[10px] text-gray-400 mt-2 italic text-center">Currently using existing image</p>
                )}
              </div>

              <button 
                disabled={uploading}
                type="submit" 
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {uploading ? <Loader2 className="animate-spin" /> : editingCity ? "Update City" : "Save City Location"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Are you sure?</h2>
            <p className="text-gray-500 mb-8">
              This action will permanently delete this city. You cannot undo this later.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteFinal}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}