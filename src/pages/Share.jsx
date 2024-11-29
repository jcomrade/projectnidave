import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

function SharePlaylist() {
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
        `${"backend-ni-dave.vercel.app"}/api/playlist/${playlistId}`,
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
      {playlist && <h1>{playlist.owner} Playlist</h1>}
      <div className="w-full flex flex-col items-center mt-10">
        {(function (playlist) {
          console.log(playlist, "playlist");
          if (playlist && !isLoading) {
            return (
              <div className="w-[80%] p-5 flex flex-col items-center bg-[#242424] rounded-2xl">
                <div className="text-2xl font-bold underline">
                  {playlist.playlist_name}
                </div>
                {playlist.songs.map((music) => (
                  <div
                    key={music.id}
                    className="flex w-full flex-row space-x-4 mt-5 p-5 border rounded-[20px] bg-[#242424]"
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
                    <div className="flex items-end space-x-3">
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
            );
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

export default SharePlaylist;
