import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { motion } from "motion/react";
import SignoutButton from "../components/signoutButton";
import { FaPlay, FaPause } from "react-icons/fa6";

function Playlist() {
  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [audio, setAudio] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    (async function () {
      const user = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const UserData = await user.json();
      if (UserData.error == "Authentication Failure") {
        navigate("/");
      }
    })();
  }, []);
  // Fetch playlists from the API

  function copyPlaylistLinkToClipbaord(playlistId) {
    const frontendUrl = window.location.origin;
    navigator.clipboard.writeText(`${frontendUrl}/share/${playlistId}`);
    alert("Copied the URL: " + `${frontendUrl}/share/${playlistId}`);
  }

  async function fetchMyPlaylist() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playlist`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      setPlaylist(data);
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
      const newAudio = new Audio(selectedMusic);
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
      <div className="flex justify-between px-3 py-1 md:pt-3 md:pb-3 md:px-10 w-full bg-[#011425]">
        <div className="flex items-center"><p className="text-2xl md:text-5xl font-semibold text-[#FFFFFF]">FEEL BEAT</p></div>
        <div className="flex space-x-5">
          <SignoutButton />
        </div>
      </div>
      <div className="w-full flex items-start justify-between p-5">
        <button
          className="bg-transparent border-2 text-xs h-10 md:text-xl md:h-auto border-white border-opacity-30 text-white outline-none"
          onClick={() => navigate("/home")}
        >
          BACK
        </button>
      </div>
      <h1 className="text-white font-bold">Your Playlists</h1>
      <div className="flex flex-wrap flex-co; gap-y-20 w-full justify-around">
        {(function (playlist) {
          if (playlist && playlist.length > 0 && !isLoading) {
            return playlist.map((list, index) => (
              <div
                key={index}
                className="w-full rounded-[20px] mt-3 mr-3 text-white"
              >
                <div className="flex flex-row justify-between px-7 mt-6">
                  <div className="flex items-center md:text-4xl font-bold">
                    {list.playlist_name} playlist
                  </div>
                  <div className="flex flex-row space-x-3">
                    <button
                      className="bg-transparent border text-xs h-10 md:text-xl md:h-auto border-white hover:bg-green-300 hover:text-black"
                      onMouseDown={() => {
                        navigate(`/share/${list._id}`);
                      }}
                    >
                      Open
                    </button>
                    <button
                      className="bg-transparent border text-xs h-10 md:text-xl md:h-auto border-white hover:bg-green-300 hover:text-black"
                      onMouseDown={() => {
                        copyPlaylistLinkToClipbaord(list._id);
                      }}
                    >
                      Share
                    </button>
                  </div>
                </div>
                <div className="flex flex-row gap-7 ml-5 overflow-x-scroll">
                  {list.songs.map((music, _, self) => (
                    <motion.div
                      key={music.id}
                      layout
                      whileHover={{ scale: 1.1 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col mt-5 py-1"
                    >
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
                                setSelectedMusic(music.preview); // Update the selected music
                              } else if (audio && audio.paused) {
                                // If the same track is selected and paused, play it
                                audio.currentTime = 0; // Optional: restart from the beginning
                                audio.play();
                              }
                            }}
                          >
                            <FaPlay size={25} />
                          </div>
                          <div
                            className="text-green-300 rounded-full p-3 hover:bg-white hover:bg-opacity-20"
                            onMouseDown={() => {
                              if (audio) {
                                audio.pause();
                              }
                            }}
                          >
                            <FaPause size={25} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ));
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

export default Playlist;
