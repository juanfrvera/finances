import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
    if (params.slug === 'create') {
        return {
            title: 'Create Account!',
            content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
        };
    } else {
        return {
            title: 'Log In',
            content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
        };
    }

    throw error(404, 'Not found');
}) satisfies PageLoad;