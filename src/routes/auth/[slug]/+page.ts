import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
    if (params.slug === 'create') {
        return {
            startWith: 'creation'
        };
    } else {
        return {
            startWith: 'login'
        };
    }

    throw error(404, 'Not found');
}) satisfies PageLoad;

export const prerender = true;