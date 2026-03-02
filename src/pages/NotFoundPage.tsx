import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Softspera</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist. Return to Softspera's homepage."
        />
      </Helmet>

      <div className="flex min-h-[80vh] items-center justify-center">
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.h1
            className="text-6xl font-bold text-primary md:text-8xl"
            variants={fadeInUp}
          >
            404
          </motion.h1>
          <motion.h2
            className="mt-4 text-2xl font-semibold md:text-3xl"
            variants={fadeInUp}
          >
            Page Not Found
          </motion.h2>
          <motion.p
            className="mt-4 text-gray-600"
            variants={fadeInUp}
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
          <motion.div className="mt-8" variants={fadeInUp}>
            <Link to="/" className="btn-primary">
              Return Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
