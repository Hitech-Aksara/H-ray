import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Finds all React view files inside module Interface/Views folders
 */
function findModuleViews(baseDir: string): string[] {
    const modulesPath = path.resolve(__dirname, baseDir);

    if (!fs.existsSync(modulesPath)) {
        return [];
    }

    const modules = fs.readdirSync(modulesPath);
    const views: string[] = [];

    modules.forEach(module => {
        const viewDir = path.join(modulesPath, module, 'Interface', 'Views');
        if (fs.existsSync(viewDir)) {
            // Recursively find all tsx/jsx files
            const findFiles = (dir: string) => {
                fs.readdirSync(dir).forEach(file => {
                    const filePath = path.join(dir, file);
                    if (fs.statSync(filePath).isDirectory()) {
                        findFiles(filePath);
                    } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
                        const relativePath = path.relative(__dirname, filePath);
                        views.push(relativePath);
                    }
                });
            };
            findFiles(viewDir);
        }
    });

    return views;
}

/**
 * Generates aliases for all modules' Interface/Views folders
 */
function generateModuleAliases(baseDir: string): Record<string, string> {
    const modulesPath = path.resolve(__dirname, baseDir);

    if (!fs.existsSync(modulesPath)) {
        return {};
    }

    const modules = fs.readdirSync(modulesPath);
    const aliases: Record<string, string> = {};

    modules.forEach(module => {
        const viewDir = path.join(modulesPath, module, 'Interface', 'Views');
        if (fs.existsSync(viewDir)) {
            // Create alias like @employee -> /app/Modules/Employee/Interface/Views
            aliases[`@${module.toLowerCase()}`] = viewDir;
        }
    });

    return aliases;
}

const moduleViews = findModuleViews('app/Modules');
const moduleAliases = generateModuleAliases('app/Modules');

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.tsx',
                ...moduleViews,
            ],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            ...moduleAliases,
        },
    },
});
