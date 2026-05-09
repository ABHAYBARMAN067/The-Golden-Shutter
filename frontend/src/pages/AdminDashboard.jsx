import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('weddings');

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

  // Update analytics whenever weddings change
  useEffect(() => {
    setAnalytics((prev) => ({
      ...prev,
      totalWeddings: weddings.length,
      totalPhotos: weddingPhotos.length,
    }));
  }, [weddings, weddingPhotos]);

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
      setWeddings([...weddings, res.data]);
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

      const res = await axios.put(
        `http://localhost:5000/api/weddings/${editingWedding._id}`,
        updateData
      );
      setWeddings(weddings.map((w) => (w._id === res.data._id ? res.data : w)));
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
      setWeddings(weddings.filter((w) => w._id !== weddingId));
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

      setWeddingPhotos([res.data, ...weddingPhotos]);
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
      setWeddingPhotos(weddingPhotos.filter((p) => p._id !== photoId));
      alert('Photo deleted successfully!');
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Failed to delete photo');
    }
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen px-4 py-14 bg-black text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-3 text-amber-300/90 text-xs tracking-widest uppercase mb-4">
            <span className="h-px w-12 bg-amber-400/60" />
            Admin Control Panel
          </div>
          <h2 className="font-serif italic text-4xl">Manage Your Weddings</h2>
          <p className="text-white/70 mt-3 max-w-2xl text-sm leading-relaxed">
            Organize weddings, upload photos, and manage your portfolio from here.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('weddings')}
            className={`px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === 'weddings'
                ? 'text-amber-300 border-b-2 border-amber-300'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Weddings Management
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === 'photos'
                ? 'text-amber-300 border-b-2 border-amber-300'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Photos Management
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'text-amber-300 border-b-2 border-amber-300'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* WEDDINGS TAB */}
        {activeTab === 'weddings' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Add/Edit Wedding Form */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 h-fit">
              <h3 className="text-lg font-semibold mb-4">
                {editingWedding ? 'Edit Wedding' : 'Add New Wedding'}
              </h3>
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
                  className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white"
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
                  className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white"
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
                  className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white"
                  required
                />
                <select
                  value={editingWedding ? editingWedding.category : newWeddingForm.category}
                  onChange={(e) =>
                    editingWedding
                      ? setEditingWedding({ ...editingWedding, category: e.target.value })
                      : setNewWeddingForm({ ...newWeddingForm, category: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white"
                  required
                >
                  <option value="Weddings">Weddings</option>
                  <option value="PreWedding">PreWedding</option>
                </select>
                
                {/* Featured Image Upload */}
                <div>
                  <label className="block text-sm text-white/80 mb-2">Featured Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (editingWedding) {
                        setEditingFeaturedImageFile(file || null);
                        if (file) {
                          const preview = URL.createObjectURL(file);
                          setEditingFeaturedImagePreview(preview);
                        } else {
                          setEditingFeaturedImagePreview(null);
                        }
                      } else {
                        setFeaturedImageFile(file || null);
                        if (file) {
                          const preview = URL.createObjectURL(file);
                          setFeaturedImagePreview(preview);
                        } else {
                          setFeaturedImagePreview(null);
                        }
                      }
                    }}
                    className="w-full p-2 rounded-lg bg-black/20 border border-white/10 text-white text-sm"
                  />
                  {(editingWedding ? editingFeaturedImagePreview : featuredImagePreview) && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
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
                  className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white text-sm h-24"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-300 transition font-semibold"
                  >
                    {editingWedding ? 'Update' : 'Add Wedding'}
                  </button>
                  {editingWedding && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingWedding(null);
                        setEditingFeaturedImageFile(null);
                        setEditingFeaturedImagePreview(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right: Weddings List */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-lg font-semibold mb-4">All Weddings ({weddings.length})</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {weddings.length === 0 ? (
                    <p className="text-white/50">No weddings yet. Add one to get started!</p>
                  ) : (
                    weddings.map((wedding) => (
                      <div
                        key={wedding._id}
                        className={`p-4 rounded-lg border transition cursor-pointer ${
                          selectedWedding?._id === wedding._id
                            ? 'border-amber-400 bg-amber-400/10'
                            : 'border-white/10 bg-black/20 hover:bg-black/40'
                        }`}
                        onClick={() => {
                          setSelectedWedding(wedding);
                          setEditingWedding(null);
                        }}
                      >
                        {wedding.featuredImage && (
                          <div className="rounded-lg overflow-hidden mb-3 h-24">
                            <img src={wedding.featuredImage} alt={wedding.coupleName} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-white">{wedding.coupleName}</h4>
                              <span className={`text-xs px-2 py-1 rounded ${wedding.category === 'PreWedding' ? 'bg-pink-500/30 text-pink-300' : 'bg-amber-500/30 text-amber-300'}`}>
                                {wedding.category}
                              </span>
                            </div>
                            <p className="text-sm text-white/70">{wedding.location}</p>
                            <p className="text-xs text-white/50">
                              {new Date(wedding.weddingDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingWedding(wedding);
                                setSelectedWedding(wedding);
                              }}
                              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWedding(wedding._id);
                              }}
                              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHOTOS TAB */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Wedding Selector & Upload */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 h-fit">
              <h3 className="text-lg font-semibold mb-4">Upload Photos</h3>

              {/* Wedding Selector */}
              <div className="mb-6">
                <label className="block text-sm text-white/80 mb-2">Select Wedding</label>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {weddings.length === 0 ? (
                    <p className="text-white/50 text-sm">Create a wedding first</p>
                  ) : (
                    weddings.map((wedding) => (
                      <button
                        key={wedding._id}
                        onClick={() => setSelectedWedding(wedding)}
                        className={`w-full text-left p-3 rounded-lg transition ${
                          selectedWedding?._id === wedding._id
                            ? 'bg-amber-400/20 border border-amber-400'
                            : 'bg-black/20 border border-white/10 hover:bg-black/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm flex-1">{wedding.coupleName}</p>
                          <span className={`text-xs px-2 py-1 rounded ${wedding.category === 'PreWedding' ? 'bg-pink-500/30 text-pink-300' : 'bg-amber-500/30 text-amber-300'}`}>
                            {wedding.category}
                          </span>
                        </div>
                        <p className="text-xs text-white/60">{wedding.location}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {selectedWedding && (
                <form onSubmit={handleUploadPhoto} className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    className="w-full p-2 rounded-lg bg-black/20 border border-white/10 text-white text-sm"
                    required
                  />

                  {photoPreviewUrl && (
                    <div className="rounded-lg overflow-hidden border border-white/10">
                      <img src={photoPreviewUrl} alt="preview" className="w-full h-32 object-cover" />
                    </div>
                  )}

                  <div className="text-sm text-white/60">
                    Aspect Ratio: {photoAspectRatio ? photoAspectRatio.toFixed(2) : '—'}
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingPhoto || !photoFile}
                    className="w-full px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-300 transition font-semibold disabled:opacity-60"
                  >
                    {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Photos Grid */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedWedding ? `Photos of ${selectedWedding.coupleName}` : 'Select a wedding to view photos'}
                </h3>

                {selectedWedding ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {weddingPhotos.length === 0 ? (
                      <p className="text-white/50 col-span-full">No photos yet</p>
                    ) : (
                      weddingPhotos.map((photo) => (
                        <div key={photo._id} className="relative group rounded-lg overflow-hidden border border-white/10">
                          <img src={photo.imageUrl} alt="wedding" className="w-full h-32 object-cover" />
                          <button
                            onClick={() => handleDeletePhoto(photo._id)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg"
                          >
                            <span className="text-white font-semibold">Delete</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <p className="text-white/50">Please select a wedding</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="text-amber-300 text-sm tracking-widest uppercase">Total Weddings</div>
              <div className="text-4xl font-bold mt-2">{analytics.totalWeddings}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="text-amber-300 text-sm tracking-widest uppercase">Total Photos</div>
              <div className="text-4xl font-bold mt-2">{analytics.totalPhotos}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="text-amber-300 text-sm tracking-widest uppercase">Bookings</div>
              <div className="text-4xl font-bold mt-2">34</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="text-amber-300 text-sm tracking-widest uppercase">This Month</div>
              <div className="text-4xl font-bold mt-2">12</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

