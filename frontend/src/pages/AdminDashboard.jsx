import React, { useMemo, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({ category: 'General' });
  const [file, setFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [busy, setBusy] = useState(false);

  const imagePreviewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

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

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setAspectRatio(null);
    if (!selected) return;

    try {
      const ratio = await readImageAspectRatio(selected);
      setAspectRatio(ratio);
    } catch {
      alert('Image aspect ratio read नहीं हो पाया');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload an image');
    if (!aspectRatio) return alert('Aspect ratio compute नहीं हुआ');

    setBusy(true);
    try { 

      const toBase64 = (f) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });

      const base64 = await toBase64(file);

      await axios.post('http://localhost:5000/api/gallery/upload', {
        imageUrl: base64,
        aspectRatio,
        category: formData.category || 'General',
        public_id: null,
      });

      alert('Uploaded!');
      setFile(null);
      setAspectRatio(null);
      setFormData({ category: 'General' });
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + (err?.response?.data?.error || err?.message || 'unknown'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] px-4">
      <h2 className="text-3xl font-light mb-8">Admin Control Panel</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 bg-white p-6 rounded-xl shadow">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          required
        />

        {imagePreviewUrl && (
          <div className="w-full">
            <p className="text-sm text-zinc-600 mb-2">Preview</p>
            <img
              src={imagePreviewUrl}
              alt="preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
          </div>
        )}

        <div>
          <label className="text-sm text-zinc-600">Aspect Ratio (Width/Height)</label>
          <div className="mt-1">
            <input
              type="text"
              readOnly
              value={aspectRatio ? aspectRatio.toFixed(3) : ''}
              placeholder="Auto"
              className="w-full p-2 border rounded bg-zinc-50"
            />
          </div>
        </div>

        <input
          type="text"
          placeholder="Category (optional)"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={busy}
          className="w-full px-8 py-3 bg-black text-white rounded-full hover:bg-zinc-800 transition-all disabled:opacity-60"
        >
          {busy ? 'Uploading...' : 'Upload New Memory'}
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;

