"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    image: string;
    description: string;
    services: string[];
  } | null;
}

export function ProjectModal({
  isOpen,
  onClose,
  project,
}: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-brand-navy rounded-2xl shadow-2xl z-10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <div className="relative w-full h-64 md:h-80">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover rounded-t-2xl"
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <h3 className="font-display text-2xl md:text-3xl font-bold">
                {project.title}
              </h3>
              <p className="mt-4 text-base opacity-80 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {project.services.map((service) => (
                  <span
                    key={service}
                    className="text-sm font-medium px-4 py-1.5 rounded-full bg-brand-yellow/20 text-brand-yellow dark:bg-brand-yellow/20 dark:text-brand-yellow"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
