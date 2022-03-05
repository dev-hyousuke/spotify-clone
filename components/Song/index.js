import useSpotify from '../../hooks/useSpotify';
import { millisToMinutesAndSeconds } from '../../lib/time';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../../atoms/songAtom';
import { useState } from 'react';
import { PlayIcon } from '@heroicons/react/solid';

export default function index({ track, order }) {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [isHovered, setIsHovered] = useState(false);

    const toggleHover = () => {
        if (isHovered == true) {   
            setIsHovered(false);
        }else{    
            setIsHovered(true);
        }
    }

    const playSong = () => {
        console.log("token ="+ spotifyApi.getAccessToken());
        setCurrentTrackId(track.track.id);
        setIsPlaying(true);
        spotifyApi.play({
            uris: [track.track.uri],
        });
    };

  return (
      <div className="grid grid-cols-2 text-gray-400 py-4 px-5 hover:bg-gray-700 hover:text-white rounded-lg cursor-pointer" onClick={playSong} onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
        <div className="flex items-center space-x-4">
            {isHovered ?
                <PlayIcon className="h-5 w-5" />:
                <p className="h-5 w-5" >{order + 1}</p>
            }
            <img className="h-10 w-10" src={track.track?.album?.images?.[0].url} />
            <div>
                <p className="w-36 lg:w-64 text-white truncate">{track.track.name}</p>
                <p className="w-40 truncate">{track.track.artists?.[0].name}</p>
            </div>
        </div>
        <div className="flex items-center justify-between ml-auto md:ml-0">
            <p className="w-40 hidden  md:inline truncate">{track.track.album.name}</p>
            <p>{millisToMinutesAndSeconds(track?.track?.duration_ms)}</p>
        </div>
      </div>
  )
}