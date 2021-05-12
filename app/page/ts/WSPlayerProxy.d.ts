export declare class WSPlayerProxy {
    constructor(iframe:HTMLIFrameElement);
    stop(): void;
    play(): void;
    seek(value: number): void;
    fast(): void;
    slow(): void;
    capturePicture(): void;
    pause(): void;
    speedResume(): void;
    resume(): void;
    frame(): void;
    fullScreen(): void;
    resize(width: number, height: number): void;
    fullExit(): void;
    download(filename: string, type: string): void;
    openSound(): void;
    closeSound(): void;
    getVolume(): void;
    setVolume(value: number): void;
    destory(): void;

    onStoping: () => void;
    getPosition: (value: number) => void;
    onPlaying: () => void;
    onButtonClicked: (key: string) => void;
    onViewerDoubleClicked: () => void;

    tools?:PlayerTools;
}

declare enum WSPlayerMode {
    live, 
    vod
}
declare enum WSPlayerState {
    ready,
    playing,
    pause,
    slow,
    fast,
    end,
    opening,
    closing,
    closed
}