import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SectionReveal from "../components/SectionReveal";

const team = [
  {
    name: "Ahmed Raza",
    role: "CEO & Founder",
    initial: "A",
    icon: "solar:verified-check-bold",
    color: "from-purple-600 to-violet-600",
  },
  {
    name: "Sara Malik",
    role: "Head of Product",
    initial: "S",
    icon: "solar:verified-check-bold",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Bilal Khan",
    role: "Lead Developer",
    initial: "B",
    icon: "solar:verified-check-bold",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Zara Ahmed",
    role: "Marketing Lead",
    initial: "Z",
    icon: "solar:verified-check-bold",
    color: "from-emerald-500 to-green-500",
  },
];
//done updated
const values = [
  {
    icon: "solar:shield-check-bold",
    title: "Trust & Transparency",
    desc: "We create a trusted ecosystem where creators and brands collaborate with confidence and complete transparency.",
    tag: "Core",
  },
  {
    icon: "solar:bolt-bold",
    title: "Fast Collaboration",
    desc: "From posting opportunities to closing deals, every step is designed to be fast, smooth, and efficient.",
    tag: "Speed",
  },
  {
    icon: "solar:wallet-money-bold",
    title: "Fair Payments",
    desc: "Our secure payment process ensures creators receive payments on time while brands pay with confidence.",
    tag: "Payments",
  },
  {
    icon: "solar:rocket-bold",
    title: "Growth Together",
    desc: "We believe creators and brands achieve greater success when they grow together on one platform.",
    tag: "Growth",
  },
];
const valueTagColors = {
  Core: "bg-primary-light text-primary",
  Speed: "bg-yellow-50 text-yellow-700",
  Payments: "bg-green-50 text-green-700",
  Growth: "bg-blue-50 text-blue-700",
};
//
export default function About() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [stats, setStats] = useState({
    creators: 0,
    brands: 0,
    collaborations: 0,
  });
  useEffect(() => {
    if (!inView) return;

    let creators = 0;
    let brands = 0;
    let collaborations = 0;

    const interval = setInterval(() => {
      creators += 10;
      brands += 5;
      collaborations += 20;

      setStats({
        creators: creators >= 500 ? 500 : creators,
        brands: brands >= 200 ? 200 : brands,
        collaborations: collaborations >= 1000 ? 1000 : collaborations,
      });

      if (creators >= 500 && brands >= 200 && collaborations >= 1000) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [inView]);
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Header */}
      <section className="relative pt-28 pb-24 overflow-hidden bg-gradient-to-b from-purple-50/50 via-white to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-300/20 blur-3xl rounded-full" />
        <div className="relative max-w-6xl px-4 mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-bold tracking-widest uppercase border rounded-full bg-purple-100/80 text-purple-700 border-purple-200">
            <Icon icon="solar:buildings-bold" className="text-base" />
            About Trendora
          </div>
          <motion.h1 className="mb-6 text-5xl font-black tracking-tight text-gray-900 md:text-6xl">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mr-3"
            >
              About
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600"
            >
              Trendora
            </motion.span>
          </motion.h1>
          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-600">
            Trendora was built to solve a real problem — creators in Pakistan
            struggle to find brand deals, and brands struggle to find the right
            creators. We fix that.
          </p>
        </div>
      </section>

      {/* Mission */}
      <SectionReveal>
        <section className="py-16 ">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6">
              Our Mission
            </h2>
            <p className="text-muted text-base md:text-lg leading-relaxed">
              To empower Pakistani content creators by connecting them with
              brands that value their work — through a safe, transparent, and
              efficient platform that handles everything from negotiation to
              payment.
            </p>
          </div>
        </section>
      </SectionReveal>

      {/* Values */}
      <SectionReveal>
        <section className="py-16 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary text-center mb-10">
              Our Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="
    group
    relative
    overflow-hidden
    bg-white
    rounded-3xl
    p-7
    border
    border-purple-100
    shadow-sm
    hover:shadow-2xl
    hover:border-purple-300
    hover:-translate-y-2
    transition-all
    duration-500
  "
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-purple-100 transition-all duration-300">
                      <Icon
                        icon={v.icon}
                        className="text-3xl text-purple-600 group-hover:scale-125 transition-all duration-500"
                      />
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${valueTagColors[v.tag]}`}
                    >
                      {v.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-secondary mb-2">{v.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Team */}
      <SectionReveal>
        <section className="py-16 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary text-center mb-10">
              Meet the Team
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((t, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  className="
    bg-white
    rounded-3xl
    p-7
    border
    border-purple-100
    shadow-sm
    hover:shadow-2xl
    transition-all
    duration-500
    text-center
  "
                >
                  <div
                    className={`
    w-20
    h-20
    rounded-3xl
    bg-gradient-to-br
    ${t.color}
    flex
    items-center
    justify-center
    text-white
    text-3xl
    font-black
    mx-auto
    mb-5
    shadow-lg
  `}
                  >
                    {" "}
                    {t.initial}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="font-black text-gray-900">{t.name}</h3>

                    <Icon icon={t.icon} className="text-lg text-purple-600" />
                  </div>
                  <p className="text-xs text-muted mt-1">{t.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* CTA */}
      <SectionReveal>
        <section className="py-16 bg-gradient-section">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Join the Trendora Family
            </h2>
            <p className="text-purple-200 mb-8">
              Be part of Pakistan's fastest growing creator economy platform.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-purple-50 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </section>
      </SectionReveal>
      <Footer />
    </div>
  );
}
