import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Song from './Song';
import { shuffle } from 'lodash';
import { colors } from '@/lib/colors';
import { changeOpacity } from '@/lib/headerFunctions';

const PlaylistView = ({ globalPlaylistId, setGlobalTrackId, setGlobalIsPlaying, setView, setGlobalArtistId }) => {
    const { data: session } = useSession()
    const [color, setColor] = useState(colors[0])
    const [opacity, setOpacity] = useState(0)
    const [textOpacity, setTextOpacity] = useState(0);
    const [playlistState, setPlaylistState] = useState(null)

    function changeOpacity(scrollPos) {
        // scrollPos = 0 -> opacity = 0
        // scrollPos = 300 -> opacity = 1
        const offset = 300
        let newOpacity = 1 - (offset - scrollPos) / offset
        setOpacity(newOpacity)
        // till scorllPos = 300 -> textOpacity = 0
        // scrollPos = 310 => textOpacity = 1
        const textTransition = 10
        let delta = 0
        if ((scrollPos - offset) > 0) delta = scrollPos - offset
        setTextOpacity(1 - ((textTransition - delta) / textTransition))
    }

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [globalPlaylistId])

    useEffect(() => {
        async function f() {
            if (session && session.user && session.user.accessToken && globalPlaylistId) {
                const response = await fetch(`https://api.spotify.com/v1/playlists/${globalPlaylistId}`, {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`
                    }
                })
                console.log(response.status)
                const data = await response.json()
                setPlaylistState(data)
            }
        }
        f()
    }, [session, globalPlaylistId])


    return (
        <div className="flex-grow h-screen">
            <header style={{ opacity: opacity }} className="text-white sticky top-0 h-20 z-10 text-4xl bg-neutral-800 p-8 flex items-center font-bold">
                <div style={{ opacity: textOpacity }} className="flex items-center gap-6">
                    <img className="h-8 w-8" src={playlistState?.images[0].url} />
                    {playlistState?.name}
                </div>
            </header>
            <div onClick={() => signOut()} className="rounded-full absolute z-20 top-5 right-8 flex items-center bg-black bg-opacity-70 text-white space-x-3 opacity-90 hover:opacity-80 cursor-default p-1 pr-2">
                <img className='rounded-full w-7 h-7' src={session?.user.image} />
                <h2 className='text-sm'>Logout</h2>
                <ChevronDownIcon className="h-5 w-5" />
            </div>
            <div onScroll={(e) => changeOpacity(e.target.scrollTop)} className="relative -top-20 h-screen overflow-y-scroll bg-neutral-900">
                <section className={`flex items-end space-x-7 bg-gradient-to-b to-neutral-900 ${color} h-80 text-white p-8`}>
                    {playlistState && <img className="h-44 w-44 shadow-2xl" src={playlistState?.images[0]?.url} alt="playlist image" />}
                    <div>
                        <p className="text-white text-sm font-bold">Playlist</p>
                        <h1 className="text-2xl font-extrabold md:text-3xl lg:text-4xl">{playlistState?.name}</h1>
                    </div>
                </section>
                <div className="flex flex-col text-white space-y-1 px-8 pb-28">
                    {playlistState?.tracks.items.map((track, i) => {
                        return <Song
                            setGlobalIsPlaying={setGlobalIsPlaying}
                            setGlobalTrackId={setGlobalTrackId}
                            sno={i}
                            key={track.track.id}
                            track={track}
                            setGlobalArtistId={setGlobalArtistId}
                            setView={setView}
                        />
                        // return <div key={track.track.id}>{track.track.name}</div>
                    })}
                </div>
            </div>
        </div>
    );
}

export default PlaylistView;
