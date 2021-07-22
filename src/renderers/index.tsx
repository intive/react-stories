import { RenderersItem } from './../interfaces'
import image from './Image';
import video from './Video';
import defaultRenderer from './Default';
import autoplayContent from './AutoPlayContent';

export const renderers: RenderersItem[] = [image, video, autoplayContent, defaultRenderer];
