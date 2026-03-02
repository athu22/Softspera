import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import type { Project } from '../types';
import { useOptimizedData } from '../hooks/useOptimizedData';

export default function ProjectsPage() {
  const { data: projectsData, loading } = useOptimizedData<{ [key: string]: Project }>({ path: 'projects' });
  const projects = projectsData ? Object.values(projectsData) : [];
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <Helmet>
        <title>Our Projects - Softspera</title>
        <meta
          name="description"
          content="Explore Softspera's portfolio of successful projects and see how we've helped businesses achieve their digital transformation goals."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold md:text-5xl">Our Projects</h1>
            <p className="mt-6 text-xl text-gray-600">
              Discover how we've helped businesses transform their digital
              presence and achieve their goals.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{project.name}</h3>
                    <p className="mt-2 line-clamp-2 text-gray-600">
                      {project.description}
                    </p>
                    <button className="mt-4 text-primary hover:underline">
                      Learn More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl bg-white">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-4 top-4 rounded-full bg-gray-200 p-2 text-gray-600 hover:bg-gray-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <img
              src={selectedProject.image}
              alt={selectedProject.name}
              className="aspect-video w-full object-cover"
            />

            <div className="p-6">
              <h3 className="text-2xl font-semibold">{selectedProject.name}</h3>
              <p className="mt-4 text-gray-600">{selectedProject.description}</p>
              <a
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
              >
                Visit Project
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
