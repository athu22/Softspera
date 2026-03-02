import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { ref, get } from '@firebase/database';
import { database } from '../lib/firebase';
import type { HomepageContent, Project, Service } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import type { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { motion } from 'framer-motion';

// Initialize FontAwesome library
library.add(fas, far);

// Helper function to convert Font Awesome class string to icon name
const convertIconClassToName = (iconClass: string) => {
  if (!iconClass) return null;

  const match = iconClass.match(/fa[brs]?\s+fa-([a-z0-9-]+)/);
  if (!match) return null;

  const prefix = iconClass.startsWith('far') ? ('far' as const) : ('fas' as const);
  const name = match[1] as IconName;

  return [prefix, name] as [IconPrefix, IconName];
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function HomePage() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homepageSnap, servicesSnap, projectsSnap] = await Promise.all([
          get(ref(database, 'homepage')),
          get(ref(database, 'services')),
          get(ref(database, 'projects')),
        ]);

        setContent(homepageSnap.val() as HomepageContent);
        setServices(Object.values(servicesSnap.val() || {}) as Service[]);
        setProjects(Object.values(projectsSnap.val() || {}) as Project[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-background">
      <Helmet>
        <title>Softspera - Premium IT Solutions</title>
        <meta
          name="description"
          content="Softspera provides cutting-edge IT solutions including web development, mobile apps, cloud services, and AI integration. Transform your business with our innovative technology solutions."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32">
        {/* Animated Background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div variants={fadeInUp} className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-6 border border-primary/20 backdrop-blur-sm">
                Next-Gen IT Solutions
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight text-secondary leading-[1.1]">
                <span className="text-gradient font-display">{content?.heroTitle || 'Transform Your Business'}</span>
                <br /> With Technology
              </motion.h1>
              <motion.p variants={fadeInUp} className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed font-sans max-w-lg">
                {content?.tagline || 'We deliver innovative IT solutions that empower businesses to thrive in the digital age. Cutting-edge design meets powerful engineering.'}
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row gap-5">
                <a href="/contact" className="btn-primary flex items-center justify-center gap-2 group">
                  Start Your Project
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <a href="/projects" className="btn-secondary">Overview Projects</a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative mx-auto w-full max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-3xl transform rotate-3 scale-105 opacity-20 blur-xl"></div>
                <img
                  src={projects[0]?.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'}
                  alt="Featured Dashboard"
                  className="relative rounded-3xl shadow-2xl border border-white/20 object-cover w-full h-[500px]"
                  loading="eager"
                />

                {/* Floating Glass Card */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute -bottom-10 -left-10 glass-card p-6 rounded-2xl max-w-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary">Premium Craft</h4>
                      <p className="text-sm text-gray-500">Strategy &middot; Design</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Internships Advertisement Banner */}
      <section className="relative z-20 -mt-16 container px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-3xl p-1 relative overflow-hidden shadow-2xl hover:shadow-orange-500/30 transition-shadow duration-500 group"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          {/* Shine effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>

          <div className="bg-white/95 backdrop-blur-xl rounded-[23px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 border border-white/40">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-bold mb-4 uppercase tracking-wider animate-pulse border border-red-200">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Limited Time Offer
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 font-display">
                Master Full Stack & Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Hired!</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Join our premium <span className="font-bold text-gray-800">11 Months Elite Program</span> with enterprise projects & guaranteed job prep. Starting at just <span className="font-extrabold text-orange-600 line-through opacity-70">₹25,000</span> <span className="font-extrabold text-red-600 text-xl">₹15,000</span>!
              </p>
            </div>

            <div className="flex-shrink-0">
              <a href="/internships" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-red-600 to-orange-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:-translate-y-1 hover:scale-105 active:scale-95">
                Explore Courses
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative z-10 bg-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-secondary font-display">Our Expertise</h2>
            <p className="mt-6 text-lg text-gray-600">
              Comprehensive IT services tailored to accelerate your growth and establish dominance in the digital ecosystem.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group p-8 rounded-3xl bg-background border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {(() => {
                    const iconInfo = convertIconClassToName(service.icon);
                    return iconInfo ? (
                      <FontAwesomeIcon icon={iconInfo} />
                    ) : (
                      <span className={service.icon} />
                    );
                  })()}
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold text-secondary font-display text-gradient inline-block">Featured Work</h2>
              <p className="mt-6 text-lg text-gray-600">
                Explore our portfolio of successful digital transformations and pixel-perfect applications.
              </p>
            </div>
            <a href="/projects" className="text-primary font-semibold hover:underline flex items-center gap-2">
              View All Projects <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
          >
            {projects.slice(0, 3).map((project) => (
              <motion.div
                key={project.id}
                variants={fadeInUp}
                className="group relative rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-gray-100"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-8 flex flex-col flex-grow relative bg-white z-20">
                  <h3 className="text-2xl font-bold text-secondary mb-3">{project.name}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{project.description}</p>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary font-semibold hover:text-blue-700 transition-colors"
                  >
                    Explore Case Study
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-secondary"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card bg-white/5 border-white/10 p-12 md:p-20 rounded-[3rem] max-w-4xl mx-auto backdrop-blur-xl"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 font-display">Ready to Ignite Your Growth?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Partner with Softspera to build robust, scalable, and stunning digital products that define the future.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/contact" className="btn-primary !bg-white !text-secondary hover:!bg-gray-100 !shadow-white/20">
                Contact Us Today
              </a>
              <a href="/services" className="btn-secondary !bg-transparent !text-white border-white/30 hover:!bg-white/10">
                Explore Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
