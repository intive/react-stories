import React, { useEffect, useState } from 'react'
import { ReactInstaStoriesProps, GlobalCtx, Story, Tester, Renderer, RenderersItem } from './interfaces'
import Container from './components/Container'
import GlobalContext from './context/Global'
import StoriesContext from './context/Stories';
import { getRenderer } from './util/renderers'
import { renderers as defaultRenderers } from './renderers/index';
import withHeader from './renderers/wrappers/withHeader'
import withSeeMore from './renderers/wrappers/withSeeMore'

const ReactInstaStories = function (props: ReactInstaStoriesProps) {
    let context: GlobalCtx = {
        width: props.width,
        height: props.height,
        loader: props.loader,
        header: props.header,
        storyContainerStyles: props.storyContainerStyles,
        storyStyles: props.storyStyles,
        loop: props.loop,
        defaultInterval: props.defaultInterval,
        isPaused: props.isPaused,
        currentIndex: props.currentIndex,
        onStoryStart: props.onStoryStart,
        onStoryEnd: props.onStoryEnd,
        onAllStoriesEnd: props.onAllStoriesEnd,
        keyboardNavigation: props.keyboardNavigation,
        clickableAreaStyles: props.clickableAreaStyles,
        onSlideTransition: props.onSlideTransition
    }
    const [stories, setStories] = useState<Story[]>([]);
    const [localRenderers, setLocalRenderers] = useState<RenderersItem[]>(defaultRenderers);

    useEffect(() => {
        const newRenderers = [].concat(localRenderers).concat(props.renderers)
        setLocalRenderers(newRenderers)
        setStories(generateStories(props.stories, newRenderers));
    }, [props.stories, props.renderers]);

    if (stories.length === 0) {
        return null
    }

    return <GlobalContext.Provider value={context}>
        <StoriesContext.Provider value={{stories: stories}}>
            <Container />
        </StoriesContext.Provider>
    </GlobalContext.Provider>
}

const generateStories = (stories: Story[], renderers: { renderer: Renderer, tester: Tester }[]) => {
    return stories.map(s => {
        let story: Story = {};

        if (typeof s === 'string') {
            story.url = s;
            story.type = 'image';
        } else if (typeof s === 'object') {
            story = Object.assign(story, s);
        }

        let renderer = getRenderer(story, renderers);
        story.originalContent = story.content;
        story.content = renderer;
        return story
    })
};

ReactInstaStories.defaultProps = {
    width: 360,
    height: 640,
    defaultInterval: 4000
}

export const WithHeader = withHeader;
export const WithSeeMore = withSeeMore;

export default ReactInstaStories