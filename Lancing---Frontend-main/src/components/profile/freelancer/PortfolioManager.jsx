import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2, Image, GripVertical, Loader2 } from 'lucide-react';
import { useFreelancerProfile } from '../../../hooks/useFreelancerProfile';
import { MEDIA_BASE_URL } from '../../../config/api';

const PortfolioManager = ({ portfolio, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', file: null, preview: null });
    const { addPortfolioItem, deletePortfolioItem, loading } = useFreelancerProfile();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewItem({
                ...newItem,
                file,
                preview: URL.createObjectURL(file)
            });
        }
    };

    const handleAdd = async () => {
        if (!newItem.title || !newItem.file) return;

        const formData = new FormData();
        formData.append('title', newItem.title);
        formData.append('file', newItem.file);

        const result = await addPortfolioItem(formData);
        if (result.success) {
            onUpdate();
            setIsAdding(false);
            setNewItem({ title: '', file: null, preview: null });
        } else {
            alert(result.error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        const result = await deletePortfolioItem(id);
        if (result.success) {
            onUpdate();
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Portfolio</h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-bold uppercase tracking-wider"
                >
                    <Plus size={16} /> Add Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {/* New Item Form */}
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4"
                        >
                            <div className="aspect-video bg-black/20 rounded-xl flex items-center justify-center overflow-hidden border border-white/5 relative group">
                                {newItem.preview ? (
                                    <img src={newItem.preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full hover:bg-white/5 transition-colors">
                                        <Image size={24} className="text-text-muted mb-2" />
                                        <span className="text-xs text-text-muted">Click to upload</span>
                                        <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
                                    </label>
                                )}
                                {newItem.preview && (
                                    <button
                                        onClick={() => setNewItem({ ...newItem, file: null, preview: null })}
                                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-red-500/50 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            <input
                                type="text"
                                placeholder="Project Title"
                                value={newItem.title}
                                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium outline-none focus:border-primary transition-all"
                            />

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-2 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdd}
                                    disabled={!newItem.title || !newItem.file || loading}
                                    className="flex-1 py-2 bg-primary text-black rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {loading ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Save'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Existing Items */}
                    {portfolio?.map((item) => (
                        <motion.div
                            key={item._id || item.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                        >
                            <div className="aspect-video bg-black/20 relative">
                                {item.fileUrl && (
                                    <img
                                        src={item.fileUrl.startsWith('http') ? item.fileUrl : `${MEDIA_BASE_URL}${item.fileUrl}`}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleDelete(item._id || item.id)}
                                        className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-white truncate">{item.title}</h4>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {!portfolio?.length && !isAdding && (
                <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-2xl">
                    <p className="text-text-muted text-sm">No portfolio items yet. Show off your best work!</p>
                </div>
            )}
        </div>
    );
};

export default PortfolioManager;
