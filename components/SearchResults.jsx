import { PlayIcon } from '@heroicons/react/24/solid';
import React from 'react';

const SearchResults = ({ playlists, songs, artists, setView, setGlobalPlaylistId }) => {
    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return (
            seconds == 60 ?
                (minutes + 1) + ":00" :
                minutes + ":" + (seconds < 10 ? "0" : "") + seconds
        );
    }
    function selectPlaylist(playlist) {
        setGlobalPlaylistId(playlist.id)
        setView("playlist")
    }
    return (
        <div className='flex flex-col gap-8 px-8 h-screen overflow-y-scroll'>
            <div className='grid grid-cols-2'>
                <div className='space-y-4'>
                    <h2 className='text-xl font-bold'>Top result</h2>
                    <div className='h-64 pr-8'>
                        <div className='cursor-pointer relative group h-64 w-full bg-neutral-800 hover:bg-neutral-700 p-4 flex flex-col gap-6 rounded-md transition duration-500'>
                            <div className="opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-500 shadow-2xl shadow-neutral-900 absolute z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 bottom-6 group-hover:bottom-8 right-8">
                                <PlayIcon className="h-6 w-6 text-black" />
                            </div>
                            {playlists && <><img className='h-28 w-28 rounded' src={playlists[0].images[0].url} />
                                <p className='text-3xl font-bold'>{playlists[0].name}</p>
                                <p className='text-sm text-neutral-400'>By {playlists[0].owner.display_name} <span className='text-white font-bold ml-4 bg-neutral-900 rounded-full py-1 px-4'>Playlist</span></p>
                            </>}
                        </div>
                    </div>
                </div>
                <div className='space-y-4'>
                    <h2 className='text-xl font-bold'>Top result</h2>
                    <div className='flex flex-col'>
                        {songs.slice(0, 4).map((song) => {
                            return <div key={song.id} className='cursor-default w-full h-16 px-4 rounded-md flex items-center gap-4 hover:bg-neutral-700'>
                                <img className='h-10 w-20' src={song.album.images[0].url} />
                                <div>
                                    <p>{song.name}</p>
                                    <p className='text-sm text-neutral-400'>{song.artists[0].name}</p>
                                </div>
                                <div className='flex-grow flex items-center justify-end'>
                                    <p className='text-sm text-neutral-400'>{millisToMinutesAndSeconds(song.duration_ms)}</p>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <div className='space-y-4'>
                <h2 className='text-xl font-bold'>Artists</h2>
                <div className='flex flex-wrap gap-4'>
                    {artists.slice(0, 4).map((artist) => {
                        return <div key={artist.id} className="cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4">
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
            <div className='space-y-4 mb-48'>
                <h2 className='text-xl font-bold'>Playlists</h2>
                <div className='flex flex-wrap gap-4'>
                    {playlists.slice(0, 4).map((playlist) => {
                        return <div onClick={() => selectPlaylist(playlist)} key={playlist.id} className="cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4">
                            <div className="opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 shadow-2xl shadow-neutral-900 absolute z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 top-[156px] group-hover:top-[148px] right-6">
                                <PlayIcon className="h-6 w-6 text-black" />
                            </div>
                            <img className="w-48 h-48 mb-4" src={playlist.images[0].url} />
                            <p className="text-base text-white mb-1 w-32 truncate">{playlist.name}</p>
                            <p className='text-sm text-neutral-400 mb-8 w-32 truncate'>By {playlist.owner.display_name}</p>
                        </div>
                    })}
                </div>
            </div>
        </div>
    );
}

export default SearchResults;
