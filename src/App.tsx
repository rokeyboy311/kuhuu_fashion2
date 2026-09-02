import { motion } from 'motion/react';
import { ArrowRight, Leaf, Sparkles, Feather } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A28] font-sans antialiased selection:bg-[#E8DCC4] selection:text-[#2C2A28]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex justify-between items-center backdrop-blur-md bg-[#FDFBF7]/80">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl font-serif tracking-tight"
        >
          Kuhuu
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="hidden md:flex gap-8 text-sm font-medium tracking-wide uppercase text-[#5C5955]"
        >
          <a href="#about" className="hover:text-[#2C2A28] transition-colors">About</a>
          <a href="#work" className="hover:text-[#2C2A28] transition-colors">Work</a>
          <a href="#contact" className="hover:text-[#2C2A28] transition-colors">Contact</a>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 px-6 md:px-12 overflow-hidden">
        {/* Decorative ambient blobs */}
        <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] bg-[#F2EAE1] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-[10%] left-[20%] w-[30vw] h-[30vw] bg-[#EBE9E1] rounded-full mix-blend-multiply filter blur-3xl opacity-60" />

        <div className="max-w-5xl mx-auto relative z-10 w-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-serif text-6xl md:text-8xl lg:text-[140px] leading-[1.05] tracking-tight mb-8">
              The sweet note <br />
              <span className="italic text-[#7A756C]">of the bird.</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="md:w-1/2 md:ml-auto"
          >
            <p className="text-lg md:text-xl text-[#5C5955] leading-relaxed mb-10">
              Kuhuu is a creative studio dedicated to grace, purity, and the beauty of new beginnings. We craft elegant digital experiences rooted in nature's calm rhythm.
            </p>
            <button className="group flex items-center gap-4 text-sm uppercase tracking-widest font-semibold border-b border-[#2C2A28] pb-2 hover:text-[#7A756C] hover:border-[#7A756C] transition-all">
              Explore our world
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="about" className="py-32 px-6 md:px-12 bg-[#2C2A28] text-[#FDFBF7]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="aspect-[4/5] bg-[#3C3A38] rounded-tl-[120px] rounded-br-[120px] overflow-hidden relative"
          >
            {/* Elegant placeholder texture/image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3C3A38] to-[#5C5955] opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="w-32 h-32 text-[#FDFBF7]/20" strokeWidth={1} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
              Inspired by the melody of springtime.
            </h2>
            <p className="text-[#B3B0A8] text-lg leading-relaxed mb-8">
              In Sanskrit, Kuhu represents the melodious call of the cuckoo bird—a messenger of love, joy, and the arrival of spring. We carry this philosophy into every project, bringing freshness, elegance, and harmonious design to everything we create.
            </p>
            <p className="text-[#B3B0A8] text-lg leading-relaxed mb-12">
              Our approach is minimalist yet deeply resonant, ensuring that every detail has purpose and every interaction feels effortless.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <Sparkles className="w-6 h-6 mb-4 text-[#E8DCC4]" />
                <h3 className="font-serif text-xl mb-2">Grace</h3>
                <p className="text-sm text-[#8C8983]">Refined aesthetics with an emphasis on subtle elegance.</p>
              </div>
              <div>
                <Feather className="w-6 h-6 mb-4 text-[#E8DCC4]" />
                <h3 className="font-serif text-xl mb-2">Purity</h3>
                <p className="text-sm text-[#8C8983]">Stripping away the unnecessary to reveal the essential core.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services/Offerings */}
      <section id="work" className="py-32 px-6 md:px-12 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight md:w-1/2">
              Our creative disciplines.
            </h2>
            <p className="text-[#5C5955] mt-6 md:mt-0 md:w-1/3">
              We specialize in bringing sophisticated concepts to life through meticulous craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Brand Identity',
                desc: 'Crafting timeless visual identities that capture the true essence of your vision.',
                number: '01'
              },
              {
                title: 'Digital Experience',
                desc: 'Designing serene, intuitive websites and applications with fluid interactions.',
                number: '02'
              },
              {
                title: 'Art Direction',
                desc: 'Curating photographic and visual styles that evoke emotion and tranquility.',
                number: '03'
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="group border border-[#E8DCC4] p-10 hover:bg-[#F2EAE1] transition-colors duration-500 rounded-3xl"
              >
                <div className="text-sm font-medium text-[#A69F94] mb-12">{item.number}</div>
                <h3 className="font-serif text-2xl mb-4 group-hover:text-[#7A756C] transition-colors">{item.title}</h3>
                <p className="text-[#5C5955] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#EBE9E1] py-24 px-6 md:px-12 rounded-t-[40px] md:rounded-t-[80px]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="md:w-1/2">
            <h2 className="font-serif text-5xl md:text-7xl mb-6">Let's create <br/> something beautiful.</h2>
            <p className="text-[#5C5955] text-lg mb-10">Reach out to begin the conversation.</p>
            <button className="bg-[#2C2A28] text-[#FDFBF7] px-8 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-[#5C5955] transition-colors">
              hello@kuhuu.studio
            </button>
          </div>
          
          <div className="md:w-1/3 flex flex-col gap-6">
            <div className="font-serif text-2xl mb-4">Kuhuu</div>
            <div className="flex flex-col gap-2 text-[#5C5955] text-sm">
              <a href="#" className="hover:text-[#2C2A28] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#2C2A28] transition-colors">Twitter (X)</a>
              <a href="#" className="hover:text-[#2C2A28] transition-colors">LinkedIn</a>
            </div>
            <div className="mt-8 text-xs text-[#A69F94]">
              &copy; {new Date().getFullYear()} Kuhuu Studio. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
