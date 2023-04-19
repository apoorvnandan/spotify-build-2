import PlaylistView from '@/components/PlaylistView'
import Sidebar from '@/components/Sidebar'
import { useSession } from 'next-auth/react'
import { useState } from 'react'


export default function Home() {
  const { data: session } = useSession()
  const [view, setView] = useState("playlist") // {"playlist", "library", "search"}
  const [globalPlaylistId, setGlobalPlaylistId] = useState(null);

  return (
    <main className="bg-black h-screen overflow-hidden">
      <div className="flex w-full">
        {/* sidebar */}
        <Sidebar
          setGlobalPlaylistId={setGlobalPlaylistId}
        />
        {view == "playlist" && <PlaylistView globalPlaylistId={globalPlaylistId} />}
        {view == "search" && <div>search</div>}
        {view == "library" && <div>library</div>}
      </div>
      <div className="sticky bottom-0 z-50">
        {/* player */}
      </div>
    </main>
  )
}
