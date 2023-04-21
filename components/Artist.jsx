import { colors } from '@/lib/colors';
import { changeOpacity } from '@/lib/headerFunctions'
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { shuffle } from 'lodash';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Song from './Song';
import { PlayIcon } from '@heroicons/react/24/solid';


const Artist = ({ globalArtistId, setGlobalIsPlaying, setGlobalTrackId, setGlobalArtistId, setView }) => {
    const { data: session } = useSession()
    const [color, setColor] = useState(colors[0])
    const [artist, setArtist] = useState(null)
    const [opacity, setOpacity] = useState(0)
    const [textOpacity, setTextOpacity] = useState(0);
    const [topTracks, setTopTracks] = useState([])
    const [relatedArtists, setRelatedArtists] = useState([])

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

    function selectArtist(artist) {
        setGlobalArtistId(artist.id)
    }

    async function getArtistTracks(artistId) {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?` + new URLSearchParams({ market: "US" }), {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`
            }
        })
        const data = await response.json()
        console.log("top tracks", data)
        return data.tracks
    }

    async function getRelatedArtists(artistId) {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`
            }
        })
        const data = await response.json()
        return data.artists
    }

    async function getArtistData(artistId) {
        const response = await fetch(`https://api.spotify.com/v1/artists/${globalArtistId}`, {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`
            }
        })
        const data = await response.json()
        return data
    }

    useEffect(() => {
        async function f() {
            if (session && session.user && session.user.accessToken) {
                setTopTracks(await getArtistTracks(globalArtistId))
                setArtist(await getArtistData(globalArtistId))
                setRelatedArtists(await getRelatedArtists(globalArtistId))
            }
        }
        f()
        setColor(shuffle(colors).pop())
    }, [globalArtistId])

    return (
        <div className='flex-grow h-screen'>
            <header style={{ opacity: opacity }} className="text-white sticky top-0 h-20 z-10 text-4xl bg-neutral-800 p-8 flex items-center font-bold">
                <div style={{ opacity: textOpacity }} className="flex items-center gap-6">
                    {artist && <img className="h-8 w-8 rounded-full" src={artist?.images[0].url} />}
                    {artist?.name}
                </div>
            </header>
            <div onClick={() => signOut()} className="rounded-full absolute z-20 top-5 right-8 flex items-center bg-black bg-opacity-70 text-white space-x-3 opacity-90 hover:opacity-80 cursor-default p-1 pr-2">
                <img className='rounded-full w-7 h-7' src={session?.user.image} />
                <h2 className='text-sm'>Logout</h2>
                <ChevronDownIcon className="h-5 w-5" />
            </div>
            <div onScroll={(e) => changeOpacity(e.target.scrollTop)} className="relative -top-20 h-screen overflow-y-scroll bg-neutral-900">
                <section className={`flex items-end space-x-7 bg-gradient-to-b to-neutral-900 ${color} h-80 text-white p-8`}>
                    {artist && <img className="h-44 w-44 shadow-2xl rounded-full" src={artist?.images[0]?.url} alt="artist image" />}
                    <div>
                        <p className="text-white text-sm font-bold">Artist</p>
                        <h1 className="text-2xl font-extrabold md:text-3xl lg:text-4xl">{artist?.name}</h1>
                    </div>
                </section>
                <div className='px-8 text-xl font-bold text-white mb-4'>Popular</div>
                <div className="flex flex-col text-white space-y-1 px-8 pb-12">
                    {topTracks?.slice(0, 5).map((track, i) => {
                        return <Song
                            setGlobalIsPlaying={setGlobalIsPlaying}
                            setGlobalTrackId={setGlobalTrackId}
                            sno={i}
                            key={track.id}
                            track={{ track }}
                            setGlobalArtistId={setGlobalArtistId}
                            setView={setView}
                        />
                        // return <div key={track.track.id}>{track.track.name}</div>
                    })}
                </div>
                <div className='px-8 text-xl font-bold text-white mb-4'>Related Artists</div>
                <div className='flex flex-wrap gap-4 px-8 pb-28'>
                    {relatedArtists.slice(0, 4).map((artist) => {
                        return <div onClick={() => selectArtist(artist)} key={artist.id} className="cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4">
                            <div className="opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 shadow-2xl shadow-neutral-900 absolute z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 top-40 group-hover:top-36 right-8">
                                <PlayIcon className="h-6 w-6 text-black" />
                            </div>
                            <img className="w-48 h-48 mb-4 rounded-full" src={artist?.images[0]?.url} />
                            <p className="text-lg font-bold text-white mb-2 w-48 truncate">{artist?.name}</p>
                            <p className='text-sm text-neutral-400 mb-8 w-48 truncate'>Artist</p>
                        </div>
                    })}
                </div>
            </div>
        </div>
    );
}

export default Artist;
