// Hotfix 1: guard Event so polyfills can't fail redefining NONE/CAPTURING_PHASE on Expo Go (JSC)
(() => {
    const g: any = globalThis as any;
    const EventRef = g?.Event;
    if (!EventRef || typeof EventRef !== 'function') return;

    class SafeEvent extends EventRef {
        constructor(type: any, options?: any) {
            super(type, options);
        }
    }

    ['NONE', 'CAPTURING_PHASE', 'AT_TARGET', 'BUBBLING_PHASE'].forEach((k) => {
        const v = (EventRef as any)[k];
        Object.defineProperty(SafeEvent, k, {
            value: v,
            writable: true,
            configurable: true,
            enumerable: true,
        });
    });

    g.Event = SafeEvent;
    if (typeof global !== 'undefined') (global as any).Event = SafeEvent;
})();

// Hotfix 2: intercept defineProperty to swallow attempts to redefine Event constants
(() => {
    const origDefine = Object.defineProperty;
    Object.defineProperty = function (
        target: any,
        prop: PropertyKey,
        descriptor: PropertyDescriptor
    ) {
        try {
            // If someone tries to redefine NONE/phase constants on Event (class or proto), ignore silently
            if (
                (target === (globalThis as any).Event ||
                    target === (globalThis as any).Event?.prototype) &&
                ['NONE', 'CAPTURING_PHASE', 'AT_TARGET', 'BUBBLING_PHASE'].includes(String(prop))
            ) {
                return target;
            }
            return origDefine(target, prop, descriptor);
        } catch (e) {
            return target;
        }
    };
})();

import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

// Register app for Expo Go and native builds
registerRootComponent(App);
