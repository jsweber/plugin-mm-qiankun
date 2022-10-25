/**
 * @author Kuitos
 * @since 2019-06-20
 */
import { BaseIConfig } from '@umijs/types';
import { FrameworkConfiguration, FrameworkLifeCycles } from 'qiankun';
export declare type HistoryType = 'browser' | 'hash';
export declare type App = {
    name: string;
    entry: string | {
        scripts: string[];
        styles: string[];
    };
    base?: string | string[];
    history?: HistoryType;
    credentials?: boolean;
    props?: any;
} & Pick<BaseIConfig, 'mountElementId'>;
export declare type MicroAppRoute = {
    path: string;
    microApp: string;
} & Record<string, any>;
export declare type MasterOptions = {
    enable?: boolean;
    apps?: App[];
    routes?: MicroAppRoute[];
    lifeCycles?: FrameworkLifeCycles<object>;
    masterHistoryType?: HistoryType;
    base?: string;
    routeBindingAlias?: string;
    exportComponentAlias?: string;
    appNameKeyAlias?: string;
    prefetchThreshold?: number;
} & FrameworkConfiguration;
export declare type SlaveOptions = {
    enable?: boolean;
    devSourceMap?: boolean;
    keepOriginalRoutes?: boolean | string;
    shouldNotModifyRuntimePublicPath?: boolean;
    shouldNotModifyDefaultBase?: boolean;
    shouldNotAddLibraryChunkName?: boolean;
    masterEntry?: string;
};
declare module '@umijs/types' {
    interface BaseIConfig {
        qiankun: {
            master?: MasterOptions;
            slave?: SlaveOptions;
        };
    }
}
