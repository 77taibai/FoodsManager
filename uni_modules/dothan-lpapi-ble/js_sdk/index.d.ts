/// <reference types="@dcloudio/types" />
/// <reference types="miniprogram-api-typings" />
import { CreateCanvasOptions, DrawContext, DzImage, ImageLoadOptions, JobStartOptions, JobStartResult, LabelAttachOptions, LabelContext, LabelCreateOptions, PageEndResult } from "dz-canvas";
import { LPAPI } from "lpapi-ble";
export interface IBleAdapter2 {
    onBLECharacteristicValueChange?: (callback: (result: UniNamespace.OnBLECharacteristicValueChangeSuccess) => void) => void;
    onBluetoothDeviceFound?: (callback: (result: UniNamespace.OnBluetoothDeviceFoundResult) => void) => void;
    onBluetoothAdapterStateChange?: (callback: (result: UniNamespace.OnBluetoothAdapterStateChangeResult) => void) => void;
}
interface IUniContext {
    isWeiXin?: boolean;
    isAlipay?: boolean;
    isLark?: boolean;
    isH5?: boolean;
    isAppPlus?: boolean;
    bleAdapter?: IBleAdapter2;
}
export interface IUniCanvasContext extends CreateCanvasOptions, IUniContext {
    canvasId?: string;
    canvas?: HTMLCanvasElement;
    drawTimeout?: number;
    componentInstance?: any;
}
export interface IUniCanvas {
    width: number;
    height: number;
    getContext(contextId: "2d"): RenderingContext | null;
}
export interface InitOptions extends IUniContext {
    showLog?: boolean | number;
    clientType?: number;
    /** 是否允许获取McuId，默认false */
    enableMcuId?: boolean;
    canvasId?: string;
    canvas?: HTMLCanvasElement;
    drawTimeout?: number;
}
export interface Uni_JobStartOptions extends JobStartOptions {
    canvasId: string;
}
export interface Uni_Base64SaveResult {
    target: string;
    width: number;
    height: number;
    size: number;
}
export declare class UniContext extends DrawContext {
    static createInstance(options: IUniCanvasContext, prevContext?: DrawContext): UniContext | undefined;
    private mOptions;
    private mCanvas?;
    constructor(context: IUniCanvasContext);
    init(options: InitOptions): void;
    protected createCanvas(): HTMLCanvasElement;
    /**
     * 通过 canvas 来创建 Image 对象。
     */
    private createImage;
    loadImage(options: string | ImageLoadOptions): Promise<HTMLImageElement | DzImage | null>;
    startJob(options: Uni_JobStartOptions): JobStartResult | undefined;
    protected onCanvasClear(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void;
    commitJob(): Promise<PageEndResult | undefined>;
}
export declare class LPAPIFactory {
    private static api?;
    /**
     * 获取LPAPI接口实例。
     */
    static getInstance(options?: InitOptions): LPAPI;
    static createInstance(options?: InitOptions): LPAPI;
}
export interface IUniLabelAttachOptions extends LabelAttachOptions {
    canvasId?: string;
}
export declare class UniPreview extends LabelContext {
    constructor(options: LabelCreateOptions);
    protected createDrawContext(options: IUniLabelAttachOptions): DrawContext;
    attachTo(options: IUniLabelAttachOptions): Promise<boolean>;
}
export * from "lpapi-ble";
