import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import type { Service } from '../types';
import { useOptimizedData } from '../hooks/useOptimizedData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import type { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';

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

export default function ServicesPage() {
  const { data: servicesData, loading } = useOptimizedData<{ [key: string]: Service }>({ path: 'services' });
  const services = servicesData ? Object.values(servicesData) : [];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>Our Services - Softspera</title>
        <meta
          name="description"
          content="Explore Softspera's comprehensive range of IT services including web development, mobile apps, cloud solutions, and AI integration."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              className="text-4xl font-bold md:text-5xl"
              variants={fadeInUp}
            >
              Our Services
            </motion.h1>
            <motion.p
              className="mt-6 text-xl text-gray-600"
              variants={fadeInUp}
            >
              We offer a comprehensive range of IT solutions to help your business
              thrive in the digital era.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  className="group rounded-xl bg-white p-8 shadow-lg transition-transform hover:scale-105"
                  variants={fadeInUp}
                >
                  <div className="mb-6 text-4xl text-primary transition-colors group-hover:text-secondary">
                    {(() => {
                      const iconInfo = convertIconClassToName(service.icon);
                      return iconInfo ? (
                        <FontAwesomeIcon icon={iconInfo} />
                      ) : (
                        <span className={service.icon} />
                      );
                    })()}
                  </div>
                  <h3 className="text-2xl font-semibold">{service.title}</h3>
                  <p className="mt-4 text-gray-600">{service.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-white">
        <div className="container text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-3xl font-bold md:text-4xl"
              variants={fadeInUp}
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              className="mx-auto mt-4 max-w-2xl"
              variants={fadeInUp}
            >
              Contact us today to discuss how we can help transform your business
              with our innovative IT solutions.
            </motion.p>
            <motion.div className="mt-8" variants={fadeInUp}>
              <a href="/contact" className="btn-secondary">
                Get in Touch
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
