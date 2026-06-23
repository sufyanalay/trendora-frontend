import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "../utils/axios";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Icon } from "@iconify/react";
import SectionReveal from "../components/SectionReveal";
const categories = [
  "All",
  "AI Marketing",
  "Fashion",
  "Food",
  "Tech",
  "Lifestyle",
  "Gaming",
];

export default function Opportunities() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [stats, setStats] = useState({
    campaigns: 0,
    categories: 0,
    collaborations: 0,
  });

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const cached = localStorage.getItem("opportunities");

    if (cached) {
      setOpportunities(JSON.parse(cached));
    }

    fetchOpportunities();
  }, []);
  useEffect(() => {
    if (!inView) return;

    let campaigns = 0;
    let categories = 0;
    let collaborations = 0;

    const interval = setInterval(() => {
      campaigns += 10;
      categories += 1;
      collaborations += 5;

      setStats({
        campaigns: campaigns >= 500 ? 500 : campaigns,
        categories: categories >= 7 ? 7 : categories,
        collaborations: collaborations >= 250 ? 250 : collaborations,
      });

      if (campaigns >= 500 && categories >= 7 && collaborations >= 250) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [inView]);
  const fetchOpportunities = async () => {
    try {
      if (opportunities.length === 0) {
        setLoading(true);
      }

      const res = await axios.get("/opportunities");

      setOpportunities(res.data);

      localStorage.setItem("opportunities", JSON.stringify(res.data));
    } catch (err) {
      if (opportunities.length === 0) {
        setOpportunities(demoData);
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered = opportunities.filter((o) => {
    const matchCat =
      selectedCategory === "All" || o.category === selectedCategory;
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Header */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-300/20 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-light text-primary text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            Live Opportunities
          </span>
          <motion.h1 className="mb-6 text-5xl font-black tracking-tight text-gray-900 md:text-6xl">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mr-3"
            >
              Brand
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600"
            >
              Opportunities
            </motion.span>
          </motion.h1>
          <p className="text-muted text-base md:text-lg max-w-xl mx-auto">
            Browse active campaigns. Login to apply, accept, or send a counter
            offer.
          </p>
        </div>
        <div ref={ref} className="flex flex-wrap justify-center gap-8 mt-10">
          <div>
            <h3 className="text-3xl font-black text-purple-700">
              {stats.campaigns}+
            </h3>
            <p className="text-sm text-gray-500">Active Campaigns</p>
          </div>

          <div className="hidden w-px bg-purple-200 sm:block" />

          <div>
            <h3 className="text-3xl font-black text-purple-700">
              {stats.categories}+
            </h3>
            <p className="text-sm text-gray-500">Categories</p>
          </div>

          <div className="hidden w-px bg-purple-200 sm:block" />

          <div>
            <h3 className="text-3xl font-black text-purple-700">
              {stats.collaborations}+
            </h3>
            <p className="text-sm text-gray-500">Collaborations</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 backdrop-blur-xl bg-white/90 border-b border-purple-100 shadow-sm">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Icon
              icon="tabler:search"
              className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-xl
      text-purple-500
    "
            />

            <input
              type="text"
              placeholder="Search opportunities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
      w-full
      pl-12
      pr-4
      py-3
      text-sm
      border
      border-purple-100
      rounded-2xl
      bg-white
      focus:outline-none
      focus:border-purple-400
      focus:ring-4
      focus:ring-purple-100
      transition-all
    "
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`

whitespace-nowrap
px-4
py-2.5
text-xs
font-bold
rounded-xl
transition-all
duration-300

${
  selectedCategory === cat
    ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg"
    : "bg-purple-50 text-gray-600 hover:bg-purple-100 hover:text-purple-700"
}
`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && opportunities.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-6"></div>
                  <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium">No opportunities found</p>
              <p className="text-sm mt-1">
                Try a different category or search term
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((op, i) => (
                <OpportunityCard key={op._id} op={op} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function OpportunityCard({ op, index }) {
  return (
    <motion.div
      initial={{
        y: 50,
      }}
      whileInView={{
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
      }}
      className="
    group
    relative
    overflow-hidden
    bg-white
    rounded-3xl
    p-6
    border
    border-purple-100
    shadow-sm
    hover:border-purple-300
    hover:shadow-2xl
    hover:-translate-y-2
    transition-all
    duration-500
  "
    >
      <div
        className="
  absolute
  inset-0
  opacity-0
  pointer-events-none
  group-hover:opacity-100
  transition-all
  duration-500
  bg-gradient-to-br
  from-purple-50
  via-transparent
  to-violet-50
"
      />{" "}
      {/* Top */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4 z-10">
          <span
            className="
  px-3
  py-1.5
  rounded-full
  text-xs
  font-bold
  bg-purple-100
  text-purple-700
  border
  border-purple-200
"
          >
            {op.category}
          </span>
          <span
            className={`

px-3
py-1.5
rounded-full
text-xs
font-bold

${op.deadline <= 3 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}
`}
          >
            {op.deadline} days left
          </span>
        </div>
        {/* Title */}
        <h3 className="font-bold text-secondary text-base mb-2 group-hover:text-primary transition-colors duration-300">
          {op.title}
        </h3>
        <p className="text-sm text-muted mb-5 leading-relaxed line-clamp-2">
          {op.description}
        </p>
        {/* Details */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Icon
                icon="solar:wallet-money-bold"
                className="text-purple-500"
              />
              <span className="text-muted">Budget</span>
            </div>
            <span className="font-bold text-primary">
              PKR {op.budget?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Icon icon="solar:smartphone-bold" className="text-purple-500" />
              <span className="text-muted">Platform</span>
            </div>
            <span className="font-medium text-secondary">{op.platform}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Icon icon="solar:user-bold" className="text-purple-500" />
              <span className="text-muted">Posted By</span>
            </div>
            <span className="font-medium text-secondary">{op.brandName}</span>
          </div>
        </div>
      </div>
      {/* CTA */}
      <Link
        to="/login"
        className="
block
w-full
text-center
py-3.5
bg-gradient-to-r
from-purple-600
to-violet-600
text-white
font-bold
rounded-2xl
shadow-lg
hover:shadow-purple
hover:scale-[1.02]
transition-all
duration-300]
"
      >
        Login to Apply
      </Link>
    </motion.div>
  );
}

// Demo data jab backend nahi ho
const demoData = [
  {
    _id: "1",
    title: "Need a 30-Second AI Generated Ad",
    description:
      "Looking for a creative creator to produce a short AI-generated advertisement for our new product launch.",
    category: "AI Marketing",
    budget: 4000,
    deadline: 5,
    platform: "Instagram",
    brandName: "TechCo PK",
  },
  {
    _id: "2",
    title: "Fashion Reel for Summer Collection",
    description:
      "We need a stylish reel showcasing our summer clothing line. Must be trendy and engaging.",
    category: "Fashion",
    budget: 8000,
    deadline: 7,
    platform: "TikTok",
    brandName: "StyleHouse",
  },
  {
    _id: "3",
    title: "Food Review Video for New Restaurant",
    description:
      "Visit our new branch and create an honest review video. Full meal provided.",
    category: "Food",
    budget: 3500,
    deadline: 3,
    platform: "YouTube",
    brandName: "Foodie Hub",
  },
  {
    _id: "4",
    title: "Tech Unboxing — Latest Smartphone",
    description:
      "Unbox and review our latest flagship smartphone. Detailed specs walkthrough required.",
    category: "Tech",
    budget: 12000,
    deadline: 10,
    platform: "YouTube",
    brandName: "GadgetZone PK",
  },
  {
    _id: "5",
    title: "Lifestyle Vlog — Morning Routine",
    description:
      "Integrate our wellness product naturally into your morning routine vlog.",
    category: "Lifestyle",
    budget: 5500,
    deadline: 8,
    platform: "Instagram",
    brandName: "WellnessPK",
  },
  {
    _id: "6",
    title: "Gaming Sponsorship — Mobile Game Launch",
    description:
      "Play and promote our newly launched mobile game. Must have gaming audience.",
    category: "Gaming",
    budget: 9000,
    deadline: 6,
    platform: "TikTok",
    brandName: "GameZone",
  },
];
