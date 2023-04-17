import { signIn } from 'next-auth/react';
import React from 'react';

const Login = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <button onClick={() => {
                signIn('spotify', { callbackUrl: "/" })
            }}>Login with Spotify</button>
        </div>
    );
}

export default Login;
