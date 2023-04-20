import { PlayIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

const Song = ({ sno, track, setGlobalTrackId, setGlobalIsPlaying }) => {
    const { data: session } = useSession()
    const [hover, setHover] = useState(false)

    async function playSong(trackId, trackUri) {
        if (session && session.user && session.user.accessToken) {
            setGlobalTrackId(trackId)
            setGlobalIsPlaying(true)
            const response = await fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                },
                body: JSON.stringify({
                    uris: [trackUri]
                })
            })
        }
    }

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return (
            seconds == 60 ?
                (minutes + 1) + ":00" :
                minutes + ":" + (seconds < 10 ? "0" : "") + seconds
        );
    }
    return (
        <div onClick={() => playSong(track.track.id, track.track.uri)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="grid grid-cols-2 text-neutral-400 text-sm py-4 px-5 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-default">
            <div className='flex items-center space-x-4'>
                {hover ? <PlayIcon className="w-5 h-5 text-white grow-0 shrink-0" /> : <p className="w-5 grow-0 shrink-0">{sno + 1}</p>}
                <img className='h-10 w-10' src={track.track.album.images[0]?.url} />
                <div>
                    <p className="w-36 lg:w-64 truncate text-white text-base">{track.track.name}</p>
                    <p className="w-36 lg:w-64 truncate">{track.track.artists[0].name}</p>
                </div>

            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className='w-40 truncate hidden md:inline'>{track.track.album.name}</p>
                <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
            </div>
        </div>
    );
}

export default Song;
