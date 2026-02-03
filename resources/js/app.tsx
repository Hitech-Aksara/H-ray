import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        if (name.includes('/')) {
            const [module, ...pageParts] = name.split('/');
            const page = pageParts.join('/');
            const modulePath = `../../app/Modules/${module}/Interface/Views/${page}.tsx`;

            const moduleFiles = import.meta.glob('../../app/Modules/**/Interface/Views/**/*.tsx', { eager: true });
            if (moduleFiles[modulePath]) {
                return moduleFiles[modulePath];
            }
        }

        const pageFiles = import.meta.glob('./pages/**/*.tsx', { eager: true });
        const pagePath = `./pages/${name}.tsx`;
        return pageFiles[pagePath] || Promise.reject(`Component ${name} not found in Modules or Pages`);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
