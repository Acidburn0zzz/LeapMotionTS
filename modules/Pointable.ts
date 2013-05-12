/// <reference path="./Vector3.ts"/>
/// <reference path="./Frame.ts"/>
/// <reference path="./Hand.ts"/>
/**
 * The Pointable class reports the physical characteristics of a detected finger or tool.
 * Both fingers and tools are classified as Pointable objects. Use the Pointable.isFinger
 * property to determine whether a Pointable object represents a finger. Use the
 * Pointable.isTool property to determine whether a Pointable object represents a tool.
 * The Leap classifies a detected entity as a tool when it is thinner, straighter,
 * and longer than a typical finger.
 *
 * <p>Note that Pointable objects can be invalid, which means that they do not contain valid
 * tracking data and do not correspond to a physical entity. Invalid Pointable objects
 * can be the result of asking for a Pointable object using an ID from an earlier frame
 * when no Pointable objects with that ID exist in the current frame. A Pointable object
 * created from the Pointable constructor is also invalid. Test for validity with
 * the <code>Pointable.isValid()</code> function.</p>
 *
 * @author logotype
 *
 */
class Pointable
{
    /**
     * The direction in which this finger or tool is pointing.<br/>
     * The direction is expressed as a unit vector pointing in the
     * same direction as the tip.
     */
    public direction:Vector3;

    /**
     * The Frame associated with this Pointable object.<br/>
     * The associated Frame object, if available; otherwise, an invalid
     * Frame object is returned.
     * @see Frame
     */
    public frame:Frame;

    /**
     * The Hand associated with this finger or tool.<br/>
     * The associated Hand object, if available; otherwise, an invalid
     * Hand object is returned.
     * @see Hand
     */
    public hand:Hand;

    /**
     * A unique ID assigned to this Pointable object, whose value remains
     * the same across consecutive frames while the tracked finger or
     * tool remains visible.
     *
     * <p>If tracking is lost (for example, when a finger is occluded by another
     * finger or when it is withdrawn from the Leap field of view), the Leap
     * may assign a new ID when it detects the entity in a future frame.</p>
     *
     * <p>Use the ID value with the <code>Frame.pointable()</code> to find this
     * Pointable object in future frames.</p>
     */
    public id:number;

    /**
     * The estimated length of the finger or tool in millimeters.
     *
     * <p>The reported length is the visible length of the finger or tool from
     * the hand to tip.</p>
     *
     * <p>If the length isn't known, then a value of 0 is returned.</p>
     */
    public length:number = 0;

    /**
     * The estimated width of the finger or tool in millimeters.
     *
     * <p>The reported width is the average width of the visible portion
     * of the finger or tool from the hand to the tip.</p>
     *
     * <p>If the width isn't known, then a value of 0 is returned.</p>
     */
    public width:number = 0;

    /**
     * The tip position in millimeters from the Leap origin.
     */
    public tipPosition:Vector3;

    /**
     * The rate of change of the tip position in millimeters/second.
     */
    public tipVelocity:Vector3;

    /**
     * Whether or not the Pointable is believed to be a finger.
     */
    public isFinger:boolean;

    /**
     * Whether or not the Pointable is believed to be a tool.
     */
    public isTool:boolean;

    constructor()
    {
        this.direction = Vector3.invalid();
        this.tipPosition = Vector3.invalid();
        this.tipVelocity = Vector3.invalid();
    }

    /**
     * Reports whether this is a valid Pointable object.
     * @return True if <code>direction</code>, <code>tipPosition</code> and <code>tipVelocity</code> are true.
     */
    public isValid():boolean
    {
        var returnValue:boolean = false;

        if ( ( this.direction && this.direction.isValid()) && ( this.tipPosition && this.tipPosition.isValid()) && ( this.tipVelocity && this.tipVelocity.isValid()) )
            returnValue = true;

        return returnValue;
    }

    /**
     * Compare Pointable object equality/inequality.
     *
     * <p>Two Pointable objects are equal if and only if both Pointable
     * objects represent the exact same physical entities in
     * the same frame and both Pointable objects are valid.</p>
     *
     * @param other The Pointable to compare with.
     * @return True; if equal, False otherwise.
     *
     */
    public isEqualTo( other:Pointable ):boolean
    {
        if ( !this.isValid() || !other.isValid() )
            return false;

        if ( this.frame != other.frame )
            return false;

        if ( this.hand != other.hand )
            return false;

        if ( !this.direction.isEqualTo( other.direction ) )
            return false;

        if ( this.length != other.length )
            return false;

        if ( this.width != other.width )
            return false;

        if ( this.id != other.id )
            return false;

        if ( !this.tipPosition.isEqualTo( other.tipPosition ) )
            return false;

        if ( !this.tipVelocity.isEqualTo( other.tipVelocity ) )
            return false;

        if ( this.isFinger != other.isFinger || this.isTool != other.isTool )
            return false;

        return true;
    }

    /**
     * Returns an invalid Pointable object.
     *
     * <p>You can use the instance returned by this in
     * comparisons testing whether a given Pointable instance
     * is valid or invalid.<br/>
     * (You can also use the <code>Pointable.isValid()</code> function.)</p>
     *
     * @return The invalid Pointable instance.
     *
     */
    public static invalid():Pointable
    {
        return new Pointable();
    }

    /**
     * A string containing a brief, human readable description of the Pointable object.
     */
    public toString():string
    {
        return "[Pointable direction: " + this.direction + " tipPosition: " + this.tipPosition + " tipVelocity: " + this.tipVelocity + "]";
    }
}