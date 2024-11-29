import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import SignoutButton from "../components/signoutButton";

function Home() {
  const [musicList, setMusicList] = useState([]);
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
      const user = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user`, {
        method: "GET",
        credentials: "include",
      });

      const UserData = await user.json();
      if (UserData.error == "Authentication Failure") {
        navigate("/");
      }
    })();
  }, []);

  async function createPlaylist() {
    try {
      setPlaylistCreationLoading(true);
      setPlaylistError(null); // Clear any previous errors

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playlist`, {
        method: "POST",
        body: JSON.stringify({ songs: musicList, playlist_name: playlistName }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

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
      setPlaylistCreationStatus(false);
      setPlaylistError(null)
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
      setSelectedMood(mood);
      setSelectedMusic(null); // Reset selected music to stop current playback
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-screen flex flex-col px-10">
      <div className="flex justify-between mt-5">
        <button
          className="bg-transparent border-2 border-white border-opacity-30 text-white outline-none"
          onClick={() => navigate("/playlist")}
        >
          View My Playlist
        </button>
        <SignoutButton />
      </div>
      <div className="flex flex-row justify-center space-x-5">
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
              src={`src/assets/${mood}.png`}
              alt={mood}
              className="w-[100px] h-[100px]"
            />
          </div>
        ))}
      </div>
      <h1>Select a Mood</h1>
      <div>
        {selectedMood && (
          <div className="text-2xl">
            <span className="font-bold">{selectedMood}</span> Music List
          </div>
        )}
        {musicList && musicList.length > 0 && (
          <div className="flex flex-col items-center justify-center space-y-3 mt-5">
            <div className="flex flex-col space-y-3">
              {!playlistCreationLoading && !playlistCreationStatus ? (
                <>
                  <button className="w-50" onClick={() => createPlaylist()}>
                    Create This Playlist
                  </button>
                  <input
                    className="bg-white px-3 text-black text-lg"
                    placeholder="Playlist Name..."
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                  />
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
        <div className="w-full flex flex-col items-center">
          {musicList &&
            musicList.map((music, _, self) => (
              <div
                key={music.id}
                className="flex flex-row space-x-4 mt-5 p-5 w-[95%] border rounded-[20px] bg-[#242424]"
              >
                <img
                  src={music.album.cover_small}
                  className="min-w-40 max-w-40 rounded-[10px]"
                  alt="Album cover"
                />
                <div className="flex flex-col items-start w-full">
                  <div className="font-bold text-2xl text-left">
                    {music.album.title}
                  </div>
                  <div className="italic text-left text-2xl">
                    Artist: {music.artist.name}
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
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
                    Play
                  </button>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <button
                    className="bg-red-900"
                    onClick={() => {
                      const data = self.filter((item) => item.id != music.id);
                      setMusicList(data);
                    }}
                  >
                    X
                  </button>
                  <button
                    onClick={() => {
                      if (audio) {
                        audio.pause();
                      }
                    }}
                  >
                    Stop
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
