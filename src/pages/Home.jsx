import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SectionReveal from "../components/SectionReveal";
import { Icon } from "@iconify/react";

const features = [
  {
    icon: "solar:target-bold",
    title: "Smart Matching",
    desc: "AI-powered brand-creator matching based on niche, audience, and budget.",
  },
  {
    icon: "solar:chat-round-dots-bold",
    title: "Private Chat",
    desc: "Secure chat unlocks only after collaboration is confirmed.",
  },
  {
    icon: "solar:wallet-money-bold",
    title: "Safe Payments",
    desc: "Escrow system ensures creators get paid and brands get results.",
  },
  {
    icon: "solar:chart-2-bold",
    title: "Analytics",
    desc: "Track campaign performance and creator engagement in real time.",
  },
  {
    icon: "solar:shield-check-bold",
    title: "Verified Profiles",
    desc: "All creators and brands go through a verification process.",
  },
  {
    icon: "solar:bolt-bold",
    title: "Fast Collaboration",
    desc: "From opportunity post to collaboration in minutes, not days.",
  },
];

const steps = [
  {
    step: "01",
    title: "Brand Posts Opportunity",
    desc: "Brand creates a campaign with budget, deadline, and requirements.",
  },
  {
    step: "02",
    title: "Creators Apply",
    desc: "Creators browse and apply, accept, or send counter offers.",
  },
  {
    step: "03",
    title: "Collaboration Starts",
    desc: "Once both agree, chat unlocks and work begins.",
  },
  {
    step: "04",
    title: "Payment Released",
    desc: "After approval, platform releases payment to creator automatically.",
  },
];

const creators = [
  {
    name: "Ayesha Khan",
    category: "Lifestyle",
    followers: "245K",
    platform: "Instagram",
    rank: "#1",
    verified: true,
    avatar: "AK",
  },
  {
    name: "Bilal Chaudhry",
    category: "Tech",
    followers: "189K",
    platform: "YouTube",
    rank: "#2",
    verified: true,
    avatar: "BC",
  },
  {
    name: "Sara Ahmed",
    category: "Fashion",
    followers: "312K",
    platform: "TikTok",
    rank: "#3",
    verified: true,
    avatar: "SA",
  },
  {
    name: "Usman Malik",
    category: "Food",
    followers: "98K",
    platform: "Instagram",
    rank: "#4",
    verified: true,
    avatar: "UM",
  },
];
export default function Home() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const [counts, setCounts] = useState({
    creators: 0,
    brands: 0,
    paid: 0,
  });

  useEffect(() => {
    if (!inView) return;

    let creators = 0;
    let brands = 0;
    let paid = 0;

    const interval = setInterval(() => {
      creators += 10;
      brands += 5;
      paid += 0.05;

      setCounts({
        creators: creators >= 500 ? 500 : creators,
        brands: brands >= 200 ? 200 : brands,
        paid: paid >= 2 ? 2 : Number(paid.toFixed(2)),
      });

      if (creators >= 500 && brands >= 200 && paid >= 2) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [inView]);

  const platformIcons = {
    Instagram: "ri:instagram-fill",
    YouTube: "ri:youtube-fill",
    TikTok: "ic:baseline-tiktok",
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-20 ">
        <div className="max-w-6xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-bold tracking-wider text-purple-700 uppercase transition-all duration-300 border border-purple-200 rounded-full shadow-sm bg-purple-100/80 hover:shadow-md hover:scale-105">
            ✨ Pakistan's #1 Creator Platform
          </span>
          <motion.h1 className="mb-6 text-5xl font-black tracking-tight text-gray-900 md:text-6xl leading-[1.1]">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              Create.
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="inline-block"
            >
              Connect.
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800"
            >
              Grow.
            </motion.span>
          </motion.h1>
          <p className="max-w-3xl mx-auto mb-10 text-xl leading-relaxed text-gray-600">
            Trendora connects brands with top creators for seamless
            collaborations. Post opportunities, negotiate deals, and grow
            together.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="px-8 py-4 font-semibold text-white transition-all duration-300 shadow-lg rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 hover:-translate-y-1 hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/opportunities"
              className="px-8 py-4 font-semibold text-purple-700 transition-all duration-300 border-2 border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-400 hover:-translate-y-1 hover:scale-105"
            >
              Browse Opportunities
            </Link>
          </div>

          {/* Stats */}
          <div
            ref={ref}
            className="grid max-w-lg grid-cols-3 gap-4 mx-auto mt-16 sm:gap-6"
          >
            {[
              {
                value: counts.creators,
                suffix: "+",
                label: "Active Creators",
              },
              { value: counts.brands, suffix: "+", label: "Brands" },
              {
                value: counts.paid,
                prefix: "PKR ",
                suffix: "M+",
                label: "Paid Out",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-purple-700 sm:text-3xl whitespace-nowrap">
                  {stat.prefix || ""}
                  {stat.value}
                  {stat.suffix || ""}
                </div>
                <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionReveal>
        {/* How It Works */}
        <section className="py-20">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="mb-4 text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
                How Trendora Works
              </h2>
              <p className="text-gray-500">
                Connect with brands, secure collaborations, and get paid in just
                four simple steps.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    y: -10,
                  }}
                  className="relative p-6 transition-all duration-300 bg-white border border-purple-100 shadow-sm rounded-3xl hover:shadow-xl"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.15,
                      rotate: -4,
                      y: -5,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 12,
                    }}
                    className="inline-block mb-4 text-5xl font-black text-purple-300 cursor-pointer"
                  >
                    {s.step}
                  </motion.div>
                  <h3 className="mb-2 text-base font-bold text-gray-900">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {s.desc}
                  </p>
                  {i < steps.length - 1 && (
                    <div className="absolute right-0 hidden text-2xl text-purple-300 translate-x-1/2 md:block top-6">
                      ➜
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        {/* Features */}
        <section className="py-20 ">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="text-center mb-16">
                <span className="inline-flex items-center px-4 py-2 mb-5 text-xs font-bold tracking-wider uppercase border rounded-full text-purple-700 bg-purple-100 border-purple-200">
                  Platform Benefits
                </span>

                <h2 className="mb-5 text-4xl font-black tracking-tight text-gray-900 md:text-4xl">
                  Why Creators & Brands
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                    {" "}
                    Choose Trendora
                  </span>
                </h2>

                <p className="max-w-2xl mx-auto text-lg text-gray-500">
                  Designed to help creators and brands connect, collaborate, and
                  grow together.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  initial={{ opacity: 1, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -12,
                    scale: 1.03,
                  }}
                  className="group relative p-8 bg-white border border-purple-100 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300"
                >
                  <div className="mb-6">
                    <motion.div
                      whileHover={{
                        rotate: -8,
                        scale: 1.15,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                      }}
                      className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100"
                    >
                      <Icon
                        icon={f.icon}
                        className="text-[34px] text-purple-600"
                      />
                    </motion.div>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-purple-700">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        {/* Trending Creators */}
        <section className="py-20 ">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 ">
            <div className="relative mb-16">
              {/* Mobile Layout */}
              <div className="flex items-center justify-between md:hidden">
                <div>
                  <span className="inline-flex px-3 py-1 mb-3 text-[10px] font-bold tracking-wider uppercase border rounded-full bg-purple-100 text-purple-700 border-purple-200">
                    Top Influencers
                  </span>

                  <h2 className="text-3xl font-black tracking-tight text-gray-900">
                    Trending
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                      {" "}
                      Creators
                    </span>
                  </h2>
                </div>

                <Link
                  to="/trending-creators"
                  className="flex items-center gap-1 text-sm font-semibold text-purple-600"
                >
                  View All →
                </Link>
              </div>

              {/* Mobile Description */}
              <p className="mt-3 text-gray-500 md:hidden">
                Discover the fastest-growing creators on Trendora.
              </p>

              {/* Desktop Layout */}
              <div className="hidden md:block">
                <div className="text-center">
                  <span className="inline-flex px-4 py-2 mb-4 text-xs font-bold tracking-wider uppercase border rounded-full bg-purple-100 text-purple-700 border-purple-200">
                    Top Influencers
                  </span>

                  <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
                    Trending
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                      {" "}
                      Creators
                    </span>
                  </h2>

                  <p className="mt-3 text-lg text-gray-500">
                    Discover the fastest-growing creators on Trendora.
                  </p>
                </div>

                <Link
                  to="/trending-creators"
                  className="absolute right-0 top-1/2 flex items-center gap-2 text-sm font-semibold text-purple-600 transition-all duration-300 hover:text-purple-800 hover:translate-x-1"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {creators.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                  }}
                  className="group relative overflow-hidden bg-white border border-purple-100 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-700">
                    {c.rank}
                  </div>
                  <motion.div
                    whileHover={{
                      rotate: 8,
                      scale: 1.08,
                    }}
                    className="flex items-center justify-center w-16 h-16 mb-5 text-xl font-bold text-white rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 shadow-lg shadow-purple-200"
                  >
                    {c.avatar}
                  </motion.div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {c.name}
                    </h3>

                    {c.verified && (
                      <Icon
                        icon="solar:verified-check-bold"
                        className="text-xl text-purple-600"
                      />
                    )}
                  </div>
                  <div className="inline-flex px-3 py-1 mt-2 text-xs font-semibold rounded-full bg-purple-50 text-purple-700">
                    {c.category}
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={platformIcons[c.platform]}
                        className="text-xl text-purple-600"
                      />
                      <span>{c.platform}</span>
                    </div>
                    <div className="px-3 py-1 font-semibold text-purple-700 rounded-full bg-purple-50">
                      {c.followers}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="relative py-10 overflow-hidden bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900">
          {/* Glow Effects */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="relative max-w-4xl px-4 mx-auto text-center">
            {/* Badge */}
            <span className="inline-flex items-center px-4 py-2 mb-5 text-xs font-bold tracking-wider uppercase rounded-full bg-white/10 text-purple-100 border border-white/20">
              🚀 Join Pakistan's Fastest Growing Creator Network
            </span>

            {/* Heading */}
            <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">
              Ready to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white">
                {" "}
                Grow?
              </span>
            </h2>

            {/* Description */}
            <p className="max-w-2xl mx-auto mb-8 text-lg leading-relaxed text-purple-100">
              Connect with brands, discover paid opportunities, and grow your
              influence with Trendora.
            </p>

            {/* Buttons */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="
            px-8 py-4
            bg-white
            text-purple-700
            font-bold
            rounded-2xl
            shadow-lg
            transition-all
            duration-300
            hover:scale-105
            hover:-translate-y-1
            hover:shadow-2xl
          "
              >
                Join as Creator →
              </Link>

              <Link
                to="/signup"
                className="
            px-8 py-4
            border-2 border-white
            text-white
            font-bold
            rounded-2xl
            transition-all
            duration-300
            hover:bg-white/10
            hover:scale-105
            hover:-translate-y-1
          "
              >
                Join as Brand
              </Link>
            </div>

            {/* Mini Trust Line */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-purple-200">
              <span>✓ 500+ Creators</span>
              <span>✓ 200+ Brands</span>
              <span>✓ PKR 2M+ Paid Out</span>
            </div>
          </div>
        </section>
      </SectionReveal>
      <Footer />
    </div>
  );
}
