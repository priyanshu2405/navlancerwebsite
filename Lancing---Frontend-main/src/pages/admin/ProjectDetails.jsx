import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, 
    CheckCircle2, 
    XCircle, 
    Edit, 
    Trash2, 
    Briefcase,
    Calendar,
    User,
    Tag,
    Clock,
    DollarSign,
    MessageSquare,
    FileText
} from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data for project detail
    const project = {
        id: id || 'JH-9021',
        title: 'Senior React Developer',
        client: 'Acme Corp',
        category: 'Development',
        budget: 5000,
        proposals: 12,
        postedDate: '2026-03-10',
        status: 'Open',
        description: 'We are looking for a senior React developer to build a modern dashboard for our analytics platform. The ideal candidate should have 5+ years of experience with React, Redux, and Tailwind CSS.',
        skills: ['React', 'Node.js', 'Tailwind CSS', 'Redux'],
        clientRating: 4.8,
        totalSpent: 45000
    };

    const handleApprove = () => {
        alert('Project Approved');
    };

    const handleReject = () => {
        alert('Project Rejected');
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-4"
            >
                <ChevronLeft size={20} />
                Back to Projects
            </button>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 space-y-6 shadow-2xl">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Briefcase className="text-primary" />
                            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                        </div>
                        <p className="text-text-muted font-mono uppercase tracking-tighter">ID: {project.id}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                        project.status === 'Open' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        'bg-primary/10 text-primary border-primary/20'
                    }`}>
                        {project.status}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-white/5">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Client</p>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{project.client}</span>
                            <span className="text-[10px] text-primary">★ {project.clientRating}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Budget</p>
                        <p className="text-white font-medium">₹{project.budget.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Posted On</p>
                        <p className="text-white font-medium">{project.postedDate}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText size={18} className="text-primary" />
                        Project Description
                    </h2>
                    <p className="text-text-muted leading-relaxed">
                        {project.description}
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Tag size={18} className="text-primary" />
                        Required Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {project.skills.map(skill => (
                            <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-text-muted">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Admin Actions */}
                <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4">
                    <button 
                        onClick={handleApprove}
                        className="flex items-center gap-2 px-6 py-2.5 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all shadow-lg shadow-green-500/20"
                    >
                        <CheckCircle2 size={18} /> Approve Project
                    </button>
                    <button 
                        onClick={handleReject}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                    >
                        <XCircle size={18} /> Reject Project
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                        <Edit size={18} /> Edit Listing
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-red-500 font-bold rounded-xl border border-red-500/20 hover:bg-red-500/5 transition-all ml-auto">
                        <Trash2 size={18} /> Delete Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
