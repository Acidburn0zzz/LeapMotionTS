export declare class EventDispatcher {
    private listeners;
    constructor();
    public hasEventListener(type: string, listener: Function): boolean;
    public addEventListener(typeStr: string, listenerFunction: Function): void;
    public removeEventListener(typeStr: string, listenerFunction: Function): void;
    public dispatchEvent(event: LeapEvent): void;
}
export interface Listener {
    onConnect(controller: Controller): void;
    onDisconnect(controller: Controller): void;
    onExit(controller: Controller): void;
    onFrame(controller: Controller, frame: Frame): void;
    onInit(controller: Controller): void;
}
export declare class DefaultListener extends EventDispatcher implements Listener {
    constructor();
    public onConnect(controller: Controller): void;
    public onDisconnect(controller: Controller): void;
    public onExit(controller: Controller): void;
    public onFrame(controller: Controller, frame: Frame): void;
    public onInit(controller: Controller): void;
}
export declare class LeapEvent {
    static LEAPMOTION_INIT: string;
    static LEAPMOTION_CONNECTED: string;
    static LEAPMOTION_DISCONNECTED: string;
    static LEAPMOTION_EXIT: string;
    static LEAPMOTION_FRAME: string;
    private _type;
    private _target;
    public frame: Frame;
    constructor(type: string, targetListener: Listener, frame?: Frame);
    public getTarget(): any;
    public getType(): string;
}
export declare class LeapUtil {
    static PI: number;
    static DEG_TO_RAD: number;
    static RAD_TO_DEG: number;
    static TWO_PI: number;
    static HALF_PI: number;
    static EPSILON: number;
    constructor();
    static toDegrees(radians: number): number;
    static isNearZero(value: number): boolean;
    static vectorIsNearZero(inVector: Vector3): boolean;
    static extractRotation(mtxTransform: Matrix): Matrix;
    static rotationInverse(mtxRot: Matrix): Matrix;
    static rigidInverse(mtxTransform: Matrix): Matrix;
    static componentWiseMin(vLHS: Vector3, vRHS: Vector3): Vector3;
    static componentWiseMax(vLHS: Vector3, vRHS: Vector3): Vector3;
    static componentWiseScale(vLHS: Vector3, vRHS: Vector3): Vector3;
    static componentWiseReciprocal(inVector: Vector3): Vector3;
    static minComponent(inVector: Vector3): number;
    static maxComponent(inVector: Vector3): number;
    static heading(inVector: Vector3): number;
    static elevation(inVector: Vector3): number;
    static normalizeSpherical(vSpherical: Vector3): Vector3;
    static cartesianToSpherical(vCartesian: Vector3): Vector3;
    static sphericalToCartesian(vSpherical: Vector3): Vector3;
    static clamp(inVal: number, minVal: number, maxVal: number): number;
    static lerp(a: number, b: number, coefficient: number): number;
    static lerpVector(vec1: Vector3, vec2: Vector3, coefficient: number): Vector3;
}
export declare class Controller extends EventDispatcher {
    private listener;
    public frameHistory: Frame[];
    private latestFrame;
    public connection: WebSocket;
    public _isConnected: boolean;
    public _isGesturesEnabled: boolean;
    constructor(host?: string);
    private static getHandByID(frame, id);
    private static getPointableByID(frame, id);
    public frame(history?: number): Frame;
    public setListener(listener: Listener): void;
    public enableGesture(type: Type, enable?: boolean): void;
    public isGestureEnabled(type: Type): boolean;
    public isConnected(): boolean;
}
export declare class InteractionBox {
    public center: Vector3;
    public depth: number;
    public height: number;
    public width: number;
    constructor();
    public denormalizePoint(normalizedPosition: Vector3): Vector3;
    public normalizePoint(position: Vector3, clamp?: boolean): Vector3;
    public isValid(): boolean;
    public isEqualTo(other: InteractionBox): boolean;
    static invalid(): InteractionBox;
    public toString(): string;
}
export declare enum Zone {
    ZONE_NONE = 0,
    ZONE_HOVERING = 1,
    ZONE_TOUCHING = 2,
}
export declare class Pointable {
    public touchZone: number;
    public touchDistance: number;
    public direction: Vector3;
    public frame: Frame;
    public hand: Hand;
    public id: number;
    public length: number;
    public width: number;
    public tipPosition: Vector3;
    public stabilizedTipPosition: Vector3;
    public timeVisible: number;
    public tipVelocity: Vector3;
    public isFinger: boolean;
    public isTool: boolean;
    public isExtended: boolean;
    constructor();
    public isValid(): boolean;
    public isEqualTo(other: Pointable): boolean;
    static invalid(): Pointable;
    public toString(): string;
}
export declare enum State {
    STATE_INVALID = 0,
    STATE_START = 1,
    STATE_UPDATE = 2,
    STATE_STOP = 3,
}
export declare enum Type {
    TYPE_INVALID = 4,
    TYPE_SWIPE = 5,
    TYPE_CIRCLE = 6,
    TYPE_SCREEN_TAP = 7,
    TYPE_KEY_TAP = 8,
}
export declare class Gesture {
    public duration: number;
    public durationSeconds: number;
    public frame: Frame;
    public hands: Hand[];
    public id: number;
    public pointables: Pointable[];
    public state: State;
    public type: Type;
    constructor();
    public isEqualTo(other: Gesture): boolean;
    public isValid(): boolean;
    static invalid(): Gesture;
    public toString(): string;
}
export declare enum Type {
    TYPE_THUMB = 0,
    TYPE_INDEX = 1,
    TYPE_MIDDLE = 2,
    TYPE_RING = 3,
    TYPE_PINKY = 4,
}
export declare enum Joint {
    JOINT_MCP = 0,
    JOINT_PIP = 1,
    JOINT_DIP = 2,
    JOINT_TIP = 3,
}
export declare class Finger extends Pointable {
    public type: number;
    public dipPosition: Vector3;
    public pipPosition: Vector3;
    public mcpPosition: Vector3;
    constructor();
    public jointPosition(jointIx: number): Vector3;
    public positions(): Vector3[];
    static invalid(): Finger;
}
export declare class Tool extends Pointable {
    constructor();
    static invalid(): Tool;
}
export declare class Hand {
    public direction: Vector3;
    public fingers: Finger[];
    public frame: Frame;
    public id: number;
    public palmNormal: Vector3;
    public palmPosition: Vector3;
    public stabilizedPalmPosition: Vector3;
    public timeVisible: number;
    public isLeft: boolean;
    public isRight: boolean;
    public palmVelocity: Vector3;
    public pointables: Pointable[];
    public sphereCenter: Vector3;
    public sphereRadius: number;
    public pinchStrength: number;
    public grabStrength: number;
    public tools: Tool[];
    public rotation: Matrix;
    public scaleFactorNumber: number;
    public translationVector: Vector3;
    constructor();
    public isValid(): boolean;
    public isEqualTo(other: Hand): boolean;
    public finger(id: number): Finger;
    public tool(id: number): Tool;
    public pointable(id: number): Pointable;
    public rotationAxis(sinceFrame: Frame): Vector3;
    public rotationAngle(sinceFrame: Frame, axis?: Vector3): number;
    public rotationMatrix(sinceFrame: Frame): Matrix;
    public scaleFactor(sinceFrame: Frame): number;
    public translation(sinceFrame: Frame): Vector3;
    static invalid(): Hand;
}
export declare class Frame {
    public fingers: Finger[];
    public hands: Hand[];
    public pointables: Pointable[];
    public _gestures: Gesture[];
    public id: number;
    public currentFramesPerSecond: number;
    public interactionBox: InteractionBox;
    public timestamp: number;
    public tools: Tool[];
    public rotation: Matrix;
    public scaleFactorNumber: number;
    public translationVector: Vector3;
    public controller: Controller;
    constructor();
    public hand(id: number): Hand;
    public finger(id: number): Finger;
    public tool(id: number): Tool;
    public pointable(id: number): Pointable;
    public gesture(id: number): Gesture;
    public gestures(sinceFrame?: Frame): Gesture[];
    public rotationAxis(sinceFrame: Frame): Vector3;
    public rotationAngle(sinceFrame: Frame, axis?: Vector3): number;
    public rotationMatrix(sinceFrame: Frame): Matrix;
    public scaleFactor(sinceFrame: Frame): number;
    public translation(sinceFrame: Frame): Vector3;
    public isEqualTo(other: Frame): boolean;
    public isValid(): boolean;
    static invalid(): Frame;
}
export declare class Matrix {
    public origin: Vector3;
    public xBasis: Vector3;
    public yBasis: Vector3;
    public zBasis: Vector3;
    constructor(x: Vector3, y: Vector3, z: Vector3, _origin?: Vector3);
    public setRotation(_axis: Vector3, angleRadians: number): void;
    public transformPoint(inVector: Vector3): Vector3;
    public transformDirection(inVector: Vector3): Vector3;
    public rigidInverse(): Matrix;
    public multiply(other: Matrix): Matrix;
    public multiplyAssign(other: Matrix): Matrix;
    public isEqualTo(other: Matrix): boolean;
    static identity(): Matrix;
    public toString(): string;
}
export declare class CircleGesture extends Gesture {
    static classType: number;
    public center: Vector3;
    public normal: Vector3;
    public pointable: Pointable;
    public progress: number;
    public radius: number;
    constructor();
}
export declare class KeyTapGesture extends Gesture {
    static classType: number;
    public direction: Vector3;
    public pointable: Pointable;
    public position: Vector3;
    public progress: number;
    constructor();
}
export declare class ScreenTapGesture extends Gesture {
    static classType: number;
    public direction: Vector3;
    public pointable: Pointable;
    public position: Vector3;
    public progress: number;
    constructor();
}
export declare class SwipeGesture extends Gesture {
    static classType: number;
    public direction: Vector3;
    public pointable: Pointable;
    public position: Vector3;
    public speed: number;
    public startPosition: Vector3;
    constructor();
}
export declare class Vector3 {
    public x: number;
    public y: number;
    public z: number;
    constructor(x: number, y: number, z: number);
    public opposite(): Vector3;
    public plus(other: Vector3): Vector3;
    public plusAssign(other: Vector3): Vector3;
    public minus(other: Vector3): Vector3;
    public minusAssign(other: Vector3): Vector3;
    public multiply(scalar: number): Vector3;
    public multiplyAssign(scalar: number): Vector3;
    public divide(scalar: number): Vector3;
    public divideAssign(scalar: number): Vector3;
    public isEqualTo(other: Vector3): boolean;
    public angleTo(other: Vector3): number;
    public cross(other: Vector3): Vector3;
    public distanceTo(other: Vector3): number;
    public dot(other: Vector3): number;
    public isValid(): boolean;
    static invalid(): Vector3;
    public magnitude(): number;
    public magnitudeSquared(): number;
    public normalized(): Vector3;
    public pitch : number;
    public yaw : number;
    public roll : number;
    static zero(): Vector3;
    static xAxis(): Vector3;
    static yAxis(): Vector3;
    static zAxis(): Vector3;
    static left(): Vector3;
    static right(): Vector3;
    static down(): Vector3;
    static up(): Vector3;
    static forward(): Vector3;
    static backward(): Vector3;
    public toString(): string;
}
