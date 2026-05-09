import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // ===== WEDDINGS MANAGEMENT =====
  const [weddings, setWeddings] = useState([]);
  const [selectedWedding, setSelectedWedding] = useState(null);
  const [newWeddingForm, setNewWeddingForm] = useState({
    coupleName: '',
    location: '',
    weddingDate: '',
    featuredImage: '',
    category: 'Weddings',
    description: '',
  });
  const [editingWedding, setEditingWedding] = useState(null);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [editingFeaturedImageFile, setEditingFeaturedImageFile] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
  const [editingFeaturedImagePreview, setEditingFeaturedImagePreview] = useState(null);

  // ===== PHOTOS MANAGEMENT =====
  const [weddingPhotos, setWeddingPhotos] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoAspectRatio, setPhotoAspectRatio] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);

  // ===== ANALYTICS =====
  const [analytics, setAnalytics] = useState({
    totalWeddings: 0,
    totalPhotos: 0,
    totalBookings: 0,
    recentInquiries: [],
  });

  // Fetch weddings on component mount
  useEffect(() => {
    fetchWeddings();
  }, []);

  // Update analytics whenever weddings/photos change
  useEffect(() => {
    setAnalytics((prev) => ({
      ...prev,
      totalWeddings: weddings.length,
      totalPhotos: weddingPhotos.length,
    }));
  }, [weddings.length, weddingPhotos.length]);

  // Fetch photos when selected wedding changes
  useEffect(() => {
    if (selectedWedding) {
      fetchWeddingPhotos(selectedWedding._id);
    } else {
      setWeddingPhotos([]);
    }
  }, [selectedWedding]);

  const fetchWeddings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/weddings');
      setWeddings(res.data);
    } catch (err) {
      console.error('Error fetching weddings:', err);
      alert('Failed to fetch weddings');
    }
  };

  const fetchWeddingPhotos = async (weddingId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/gallery?weddingId=${weddingId}`);
      setWeddingPhotos(res.data);
    } catch (err) {
      console.error('Error fetching photos:', err);
    }
  };

  // ===== WEDDING CRUD OPERATIONS =====
  const handleCreateWedding = async (e) => {
    e.preventDefault();
    if (!newWeddingForm.coupleName || !newWeddingForm.location || !newWeddingForm.weddingDate) {
      alert('Please fill all required fields');
      return;
    }

    try {
      let formData = { ...newWeddingForm };

      // Convert featured image file to base64 if selected
      if (featuredImageFile) {
        const toBase64 = (f) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(f);
          });
        formData.featuredImage = await toBase64(featuredImageFile);
      }

      const res = await axios.post('http://localhost:5000/api/weddings', formData);
      setWeddings((prev) => [...prev, res.data]);

      setNewWeddingForm({
        coupleName: '',
        location: '',
        weddingDate: '',
        featuredImage: '',
        category: 'Weddings',
        description: '',
      });
      setFeaturedImageFile(null);
      setFeaturedImagePreview(null);

      alert('Wedding created successfully!');
    } catch (err) {
      console.error('Error creating wedding:', err);
      alert('Failed to create wedding');
    }
  };

  const handleUpdateWedding = async (e) => {
    e.preventDefault();
    if (!editingWedding) return;

    try {
      let updateData = { ...editingWedding };

      // Convert featured image file to base64 if selected
      if (editingFeaturedImageFile) {
        const toBase64 = (f) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(f);
          });
        updateData.featuredImage = await toBase64(editingFeaturedImageFile);
      }

      const res = await axios.put(`http://localhost:5000/api/weddings/${editingWedding._id}`, updateData);
      setWeddings((prev) => prev.map((w) => (w._id === res.data._id ? res.data : w)));
      setEditingWedding(null);
      setEditingFeaturedImageFile(null);
      setEditingFeaturedImagePreview(null);
      setSelectedWedding(res.data);

      alert('Wedding updated successfully!');
    } catch (err) {
      console.error('Error updating wedding:', err);
      alert('Failed to update wedding');
    }
  };

  const handleDeleteWedding = async (weddingId) => {
    if (!confirm('Delete this wedding and all its photos?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/weddings/${weddingId}`);
      setWeddings((prev) => prev.filter((w) => w._id !== weddingId));
      if (selectedWedding?._id === weddingId) {
        setSelectedWedding(null);
        setWeddingPhotos([]);
      }
      alert('Wedding deleted successfully!');
    } catch (err) {
      console.error('Error deleting wedding:', err);
      alert('Failed to delete wedding');
    }
  };

  // ===== PHOTO OPERATIONS =====
  const readImageAspectRatio = (selectedFile) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        resolve(ratio);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(selectedFile);
    });
  };

  const handlePhotoFileChange = async (e) => {
    const selected = e.target.files?.[0] || null;
    setPhotoFile(selected);
    setPhotoPreviewUrl(null);
    setPhotoAspectRatio(null);

    if (!selected) return;

    try {
      const preview = URL.createObjectURL(selected);
      setPhotoPreviewUrl(preview);
      const ratio = await readImageAspectRatio(selected);
      setPhotoAspectRatio(ratio);
    } catch {
      alert('Failed to read image');
    }
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!photoFile || !selectedWedding) {
      alert('Please select a wedding and an image');
      return;
    }

    setUploadingPhoto(true);
    try {
      const toBase64 = (f) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });

      const base64 = await toBase64(photoFile);

      const res = await axios.post('http://localhost:5000/api/gallery/upload', {
        imageUrl: base64,
        aspectRatio: photoAspectRatio,
        category: 'Wedding',
        weddingId: selectedWedding._id,
      });

      setWeddingPhotos((prev) => [res.data, ...prev]);
      setPhotoFile(null);
      setPhotoPreviewUrl(null);
      setPhotoAspectRatio(null);
      alert('Photo uploaded successfully!');
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Failed to upload photo: ' + (err?.response?.data?.error || err?.message));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!confirm('Delete this photo?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/gallery/${photoId}`);
      setWeddingPhotos((prev) => prev.filter((p) => p._id !== photoId));
      alert('Photo deleted successfully!');
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Failed to delete photo');
    }
  };

  const weddingCountForCard = useMemo(() => {
    // We only know actual photo count for the currently selected wedding.
    // For the “recent” cards we show 0 unless selectedWedding matches.
    const map = new Map();
    for (const w of weddings) map.set(w._id, 0);
    if (selectedWedding?._id && weddingPhotos.length >= 0) {
      map.set(selectedWedding._id, weddingPhotos.length);
    }
    return map;
  }, [weddings, selectedWedding, weddingPhotos.length]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 hidden md:flex md:flex-col border-r border-white/10">
          <div className="p-6">
            <div className="text-amber-300 text-xs tracking-widest uppercase">THE GOLDEN SHUTTER</div>
            <div className="mt-2 text-xl font-serif italic">ADMIN DASHBOARD</div>
          </div>

          <nav className="px-4 pb-6">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'weddingStories', label: 'Wedding Stories' },
              { key: 'addStory', label: 'Add Story' },
              { key: 'bookings', label: 'Bookings' },
              { key: 'settings', label: 'Settings' },
              { key: 'logout', label: 'Logout' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full text-left px-4 py-3 rounded-xl mb-2 border transition ${
                  activeTab === item.key
                    ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                    : 'border-transparent hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 px-4 py-10 md:py-14">
          <div className="mx-auto max-w-7xl">
            {/* Mobile Header */}
            <div className="md:hidden mb-6">
              <div className="text-amber-300 text-xs tracking-widest uppercase">THE GOLDEN SHUTTER</div>
              <div className="mt-2 text-2xl font-serif italic">ADMIN DASHBOARD</div>
            </div>

            {activeTab === 'dashboard' && (
              <>
                {/* Overview */}
                <section className="mb-8">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif italic text-3xl">Overview</h2>
                    <div className="text-amber-300 text-sm tracking-widest uppercase">Portfolio • Admin</div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                      <div className="text-amber-300 text-xs tracking-widest uppercase">Total Weddings</div>
                      <div className="text-4xl font-bold mt-2">{weddings.length}</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                      <div className="text-amber-300 text-xs tracking-widest uppercase">Total Photos</div>
                      <div className="text-4xl font-bold mt-2">{weddingPhotos.length}</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                      <div className="text-amber-300 text-xs tracking-widest uppercase">Total Bookings</div>
                      <div className="text-4xl font-bold mt-2">18</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                      <div className="text-amber-300 text-xs tracking-widest uppercase">Total Films</div>
                      <div className="text-4xl font-bold mt-2">12</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                      <div className="text-amber-300 text-xs tracking-widest uppercase">New Messages</div>
                      <div className="text-4xl font-bold mt-2">9</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                      <div className="text-amber-300 text-xs tracking-widest uppercase">Active Stories</div>
                      <div className="text-4xl font-bold mt-2">20</div>
                    </div>
                  </div>
                </section>

                {/* Recent Wedding Stories */}
                <section className="mb-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">RECENT WEDDING STORIES</h3>
                    <button
                      onClick={() => setActiveTab('addStory')}
                      className="px-4 py-2 rounded-xl border border-amber-400 bg-amber-400/10 hover:bg-amber-400/20 transition"
                    >
                      + Add Wedding Story
                    </button>
                  </div>

                  <div className="mt-4 space-y-4">
                    {(weddings.length ? weddings.slice(0, 2) : []).map((w) => (
                      <div key={w._id} className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                        <div className="flex gap-5 items-center">
                          <div className="w-28 h-20 rounded-xl overflow-hidden border border-white/10 bg-black/30 flex-shrink-0">
                            <img src={w.featuredImage} alt={w.coupleName} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white/80 text-sm">{w.coupleName}</div>
                            <div className="text-white text-lg font-semibold">{w.location}</div>
                            <div className="text-amber-300 text-xs tracking-widest uppercase mt-1">
                              {w.category} • {weddingCountForCard.get(w._id) || 0} Photos
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedWedding(w);
                                setActiveTab('weddingStories');
                              }}
                              className="px-3 py-1 rounded-xl border border-white/10 hover:bg-white/5 transition"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                setEditingWedding(w);
                                setSelectedWedding(w);
                                setActiveTab('addStory');
                              }}
                              className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteWedding(w._id)}
                              className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {weddings.length === 0 && (
                      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-white/70">
                        No wedding stories yet. Add your first story.
                      </div>
                    )}
                  </div>
                </section>

                {/* Recent Bookings (placeholder) */}
                <section className="mb-8">
                  <h3 className="text-xl font-semibold">RECENT BOOKINGS</h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Rohan Sharma', date: '12 July 2026', location: 'Udaipur', status: 'Pending' },
                      { name: 'Priya & Aman', date: '28 August 2026', location: 'Jaipur', status: 'Contacted' },
                    ].map((b, idx) => (
                      <div key={idx} className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                        <div className="text-sm text-white/80">
                          Name: <span className="text-white">{b.name}</span>
                        </div>
                        <div className="text-sm text-white/80 mt-1">Date: {b.date}</div>
                        <div className="text-sm text-white/80 mt-1">Location: {b.location}</div>
                        <div className="text-sm text-white/80 mt-1">
                          Status:{' '}
                          <span className={b.status === 'Pending' ? 'text-pink-300' : 'text-amber-300'}> {b.status}</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button className="px-3 py-1 rounded-xl border border-white/10 hover:bg-white/5 transition">
                            View Details
                          </button>
                          {b.status === 'Pending' && (
                            <button className="px-3 py-1 rounded-xl bg-amber-400 text-black hover:bg-amber-300 transition">
                              Mark Contacted
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Quick Actions */}
                <section className="mb-8">
                  <h3 className="text-xl font-semibold">QUICK ACTIONS</h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('addStory')}
                      className="px-5 py-2 rounded-xl border border-amber-400 bg-amber-400/10 hover:bg-amber-400/20 transition"
                    >
                      + Add Wedding Story
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('photos');
                      }}
                      className="px-5 py-2 rounded-xl border border-amber-400 bg-amber-400/10 hover:bg-amber-400/20 transition"
                    >
                      + Upload Gallery
                    </button>
                    <button className="px-5 py-2 rounded-xl border border-amber-400 bg-amber-400/10 hover:bg-amber-400/20 transition">
                      + Add Film
                    </button>
                  </div>
                </section>

                {/* Activity */}
                <section>
                  <h3 className="text-xl font-semibold">ACTIVITY</h3>
                  <ul className="mt-4 space-y-2 text-white/80">
                    <li>• New wedding story published</li>
                    <li>• 12 new images uploaded</li>
                    <li>• Booking inquiry received</li>
                    <li>• Portfolio updated successfully</li>
                  </ul>
                </section>
              </>
            )}

            {activeTab === 'weddingStories' && (
              <section>
                <div className="mb-6">
                  <h2 className="font-serif italic text-3xl">Wedding Stories</h2>
                  <p className="text-white/70 mt-2">Select a story to view/manage photos.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Stories</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {weddings.length === 0 ? (
                        <div className="text-white/50">No weddings yet.</div>
                      ) : (
                        weddings.map((w) => (
                          <button
                            key={w._id}
                            onClick={() => setSelectedWedding(w)}
                            className={`w-full text-left p-3 rounded-xl border transition ${
                              selectedWedding?._id === w._id
                                ? 'border-amber-400 bg-amber-400/10'
                                : 'border-white/10 bg-black/20 hover:bg-black/40'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-10 rounded-lg overflow-hidden border border-white/10 bg-black/30">
                                {w.featuredImage ? (
                                  <img src={w.featuredImage} alt={w.coupleName} className="w-full h-full object-cover" />
                                ) : null}
                              </div>
                              <div>
                                <div className="font-semibold text-sm">{w.coupleName}</div>
                                <div className="text-xs text-white/60">{w.location}</div>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {selectedWedding ? `Photos of ${selectedWedding.coupleName}` : 'Select a story'}
                    </h3>

                    {selectedWedding ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                        {weddingPhotos.length === 0 ? (
                          <div className="col-span-full text-white/50">No photos yet</div>
                        ) : (
                          weddingPhotos.map((photo) => (
                            <div key={photo._id} className="relative group rounded-xl overflow-hidden border border-white/10">
                              <img src={photo.imageUrl} alt="wedding" className="w-full h-32 object-cover" />
                              <button
                                onClick={() => handleDeletePhoto(photo._id)}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                              >
                                <span className="text-white font-semibold">Delete</span>
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    ) : (
                      <div className="text-white/50">Please select a wedding story first.</div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'addStory' && (
              <section>
                <div className="mb-6">
                  <h2 className="font-serif italic text-3xl">{editingWedding ? 'Edit Story' : 'Add Story'}</h2>
                  <p className="text-white/70 mt-2">Create/update wedding story details.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    <form onSubmit={editingWedding ? handleUpdateWedding : handleCreateWedding} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Couple Name"
                        value={editingWedding ? editingWedding.coupleName : newWeddingForm.coupleName}
                        onChange={(e) =>
                          editingWedding
                            ? setEditingWedding({ ...editingWedding, coupleName: e.target.value })
                            : setNewWeddingForm({ ...newWeddingForm, coupleName: e.target.value })
                        }
                        className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
                        required
                      />

                      <input
                        type="text"
                        placeholder="Location"
                        value={editingWedding ? editingWedding.location : newWeddingForm.location}
                        onChange={(e) =>
                          editingWedding
                            ? setEditingWedding({ ...editingWedding, location: e.target.value })
                            : setNewWeddingForm({ ...newWeddingForm, location: e.target.value })
                        }
                        className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
                        required
                      />

                      <input
                        type="date"
                        value={editingWedding ? editingWedding.weddingDate?.split('T')[0] : newWeddingForm.weddingDate}
                        onChange={(e) =>
                          editingWedding
                            ? setEditingWedding({ ...editingWedding, weddingDate: e.target.value })
                            : setNewWeddingForm({ ...newWeddingForm, weddingDate: e.target.value })
                        }
                        className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
                        required
                      />

                      <select
                        value={editingWedding ? editingWedding.category : newWeddingForm.category}
                        onChange={(e) =>
                          editingWedding
                            ? setEditingWedding({ ...editingWedding, category: e.target.value })
                            : setNewWeddingForm({ ...newWeddingForm, category: e.target.value })
                        }
                        className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
                        required
                      >
                        <option value="Weddings">Weddings</option>
                        <option value="PreWedding">PreWedding</option>
                      </select>

                      <div>
                        <label className="block text-sm text-white/80 mb-2">Featured Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (editingWedding) {
                              setEditingFeaturedImageFile(file || null);
                              if (file) setEditingFeaturedImagePreview(URL.createObjectURL(file));
                              else setEditingFeaturedImagePreview(null);
                            } else {
                              setFeaturedImageFile(file || null);
                              if (file) setFeaturedImagePreview(URL.createObjectURL(file));
                              else setFeaturedImagePreview(null);
                            }
                          }}
                          className="w-full p-2 rounded-xl bg-black/20 border border-white/10 text-white text-sm"
                        />

                        {(editingWedding ? editingFeaturedImagePreview : featuredImagePreview) && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                            <img
                              src={editingWedding ? editingFeaturedImagePreview : featuredImagePreview}
                              alt="preview"
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <textarea
                        placeholder="Description (optional)"
                        value={editingWedding ? editingWedding.description : newWeddingForm.description}
                        onChange={(e) =>
                          editingWedding
                            ? setEditingWedding({ ...editingWedding, description: e.target.value })
                            : setNewWeddingForm({ ...newWeddingForm, description: e.target.value })
                        }
                        className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white text-sm h-24"
                      />

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-amber-400 text-black rounded-xl hover:bg-amber-300 transition font-semibold"
                        >
                          {editingWedding ? 'Update' : 'Add Story'}
                        </button>

                        {editingWedding && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingWedding(null);
                              setEditingFeaturedImageFile(null);
                              setEditingFeaturedImagePreview(null);
                            }}
                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Upload / Manage Photos</h3>
                    <div className="text-white/70 text-sm">
                      Use the Upload Gallery button from Quick Actions to upload story photos.
                    </div>
                    <button
                      onClick={() => setActiveTab('photos')}
                      className="mt-4 w-full px-4 py-3 bg-amber-400 text-black rounded-xl font-semibold hover:bg-amber-300 transition"
                    >
                      Go to Upload Gallery
                    </button>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'photos' && (
              <section>
                <div className="mb-6">
                  <h2 className="font-serif italic text-3xl">Upload Gallery</h2>
                  <p className="text-white/70 mt-2">Upload images for a wedding story.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 h-fit">
                    <h3 className="text-lg font-semibold mb-4">Select Wedding</h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {weddings.length === 0 ? (
                        <p className="text-white/50">Create a wedding first</p>
                      ) : (
                        weddings.map((w) => (
                          <button
                            key={w._id}
                            onClick={() => setSelectedWedding(w)}
                            className={`w-full text-left p-3 rounded-xl transition ${
                              selectedWedding?._id === w._id
                                ? 'bg-amber-400/20 border border-amber-400'
                                : 'bg-black/20 border border-white/10 hover:bg-black/40'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm flex-1">{w.coupleName}</p>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  w.category === 'PreWedding'
                                    ? 'bg-pink-500/30 text-pink-300'
                                    : 'bg-amber-500/30 text-amber-300'
                                }`}
                              >
                                {w.category}
                              </span>
                            </div>
                            <p className="text-xs text-white/60">{w.location}</p>
                          </button>
                        ))
                      )}
                    </div>

                    {selectedWedding && (
                      <form onSubmit={handleUploadPhoto} className="space-y-4 mt-6">
                        <h4 className="text-white/80 font-semibold">Upload Image</h4>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileChange}
                          className="w-full p-2 rounded-xl bg-black/20 border border-white/10 text-white text-sm"
                          required
                        />

                        {photoPreviewUrl && (
                          <div className="rounded-xl overflow-hidden border border-white/10">
                            <img src={photoPreviewUrl} alt="preview" className="w-full h-32 object-cover" />
                          </div>
                        )}

                        <div className="text-sm text-white/60">Aspect Ratio: {photoAspectRatio ? photoAspectRatio.toFixed(2) : '—'}</div>

                        <button
                          type="submit"
                          disabled={uploadingPhoto || !photoFile}
                          className="w-full px-4 py-2 bg-amber-400 text-black rounded-xl hover:bg-amber-300 transition font-semibold disabled:opacity-60"
                        >
                          {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {selectedWedding ? `Photos of ${selectedWedding.coupleName}` : 'Select a story'}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                      {selectedWedding && weddingPhotos.length === 0 && (
                        <div className="col-span-full text-white/50">No photos yet</div>
                      )}

                      {weddingPhotos.map((photo) => (
                        <div key={photo._id} className="relative group rounded-xl overflow-hidden border border-white/10">
                          <img src={photo.imageUrl} alt="wedding" className="w-full h-32 object-cover" />
                          <button
                            onClick={() => handleDeletePhoto(photo._id)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            <span className="text-white font-semibold">Delete</span>
                          </button>
                        </div>
                      ))}

                      {!selectedWedding && <div className="col-span-full text-white/50">Please select a story first.</div>}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'bookings' && (
              <section>
                <h2 className="font-serif italic text-3xl">Bookings</h2>
                <p className="text-white/70 mt-2">Placeholder UI. Connect booking APIs later.</p>
              </section>
            )}

            {activeTab === 'settings' && (
              <section>
                <h2 className="font-serif italic text-3xl">Settings</h2>
                <p className="text-white/70 mt-2">Placeholder UI.</p>
              </section>
            )}

            {activeTab === 'logout' && (
              <section>
                <h2 className="font-serif italic text-3xl">Logout</h2>
                <p className="text-white/70 mt-2">Placeholder UI.</p>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

