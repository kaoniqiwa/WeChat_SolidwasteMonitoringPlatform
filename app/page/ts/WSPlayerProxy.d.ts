declare class WSPlayerProxy {
  toolsBinding(tools: any)
  exitfullscreen()
  fullscreen(parentElement: HTMLElement | null)

  mode: string
  isFullScreen: any
  constructor(iframe: HTMLIFrameElement, mode?: WSPlayerMode | string)
  stop(): void
  play(): void
  seek(value: number): void
  fast(): void
  slow(): void
  capturePicture(): void
  pause(): void
  speedResume(): void
  resume(): void
  frame(): void
  fullScreen(): void
  resize(width: number, height: number): void
  fullExit(): void
  download(filename: string, type: string): void
  openSound(): void
  closeSound(): void
  getVolume(): void
  setVolume(value: number): void
  destory(): void

  onStoping: () => void
  getPosition: (value: number) => void
  onPlaying: () => void
  onButtonClicked: (key: string) => void
  onViewerDoubleClicked: () => void
  onFullScreenChanged: () => void
  onStatusChanged: (status: WSPlayerState) => void
  onCapturePicture: (data: string) => void

  tools?: PlayerTools
}

declare enum WSPlayerMode {
  live,
  vod,
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
  closed,
}
declare interface PlayerToolsControl {
  center_play: HTMLElement
  top: HTMLDivElement
  center: {
    div: HTMLDivElement
    control: {
      background: HTMLDivElement
      a: HTMLElement
    }
    position: {
      background: HTMLDivElement
      begin: HTMLDivElement
      end: HTMLDivElement
    }
  }
  bottom: HTMLDivElement
  content: HTMLDivElement
  play: HTMLLinkElement
  stop: HTMLLinkElement
  pause: HTMLLinkElement
  forward: HTMLLinkElement
  fast: HTMLLinkElement
  slow: HTMLLinkElement

  begin_time: HTMLDivElement
  end_time: HTMLDivElement
  position: HTMLDivElement
  fullscreen: HTMLDivElement
  capturepicture: HTMLDivElement
  jump_forward: HTMLDivElement
  jump_back: HTMLDivElement
  volume: {
    icon: HTMLDivElement
    panel: HTMLDivElement
    slide: HTMLDivElement
    value: 0
  }
}
declare class PlayerTools {
  constructor(parent: HTMLElement, mode?: WSPlayerMode | string)
  control: PlayerToolsControl
  createElements()
}
