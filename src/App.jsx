import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [musicList, setMusicList] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [audio, setAudio] = useState(null);

  // This effect stops current audio whenever selectedMusic changes
  useEffect(() => {
    if (audio) {
      audio.pause(); // Stop any previously playing audio
    }
    if (selectedMusic) {
      const newAudio = new Audio(selectedMusic);
      newAudio.play();
      setAudio(newAudio);
    }
  }, [selectedMusic]);

  // This effect stops audio when a new emoji is selected
  useEffect(() => {
    if (audio) {
      audio.pause(); // Stop audio when emoji changes
    }
  }, [selectedEmoji]);

  async function fetchMusic(musicType, emoji) {
    try {
      const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${musicType}`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": "dcb7e40b0amsh111467a34a67559p1edb11jsn198f6d89c4a2",
          "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        },
      };
      const response = await fetch(url, options);
      const result = await response.json();
      setMusicList(result.data);
      setSelectedEmoji(emoji);
      setSelectedMusic(null); // Reset selected music to stop current playback
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="flex flex-row justify-center">
        <div
          className={`text-[100px] cursor-pointer ${
            selectedEmoji === "HAPPY" &&
            "border-4 border-black bg-green-600 bg-opacity-50 rounded-3xl"
          }`}
          onMouseDown={() => fetchMusic("Joyful%20Mood%20song", "HAPPY")}
        >
          😊
        </div>
        <div
          className={`text-[100px] cursor-pointer ${
            selectedEmoji === "SAD" &&
            "border-4 border-black bg-slate-600 bg-opacity-50 rounded-3xl"
          }`}
          onMouseDown={() => fetchMusic("emotional%20Mood%20song", "SAD")}
        >
          😢
        </div>
        <div
          className={`text-[100px] cursor-pointer ${
            selectedEmoji === "ANGRY" &&
            "border-4 border-black bg-red-600 bg-opacity-50 rounded-3xl"
          }`}
          onMouseDown={() => fetchMusic("Hardcore%20Metal%20Music", "ANGRY")}
        >
          😠
        </div>
      </div>
      <h1>Select an emoji</h1>
      <div>
        {selectedEmoji && (
          <div className="text-2xl">
            <span className="font-bold">{selectedEmoji}</span> Music List
          </div>
        )}
        {musicList &&
          musicList.map((music) => (
            <div
              key={music.id}
              className="flex flex-row space-x-4 mt-5 p-5 w-full border rounded-[20px] bg-[#242424]"
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
              <div>
                <button
                  onClick={() => setSelectedMusic(music.preview)}
                >
                  Play
                </button>
              </div>
              <div>
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
  );
}

export default App;
