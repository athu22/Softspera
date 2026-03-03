import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useState, useLayoutEffect, useRef, useMemo } from 'react';
import type { TeamMember } from '../types';
import { useOptimizedData } from '../hooks/useOptimizedData';

function groupByLevel(team: TeamMember[]) {
  return {
    leadership: team.filter((m) => m.roleLevel === 1),
    leads: team.filter((m) => m.roleLevel === 2 || m.roleLevel === 3),
    team: team.filter((m) => m.roleLevel >= 4),
  };
}

export default function AboutPage() {
  const { data: teamData, loading } = useOptimizedData<{ [key: string]: TeamMember }>({ path: 'team' });
  const team = useMemo(() => {
    return teamData ? (Object.values(teamData) as unknown as TeamMember[]).sort((a, b) => Number(a?.roleLevel ?? 999) - Number(b?.roleLevel ?? 999)) : [];
  }, [teamData]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leaderRefs = useRef<Map<string, HTMLElement>>(new Map());
  const leadRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [connectors, setConnectors] = useState<Array<{ x1: number, y1: number, x2: number, y2: number }>>([]);

  // compute connectors after DOM updated
  useLayoutEffect(() => {
    // leaders -> leads connectors
    const leaders = Array.from(leaderRefs.current.entries());
    const leads = Array.from(leadRefs.current.entries());
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: Array<{ x1: number, y1: number, x2: number, y2: number }> = [];

    leaders.forEach(([, elL]) => {
      const rL = elL.getBoundingClientRect();
      const cxL = rL.left + rL.width / 2 - containerRect.left;
      const cyL = rL.top + rL.height - containerRect.top; // bottom of leader
      leads.forEach(([, elR]) => {
        const rR = elR.getBoundingClientRect();
        const cxR = rR.left + rR.width / 2 - containerRect.left;
        const cyR = rR.top - containerRect.top; // top of lead
        newLines.push({ x1: cxL, y1: cyL, x2: cxR, y2: cyR });
      });
    });

    setConnectors(newLines);
  }, [team, loading]);

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

  const { leadership, leads, team: coreTeam } = groupByLevel(team);

  return (
    <>
      <Helmet>
        <title>About Us | Softspera - Leading IT Company</title>
        <meta
          name="description"
          content="Learn about Softspera's mission, values, and the dedicated team behind our innovative IT solutions. We ensure digital transformation for businesses globally."
        />
        <meta name="keywords" content="About Softspera, IT Company Team, Software Engineering Mission, Digital Transformation Agency" />
        <link rel="canonical" href="https://softspera.com/about" />
        <meta property="og:title" content="About Us | Softspera" />
        <meta property="og:description" content="Learn about Softspera's mission, values, and the dedicated team behind our innovative IT solutions." />
        <meta property="og:url" content="https://softspera.com/about" />
        <meta property="og:type" content="website" />
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
            <motion.h1 className="text-4xl font-bold md:text-5xl" variants={fadeInUp}>
              About Softspera
            </motion.h1>
            <motion.p className="mt-6 text-xl text-gray-600" variants={fadeInUp}>
              We are passionate about delivering innovative IT solutions that help
              businesses thrive in the digital age.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2">
            <motion.div
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 className="text-3xl font-bold" variants={fadeInUp}>
                Our Mission
              </motion.h2>
              <motion.p className="text-gray-600" variants={fadeInUp}>
                To empower businesses with cutting-edge technology solutions that
                drive growth, efficiency, and innovation. We strive to be the
                catalyst that transforms ideas into powerful digital realities.
              </motion.p>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 className="text-3xl font-bold" variants={fadeInUp}>
                Our Vision
              </motion.h2>
              <motion.p className="text-gray-600" variants={fadeInUp}>
                To be the leading force in digital transformation, recognized
                globally for our innovative solutions, technical excellence, and
                commitment to delivering exceptional value to our clients.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="container">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 className="text-3xl font-bold md:text-4xl" variants={fadeInUp}>
              Our Values
            </motion.h2>
          </motion.div>

          <motion.div
            className="mt-12 grid gap-8 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                title: 'Innovation',
                description:
                  'We constantly push boundaries to create cutting-edge solutions.',
              },
              {
                title: 'Excellence',
                description:
                  'We maintain the highest standards in everything we do.',
              },
              {
                title: 'Integrity',
                description:
                  'We operate with honesty, transparency, and ethical principles.',
              },
            ].map((value) => (
              <motion.div
                key={value.title}
                className="rounded-lg bg-white p-6 text-center shadow-lg"
                variants={fadeInUp}
              >
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="mt-4 text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 className="text-3xl font-bold md:text-4xl" variants={fadeInUp}>
              Meet Our Team
            </motion.h2>
            <motion.p className="mt-4 text-gray-600" variants={fadeInUp}>
              The talented individuals who make our vision a reality.
            </motion.p>
            <p className="mt-2 text-sm text-gray-500">Found {team.length} members</p>
          </motion.div>

          <div className="mt-12" ref={containerRef}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : team.length === 0 ? (
              <div className="text-center text-gray-600">No team members found. Add some from the admin panel.</div>
            ) : (
              <div className="space-y-16">
                {/* Leadership row (centered) */}
                <section className="relative text-center py-12">
                  <h3 className="text-3xl font-extrabold tracking-tight mb-8">Leadership</h3>
                  <div className="relative z-10 flex gap-10 flex-wrap justify-center">
                    {leadership.map((leader) => (
                      <div key={leader.id} ref={(el) => { if (el) leaderRefs.current.set(leader.id, el); else leaderRefs.current.delete(leader.id); }} className="flex flex-col items-center">
                        <div className="rounded-full p-1 bg-white/5 shadow-2xl">
                          <div className="h-64 w-64 overflow-hidden rounded-full shadow-[0_30px_50px_rgba(2,6,23,0.4)]">
                            <img src={leader.image} alt={leader.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                        <div className="-mt-8 w-72 rounded-2xl bg-white/60 backdrop-blur-md px-6 py-4 text-center shadow-lg">
                          <h4 className="text-lg font-semibold text-gray-900">{leader.name}</h4>
                          <p className="mt-1 text-sm text-gray-600">{leader.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SVG overlay for connectors */}
                  {connectors.length > 0 && (
                    <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" viewBox={`0 0 ${containerRef.current?.clientWidth || 1000} ${containerRef.current?.clientHeight || 400}`} preserveAspectRatio="none">
                      <g stroke="#E5E7EB" strokeWidth={2} fill="none">
                        {connectors.map((ln, i) => (
                          <line key={i} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2} strokeLinecap="round" />
                        ))}
                      </g>
                    </svg>
                  )}
                </section>

                {/* Leads row */}
                {leads.length > 0 && (
                  <section className="py-6">
                    <h3 className="text-3xl font-extrabold text-center mb-6">Team Leads</h3>
                    <div className="rounded-2xl bg-gradient-to-r from-primary/6 to-secondary/6 p-6">
                      <div className="-mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex gap-6 overflow-x-auto py-4 scrollbar-thin scrollbar-thumb-gray-300">
                          {leads.map((m) => (
                            <article key={m.id} ref={(el) => { if (el) leadRefs.current.set(m.id, el); else leadRefs.current.delete(m.id); }} className="min-w-[220px] flex-shrink-0 rounded-xl bg-white p-4 shadow-lg transition-transform hover:-translate-y-3">
                              <div className="h-40 w-full overflow-hidden rounded-lg">
                                <img src={m.image} alt={m.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                              </div>
                              <div className="mt-3">
                                <h5 className="font-semibold">{m.name}</h5>
                                <p className="text-sm text-gray-500">{m.role}</p>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Core team: refined grid */}
                {coreTeam.length > 0 && (
                  <section className="py-6">
                    <h3 className="text-3xl font-extrabold text-center mb-6">Our Team</h3>
                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {coreTeam.map((member) => (
                        <div key={member.id} className="rounded-xl bg-white p-4 shadow-md hover:shadow-2xl transition-shadow">
                          <div className="h-48 w-full overflow-hidden rounded-lg">
                            <img src={member.image} alt={member.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                          </div>
                          <div className="mt-4">
                            <h5 className="font-semibold">{member.name}</h5>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
