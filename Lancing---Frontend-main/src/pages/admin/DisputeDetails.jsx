import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, 
    MessageSquare, 
    ShieldAlert, 
    User, 
    DollarSign, 
    CheckCircle2, 
    XCircle,
    Scale,
    History,
    FileText,
    ExternalLink
} from 'lucide-react';

const DisputeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resolution, setResolution] = useState('');

    // Mock data for dispute detail
    const dispute = {
        id: id || 'DISP-7721',
        projectTitle: 'Senior React Developer',
        projectId: 'JH-9021',
        client: 'Acme Corp',
        freelancer: 'John Doe',
        amount: 2500,
        status: 'Open',
        reason: 'Client claims work is incomplete and doesn\'t match specifications.',
        openedDate: '2026-03-15',
        chatHistory: [
            { sender: 'Client', text: 'The dashboard is missing the export feature we discussed.', timestamp: '2026-03-15 10:00 AM' },
            { sender: 'Freelancer', text: 'The export feature was not in the original scope. I can add it for an extra ₹500.', timestamp: '2026-03-15 11:30 AM' },
            { sender: 'Client', text: 'It was mentioned in our initial chat. I won\'t pay until it\'s included.', timestamp: '2026-03-15 12:15 PM' },
        ],
        evidence: [
            { title: 'Project Specification.pdf', size: '1.2 MB' },
            { title: 'Chat Screenshot 1.png', size: '450 KB' },
        ]
    };

    const handleResolve = (decision) => {
        alert(`Dispute resolved: ${decision}`);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-4"
            >
                <ChevronLeft size={20} />
                Back to Disputes
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Dispute Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="text-red-500" />
                                    <h1 className="text-2xl font-bold text-white">Dispute {dispute.id}</h1>
                                </div>
                                <p className="text-sm text-text-muted">Case opened on {dispute.openedDate}</p>
                            </div>
                            <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-black uppercase">
                                {dispute.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-4 bg-white/[0.01] rounded-xl border border-white/5">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Client</p>
                                <p className="text-white font-medium">{dispute.client}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Freelancer</p>
                                <p className="text-white font-medium">{dispute.freelancer}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Project</p>
                                <p className="text-primary font-medium flex items-center gap-1 cursor-pointer hover:underline">
                                    {dispute.projectTitle} <ExternalLink size={12} />
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Disputed Amount</p>
                                <p className="text-white font-bold">₹{dispute.amount.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <FileText size={16} className="text-primary" />
                                Reason for Dispute
                            </h3>
                            <p className="text-sm text-text-muted leading-relaxed italic bg-white/[0.02] p-4 rounded-xl border border-white/5">
                                "{dispute.reason}"
                            </p>
                        </div>

                        {/* Chat History */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <MessageSquare size={16} className="text-primary" />
                                Chat History
                            </h3>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {dispute.chatHistory.map((msg, i) => (
                                    <div key={i} className={`p-3 rounded-xl border ${msg.sender === 'Client' ? 'bg-primary/5 border-primary/10' : 'bg-white/5 border-white/10'}`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-[10px] font-black uppercase ${msg.sender === 'Client' ? 'text-primary' : 'text-text-muted'}`}>{msg.sender}</span>
                                            <span className="text-[10px] text-text-muted">{msg.timestamp}</span>
                                        </div>
                                        <p className="text-sm text-white/80">{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Resolution Tools */}
                <div className="space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6 sticky top-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Scale size={20} className="text-primary" />
                            Admin Resolution
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Internal Notes</label>
                                <textarea 
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 min-h-[120px]"
                                    placeholder="Briefly state why this decision is being made..."
                                    value={resolution}
                                    onChange={(e) => setResolution(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <button 
                                    onClick={() => handleResolve('Refund Client')}
                                    className="w-full py-2.5 bg-zinc-900 text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    <XCircle size={16} className="text-red-500" /> Full Refund to Client
                                </button>
                                <button 
                                    onClick={() => handleResolve('Pay Freelancer')}
                                    className="w-full py-2.5 bg-zinc-900 text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={16} className="text-green-500" /> Release to Freelancer
                                </button>
                                <button 
                                    onClick={() => handleResolve('Split Payment')}
                                    className="w-full py-2.5 bg-primary text-black rounded-xl hover:bg-primary/90 transition-all text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    <Scale size={16} /> Partial Payment (Split)
                                </button>
                            </div>

                            <p className="text-[10px] text-text-muted italic text-center">
                                All resolution decisions are final and will notify both parties.
                            </p>
                        </div>

                        {/* Evidence Files */}
                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Evidence Submitted</h4>
                            <div className="space-y-2">
                                {dispute.evidence.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-text-muted" />
                                            <div className="flex flex-col">
                                                <span className="text-xs text-white truncate max-w-[150px]">{file.title}</span>
                                                <span className="text-[10px] text-text-muted">{file.size}</span>
                                            </div>
                                        </div>
                                        <ExternalLink size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisputeDetails;
