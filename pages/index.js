import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'


export default function Home() {
  const { data: session } = useSession()
  const [x, setX] = useState('')
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    async function f() {
      if (session && session.user && session.user.accessToken) {
        setX(session.user.accessToken)
        const response = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`
          }
        })
        const data = await response.json()
        setPlaylists(data.items)
      }
    }
    f()
  }, [session])
  // console.log(session.user.accessToken)
  // accessToken -> Spotify API -> 
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div>playlists:</div>
      {playlists.map((playlist) => <div key={playlist.id}>{playlist.name}</div>)}
      <div><button onClick={() => signOut()}>Sign out</button></div>
    </main>
  )
}
