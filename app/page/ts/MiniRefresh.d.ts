
declare interface MiniRefreshSuccessAnim {
    /* 是否开启成功动画，开启后，下拉结束之前会先出现成功动画	FALSE	 */
    isEnable: boolean;
    /* 成功动画的过度时间	300	 */
    duration: number;
}

declare interface MiniRefreshPullDownEvent {
    /* 是否锁定下拉刷新，如果锁定了，则无法下拉	FALSE */
    isLock?: boolean;
    /* 是否初始化时自动执行一次下拉刷新，优先级要高于上拉加载的auto，并且两个auto只会执行一次	FALSE	 */
    isAuto?: boolean;
    /* 是否运行在上拉时也可以下拉，如果为false，上拉时无法触发下拉刷新	FALSE	 */
    isAways?: boolean;
    /* 设置isAuto=true时生效，是否在初始化的下拉刷新触发事件中显示动画，如果是false，初始化的加载只会触发回调，不会触发动画	TRUE	 */
    isAllowAutoLoading?: boolean;
    /* 是否每次下拉完毕后默认重置上拉，为false时下拉刷新后不会自动重置上拉状态	TRUE	 */
    isAutoResetUpLoading?: boolean;
    /* 请只在定制主题时使用，是否在下拉时scroll（内容区域）跟随css translate动画，如果为false，下拉时只会回调下拉距离，scroll不会跟随动画，常用来定制自定义下拉刷新	TRUE	 */
    isScrollCssTranslate?: boolean;
    /* 触发下拉的阈值，当下拉距离大于这个阈值后，在松开时会触发下拉刷新	75	 */
    offset?: number;
    /* 阻尼系数，下拉小于offset时的阻尼系数，值越接近0,高度变化越小,表现为越往下越难拉	1	 */
    dampRateBegin?: number;
    /* 下拉超过阈值后的阻尼系数，越接近0，下拉高度变化越小，例如0.1时表现是超过阈值后基本就拉不动了	0.3	 */
    dampRate?: number;
    /* 回弹动画时间，下拉取消后或结束后到关闭时，会有一个回弹时间过渡	300	 */
    bounceTime?: number;
    /* 成功动画配置相关，请只在实现了成功动画的主题中使用，比如default主题,目前成功动画只是保留功能，因为以后可能有主题需要它	默认配置	 */
    successAnim?: MiniRefreshSuccessAnim

    /* 下拉过程中的持续回调，回调参数（downHight, downOffset）	空函数	 */
    onPull?: () => void;
    /* 取消下拉后的回调,当下拉超过阈值，并松开就会触发	空函数	 */
    onCalcel?: () => void;
    /* 触发下拉刷新后的回调	空函数	 */
    callback?: () => void;
}

declare interface MiniRefreshLoadFull {
    /* 是否开启自动加载满屏，开启后，如果当前页面数据没有满屏，并且可以加载更多，就会自动触发上拉加载	TRUE	 */
    isEnable: number;
    /* 延迟加载的时间，自动加载满屏时，会延迟一定时间才加载	300	 */
    delay: number;
}


declare interface MiniRefreshPullUpEvent {
    /* 是否锁定上，如果锁定了，则无法上拉	FALSE	 */
    isLock?: boolean;
    /* 是否初始化时自动执行一次上拉加载（会同时有动画和回调），当下拉的down的isAuto生效时，这个不会生效	TRUE	 */
    isAuto?: boolean;
    /* 上拉加载的过程中是否显示动画，如果为false，代表静默加载，没有动画	TRUE	 */
    isShowUpLoading?: boolean;
    /* 触发上拉的阈值，当滑动到距离底部距离小于这个阈值时，会触发上拉加载	75	 */
    offset?: number;
    /* 自动加载满屏相关配置	默认配置	 */
    loadFull?: MiniRefreshLoadFull;

    /* 滚动时的持续回调，回调参数（scrollTop）	空函数	 */
    onScroll?: () => void;
    /* 触发上拉加载后的回调	空函数	 */
    callback?: () => void;

}


declare interface MiniRefreshOptions {
    /** minirefresh容器的selector */
    container?: string;
    down?: MiniRefreshPullDownEvent;
    up?: MiniRefreshPullUpEvent;
    /** 是否锁定横向滑动，如果锁定则原生滚动条无法滑动(注意，是原生HTML的横向滑动而不是一些类似于swipe之类的第三方滑动插件)，如果想要嵌套横向滑动，可以设为false */
    isLockX?: boolean;
    /** 是否使用body对象的scroll而不是minirefresh-scroll对象的scroll，如果使用body的scroll，可以通过window.onscroll监听，但是这时候请确保一个页面只有一个下拉刷新，否则会有冲突 */
    isUseBodyScroll?: boolean;
    /** 是否显示滚动条，为false时会将滚动条宽度设为0 */
    isScrollBar?: boolean;
}

declare class MiniRefresh {
    constructor(opts: MiniRefreshOptions) ;
    /** 触发下拉刷新 */
    triggerDownLoading: () => void;
    /** 触发上拉加载 */
    triggerUpLoading: () => void;
    /** 
     * 结束下拉刷新 
     * isSuccess	Boolean	只有主题实现了success动画并开启时才有效，是否下拉并处理成功，默认为true，为true时会走入成功动画，否则走入失败动画
     * successTips	String	只有主题实现了success动画并开启时才有效，更新新的成功提示，只有传入参数时才会生效
     */
    endDownLoading: (isSuccess: boolean = true, successTips?: string) => void;
    /**
     * 结束上拉加载
     * isFinishUp	Boolean	默认为false，是否没有更多数据，如果为true，会变为没有更多数据，不能继续加载更多，直到下拉刷新后更新状态或者主动resetUp状态才能继续加载
     */
    endUpLoading: (isFinishUp: boolean = false) => void;
    /** 重置上拉加载状态,如果是没有更多数据后重置，会变为可以继续上拉加载 */
    resetUpLoading: () => void;
    /** 
     * 在特定的时间内，滚动到指定的y位置
     * y	Number	需要滚动到位置的top高度
     * duration	Number	过渡时间，默认为0
     */
    scrollTo: (y, duration) => void;
    /**
     * 获取当前的滚动位置
     */
    getPosition: () => number;
    /**
     * 刷新minirefresh的配置，刷新后会马上生效
     */
    refreshOptions: (options: MiniRefreshOptions) => void;

}
