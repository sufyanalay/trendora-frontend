import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import SectionReveal from "../components/SectionReveal";
const plans = [
  {
    name: "Creator Free",
    price: "0",
    desc: "Perfect for new creators just starting out.",
    features: [
      "Browse all opportunities",
      "Apply to up to 5 opportunities/month",
      "Basic profile page",
      "Standard support",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Creator Pro",
    price: "999",
    desc: "For serious creators who want more reach.",
    features: [
      "Unlimited opportunity applications",
      "Featured profile badge",
      "Priority in brand searches",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Start Pro",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Brand",
    price: "1,999",
    desc: "For brands ready to run powerful campaigns.",
    features: [
      "Post unlimited opportunities",
      "Access all creator profiles",
      "Campaign analytics",
      "Dedicated account manager",
      "Priority support",
    ],
    cta: "Start as Brand",
    highlight: false,
  },
];

const commission = [
  {
    icon: "solar:wallet-money-bold",
    label: "Platform Commission",
    value: "10%",
    desc: "Deducted from every successful collaboration",
  },
  {
    icon: "solar:card-bold",
    label: "Payment Method",
    value: "JazzCash / Bank",
    desc: "Secure payments with admin verification",
  },
  {
    icon: "solar:clock-circle-bold",
    label: "Payout Time",
    value: "24-48 hrs",
    desc: "After brand approves delivered work",
  },
];
export default function Pricing() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [stats, setStats] = useState({
    plans: 0,
    commission: 0,
    payout: 0,
  });
  useEffect(() => {
    if (!inView) return;

    let plans = 0;
    let commission = 0;
    let payout = 0;

    const interval = setInterval(() => {
      plans += 1;
      commission += 1;
      payout += 2;

      setStats({
        plans: plans >= 3 ? 3 : plans,
        commission: commission >= 10 ? 10 : commission,
        payout: payout >= 48 ? 48 : payout,
      });

      if (plans >= 3 && commission >= 10 && payout >= 48) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [inView]);
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Header */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-300/20 blur-3xl rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-light text-primary text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            Transparent Pricing
          </span>
          <motion.h1 className="mb-6 text-5xl font-black tracking-tight text-gray-900 md:text-6xl">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mr-3"
            >
              Simple &
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600"
            >
              Fair Pricing
            </motion.span>
          </motion.h1>
          <p className="text-muted text-base md:text-lg max-w-xl mx-auto">
            No hidden fees. Pay only when you grow.
          </p>
        </div>
        <div ref={ref} className="flex flex-wrap justify-center gap-8 mt-10">
          <div>
            <h3 className="text-3xl font-black text-purple-700">
              {stats.plans}+
            </h3>
            <p className="text-sm text-gray-500">Pricing Plans</p>
          </div>

          <div className="hidden w-px bg-purple-200 sm:block" />

          <div>
            <h3 className="text-3xl font-black text-purple-700">
              {stats.commission}%
            </h3>
            <p className="text-sm text-gray-500">Commission</p>
          </div>

          <div className="hidden w-px bg-purple-200 sm:block" />

          <div>
            <h3 className="text-3xl font-black text-purple-700">
              24-{stats.payout}h
            </h3>
            <p className="text-sm text-gray-500">Payout Time</p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <SectionReveal>
        <section className="py-16 bg-surface ">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {plans.map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
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
                    delay: i * 0.12,
                  }}
                  className={`
group
relative
overflow-visible
bg-white
rounded-3xl
p-7
border
transition-all
duration-500
hover:-translate-y-2 ${
                    plan.highlight
                      ? "border-primary shadow-purple shadow-[0_25px_70px_rgba(124,58,237,0.18)]"
                      : "border-border shadow-card hover:border-primary hover:shadow-purple"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <span
                        className="
      px-5
      py-2
      bg-gradient-to-r
      from-purple-600
      to-violet-600
      text-white
      text-sm
      font-bold
      rounded-full
      shadow-lg
      whitespace-nowrap
      "
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <h3 className="font-bold text-secondary text-lg mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted mb-5">{plan.desc}</p>

                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-xs text-muted font-medium">PKR</span>
                    <span className="text-4xl font-extrabold text-secondary">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted mb-1">/month</span>
                  </div>

                  <ul className="space-y-3 mb-7">
                    {plan.features.map((f, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-muted"
                      >
                        <Icon
                          icon="solar:check-circle-bold"
                          className="text-lg text-purple-600 mt-0.5 flex-shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/signup"
                    className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors  ${
                      plan.highlight
                        ? "bg-primary text-white hover:bg-primary-dark "
                        : "border-2 border-primary text-primary hover:bg-primary-light"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Commission Info */}
      <SectionReveal>
        <section className="py-14 bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-secondary text-center mb-10">
              Commission & Payments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div
                className="
  absolute
  inset-0
  bg-gradient-to-br
  from-purple-50
  via-transparent
  to-transparent
  opacity-0
  group-hover:opacity-100
  transition-opacity
  duration-500
  "
              />
              {commission.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: i * 0.01,
                  }}
                  className="
group
relative
overflow-hidden
bg-white
rounded-3xl
p-6
text-center
border
border-purple-100
hover:-translate-y-2
hover:shadow-2xl
hover:border-purple-300
transition-all
duration-500
"
                >
                  <Icon
                    icon={c.icon}
                    className="
  text-4xl
  text-purple-600
  mx-auto
  mb-4
  transition-all
  duration-500
  group-hover:scale-125
  group-hover:rotate-6
  "
                  />
                  <div className="text-3xl font-extrabold text-primary mb-2">
                    {c.value}
                  </div>
                  <div className="font-semibold text-secondary text-sm mb-1">
                    {c.label}
                  </div>
                  <div className="text-xs text-muted">{c.desc}</div>
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
            <span className="inline-flex items-center px-4 py-2 mb-6 text-xs font-bold tracking-wider uppercase rounded-full bg-white/10 text-purple-100 border border-white/20">
              💎 Transparent Pricing • No Hidden Fees
            </span>
            {/* Heading */}
            <h2 className="mb-5 text-4xl font-black text-white md:text-5xl">
              Ready to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white">
                {" "}
                Start Growing?
              </span>
            </h2>
            {/* Description */}
            <p className="max-w-2xl mx-auto mb-8 text-lg leading-relaxed text-purple-100">
              Whether you're a creator looking for paid collaborations or a
              brand searching for the perfect influencers, Trendora gives you
              everything you need to connect, collaborate, and grow faster.
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
              <span>✓ No Setup Fees</span>
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
