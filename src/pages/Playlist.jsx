import { Copy } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "../components/ui/button.jsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog.jsx";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { motion } from "motion/react";
import SignoutButton from "../components/signoutButton";
import { FaPlay, FaPause } from "react-icons/fa6";
import { useAuth0 } from "@auth0/auth0-react";

function Playlist() {
  const [musicPlaying, setMusicPlaying] = useState("");
  const {
    loginWithRedirect,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();
  const [playlist, setPlaylist] = useState([]);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [audio, setAudio] = useState(null);
  const navigate = useNavigate();

  function copyPlaylistLinkToClipbaord(playlistId) {
    const frontendUrl = window.location.origin;
    navigator.clipboard.writeText(`${frontendUrl}/share/${playlistId}`);
  }

  async function fetchMyPlaylist() {
    try {
      setIsFetchLoading(true);

      let token;
      try {
        token = await getAccessTokenSilently({
          audience: `${import.meta.env.VITE_BACKEND_URL}`,
        });
        console.log(token);
      } catch (err) {
        setIsFetchLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playlist/all`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            owner: {
              email: user.email,
              name: user.given_name,
            },
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      setPlaylist(data);
      setIsFetchLoading(false);
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
      <div className="flex justify-between px-3 py-1 md:pt-3 md:pb-3 md:px-10 w-full bg-[#011425]">
        <div className="flex items-center">
          <p className="text-2xl md:text-5xl font-semibold text-[#FFFFFF]">
            FEEL BEAT
          </p>
        </div>
        <div className="flex space-x-5">
          {!isLoading && isAuthenticated ? (
            <SignoutButton />
          ) : (
            loginWithRedirect()
          )}
        </div>
      </div>
      <div className="w-full flex items-start justify-between p-5">
        <button
          className="bg-transparent border-2 text-xs h-10 md:text-xl md:h-auto border-white border-opacity-30 text-white outline-none"
          onClick={() => navigate("/")}
        >
          BACK
        </button>
      </div>
      <h1 className="text-white font-bold">Your Playlists</h1>
      <div className="flex flex-wrap flex-co; gap-y-20 w-full justify-around">
        {(function (playlist) {
          if (playlist && playlist.length > 0 && !isFetchLoading) {
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
                        if (audio) {
                          audio.pause(); // Stop any previously playing audio
                          audio.currentTime = 0; // Reset the audio
                        }
                        navigate(`/share/${list._id}`);
                      }}
                    >
                      Open
                    </button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-transparent rounded-lg border-white border text-xs h-10 md:text-xl md:h-auto hover:bg-blue-400 hover:text-black">
                          Share
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-custom-radial">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            Scan QR Code
                          </DialogTitle>
                          <div className="w-full flex justify-center">
                            <QRCode
                              size={150}
                              style={{
                                height: "auto",
                                maxWidth: "75%",
                                width: "100%",
                              }}
                              value={`${window.location.origin}/${list._id}`}
                              viewBox={`0 0 150 150`}
                            />
                          </div>
                          <DialogTitle className="text-white">
                            Share link
                          </DialogTitle>
                          <DialogDescription className="text-white">
                            Anyone who has this link will be able to view this.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                          <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                              Link
                            </Label>
                            <Input
                              className="text-white"
                              id="link"
                              defaultValue={`${window.location.origin}/${list._id}`}
                              readOnly
                            />
                          </div>
                          <Button type="submit" size="sm" className="px-3" onClick={()=>copyPlaylistLinkToClipbaord(list._id)}>
                            <span className="sr-only">Copy</span>
                            <Copy />
                          </Button>
                        </div>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="flex flex-row gap-7 ml-5 overflow-x-auto overflow-y-clip">
                  {list.songs.map((music, _, self) => (
                    <motion.div
                      key={music.id}
                      layout
                      whileHover={{ scale: 1.1 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col mt-4 mb-3"
                    >
                      <div
                        className={`text-left ${
                          musicPlaying === music.id &&
                          selectedMusic?.playlist_name === list.playlist_name
                            ? "visible"
                            : "invisible"
                        } `}
                      >
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
                          {musicPlaying !== music.id ||
                          selectedMusic?.playlist_name !==
                            list.playlist_name ? (
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
                                  setSelectedMusic({
                                    ...music,
                                    playlist_name: list.playlist_name,
                                  }); // Update the selected music
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
            ));
          } else if (isFetchLoading) {
            return (
              <div className="mt-48 items-center">
                <h1 className="text-white font-semibold"> Loading ...</h1>
              </div>
            );
          } else {
            return (
              <div className="font-semibold text-lg text-white">
                No playlists available.
              </div>
            );
          }
        })(playlist)}
      </div>
    </div>
  );
}

export default Playlist;
