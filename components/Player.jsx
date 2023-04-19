import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const Player = ({ globalTrackId, setGlobalTrackId, globalIsPlaying, setGlobalIsPlaying }) => {
    const { data: session } = useSession()
    const [currentTrack, setCurrentTrack] = useState(null)

    async function getCurrentlyPlaying() {
        try {
            const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            })
            const data = await response.json()
            return data
        } catch (error) {
            return {
                "error": "error getting currently playing"
            }
        }

    }

    async function handlePlayPause() {
        // if a track is playing -> spotify api pause
        // if a track is not playing -> spotify api play
        const currentlyPlaying = await getCurrentlyPlaying()
        if ("error" in currentlyPlaying) return;
        if (currentlyPlaying.is_playing) {
            const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            })
            if (response.status == 204) {
                setGlobalIsPlaying(false)
            }
        } else {
            const response = await fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            })
            if (response.status == 204) {
                setGlobalIsPlaying(true)
            }
        }
    }


    useEffect(() => {
        async function fetchTrackInfo(trackId) {
            if (trackId) {
                const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`
                    }
                })
                const data = await response.json()
                setCurrentTrack(data)
            }
        }

        async function f() {
            console.log({ globalTrackId })
            if (session && session.user && session.user.accessToken) {
                if (!globalTrackId) {
                    const data = await getCurrentlyPlaying()
                    setGlobalTrackId(data?.item?.id)
                    if (data?.is_playing) {
                        setGlobalIsPlaying(true)
                    }
                    setCurrentTrack(data?.item)
                } else {
                    await fetchTrackInfo(globalTrackId)
                }
            }
        }
        f()
    }, [globalTrackId, session]);

    return (
        <div className="h-24 bg-neutral-800 border-t border-neutral-700 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            <div className="flex items-center space-x-4">
                {currentTrack?.album?.images[0]?.url && <img className='hidden md:inline h-10 w-10' src={currentTrack?.album?.images[0]?.url} />}
                <div>
                    <h3 className='text-white text-sm'>{currentTrack?.name}</h3>
                    <p className='text-neutral-400 text-xs'>{currentTrack?.artists[0]?.name}</p>
                </div>
            </div>
            <div className="flex items-center justify-evenly">
                {globalIsPlaying ? <PauseCircleIcon onClick={handlePlayPause} className="cursor-default h-10 w-10" /> : <PlayCircleIcon onClick={handlePlayPause} className="cursor-default h-10 w-10" />}
            </div>
            <div></div>
        </div>
    );
}

export default Player;
