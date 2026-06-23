import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SectionReveal from "../components/SectionReveal";
const features = [
  {
    icon: "solar:target-bold",
    title: "Smart Matching",
    desc: "Our system matches brands with the most relevant creators based on niche, audience size, and past performance.",
    tag: "Core",
  },
  {
    icon: "solar:chat-round-dots-bold",
    title: "Private Chat",
    desc: "Secure messaging unlocks only after a collaboration is confirmed — keeping communication focused and safe.",
    tag: "Core",
  },
  {
    icon: "solar:refresh-circle-bold",
    title: "Counter Offer System",
    desc: "Creators and brands can negotiate freely — accept, reject, or send counter offers until both parties agree.",
    tag: "Negotiation",
  },
  {
    icon: "solar:wallet-money-bold",
    title: "Escrow Payments",
    desc: "Brand payment is held securely until work is approved. Creator gets paid automatically after approval.",
    tag: "Payments",
  },
  {
    icon: "solar:chart-2-bold",
    title: "Dashboard Analytics",
    desc: "Track earnings, active collaborations, pending applications, and campaign performance in real time.",
    tag: "Analytics",
  },
  {
    icon: "solar:shield-check-bold",
    title: "Verified Profiles",
    desc: "All accounts go through verification to ensure authenticity of both creators and brands.",
    tag: "Security",
  },
  {
    icon: "solar:bolt-bold",
    title: "Fast Onboarding",
    desc: "Sign up, complete your profile, and start posting or applying to opportunities within minutes.",
    tag: "Core",
  },
  {
    icon: "solar:bell-bold",
    title: "Real-time Notifications",
    desc: "Get instant alerts for new applications, counter offers, approvals, and payment releases.",
    tag: "Core",
  },
  {
    icon: "solar:crown-bold",
    title: "Admin Control",
    desc: "Full admin dashboard to manage users, resolve disputes, track payments, and monitor platform activity.",
    tag: "Admin",
  },
];

const tagColors = {
  Core: "bg-primary-light text-primary",
  Negotiation: "bg-yellow-50 text-yellow-700",
  Payments: "bg-green-50 text-green-700",
  Analytics: "bg-blue-50 text-blue-700",
  Security: "bg-red-50 text-red-600",
  Admin: "bg-gray-100 text-gray-700",
};

export default function Features() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [stats, setStats] = useState({
    features: 0,
    creators: 0,
    brands: 0,
  });

  useEffect(() => {
    if (!inView) return;

    let features = 0;
    let creators = 0;
    let brands = 0;

    const interval = setInterval(() => {
      features += 1;
      creators += 10;
      brands += 5;

      setStats({
        features: features >= 9 ? 9 : features,
        creators: creators >= 500 ? 500 : creators,
        brands: brands >= 200 ? 200 : brands,
      });

      if (features >= 9 && creators >= 500 && brands >= 200) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [inView]);
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Header */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-300/20 blur-3xl rounded-full" />

        <div className="relative max-w-6xl px-4 mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-bold tracking-widest uppercase border rounded-full bg-purple-100/80 text-purple-700 border-purple-200">
            ✨ Platform Features
          </div>

          <motion.h1 className="mb-6 text-5xl font-black tracking-tight text-gray-900 md:text-6xl">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mr-3"
            >
              Everything You
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600"
            >
              Need
            </motion.span>
          </motion.h1>

          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-600">
            Powerful tools designed to help creators and brands collaborate,
            negotiate, communicate, and grow faster on Trendora.
          </p>

          <div ref={ref} className="flex flex-wrap justify-center gap-8 mt-10">
            <div>
              <h3 className="text-3xl font-black text-purple-700">
                {stats.features}+
              </h3>
              <p className="text-sm text-gray-500">Core Features</p>
            </div>

            <div className="hidden w-px bg-purple-200 sm:block" />

            <div>
              <h3 className="text-3xl font-black text-purple-700">
                {stats.creators}+
              </h3>
              <p className="text-sm text-gray-500">Creators</p>
            </div>

            <div className="hidden w-px bg-purple-200 sm:block" />

            <div>
              <h3 className="text-3xl font-black text-purple-700">
                {stats.brands}+
              </h3>
              <p className="text-sm text-gray-500">Brands</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <SectionReveal>
        <section className="py-16">
          <div className="text-center mb-16">
            <span className="inline-flex px-4 py-2 mb-4 text-xs font-bold tracking-wider uppercase border rounded-full bg-purple-100 text-purple-700 border-purple-200">
              Core Platform Features
            </span>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
              Built For
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                {" "}
                Growth
              </span>
            </h2>

            <p className="mt-3 text-gray-500">
              Everything creators and brands need in one place.
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 1,
                    y: 60,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.02,
                  }}
                  key={i}
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
                  <div className="relative z-10"></div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-purple-100 transition-all duration-300">
                      <Icon
                        icon={f.icon}
                        className="
  text-3xl
  text-purple-600
  transition-all
  duration-500
  group-hover:scale-125
  group-hover:rotate-6
"
                      />
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColors[f.tag]}`}
                    >
                      {f.tag}
                    </span>
                  </div>

                  <h3
                    className="
text-xl
font-black
text-gray-900
mb-3
group-hover:text-purple-600
transition-colors
duration-300
"
                  >
                    {f.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* CTA */}
      <SectionReveal>
        <section className="relative py-20 overflow-hidden bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900">
          {/* Glow Effects */}
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="relative max-w-4xl px-4 mx-auto text-center">
            {/* Badge */}
            <span
              className="
          inline-flex
          items-center
          px-4
          py-2
          mb-6
          text-xs
          font-bold
          tracking-wider
          uppercase
          rounded-full
          border
          border-white/20
          bg-white/10
          text-purple-100
        "
            >
              🚀 Join Trendora Today
            </span>

            {/* Heading */}
            <h2 className="mb-5 text-4xl font-black text-white md:text-5xl">
              Ready to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white">
                {" "}
                Grow Faster?
              </span>
            </h2>

            {/* Description */}
            <p className="max-w-2xl mx-auto mb-8 text-lg leading-relaxed text-purple-100">
              Unlock premium features, connect with top brands, discover paid
              collaborations, and take your creator journey to the next level.
            </p>

            {/* Button */}
            <Link
              to="/signup"
              className="
          inline-flex
          items-center
          gap-2
          px-8
          py-4
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
              Create Free Account →
            </Link>

            {/* Trust Line */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-purple-200">
              <span>✓ No Hidden Charges</span>
              <span>✓ Secure Payments</span>
              <span>✓ Cancel Anytime</span>
            </div>
          </div>
        </section>
      </SectionReveal>
      <Footer />
    </div>
  );
}
