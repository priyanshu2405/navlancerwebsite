import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Code, Palette, Megaphone, PenTool, Headphones, Landmark, Scale, Users, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';


const services = [
    {
        icon: <BrainCircuit size={28} />,
        title: "AI Services",
        desc: "AI development, machine learning, and automation solutions."
    },
    {
        icon: <Code size={28} />,
        title: "Development & IT",
        desc: "Software, web, and mobile app development services."
    },
    {
        icon: <Palette size={28} />,
        title: "Design & Creative",
        desc: "Brand identity, web design, and creative direction."
    },
    {
        icon: <Megaphone size={28} />,
        title: "Sales & Marketing",
        desc: "Digital marketing, SEO, and sales strategies."
    },
    {
        icon: <PenTool size={28} />,
        title: "Writing & Translation",
        desc: "Content writing, translation, and editorial services."
    },
    {
        icon: <Headphones size={28} />,
        title: "Admin & Support",
        desc: "Virtual assistance, customer support, and data entry."
    },
    {
        icon: <Landmark size={28} />,
        title: "Finance & Accounting",
        desc: "Accounting, financial planning, and business analysis."
    },
    {
        icon: <Scale size={28} />,
        title: "Legal",
        desc: "Legal consulting, contract review, and compliance."
    },
    {
        icon: <Users size={28} />,
        title: "HR & Training",
        desc: "Recruitment, human resources, and corporate training."
    },
    {
        icon: <Wrench size={28} />,
        title: "Engineering & Architecture",
        desc: "CAD design, engineering, and architectural planning."
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
};

const Services = () => {
    return (
        <section className="py-20 px-[5%] relative z-10">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-[2.5rem] font-bold mb-4">Services</h2>
            </div>

            <motion.div
                className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
            >
                {services.map((service, index) => (
                    <motion.div key={index} className="bg-white/[0.03] border border-white/10 rounded-[20px] p-10 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] cursor-pointer relative overflow-hidden flex flex-col justify-between h-[280px] hover:border-primary hover:shadow-[0_0_30px_rgba(204,255,0,0.15),inset_0_0_20px_rgba(204,255,0,0.05)] hover:-translate-y-[5px] hover:bg-white/5 group" variants={item}>
                        <div className="w-[60px] h-[60px] rounded-xl border border-primary flex items-center justify-center mb-6 text-primary bg-[rgba(204,255,0,0.05)] transition-all duration-300 group-hover:bg-primary group-hover:text-black group-hover:shadow-[0_0_15px_rgba(204,255,0,0.5)]">
                            {service.icon}
                        </div>
                        <div>
                            <h3 className="text-[1.25rem] font-semibold mb-3">{service.title}</h3>
                            <p className="text-[0.9rem] text-text-muted leading-[1.5]">{service.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );

    
};

export default Services;
