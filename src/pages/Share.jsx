import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { FaPlay, FaPause } from "react-icons/fa6";
import "../App.css";

function SharePlaylist() {
  const [musicPlaying, setMusicPlaying] = useState("");
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [audio, setAudio] = useState(null);
  const navigate = useNavigate();
  const { playlistId } = useParams();
  // Fetch playlists from the API
  async function fetchMyPlaylist() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playlist/${playlistId}`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      setPlaylist(data);
      console.log(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching playlist:", err);
    }
  }

  // Stop current audio when selectedMusic changes
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

  // Fetch playlist on component mount
  useEffect(() => {
    fetchMyPlaylist();
  }, []);

  return (
    <div className="w-screen flex-col items-center justify-center">
      <div className="bg-[#011425] py-3">
        {playlist && <h1 className="text-white font-semibold">FEEL BEAT</h1>}
      </div>
      <div className="w-full flex flex-col items-center mt-10">
        {(function (playlist) {
          console.log(playlist, "playlist");
          if (playlist && !isLoading) {
            return (
              <div className="w-full p-5 flex flex-col items-center rounded-2xl gap-y-3">
                <div className="text-3xl md:text-5xl font-bold text-white">
                  {playlist.owner}'s {playlist.playlist_name} Playlist
                </div>
                {selectedMusic && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex justify-center items-center"
                  >
                    <div className="w-[90%] flex flex-col lg:flex-row md:gap-x-5 selected rounded-2xl shadow-black/10 shadow-2xl">
                      <div className="w-auto">
                        <img
                          className="object-cover w-full lg:min-w-[45rem] md:h-[30rem] rounded-ss-2xl rounded-se-2xl lg:rounded-se-none lg:rounded-ss-2xl lg:rounded-bl-2xl lg:rounded-br-none"
                          src={selectedMusic.album.cover_xl}
                        />
                      </div>
                      <div className="flex flex-col items-start lg:justify-between w-full truncate">
                        <div className="w-full flex flex-col md:py-5 md:gap-y-3 truncate">
                          <div className="w-full hidden lg:block text-xl text-center md:text-left truncate text-white italic font-semibold">
                            Now Playing. . .
                          </div>
                          <div className="w-full text-3xl md:text-5xl text-center lg:text-left truncate overflow-hidden text-white font-bold">
                            {selectedMusic.title_short}
                          </div>
                          <div className="w-full text-2xl md:text-4xl text-center lg:text-left truncate overflow-hidden text-gray-400 italic">
                            {selectedMusic.artist.name}
                          </div>
                        </div>
                        <div className="w-full flex justify-center items-center">
                          {musicPlaying !== selectedMusic.id ? (
                            <div
                              className="text-green-300 rounded-full p-3 hover:bg-white hover:bg-opacity-20"
                              onMouseDown={() => {
                                if (audio) {
                                  audio.play();
                                } else if (audio && audio.paused) {
                                  audio.play();
                                }
                                setMusicPlaying(selectedMusic.id);
                              }}
                            >
                              <FaPlay size={60} />
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
                              <FaPause size={60} />
                            </div>
                          )}
                        </div>
                      </div>
                      {/* <div className="flex flex-col items-start px-5 w-[60rem]">
                <div className="flex flex-col items-start w-full">
                  <div className="text-5xl w-full text-white truncate text-left font-bold">
                    {selectedMusic.title_short}
                  </div>
                  <div className="text-5xl w-full text-gray-400 truncate text-left italic">
                    {selectedMusic.artist.name}
                  </div>
                </div>
                <div>

                </div>
              </div> */}
                    </div>
                  </motion.div>
                )}
                <div className="w-full flex flex-wrap gap-x-10 gap-y-5 items-center justify-center">
                  {playlist.songs.map((music, _, self) => (
                    <motion.div
                      key={music.id}
                      layout
                      whileHover={{ scale: 1.1 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap md:flex-col mt-5 py-1 w-[42%] md:w-auto items-center justify-center"
                    >
                      <img
                        src={music.album.cover_xl}
                        className="w-full md:min-w-64 md:max-w-64 rounded-[10px]"
                        alt="Album cover"
                      />
                      <div className="flex flex-col items-start w-full">
                        <div className="font-bold text-xl text-left w-full md:w-64 truncate text-white  ">
                          {music.title_short}
                        </div>
                        <div className="italic text-left text-xl w-full md:w-64 truncate text-gray-400">
                          {music.artist.name}
                        </div>
                      </div>
                      <div className="flex flex-row w-full">
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
                  ))}
                </div>
              </div>
            );
          } else if (isLoading) {
            return (
              <div className="mt-48 items-center">
                <h1 className="text-white font-semibold"> Loading ...</h1>
              </div>
            );
          } else {
            return <div>No playlists available.</div>;
          }
        })(playlist)}
      </div>
    </div>
  );
}

export default SharePlaylist;
