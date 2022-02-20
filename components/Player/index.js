import { 
    HeartIcon,
    VolumeUpIcon as VolumeDownIcon
 } from '@heroicons/react/outline';
import {    
    RewindIcon,
    SwitchHorizontalIcon,
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    VolumeUpIcon    
} from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../../atoms/songAtom';
import { debounce } from 'lodash';
import useSpotify from '../../hooks/useSpotify';
import useSongInfo from '../../hooks/useSongInfo';
import { InputRange } from '../InputRange';

export default function index() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) =>{
                console.log("Now Playing: ", data.body?.item);
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                })
            })
        }
    }

    const handlePlayPause = () =>{
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    },[currentTrackId, spotifyApi, session])

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume);
        }
    }, [volume])

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((error) => {});
        }, 500), [],
    );

  return (
    <div className="h-24 bg-gray-spotify text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8 border-t border-gray-800">
        <div className="flex items-center space-x-4 ">
            <img className="hidden md:inline h-16 w-16" src={songInfo?.album.images?.[0]?.url} alt=""/>
            <div>
                <div>
                    <p className="font-bold text-md">{songInfo?.name}</p>
                    <p className="text-sm text-gray-500 hover:text-white truncate">{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            <HeartIcon className="h-5 w-5 text-gray-500 hover:text-white"/>
        </div>

        <div className="flex items-center justify-evenly">
            <SwitchHorizontalIcon className="button" />
            <RewindIcon className="button" /> {/*onClick={() => spotifyApi.skipToPrevious()}*/}

            {isPlaying ? (
                <PauseIcon className="button w-10 h-10" onClick={handlePlayPause} />
            ):(
                <PlayIcon className="button w-10 h-10" onClick={handlePlayPause} />
            )}

            <FastForwardIcon className="button" /> {/*onClick={() => spotifyApi.skipToNext()}*/}

            <ReplyIcon className="button" />
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
            <VolumeDownIcon className="h-5 w-5" />
            <InputRange min={0} max={100} step={10} initValue={volume} onChange={setVolume} />
        </div>
    </div>
  )
}