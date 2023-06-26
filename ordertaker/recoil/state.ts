import { atom } from 'recoil';

export interface IContentTypes {
    name: string;
    status: boolean;
    message: string;
}

export const contentState = atom<IContentTypes>({
    key: 'content',
    default: {
        name: 'test',
        status: false,
        message: ''
    }
});