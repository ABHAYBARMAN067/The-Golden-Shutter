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
      alert(
        'Upload failed: ' +
          (err?.response?.data?.error || err?.message || 'unknown')
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[80vh] px-4 py-14 bg-black text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-3 text-amber-300/90 text-xs tracking-widest uppercase mb-4">
            <span className="h-px w-12 bg-amber-400/60" />
            Admin Control Panel
          </div>
          <h2 className="font-serif italic text-4xl">Upload your next memory</h2>
          <p className="text-white/70 mt-3 max-w-2xl text-sm leading-relaxed">
            Keep your portfolio cinematic. Upload images and categorize them for the
            gallery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Preview card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="text-amber-300 text-xs tracking-widest uppercase">Preview</div>
              <div className="text-white/80 text-sm mt-2">
                Upload an image to see its preview.
              </div>
            </div>

            <div className="p-6">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="preview"
                    className="w-full h-80 object-cover"
                  />
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                        <span className="text-amber-300 text-xl">+</span>
                      </div>
                      <div className="text-white/70 text-sm mt-3">No image selected</div>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-amber-300 text-xs tracking-widest uppercase">Aspect Ratio</div>
                  <div className="mt-2 text-white/90 font-medium text-sm">
                    {aspectRatio ? aspectRatio.toFixed(3) : '—'}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-amber-300 text-xs tracking-widest uppercase">Status</div>
                  <div className="mt-2 text-white/90 font-medium text-sm">
                    {busy ? 'Uploading...' : imagePreviewUrl ? 'Ready' : 'Waiting'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload form */}
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 lg:p-7"
          >
            <div>
              <label className="block text-sm text-white/80 mb-2" htmlFor="file">
                Upload image
              </label>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-white/10 rounded-2xl bg-black/20"
                required
              />
            </div>

            {imagePreviewUrl && (
              <div>
                <div className="text-sm text-white/70 mb-2">Selected</div>
                <div className="rounded-2xl border border-white/10 overflow-hidden">
                  <img
                    src={imagePreviewUrl}
                    alt="selected"
                    className="w-full h-44 object-cover"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-white/80 mb-2">
                Aspect Ratio (Width/Height)
              </label>
              <input
                type="text"
                readOnly
                value={aspectRatio ? aspectRatio.toFixed(3) : ''}
                placeholder="Auto"
                className="w-full p-3 border border-white/10 rounded-2xl bg-black/20"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">Category (optional)</label>
              <input
                type="text"
                placeholder="General"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-white/10 rounded-2xl bg-black/20"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full px-8 py-3 bg-amber-400 text-black rounded-full hover:bg-amber-300 transition-all disabled:opacity-60 font-semibold"
            >
              {busy ? 'Uploading...' : 'Upload New Memory'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

