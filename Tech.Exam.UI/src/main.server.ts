export { AppServerModule as default } from './app/app.module.server';
import { environment } from './environments/environment';

if (true === environment?.ssrIgnoresSsl) {
    console.warn('main.server.ts: SSR is running with SSL Certificate Checking disabled because environment.ssrIgnoresSsl is true.');
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
}