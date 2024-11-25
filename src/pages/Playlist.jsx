import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import SignoutButton from "../components/signoutButton";

function Playlist() {
  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [audio, setAudio] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    (async function () {
      const user = await fetch(`${"http://localhost:4000"}/api/auth/user`, {
        method: "GET",
        credentials: "include",
      });

      const UserData = await user.json();
      if (UserData.error == "Authentication Failure") {
        navigate("/");
      }
    })();
  }, []);
  // Fetch playlists from the API
  async function fetchMyPlaylist() {
    try {
      setIsLoading(true);
      const res = await fetch(`${"http://localhost:4000"}/api/playlist`, {
        method: "GET",
        credentials: "include",
      });
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
      <div className="w-full flex items-start justify-between p-5">
        <button
          className="bg-transparent border-2 border-white border-opacity-30 text-white outline-none"
          onClick={() => navigate("/home")}
        >
          BACK
        </button>
        <SignoutButton/>
      </div>
      <h1>Your Playlists</h1>
      <div className="flex flex-wrap flex-row w-full justify-around">
        {(function (playlist) {
          if (playlist && playlist.length > 0 && !isLoading) {
            return playlist.map((list, index) => (
              <div
                key={index}
                className="w-[32%] border rounded-[20px] bg-[#242424] mt-3 mr-3"
              >
                <div className="text-2xl font-bold underline">
                  {list.playlist_name}
                </div>
                {list.songs.map((music) => (
                  <div
                    key={music.id}
                    className="flex flex-row space-x-2 p-5 w-full"
                  >
                    <img
                      src={music.album.cover_small}
                      className="min-w-20 max-w-20 max-h-20 rounded-[5px]"
                      alt="Album cover"
                    />
                    <div className="flex flex-col items-start w-full">
                      <div className="font-bold text-sm text-left">
                        {music.album.title}
                      </div>
                      <div className="italic text-left text-sm">
                        Artist: {music.artist.name}
                      </div>
                    </div>
                    <div className="flex items-end ">
                      <button
                        className="text-sm"
                        onClick={() => setSelectedMusic(music.preview)}
                      >
                        Play
                      </button>
                    </div>
                    <div className="flex items-end">
                      <button
                        className="text-sm"
                        onClick={() => {
                          if (audio) {
                            audio.pause();
                            setAudio(null);
                          }
                        }}
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ));
          } else if (isLoading) {
            return (
              <div className="mt-48 items-center">
                <h1 className="text-black"> Loading ...</h1>
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
