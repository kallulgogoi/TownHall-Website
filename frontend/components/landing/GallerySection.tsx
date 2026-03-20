"use client";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

const galleryImages = [
  "https://res.cloudinary.com/difnkaes4/image/upload/v1774037698/WhatsApp_Image_2026-03-21_at_1.42.06_AM_guzyjg.jpg",
  "https://res.cloudinary.com/difnkaes4/image/upload/v1774037704/WhatsApp_Image_2026-03-21_at_1.42.07_AM_2_sdz9bj.jpg",
  "https://res.cloudinary.com/difnkaes4/image/upload/v1774037704/WhatsApp_Image_2026-03-21_at_1.42.08_AM_agvhv6.jpg",
  "https://res.cloudinary.com/difnkaes4/image/upload/v1774037700/WhatsApp_Image_2026-03-21_at_1.42.06_AM_1_jivgwx.jpg",
  "https://res.cloudinary.com/difnkaes4/image/upload/v1774037694/WhatsApp_Image_2026-03-21_at_1.42.08_AM_1_ujrdyz.jpg",
  "https://res.cloudinary.com/difnkaes4/image/upload/v1774037693/WhatsApp_Image_2026-03-21_at_1.42.07_AM_isfktm.jpg",
  "https://res.cloudinary.com/difnkaes4/image/upload/v1774037692/WhatsApp_Image_2026-03-21_at_1.42.07_AM_1_xsxdvl.jpg",
  "https://res.cloudinary.com/difnkaes4/image/upload/v1774037687/WhatsApp_Image_2026-03-21_at_1.43.19_AM_atigjp.jpg",
  "https://res.cloudinary.com/difnkaes4/image/upload/v1774037688/WhatsApp_Image_2026-03-21_at_1.42.09_AM_qz9si6.jpg",
];

// Split images: first 5 for row 1, last 4 for row 2
const rowOneImages = galleryImages.slice(0, 5);
const rowTwoImages = galleryImages.slice(5);

const InfiniteScrollRow = ({
  images,
  direction = "left",
  tiltAngle = 0,
  onImageClick,
}: {
  images: string[];
  direction?: "left" | "right";
  tiltAngle?: number;
  onImageClick: (src: string) => void;
}) => {
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: { ease: "linear", duration: 40, repeat: Infinity },
    });
  }, [controls, direction]);

  // Duplicate
  const loopImages = [...images, ...images, ...images, ...images];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        transform: `perspective(1200px) rotateX(${tiltAngle}deg)`,
        transformOrigin: "center center",
      }}
    >
      <motion.div
        className="flex gap-5 px-4"
        animate={controls}
        style={{ width: "max-content" }}
      >
        {loopImages.map((src, index) => {
          const cardTilt = ((index % 3) - 1) * 1.5;
          return (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.08,
                rotate: 0,
                zIndex: 10,
                boxShadow: "0 0 40px rgba(250, 204, 21, 0.35)",
              }}
              className="flex-shrink-0 relative rounded-2xl overflow-hidden cursor-pointer"
              style={{
                width: "320px",
                height: "220px",
                rotate: `${cardTilt}deg`,
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "box-shadow 0.3s ease",
              }}
              onClick={() => onImageClick(src)}
            >
              {/* Shimmer overlay on hover */}
              <motion.div
                className="absolute inset-0 z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(250,204,21,0.08) 0%, transparent 60%)",
                }}
              />
              <Image
                src={src}
                alt="Gallery"
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
                unoptimized
              />
              {/* Bottom gradient for depth */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3 z-10 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default function GallerySection({
  onImageClick,
}: {
  onImageClick: (src: string) => void;
}) {
  return (
    <section className="py-24 bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center px-6">
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase font-custom tracking-tighter">
          Photo <span className="text-yellow-400">Gallery</span>
        </h2>
      </div>

      <div
        className="relative"
        style={{
          perspective: "1800px",
          perspectiveOrigin: "50% 40%",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% 50%, rgba(250,204,21,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Row 1*/}
        <div className="py-5 relative z-10">
          <InfiniteScrollRow
            images={rowOneImages}
            direction="left"
            tiltAngle={-4}
            onImageClick={onImageClick}
          />
        </div>

        {/* Row 2 */}
        <div className="py-5 relative z-10">
          <InfiniteScrollRow
            images={rowTwoImages}
            direction="right"
            tiltAngle={4}
            onImageClick={onImageClick}
          />
        </div>
      </div>
    </section>
  );
}
