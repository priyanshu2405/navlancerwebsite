import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ContractManagement from '../components/contracts/ContractManagement';
import { motion } from 'framer-motion';

const ContractDetails = () => {
    const { contractId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm uppercase tracking-widest">Back</span>
                </button>

                <h1 className="text-3xl font-extrabold tracking-tight">
                    Contract Management
                </h1>
                <p className="text-text-muted mt-2">
                    View contract details and manage status
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <ContractManagement contractId={contractId} />
            </motion.div>
        </div>
    );
};

export default ContractDetails;
