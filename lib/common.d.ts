/**
 * @author Kuitos
 * @since 2019-06-20
 */
import { ReactComponentElement } from 'react';
import type { IRouteProps } from 'umi';
export declare const defaultMountContainerId = "root-subapp";
export declare const noop: () => void;
export declare function toArray<T>(source: T | T[]): T[];
export declare function testPathWithPrefix(pathPrefix: string, realPath: string): any;
export declare function patchMicroAppRoute(route: any, getMicroAppRouteComponent: (opts: {
    appName: string;
    base: string;
    masterHistoryType: string;
    routeProps?: any;
}) => string | ReactComponentElement<any>, masterOptions: {
    base: string;
    masterHistoryType: string;
    routeBindingAlias: string;
}): void;
export declare function insertRoute(routes: IRouteProps[], microAppRoute: IRouteProps): void;
