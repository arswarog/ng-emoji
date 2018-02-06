import 'zone.js/dist/zone';
import 'core-js/es7/reflect';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import './main.less';
import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
