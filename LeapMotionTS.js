var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    (function (LeapMotion) {
        var Pointable = (function () {
            function Pointable() {
                this.length = 0;
                this.width = 0;
                this.direction = Vector3.invalid();
                this.tipPosition = Vector3.invalid();
                this.tipVelocity = Vector3.invalid();
            }
            Pointable.prototype.isValid = function () {
                var returnValue = false;
                if((this.direction && this.direction.isValid()) && (this.tipPosition && this.tipPosition.isValid()) && (this.tipVelocity && this.tipVelocity.isValid())) {
                    returnValue = true;
                }
                return returnValue;
            };
            Pointable.prototype.isEqualTo = function (other) {
                var returnValue = true;
                if(!this.isValid() || !other.isValid()) {
                    returnValue = false;
                }
                if(returnValue && this.frame != other.frame) {
                    returnValue = false;
                }
                if(returnValue && this.hand != other.hand) {
                    returnValue = false;
                }
                if(returnValue && !this.direction.isEqualTo(other.direction)) {
                    returnValue = false;
                }
                if(returnValue && this.length != other.length) {
                    returnValue = false;
                }
                if(returnValue && this.width != other.width) {
                    returnValue = false;
                }
                if(returnValue && this.id != other.id) {
                    returnValue = false;
                }
                if(returnValue && !this.tipPosition.isEqualTo(other.tipPosition)) {
                    returnValue = false;
                }
                if(returnValue && !this.tipVelocity.isEqualTo(other.tipVelocity)) {
                    returnValue = false;
                }
                if(this.isFinger != other.isFinger || this.isTool != other.isTool) {
                    returnValue = false;
                }
                return returnValue;
            };
            Pointable.invalid = function invalid() {
                return new Pointable();
            };
            Pointable.prototype.toString = function () {
                return "[Pointable direction: " + this.direction + " tipPosition: " + this.tipPosition + " tipVelocity: " + this.tipVelocity + "]";
            };
            return Pointable;
        })();
        LeapMotion.Pointable = Pointable;        
        var Finger = (function (_super) {
            __extends(Finger, _super);
            function Finger() {
                        _super.call(this);
                this.isFinger = true;
                this.isTool = false;
            }
            Finger.invalid = function invalid() {
                return new Finger();
            };
            return Finger;
        })(Pointable);
        LeapMotion.Finger = Finger;        
        var Tool = (function (_super) {
            __extends(Tool, _super);
            function Tool() {
                        _super.call(this);
                this.isFinger = false;
                this.isTool = true;
            }
            Tool.invalid = function invalid() {
                return new Tool();
            };
            return Tool;
        })(Pointable);
        LeapMotion.Tool = Tool;        
        var Hand = (function () {
            function Hand() {
                this.fingers = [];
                this.pointables = [];
                this.tools = [];
            }
            Hand.prototype.isValid = function () {
                var returnValue = false;
                if((this.direction && this.direction.isValid()) && (this.palmNormal && this.palmNormal.isValid()) && (this.palmPosition && this.palmPosition.isValid()) && (this.palmVelocity && this.palmVelocity.isValid()) && (this.sphereCenter && this.sphereCenter.isValid())) {
                    returnValue = true;
                }
                return returnValue;
            };
            Hand.prototype.isEqualTo = function (other) {
                var returnValue = false;
                if(this.id == other.id && this.frame == other.frame && this.isValid() && other.isValid()) {
                    returnValue = true;
                }
                return returnValue;
            };
            Hand.prototype.finger = function (id) {
                var returnValue = Finger.invalid();
                var i = 0;
                var length = this.fingers.length;
                for(i; i < length; ++i) {
                    if(this.fingers[i].id == id) {
                        returnValue = this.fingers[i];
                        break;
                    }
                }
                return returnValue;
            };
            Hand.prototype.tool = function (id) {
                var returnValue = Tool.invalid();
                var i = 0;
                var length = this.fingers.length;
                for(i; i < length; ++i) {
                    if(this.tools[i].id == id) {
                        returnValue = this.tools[i];
                        break;
                    }
                }
                return returnValue;
            };
            Hand.prototype.pointable = function (id) {
                var returnValue = Pointable.invalid();
                var i = 0;
                var length = this.pointables.length;
                for(i; i < length; ++i) {
                    if(this.pointables[i].id == id) {
                        returnValue = this.pointables[i];
                        break;
                    }
                }
                return returnValue;
            };
            Hand.prototype.rotationAxis = function (sinceFrame) {
                var returnValue;
                if(sinceFrame.hand(this.id)) {
                    var vector = new Vector3(this.rotation.zBasis.y - sinceFrame.hand(this.id).rotation.yBasis.z, this.rotation.xBasis.z - sinceFrame.hand(this.id).rotation.zBasis.x, this.rotation.yBasis.x - sinceFrame.hand(this.id).rotation.xBasis.y);
                    returnValue = vector.normalized();
                } else {
                    returnValue = new Vector3(0, 0, 0);
                }
                return returnValue;
            };
            Hand.prototype.rotationAngle = function (sinceFrame, axis) {
                if (typeof axis === "undefined") { axis = null; }
                var returnValue = 0;
                if(!axis) {
                    if(sinceFrame.hand(this.id) && sinceFrame.hand(this.id).frame) {
                        var rotationSinceFrameMatrix = this.rotationMatrix(sinceFrame.hand(this.id).frame);
                        var cs = (rotationSinceFrameMatrix.xBasis.x + rotationSinceFrameMatrix.yBasis.y + rotationSinceFrameMatrix.zBasis.z) * 0.5;
                        var angle = Math.acos(cs);
                        returnValue = isNaN(angle) ? 0 : angle;
                    }
                } else {
                    if(sinceFrame.hand(this.id) && sinceFrame.hand(this.id).frame) {
                        var rotAxis = this.rotationAxis(sinceFrame.hand(this.id).frame);
                        var rotAngle = this.rotationAngle(sinceFrame.hand(this.id).frame);
                        returnValue = rotAngle * rotAxis.dot(axis.normalized());
                    }
                }
                return returnValue;
            };
            Hand.prototype.rotationMatrix = function (sinceFrame) {
                var returnValue;
                if(sinceFrame.hand(this.id) && sinceFrame.hand(this.id).rotation) {
                    returnValue = this.rotation.multiply(sinceFrame.hand(this.id).rotation);
                } else {
                    returnValue = Matrix.identity();
                }
                return returnValue;
            };
            Hand.prototype.scaleFactor = function (sinceFrame) {
                var returnValue;
                if(sinceFrame && sinceFrame.hand(this.id) && sinceFrame.hand(this.id).scaleFactorNumber) {
                    returnValue = Math.exp(this.scaleFactorNumber - sinceFrame.hand(this.id).scaleFactorNumber);
                } else {
                    returnValue = 1;
                }
                return returnValue;
            };
            Hand.prototype.translation = function (sinceFrame) {
                var returnValue;
                if(sinceFrame.hand(this.id) && sinceFrame.hand(this.id).translationVector) {
                    returnValue = new Vector3(this.translationVector.x - sinceFrame.hand(this.id).translationVector.x, this.translationVector.y - sinceFrame.hand(this.id).translationVector.y, this.translationVector.z - sinceFrame.hand(this.id).translationVector.z);
                } else {
                    returnValue = new Vector3(0, 0, 0);
                }
                return returnValue;
            };
            Hand.invalid = function invalid() {
                return new Hand();
            };
            return Hand;
        })();
        LeapMotion.Hand = Hand;        
        var Frame = (function () {
            function Frame() {
                this.fingers = [];
                this.hands = [];
                this.pointables = [];
                this._gestures = [];
                this.tools = [];
            }
            Frame.prototype.hand = function (id) {
                var returnValue = Hand.invalid();
                var i = 0;
                var length = this.hands.length;
                for(i; i < length; ++i) {
                    if(this.hands[i].id == id) {
                        returnValue = this.hands[i];
                        break;
                    }
                }
                return returnValue;
            };
            Frame.prototype.finger = function (id) {
                var returnValue = Finger.invalid();
                var i = 0;
                var length = this.fingers.length;
                for(i; i < length; ++i) {
                    if(this.fingers[i].id == id) {
                        returnValue = this.fingers[i];
                        break;
                    }
                }
                return returnValue;
            };
            Frame.prototype.tool = function (id) {
                var returnValue = Tool.invalid();
                var i = 0;
                var length = this.fingers.length;
                for(i; i < length; ++i) {
                    if(this.tools[i].id == id) {
                        returnValue = this.tools[i];
                        break;
                    }
                }
                return returnValue;
            };
            Frame.prototype.pointable = function (id) {
                var returnValue = Pointable.invalid();
                var i = 0;
                var length = this.pointables.length;
                for(i; i < length; ++i) {
                    if(this.pointables[i].id == id) {
                        returnValue = this.pointables[i];
                        break;
                    }
                }
                return returnValue;
            };
            Frame.prototype.gesture = function (id) {
                var returnValue = Gesture.invalid();
                var i = 0;
                var length = this._gestures.length;
                for(i; i < length; ++i) {
                    if(this._gestures[i].id == id) {
                        returnValue = this._gestures[i];
                        break;
                    }
                }
                return returnValue;
            };
            Frame.prototype.gestures = function (sinceFrame) {
                if (typeof sinceFrame === "undefined") { sinceFrame = null; }
                if(!sinceFrame) {
                    return this._gestures;
                } else {
                    var gesturesSinceFrame = [];
                    var i = 0;
                    var j = 0;
                    for(i; i < this.controller.frameHistory.length; ++i) {
                        for(j; j < this.controller.frameHistory[i]._gestures.length; ++j) {
                            gesturesSinceFrame.push(this.controller.frameHistory[i]._gestures[j]);
                        }
                        if(sinceFrame == this.controller.frameHistory[i]) {
                            break;
                        }
                    }
                    return gesturesSinceFrame;
                }
            };
            Frame.prototype.rotationAxis = function (sinceFrame) {
                var returnValue;
                if(sinceFrame && sinceFrame.rotation) {
                    var vector = new Vector3(this.rotation.zBasis.y - sinceFrame.rotation.yBasis.z, this.rotation.xBasis.z - sinceFrame.rotation.zBasis.x, this.rotation.yBasis.x - sinceFrame.rotation.xBasis.y);
                    returnValue = vector.normalized();
                } else {
                    returnValue = new Vector3(0, 0, 0);
                }
                return returnValue;
            };
            Frame.prototype.rotationAngle = function (sinceFrame, axis) {
                if (typeof axis === "undefined") { axis = null; }
                var returnValue = 0;
                if(!axis) {
                    var rotationSinceFrameMatrix = this.rotationMatrix(sinceFrame);
                    var cs = (rotationSinceFrameMatrix.xBasis.x + rotationSinceFrameMatrix.yBasis.y + rotationSinceFrameMatrix.zBasis.z - 1.0) * 0.5;
                    var angle = Math.acos(cs);
                    returnValue = isNaN(angle) ? 0 : angle;
                } else {
                    var rotAxis = this.rotationAxis(sinceFrame);
                    var rotAngle = this.rotationAngle(sinceFrame);
                    returnValue = rotAngle * rotAxis.dot(axis.normalized());
                }
                return returnValue;
            };
            Frame.prototype.rotationMatrix = function (sinceFrame) {
                var returnValue;
                if(sinceFrame && sinceFrame.rotation) {
                    returnValue = this.rotation.multiply(sinceFrame.rotation);
                } else {
                    returnValue = Matrix.identity();
                }
                return returnValue;
            };
            Frame.prototype.scaleFactor = function (sinceFrame) {
                var returnValue;
                if(sinceFrame && sinceFrame.scaleFactorNumber) {
                    returnValue = Math.exp(this.scaleFactorNumber - sinceFrame.scaleFactorNumber);
                } else {
                    returnValue = 1;
                }
                return returnValue;
            };
            Frame.prototype.translation = function (sinceFrame) {
                var returnValue;
                if(sinceFrame.translationVector) {
                    returnValue = new Vector3(this.translationVector.x - sinceFrame.translationVector.x, this.translationVector.y - sinceFrame.translationVector.y, this.translationVector.z - sinceFrame.translationVector.z);
                } else {
                    returnValue = new Vector3(0, 0, 0);
                }
                return returnValue;
            };
            Frame.prototype.isEqualTo = function (other) {
                var returnValue = true;
                if(this.id != other.id || !this.isValid() || other.isValid()) {
                    returnValue = false;
                }
                return returnValue;
            };
            Frame.prototype.isValid = function () {
                var returnValue = true;
                if(!this.id) {
                    returnValue = false;
                }
                return returnValue;
            };
            Frame.invalid = function invalid() {
                return new Frame();
            };
            return Frame;
        })();
        LeapMotion.Frame = Frame;        
        var Matrix = (function () {
            function Matrix(x, y, z, _origin) {
                if (typeof _origin === "undefined") { _origin = null; }
                this.origin = new Vector3(0, 0, 0);
                this.xBasis = new Vector3(0, 0, 0);
                this.yBasis = new Vector3(0, 0, 0);
                this.zBasis = new Vector3(0, 0, 0);
                this.xBasis = x;
                this.yBasis = y;
                this.zBasis = z;
                if(_origin) {
                    this.origin = _origin;
                }
            }
            Matrix.prototype.setRotation = function (_axis, angleRadians) {
                var axis = _axis.normalized();
                var s = Math.sin(angleRadians);
                var c = Math.cos(angleRadians);
                var C = (1 - c);
                this.xBasis = new Vector3(axis.x * axis.x * C + c, axis.x * axis.y * C - axis.z * s, axis.x * axis.z * C + axis.y * s);
                this.yBasis = new Vector3(axis.y * axis.x * C + axis.z * s, axis.y * axis.y * C + c, axis.y * axis.z * C - axis.x * s);
                this.zBasis = new Vector3(axis.z * axis.x * C - axis.y * s, axis.z * axis.y * C + axis.x * s, axis.z * axis.z * C + c);
            };
            Matrix.prototype.transformPoint = function (inVector) {
                return new Vector3(this.xBasis.multiply(inVector.x).x, this.yBasis.multiply(inVector.y).y, this.zBasis.multiply(inVector.z).z + this.origin.z);
            };
            Matrix.prototype.transformDirection = function (inVector) {
                return new Vector3(this.xBasis.multiply(inVector.x).x, this.yBasis.multiply(inVector.y).y, this.zBasis.multiply(inVector.z).z);
            };
            Matrix.prototype.rigidInverse = function () {
                var rotInverse = new Matrix(new Vector3(this.xBasis.x, this.yBasis.x, this.zBasis.x), new Vector3(this.xBasis.y, this.yBasis.y, this.zBasis.y), new Vector3(this.xBasis.z, this.yBasis.z, this.zBasis.z));
                if(this.origin) {
                    rotInverse.origin = rotInverse.transformDirection(this.origin.opposite());
                }
                return rotInverse;
            };
            Matrix.prototype.multiply = function (other) {
                return new Matrix(this.transformDirection(other.xBasis), this.transformDirection(other.yBasis), this.transformDirection(other.zBasis), this.transformPoint(other.origin));
            };
            Matrix.prototype.multiplyAssign = function (other) {
                this.xBasis = this.transformDirection(other.xBasis);
                this.yBasis = this.transformDirection(other.yBasis);
                this.zBasis = this.transformDirection(other.zBasis);
                this.origin = this.transformPoint(other.origin);
                return this;
            };
            Matrix.prototype.isEqualTo = function (other) {
                var returnValue = true;
                if(!this.xBasis.isEqualTo(other.xBasis)) {
                    returnValue = false;
                }
                if(!this.yBasis.isEqualTo(other.yBasis)) {
                    returnValue = false;
                }
                if(!this.zBasis.isEqualTo(other.zBasis)) {
                    returnValue = false;
                }
                if(!this.origin.isEqualTo(other.origin)) {
                    returnValue = false;
                }
                return returnValue;
            };
            Matrix.identity = function identity() {
                var xBasis = new Vector3(1, 0, 0);
                var yBasis = new Vector3(0, 1, 0);
                var zBasis = new Vector3(0, 0, 1);
                return new Matrix(xBasis, yBasis, zBasis);
            };
            Matrix.prototype.toString = function () {
                return "[Matrix xBasis:" + this.xBasis.toString() + " yBasis:" + this.yBasis.toString() + " zBasis:" + this.zBasis.toString() + " origin:" + this.origin.toString() + "]";
            };
            return Matrix;
        })();
        LeapMotion.Matrix = Matrix;        
        var Gesture = (function () {
            function Gesture() {
                this.hands = [];
                this.pointables = [];
            }
            Gesture.STATE_INVALID = 0;
            Gesture.STATE_START = 1;
            Gesture.STATE_UPDATE = 2;
            Gesture.STATE_STOP = 3;
            Gesture.TYPE_INVALID = 4;
            Gesture.TYPE_SWIPE = 5;
            Gesture.TYPE_CIRCLE = 6;
            Gesture.TYPE_SCREEN_TAP = 7;
            Gesture.TYPE_KEY_TAP = 8;
            Gesture.prototype.isEqualTo = function (other) {
                return (this.id == other.id) ? true : false;
            };
            Gesture.prototype.isValid = function () {
                var returnValue = true;
                if(!this.durationSeconds) {
                    returnValue = false;
                }
                return returnValue;
            };
            Gesture.invalid = function invalid() {
                return new Gesture();
            };
            Gesture.prototype.toString = function () {
                return "[Gesture id:" + this.id + " duration:" + this.duration + " type:" + this.type + "]";
            };
            return Gesture;
        })();
        LeapMotion.Gesture = Gesture;        
        var CircleGesture = (function (_super) {
            __extends(CircleGesture, _super);
            function CircleGesture() {
                        _super.call(this);
                this.pointable = Pointable.invalid();
            }
            CircleGesture.classType = Gesture.TYPE_CIRCLE;
            return CircleGesture;
        })(Gesture);
        LeapMotion.CircleGesture = CircleGesture;        
        var KeyTapGesture = (function (_super) {
            __extends(KeyTapGesture, _super);
            function KeyTapGesture() {
                        _super.call(this);
                this.progress = 1;
            }
            KeyTapGesture.classType = Gesture.TYPE_KEY_TAP;
            return KeyTapGesture;
        })(Gesture);
        LeapMotion.KeyTapGesture = KeyTapGesture;        
        var ScreenTapGesture = (function (_super) {
            __extends(ScreenTapGesture, _super);
            function ScreenTapGesture() {
                        _super.call(this);
                this.progress = 1;
            }
            ScreenTapGesture.classType = Gesture.TYPE_SCREEN_TAP;
            return ScreenTapGesture;
        })(Gesture);
        LeapMotion.ScreenTapGesture = ScreenTapGesture;        
        var SwipeGesture = (function (_super) {
            __extends(SwipeGesture, _super);
            function SwipeGesture() {
                        _super.call(this);
            }
            SwipeGesture.classType = Gesture.TYPE_SWIPE;
            return SwipeGesture;
        })(Gesture);
        LeapMotion.SwipeGesture = SwipeGesture;        
        var Vector3 = (function () {
            function Vector3(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
            Vector3.prototype.opposite = function () {
                return new Vector3(-this.x, -this.y, -this.z);
            };
            Vector3.prototype.plus = function (other) {
                return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
            };
            Vector3.prototype.plusAssign = function (other) {
                this.x += other.x;
                this.y += other.y;
                this.z += other.z;
                return this;
            };
            Vector3.prototype.minus = function (other) {
                return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
            };
            Vector3.prototype.minusAssign = function (other) {
                this.x -= other.x;
                this.y -= other.y;
                this.z -= other.z;
                return this;
            };
            Vector3.prototype.multiply = function (scalar) {
                return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
            };
            Vector3.prototype.multiplyAssign = function (scalar) {
                this.x *= scalar;
                this.y *= scalar;
                this.z *= scalar;
                return this;
            };
            Vector3.prototype.divide = function (scalar) {
                return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
            };
            Vector3.prototype.divideAssign = function (scalar) {
                this.x /= scalar;
                this.y /= scalar;
                this.z /= scalar;
                return this;
            };
            Vector3.prototype.isEqualTo = function (other) {
                var returnValue;
                if(this.x != other.x || this.y != other.y || this.z != other.z) {
                    returnValue = false;
                } else {
                    returnValue = true;
                }
                return returnValue;
            };
            Vector3.prototype.angleTo = function (other) {
                var denom = this.magnitudeSquared() * other.magnitudeSquared();
                if(denom <= 0) {
                    return 0;
                }
                return Math.acos(this.dot(other) / Math.sqrt(denom));
            };
            Vector3.prototype.cross = function (other) {
                return new Vector3((this.y * other.z) - (this.z * other.y), (this.z * other.x) - (this.x * other.z), (this.x * other.y) - (this.y * other.x));
            };
            Vector3.prototype.distanceTo = function (other) {
                return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y) + (this.z - other.z) * (this.z - other.z));
            };
            Vector3.prototype.dot = function (other) {
                return (this.x * other.x) + (this.y * other.y) + (this.z * other.z);
            };
            Vector3.prototype.isValid = function () {
                return (this.x <= Number.MAX_VALUE && this.x >= -Number.MAX_VALUE) && (this.y <= Number.MAX_VALUE && this.y >= -Number.MAX_VALUE) && (this.z <= Number.MAX_VALUE && this.z >= -Number.MAX_VALUE);
            };
            Vector3.invalid = function invalid() {
                return new Vector3(NaN, NaN, NaN);
            };
            Vector3.prototype.magnitude = function () {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            };
            Vector3.prototype.magnitudeSquared = function () {
                return this.x * this.x + this.y * this.y + this.z * this.z;
            };
            Vector3.prototype.normalized = function () {
                var denom = this.magnitudeSquared();
                if(denom <= 0) {
                    return new Vector3(0, 0, 0);
                }
                denom = 1 / Math.sqrt(denom);
                return new Vector3(this.x * denom, this.y * denom, this.z * denom);
            };
            Vector3.prototype.pitch = function () {
                return Math.atan2(this.y, -this.z);
            };
            Vector3.prototype.yaw = function () {
                return Math.atan2(this.x, -this.z);
            };
            Vector3.prototype.roll = function () {
                return Math.atan2(this.x, -this.y);
            };
            Vector3.zero = function zero() {
                return new Vector3(0, 0, 0);
            };
            Vector3.xAxis = function xAxis() {
                return new Vector3(1, 0, 0);
            };
            Vector3.yAxis = function yAxis() {
                return new Vector3(0, 1, 0);
            };
            Vector3.zAxis = function zAxis() {
                return new Vector3(0, 0, 1);
            };
            Vector3.left = function left() {
                return new Vector3(-1, 0, 0);
            };
            Vector3.right = function right() {
                return Vector3.xAxis();
            };
            Vector3.down = function down() {
                return new Vector3(0, -1, 0);
            };
            Vector3.up = function up() {
                return Vector3.yAxis();
            };
            Vector3.forward = function forward() {
                return new Vector3(0, 0, -1);
            };
            Vector3.backward = function backward() {
                return Vector3.zAxis();
            };
            Vector3.prototype.toString = function () {
                return "[Vector3 x:" + this.x + " y:" + this.y + " z:" + this.z + "]";
            };
            return Vector3;
        })();
        LeapMotion.Vector3 = Vector3;        
        var LeapEvent = (function () {
            function LeapEvent(type, targetObj, frame) {
                if (typeof frame === "undefined") { frame = null; }
                this._type = type;
                this._target = targetObj;
                this.frame = frame;
            }
            LeapEvent.LEAPMOTION_INIT = "leapMotionInit";
            LeapEvent.LEAPMOTION_CONNECTED = "leapMotionConnected";
            LeapEvent.LEAPMOTION_DISCONNECTED = "leapMotionDisconnected";
            LeapEvent.LEAPMOTION_EXIT = "leapMotionExit";
            LeapEvent.LEAPMOTION_FRAME = "leapMotionFrame";
            LeapEvent.prototype.getTarget = function () {
                return this._target;
            };
            LeapEvent.prototype.getType = function () {
                return this._type;
            };
            return LeapEvent;
        })();
        LeapMotion.LeapEvent = LeapEvent;        
        var EventDispatcher = (function () {
            function EventDispatcher() {
                this._listeners = [];
            }
            EventDispatcher.prototype.hasEventListener = function (type, listener) {
                var exists = false;
                for(var i = 0; i < this._listeners.length; i++) {
                    if(this._listeners[i].type === type && this._listeners[i].listener === listener) {
                        exists = true;
                    }
                }
                return exists;
            };
            EventDispatcher.prototype.addEventListener = function (typeStr, listenerFunc) {
                if(this.hasEventListener(typeStr, listenerFunc)) {
                    return;
                }
                this._listeners.push({
                    type: typeStr,
                    listener: listenerFunc
                });
            };
            EventDispatcher.prototype.removeEventListener = function (typeStr, listenerFunc) {
                for(var i = 0; i < this._listeners.length; i++) {
                    if(this._listeners[i].type === typeStr && this._listeners[i].listener === listenerFunc) {
                        this._listeners.splice(i, 1);
                    }
                }
            };
            EventDispatcher.prototype.dispatchEvent = function (evt) {
                for(var i = 0; i < this._listeners.length; i++) {
                    if(this._listeners[i].type === evt.getType()) {
                        this._listeners[i].listener.call(this, evt);
                    }
                }
            };
            return EventDispatcher;
        })();
        LeapMotion.EventDispatcher = EventDispatcher;        
        var Controller = (function (_super) {
            __extends(Controller, _super);
            function Controller(host) {
                if (typeof host === "undefined") { host = null; }
                var _this = this;
                        _super.call(this);
                this.frameHistory = [];
                if(!host) {
                    this.connection = new WebSocket("ws://localhost:6437");
                } else {
                    this.connection = new WebSocket("ws://" + host + ":6437");
                }
                this.dispatchEvent(new LeapEvent(LeapEvent.LEAPMOTION_INIT, this));
                this.connection.onopen = function (event) {
                    _this.dispatchEvent(new LeapEvent(LeapEvent.LEAPMOTION_CONNECTED, _this));
                };
                this.connection.onclose = function (data) {
                    _this.dispatchEvent(new LeapEvent(LeapEvent.LEAPMOTION_DISCONNECTED, _this));
                };
                this.connection.onmessage = function (data) {
                    var i;
                    var json;
                    var currentFrame;
                    var hand;
                    var pointable;
                    var gesture;
                    var isTool;
                    var length;
                    var type;
                    json = JSON.parse(data["data"]);
                    if((typeof json["timestamp"] === "undefined")) {
                        return;
                    }
                    currentFrame = new Frame();
                    currentFrame.controller = _this;
                    if(!(typeof json["hands"] === "undefined")) {
                        i = 0;
                        length = json["hands"].length;
                        for(i; i < length; ++i) {
                            hand = new Hand();
                            hand.frame = currentFrame;
                            hand.direction = new Vector3(json["hands"][i].direction[0], json["hands"][i].direction[1], json["hands"][i].direction[2]);
                            hand.id = json["hands"][i].id;
                            hand.palmNormal = new Vector3(json["hands"][i].palmNormal[0], json["hands"][i].palmNormal[1], json["hands"][i].palmNormal[2]);
                            hand.palmPosition = new Vector3(json["hands"][i].palmPosition[0], json["hands"][i].palmPosition[1], json["hands"][i].palmPosition[2]);
                            hand.palmVelocity = new Vector3(json["hands"][i].palmPosition[0], json["hands"][i].palmPosition[1], json["hands"][i].palmPosition[2]);
                            hand.rotation = new Matrix(new Vector3(json["hands"][i].r[0][0], json["hands"][i].r[0][1], json["hands"][i].r[0][2]), new Vector3(json["hands"][i].r[1][0], json["hands"][i].r[1][1], json["hands"][i].r[1][2]), new Vector3(json["hands"][i].r[2][0], json["hands"][i].r[2][1], json["hands"][i].r[2][2]));
                            hand.scaleFactorNumber = json["hands"][i].s;
                            hand.sphereCenter = new Vector3(json["hands"][i].sphereCenter[0], json["hands"][i].sphereCenter[1], json["hands"][i].sphereCenter[2]);
                            hand.sphereRadius = json["hands"][i].sphereRadius;
                            hand.translationVector = new Vector3(json["hands"][i].t[0], json["hands"][i].t[1], json["hands"][i].t[2]);
                            currentFrame.hands.push(hand);
                        }
                    }
                    currentFrame.id = json["id"];
                    if(!(typeof json["pointables"] === "undefined")) {
                        i = 0;
                        length = json["pointables"].length;
                        for(i; i < length; ++i) {
                            isTool = json["pointables"][i].tool;
                            if(isTool) {
                                pointable = new Tool();
                            } else {
                                pointable = new Finger();
                            }
                            pointable.frame = currentFrame;
                            pointable.id = json["pointables"][i].id;
                            pointable.hand = _this.getHandByID(currentFrame, json["pointables"][i].handId);
                            pointable.length = json["pointables"][i].length;
                            pointable.direction = new Vector3(json["pointables"][i].direction[0], json["pointables"][i].direction[1], json["pointables"][i].direction[2]);
                            pointable.tipPosition = new Vector3(json["pointables"][i].tipPosition[0], json["pointables"][i].tipPosition[1], json["pointables"][i].tipPosition[2]);
                            pointable.tipVelocity = new Vector3(json["pointables"][i].tipVelocity[0], json["pointables"][i].tipVelocity[1], json["pointables"][i].tipVelocity[2]);
                            currentFrame.pointables.push(pointable);
                            if(pointable.hand) {
                                pointable.hand.pointables.push(pointable);
                            }
                            if(isTool) {
                                pointable.isTool = true;
                                pointable.isFinger = false;
                                pointable.width = json["pointables"][i].width;
                                currentFrame.tools.push(pointable);
                                if(pointable.hand) {
                                    pointable.hand.tools.push(pointable);
                                }
                            } else {
                                pointable.isTool = false;
                                pointable.isFinger = true;
                                currentFrame.fingers.push(pointable);
                                if(pointable.hand) {
                                    pointable.hand.fingers.push(pointable);
                                }
                            }
                        }
                    }
                    if(!(typeof json["gestures"] === "undefined")) {
                        i = 0;
                        length = json["gestures"].length;
                        for(i; i < length; ++i) {
                            switch(json["gestures"][i].type) {
                                case "circle":
                                    gesture = new CircleGesture();
                                    type = Gesture.TYPE_CIRCLE;
                                    var circle = gesture;
                                    circle.center = new Vector3(json["gestures"][i].center[0], json["gestures"][i].center[1], json["gestures"][i].center[2]);
                                    circle.normal = new Vector3(json["gestures"][i].normal[0], json["gestures"][i].normal[1], json["gestures"][i].normal[2]);
                                    circle.progress = json["gestures"][i].progress;
                                    circle.radius = json["gestures"][i].radius;
                                    break;
                                case "swipe":
                                    gesture = new SwipeGesture();
                                    type = Gesture.TYPE_SWIPE;
                                    var swipe = gesture;
                                    swipe.startPosition = new Vector3(json["gestures"][i].startPosition[0], json["gestures"][i].startPosition[1], json["gestures"][i].startPosition[2]);
                                    swipe.position = new Vector3(json["gestures"][i].position[0], json["gestures"][i].position[1], json["gestures"][i].position[2]);
                                    swipe.direction = new Vector3(json["gestures"][i].direction[0], json["gestures"][i].direction[1], json["gestures"][i].direction[2]);
                                    swipe.speed = json["gestures"][i].speed;
                                    break;
                                case "screenTap":
                                    gesture = new ScreenTapGesture();
                                    type = Gesture.TYPE_SCREEN_TAP;
                                    var screenTap = gesture;
                                    screenTap.position = new Vector3(json["gestures"][i].position[0], json["gestures"][i].position[1], json["gestures"][i].position[2]);
                                    screenTap.direction = new Vector3(json["gestures"][i].direction[0], json["gestures"][i].direction[1], json["gestures"][i].direction[2]);
                                    screenTap.progress = json["gestures"][i].progress;
                                    break;
                                case "keyTap":
                                    gesture = new KeyTapGesture();
                                    type = Gesture.TYPE_KEY_TAP;
                                    var keyTap = gesture;
                                    keyTap.position = new Vector3(json["gestures"][i].position[0], json["gestures"][i].position[1], json["gestures"][i].position[2]);
                                    keyTap.direction = new Vector3(json["gestures"][i].direction[0], json["gestures"][i].direction[1], json["gestures"][i].direction[2]);
                                    keyTap.progress = json["gestures"][i].progress;
                                    break;
                                default:
                                    throw new Error("unkown gesture type");
                            }
                            var j = 0;
                            var lengthInner = 0;
                            if(!(typeof json["gestures"][i].handIds === "undefined")) {
                                j = 0;
                                lengthInner = json["gestures"][i].handIds.length;
                                for(j; j < lengthInner; ++j) {
                                    var gestureHand = _this.getHandByID(currentFrame, json["gestures"][i].handIds[j]);
                                    gesture.hands.push(gestureHand);
                                }
                            }
                            if(!(typeof json["gestures"][i].pointableIds === "undefined")) {
                                j = 0;
                                lengthInner = json["gestures"][i].pointableIds.length;
                                for(j; j < lengthInner; ++j) {
                                    var gesturePointable = _this.getPointableByID(currentFrame, json["gestures"][i].pointableIds[j]);
                                    if(gesturePointable) {
                                        gesture.pointables.push(gesturePointable);
                                    }
                                }
                                if(gesture instanceof CircleGesture && gesture.pointables.length > 0) {
                                    (gesture).pointable = gesture.pointables[0];
                                }
                            }
                            gesture.frame = currentFrame;
                            gesture.id = json["gestures"][i].id;
                            gesture.duration = json["gestures"][i].duration;
                            gesture.durationSeconds = gesture.duration / 1000000;
                            switch(json["gestures"][i].state) {
                                case "start":
                                    gesture.state = Gesture.STATE_START;
                                    break;
                                case "update":
                                    gesture.state = Gesture.STATE_UPDATE;
                                    break;
                                case "stop":
                                    gesture.state = Gesture.STATE_STOP;
                                    break;
                                default:
                                    gesture.state = Gesture.STATE_INVALID;
                            }
                            gesture.type = type;
                            currentFrame._gestures.push(gesture);
                        }
                    }
                    if(json["r"]) {
                        currentFrame.rotation = new Matrix(new Vector3(json["r"][0][0], json["r"][0][1], json["r"][0][2]), new Vector3(json["r"][1][0], json["r"][1][1], json["r"][1][2]), new Vector3(json["r"][2][0], json["r"][2][1], json["r"][2][2]));
                    }
                    currentFrame.scaleFactorNumber = json["s"];
                    if(json["t"]) {
                        currentFrame.translationVector = new Vector3(json["t"][0], json["t"][1], json["t"][2]);
                    }
                    currentFrame.timestamp = json["timestamp"];
                    if(_this.frameHistory.length > 59) {
                        _this.frameHistory.splice(59, 1);
                    }
                    _this.frameHistory.unshift(_this.latestFrame);
                    _this.latestFrame = currentFrame;
                    _this.dispatchEvent(new LeapEvent(LeapEvent.LEAPMOTION_FRAME, _this.latestFrame.controller, _this.latestFrame));
                };
            }
            Controller.POLICY_DEFAULT = 0;
            Controller.POLICY_BACKGROUND_FRAMES = (1 << 0);
            Controller.prototype.getHandByID = function (frame, id) {
                var returnValue = null;
                var i = 0;
                for(i; i < frame.hands.length; ++i) {
                    if((frame.hands[i]).id == id) {
                        returnValue = (frame.hands[i]);
                        break;
                    }
                }
                return returnValue;
            };
            Controller.prototype.getPointableByID = function (frame, id) {
                var returnValue = null;
                var i = 0;
                for(i; i < frame.pointables.length; ++i) {
                    if((frame.pointables[i]).id == id) {
                        returnValue = (frame.pointables[i]);
                        break;
                    }
                }
                return returnValue;
            };
            Controller.prototype.frame = function (history) {
                if (typeof history === "undefined") { history = 0; }
                var returnValue;
                if(history >= this.frameHistory.length) {
                    returnValue = Frame.invalid();
                } else {
                    returnValue = this.frameHistory[history];
                }
                return returnValue;
            };
            return Controller;
        })(EventDispatcher);
        LeapMotion.Controller = Controller;        
    })(exports.LeapMotion || (exports.LeapMotion = {}));
    var LeapMotion = exports.LeapMotion;
})
//@ sourceMappingURL=LeapMotionTS.js.map
