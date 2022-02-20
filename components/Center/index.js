import { ChevronDownIcon, ClockIcon } from '@heroicons/react/outline';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../../atoms/playlistAtom";
import Songs from '../../components/Songs';
import { shuffle } from 'lodash';
import useSpotify from '../../hooks/useSpotify';

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500"
];

export default function index() {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [color, setColor] = useState(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);


    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistId])

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data) => {
            setPlaylist(data.body);
        }).catch((error) => console.log("Somenthing went wrong!", error));
    }, [spotifyApi, playlistId]);

    console.log(playlist);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide pb-24 relative">
        <header className="absolute top-5 right-8 ">
            <div className="flex items-center bg-dark-gray-spotify space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white " onClick={signOut}>
                <img className="rounded-full w-10 h-10" src={session?.user.image} alt=""/>
                <h2>{session?.user.name}</h2>
                <ChevronDownIcon className="h-5 w-5" />
            </div>
        </header>

        <section className={'flex items-end space-x-7 bg-gradient-to-b to-dark-gray-spotify ' + color + ' h-96 text-white p-10'}>
            <img className="h-56 w-56 shadow-2xl" src={playlist?.images?.[0]?.url} alt="Playlist Image" />
            <div className='space-y-4'>
                <p className="text-sm font-medium">PLAYLIST</p>
                <h2 className="text-5xl md:text-5xl xl:text-7xl font-bold">{playlist?.name}</h2>
                <h3 className="text-gray-400 text-sm md:text-1xl xl:text-sm">{playlist?.description}</h3>
            </div>
        </section>

        <br /> 

        <div className="flex flex-col space-y-1 pb28">
            <div className="bg-dark-gray-spotify grid grid-cols-2 text-gray-400 px-14 ">
                <div className="flex items-center space-x-4 ">
                    <p>#</p>
                    <p>Title</p>
                </div>
                <div className="flex items-center justify-between ml-auto md:ml-0">
                    <p>Album</p>
                    <ClockIcon className="w-5 h-5"/>
                </div>
            </div>
        </div>

        <div className="py-6 px-8">
            <hr className="border-t-[0.1px] border-gray-500" />
        </div>

        <div className="bg-dark-gray-spotify ">
            <Songs />
        </div>
    </div> 
  );
}
