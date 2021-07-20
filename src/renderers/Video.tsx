import React, {useState, useEffect, useRef} from 'react';
import Spinner from '../components/Spinner';
import { Renderer, Tester } from './../interfaces';
import WithHeader from './wrappers/withHeader';
import WithSeeMore from './wrappers/withSeeMore';

export const renderer: Renderer = ({ story, action, isPaused, config, messageHandler }) => {
    const [loaded, setLoaded] = useState(false);
    const [muted, setMuted] = useState(true);
    const { width, height, loader, storyStyles } = config;

    let computedStyles = {
        ...styles.storyContent,
        ...(storyStyles || {})
    }

    let vid = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (vid.current) {
            if (isPaused) {
                vid.current.pause();
            } else {
                vid.current.play().catch(() => { });
            }
        }
    }, [isPaused]);

    useEffect(() => {
        if (!loaded) {
            action('pause', true)
        }
    }, [loaded])

    // BUG: on slow network when the video is buffering the onWaiting function is called
    // but after that this slide never goes back to playing
    const onWaiting = () => {
        action("pause", true);
    }

    const onPlaying = () => {
        action("play", true);
    }

    const videoLoaded = () => {
        messageHandler('UPDATE_VIDEO_DURATION', { duration: vid.current.duration });
        setLoaded(true);
        vid.current.play().then(() => {
            action('play');
        }).catch(() => {
            vid.current.play().finally(() => {
                action('play');
            })
        });
    }

    return <WithHeader story={story} globalHeader={config.header}>
        <WithSeeMore story={story} action={action}>
            <div style={styles.videoContainer}>
                <video
                    ref={vid}
                    style={computedStyles}
                    src={story.url}
                    controls={false}
                    onLoadedData={videoLoaded}
                    playsInline
                    onWaiting={onWaiting}
                    onPlaying={onPlaying}
                    muted={muted}
                    autoPlay
                    webkit-playsinline="true"
                />
                {!loaded && (
                    <div
                        style={{
                            width: width,
                            height: height,
                            position: "absolute",
                            left: 0,
                            top: 0,
                            background: "rgba(0, 0, 0, 0.9)",
                            zIndex: 9,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#ccc"
                        }}
                    >
                        {loader || <Spinner />}
                    </div>
                )}
            </div>
        </WithSeeMore>
    </WithHeader>
}

const styles = {
    storyContent: {
        width: "auto",
        maxWidth: "100%",
        maxHeight: "100%",
        margin: "auto"
    },
    videoContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export const tester: Tester = (story) => {
    return {
        condition: story.type === 'video',
        priority: 2
    }
}

export default {
    renderer,
    tester
}
