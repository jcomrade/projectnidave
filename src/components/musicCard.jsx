// VerticalSeparator.js
import React, { useEffect } from "react";
import { motion } from "motion/react";

const MusicCard = (setSelectedMusic) => {
  useEffect(() => {
    if (audio) {
      audio.pause(); // Stop any previously playing audio
    }
    if (selectedMusic) {
      const newAudio = new Audio(selectedMusic.preview);
      newAudio.play();
      setAudio(newAudio);
    }
    // Cleanup audio on unmount
    return () => {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    };
  }, [selectedMusic]);
  return (
    <motion.div
      key={music.id}
      layout
      whileHover={{ scale: 1.1 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col mt-4 mb-3"
    >
      <div className={`text-left ${musicPlaying !== music.id && "invisible"} `}>
        Now Playing...
      </div>
      <img
        src={music.album.cover_xl}
        className="min-w-64 max-w-64 rounded-[10px]"
        alt="Album cover"
      />
      <div className="flex flex-col items-start w-full">
        <div className="font-bold text-xl text-left w-64 truncate text-white  ">
          {music.title_short}
        </div>
        <div className="italic text-left text-xl w-64 truncate text-gray-400">
          {music.artist.name}
        </div>
      </div>
      <div className="flex flex-row">
        <div className="w-full flex flex-row">
          {musicPlaying !== music.id ? (
            <div
              className="text-green-300 rounded-full p-3 hover:bg-white hover:bg-opacity-20"
              onMouseDown={() => {
                if (selectedMusic !== music.preview) {
                  // If a new track is selected, stop the current audio and set the new one
                  if (audio) {
                    audio.pause();
                    audio.currentTime = 0; // Reset current audio
                  }
                  const newAudio = new Audio(music.preview);
                  newAudio.play();
                  setAudio(newAudio);
                  setSelectedMusic(music); // Update the selected music
                } else if (audio && audio.paused) {
                  // If the same track is selected and paused, play it
                  audio.currentTime = 0; // Optional: restart from the beginning
                  audio.play();
                }
                setMusicPlaying(music.id);
              }}
            >
              <FaPlay size={25} />
            </div>
          ) : (
            <div
              className="text-green-300 rounded-full p-3 hover:bg-white hover:bg-opacity-20"
              onMouseDown={() => {
                if (audio) {
                  audio.pause();
                  setMusicPlaying("");
                }
              }}
            >
              <FaPause size={25} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MusicCard;
