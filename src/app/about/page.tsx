'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import './about.css';

export default function AboutPage() {
  return (
    <div className="relative bg-gradient-to-b from-black via-[#0c0c0c] to-[#121212] text-white min-h-screen overflow-hidden">
      {/* Starfield Background */}
      <div className="stars"></div>
      <div className="twinkling"></div>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <h1 className="text-5xl font-bold text-[#00ffc3] drop-shadow-glow mb-6">
            Welcome to OrbitOps
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            We're a team of curious aliens, building tech to manage your galaxy’s projects with style.
          </p>
          <div className="flex justify-center">
            <Image
              src="/images/green-ufo.png"
              alt="Spaceship"
              width={150}
              height={50}
              className="animate-float"
            />
          </div>
        </motion.div>
      </section>

      {/* Team Cards */}
      <section className="relative z-10 mt-16 px-6 max-w-3xl mx-auto text-center text-gray-100">
  
  <p className="mb-6 text-lg md:text-xl text-gray-300">
    We’re not just developers — we’re starwalkers coding through the cosmos.  
    Every line of code, a constellation. Every feature, a moonshot.
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
    <div className="bg-white bg-opacity-5 p-6 rounded-lg backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-2xl transition">
      
      
    </div>
    
    <div className="bg-white bg-opacity-5 p-6 rounded-lg backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-2xl transition">
      
      <p className="text-gray-300">
        Always pushing boundaries, diving into new tech stacks and frameworks like it's light speed.
      </p>
    </div>
    
  </div>
  
</section>


      {/* Timeline */}
      <section className="relative z-10 py-20 px-6 bg-[#101010] bg-opacity-60 backdrop-blur">
        <h2 className="text-3xl text-center text-[#00ffc3] mb-12 font-semibold">Galactic Timeline</h2>
        <div className="max-w-3xl mx-auto space-y-10">
          {[
            '2022: Crash landed on Earth.',
            '2023: Invented team management system from old alien tech.',
            '2024: Released OrbitOps to the galaxy.',
          ].map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-[#1a1a1a] rounded-md p-4 border border-gray-700 text-gray-300"
            >
              {event}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Icons */}
      <section className="relative z-10 py-20 px-6 text-center">
        <h2 className="text-3xl text-[#00ffc3] font-bold mb-8">Powered by Alien Tech</h2>
        <div className="flex justify-center gap-10 flex-wrap">
          {['🛸', '👾', '🚀', '🧠', '🪐'].map((icon, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.2, rotate: 10 }}
              className="text-5xl transition-all duration-300"
            >
              {icon}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
