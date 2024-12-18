"use client";
import React, { useState, useEffect, useCallback } from "react";
import Masonry from "react-masonry-css";
import Image from "next/image";
import { LazyMotion, domAnimation, m, motion } from "framer-motion";
import LazyLoad from "react-lazy-load";
import { FetchValue } from "@/app/(services)/firebase/config";
import Navbar from "@/app/components/Navbar";

function Page() {
  const [images, setImages] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [imgc, updateImgcount] = useState(125);
  const [imgurl, setImgurl] = useState("");
  const [togValue, settogValue] = useState(false);

  const breakpointColumnsObj = {
    default: 8,
    1100: 5,
    700: 4,
    500: 2,
  };

  // Shuffle function
  const shuffleArray = (array: number[]): number[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let debounceTimer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  };

  const countUpdate = async () => {
    const imgCount = await FetchValue();
    updateImgcount(imgCount);
    console.log("Image Count= ", imgc);
  };

  const fetchMoreImages = useCallback(async () => {
    const startIndex = images.length + 1;
    const newImages = Array.from({ length: 400 }, (_, i) => i + startIndex);
    setImages((prevImages) => [...prevImages, ...shuffleArray(newImages)]);
    setPage((prevPage) => prevPage + 1);
  }, [images]);

  const handleScroll = useCallback(
    debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 300
      ) {
        console.log("end reached");
        fetchMoreImages();
      }
    }, 1200), // 300ms debounce delay
    [fetchMoreImages]
  );

  useEffect(() => {
    countUpdate();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    fetchMoreImages();
  }, []);

  return (
    <main className={`relative flex flex-col w-full h-full px-5 items-center ${togValue?"overflow-hidden":""} transition-all duration-200`} >
      <Navbar />
      <div className="flex items-center justify-around w-[70%] min-h-[200px] mx-auto">
        <a
          href="/generate"
          className="flex items-center text-center justify-center w-fit p-5 h-[70px] bg-[#1d1d1d] rounded-[20px] text-white font-poppins text-xl hover:scale-110 transition-all"
        >
          Generate Your Own
        </a>
      </div>
      <LazyMotion features={domAnimation}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {images.map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
              className="relative rounded-lg overflow-hidden bg-green-300"
              onClick={() => {
                setImgurl(
                  `https://firebasestorage.googleapis.com/v0/b/flashdrive-6e8c3.appspot.com/o/art%20(${
                    index % imgc == 0 ? (index % imgc) + 1 : index % imgc
                  }).png?alt=media&token=939b465c-bd94-4482-be4e-283f4fa0dad9`
                );
                settogValue(true);
              }}
            >
              <LazyLoad offset={400}>
                <Image
                  className="object-cover w-full h-full bg-[#d5d5d5] transition-all "
                  src={`https://firebasestorage.googleapis.com/v0/b/flashdrive-6e8c3.appspot.com/o/art%20(${
                    index % imgc == 0 ? (index % imgc) + 1 : index % imgc
                  }).png?alt=media&token=939b465c-bd94-4482-be4e-283f4fa0dad9`}
                  alt={`Image ${
                    index % 125 == 0 ? (index % imgc) + 1 : index % imgc
                  }`}
                  width={512}
                  height={512}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={`https://firebasestorage.googleapis.com/v0/b/flashdrive-6e8c3.appspot.com/o/art%20(${
                    index % imgc == 0 ? (index % imgc) + 1 : index % imgc
                  }).png?alt=media&token=939b465c-bd94-4482-be4e-283f4fa0dad9`}
                />
              </LazyLoad>
            </motion.div>
          ))}
        </Masonry>
      </LazyMotion>
      {togValue && (
        <section
          className="absolute flex justify-center items-center h-full w-full z-10 bg-white "
          onClick={() => settogValue(false)}
        >
          <Image
                  className="object-contain max-w-[600px] bg-[#d5d5d5] transition-all "
                  src={imgurl}
                 alt="Image"
                  width={512}
                  height={512}
                  loading="lazy"
               
                 
                />
        </section>
      )}
    </main>
  );
}

export default Page;
