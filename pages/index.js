import Library from '@/components/Library'
import Player from '@/components/Player'
import PlaylistView from '@/components/PlaylistView'
import Search from '@/components/Search'
import Sidebar from '@/components/Sidebar'
import { useSession } from 'next-auth/react'
import { useState } from 'react'


export default function Home() {
  const { data: session } = useSession()
  const [view, setView] = useState("playlist") // {"playlist", "library", "search"}
  const [globalPlaylistId, setGlobalPlaylistId] = useState(null);
  const [globalTrackId, setGlobalTrackId] = useState(null)
  const [globalIsPlaying, setGlobalIsPlaying] = useState(false)

  return (
    <main className="bg-black h-screen overflow-hidden">
      <div className="flex w-full">
        {/* sidebar */}
        <Sidebar
          setGlobalPlaylistId={setGlobalPlaylistId}
          view={view}
          setView={setView}
        />
        {view == "playlist" && <PlaylistView
          globalPlaylistId={globalPlaylistId}
          setGlobalTrackId={setGlobalTrackId}
          setGlobalIsPlaying={setGlobalIsPlaying}
        />}
        {view == "search" && <Search
          setGlobalPlaylistId={setGlobalPlaylistId}
          setView={setView}
        />}
        {view == "library" && <Library
          setGlobalPlaylistId={setGlobalPlaylistId}
          setView={setView}
        />}
      </div>
      <div className="sticky bottom-0 z-50">
        <Player
          globalTrackId={globalTrackId}
          setGlobalTrackId={setGlobalTrackId}
          globalIsPlaying={globalIsPlaying}
          setGlobalIsPlaying={setGlobalIsPlaying}
        />
      </div>
    </main>
  )
}
