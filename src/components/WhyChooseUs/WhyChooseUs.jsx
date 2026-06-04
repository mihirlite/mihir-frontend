import React from 'react'
import { MdOutlineDeliveryDining, MdOutlineVerifiedUser } from "react-icons/md";
import { BiLeaf } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";

const features = [
    {
        icon: <MdOutlineDeliveryDining />,
        number: "01",
        title: "Fast Delivery",
        description: "Lightning-fast delivery straight to your door — hot, fresh, and right on time.",
        color: "from-orange-500 to-amber-400",
        glow: "shadow-orange-400/30",
        lightBg: "bg-orange-50",
        accent: "#f97316",
    },
    {
        icon: <BiLeaf />,
        number: "02",
        title: "Fresh Ingredients",
        description: "Every meal crafted with hand-picked, farm-fresh ingredients — zero compromise.",
        color: "from-emerald-500 to-teal-400",
        glow: "shadow-emerald-400/30",
        lightBg: "bg-emerald-50",
        accent: "#10b981",
    },
    {
        icon: <MdOutlineVerifiedUser />,
        number: "03",
        title: "Secure Payments",
        description: "Bank-grade encryption on every transaction — shop with complete confidence.",
        color: "from-blue-500 to-sky-400",
        glow: "shadow-blue-400/30",
        lightBg: "bg-blue-50",
        accent: "#3b82f6",
    },
    {
        icon: <AiFillStar />,
        number: "04",
        title: "4.8★ Rated Service",
        description: "Trusted by thousands of happy customers who keep coming back for more.",
        color: "from-yellow-400 to-orange-400",
        glow: "shadow-yellow-400/30",
        lightBg: "bg-yellow-50",
        accent: "#f59e0b",
    },
];

const WhyChooseUs = () => {
    return (
        <section
            id="why-choose-us"
            className="relative w-full py-16 md:py-24 overflow-hidden bg-[#0f0f0f]"
        >
            {/* Decorative background orbs */}
            <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-400/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-[92%] sm:w-[88%] md:w-[85%] lg:w-[80%] mx-auto">

                {/* ── Section Header ── */}
                <div className="text-center mb-12 md:mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-4">
                        Our Promise
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
                        Why Choose{" "}
                        <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                            FlavoHub?
                        </span>
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-amber-400 mx-auto rounded-full mb-5" />
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                        We don't just deliver food — we deliver experiences that keep you coming back.
                    </p>
                </div>

                {/* ── Feature Cards Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group relative flex flex-col p-6 md:p-7 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${feature.glow} overflow-hidden`}
                        >
                            {/* Big faded number watermark */}
                            <span
                                className="absolute -top-3 -right-1 text-[6rem] md:text-[7rem] font-black leading-none select-none opacity-[0.04] text-white"
                                aria-hidden="true"
                            >
                                {feature.number}
                            </span>

                            {/* Top accent bar */}
                            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-3xl`} />

                            {/* ── Mobile: horizontal icon+number row ── */}
                            <div className="flex flex-col sm:block items-center sm:items-start gap-4 mb-4 sm:mb-0">
                                {/* Icon pill */}
                                <div
                                    className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 sm:mb-5 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl sm:text-3xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
                                >
                                    {feature.icon}
                                </div>

                                {/* On mobile: title sits below icon */}
                                <h3 className="text-lg font-bold text-white sm:hidden group-hover:text-orange-300 transition-colors duration-300 text-center">
                                    {feature.title}
                                </h3>
                            </div>

                            {/* Title (visible on sm+) */}
                            <h3 className="hidden sm:block text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">
                                {feature.title}
                            </h3>

                            {/* Divider */}
                            <div className={`w-8 h-0.5 bg-gradient-to-r ${feature.color} mb-3 rounded-full mx-auto sm:mx-0`} />

                            {/* Description */}
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300 flex-1 text-center sm:text-left">
                                {feature.description}
                            </p>

                            {/* Bottom tag */}
                            <div className="mt-5 flex items-center justify-center sm:justify-start gap-2">
                                <span
                                    className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                                    style={{
                                        backgroundColor: `${feature.accent}18`,
                                        color: feature.accent,
                                        border: `1px solid ${feature.accent}30`,
                                    }}
                                >
                                    {feature.number}
                                </span>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
