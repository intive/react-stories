import React, { useContext, useState, useRef, useEffect } from 'react'
import GlobalContext from './../context/Global'
import StoriesContext from './../context/Stories'
import ProgressContext from './../context/Progress'
import Story from './Story'
import ProgressArray from './ProgressArray'
import { GlobalCtx, StoriesContext as StoriesContextInterface } from './../interfaces'

export default function () {
    const [currentId, setCurrentId] = useState<number>(0)
    const [pause, setPause] = useState<boolean>(true)
    const [bufferAction, setBufferAction] = useState<boolean>(true)
    const [videoDuration, setVideoDuration] = useState<number>(0)

    let mousedownId = useRef<any>();
    let isMounted = useRef<boolean>(true);

    const { 
        width,
        height,
        loop,
        currentIndex,
        isPaused,
        keyboardNavigation,
        storyContainerStyles = {},
        clickableAreaStyles = {},
        onSlideTransition
    } = useContext<GlobalCtx>(GlobalContext);
    const { stories } = useContext<StoriesContextInterface>(StoriesContext);

    useEffect(() => {
        if (typeof currentIndex === 'number') {
            if (currentIndex >= 0 && currentIndex < stories.length) {
                setCurrentIdWrapper(() => currentIndex)
            } else {
                console.error('Index out of bounds. Current index was set to value more than the length of stories array.', currentIndex)
            }
        }
    }, [currentIndex])

    useEffect(() => {
        if (typeof isPaused === 'boolean') {
            setPause(isPaused)
        }
    }, [isPaused])

    useEffect(() => {
        const isClient = (typeof window !== 'undefined' && window.document);
        if (isClient && (typeof keyboardNavigation === 'boolean' && keyboardNavigation)) {
            document.addEventListener("keydown", handleKeyDown);
            return () => {
                document.removeEventListener("keydown", handleKeyDown);
            }
        }
    }, [keyboardNavigation]);

    // Cleanup mounted state - for issue #130 (https://github.com/mohitk05/react-insta-stories/issues/130)
    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, []);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            previous()
        }
        else if (e.key === 'ArrowRight') {
            next()
        }
    }

    const toggleState = (action: string, bufferAction?: boolean) => {
        setPause(action === 'pause')
        setBufferAction(!!bufferAction)
    }

    const setCurrentIdWrapper = (callback) => {
        const {direction, prev, nextIdx} = callback(currentId)
        setCurrentId(nextIdx);
        onSlideTransition && onSlideTransition(direction, prev, nextIdx === prev ? undefined : nextIdx)
    }

    const previous = () => {
        setCurrentIdWrapper(prev => {
            const nextIdx = prev > 0 ? prev - 1 : prev
            return {direction: 'left', prev, nextIdx}
        })
    }

    const next = () => {
        const nextStoryIdForLoop = prev => {
            const nextIdx = (prev + 1) % stories.length
            return {direction: 'right', prev, nextIdx}
        }
        const nextStoryId = prev => {
            if (prev < stories.length - 1) {
                const nextIdx = prev + 1
                return {direction: 'right', prev, nextIdx}
            }
            
            return {direction: 'right', prev}
        }

        if (isMounted.current) {
            if (loop) {
                setCurrentIdWrapper(nextStoryIdForLoop)
            } else {
                setCurrentIdWrapper(nextStoryId)
            }
        }
    }

    const debouncePause = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault()
        mousedownId.current = setTimeout(() => {
            toggleState('pause')
        }, 200)
    }

    const mouseUp = (type: string) => (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault()
        mousedownId.current && clearTimeout(mousedownId.current)
        if (pause) {
            toggleState('play')
        } else {
            type === 'next' ? next() : previous()
        }
    }

    const getVideoDuration = (duration: number) => {
        setVideoDuration(duration * 1000)
    }

    return (
        <div style={{ ...storyContainerStyles, ...styles.container, ...{ width, height } }}>
            <ProgressContext.Provider value={{
                bufferAction: bufferAction,
                videoDuration: videoDuration,
                currentId,
                pause,
                next
            }}>
                <ProgressArray />
            </ProgressContext.Provider>
            <Story
                action={toggleState}
                bufferAction={bufferAction}
                playState={pause}
                story={stories[currentId]}
                getVideoDuration={getVideoDuration}
            />
            <div style={{...styles.overlay, ...clickableAreaStyles.overlay}}>
                <div 
                    style={{...styles.leftPane, ...clickableAreaStyles.leftPane}}
                    onTouchStart={debouncePause}
                    onTouchEnd={mouseUp('previous')}
                    onMouseDown={debouncePause}
                    onMouseUp={mouseUp('previous')} 
                />
                <div 
                    style={{...styles.rightPane, ...clickableAreaStyles.rightPane}}
                    onTouchStart={debouncePause}
                    onTouchEnd={mouseUp('next')}
                    onMouseDown={debouncePause}
                    onMouseUp={mouseUp('next')} 
                />
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        background: '#111',
        position: 'relative'
    },
    overlay: {
        position: 'absolute',
        height: 'inherit',
        width: 'inherit'
    },
    leftPane: {
        boxSizing: 'border-box',
        position: 'absolute',
        width: '50%',
        zIndex: 999,
        left:0,
        top:0,
        height: '100%'
    },
    rightPane: { 
        position: 'absolute',
        boxSizing: 'border-box',
        width: '50%',
        zIndex: 999,
        top:0,
        right: 0,
        height: '100%'
    }
}