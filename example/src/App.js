import React, {useState, useEffect} from 'react';
import Stories, { WithSeeMore } from '@intive-org/react-stories'
import './App.css';

function App() {
	const [webConsole, setWebConsole] = useState([])
	const [isPlaying, setIsPlaying] = useState(true)
	const [clickableAreaSettings, setClickableAreaSettings] = useState({
		overlay: {},
		leftPane: {},
		rightPane:{}
	})
	const [configuration, setConfiguration] = useState({
		showClickableArea: false
	})

	const updateWebConsole = (...args) =>  {
		setWebConsole(prev => {
			prev.unshift(args.join(' '))
			return [].concat(prev)
		})
	}

	const onSlideTransition = (direction, currentIdx, nextIdx) => {
		if (direction === 'left' && nextIdx === undefined) {
			updateWebConsole('going left from the first slide')
		} else if (direction === 'right' && nextIdx === undefined) {
			updateWebConsole('going right from the last slide')
		} else {
			updateWebConsole('going ', direction, 'from slide ', currentIdx, ' to slide ', nextIdx)
		}
	}

	useEffect(() => {
		if (configuration.showClickableArea) {
			setClickableAreaSettings(prev => {
				return {
					overlay: prev.overlay,
					leftPane: {
						...prev.leftPane,
						backgroundColor: 'rgba(255,255,0, 0.3)',
						border: 'solid 2px yellow',
					},
					rightPane: {
						...prev.rightPane,
						backgroundColor: 'rgba(255,255,0, 0.3)',
						border: 'solid 2px yellow',
					}
				}
			})
		} else {
			setClickableAreaSettings(prev => {
				return {
					overlay: prev.overlay,
					leftPane: {
						...prev.leftPane,
						backgroundColor: null,
						border: null,
					},
					rightPane: {
						...prev.rightPane,
						backgroundColor: null,
						border: null,
					}
				}
			})
		}
	}, [configuration])

	return (
		<div className="App">
			<div className="left">
				<h2>
					<a rel="noopener noreferrer" href="https://www.npmjs.com/package/@intive-org/react-stories" target="_blank">
					@intive-org/react-stories
					</a>

				</h2>
				<p>
					<a href="https://www.npmjs.com/package/@intive-org/react-stories">
						<img target="_blank" alt="NPM" src="https://img.shields.io/npm/v/@intive-org/react-stories.svg" />
					</a>
					"semantic release", linter, master Ci test
				</p>
				<p>
					Create Instagram like stories on the web using React
				</p>
				<p>
					<code style={{ marginTop: 10, marginBottom: 10 }}>
						<span style={code}>
							npm i @intive-org/react-stories
						</span>
					</code>
				</p>

				<p>
					<a href="https://github.com/intive/react-stories">Documentation →</a>
				</p>

				<h3>Navigation</h3>
				<p>
					<div style={{ background: '#eee', padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 'auto' }}><p>◀ Tap left for previous story</p>
						<p>▶︎ Tap right for next story</p>
						<p>◉ Press and hold to pause</p>
						<p><button onClick={() => {setIsPlaying(play => !play)}}>{isPlaying ? 'Pause' : 'Play'}</button></p>
					</div>
				</p>
				
				<h3>Configuration</h3>
				<p style={code}>
					<div>
						<input
							id="configuration-clickable-areas"
							type="checkbox" 
							onChange={() => setConfiguration(prev => {
								return {
									...prev,
									showClickableArea: !prev.showClickableArea
								}
							})}
							defaultChecked={configuration.showClickableArea}
						/>
						<label htmlFor="configuration-clickable-areas" >
							Show clickable areas
						</label>
					</div>
					<div>
					<input
							id="configuration-stories-length"
							type="checkbox" 
							disabled
						/>
						<label htmlFor="configuration-stories-length" >
							Set stories length
						</label>
					</div>
					<div>
						<input
							id="configuration-default-interval"
							type="checkbox" 
							disabled
						/>
						<label htmlFor="configuration-default-interval" >
							Change default interval
						</label>
					</div>
					<div>
						<input
							id="configuration-keyboard-navigation"
							type="checkbox" 
							disabled
						/>
						<label htmlFor="configuration-keyboard-navigation" >
							Enable/Disable keyboard navigation
						</label>
					</div>
					<div>
						<input
							id="configuration-viewport-size"
							type="checkbox" 
							disabled
						/>
						<label htmlFor="configuration-viewport-size" >
							Change Viewport size
						</label>
					</div>
				</p>
				
				<h3>Console</h3>
				<p>
					<div style={code} className="web-console">
							{webConsole.map((item, idx) => {
								return (<p key={idx} className="console-line">{item}</p>)
							})}
					</div>
				</p>
			
		</div>
		<div className="right">
			
			<div className="stories-container">
				<Stories
					loop
					isPaused={!isPlaying}
					width={'100%'}
					height={'100%'}
					keyboardNavigation
					defaultInterval={5000}
					stories={stories2}
					onStoryEnd={(s, st) => updateWebConsole('story with index ' + s +  ' ended')}
					onAllStoriesEnd={(s, st) => updateWebConsole('all stories ended', s)}
					onStoryStart={(s, st) => updateWebConsole('story with index ' + s + ' started')}
					storyContainerStyles={{ borderRadius: 8, overflow: 'hidden' }}
					clickableAreaStyles={clickableAreaSettings}
					onSlideTransition={onSlideTransition}
				/>
			</div>
		</div>
	</div>
	);
}

const Story2 = ({ action, isPaused }) => {
	return <div style={{ ...contentStyle, background: 'Aquamarine', color: '#333' }}>
		<h1>You get the control of the story.</h1>
		<p>Render your custom JSX by passing just a <code style={{ fontStyle: 'italic' }}>content</code> property inside your story object.</p>
		<p>You get a <code style={{ fontStyle: 'italic' }}>action</code> prop as an input to your content function, that can be used to play or pause the story.</p>
		<h1>{isPaused ? 'Paused' : 'Playing'}</h1>
		<h4>v2 is out 🎉</h4>
		<p>React Native version coming soon.</p>
	</div>
}

const stories2 = [
	{
		content: ({ action, story }) => {
			return <WithSeeMore story={story} action={action}><div style={{ background: 'snow', padding: 20, height: '100%' }}>
				<h1 style={{ marginTop: '100%', marginBottom: 0 }}>🌝</h1>
				<h1 style={{ marginTop: 5 }}>We have our good old image and video stories, just the same.</h1>
			</div></WithSeeMore>
		},
		seeMoreCollapsed: ({ toggleMore, action }) => <p style={customSeeMore} onClick={() => toggleMore(true)}>A custom See More message →</p>,
		seeMore: ({ close }) => <div style={{ maxWidth: '100%', height: '100%', padding: 40, background: 'white' }}><h2>Just checking the see more feature.</h2><p style={{ textDecoration: 'underline' }} onClick={close}>Go on, close this popup.</p></div>,
		duration: 5000
	},
		{
		url: 'http://www.exit109.com/~dnn/clips/RW20seconds_1.mp4',
		type: 'video'
	},
		{
		url: 'https://picsum.photos/1080/1920',
		seeMore: ({ close }) => <div style={{ maxWidth: '100%', height: '100%', padding: 40, background: 'white' }}><h2>Just checking the see more feature.</h2><p style={{ textDecoration: 'underline' }} onClick={close}>Go on, close this popup.</p></div>
	},
		{
		content: ({ action, isPaused }) => {
			return <div style={contentStyle}>
				<h1>The new version is here.</h1>
				<p>This is the new story.</p>
				<p>Now render React components right into your stories.</p>
				<p>Possibilities are endless, like here - here's a code block!</p>
				<pre>
					<code style={code}>
						console.log('Hello, world!')
        			</code>
				</pre>
				<p>Or here, an image!</p>
				<br />
				<img style={image} src="https://images.unsplash.com/photo-1565506737357-af89222625ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"></img>
				<h3>Perfect. But there's more! →</h3>
			</div>
		}
	},
	{
		content: Story2
	}
]

const image = {
	display: 'block',
	maxWidth: '100%',
	borderRadius: 4,
}

const code = {
	background: '#eee',
	padding: '5px 10px',
	borderRadius: '4px',
	color: '#333'
}

const contentStyle = {
	background: '#333',
	width: '100%',
	padding: 20,
	color: 'white',
	height: '100%'
}

const customSeeMore = {
	textAlign: 'center',
	fontSize: 14,
	bottom: 20,
	position: 'relative'
}

export default App;
