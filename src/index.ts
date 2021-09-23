
import { watch } from 'chokidar';
import { WatchOptions, FSWatcher } from 'chokidar';
import { Stats } from 'fs';

declare type eventName = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir';
export interface Target {
    compiler: any;
    compilation: any;
    watcher: FSWatcher;
}
export interface ChokidarPluginFileEvent {
    ready(target: Target): void;
    add(target: Target, path: string, status?: Stats): void;
    addDir(target: Target, path: string, status?: Stats): void;
    change(target: Target, path: string, status?: Stats): void;
    unlink(target: Target, path: string, status?: Stats): void;
    unlinkDir(target: Target, path: string, status?: Stats): void;
    raw(target: Target, eventName: string, path: string, details: any): void;
    all(target: Target, eventName: eventName, path: string, status?: Stats): void;
    error(target: Target, e: Error): void;
}
export interface ChokidarEvent {
    on?: Partial<ChokidarPluginFileEvent>;
    close?: Promise<void>;
    add?(paths: string | ReadonlyArray<string>): void;
    unwatch?(paths: string | ReadonlyArray<string>): void;
    getWatched?(): {
        [directory: string]: string[];
    };
}
export interface ChokidarConfig {
    file: string | ReadonlyArray<string>;
    opt: WatchOptions;
    actions: ChokidarEvent;
}
export interface PluginOption {
    chokidarConfigList: ChokidarConfig[];
}

class ChokidarPlugin {
    PluginName: string;
    options: PluginOption;
    listening: boolean;

    constructor(options: PluginOption) {
        this.PluginName = 'ChokidarPlugin';
        this.options = options;
        this.listening = false;
    }

    apply(compiler: any) {
        compiler.hooks.watchRun.tapAsync(this.PluginName, (compilation: any, callback: any) => {
            if (this.listening) callback();
            const { chokidarConfigList = [] } = this.options;

            for(const _ret of chokidarConfigList) {
              const { file, opt, actions } = _ret;

              if (!actions || !Object.keys(actions).length) continue;

              const watcher = watch(file, opt);

              Object.entries(actions).forEach(action => {
                  const [listen, cbs] = action;

                  if (listen === 'on') {
                      Object.entries(cbs as ChokidarPluginFileEvent).forEach( _ref => {
                          const [name, cb] = _ref;

                          watcher[listen](name, (...args) => {
                              cb({
                                  compiler,
                                  compilation,
                                  watcher
                              }, ...args);
                          });
                      });
                  }

              });
            }

            this.listening = true;
            callback();
        });
    }
}

module.exports = ChokidarPlugin;
