import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Icon } from "@iconify/react";
import SectionReveal from "../components/SectionReveal";
const categories = [
  "All",
  "Lifestyle",
  "Tech",
  "Fashion",
  "Food",
  "Gaming",
  "Fitness",
  "Travel",
];

const creators = [
  {
    id: 1,
    name: "Ayesha Khan",
    category: "Lifestyle",
    platform: "Instagram",
    followers: "245K",
    engagement: "4.8%",
    completedJobs: 32,
    bio: "Lifestyle content creator sharing daily routines, wellness tips, and home decor inspiration.",
    tags: ["Wellness", "Home", "Routine"],
  },
  {
    id: 2,
    name: "Bilal Chaudhry",
    category: "Tech",
    platform: "YouTube",
    followers: "189K",
    engagement: "6.2%",
    completedJobs: 28,
    bio: "Tech reviewer covering the latest smartphones, laptops, and gadgets in Pakistan.",
    tags: ["Gadgets", "Reviews", "Smartphones"],
  },
  {
    id: 3,
    name: "Sara Ahmed",
    category: "Fashion",
    platform: "TikTok",
    followers: "312K",
    engagement: "7.1%",
    completedJobs: 45,
    bio: "Fashion influencer showcasing Pakistani and international trends with styling tips.",
    tags: ["Style", "OOTD", "Trends"],
  },
  {
    id: 4,
    name: "Usman Malik",
    category: "Food",
    platform: "Instagram",
    followers: "98K",
    engagement: "5.5%",
    completedJobs: 19,
    bio: "Food blogger exploring the best street food and restaurants across Pakistan.",
    tags: ["Street Food", "Reviews", "Recipes"],
  },
  {
    id: 5,
    name: "Zara Hussain",
    category: "Fitness",
    platform: "Instagram",
    followers: "156K",
    engagement: "8.3%",
    completedJobs: 24,
    bio: "Certified fitness coach helping women build strength and confidence through workouts.",
    tags: ["Workout", "Health", "Motivation"],
  },
  {
    id: 6,
    name: "Ali Raza",
    category: "Gaming",
    platform: "YouTube",
    followers: "421K",
    engagement: "5.9%",
    completedJobs: 38,
    bio: "Pro gamer and content creator streaming mobile and PC games daily.",
    tags: ["Mobile Gaming", "Esports", "Live"],
  },
  {
    id: 7,
    name: "Maryam Tariq",
    category: "Travel",
    platform: "YouTube",
    followers: "87K",
    engagement: "9.1%",
    completedJobs: 15,
    bio: "Travel vlogger exploring Pakistan's hidden gems and international destinations.",
    tags: ["Vlog", "Adventure", "Pakistan"],
  },
  {
    id: 8,
    name: "Hassan Sheikh",
    category: "Tech",
    platform: "TikTok",
    followers: "203K",
    engagement: "6.7%",
    completedJobs: 22,
    bio: "Making tech simple for everyone — tips, tricks, and tutorials in Urdu.",
    tags: ["Tips", "Urdu Tech", "Tutorials"],
  },
  {
    id: 9,
    name: "Nida Farooq",
    category: "Fashion",
    platform: "Instagram",
    followers: "178K",
    engagement: "5.2%",
    completedJobs: 41,
    bio: "Luxury and modest fashion blogger with a focus on Pakistani designer wear.",
    tags: ["Modest Fashion", "Designer", "Beauty"],
  },
];

const platformColors = {
  Instagram: "bg-pink-50 text-pink-600",
  YouTube: "bg-red-50 text-red-600",
  TikTok: "bg-gray-100 text-gray-700",
};

const avatarColors = [
  "from-purple-400 to-purple-700",
  "from-blue-400 to-blue-700",
  "from-pink-400 to-pink-700",
  "from-green-400 to-green-700",
  "from-orange-400 to-orange-700",
  "from-teal-400 to-teal-700",
  "from-red-400 to-red-600",
  "from-indigo-400 to-indigo-700",
  "from-yellow-400 to-yellow-600",
];

export default function TrendingCreators() {
  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = creators.filter((c) => {
    const matchCat = selected === "All" || c.category === selected;
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [stats, setStats] = useState({
    creators: 0,
    categories: 0,
    collaborations: 0,
  });
  useEffect(() => {
    if (!inView) return;

    let creators = 0;
    let categories = 0;
    let collaborations = 0;

    const interval = setInterval(() => {
      creators += 10;
      categories += 1;
      collaborations += 5;

      setStats({
        creators: creators >= 500 ? 500 : creators,
        categories: categories >= 7 ? 7 : categories,
        collaborations: collaborations >= 250 ? 250 : collaborations,
      });

      if (creators >= 500 && categories >= 7 && collaborations >= 250) {
        clearInterval(interval);
      }
    }, 20);

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
            Top Performers
          </span>
          <motion.h1 className="mb-6 text-5xl font-black tracking-tight text-gray-900 md:text-6xl">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mr-3"
            >
              Trending
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600"
            >
              Creators
            </motion.span>
          </motion.h1>
          <p className="text-muted text-base md:text-lg max-w-xl mx-auto">
            Discover Pakistan's top content creators. Login to collaborate with
            them.
          </p>
          <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-8 mt-10"
          >
            <div>
              <h3 className="text-3xl font-black text-purple-700">
                {stats.creators}+
              </h3>
              <p className="text-sm text-gray-500">Creators</p>
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
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <SectionReveal>
        <section className="sticky top-16 z-30 bg-white border-b border-border shadow-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3">
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
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelected(cat)}
                  className={`whitespace-nowrap px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    selected === cat
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg"
                      : "bg-surface text-muted hover:bg-primary-light hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Creators Grid */}
      <SectionReveal>
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg font-medium">No creators found</p>
                <p className="text-sm mt-1">Try a different category or name</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((c, i) => (
                  <motion.div
                    key={c.id}
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
                      delay: i * 0.08,
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
group-hover:opacity-100
transition-opacity
duration-500
bg-gradient-to-br
from-purple-50
via-transparent
to-violet-50
"
                    />
                    {/* Top */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`
w-14
h-14
rounded-2xl
bg-gradient-to-br
${avatarColors[i % avatarColors.length]}
flex
items-center
justify-center
text-white
font-bold
text-xl
flex-shrink-0
transition-all
duration-500
group-hover:scale-110
group-hover:rotate-6
`}
                      >
                        {c.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="
font-black
text-lg
text-gray-900
group-hover:text-purple-600
transition-colors
duration-300
truncate
"
                        >
                          {c.name}
                        </h3>
                        <p className="text-xs text-muted mt-0.5">
                          {c.category}
                        </p>
                        <span
                          className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${platformColors[c.platform]}`}
                        >
                          {c.platform}
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-2">
                      {c.bio}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-primary-light text-primary rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-5 py-3 border-t border-b border-border">
                      <div className="text-center">
                        <div className="text-sm font-bold text-secondary">
                          {c.followers}
                        </div>
                        <div className="text-xs text-muted">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-secondary">
                          {c.engagement}
                        </div>
                        <div className="text-xs text-muted">Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-secondary">
                          {c.completedJobs}
                        </div>
                        <div className="text-xs text-muted">Jobs Done</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      to="/login"
                      className="
block
w-full
text-center
py-3
bg-gradient-to-r
from-purple-600
to-violet-600
text-white
font-bold
rounded-2xl
hover:scale-[1.02]
hover:shadow-lg
transition-all
duration-300
"
                    >
                      Login to Collaborate
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
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
              🚀 Become The Next Top Creator
            </span>

            {/* Heading */}
            <h2 className="mb-5 text-4xl font-black text-white md:text-5xl">
              Ready To
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white">
                {" "}
                Grow Your Audience?
              </span>
            </h2>

            {/* Description */}
            <p className="max-w-2xl mx-auto mb-8 text-lg leading-relaxed text-purple-100">
              Join Trendora, showcase your talent, collaborate with leading
              brands, and turn your content into real opportunities.
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

            {/* Trust Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-purple-200">
              <span>✓ 500+ Creators</span>
              <span>✓ 7+ Categories</span>
              <span>✓ 250+ Collaborations</span>
            </div>
          </div>
        </section>
      </SectionReveal>

      <Footer />
    </div>
  );
}
