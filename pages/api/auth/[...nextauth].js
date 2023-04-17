import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import fetch from "node-fetch"

async function refreshAccessToken(token) {
    try {
        const params = new URLSearchParams()
        params.append("grant_type", "refresh_token")
        params.append("refresh_token", token.refreshToken)
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64'))
            },
            body: params
        })
        const refreshedToken = await response.json()
        console.log(refreshedToken)
        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken
        }
    } catch (error) {
        console.error(error)
        return {
            ...token,
            error: "error refreshing access token"
        }
    }
}

const scopes = [
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative"
].join(",")

const params = {
    scope: scopes
}

const query = new URLSearchParams(params)

const LOGIN_URL = "https://accounts.spotify.com/authorize?" + query.toString()

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_SECRET,
            authorization: LOGIN_URL
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, account, user }) {
            console.log('JWT')
            console.log(account)
            console.log(user)
            // initial sign in
            if (account && user) {
                console.log("sign in")
                console.log("account", account)
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000
                }
            }

            // if the token is valid
            if (Date.now() < token.accessTokenExpires) {
                return token
            }

            return refreshAccessToken(token)
        },

        async session({ session, token }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.user.accessToken = token.accessToken
            session.user.refreshToken = token.refreshToken
            session.user.username = token.username
            return session
        }
    }
}

export default NextAuth(authOptions)