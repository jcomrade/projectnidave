import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { FaPlay, FaPause, FaTrashCan } from "react-icons/fa6";
import SignoutButton from "../components/signoutButton";
import { PiPlusCircle } from "react-icons/pi";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [musicList, setMusicList] = useState([]);
  const [visibleMusicList, setVisibleMusicList] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistError, setPlaylistError] = useState(null);
  const [playlistCreationLoading, setPlaylistCreationLoading] = useState(false);
  const [playlistCreationStatus, setPlaylistCreationStatus] = useState(false);
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
      if (UserData.error) {
        navigate("/");
      }
    })();
  }, []);

  function addFiveMusic() {
    console.log("visible: ", visibleMusicList)
    console.log("original: ", musicList)
    const currentLength = visibleMusicList.length;
    const nextBatch = musicList.slice(currentLength, currentLength + 5); // Extract next 5 songs
    setVisibleMusicList([...visibleMusicList,...nextBatch]); // Append new batch immutably
  }

  async function createPlaylist() {
    try {
      setPlaylistCreationLoading(true);
      setPlaylistError(null); // Clear any previous errors

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playlist`,
        {
          method: "POST",
          body: JSON.stringify({
            songs: visibleMusicList,
            playlist_name: playlistName,
          }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await res.json();
      setPlaylistCreationLoading(false);

      // Check for an error in the response
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create playlist");
      }

      setPlaylistCreationStatus(true);
    } catch (err) {
      setPlaylistCreationLoading(false);
      setPlaylistCreationStatus(false);
      setPlaylistError(err.message || "An error occurred");
    }
  }

  useEffect(() => {
    if (audio) {
      audio.pause(); // Stop any previously playing audio
      audio.currentTime = 0; // Reset the audio
    }

    if (selectedMusic) {
      const newAudio = new Audio(selectedMusic);
      newAudio.play();
      setAudio(newAudio);

      // Cleanup on unmount or track change
      return () => {
        newAudio.pause();
        newAudio.currentTime = 0;
      };
    }
  }, [selectedMusic]);

  useEffect(() => {
    if (audio) {
      audio.pause(); // Stop audio when mood changes
    }
  }, [selectedMood]);

  const moodMusicMapping = {
    DEPRESSED: "Acoustic%20Pop",
    // FOCUSED: "Lo%20fi%20Beats",
    TIRED: "Acoustic%20Indie",
    MOTIVATED: "Upbeat%20Pop",
    SAD: "Sad%20Songs",
    ANXIOUS: "Ambient",
    // NERVOUS: "Gentle%20Acoustic",
    GOOD: "Upbeat%20Pop",
    WORRIED: "Calm%20Classical",
    AFRAID: "Reassuring%20Acoustic",
    GRUMPY: "Funk",
    ANNOYED: "Instrumental%20Indie",
    // SLEEPY: "Classical",
    // SICK: "Gentle%20Relaxing",
  };

  async function fetchMusic(mood) {
    try {
      setIsLoading(true)
      setPlaylistCreationStatus(false);
      setPlaylistError(null);
      const musicType = moodMusicMapping[mood];
      const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${musicType}`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "dcb7e40b0amsh111467a34a67559p1edb11jsn198f6d89c4a2",
          "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        },
      };
      const response = await fetch(url, options);
      const result = await response.json();
      setMusicList(result.data);
      setVisibleMusicList(result.data.splice(0, 5));
      setSelectedMood(mood);
      setSelectedMusic(null); // Reset selected music to stop current playback
      setIsLoading(false)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-screen flex flex-col">
      <div className="flex justify-between pt-3 pb-3 px-10 w-full bg-[#011425]">
        <p className="text-5xl font-semibold text-[#FFFFFF]">FEEL BEAT</p>
        <div className="flex space-x-5">
          <button
            className="bg-transparent outline-none hover:bg-blue-300 text-[#FFFFFF] hover:text-black"
            onClick={() => navigate("/playlist")}
          >
            View My Playlist
          </button>
          <SignoutButton />
        </div>
      </div>
      <h1 className="font-medium mt-10 mb-5 text-white">Select A Mood</h1>
      <div className="flex flex-wrap flex-row justify-center space-x-5">
        {Object.keys(moodMusicMapping).map((mood) => (
          <div
            key={mood}
            className={`cursor-pointer ${
              selectedMood === mood &&
              "border-4 border-black bg-opacity-50 rounded-3xl"
            }`}
            onMouseDown={() => fetchMusic(mood)}
          >
            <img
              src={`/${mood}.png`}
              alt={mood}
              className="max-w-[100px] max-h-[100px]"
            />
          </div>
        ))}
      </div>
      <div>
        {musicList && musicList.length > 0 && (
          <div className="flex flex-col items-center justify-center space-y-3 mt-5">
            <div className="flex flex-col space-y-3">
              {!playlistCreationLoading && !playlistCreationStatus ? (
                <>
                  <div className="flex flex-row space-x-10">
                    <input
                      className="bg-white px-3 text-black text-lg border-2 border-black rounded-xl"
                      placeholder="Playlist Name..."
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                    />
                    <button
                      className="w-50 border-2 border-black rounded-2xl bg-blue-300 hover:bg-green-500"
                      onClick={() => createPlaylist()}
                    >
                      Create This Playlist
                    </button>
                  </div>
                  {playlistError && (
                    <p className="text-white bg-red-500 p-2 rounded-md">
                      {playlistError}
                    </p>
                  )}
                </>
              ) : playlistCreationStatus ? (
                <div className="bg-green-500 text-black p-3 rounded-md">
                  Playlist Created!
                </div>
              ) : (
                <div className="text-lg">Loading ...</div>
              )}
            </div>
          </div>
        )}
        {selectedMood && (
          <div className="text-5xl mt-5 mb-5 w-full flex items-start  ">
            <span className="font-bold text-white pl-14">
              {selectedMood} Music List
            </span>
          </div>
        )}
        <div className="w-full flex flex-wrap gap-x-10 gap-y-5 items-center justify-center">
          {musicList && !isLoading &&
            visibleMusicList.map((music, _, self) => (
              <div key={music.id} className="flex flex-col mt-5 py-1">
                <img
                  src={music.album.cover_small}
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
                  <div
                    className="flex justify-center items-center text-white rounded-full opacity-50 hover:opacity-100 hover:text-red-600 hover:cursor-pointer"
                    onClick={() => {
                      const data = self.filter((item) => item.id != music.id);
                      setVisibleMusicList(data);
                      const newOrigData = musicList.filter((item) => item.id != music.id);
                      setMusicList(newOrigData);
                    }}
                  >
                    <FaTrashCan size={25} />
                  </div>
                </div>
              </div>
            ))}
          {isLoading && (
            <div className="w-full text-white font-semibold text-4xl h-full">
              Loading...
            </div>
          )}
          {!isLoading && musicList.length > 0 && musicList.length > visibleMusicList.length && (
            <div className="h-48 w-48 flex justify-center">
              <PiPlusCircle
                onMouseDown={() => {
                  addFiveMusic();
                }}
                className="text-white"
                size={100}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
