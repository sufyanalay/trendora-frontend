import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionReveal from "../components/SectionReveal";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
const steps = [
  {
    number: "01",
    title: "Brand Creates Account",
    desc: "Brand signs up, verifies email, and sets up their company profile.",
    icon: "solar:buildings-bold",
    side: "left",
  },
  {
    number: "02",
    title: "Brand Posts Opportunity",
    desc: "Create campaigns with budget, platform, requirements and deadline.",
    icon: "solar:document-add-bold",
    side: "right",
  },
  {
    number: "03",
    title: "Creators Browse & Apply",
    desc: "Creators explore opportunities and submit applications.",
    icon: "solar:magnifer-linear",
    side: "left",
  },
  {
    number: "04",
    title: "Negotiation Happens",
    desc: "Both sides discuss terms and finalize collaboration details.",
    icon: "solar:hand-shake-bold",
    side: "right",
  },
  {
    number: "05",
    title: "Collaboration Confirmed",
    desc: "Private chat unlocks and project execution begins.",
    icon: "solar:shield-check-bold",
    side: "left",
  },
  {
    number: "06",
    title: "Work & Payment",
    desc: "Work gets approved and payment is released automatically.",
    icon: "solar:wallet-money-bold",
    side: "right",
  },
];

export default function HowItWorks() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [stats, setStats] = useState({
    steps: 0,
    creators: 0,
    brands: 0,
  });
  useEffect(() => {
    if (!inView) return;

    let steps = 0;
    let creators = 0;
    let brands = 0;

    const interval = setInterval(() => {
      steps += 1;
      creators += 10;
      brands += 5;

      setStats({
        steps: steps >= 6 ? 6 : steps,
        creators: creators >= 500 ? 500 : creators,
        brands: brands >= 200 ? 200 : brands,
      });

      if (steps >= 6 && creators >= 500 && brands >= 200) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [inView]);
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Header */}
      {/* Header */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-300/20 blur-3xl rounded-full" />

        <div className="relative max-w-6xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-bold tracking-widest uppercase border rounded-full bg-purple-100/80 text-purple-700 border-purple-200 backdrop-blur-sm">
            ✨ Simple Process
          </div>

          {/* Heading */}
          <motion.h1 className="mb-6 text-5xl font-black tracking-tight text-gray-900 md:text-5xl leading-[1.05]">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mr-2"
            >
              How{" "}
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600 mr-2"
            >
              Trendora{" "}
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="inline-block"
            >
              Works{" "}
            </motion.span>
          </motion.h1>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-600 md:text-lg text-center">
            From posting opportunities to completing collaborations and
            receiving payments,everything happens in one streamlined workflow.
          </p>

          {/* Stats */}
          <div ref={ref} className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <h3 className="text-3xl font-black text-purple-700">
                {stats.steps}
              </h3>
              <p className="text-sm text-gray-500">Simple Steps</p>
            </div>

            <div className="w-px bg-purple-200 hidden sm:block" />

            <div className="text-center">
              <h3 className="text-3xl font-black text-purple-700">
                {stats.creators}+
              </h3>
              <p className="text-sm text-gray-500">Creators</p>
            </div>

            <div className="w-px bg-purple-200 hidden sm:block" />

            <div className="text-center">
              <h3 className="text-3xl font-black text-purple-700">
                {stats.brands}+
              </h3>
              <p className="text-sm text-gray-500">Brands</p>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-12 flex justify-center">
            <div className="flex flex-col items-center text-purple-400">
              <span className="mb-2 text-xs font-semibold uppercase tracking-wider">
                Scroll Down
              </span>

              <div className="flex justify-center w-6 h-10 border-2 rounded-full border-purple-300">
                <div className="w-1.5 h-1.5 mt-2 rounded-full bg-purple-500 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <SectionReveal>
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              {/* Center line - only on md+ */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-purple-300 via-purple-500 to-purple-300 -translate-x-1/2 rounded-full" />

              <div className="space-y-10 md:space-y-16">
                {steps.map((step, i) => (
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
                      duration: 0.6,
                      delay: i * 0,
                    }}
                    className={`relative flex flex-col md:flex-row items-center gap-6 ${
                      step.side === "right" ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Card */}
                    <div className="w-full md:w-[44%]">
                      <div
                        className="
  group
  relative
  bg-white
  p-7
  rounded-3xl
  border
  border-purple-100
  shadow-sm
  transition-all
  duration-500
  hover:-translate-y-2
  hover:shadow-2xl
  hover:shadow-purple-100
  hover:border-purple-300
"
                      >
                        <div
                          className="
  flex items-center justify-center
  w-16 h-16
  mb-5
  rounded-2xl
  bg-gradient-to-br
  from-purple-100
  to-purple-50
  text-purple-700
  transition-all
  duration-500
  group-hover:scale-110
  group-hover:rotate-6
"
                        >
                          <Icon icon={step.icon} className="text-3xl" />
                        </div>
                        <div className="mb-2 text-sm font-bold tracking-wide uppercase text-purple-600">
                          Step {step.number}
                        </div>
                        <h3 className="text-lg font-bold text-secondary mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:flex w-[12%] justify-center">
                      <div
                        className="
    w-14
    h-14
    rounded-full
    bg-gradient-to-r
    from-purple-600
    to-violet-600
    text-white
    flex
    items-center
    justify-center
    font-black
    text-base
    shadow-xl
    shadow-purple-300
    border-4
    border-white
    z-10
  "
                      >
                        {step.number}
                      </div>
                    </div>

                    {/* Empty space other side */}
                    <div className="hidden md:block w-[44%]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>
      {/* Bottom CTA */}
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
                state={{ role: "creator" }}
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
                state={{ role: "brand" }}
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
