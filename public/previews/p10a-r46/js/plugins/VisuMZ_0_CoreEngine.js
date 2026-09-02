//=============================================================================
// VisuStella MZ - Core Engine
// VisuMZ_0_CoreEngine.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_0_CoreEngine = true;

var VisuMZ = VisuMZ || {};
VisuMZ.CoreEngine = VisuMZ.CoreEngine || {};
VisuMZ.CoreEngine.version = 1.90;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 0] [Version 1.90] [CoreEngine]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Core_Engine_VisuStella_MZ
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Core Engine plugin is designed to fix any bugs that may have slipped
 * past RPG Maker MZ's source code and to give game devs more control over
 * RPG Maker MZ's various features, ranging from mechanics to aesthetics to
 * quality of life improvements.
 *
 * Features include all (but not limited to) the following:
 *
 * * Bug fixes for the problems existing in the RPG Maker MZ base code.
 * * Failsafes added for Script Call related event commands.
 * * Lots of Quality of Life Settings that can be activated through the
 *   Plugin Parameters.
 * * Control over the various Text Colors used throughout the game.
 * * Change up the maximum amount of gold carried, give it an icon attached to
 *   the label, and include text for overlap specifics.
 * * Preload images as the game boots up.
 * * Add specific background images for menus found throughout the game.
 * * A button assist window will appear at the top or bottom of the screen,
 *   detailing which buttons do what when inside a menu. This feature can be
 *   turned off.
 * * Choose which in-game battler parameters to display inside menus (ie ATK,
 *   DEF, AGI, etc.) and determine their maximum values, along with plenty of
 *   notetags to give more control over parameter, x-parameter, s-parameter
 *   bonuses through equipment, states, and other trait objects.
 * * Control over how the UI objects appear (such as the menu button, cancel
 *   button, left/right actor switch buttons).
 * * Reposition actors and enemies if the battle resolution is larger.
 * * Allow class names and nicknames to support text codes when displayed.
 * * Determine how windows behave in the game, if they will mask other windows,
 *   their line height properties, and more.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 0 ------
 *
 * This plugin is a Tier 0 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ Plugin library.
 *
 * ============================================================================
 * Important Changes: Bug Fixes
 * ============================================================================
 *
 * This plugin also serves to fix various bugs found in RPG Maker MZ that have
 * been unaddressed or not yet taken care of. The following is a list of bugs
 * that have been fixed by this plugin:
 *
 * ---
 *
 * Attack Skill Trait
 *
 * Enemies are unaffected by the Attack Skill Trait. This means if they have
 * an Attack action, they will always use Attack over and over even if their
 * Attack Skill Trait has been changed. This plugin will change it up so that
 * the Attack skill will comply with whatever their Attack Skill Trait's skill
 * is set to.
 *
 * ---
 *
 * Auto Battle Actor Skill Usage
 *
 * If an actor with Auto Battle has access to a skill but not have any access
 * to that skill's type, that actor will still be able to use the skill during
 * Auto Battle despite the fact that the actor cannot use that skill during
 * manual input.
 *
 * ---
 * 
 * Auto Battle Attack Seal Bypass
 * 
 * By default, if the attack skill is sealed via a trait and an actor has
 * auto-battle, the action can still be used via auto-battle. This is now fixed
 * and actors should not be able to attack via auto-battle if their attack
 * ability is sealed.
 * 
 * ---
 * 
 * Auto Battle Lock Up
 * 
 * If an auto battle Actor fights against an enemy whose DEF/MDF is too high,
 * they will not use any actions at all. This can cause potential game freezing
 * and softlocks. This plugin will change that and have them default to a
 * regular Attack.
 * 
 * ---
 * 
 * Auto Save After New Game
 * 
 * Normally, when starting a new game through the "New Game" option, there is
 * no auto save trigger. However, if you start a new game or load a saved game,
 * then go to the Game End screen, return back to the title screen, then start
 * a New Game, the auto save trigger occurs when it shouldn't. The Core Engine
 * will now patch this and prevent the trigger from taking place.
 * 
 * ---
 * 
 * Battle Forced End Action Crash
 * 
 * Depending on various circumstances, currently active battlers can be cleared
 * from the battle system at will due to a number of reasons. However, if it
 * just so happens that the targets are cleared, too, with actions remaining,
 * then a crash will follow up. This plugin will prevent that change. Fix made
 * by Olivia.
 * 
 * ---
 * 
 * Debug Console Refresh Bug
 * 
 * When pressing F5 to refresh while the debug console (DevTools) is open,
 * some graphics will fail to load properly. This started occurring since the
 * RPG Maker MZ 1.5.0 update and the code for loading the images has now been
 * reverted to the 1.4.4 version where it was last stable.
 * 
 * ---
 * 
 * Gamepad Repeat Input
 * 
 * Cleared inputs on gamepads do not have a downtime and will trigger the
 * following input frame. The causes problems with certain RPG Maker MZ menus
 * where the inputs have to be cleared as the next immediate frame will have
 * them inputted again. This plugin changes it so that whenever inputs are
 * cleared, there is a downtime equal to the keyboard clear frames before the
 * gamepad input is registered once more.
 * 
 * ---
 * 
 * Invisible Battle Sprites
 * 
 * If you removed a party member during battle and added that exact party
 * member back into the same slot, their sprite would appear invisible. The
 * VisuStella Core Engine will fix this problem and prevent it from happening.
 * 
 * ---
 * 
 * Instant Text Discrepancy for Window_Message
 * 
 * Window_Message displays text differently when it draws letters one by one
 * versus when the text is displayed instantly. This isn't noticeable with the
 * default font, but it's very visible when using something like Arial. The
 * error is due to Bitmap.measureTextWidth yielding a rounded value per letter
 * versus per word. The Core Engine will provide a bug fix that will single out
 * the cause and make it so that only Window_Message will not utilize any round
 * number values when determining the width of each letter, whether or not it
 * is shown instantly. This change will only affect Window_Message and not any
 * other window in order to prevent unintended side effects.
 * 
 * This can be disabled through the Plugin Parameters:
 * 
 * Plugin Parameters > QoL Settings > Misc > Font Width Fix
 * 
 * ---
 *
 * Move Picture, Origin Differences
 *
 * If a Show Picture event command is made with an Origin setting of
 * "Upper Left" and a Move Picture event command is made afterwards with an
 * Origin setting of "Center", RPG Maker MZ would originally have it instantly
 * jump into the new origin setting without making a clean transition between
 * them. This plugin will create that clean transition between origins.
 *
 * ---
 * 
 * Overly-Protective Substitute
 * 
 * When an ally with critical health is being targeted by a friendly non-
 * Certain Hit skill (such as a heal or buff) and another ally has the
 * substitute state, the other ally would "protect" the originally targeted
 * ally and take the heal or buff.
 * 
 * The new changed behavior is that now, substitute will not trigger for any
 * actions whose scope targets allies.
 * 
 * ---
 * 
 * Skill List Active After Party Member Change
 * 
 * If the skill list is active (ie. the player can move the cursor around) and
 * the party member currently being viewed is changed via the button commands,
 * then previously, RPG Maker MZ would still have that window be active despite
 * having the cursor hidden temporarily. Upon pressing direction buttons, the
 * cursor reveals itself and both the skill type window and skill list window
 * are both active, making way for lots of potential problems to happen.
 * 
 * ---
 * 
 * Sprite Removal and Destroy Crash
 * 
 * A texture check will now occur for sprites that are being removed and
 * destroyed in order to prevent crashes. In the off chance that someone
 * creates a sprite through a script call and removes it through such, the
 * likelihood of this occurance becomes higher. This makes the "destroy"
 * property take into account a texture check in order to see if the sprite
 * removal is taking extra steps and will reduce those extra steps.
 * 
 * ---
 * 
 * Status Window Name Vertical Cutoffs
 * 
 * In the battle status windows, whenever actor names are displayed, the bitmap
 * used to display their name text do not extend vertically all the way,
 * causing letters like lowercase "Q" and "G" to be cut off, making them hard
 * to distinguish from one another. The Core Engine will remedy this by
 * extending the bitmap to allow enough room. Fix made by Irina.
 * 
 * ---
 * 
 * Termination Clear Effects
 * 
 * In RPG Maker MZ, requesting an animation while transitioning between
 * scenes, such as going from the map scene to the battle scene, can cause
 * crashes. This is because the animation queue does not take off immediately
 * and will likely register incorrect targets for the scene. This plugin will
 * forcefully clear any registered animations and balloon effects when
 * terminating a scene in order to prevent crashes.
 * 
 * ---
 * 
 * Timer Sprite
 * 
 * By default, RPG Maker MZ adds Sprite_Timer into its spriteset, either for
 * maps or for battles. There is one major problem with this: when spritesets
 * are affected by filters, zooms, and/or blurs, this hinders how readable the
 * timer sprite is, making the information perceived by the player to be much
 * harder than it needs to be. The Core Engine adds the sprite to the parent
 * scene instead of the spriteset to ensure it's unobscured by anything else.
 * 
 * ---
 * 
 * Unusable Battle Items
 * 
 * If any party member is able to use an item in battle, then all party members
 * are able to use said item, even if that party member is supposed to be
 * unable to use that item. This is now changed so that battle items are
 * checked on an individual basis and not on a party-wide basis.
 * 
 * ---
 * 
 * Water Tile Bug
 * 
 * It seems like there's a new bug that occurs if you create a tileset from
 * scratch in RPG Maker MZ version 1.5.0+ and version 1.6.0+! What this bug
 * does is it causes many tiles to become water tiles without intending to.
 * You can find this out by turning off all the plugins in your project,
 * putting a Ship or Boat on what are normally ground tiles, and then seeing
 * the Ship or Boat traverse through it.
 * 
 * There are two ways to fix this. We cannot fix it through code in this plugin
 * as it's a problem that involves the tileset json data there are ways to work
 * around it so that you can get the proper water-flags to go where they need
 * to be at.
 * 
 * 1. Copy a working un-bugged tileset onto the currently bugged one and
 *    reapply the tile features like passability, terrain tags, etc. This will
 *    make sure the water-passability tiles get copied over correctly.
 * 
 * 2. If you're on RPG Maker MZ version 1.5.0 or above, select a working
 *    un-bugged tileset (usually a pre-existing tileset when a new project is
 *    made), click the "Copy Page" button, go to the bugged tileset and press
 *    "Paste Page". You'll have to reapply any different properties like
 *    passabilities and terrain tags, but the water tile flags should now be
 *    working properly.
 * 
 * The plugin will not fix the problem itself since flag data is delicate and
 * should not be tampered with midgame as the changes made by the plugin might
 * not match the desired settings.
 * 
 * This plugin, however, will also send out an alert message when coming across
 * such a tile. Pay attention to it and do one of the following two steps above
 * to fix the problem.
 * 
 * ---
 * 
 * Window Arrows Sprite Tearing
 * 
 * If a window object in RPG Maker MZ were to have an odd number for width size
 * then the arrow elements found for the window would be positioned on a half
 * pixel, giving it a blurry look and also have sprite tearing issues. This is
 * now fixed by rounding the number to the nearest whole number.
 * 
 * ---
 * 
 * Window Client Area Scaling Bug
 * 
 * If the window has a scale value different from 1.0, the client area (the
 * interactable parts) will not scale properly and appear clipped out. This
 * is now fixed by adjusting the client area to the window's scale values and
 * rounding upward to the nearest whole number.
 * 
 * ---
 * 
 * Window Skin Bleeding
 * 
 * This bug is fixed in the core scripts for RPG Maker MZ v1.3.0+.
 * 
 * Since the v1.2.0 update, Window.prototype._refreshBack's frame value has
 * been set from 96 to 95. This results in the window skin bleeding past the
 * window's intended borders. The Core Engine now reverts this change to
 * prevent the bleeding effect from happening.
 * 
 * ---
 *
 * ============================================================================
 * Major Changes: New Hard-Coded Features
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * Scroll-Linked Pictures
 *
 * - If a Parallax has a ! at the start of its filename, it is bound to the map
 * scrolling. The same thing now happens with pictures. If a Picture has a ! at
 * the start of its filename, it is bound to the map's scrolling as well.
 *
 * ---
 *
 * Movement Route Scripts
 *
 * - If code in a Movement Route Script command fails, instead of crashing the
 * game, it will now act as if nothing happened except to display the cause of
 * the error inside the console.
 *
 * ---
 * 
 * Script Call Failsafes
 * 
 * - If code found in Conditional Branches, Control Variables, and/or Script
 * Calls fail to activate, instead of crashing the game, it will now act as if
 * nothing happened except to display the cause of the error inside the
 * console.
 * 
 * ---
 * 
 * Digit Grouping
 * 
 * - There exists an option to change how numbers are displayed and converted
 * in your game. This option can be enabled or disabled by going into the
 * Plugin Manager > VisuMZ_0_OptionsCore > Quality of Life Settings >
 * Digit Grouping and toggling on/off whichever ones you want.
 * 
 * - Digit Grouping will follow the rules of whatever country/locale the Plugin
 * Parameters are set to. If it's to default 'en-US', then 1234567.123456 will
 * become 1,234,567.123456. Set it to 'es-ES' and it becomes 1.234.567,123456
 * instead.
 * 
 * - This uses JavaScript's Number.toLocaleString() function and will therefore
 * follow whatever rules it has. This means if there are trailing zeroes at the
 * end of a decimal, it will cut them off. Numbers like 123.45000 will become
 * 123.45 instead. Excess numbers past 6 decimal places will be rounded. A
 * number like 0.123456789 will become 0.123457 instead.
 * 
 * - Numbers in between [ and ], < and > will be excluded from digit grouping
 * in order for text codes to be preserved accurately. \I[1234] will remain as
 * \I[1234].
 * 
 * - If you would like to enter in a number without digit grouping, surround it
 * with {{ and }}. Typing in {{1234567890}} will yield 1234567890.
 * 
 * ---
 * 
 * Show Scrolling Text, additional functionality
 * 
 * The event command "Show Scrolling Text" now has additional functionality as
 * long as the VisuStella MZ Core Engine is installed. If the game dev inserts
 * "// Script Call" (without the quotes) inside the scrolling text, then the
 * entirity of the Show Scrolling Text event command will be ran as a giant
 * script call event command.
 * 
 * The reason why this functionality is added is because the "Script..." event
 * command contains only 12 lines maximum. This means for any script call
 * larger than 12 lines of code cannot be done by normal means as each script
 * call is ran as a separate instance.
 * 
 * By repurposing the "Show Scrolling Text" event command to be able to
 * function as an extended "Script..." event command, such a thing is now
 * possible with less hassle and more lines to code with.
 * 
 * This effect does not occur if the Show Scrolling Text event command does not
 * have "// Script Call" in its contents.
 * 
 * ---
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * The following are notetags that have been added through this plugin. These
 * notetags will not work with your game if this plugin is OFF or not present.
 * 
 * ---
 *
 * === Actors-Related Notetags ===
 *
 * Parameter limits can be adjusted in the Plugin Parameters, but this won't
 * lift the ability to change the values of an actor's initial or max level
 * past the editor's limits. Instead, this must be done through the usage of
 * notetags to accomplish the feat.
 *
 * ---
 *
 * <Max Level: x>
 *
 * - Used for: Actor Notetags
 * - Replace 'x' with an integer to determine the actor's max level.
 * - This allows you to go over the database limit of 99.
 * - If this notetag isn't used, default to the actor's database value.
 *
 * ---
 *
 * <Initial Level: x>
 *
 * - Used for: Actor Notetags
 * - Replace 'x' with an integer to determine the actor's initial level.
 * - This allows you to go over the database limit of 99.
 * - If this notetag isn't used, default to the actor's database value.
 *
 * ---
 *
 * === Classes-Related Notetags ===
 *
 * As actor levels can now surpass 99 due to the notetag system, there may be
 * some skills you wish certain classes can learn upon reaching higher levels
 * past 99, too.
 *
 * ---
 * 
 * <Learn At Level: x>
 *
 * - Used for: Class Skill Learn Notetags
 * - Replace 'x' with an integer to determine the level this class will learn
 *   the associated skill at.
 * - This allows you to go over the database limit of 99.
 * - If this notetag isn't used, default to the class's database value.
 *
 * ---
 *
 * === Enemies-Related Notetags ===
 *
 * Enemies are now given levels. The levels don't do anything except to serve
 * as a container for a number value. This way, levels can be used in damage
 * formulas (ie. a.atk - b.level) without causing any errors. To give enemies
 * levels, use the notetags below. These notetags also allow you to adjust the
 * base parameters, EXP, and Gold past the database limitations.
 *
 * ---
 *
 * <Level: x>
 *
 * - Used for: Enemy Notetags
 * - Replace 'x' with an integer to determine the enemy's level.
 * - If no level is declared, the level will default to 1.
 *
 * ---
 *
 * <param: x>
 *
 * - Used for: Enemy Notetags
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to alter.
 *   - This notetag does NOT work with X Parameters, S Parameters, or any
 *     custom parameters. This notetag ONLY works with the base parameters.
 * - Replace 'x' with an integer to set an enemy's 'param' base value.
 * - This will overwrite the enemy's database value and can exceed the original
 *   value limitation in the database.
 * - If these notetags aren't used, default to the enemy's database value.
 *
 * ---
 *
 * <EXP: x>
 * <Gold: x>
 *
 * - Used for: Enemy Notetags
 * - Replace 'x' with an integer to determine the enemy's EXP or Gold values.
 * - This will overwrite the enemy's database value and can exceed the original
 *   value limitation in the database.
 * - If these notetags aren't used, default to the enemy's database value.
 *
 * ---
 * 
 * === Animations-Related Notetags ===
 * 
 * Animations in RPG Maker MZ are done by Effekseer and the animation system
 * has been revamped. However, the animations are only centered on the targets
 * now, and cannot be attached to the head or foot. Insert these tags into
 * the names of the animations in the database to adjust their positions.
 * 
 * ---
 * 
 * <Head>
 * <Foot>
 * 
 * - Used for: Animation Name Tags
 * - Will set the animation to anchor on top of the sprite (if <Head> is used)
 *   or at the bottom of the sprite (if <Foot> is used).
 * 
 * ---
 * 
 * <Anchor X: x>
 * <Anchor Y: y>
 * 
 * <Anchor: x, y>
 * 
 * - Used for: Animation Name Tags
 * - Will anchor the animation at a specific point within the sprite based on
 *   the 'x' and 'y' values.
 * - Replace 'x' and 'y' with numeric values representing their positions based
 *   on a rate where 0.0 is the furthest left/up (x, y respectively) to 1.0 for
 *   the furthest right/down (x, y respectively).
 * 
 * Examples:
 * 
 * <Anchor X: 0.4>
 * <Anchor Y: 0.8>
 * 
 * <Anchor: 0.2, 0.9>
 * 
 * ---
 * 
 * <Offset X: +x>
 * <Offset X: -x>
 * <Offset Y: +y>
 * <Offset Y: -y>
 * 
 * <Offset: +x, +y>
 * <Offset: -x, -y>
 * 
 * - Used for: Animation Name Tags
 * - Will anchor the animation to be offset by an exact number of pixels.
 * - This does the same the editor does, except it lets you input values
 *   greater than 999 and lower than -999.
 * - Replace 'x' and 'y' with numeric values the exact number of pixels to
 *   offset the animation's x and y coordinates by.
 * 
 * Examples:
 * 
 * <Offset X: +20>
 * <Offset Y: -50>
 * 
 * <Offset: +10, -30>
 * 
 * ---
 * 
 * <Mirror Offset X>
 * <No Mirror Offset X>
 * 
 * - Used for: Animation Name Tags
 * - If an animation is mirrored, you can choose to have the animation's Offset
 *   X value be mirrored, too (or not at all).
 * - If no name tag is discovered, this will use the setting found in the
 *   Plugin Parameters > QoL Settings > Misc > Ani: Mirror Offset X setting.
 * 
 * ---
 * 
 * <Rate: x>
 * 
 * - Used for: MV Animation Name Tags
 * - Allows you to adjust the update for this MV Animation.
 *   - Does NOT work with Effekseer animations.
 * - The lower the number, the faster.
 * - Replace 'x' with a number representing the animation update rate.
 *   - Default rate: 4.
 *   - Minimum rate: 1.
 *   - Maximum rate: 10.
 * 
 * ---
 *
 * === Quality of Life-Related Notetags ===
 *
 * By default, RPG Maker MZ does not offer an encounter step minimum after a
 * random encounter has finished. This means that one step immediately after
 * finishing a battle, the player can immediately enter another battle. The
 * Quality of Life improvement: Minimum Encounter Steps allows you to set a
 * buffer range between battles for the player to have some breathing room.
 *
 * ---
 *
 * <Minimum Encounter Steps: x>
 *
 * - Used for: Map Notetags
 * - Replace 'x' with the minimum number of steps before the player enters a
 *   random encounter on that map.
 * - If this notetag is not used, then the minimum encounter steps for the map
 *   will default to Quality of Life Settings => Encounter Rate Min.
 *
 * ---
 *
 * Tile shadows are automatically added to certain tiles in the map editor.
 * These tile shadows may or may not fit some types of maps. You can turn them
 * on/off with the Quality of Life Plugin Parameters or you can override the
 * settings with the following notetags:
 *
 * ---
 *
 * <Show Tile Shadows>
 * <Hide Tile Shadows>
 *
 * - Used for: Map Notetags
 * - Use the respective notetag for the function you wish to achieve.
 * - If this notetag is not used, then the minimum encounter steps for the map
 *   will default to Quality of Life Settings => No Tile Shadows.
 *
 * ---
 * 
 * <Scroll Lock X>
 * <Scroll Lock Y>
 * 
 * - Used for: Map Notetags
 * - Will prevent the map from being able to scroll left/right(x) or up/down(y)
 *   if these notetags are present.
 * - Useful for when maps are just slightly smaller than normal and the tiny
 *   scrolling is distracting.
 * - This will use the display nudge setting found in the Plugin Parameters.
 * - This setting will be disabled if the map is zoomed in.
 * 
 * ---
 * 
 * <Scroll Lock X: x>
 * <Scroll Lock Y: y>
 * 
 * - Used for: Map Notetags
 * - Will prevent the map from being able to scroll left/right(x) or up/down(y)
 *   if these notetags are present and will nudge the map camera slightly.
 * - Useful for when maps are just slightly smaller than normal and the tiny
 *   scrolling is distracting.
 * - Replace 'x' and 'y' with numbers between 0 and 1 to represent how much is
 *   being judged.
 *   - For example, for a 1280x720 resolution, a 27 tile wide map will benefit
 *     from a nudge of 0.15625. Play with these numbers to determine the best
 *     value for your maps.
 * - This setting will be disabled if the map is zoomed in.
 * 
 * ---
 *
 * === Basic, X, and S Parameters-Related Notetags ===
 *
 * A battler's parameters, or stats as some devs know them as, are the values
 * that determine how a battler performs. These settings allow you to alter
 * behaviors and give boosts to trait objects in a more controlled manner.
 *
 * ---
 *
 * <param Plus: +x>
 * <param Plus: -x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'param' plus value when calculating totals.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'x' with an integer on how much to adjust the parameter by.
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <param Rate: x%>
 * <param Rate: x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Changes 'param' rate to 'x' to alter the total 'param' value.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <param Flat: +x>
 * <param Flat: -x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'param' plus value when calculating totals.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'x' with an integer on how much to adjust the parameter by.
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <param Max: x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Sets max caps for the 'param' to be 'x'. If there are multiple max caps
 *   available to the unit, then the highest will be selected.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'x' with an integer to determine what the max cap should be.
 * - This does NOT set the max cap to be lower than the default cap.
 *
 * ---
 *
 * <xparam Plus: +x%>
 * <xparam Plus: -x%>
 *
 * <xparam Plus: +x.x>
 * <xparam Plus: -x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'xparam' plus value when calculating totals.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <xparam Rate: x%>
 * <xparam Rate: x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Changes 'param' rate to 'x' to alter the total 'xparam' value.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <xparam Flat: +x%>
 * <xparam Flat: -x%>
 *
 * <xparam Flat: +x.x>
 * <xparam Flat: -x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'xparam' plus value when calculating totals.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <sparam Plus: +x%>
 * <sparam Plus: -x%>
 *
 * <sparam Plus: +x.x>
 * <sparam Plus: -x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'sparam' plus value when calculating totals.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 *
 * <sparam Rate: x%>
 * <sparam Rate: x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Changes 'param' rate to 'x' to alter the total 'sparam' value.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 *
 * <sparam Flat: +x%>
 * <sparam Flat: -x%>
 *
 * <sparam Flat: +x.x>
 * <sparam Flat: -x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'sparam' plus value when calculating totals.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   S Parameter => Formula.
 * 
 * ---
 * 
 * === Tileset-Related Notetags ===
 * 
 * ---
 * 
 * <Taller By x: id>
 * 
 * - Used for: Tileset Notetags
 * - Changes any page B, C, D, E tile marked by terrain tag 'id' to be taller
 *   by 'x' tiles.
 *   - Replace 'x' with a number representing the tiles to be taller by.
 *   - Replace 'id' with a number representing the Terrain Tag you will use to
 *     mark this tile with in the Database editor.
 * - When placing these tiles on the map, all you have to do is just place the
 *   bottom tile.
 *   - ie.: For a tree that's one tile taller, just place the tile at the
 *     bottom where you see the trunk.
 *   - Then, in-game, the tree will appear taller by one tile as marked.
 * - Depending on the priority settings, the tile will appear on different
 *   layers.
 *   - O will place the tile on the below player layer.
 *   - X will place the tile on the same level as the player.
 *   - ★ will place the tile on the above player layer.
 *   - O/X layer tiles have a special property where tall sprites standing in
 *     front of it will no longer clip the top of the sprite, while sprites
 *     standing behind it will be covered by it.
 *   - The X layer sprite will only have a hitbox of 1x1 at the base.
 * - This does not work with events using tiles as graphics. Instead, if you
 *   want to do similar, use the Event & Movement Core's <Tile Expand> notetags
 *   for better control.
 * 
 * ---
 *
 * === JavaScript Notetags: Basic, X, and S Parameters ===
 *
 * The following are notetags made for users with JavaScript knowledge. These
 * notetags are primarily aimed at Basic, X, and S Parameters.
 *
 * ---
 *
 * <JS param Plus: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'param' plus value.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   plus amount for the parameter's total calculation.
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   Basic Parameter => Formula.
 * - Use 'user' to refer to the currently equipping actor.
 *   - If you use code to refer to an actor's other stats like 'atk' and 'def',
 *     there is the potential to cause an infinite loop.
 *   - Use 'user.paramBase(x)' instead of 'user.atk', 'user.def', etc.
 *   - Plugin Parameter setting Parameters > "Convert JS To Base?" will
 *     automatically convert any instances of 'user.mhp', 'user.mmp',
 *     'user.atk', etc. to their base parameters.
 *   - Turn this off if you do not want to use it automatically.
 *   - You are responsible for any infinite loops this may cause.
 *
 * ---
 *
 * <JS param Rate: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'param' rate value.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   param rate amount for the parameter's total calculation.
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   Basic Parameter => Formula.
 * - Use 'user' to refer to the currently equipping actor.
 *   - If you use code to refer to an actor's other stats like 'atk' and 'def',
 *     there is the potential to cause an infinite loop.
 *   - Use 'user.paramBase(x)' instead of 'user.atk', 'user.def', etc.
 *   - Plugin Parameter setting Parameters > "Convert JS To Base?" will
 *     automatically convert any instances of 'user.mhp', 'user.mmp',
 *     'user.atk', etc. to their base parameters.
 *   - Turn this off if you do not want it.
 *   - You are responsible for any infinite loops this may cause.
 *
 * ---
 *
 * <JS param Flat: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'param' flat value.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   flat bonus amount for the parameter's total calculation.
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   Basic Parameter => Formula.
 * - Use 'user' to refer to the currently equipping actor.
 *   - If you use code to refer to an actor's other stats like 'atk' and 'def',
 *     there is the potential to cause an infinite loop.
 *   - Use 'user.paramBase(x)' instead of 'user.atk', 'user.def', etc.
 *   - Plugin Parameter setting Parameters > "Convert JS To Base?" will
 *     automatically convert any instances of 'user.mhp', 'user.mmp',
 *     'user.atk', etc. to their base parameters.
 *   - Turn this off if you do not want it.
 *   - You are responsible for any infinite loops this may cause.
 *
 * ---
 *
 * <JS param Max: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to determine what the max cap for 'param' should be. If there
 *   are multiple max caps available to the unit, then the highest is selected.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'code' with JavaScript code to determine the max cap for the
 *   desired parameter.
 * - Use 'user' to refer to the currently equipping actor.
 *   - If you use code to refer to an actor's other stats like 'atk' and 'def',
 *     there is the potential to cause an infinite loop.
 *   - Use 'user.paramBase(x)' instead of 'user.atk', 'user.def', etc.
 *   - Plugin Parameter setting Parameters > "Convert JS To Base?" will
 *     automatically convert any instances of 'user.mhp', 'user.mmp',
 *     'user.atk', etc. to their base parameters.
 *   - Turn this off if you do not want it.
 *   - You are responsible for any infinite loops this may cause.
 *
 * ---
 *
 * <JS xparam Plus: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'xparam' plus value.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   plus amount for the X parameter's total calculation.
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   X Parameter => Formula.
 * - Use 'user' to refer to the currently equipping actor.
 *   - If you use code to refer to an actor's other stats like 'atk' and 'def',
 *     there is the potential to cause an infinite loop.
 *   - Use 'user.paramBase(x)' instead of 'user.atk', 'user.def', etc.
 *   - Plugin Parameter setting Parameters > "Convert JS To Base?" will
 *     automatically convert any instances of 'user.mhp', 'user.mmp',
 *     'user.atk', etc. to their base parameters.
 *   - Turn this off if you do not want it.
 *   - You are responsible for any infinite loops this may cause.
 *
 * ---
 *
 * <JS xparam Rate: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'xparam' rate value.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   param rate amount for the X parameter's total calculation.
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   X Parameter => Formula.
 * - Use 'user' to refer to the currently equipping actor.
 *   - If you use code to refer to an actor's other stats like 'atk' and 'def',
 *     there is the potential to cause an infinite loop.
 *   - Use 'user.paramBase(x)' instead of 'user.atk', 'user.def', etc.
 *   - Plugin Parameter setting Parameters > "Convert JS To Base?" will
 *     automatically convert any instances of 'user.mhp', 'user.mmp',
 *     'user.atk', etc. to their base parameters.
 *   - Turn this off if you do not want it.
 *   - You are responsible for any infinite loops this may cause.
 *
 * ---
 *
 * <JS xparam Flat: code>
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'xparam' flat value.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   flat bonus amount for the X parameter's total calculation.
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   X Parameter => Formula.
 * - Use 'user' to refer to the currently equipping actor.
 *   - If you use code to refer to an actor's other stats like 'atk' and 'def',
 *     there is the potential to cause an infinite loop.
 *   - Use 'user.paramBase(x)' instead of 'user.atk', 'user.def', etc.
 *   - Plugin Parameter setting Parameters > "Convert JS To Base?" will
 *     automatically convert any instances of 'user.mhp', 'user.mmp',
 *     'user.atk', etc. to their base parameters.
 *   - Turn this off if you do not want it.
 *   - You are responsible for any infinite loops this may cause.
 *
 * ---
 *
 * <JS sparam Plus: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'sparam' plus value.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   plus amount for the S parameter's total calculation.
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   S Parameter => Formula.
 * - Use 'user' to refer to the currently equipping actor.
 *   - If you use code to refer to an actor's other stats like 'atk' and 'def',
 *     there is the potential to cause an infinite loop.
 *   - Use 'user.paramBase(x)' instead of 'user.atk', 'user.def', etc.
 *   - Plugin Parameter setting Parameters > "Convert JS To Base?" will
 *     automatically convert any instances of 'user.mhp', 'user.mmp',
 *     'user.atk', etc. to their base parameters.
 *   - Turn this off if you do not want it.
 *   - You are responsible for any infinite loops this may cause.
 *
 * ---
 *
 * <JS sparam Rate: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'sparam' rate value.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   param rate amount for the S parameter's total calculation.
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   S Parameter => Formula.
 * - Use 'user' to refer to the currently equipping actor.
 *   - If you use code to refer to an actor's other stats like 'atk' and 'def',
 *     there is the potential to cause an infinite loop.
 *   - Use 'user.paramBase(x)' instead of 'user.atk', 'user.def', etc.
 *   - Plugin Parameter setting Parameters > "Convert JS To Base?" will
 *     automatically convert any instances of 'user.mhp', 'user.mmp',
 *     'user.atk', etc. to their base parameters.
 *   - Turn this off if you do not want it.
 *   - You are responsible for any infinite loops this may cause.
 *
 * ---
 *
 * <JS sparam Flat: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'sparam' flat value.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   flat bonus amount for the S parameter's total calculation.
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   S Parameter => Formula.
 * - Use 'user' to refer to the currently equipping actor.
 *   - If you use code to refer to an actor's other stats like 'atk' and 'def',
 *     there is the potential to cause an infinite loop.
 *   - Use 'user.paramBase(x)' instead of 'user.atk', 'user.def', etc.
 *   - Plugin Parameter setting Parameters > "Convert JS To Base?" will
 *     automatically convert any instances of 'user.mhp', 'user.mmp',
 *     'user.atk', etc. to their base parameters.
 *   - Turn this off if you do not want it.
 *   - You are responsible for any infinite loops this may cause.
 *
 * ---
 * 
 * === Battle Setting-Related Notetags ===
 * 
 * These tags will change the settings for battle regardless of how the battle
 * system is set up normally. Insert these tags in either the noteboxes of maps
 * or the names of troops for them to take effect. If both are present for a
 * specific battle, then priority goes to the setting found in the troop name.
 * 
 * ---
 * 
 * <FV>
 * <Front View>
 * <Battle View: FV>
 * <Battle View: Front View>
 * 
 * - Used for: Map Notetags, Troop Name Tags, and Troop Comment Tags
 * - Changes the perspective of battle to front view for this specific map or
 *   battle.
 * - Make sure you have the enemy image files available in the img/enemies/
 *   folder as they will used instead of the "sv_enemies" graphics.
 * - If using Troop Comment Tags, then as long as the tag appears in a comment
 *   found on any of the Troop's pages (even if they don't run), the tag will
 *   be considered in effect.
 * 
 * ---
 * 
 * <SV>
 * <Side View>
 * <Battle View: SV>
 * <Battle View: Side View>
 * 
 * - Used for: Map Notetags, Troop Name Tags, and Troop Comment Tags
 * - Changes the perspective of battle to side view for this specific map or
 *   battle.
 * - Make sure you have the enemy image files available in the img/sv_enemies/
 *   folder as they will used instead of the "enemies" graphics.
 * - Make sure your actors have "sv_actor" graphics attached to them.
 * - If using Troop Comment Tags, then as long as the tag appears in a comment
 *   found on any of the Troop's pages (even if they don't run), the tag will
 *   be considered in effect.
 * 
 * ---
 * 
 * <DTB>
 * <Battle System: DTB>
 * 
 * - Used for: Map Notetags, Troop Name Tags, and Troop Comment Tags
 * - Changes the battle system to the default battle system (DTB).
 * - If using Troop Comment Tags, then as long as the tag appears in a comment
 *   found on any of the Troop's pages (even if they don't run), the tag will
 *   be considered in effect.
 * 
 * ---
 * 
 * <TPB Active>
 * <ATB Active>
 * <Battle System: TPB Active>
 * <Battle System: ATB Active>
 * 
 * <TPB Wait>
 * <ATB Wait>
 * <Battle System: TPB Wait>
 * <Battle System: ATB Wait>
 * 
 * - Used for: Map Notetags, Troop Name Tags, and Troop Comment Tags
 * - Changes the battle system to the time progress battle system (TPB) or
 *   active turn battle system (ATB) if you have VisuMZ_2_BattleSystemATB
 *   installed for the game project.
 * - If using Troop Comment Tags, then as long as the tag appears in a comment
 *   found on any of the Troop's pages (even if they don't run), the tag will
 *   be considered in effect.
 * 
 * ---
 * 
 * <BTB>
 * <Battle System: BTB>
 * 
 * <CTB>
 * <Battle System: CTB>
 * 
 * <ETB>
 * <Battle System: ETB>
 * 
 * <FTB>
 * <Battle System: FTB>
 * 
 * <OTB>
 * <Battle System: OTB>
 * 
 * <PTB>
 * <Battle System: PTB>
 * 
 * <STB>
 * <Battle System: STB>
 * 
 * - Used for: Map Notetags, Troop Name Tags, and Troop Comment Tags
 * - Changes the battle system to the respective battle system as long as you
 *   have those plugins installed in the current project.
 * - If using Troop Comment Tags, then as long as the tag appears in a comment
 *   found on any of the Troop's pages (even if they don't run), the tag will
 *   be considered in effect.
 * 
 * ---
 * 
 * <Grid>
 * <Battle Grid>
 * 
 * <No Grid>
 * <No Battle Grid>
 * 
 * - Used for: Map Notetags, Troop Name Tags, and Troop Comment Tags
 * - Requires VisuMZ_2_BattleGridSystem!
 * - Changes the battle system to utilize the Battle Grid System or not.
 * - If using Troop Comment Tags, then as long as the tag appears in a comment
 *   found on any of the Troop's pages (even if they don't run), the tag will
 *   be considered in effect.
 * - If none of these notetags or comment tags are found, refer to the default
 *   settings found in the Plugin Parameters.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 * 
 * === Animation Commands ===
 * 
 * ---
 * 
 * Animation: Play at Coordinate
 * - Plays an animation on the screen at a specific x, y coordinate even if
 *   there is no sprite attached.
 * 
 *   Animation ID:
 *   - Plays this animation.
 * 
 *   Coordinates:
 * 
 *     X:
 *     Y:
 *     - X/Y coordinate used for the animation.
 *       You may use JavaScript code.
 * 
 *   Mirror Animation?:
 *   - Mirror the animation?
 * 
 *   Mute Animation?:
 *   - Mute the animation?
 * 
 * ---
 * 
 * === Audio Plugin Commands ===
 * 
 * ---
 * 
 * Audio: Change Current BGM Volume
 * - Changes the current BGM volume without changing any of the current BGM's
 *   other properties and without restarting the BGM.
 * 
 *   Volume:
 *   - Change the current BGM's volume to what amount?
 *   - You may use JavaScript code.
 *   - Use numbers from 0 to 100.
 * 
 * ---
 * 
 * Audio: Change Current BGM Pitch
 * - Changes the current BGM pitch without changing any of the current BGM's
 *   other properties and without restarting the BGM.
 * 
 *   Pitch:
 *   - Change the current BGM's pitch to what amount?
 *   - You may use JavaScript code.
 *   - Use numbers from 50 to 150.
 * 
 * ---
 * 
 * Audio: Change Current BGM Pan
 * - Changes the current BGM pan without changing any of the current BGM's
 *   other properties and without restarting the BGM.
 * 
 *   Pan:
 *   - Change the current BGM's pan to what amount?
 *   - You may use JavaScript code.
 *   - Use numbers from -100 to 100.
 * 
 * ---
 * 
 * Audio: Change Current BGS Volume
 * - Changes the current BGS volume without changing any of the current BGS's
 *   other properties and without restarting the BGS.
 * 
 *   Volume:
 *   - Change the current BGS's volume to what amount?
 *   - You may use JavaScript code.
 *   - Use numbers from 0 to 100.
 * 
 * ---
 * 
 * Audio: Change Current BGS Pitch
 * - Changes the current BGS pitch without changing any of the current BGS's
 *   other properties and without restarting the BGS.
 * 
 *   Pitch:
 *   - Change the current BGS's pitch to what amount?
 *   - You may use JavaScript code.
 *   - Use numbers from 50 to 150.
 * 
 * ---
 * 
 * Audio: Change Current BGS Pan
 * - Changes the current BGS pan without changing any of the current BGS's
 *   other properties and without restarting the BGS.
 * 
 *   Pan:
 *   - Change the current BGS's pan to what amount?
 *   - You may use JavaScript code.
 *   - Use numbers from -100 to 100.
 * 
 * ---
 * 
 * === Debug Plugin Commands ===
 * 
 * ---
 * 
 * Debug: Current Controller ID
 * - PLAY TEST ONLY.
 * - Shows current controller ID in debug console.
 * - If you press a key on the keyboard, this data will be erased.
 * - Also copies to computer clipboard if possible.
 * 
 * ---
 * 
 * === Export Plugin Commands ===
 * 
 * ---
 * 
 * Export: All Maps Text
 * - PLAY TEST ONLY. Exports all of the text from all maps,
 *   their events, event pages, and any associated Common Events.
 * 
 *   - Exports 'Show Text' event commands.
 *   - Exports 'Show Choices' event commands.
 *   - Exports 'Show Scrolling Text' event commands.
 *   - Exports 'Comments' event commands.
 *   - Only the raw text will be exported.
 *   - Only usable during Play Test.
 * 
 * ---
 * 
 * Export: All Troops Text
 * - PLAY TEST ONLY. Exports all of the text from all troops,
 *   their event pages, and any associated Common Events.
 * 
 *   - Exports 'Show Text' event commands.
 *   - Exports 'Show Choices' event commands.
 *   - Exports 'Show Scrolling Text' event commands.
 *   - Exports 'Comments' event commands.
 *   - Only the raw text will be exported.
 *   - Only usable during Play Test.
 * 
 * ---
 * 
 * Export: Current Map Text
 * - PLAY TEST ONLY. Exports all of the text on the current map,
 *   its events, the event pages, and any associated Common Events.
 * 
 *   - Exports 'Show Text' event commands.
 *   - Exports 'Show Choices' event commands.
 *   - Exports 'Show Scrolling Text' event commands.
 *   - Exports 'Comments' event commands.
 *   - Only the raw text will be exported.
 *   - Only usable during Play Test.
 *   - If not in battle, this Plugin Command will not work.
 * 
 * ---
 * 
 * Export: Current Troop Text
 * - PLAY TEST ONLY. Exports all of the text on the current troop,
 *   the troop's event pages, and any associated Common Events.
 * 
 *   - Exports 'Show Text' event commands.
 *   - Exports 'Show Choices' event commands.
 *   - Exports 'Show Scrolling Text' event commands.
 *   - Exports 'Comments' event commands.
 *   - Only the raw text will be exported.
 *   - Only usable during Play Test.
 *   - If not in battle, this Plugin Command will not work.
 * 
 * ---
 * 
 * === Game Plugin Commands ===
 * 
 * ---
 *
 * Game: Open URL
 * - Opens a website URL from the game.
 *
 *   URL:
 *   - Where do you want to take the player?
 *
 * ---
 * 
 * === Gold Plugin Commands ===
 * 
 * ---
 *
 * Gold: Gain/Lose
 * - Allows you to give/take more gold than the event editor limit.
 *
 *   Value:
 *   - How much gold should the player gain/lose?
 *   - Use negative values to remove gold.
 *
 * ---
 * 
 * === Map Plugin Commands ===
 * 
 * ---
 * 
 * Map: Once Parallel
 * - Plays a Common Event parallel to the event once without repeating itself
 *   when done.
 * - Map only!
 * 
 *   Common Event ID:
 *   - The ID of the parallel Common Event to play.
 *   - Does NOT repeat itself when finished.
 *   - When exiting map scene or changing maps, all Once Parallels are cleared.
 *   - Once Parallels are not retained upon reentering the scene or map.
 *   - Once Parallels are not stored in memory and cannot be saved.
 * 
 * ---
 * 
 * === Picture Plugin Commands ===
 * 
 * ---
 * 
 * Picture: Coordinates Mode
 * - Play Test Mode only! Gets the coordinates of a specific picture as you
 *   move it across the screen.
 * 
 *   Picture ID: 
 *   - The ID of the pictures to track the coordinates of.
 * 
 * ---
 *
 * Picture: Easing Type
 * - Changes the easing type to a number of options.
 *
 *   Picture ID:
 *   - Which picture do you wish to apply this easing to?
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *
 *   Instructions:
 *   - Insert this Plugin Command after a "Move Picture" event command.
 *   - Turn off "Wait for Completion" in the "Move Picture" event.
 *   - You may have to add in your own "Wait" event command after.
 *
 * ---
 * 
 * Picture: Erase All
 * - Erases all pictures on the screen because it's extremely tedious to do it
 *   one by one.
 * 
 * ---
 * 
 * Picture: Erase Range
 * - Erases all pictures within a range of numbers because it's extremely
 *   tedious to do it one by one.
 * 
 *   Starting ID:
 *   - The starting ID of the pictures to erase.
 * 
 *   Ending ID:
 *   - The ending ID of the pictures to erase.
 * 
 * ---
 * 
 * Picture: Rotate by Angle
 * - Rotates target picture by a amount angle over a set duration instead of
 *   continuously.
 * 
 *   Picture ID Number:
 *   - What is the ID of the picture you wish to rotate?
 *   - Use a number between 1 and 100.
 *   - You may use JavaScript code.
 * 
 *   Adjust Angle:
 *   - What is the angle you wish to rotate the picture by?
 *   - Use degrees (360 degrees per full rotation).
 *   - You may use JavaScript code.
 * 
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 * 
 *   Duration:
 *   - Duration of rotation effect in frames.
 *   - 60 frames = 1 second.
 *   - You may use JavaScript code.
 * 
 *   Wait for Completion:
 *   - Wait until completion before moving onto the next event?
 * 
 * ---
 * 
 * Picture: Rotate to Angle
 * - Rotates target picture to a certain angle over a set duration
 *   instead of continuously.
 * 
 *   Picture ID Number:
 *   - What is the ID of the picture you wish to rotate?
 *   - Use a number between 1 and 100.
 *   - You may use JavaScript code.
 * 
 *   Target Angle:
 *   - What is the target angle you wish to rotate the picture?
 *   - Use degrees (360 degrees per full rotation).
 *   - You may use JavaScript code.
 * 
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 * 
 *   Duration:
 *   - Duration of rotation effect in frames.
 *   - 60 frames = 1 second.
 *   - You may use JavaScript code.
 * 
 *   Wait for Completion:
 *   - Wait until completion before moving onto the next event?
 * 
 * ---
 * 
 * Picture: Show Icon
 * - Shows an icon instead of a picture image.
 * - The picture icon can be controlled like any other picture.
 * 
 *   General:
 *
 *     Picture ID Number:
 *     - What is the ID of the picture you wish to show at?
 *     - Use a number between 1 and 100.
 *     - You may use JavaScript code.
 *
 *     Icon Index:
 *     - Select the icon index to use for this picture.
 *     - You may use JavaScript code.
 *
 *     Smooth Icon?:
 *     - This will make the icon smoothed out or pixelated.
 * 
 *   Picture Settings:
 * 
 *     Position:
 *
 *       Origin:
 *       - What is the origin of this picture icon?
 *         - Upper Left
 *         - Center
 *
 *       Position X:
 *       - X coordinate of the picture.
 *       - You may use JavaScript code.
 *
 *       Position Y:
 *       - Y coordinate of the picture.
 *       - You may use JavaScript code.
 * 
 *     Scale:
 *
 *       Width %:
 *       - Horizontal scale of the picture.
 *       - You may use JavaScript code.
 *       - 100 is 100%
 *
 *       Height %:
 *       - Vertical scale of the picture.
 *       - You may use JavaScript code.
 *       - 100 is 100%
 * 
 *     Blend:
 *
 *       Opacity:
 *       - Insert a number to determine opacity level.
 *       - Use a number between 0 and 255.
 *       - You may use JavaScript code.
 *
 *       Blend Mode:
 *       - What kind of blend mode do you wish to apply to the picture?
 * 
 * ---
 * 
 * === Screen Shake Plugin Commands ===
 * 
 * ---
 * 
 * Screen Shake: Custom:
 * - Creates a custom screen shake effect and also sets the following uses of
 *   screen shake to this style.
 * 
 *   Shake Style:
 *   - Select shake style type.
 *   - Original
 *   - Random
 *   - Horizontal
 *   - Vertical
 * 
 *   Power:
 *   - Power level for screen shake.
 * 
 *   Speed:
 *   - Speed level for screen shake.
 * 
 *   Duration:
 *   - Duration of screenshake.
 *   - You can use code as well.
 * 
 *   Wait for Completion:
 *   - Wait until completion before moving onto the next event?
 * 
 * ---
 * 
 * === Switch Plugin Commands ===
 * 
 * ---
 * 
 * Switches: Randomize ID(s)
 * - Select specific Switch ID's to randomize ON/OFF.
 * 
 *   Switch ID(s):
 *   - Select which Switch ID(s) to toggle.
 * 
 *   Chance for ON:
 *   - Chance out of 100 that determines the switches to be ON.
 * 
 * ---
 *
 * Switches: Randomize Range
 * - Select specific Switch ID Range to randomize ON/OFF.
 * - The ratio determines the ON/OFF distribution.
 *
 *   Starting ID:
 *   - The starting ID of the Switch to toggle.
 *
 *   Ending ID:
 *   - The ending ID of the Switch to toggle.
 *
 *   Chance for ON:
 *   - Chance out of 100 that determines the switches to be ON.
 *
 * ---
 *
 * Switches: Toggle ID(s)
 * - Select specific Switch ID's to toggle ON/OFF.
 * - ON becomes OFF. OFF becomes ON.
 *
 *   Switch ID(s):
 *   - Select which Switch ID(s) to toggle.
 *
 * ---
 *
 * Switches: Toggle Range
 * - Select specific Switch ID Range to toggle ON/OFF.
 * - ON becomes OFF. OFF becomes ON.
 *
 *   Starting ID:
 *   - The starting ID of the Switch to toggle.
 *
 *   Ending ID:
 *   - The ending ID of the Switch to toggle.
 *
 * ---
 * 
 * === System Plugin Commands ===
 * 
 * ---
 *
 * System: Battle System Change
 * - Switch to a different battle system in-game.
 * - Some battle systems REQUIRE their specific plugins!
 *
 *   Change To:
 *   - Choose which battle system to switch to.
 *     - Database Default (Use game database setting)
 *     - -
 *     - DTB: Default Turn Battle
 *     - TPB Active: Time Progress Battle (Active)
 *     - TPB Wait: Time Progress Battle (Wait)
 *     - -
 *     - BTB: Brave Turn Battle (Req VisuMZ_2_BattleSystemBTB)
 *     - CTB: Charge Turn Battle (Req VisuMZ_2_BattleSystemCTB)
 *     - OTB: Order Turn Battle (Req VisuMZ_2_BattleSystemOTB)
 *     - STB: Standard Turn Battle (Req VisuMZ_2_BattleSystemSTB)
 *
 * ---
 * 
 * System: Load Images
 * - Allows you to (pre) load up images ahead of time.
 *
 *   img/animations/:
 *   img/battlebacks1/:
 *   img/battlebacks2/:
 *   img/enemies/:
 *   img/faces/:
 *   img/parallaxes/:
 *   img/pictures/:
 *   img/sv_actors/:
 *   img/sv_enemies/:
 *   img/system/:
 *   img/tilesets/:
 *   img/titles1/:
 *   img/titles2/:
 *   - Which files do you wish to load from this directory?
 * 
 * ---
 *
 * System: Main Font Size
 * - Set the game's main font size.
 *
 *   Change To:
 *   - Change the font size to this number.
 *
 * ---
 *
 * System: Side View Battle
 * - Switch between Front View or Side View for battle.
 *
 *   Change To:
 *   - Choose which view type to switch to.
 *
 * ---
 *
 * System: Window Padding
 * - Change the game's window padding amount.
 *
 *   Change To:
 *   - Change the game's standard window padding to this value.
 *
 * ---
 * 
 * === Text Popup Command ===
 * 
 * ---
 * 
 * Text Popup: Show Text
 * - Adds text to a text popup window to briefly appear.
 * - Multiple text popups will be queued.
 * - Does not halt the game and works parallel to game activity.
 * 
 *   Text:
 *   - Write the text that you want to appear here.
 *   - You may use text codes.
 * 
 * ---
 * 
 * === Variable Plugin Commands ===
 * 
 * ---
 * 
 * Variable: JS Eval
 * - Pick a variable ID and value to alter through JS.
 * - Allows one line of code for variable ID and operand.
 * - Functions like RM2k3's Variable Pointers.
 * 
 *   Variable ID:
 *   - This is the target variable to alter.
 *   - You may use JavaScript.
 *   - ie: $gameVariables.value(1)
 * 
 *   Operation Type:
 *   - What operation do you wish to use for this Plugin Command?
 * 
 *   Operand Modifier:
 *   - Value to be used in calculating the target variable.
 *   - You may use JavaScript.
 *   - ie: $gameVariables.value(1)
 * 
 * ---
 * 
 * Variable: JS Block
 * - Pick a variable ID and value to alter through JS.
 * - Allows JS block code for variable ID and operand.
 * - Functions like RM2k3's Variable Pointers.
 * 
 *   Variable ID:
 *   - This is the target variable to alter.
 *   - You may use JavaScript.
 *   - ie: $gameVariables.value(1)
 * 
 *   Operation Type:
 *   - What operation do you wish to use for this Plugin Command?
 * 
 *   Operand Modifier:
 *   - Value to be used in calculating the target variable.
 *   - You may use JavaScript.
 *   - ie: $gameVariables.value(1)
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Quality of Life Settings
 * ============================================================================
 *
 * A variety of (optional) settings and changes are added with the Core Engine
 * to improve the quality of life for both the game devs and players alike.
 *
 * ---
 *
 * Play Test
 * 
 *   New Game on Boot:
 *   - Automatically start a new game on Play Test?
 *   - Only enabled during Play Test.
 *
 *   No Play Test Mode:
 *   - Force the game to be out of Play Test mode when play testing.
 * 
 *   Open Console on Boot:
 *   - Open the Debug Console upon booting up your game?
 *   - Only enabled during Play Test.
 *
 *   F6: Toggle Sound:
 *   - F6 Key Function: Turn on all sound to 100% or to 0%, toggling between
 *     the two.
 *   - Only enabled during Play Test.
 *
 *   F7: Toggle Fast Mode:
 *   - F7 Key Function: Toggle fast mode.
 *   - Only enabled during Play Test.
 * 
 *   CTRL + n: Quick Load:
 *   - CTRL + a number from 1 to 9 will yield a quick load of that safe file.
 *   - Does not count auto saves.
 *
 *   New Game > Common Event:
 *   - Runs a common event each time a new game is started.
 *   - Only enabled during Play Test.
 *
 * ---
 * 
 * Battle Test
 * 
 *   Add Item Type:
 *   Add Weapon Type:
 *   Add Armor Type:
 *   - Add copies of each database item, weapon, and/or armor?
 *   - Effective only during battle test.
 * 
 *   Added Quantity:
 *   - Determines how many items are added during a battle test instead of
 *     the maximum amount.
 * 
 *   Shift+R: Recover All:
 *   - For Play Test only!
 *   - During battle, pressing SHIFT + R will refill the whole party's HP
 *     and MP and status.
 * 
 *   Shift+T: Full TP
 *   - For Play Test only! 
 *   - During battle, pressing SHIFT + T will refill the whole party's TP.
 * 
 * ---
 *
 * Digit Grouping
 *
 *   Standard Text:
 *   - Make numbers like 1234567 appear like 1,234,567 for standard text
 *     inside windows?
 *
 *   Ex Text:
 *   - Make numbers like 1234567 appear like 1,234,567 for ex text,
 *     written through drawTextEx (like messages)?
 *
 *   Damage Sprites:
 *   - Make numbers like 1234567 appear like 1,234,567 for in-battle
 *     damage sprites?
 *
 *   Gauge Sprites:
 *   - Make numbers like 1234567 appear like 1,234,567 for visible gauge
 *     sprites such as HP, MP, and TP gauges?
 * 
 *   Country/Locale
 *   - Base the digit grouping on which country/locale?
 *   - This will follow all of the digit grouping rules found here:
 *     https://www.w3schools.com/JSREF/jsref_tolocalestring_number.asp
 *
 * ---
 *
 * Player Benefit
 *
 *   Encounter Rate Min:
 *   - Minimum number of steps the player can take without any
 *     random encounters.
 *
 *   Escape Always:
 *   - If the player wants to escape a battle, let them escape the battle
 *     with 100% chance.
 *
 *   Accuracy Formula:
 *   - Accuracy formula calculation change to
 *     Skill Hit% * (User HIT - Target EVA) for better results.
 *
 *   Accuracy Boost:
 *   - Boost HIT and EVA rates in favor of the player.
 *
 *   Level Up -> Full HP:
 *   Level Up -> Full MP:
 *   - Recovers full HP or MP when an actor levels up.
 *
 * ---
 * 
 * Picture-Related
 * 
 *   Anti-Zoom Pictures:
 *   - If on, prevents pictures from being affected by zoom.
 * 
 *   Picture Containers > Detach in Battle:
 *   - If detached, picture container will be separated from the spriteset
 *     while on the battle scene.
 *   - This will prevent any visual effects that alter the entire spriteset
 *     from affecting the detached picture container.
 * 
 *   Picture Containers > Detach in Map:
 *   - If detached, picture container will be separated from the spriteset
 *     while on the map scene.
 *   - This will prevent any visual effects that alter the entire spriteset
 *     from affecting the detached picture container.
 * 
 * ---
 *
 * Misc
 * 
 *   Animation: Mirror Offset X:
 *   - When animations are mirrored, mirror their Offset X values, too.
 *   - The animation name tags <Mirror Offset X> and <No Mirror Offset X> will
 *     override this effect for that specific animation.
 *
 *   Font Shadows:
 *   - If on, text uses shadows instead of outlines.
 *
 *   Font Smoothing:
 *   - If on, smoothes fonts shown in-game.
 * 
 *   Font Width Fix:
 *   - Fixes the font width issue with instant display non-monospaced fonts
 *     in the Message Window.
 *
 *   Key Item Protection:
 *   - If on, prevents Key Items from being able to be sold and from being
 *     able to be consumed.
 * 
 *   Map Name Text Code:
 *   - If on, map names will use text codes.
 *   - If off, only the raw map name will be used.
 *
 *   Modern Controls:
 *   - If on, allows usage of the Home/End buttons.
 *   - Home would scroll to the first item on a list.
 *   - End would scroll to the last item on a list.
 *   - Shift + Up would page up.
 *   - Shift + Down would page down.
 *
 *   MV Animation Rate:
 *   - Adjusts the rate at which MV animations play.
 *   - Default: 4.
 *   - Lower for faster.
 *   - Higher for slower.
 * 
 *   NewGame > CommonEvent:
 *   - Runs a common event each time a new game during any session is started.
 *   - Applies to all types of sessions, play test or not.
 *
 *   No Tile Shadows:
 *   - Removes tile shadows from being displayed in-game.
 *
 *   Pixel Image Rendering:
 *   - If on, pixelates the image rendering (for pixel games).
 *
 *   Require Focus?
 *   - Requires the game to be focused? If the game isn't focused, it will
 *     pause if it's not the active window.
 * 
 *   Shortcut Scripts:
 *   - Enables shortcut-based script variables and functions that can be used
 *     for script calls.
 *   - Shortcut list enabled for this is as follows:
 * 
 *     $commonEvent(id)
 *     - Queues a common event.
 *     - This does not interrupt the current event to run the desired common
 *       event. Any queued common events will run after the current event list
 *       has finished.
 *     - Replace 'id' with the ID of the common event you wish to queue.
 *     - Common events only run in the map scene and battle scene.
 * 
 *     $onceParallel(id)
 *     - Runs a common event in the background as a once parallel event.
 *     - Once parallel events will run in the background like a parallel
 *       process, except that it does not repeat after finishing.
 *     - Replace 'id' with the ID of the common event you wish to run.
 *     - Only works in the map scene and battle scene. Battle scene usage will
 *       require VisuMZ_1_BattleCore.
 * 
 *     $scene
 *     - Returns current scene.
 * 
 *     $spriteset
 *     - Returns current scene's spriteset if there is one.
 * 
 *     $subject
 *     - Returns last recorded identity of the battle's subject/user.
 * 
 *     $targets
 *     - Returns last recorded targets marked in battle.
 * 
 *     $target
 *     - Returns last recorded target marked in battle.
 *     - If multiple targets are recorded, then the first of the recorded
 *       targets will be set for this variable.
 *     - Works better with VisuMZ_1_BattleCore.
 * 
 *     $event
 *     - Returns currently initiated map event.
 *
 *   Smart Event Collision:
 *   - Makes events only able to collide with one another if they're
 *    'Same as characters' priority.
 * 
 *   Subfolder Name Purge:
 *   - Purge subfolder name from Plugin Parameters when reading data to let
 *     Plugin Commands work properly.
 *   - This is for plugins (such as the VisuMZ library) that utilize dynamic
 *     name registrations for Plugin Commands. Turn this on if you plan on
 *     using subfolders with VisuMZ plugins.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Battle System
 * ============================================================================
 * 
 * Choose which battle system to use for your game.
 * 
 * Some battle systems REQUIRE their specific plugins! This means if you do not
 * have the required battle system plugin installed, it will not change over.
 * The Core Engine plugin does not contain data for all of the battle systems
 * inside its code.
 * 
 * ---
 * 
 *   Database Default (Use game database setting)
 * 
 *   -
 * 
 *   DTB: Default Turn Battle
 *   TPB Active: Time Progress Battle (Active)
 *   TPB Wait: Time Progress Battle (Wait)
 * 
 *   -
 * 
 *   BTB: Brave Turn Battle (Req VisuMZ_2_BattleSystemBTB)
 *   CTB: Charge Turn Battle (Req VisuMZ_2_BattleSystemCTB)
 *   ETB: Energy Turn Battle (Req VisuMZ_2_BattleSystemETB)
 *   FTB: Free Turn Battle (Req VisuMZ_2_BattleSystemFTB)
 *   OTB: Order Turn Battle (Req VisuMZ_2_BattleSystemOTB)
 *   PTB: Press Turn Battle (Req VisuMZ_2_BattleSystemPTB)
 *   STB: Standard Turn Battle (Req VisuMZ_2_BattleSystemSTB)
 * 
 *   -
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Color Settings
 * ============================================================================
 *
 * These settings allow you, the game dev, to have more control over which
 * colors appear for what conditions found in the game. You can use regular
 * numbers to use the colors predetermined by the game's Window Skin or you
 * can use the #rrggbb format for a hex color code.
 * 
 * If the game's Window Skin is changed mid-game, the colors used will still be
 * based off the default Window Skin's colors. This is due to storing them in a
 * cache and preventing extra processing and reduces lag.
 *
 * You can find out what hex codes belong to which color from this website:
 * https://htmlcolorcodes.com/
 *
 * ---
 *
 * Basic Colors
 * - These are colors that almost never change and are used globally throughout
 *   the in-game engine.
 *
 *   Normal:
 *   System:
 *   Crisis:
 *   Death:
 *   Gauge Back:
 *   HP Gauge:
 *   MP Gauge:
 *   MP Cost:
 *   Power Up:
 *   Power Down:
 *   CT Gauge:
 *   TP Gauge:
 *   Pending Color:
 *   EXP Gauge:
 *   MaxLv Gauge:
 *   - Use #rrggbb for custom colors or regular numbers
 *   for text colors from the Window Skin.
 *
 * ---
 *
 * Alpha Colors:
 * - These are colors that have a bit of transparency to them and are specified
 *   by the 'rgba(red, green, blue, alpha)' format.
 * - Replace 'red' with a number between 0-255 (integer).
 * - Replace 'green' with a number between 0-255 (integer).
 * - Replace 'blue' with a number between 0-255 (integer).
 * - Replace 'alpha' with a number between 0 and 1 (decimal).
 * 
 *   Window Font Outline:
 *   Gauge Number Outline:
 *   Dim Color:
 *   Item Back Color:
 *   - Colors with a bit of alpha settings.
 *   - Format rgba(0-255, 0-255, 0-255, 0-1)
 *
 * ---
 *
 * Conditional Colors:
 * - These require a bit of JavaScript knowledge. These determine what colors
 *   to use under which situations and uses such as different values of HP, MP,
 *   TP, for comparing equipment, and determine damage popup colors.
 * 
 *   JS: Actor HP Color:
 *   JS: Actor MP Color:
 *   JS: Actor TP Color:
 *   - Code used for determining what HP, MP, or TP color to use for actors.
 *
 *   JS: Parameter Change:
 *   - Code used for determining whatcolor to use for parameter changes.
 *
 *   JS: Damage Colors:
 *   - Code used for determining what color to use for damage types.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Gold Settings
 * ============================================================================
 *
 * Gold is the main currency in RPG Maker MZ. The settings provided here will
 * determine how Gold appears in the game and certain behaviors Gold has.
 *
 * ---
 *
 * Gold Settings
 *
 *   Gold Max:
 *   - Maximum amount of Gold the party can hold.
 *   - Default 99999999
 *
 *   Gold Font Size:
 *   - Font size used for displaying Gold inside Gold Windows.
 *   - Default: 26
 *
 *   Gold Icon:
 *   - Icon used to represent Gold.
 *   - Use 0 for no icon.
 *
 *   Gold Overlap:
 *   - Text used too much Gold to fit in the window.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Image Loading
 * ============================================================================
 *
 * Not all images are loaded at once in-game. RPG Maker MZ uses asynchronous
 * loading which means images are loaded when needed. This may cause delays in
 * when you want certain images to appear. However, if an image is loaded
 * beforehand, they can be used immediately provided they aren't removed from
 * the image cache.
 *
 * ---
 *
 * Image Loading
 *
 *   img/animations/:
 *   img/battlebacks1/:
 *   img/battlebacks2/:
 *   img/enemies/:
 *   img/faces/:
 *   img/parallaxes/:
 *   img/pictures/:
 *   img/sv_actors/:
 *   img/sv_enemies/:
 *   img/system/:
 *   img/tilesets/:
 *   img/titles1/:
 *   img/titles2/:
 *   - Which files do you wish to load from this directory upon starting
 *     up the game?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Keyboard Input Settings
 * ============================================================================
 *
 * Settings for the game that utilize keyboard input. These are primarily for
 * the name input scene (Scene_Name) and the number input event command. These
 * settings have only been tested on English keyboards and may or may not be
 * compatible with other languages, so please disable these features if they do
 * not fit in with your game.
 * 
 * If a controller is connected upon entering the name change scene, it will
 * use the default manual-entry mode instead of the keyboard-entry mode. If a
 * controller button is pressed during the keyboard-entry mode, it will
 * automatically switch to the manual-entry mode.
 * 
 * This plugin does not provide support for controllers that are undetected by
 * RPG Maker MZ's default controller support.
 *
 * ---
 * 
 * Controls
 * 
 *   WASD Movement:
 *   - Enables or disables WASD movement for your game project.
 *   - Moves the W page down button to E.
 * 
 *   R Button: Dash Toggle:
 *   - Enables or disables R button as an Always Dash option toggle.
 * 
 * ---
 *
 * Name Input
 * 
 *   Enable?:
 *   - Enables keyboard input for name entry.
 *   - Only tested with English keyboards.
 * 
 *   Default Mode:
 *   - Select default mode when entering the scene.
 *     - Default - Uses Arrow Keys to select letters.
 *     - Keyboard - Uses Keyboard to type in letters.
 * 
 *   QWERTY Layout:
 *   - Uses the QWERTY layout for manual entry.
 * 
 *   Keyboard Message:
 *   - The message displayed when allowing keyboard entry.
 *   - You may use text codes here.
 * 
 *   Banned Words:
 *   - Players cannot use these words for names.
 *   - These include words inside the names.
 *   - If a banned word is used, a buzzer sound will play.
 *
 * ---
 *
 * Number Input
 * 
 *   Enable?:
 *   - Enables keyboard input for number entry.
 *   - Only tested with English keyboards.
 *
 * ---
 * 
 * Button Assist
 * 
 *   Finish Entry:
 *   - Text used to describe finish entry.
 * 
 *   Page Change:
 *   - Text used to describe character page changing.
 * 
 *   Switch to Keyboard:
 *   - Text used to describe the keyboard switch.
 * 
 *   Switch To Manual:
 *   - Text used to describe the manual entry switch.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Menu Background Settings
 * ============================================================================
 *
 * These settings in the Plugin Parameters allow you to adjust the background
 * images used for each of the scenes. The images will be taken from the game
 * project folders img/titles1/ and img/titles2/ to load into the game.
 *
 * These settings are only available to scenes found within the Main Menu, the
 * Shop scene, and the Actor Naming scene.
 *
 * ---
 *
 * Menu Background Settings:
 * 
 *   Blur Strength:
 *   - Strength used for menu background snapshots.
 *   - Default: 8. Higher is stronger. Lower is weaker.
 *
 *   Scene_Menu:
 *   Scene_Item:
 *   Scene_Skill:
 *   Scene_Equip:
 *   Scene_Status:
 *   Scene_Options:
 *   Scene_Save:
 *   Scene_Load:
 *   Scene_GameEnd:
 *   Scene_Shop:
 *   Scene_Name:
 *   - Individual background settings for the scene.
 *
 *   Scene_Unlisted
 *   - Individual background settings for any scenes that aren't listed above.
 *
 * ---
 *
 * Background Settings
 *
 *   Snapshop Opacity:
 *   - Snapshot opacity for the scene.
 *
 *   Background 1:
 *   - Filename used for the bottom background image.
 *   - Leave empty if you don't wish to use one.
 *
 *   Background 2:
 *   - Filename used for the upper background image.
 *   - Leave empty if you don't wish to use one.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Menu Button Assist Window
 * ============================================================================
 *
 * In most modern RPG's, there exist small windows on the screen which tell the
 * player what the control schemes are for that scene. This plugin gives you
 * the option to add that window to the menu scenes in the form of a Button
 * Assist Window.
 *
 * ---
 *
 * General
 * 
 *   Enable:
 *   - Enable the Menu Button Assist Window.
 * 
 *   Location:
 *   - Determine the location of the Button Assist Window.
 *   - Requires Plugin Parameters => UI => Side Buttons ON.
 *
 *   Background Type:
 *   - Select background type for this window.
 * 
 *   Split "Escape":
 *   - Used ONLY for those making their own custom keyboard key input maps.
 *     - This means you need to go to your own project's rmmz_core.js and
 *       modify Input.keyMapper to have buttons with "cancel" and "menu"
 *       instead of only "escape".
 *     - If there are none found, an error message will appear telling you to
 *       do so, or set the 'Split "Escape"' option to false.
 *     - If you are using Options Core's Rebind Keyboard option, be sure to
 *       have those have "cancel" and "menu" options inside there, too.
 *   - "Split" option makes separate instances of "Cancel" and "Menu" keys.
 *   - "Don't" option will consolidate both into "Escape" keys.
 *
 * ---
 *
 * Text
 * 
 *   Text Format:
 *   - Format on how the buttons are displayed.
 *   - Text codes allowed. %1 - Key, %2 - Text
 * 
 *   Multi-Key Format:
 *   - Format for actions with multiple keys.
 *   - Text codes allowed. %1 - Key 1, %2 - Key 2
 * 
 *   OK Text:
 *   Cancel Text:
 *   Switch Actor Text:
 *   - Default text used to display these various actions.
 *
 * ---
 *
 * Keys
 * 
 *   Key: Unlisted Format:
 *   - If a key is not listed below, use this format.
 *   - Text codes allowed. %1 - Key
 * 
 *   Key: Up:
 *   Key: Down:
 *   Key: Left:
 *   Key: Right:
 *   Key: Shift:
 *   Key: Tab:
 *   Key: A through Z:
 *   - How this key is shown in-game.
 *   - Text codes allowed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Controller Button Assist Settings
 * ============================================================================
 *
 * These are sub-settings for the Button Assist Window Plugin Parameters. Where
 * the Button Assist Window Plugin Parameters are focused on keyboard entries,
 * these sections are focused on gamepad controllers.
 * 
 * Add multiple gamepads to the list to give them different button assist text.
 * If a gamepad is being used but not listed here, the button assist text will
 * default to the keyboard version.
 * 
 * For those looking for more information regarding controllers, visit this
 * site: https://gamepad-tester.com/
 *
 * ---
 *
 * ID Information
 * 
 *   Controller ID Name:
 *   - Exact string used for this controller ID.
 *   - Plugin Command "Debug: Current Controller ID" for ID help.
 *   - Example: Xbox 360 Controller (XInput STANDARD GAMEPAD)
 * 
 *   Similarity Match:
 *   - Partial string used to check for controller ID.
 *   - Plugin Command "Debug: Current Controller ID" for ID help.
 *   - This check occurs secondary to the exact name.
 *   - Example: Xbox
 *
 * ---
 *
 * Directions
 * 
 *   Up:
 *   Left:
 *   Right:
 *   Down:
 *   - How this button is shown in-game.
 *   - Text codes allowed.
 *
 * ---
 *
 * Actions
 * 
 *   OK:
 *   Cancel:
 *   Menu:
 *   Shift:
 *   Page Up:
 *   Page Down:
 *   - How this button is shown in-game.
 *   - Text codes allowed.
 *   - *NOTE*: Controllers use a different mapping scheme from keyboards.
 *     - The "cancel" button is separate from the "menu" button though, for the
 *       majority of the button assist window help text, we'll be referring to
 *       the cancel button usually.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Menu Layout Settings
 * ============================================================================
 *
 * These settings allow you to rearrange the positions of the scenes accessible
 * from the Main Menu, the Shop scene, and the Actor Naming scene. This will
 * require you to have some JavaScript knowledge to make the windows work the
 * way you would like.
 *
 * ---
 *
 * Menu Layout Settings
 *
 *   Scene_Title:
 *   Scene_Menu:
 *   Scene_Item:
 *   Scene_Skill:
 *   Scene_Equip:
 *   Scene_Status:
 *   Scene_Options:
 *   Scene_Save:
 *   Scene_Load:
 *   Scene_GameEnd:
 *   Scene_Shop:
 *   Scene_Name:
 *   - Various options on adjusting the selected scene.
 *
 * ---
 *
 * Scene Window Settings
 *
 *   Background Type:
 *   - Selects the background type for the selected window.
 *   - Window
 *   - Dim
 *   - Transparent
 *
 *   JS: X, Y, W, H
 *   - Code used to determine the dimensions for the selected window.
 *
 * ---
 *
 * Scene_Title Settings
 * - The following are settings unique to Scene_Title.
 *
 * Title Screen
 *
 *   Document Title Format:
 *   - Format to display text in document title.
 *   - %1 - Main Title, %2 - Subtitle, %3 - Version
 *
 *   Subtitle:
 *   - Subtitle to be displayed under the title name.
 *   
 *   Version:
 *   - Version to be display in the title screen corner.
 *   
 *   JS: Draw Title:
 *   - Code used to draw the game title.
 *   
 *   JS: Draw Subtitle:
 *   - Code used to draw the game subtitle.
 *   
 *   JS: Draw Version:
 *   - Code used to draw the game version.
 *   
 *   Button Fade Speed:
 *   - Speed at which the buttons fade in at (1-255).
 *
 * ---
 *
 * Scene_GameEnd Settings
 * - The following are settings unique to Scene_GameEnd.
 *   
 *   Command Window List:
 *   - Window commands used by the title screen.
 *   - Add new commands here.
 *
 * ---
 *
 * Command Window List
 * - This is found under Scene_Title and Scene_GameEnd settings.
 *
 *   Symbol:
 *   - The symbol used for this command.
 * 
 *   STR: Text:
 *   - Displayed text used for this title command.
 *   - If this has a value, ignore the JS: Text version.
 * 
 *   JS: Text:
 *   - JavaScript code used to determine string used for the displayed name.
 * 
 *   JS: Show:
 *   - JavaScript code used to determine if the item is shown or not.
 * 
 *   JS: Enable:
 *   - JavaScript code used to determine if the item is enabled or not.
 * 
 *   JS: Ext:
 *   - JavaScript code used to determine any ext data that should be added.
 * 
 *   JS: Run Code:
 *   - JavaScript code that runs once this command is selected.
 * 
 * ---
 *
 * Title Picture Buttons:
 * - This is found under Scene_Title settings.
 * 
 *   Picture's Filename:
 *   - Filename used for the picture.
 *
 *   Button URL:
 *   - URL for the button to go to upon being clicked.
 *
 *   JS: Position:
 *   - JavaScript code that helps determine the button's Position.
 *
 *   JS: On Load:
 *   - JavaScript code that runs once this button bitmap is loaded.
 *
 *   JS: Run Code:
 *   - JavaScript code that runs once this button is pressed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Parameter Settings
 * ============================================================================
 *
 * A battler's parameters, or stats as some devs know them as, are the values
 * that determine how a battler performs. These settings allow you to alter
 * their behaviors and give boosts to trait objects in a controlled manner.
 *
 * ---
 *
 * Parameter Settings
 *
 *   Displayed Parameters
 *   - A list of the parameters that will be displayed in-game.
 *   - Shown in the Equip Menu.
 *   - Shown in the Status Menu.
 *
 *   Extended Parameters
 *   - The list shown in extended scenes (for other VisuStella plugins).
 *
 * ---
 *
 * === Basic Parameters ===
 *
 * MHP - MaxHP
 * - This is the maximum health points value. The amount of health points (HP)
 * a battler has determines whether or not the battler is in a living state or
 * a dead state. If the HP value is above 0, then the battler is living. If it
 * is 0 or below, the battler is in a dead state unless the battler has a way
 * to counteract death (usually through immortality). When the battler takes
 * damage, it is usually dealt to the HP value and reduces it. If the battler
 * is healed, then the HP value is increased. The MaxHP value determines what's
 * the maximum amount the HP value can be held at, meaning the battler cannot
 * be healed past that point.
 *
 * MMP - MaxMP
 * - This is the maximum magic points value. Magic points (MP) are typically
 * used for the cost of skills and spells in battle. If the battler has enough
 * MP to fit the cost of the said skill, the battler is able to use the said
 * skill provided that all of the skill's other conditions are met. If not, the
 * battler is then unable to use the skill. Upon using a skill that costs MP,
 * the battler's MP is reduced. However, the battler's MP can be recovered and
 * results in a gain of MP. The MaxMP value determines what is the maximum
 * amount the MP value can be held at, meaning the battler cannot recover MP
 * past the MaxMP value.
 *
 * ATK - Attack
 * - This is the attack value of the battler. By default, this stat is used for
 * the purpose of damage calculations only, and is typically used to represent
 * the battler's physical attack power. Given normal damage formulas, higher
 * values mean higher damage output for physical attacks.
 *
 * DEF - Defense
 * - This is the defense value of the battler. By default, this stat is used
 * for the purpose of damage calculations only, and is typically used to
 * represent the battler's physical defense. Given normal damage formulas,
 * higher values mean less damage received from physical attacks.
 *
 * MAT - Magic Attack
 * - This is the magic attack value of the battler. By default, this stat is
 * used for the purpose of damage calculations only, and is typically used to
 * represent the battler's magical attack power. Given normal damage formulas,
 * higher values mean higher damage output for magical attacks.
 *
 * MDF - Magic Defense
 * - This is the magic defense value of the battler. By default, this stat is
 * used for the purpose of damage calculations only, and is typically used to
 * represent the battler's magical defense. Given normal damage formulas,
 * higher values mean less damage received from magical attacks.
 *
 * AGI - Agility
 * - This is the agility value of the battler. By default, this stat is used to
 * determine battler's position in the battle turn's order. Given a normal turn
 * calculation formula, the higher the value, the faster the battler is, and
 * the more likely the battler will have its turn earlier in a turn.
 *
 * LUK - Luck
 * - This is the luck value of the battler. By default, this stat is used to
 * affect the success rate of states, buffs, and debuffs applied by the battler
 * and received by the battler. If the user has a higher LUK value, the state,
 * buff, or debuff is more likely to succeed. If the target has a higher LUK
 * value, then the state, buff, or debuff is less likely to succeed.
 *
 * ---
 *
 * Basic Parameters
 * 
 *   Show Actor Level?:
 *   - Show the actor level when displaying actors?
 *   - Affects for most windows in-game.
 * 
 *   Convert JS To Base?:
 *   - Automatically convert <JS param Plus/Rate/Flat: code> to use base
 *     parameters to prevent infinite loops.
 *
 *   HP Crisis Rate:
 *   - HP Ratio at which a battler can be considered in crisis mode.
 *
 *   JS: Formula:
 *   - Formula used to determine the total value all 8 basic parameters:
 *   - MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, LUK.
 *
 * Parameter Caps:
 *
 *   MaxHP Cap:
 *   MaxMP Cap:
 *   ATK Cap:
 *   DEF Cap:
 *   MAT Cap:
 *   MDF Cap:
 *   AGI Cap:
 *   LUK Cap:
 *   - Formula used to determine the selected parameter's cap.
 *   - These settings DO NOT raise the editor's maximum values. If you want to
 *     raise an enemy's maximum parameter value past their default cap, use the
 *     associated notetag for them instead.
 *
 * ---
 *
 * === X Parameters ===
 *
 * HIT - Hit Rate%
 * - This determines the physical hit success rate of the any physical action.
 * All physical attacks make a check through the HIT rate to see if the attack
 * will connect. If the HIT value passes the randomizer check, the attack will
 * connect. If the HIT value fails to pass the randomizer check, the attack
 * will be considered a MISS.
 *
 * EVA - Evasion Rate%
 * - This determines the physical evasion rate against any incoming physical
 * actions. If the HIT value passes, the action is then passed to the EVA check
 * through a randomizer check. If the randomizer check passes, the physical
 * attack is evaded and will fail to connect. If the randomizer check passes,
 * the attempt to evade the action will fail and the action connects.
 *
 * CRI - Critical Hit Rate%
 * - Any actions that enable Critical Hits will make a randomizer check with
 * this number. If the randomizer check passes, extra damage will be carried
 * out by the initiated action. If the randomizer check fails, no extra damage
 * will be added upon the action.
 *
 * CEV - Critical Evasion Rate%
 * - This value is put against the Critical Hit Rate% in a multiplicative rate.
 * If the Critical Hit Rate is 90% and the Critical Evasion Rate is
 * 20%, then the randomizer check will make a check against 72% as the values
 * are calculated by the source code as CRI * (1 - CEV), therefore, with values
 * as 0.90 * (1 - 0.20) === 0.72.
 *
 * MEV - Magic Evasion Rate%
 * - Where EVA is the evasion rate against physical actions, MEV is the evasion
 * rate against magical actions. As there is not magical version of HIT, the
 * MEV value will always be bit against when a magical action is initiated. If
 * the randomizer check passes for MEV, the magical action will not connect. If
 * the randomizer check fails for MEV, the magical action will connect.
 *
 * MRF - Magic Reflect Rate%
 * - If a magical action connects and passes, there is a chance the magical
 * action can be bounced back to the caster. That chance is the Magic Reflect
 * Rate. If the randomizer check for the Magic Reflect Rate passes, then the
 * magical action is bounced back to the caster, ignoring the caster's Magic
 * Evasion Rate. If the randomizer check for the Magic Reflect Rate fails, then
 * the magical action will connect with its target.
 *
 * CNT - Counter Attack Rate%
 * - If a physical action connects and passes, there is a chance the physical
 * action can be avoided and a counter attack made by the user will land on the
 * attacking unit. This is the Counter Attack Rate. If the randomizer check for
 * the Counter Attack Rate passes, the physical action is evaded and the target
 * will counter attack the user. If the randomizer check fails, the physical
 * action will connect to the target.
 *
 * HRG - HP% Regeneration
 * - During a battler's regeneration phase, the battler will regenerate this
 * percentage of its MaxHP as gained HP with a 100% success rate.
 *
 * MRG - MP% Regeneration
 * - During a battler's regeneration phase, the battler will regenerate this
 * percentage of its MaxMP as gained MP with a 100% success rate.
 *
 * TRG - TP% Regeneration
 * - During a battler's regeneration phase, the battler will regenerate this
 * percentage of its MaxTP as gained TP with a 100% success rate.
 *
 * ---
 *
 * X Parameters
 *
 *   JS: Formula:
 *   - Formula used to determine the total value all 10 X parameters:
 *   - HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, TRG.
 *
 * Vocabulary
 *
 *   HIT:
 *   EVA:
 *   CRI:
 *   CEV:
 *   MEV:
 *   MRF:
 *   CNT:
 *   HRG:
 *   MRG:
 *   TRG:
 *   - In-game vocabulary used for the selected X Parameter.
 *
 * ---
 *
 * === S Parameters ===
 *
 * TGR - Target Rate
 * - Against the standard enemy, the Target Rate value determines the odds of
 * an enemy specifically targeting the user for a single target attack. At 0%,
 * the enemy will almost never target the user. At 100%, it will have normal
 * targeting opportunity. At 100%+, the user will have an increased chance of
 * being targeted.
 * *NOTE: For those using the Battle A.I. Core, any actions that have specific
 * target conditions will bypass the TGR rate.
 *
 * GRD - Guard Effect
 * - This is the effectiveness of guarding. This affects the guard divisor
 * value of 2. At 100% GRD, damage will become 'damage / (2 * 1.00)'. At 50%
 * GRD, damage will become 'damage / (2 * 0.50)'. At 200% GRD, damage will
 * become 'damage / (2 * 2.00)' and so forth.
 *
 * REC - Recovery Effect
 * - This is how effective heals are towards the user. The higher the REC rate,
 * the more the user is healed. If a spell were to heal for 100 and the user
 * has 300% REC, then the user is healed for 300 instead.
 *
 * PHA - Pharmacology
 * - This is how effective items are when used by the user. The higher the PHA
 * rate, the more effective the item effect. If the user is using a Potion that
 * recovers 100% on a target ally and the user has 300% PHA, then the target
 * ally will receive healing for 300 instead.
 *
 * MCR - MP Cost Rate
 * - This rate affects how much MP skills with an MP Cost will require to use.
 * If the user has 100% MCR, then the MP Cost will be standard. If the user has
 * 50% MCR, then all skills that cost MP will cost only half the required MP.
 * If the user has 200% MCR, then all skills will cost 200% their MP cost.
 *
 * TCR - TP Charge Rate
 * - This rate affects how much TP skills with an TP will charge when gaining
 * TP through various actions. At 100%, TP will charge normally. At 50%, TP
 * will charge at half speed. At 200%, TP will charge twice as fast.
 *
 * PDR - Physical Damage Rate
 * - This rate affects how much damage the user will take from physical damage.
 * If the user has 100% PDR, then the user takes the normal amount. If the user
 * has 50% PDR, then all physical damage dealt to the user is halved. If the
 * user has 200% PDR, then all physical damage dealt to the user is doubled.
 *
 * MDR - Magical Damage Rate
 * - This rate affects how much damage the user will take from magical damage.
 * If the user has 100% MDR, then the user takes the normal amount. If the user
 * has 50% MDR, then all magical damage dealt to the user is halved. If the
 * user has 200% MDR, then all magical damage dealt to the user is doubled.
 *
 * FDR - Floor Damage Rate
 * - On the field map, this alters how much damage the user will take when the
 * player walks over a tile that damages the party. The FDR value only affects
 * the damage dealt to the particular actor and not the whole party. If FDR is
 * at 100%, then the user takes the full damage. If FDR is at 50%, then only
 * half of the damage goes through. If FDR is at 200%, then floor damage is
 * doubled for that actor.
 *
 * EXR - Experience Rate
 * - This determines the amount of experience gain the user whenever the user
 * gains any kind of EXP. At 100% EXR, the rate of experience gain is normal.
 * At 50%, the experience gain is halved. At 200%, the experience gain for the
 * user is doubled.
 *
 * ---
 *
 * S Parameters
 *
 *   JS: Formula
 *   - Formula used to determine the total value all 10 S parameters:
 *   - TGR, GRD, REC, PHA, MCR, TCR, PDR, MDR, FDR, EXR.
 *
 * Vocabulary
 *
 *   TGR:
 *   GRD:
 *   REC:
 *   PHA:
 *   MCR:
 *   TCR:
 *   PDR:
 *   MDR:
 *   FDR:
 *   EXR:
 *   - In-game vocabulary used for the selected S Parameter.
 *
 * ---
 *
 * Icons
 * 
 *   Draw Icons?
 *   - Draw icons next to parameter names?
 *
 *   MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, LUK:
 *   HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, TRG:
 *   TGR, GRD, REC, PHA, MCR, TCR, PDR, MDR, FDR, EXR:
 *   - Icon used for the selected parameter.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Custom Parameters Settings
 * ============================================================================
 *
 * As of version 1.07, you can add Custom Parameters to your game if RPG Maker
 * MZ's default set of parameters isn't enough for you. These parameters can
 * have variable functionality depending on how you code it. More importantly,
 * these are compatible with the VisuStella MZ menus and the VisuStella Core
 * Engine's Parameters settings.
 * 
 * For clarification, these settings do NOT create brand-new parameters for you
 * to use and add to your game nor are the bonuses supported by other plugins
 * in the VisuStella MZ library. These settings exist to function as a bridge
 * for non-VisuStella MZ plugins that have created their own parameter values
 * and to show them inside VisuStella menus.
 *
 * ---
 *
 * Custom Parameter
 * 
 *   Parameter Name:
 *   - What's the parameter's name?
 *   - Used for VisuStella MZ menus.
 * 
 *   Abbreviation:
 *   - What abbreviation do you want to use for the parameter?
 *   - Do not use special characters. Avoid numbers if possible.
 * 
 *   Icon:
 *   - What icon do you want to use to represent this parameter?
 *   - Used for VisuStella MZ menus.
 * 
 *   Type:
 *   - What kind of number value will be returned with this parameter?
 *     - Integer (Whole Numbers Only)
 *     - Float (Decimals are Allowed)
 * 
 *   JS: Value:
 *   - Run this code when this parameter is to be returned.
 *
 * ---
 * 
 * Instructions on Adding Custom Parameters to VisuStella Menus
 * 
 * In the Core Engine and Elements and Status Menu Core plugins, there are
 * plugin parameter fields for you to insert the parameters you want displayed
 * and visible to the player.
 * 
 * Insert in those the abbreviation of the custom parameter. For example, if
 * you want to add the "Strength" custom parameter and the abbreviation is
 * "str", then add "str" to the Core Engine/Elements and Status Menu Core's
 * plugin parameter field for "Strength" to appear in-game. Case does not
 * matter here so you can insert "str" or "STR" and it will register all the
 * same to make them appear in-game.
 * 
 * ---
 * 
 * Instructions on Using Custom Parameters as Mechanics
 * 
 * If you want to use a custom parameter in, say, a damage formula, refer to
 * the abbreviation you have set for the custom parameter. For example, if you
 * want to call upon the "Strength" custom parameter's value and its set
 * abbreviation is "str", then refer to it as such. This is case sensitive.
 * 
 * An example damage formula would be something like the following if using
 * "str" for "Strength" and "con" for "Constitution":
 * 
 *   a.str - b.con
 * 
 * These values are attached to the Game_Battlerbase prototype class.
 * 
 * ---
 * 
 * Instructions on Setting Custom Parameter Values
 * 
 * This requires JavaScript knowledge. There is no way around it. Whatever code
 * you insert into the "JS: Value" field will return the value desired. The
 * 'user' variable will refer to the Game_Battlerbase prototype object in which
 * the information is to be drawn from.
 * 
 * Depending on the "type" you've set for the Custom Parameter, the returned
 * value will be rounded using Math.round for integers and left alone if set as
 * a float number.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Screen Resolution Settings
 * ============================================================================
 *
 * Alter various properties to make the game look better for varying screen
 * resolutions. This is mostly for RPG Maker MZ version 1.3.0 and up where the
 * Troops tab has been updated to match the screen resolution settings found in
 * the System 2 Database tab.
 *
 * ---
 * 
 * Maps
 * 
 *   Scroll Lock Small X?:
 *   Scroll Lock Small Y?:
 *   - Automatically scroll lock X/Y scrolling if the map is too small?
 *   - Useful for 1280x720 resolutions when the map is 27 tiles wide.
 *     - This will get rid of the subtle scrolling when moving from one half of
 *       the screen to the other.
 *   - This setting will be disabled if the map is zoomed in.
 * 
 *   Locked Display X?:
 *   Locked Display Y?:
 *   - What display X/Y value do you want for auto-scroll locked maps?
 *   - Use a number between 0 and 1 for best results.
 * 
 * ---
 *
 * Troops
 * 
 *   Reposition Actors:
 *   - Update the position of actors in battle if the screen resolution
 *     has changed to become larger than 816x624.
 *   - Ignore if using the VisuStella MZ Battle Core.
 *   - When using the VisuStella MZ Battle Core, adjust the position through
 *     Battle Core > Parameters > Actor Battler Settings > JS: Home Position
 *
 *   Reposition Enemies:
 *   - Update the position of enemies in battle if the screen resolution
 *     has changed to become larger than 816x624.
 * 
 *     For MZ 1.3.0+?:
 *     - Both this parameter and its parent parameter need to be on when using
 *       RPG Maker MZ 1.3.0+.
 *     - If the Core Script is below 1.3.0, this setting is ignored. This does
 *       not take into account what version the editor is on. Pay attention to
 *       that as the plugin will not auto adjust for it.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Screen Shake Settings
 * ============================================================================
 *
 * Get more screen shake effects into your game!
 * 
 * These effects have been added by Aries of Sheratan!
 *
 * ---
 *
 * Settings
 * 
 *   Default Style:
 *   - The default style used for screen shakes.
 *   - Original
 *   - Random
 *   - Horizontal
 *   - Vertical
 * 
 *   JS: Original Style:
 *   JS: Random Style
 *   JS: Horizontal Style
 *   JS: Vertical Style
 *   - This code gives you control over screen shake for this screen
 *     shake style.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Title Command List Settings
 * ============================================================================
 *
 * This plugin parameter allows you to adjust the commands that appear on the
 * title screen. Some JavaScript knowledge is needed.
 *
 * ---
 *
 * Title Command
 * 
 *   Symbol:
 *   - The symbol used for this command.
 * 
 *   STR: Text:
 *   - Displayed text used for this title command.
 *   - If this has a value, ignore the JS: Text version.
 * 
 *   JS: Text:
 *   - JavaScript code used to determine string used for the displayed name.
 * 
 *   JS: Show:
 *   - JavaScript code used to determine if the item is shown or not.
 * 
 *   JS: Enable:
 *   - JavaScript code used to determine if the item is enabled or not.
 * 
 *   JS: Ext:
 *   - JavaScript code used to determine any ext data that should be added.
 * 
 *   JS: Run Code:
 *   - JavaScript code that runs once this command is selected.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Title Picture Buttons Settings
 * ============================================================================
 *
 * These allow you to insert picture buttons on your title screen that can
 * send users to various links on the internet when clicked.
 *
 * ---
 *
 * Settings
 * 
 *   Picture's Filename:
 *   - Filename used for the picture.
 * 
 *   Button URL:
 *   - URL for the button to go to upon being clicked.
 * 
 *   JS: Position:
 *   - JavaScript code that helps determine the button's Position.
 * 
 *   JS: On Load:
 *   - JavaScript code that runs once this button bitmap is loaded.
 * 
 *   JS: Run Code:
 *   - JavaScript code that runs once this button is pressed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: UI Settings
 * ============================================================================
 *
 * In previous iterations of RPG Maker, the Core Engine would allow you to
 * change the screen resolution. In MZ, that functionality is provided by
 * default but a number of UI settings still remain. These settings allow you
 * adjust how certain in-game objects and menus are displayed.
 *
 * ---
 *
 * UI Area
 *
 *   Fade Speed:
 *   - Default fade speed for transitions.
 *
 *   Box Margin:
 *   - Set the margin in pixels for the screen borders.
 *
 *   Command Window Width:
 *   - Sets the width for standard Command Windows.
 *
 *   Bottom Help Window:
 *   - Put the Help Window at the bottom of the screen?
 *
 *   Right Aligned Menus:
 *   - Put most command windows to the right side of the screen.
 *
 *   Show Buttons:
 *   - Show clickable buttons in your game?
 * 
 *     Show Cancel Button:
 *     Show Menu Button:
 *     Show Page Up/Down:
 *     Show Number Buttons:
 *     - Show/hide these respective buttons if the above is enabled.
 *     - If 'Show Buttons' is false, these will be hidden no matter what.
 *
 *   Button Area Height:
 *   - Sets the height for the button area.
 *
 *   Bottom Buttons:
 *   - Put the buttons at the bottom of the screen?
 *
 *   Side Buttons:
 *   - Push buttons to the side of the UI if there is room.
 * 
 *   State Icons Non-Frame:
 *   - Replace sprite frame system for non-frame.
 *   - Better for any instances where icons are zoomed.
 *
 * ---
 *
 * Larger Resolutions
 *
 * ---
 *
 * Menu Objects
 *
 *   Level -> EXP Gauge:
 *   - Draw an EXP Gauge under the drawn level.
 *
 *   Parameter Arrow:
 *   - The arrow used to show changes in the parameter values.
 *
 * ---
 *
 * Text Code Support
 *
 *   Class Names:
 *   - Make class names support text codes?
 *
 *   Nicknames:
 *   - Make nicknames support text codes?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Window Settings
 * ============================================================================
 *
 * Adjust the default settings of the windows in-game. This ranges from things
 * such as the line height (to better fit your font size) to the opacity level
 * (to fit your window skins).
 * 
 * These settings also allow you to add scroll bars to scrollable windows,
 * letting the player know how much of the window's contents there are left for
 * scrolling. The scroll bar can be enabled, disabled, have its thickness
 * changed, colors changed, etc.
 *
 * ---
 *
 * Window Defaults
 * 
 *   Enable Masking:
 *   - Enable window masking (windows hide other windows behind them)?
 *   - WARNING: Turning it on can obscure data.
 * 
 *   Correct Skin Bleed:
 *   - Allows you to enable/disable the window skin bleeding correction for
 *     those who wish to use the 95 calculator instead of 96 to augment higher
 *     and larger screen resolutions.
 *   - Read the "Bug Fixes" section if you don't understand what the window
 *     skin bleeding problem is.
 * 
 *   Line Height:
 *   - Default line height used for standard windows.
 *   - Avoid using odd numbers.
 *   - Visuals in RPG Maker and general game dev don't work well with odd
 *     numbers so avoid them unless you want your game's visuals to behave
 *     inconsistently.
 * 
 *   Item Padding:
 *   - Default line padding used for standard windows.
 *   - Avoid using odd numbers.
 *   - Visuals in RPG Maker and general game dev don't work well with odd
 *     numbers so avoid them unless you want your game's visuals to behave
 *     inconsistently.
 * 
 *   Back Opacity:
 *   - Default back opacity used for standard windows.
 *   - As of version 1.3.0, this is no longer needed.
 *   - This will still work for lower versions.
 * 
 *   Translucent Opacity:
 *   - Default translucent opacity used for standard windows.
 * 
 *   Window Opening Speed:
 *   - Default open speed used for standard windows.
 *   - Default: 32 (Use a number between 0-255)
 * 
 *   Column Spacing:
 *   - Default column spacing for selectable windows.
 *   - Default: 8
 * 
 *   Row Spacing:
 *   - Default row spacing for selectable windows.
 *   - Default: 4
 *
 * ---
 * 
 * Scroll Bar
 * 
 *   Show Scroll Bar?:
 *   - Show the scroll bar for scrollable windows?
 * 
 *   Thickness:
 *   - How thick do you want the scroll bar to be?
 * 
 *   Offset:
 *   - How much do you want to offset the scroll bar by?
 * 
 *   Bar Body Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Off Bar Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Off Bar Opacity:
 *   - What opacity value do you want the off bar opacity to be?
 *   - Use a number between 0 and 255.
 * 
 * ---
 * 
 * Selectable Items:
 * 
 *   Show Background?:
 *   - Selectable menu items have dark boxes behind them. Show them?
 * 
 *   Item Height Padding:
 *   - Default padding for selectable items.
 *   - Avoid using odd numbers.
 *   - Visuals in RPG Maker and general game dev don't work well with odd
 *     numbers so avoid them unless you want your game's visuals to behave
 *     inconsistently.
 * 
 *   JS: Draw Background:
 *   - Code used to draw the background rectangle behind clickable menu objects
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: JS: Quick Functions
 * ============================================================================
 * 
 * WARNING: This feature is highly experimental! Use it at your own risk!
 * 
 * JavaScript Quick Functions allow you to quickly declare functions in the
 * global namespace for ease of access. It's so that these functions can be
 * used in Script Calls, Control Variable Script Inputs, Conditional Branch
 * Script Inputs, Damage Formulas, and more.
 * 
 * ---
 * 
 * JS: Quick Function
 * 
 *   Function Name:
 *   - The function's name in the global namespace.
 *   - Will not overwrite functions/variables of the same name.
 * 
 *   JS: Code:
 *   - Run this code when using the function.
 * 
 * ---
 * 
 * If you have a Function Name of "Example", then typing "Example()" in a
 * Script Call, Conditional Branch Script Input, or similar field will yield
 * whatever the code is instructed to return.
 * 
 * If a function or variable of a similar name already exists in the global
 * namespace, then the quick function will be ignored and not created.
 * 
 * If a quick function contains bad code that would otherwise crash the game,
 * a fail safe has been implemented to prevent it from doing so, display an
 * error log, and then return a 0 value.
 * 
 * ---
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 1. These plugins may be used in free or commercial games provided that they
 * have been acquired through legitimate means at VisuStella.com and/or any
 * other official approved VisuStella sources. Exceptions and special
 * circumstances that may prohibit usage will be listed on VisuStella.com.
 * 
 * 2. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "VisuStella".
 * 
 * 3. You may edit the source code to suit your needs, so long as you do not
 * claim the source code belongs to you. VisuStella also does not take
 * responsibility for the plugin if any changes have been made to the plugin's
 * code, nor does VisuStella take responsibility for user-provided custom code
 * used for custom control effects including advanced JavaScript notetags
 * and/or plugin parameters that allow custom JavaScript code.
 * 
 * 4. You may NOT redistribute these plugins nor take code from this plugin to
 * use as your own. These plugins and their code are only to be downloaded from
 * VisuStella.com and other official/approved VisuStella sources. A list of
 * official/approved sources can also be found on VisuStella.com.
 *
 * 5. VisuStella is not responsible for problems found in your game due to
 * unintended usage, incompatibility problems with plugins outside of the
 * VisuStella MZ library, plugin versions that aren't up to date, nor
 * responsible for the proper working of compatibility patches made by any
 * third parties. VisuStella is not responsible for errors caused by any
 * user-provided custom code used for custom control effects including advanced
 * JavaScript notetags and/or plugin parameters that allow JavaScript code.
 *
 * 6. If a compatibility patch needs to be made through a third party that is
 * unaffiliated with VisuStella that involves using code from the VisuStella MZ
 * library, contact must be made with a member from VisuStella and have it
 * approved. The patch would be placed on VisuStella.com as a free download
 * to the public. Such patches cannot be sold for monetary gain, including
 * commissions, crowdfunding, and/or donations.
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 *
 * Team VisuStella
 * * Yanfly
 * * Arisu
 * * Olivia
 * * Irina
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.90: February 16, 2026
 * * Feature Update!
 * ** Battle System settings for "TPB Active" and "TPB Wait" will no longer
 *    conflict with VisuMZ_2_BattleSystemATB and VisuMZ_1_OptionsCore "Active"
 *    or "Wait" mode options set by the player.
 * 
 * Version 1.89: December 15, 2025
 * * Feature Update!
 * ** Added extra failsafes to ensure TPB Charge Time does not become NaN or
 *    an illegal value. Update made by Arisu.
 * 
 * Version 1.88: September 18, 2025
 * * Documentation Update!
 * ** Extra notes for <JS param Plus/Rate/Flat: code> notetags
 * *** Use 'user' to refer to the currently equipping actor.
 * *** If you use code to refer to an actor's other stats like 'atk' and 'def',
 *     there is the potential to cause an infinite loop.
 * *** Use 'user.paramBase(x)' instead of 'user.atk', 'user.def', etc.
 * *** Plugin Parameter setting Parameters > "Convert JS To Base?" will
 *     automatically convert any instances of 'user.mhp', 'user.mmp',
 *     'user.atk', etc. to their base parameters.
 * *** Turn this off if you do not want it.
 * *** You are responsible for any infinite loops this may cause.
 * * Feature Update!
 * ** <JS param Plus/Rate/Flat: code> now support 'user' as a variable.
 * * New Features!
 * ** New Plugin Parameter added by Arisu:
 * *** Plugin Parameters > Parameters > Convert JS To Base?
 * **** Automatically convert <JS param Plus/Rate/Flat: code> to use base
 *      parameters to prevent infinite loops.
 * 
 * Version 1.87: February 20, 2025
 * * Compatibility Update!
 * ** Updated for RPG Maker MZ Core Scripts 1.9.0!
 * *** Removed picture limit of 100 from Picture-related Plugin Commands.
 * *** Better compatibility with different icon sizes.
 * * Documentation Update!
 * ** Under Plugin Parameters: Menu Button Assist Window
 * *** Added text segments under Split "Escape"
 * **** This means you need to go to your own project's rmmz_core.js and
 *      modify Input.keyMapper to have buttons with "cancel" and "menu"
 *      instead of only "escape".
 * **** If there are none found, an error message will appear telling you to
 *      do so, or set the 'Split "Escape"' option to false.
 * **** If you are using Options Core's Rebind Keyboard option, be sure to
 *      have those have "cancel" and "menu" options inside there, too.
 * * Feature Update!
 * ** Plugin Parameters > Button Assist > Split "Escape" will now show an error
 *    message if a custom Input.keyMapper is not found with the "cancel" and
 *    "menu" keys implemented. Update made by Irina.
 * ** Updated Plugin Parameters > Button Assist > Split "Escape" description
 *    for Plugin Parameters to add in the following text: Requires custom
 *    Input.keyMapper with "cancel" and "menu".
 * ** Added better compatibility with WASD controls as to prioritize showing
 *    the arrow keys rather than the W, A, S, D keys. Also applies to any other
 *    rebindings.
 * 
 * Version 1.86: January 16, 2025
 * * Bug Fixes!
 * ** Fixed an issue where certain icons were not aligning properly at
 *    different line height settings. Fix made by Olivia.
 * 
 * Version 1.85: October 17, 2024
 * * Feature Updates!
 * ** Updated to fit RPG Maker MZ's updated 1.8.1 version better.
 * 
 * Version 1.84: August 29, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Feature!
 * ** New notetags added by Arisu:
 * *** Tileset Notetag: <Taller By x: id>
 * **** Changes any page B, C, D, E tile marked by terrain tag 'id' to be
 *      taller by 'x' tiles.
 * **** When placing these tiles on the map, all you have to do is just place
 *      the bottom tile.
 * ***** ie.: For a tree that's one tile taller, just place the tile at the
 *       bottom where you see the trunk. Then, in-game, the tree will appear
 *       taller by one tile as marked.
 * **** O/X layer tiles have a special property where tall sprites standing in
 *      front of it will no longer clip the top of the sprite, while sprites
 *      standing behind it will be covered by it.
 * **** This does not work with events using tiles as graphics. Instead, if
 *      you want to do similar, use the Event & Movement Core's <Tile Expand>
 *      notetags for better control.
 * 
 * Version 1.83: June 13, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Updated documentation for <param Max: x> notetag.
 * *** This does not set the max cap to be lower than the default cap.
 * * New Feature!
 * ** New Plugin Parameters added by Olivia:
 * *** Plugin Parameters > UI Settings > State Icons Non-Frame
 * **** Replace sprite frame system for non-frame.
 * **** Better for any instances where icons are zoomed.
 * 
 * Version 1.82: April 18, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** Added failsafe for $textPopup when some windows have not been initialized
 *    and requesting the text popup.
 * * New Feature!
 * ** New Plugin Parameter and playtest shortcut added by Arisu:
 * *** Plugin Parameters > QoL Settings > Playtest > CTRL + n: Quick Load
 * **** CTRL + a number from 1 to 9 will yield a quick load of that save file.
 * **** Does not count auto saves.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.81: February 15, 2024
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New notetags added for future plugin: VisuMZ_2_BattleGridSystem
 * *** <Grid>
 * *** <No Grid>
 * **** Requires the future plugin VisuMZ_2_BattleGridSystem!
 * **** Read the help section for more information on these.
 * ** New Plugin Parameter added by Arisu:
 * *** Plugin Parameters > Window > Correct Skin Bleed
 * **** Allows you to enable/disable the window skin bleeding correction for
 *      those who wish to use the 95 calculator instead of 96 to augment higher
 *      and larger screen resolutions.
 * **** Read the "Bug Fixes" section if you don't understand what the window
 *      skin bleeding problem is.
 * 
 * Version 1.80: January 18, 2024
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** Auto Save After New Game
 * **** Normally, when starting a new game through the "New Game" option, there
 *      is no auto save trigger. However, if you start a new game or load a
 *      saved game, then go to the Game End screen, return back to the title
 *      screen, then start a New Game, the auto save trigger occurs when it
 *      shouldn't. The Core Engine will now patch this and prevent the trigger
 *      from taking place.
 * 
 * Version 1.79: November 16, 2023
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Plugin Command added by Arisu:
 * ** Text Popup: Show Text
 * *** Adds text to a text popup window to briefly appear.
 * *** Multiple text popups will be queued.
 * *** Does not halt the game and works parallel to game activity.
 * 
 * Version 1.78: October 12, 2023
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Olivia and sponsored by AndyL:
 * *** QoL Settings > Battle Test > Shift+R: Recover All
 * **** For Play Test only! During battle, pressing SHIFT + R will refill the
 *      whole party's HP and MP and status.
 * *** QoL Settings > Battle Test > Shift+T: Full TP
 * **** For Play Test only! During battle, pressing SHIFT + T will refill the
 *      whole party's TP.
 * 
 * Version 1.77: August 17, 2023
 * * Bug Fixes!
 * ** Fixed a bug that would cause the BGS related Plugin Commands to crash.
 *    Fix made by Arisu.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** Scroll-Linked Pictures now work if the image file are in a folder within
 *    the img/pictures/ folder without the folder needing a ! at the start.
 * * New Features!
 * ** New Plugin Commands added by Arisu:
 * *** Picture: Rotate by Angle
 * **** Rotates target picture by a amount angle over a set duration instead of
 *      continuously.
 * **** View help file for more information on the Plugin Command.
 * *** Picture: Rotate to Angle
 * **** Rotates target picture to a certain angle over a set duration instead
 *      of continuously.
 * **** View help file for more information on the Plugin Command.
 * ** New Plugin Parameter added by Irina:
 * *** Parameters > Menu Button Assist > General > Split "Escape":
 * **** Used ONLY for those making their own custom keyboard key input maps.
 * **** "Split" option makes separate instances of "Cancel" and "Menu" keys.
 * **** "Don't" option will consolidate both into "Escape" keys.
 * 
 * Version 1.76: June 15, 2023
 * * Bug Fixes!
 * ** Fixed a bug that displayed the incorrect button press key for name input
 *    processing's cancel action. Fix made by Olivia.
 * 
 * Version 1.75: March 16, 2023
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** In Scene_Name, when using the Keyboard Input, the button assist windows
 *    will no longer display the keyboard shortcuts for Ok and Cancel, but
 *    instead, show them for ENTER and BKSP. Update made by Arisu.
 * ** In Scene_Name, when manual inputting, the Page Up/Dn keys are now
 *    displayed to show changing character pages.
 * * New Features!
 * ** New Plugin Parameters added by Arisu and sponsored by AndyL:
 * *** Params > Keyboard Input > Button Assist > Finish Entry
 * **** Text used to describe finish entry.
 * *** Params > Keyboard Input > Button Assist > Page Change
 * **** Text used to describe changing character pages.
 * *** Params > Window Settings > Scroll Bar
 * **** These settings also allow you to add scroll bars to scrollable windows,
 *      letting the player know how much of the window's contents there are
 *      left for scrolling. The scroll bar can be enabled, disabled, have its
 *      thickness changed, colors changed, etc.
 * 
 * Version 1.74: February 16, 2023
 * * Compatibility Update!
 * ** Plugin Commands for: Audio: Change Current BGM/BGS Volume/Pitch/Pan
 *    should now work properly with the updated RPG Maker MZ version and
 *    WebAudio changes. Update made by Arisu.
 * 
 * Version 1.73: January 20, 2023
 * * Compatibility Update!
 * ** Added better Effekseer version compatibility.
 * 
 * Version 1.72: December 15, 2022
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** Skill List Active After Party Member Change
 * **** If the skill list is active (ie. the player can move the cursor around)
 *      and the party member currently being viewed is changed via the button
 *      commands, then previously, RPG Maker MZ would still have that window be
 *      active despite having the cursor hidden temporarily. Upon pressing
 *      direction buttons, the cursor reveals itself and both the skill type
 *      window and skill list window are both active, making way for lots of
 *      potential problems to happen.
 * ** Water Tile Bug
 * *** It seems like there's a new bug that occurs if you create a tileset from
 *     scratch in RPG Maker MZ version 1.5.0+ and version 1.6.0+! What this bug
 *     does is it causes many tiles to become water tiles without intending to.
 *     You can find this out by turning off all the plugins in your project,
 *     putting a Ship or Boat on what are normally ground tiles, and then
 *     seeing the Ship or Boat traverse through it.
 * *** There are two ways to fix this. We cannot fix it through code in this
 *     plugin as it's a problem that involves the tileset json data there are
 *     ways to work around it so that you can get the proper water-flags to go
 *     where they need to be at.
 * **** 1. Copy a working un-bugged tileset onto the currently bugged one and
 *      reapply the tile features like passability, terrain tags, etc. This
 *      will make sure the water-passability tiles get copied over correctly.
 * **** 2. If you're on RPG Maker MZ version 1.5.0 or above, select a working
 *      un-bugged tileset (usually a pre-existing tileset when a new project is
 *      made), click the "Copy Page" button, go to the bugged tileset and press
 *      "Paste Page". You'll have to reapply any different properties like
 *      passabilities and terrain tags, but the water tile flags should now be
 *      working properly.
 * *** The plugin will not fix the problem itself since flag data is delicate
 *     and should not be tampered with midgame as the changes made by the
 *     plugin might not match the desired settings.
 * *** This plugin, however, will also send out an alert message when coming
 *     across such a tile. Pay attention to it and do one of the following two
 *     steps above to fix the problem.
 * * Documentation Update!
 * ** Added "Skill List Active After Party Member Change" section to the
 *    "Important Changes: Bug Fixes" section of the help file.
 * ** Added "Water Tile Bug" section to the "Important Changes: Bug Fixes"
 *    section of the help file.
 * ** Help file updated for new features.
 * * New Feature!
 * ** New Plugin Parameter added by Irina:
 * *** Plugin Parameters > Menu Backgrounds > Blur Strength
 * **** Strength used for menu background snapshots.
 * 
 * Version 1.71: November 10, 2022
 * * Bug Fixes!
 * ** Title Command Window should now allow for more than 4 custom commands
 *    without hidden commands. Fix made by Irina.
 * ** Fixed a problem with repeating animations from Visual State Effects
 *    causing softlocks. Fix made by Olivia.
 * 
 * Version 1.70: October 6, 2022
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** A texture check will now occur for sprites that are being removed and
 *     destroyed in order to prevent crashes. In the off chance that someone
 *     creates a sprite through a script call and removes it through such, the
 *     likelihood of this occurance becomes higher. This makes the destroy
 *     property take into account a texture check in order to see if the sprite
 *     removal is taking extra steps and will reduce those extra steps.
 * * Documentation Update!
 * ** Added "Sprite Removal and Destroy Crash" section to the "Important
 *    Changes: Bug Fixes" section.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.69: September 8, 2022
 * * Bug Fixes!
 * ** Fixed the combination of Button Assist Location: Top with Help Location:
 *    Bottom combination not working properly. Fix made by Irina.
 * 
 * Version 1.68: August 4, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Olivia and sponsored by Archeia:
 * *** Audio: Change Current BGM Volume
 * *** Audio: Change Current BGM Pitch
 * *** Audio: Change Current BGM Pan
 * *** Audio: Change Current BGS Volume
 * *** Audio: Change Current BGS Pitch
 * *** Audio: Change Current BGS Pan
 * **** Changes the current BGM/BGS volume/pitch/pan without changing any of
 *      the current BGM/BGS's other properties and without restarting BGM/BGS.
 * 
 * Version 1.67: July 28, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Added notes for Line Height and Item Padding parameters:
 * *** Avoid using odd numbers.
 * *** Visuals in RPG Maker and general game dev don't work well with odd
 *     numbers so avoid them unless you want your game's visuals to behave
 *     inconsistently.
 * *** This setting will be disabled if the map is zoomed in.
 * * New Features!
 * ** New map notetags added by Irina and sponsored by AndyL:
 * *** <Scroll Lock X>
 * *** <Scroll Lock X: x>
 * *** <Scroll Lock Y>
 * *** <Scroll Lock Y: y>
 * **** Causes the map to not scroll left/right(x) or up/down(y). Useful for
 *      when maps are just slightly smaller than normal and the tiny scrolling
 *      is distracting.
 * ** New Plugin Parameters added by Irina and sponsored by AndyL:
 * *** Plugin Parameters > Screen Resolution > Maps > Scroll Lock Small X?
 * *** Plugin Parameters > Screen Resolution > Maps > Scroll Lock Small Y?
 * *** Plugin Parameters > Screen Resolution > Maps > Locked Display X?
 * *** Plugin Parameters > Screen Resolution > Maps > Locked Display Y?
 * **** Automatically scroll locks small maps to prevent them from scrolling
 *      horizontally/vertically. Useful for 1280x720 resolutions when the map
 *      is 27 tiles wide. This will get rid of the subtle scrolling when moving
 *      from one half of the screen to the other.
 * **** This setting will be disabled if the map is zoomed in.
 * * Feature Update!
 * ** Warnings added to Line Height and Item Padding parameters:
 * *** Avoid using odd numbers.
 * *** Visuals in RPG Maker and general game dev don't work well with odd
 *     numbers so avoid them unless you want your game's visuals to behave
 *     inconsistently.
 * 
 * Version 1.66: July 14, 2022
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** Debug Console Refresh Bug
 * **** When pressing F5 to refresh while the debug console (DevTools) is open,
 *      some graphics will fail to load properly. This started occurring since
 *      the RPG Maker MZ 1.5.0 update and the code for loading the images has
 *      now been reverted to the 1.4.4 version where it was last stable.
 * * Documentation Update!
 * ** Help file updated for new major bug fix.
 * 
 * Version 1.65: June 30, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Irina:
 * *** Plugin Parameters > Parameter Settings > Show Actor Level?
 * **** Show the actor level when displaying actors?
 * **** Used for most windows in-game.
 * 
 * Version 1.64: June 9, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Command made by Arisu and sponsored by
 *    ImGonnaPutMyGameOnXboxAndYouCantStopMe:
 * *** Debug: Current Controller ID
 * **** PLAY TEST ONLY. Shows current controller ID in debug console.
 * **** Also copies to computer clipboard if possible.
 * ** New Plugin Parameters made by Arisu and sponsored by
 *    ImGonnaPutMyGameOnXboxAndYouCantStopMe:
 * *** Subsettings for Button Assist Window: Controller Button Assist
 * **** These are sub-settings for the Button Assist Window Plugin Parameters.
 *      Where the Button Assist Window Plugin Parameters are focused on
 *      keyboard entries, these sections are focused on gamepad controllers.
 * **** Add multiple gamepads to the list to give them different button assist
 *      text. If a gamepad is being used but not listed here, the button assist
 *      text will default to the keyboard version.
 * 
 * Version 1.63: May 2, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Irina:
 * *** Plugin Parameters > QoL Settings > Misc > Map Name Text Code
 * **** If on, map names will use text codes.
 * **** If off, only the raw map name will be used.
 * * Feature Update!
 * ** The map name text code change will no longer be on forcefully. It is now
 *    something that can be toggled by Plugin Parameters. Update by Irina.
 * 
 * Version 1.62: April 28, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Arisu and sponsored by Archeia:
 * *** Variable: JS Eval
 * **** Pick a variable ID and value to alter through JS.
 * **** Allows one line of code for variable ID and operand.
 * **** Functions like RM2k3's Variable Pointers.
 * *** Variable: JS Block
 * **** Pick a variable ID and value to alter through JS.
 * **** Allows JS block code for variable ID and operand.
 * **** Functions like RM2k3's Variable Pointers.
 * ** Map names can now use text codes. Made by Arisu and sponsored by Archeia.
 * 
 * Version 1.61: April 21, 2022
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** Battle Forced End Action Crash
 * **** Depending on various circumstances, currently active battlers can be
 *      cleared from the battle system at will due to a number of reasons.
 *      However, if it just so happens that the targets are cleared, too, with
 *      actions remaining, then a crash will follow up. This plugin will
 *      prevent that change. Fix made by Olivia.
 * 
 * Version 1.60: April 14, 2022
 * * Bug Fixes!
 * ** Number Input window will now respond to Home/End keys properly.
 *    Fix made by Olivia.
 * 
 * Version 1.59: April 7, 2022
 * * Compatibility Update!
 * ** RPG Maker MZ 1.4.4 compatibility update!
 * *** "Shutdown" command should now be more compatible with other aspects of
 *     the client when running from Node JS client on other OS's.
 * 
 * Version 1.58: March 24, 2022
 * * Feature Update!
 * ** Plugin Commands now have separators for easier selection.
 * 
 * Version 1.57: March 3, 2022
 * * Compatibility Update!
 * ** The "Shutdown" command from the title screen should now be compatible
 *    with RPG Maker MZ 1.4.4 and up. Update made by Olivia.
 * 
 * Version 1.56: February 10, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New features added by Arisu and sponsored by Anon:
 * *** Plugin Parameters > QoL > Misc > Shortcut Scripts
 * **** Enables shortcut-based script variables and functions that can be used
 *      for script calls.
 * **** Shortcut list enabled for this is as follows:
 * ***** $commonEvent(id), $onceParallel(id), $scene, $spriteset, $subject, 
 *       $targets, $target, $event
 * ***** For more information on how to use them, review the help file.
 * 
 * Version 1.55: January 27, 2022
 * * Feature Update!
 * ** Once Parallels for the map are now able to update even while other events
 *    are running. Update made by Arisu.
 * 
 * Version 1.54: January 13, 2022
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** Overly-Protective Substitute
 * *** When an ally with critical health is being targeted by a friendly non-
 *     Certain Hit skill (such as a heal or buff) and another ally has the
 *     substitute state, the other ally would "protect" the originally targeted
 *     ally and take the heal or buff.
 * *** The new changed behavior is that now, substitute will not trigger for
 *     any actions whose scope targets allies.
 * *** Fix made by Olivia.
 * * Documentation Update!
 * ** Added documentation for new MZ Bug: Overly-Protective Substitute.
 * * Feature Update!
 * ** Added a failsafe for those who did not update the plugin parameter
 *    settings and are using MV Animations.
 * 
 * Version 1.53: December 30, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Notetag added by Olivia:
 * *** <Rate: x>
 * **** Allows you to adjust the update for this MV Animation.
 * ***** Does NOT work with Effekseer animations.
 * **** The lower the number, the faster.
 * **** Replace 'x' with a number representing the animation update rate.
 * ***** Default rate: 4.
 * ***** Minimum rate: 1.
 * ***** Maximum rate: 10.
 * ** New Plugin Parameter added by Olivia:
 * *** Plugin Parameters > Qualify of Life Settings > MV Animation Rate
 * **** Adjusts the rate at which MV animations play.
 * **** Default: 4. Lower for faster. Higher for slower.
 * * Optimization Update!
 * ** MV Animations should run more optimized.
 * 
 * Version 1.52: December 16, 2021
 * * Compatibility Update!
 * ** RPG Maker MZ 1.4.0 compatibility update!
 * *** MV Animations played on screen level will now show up properly in the
 *     center of the screen.
 * 
 * Version 1.51: December 9, 2021
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** In the battle status windows, whenever actor names are displayed, the
 *     bitmap used to display their name text do not extend vertically all the
 *     way, causing letters like lowercase "Q" and "G" to be cut off, making
 *     them hard to distinguish from one another. The Core Engine will remedy
 *     this by extending the bitmap to allow enough room. Fix made by Irina.
 * 
 * Version 1.50: November 4, 2021
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** By default, if the attack skill is sealed via a trait and an actor has
 *     auto-battle, the action can still be used via auto-battle. This is now
 *     fixed and actors should not be able to attack via auto-battle if their
 *     attack ability is sealed. Fix made by Yanfly.
 * * Documentation Update!
 * ** Help file updated for new RPG Maker MZ bug fix.
 * 
 * Version 1.49: October 28, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Feature!
 * ** New Plugin Command added by Arisu and sponsored by Anon:
 * *** Map: Once Parallel
 * **** Plays a Common Event parallel to the event once without repeating
 *      itself when done. Map only!
 * **** When exiting map scene or changing maps, all Once Parallels are cleared
 * **** Once Parallels are not retained upon reentering the scene or map.
 * **** Once Parallels are not stored in memory and cannot be saved.
 * 
 * Version 1.48: October 21, 2021
 * * Feature Update!
 * ** Bitmap.blt function will now have source coordinates and destination X
 *    and Y coordinates rounded to prevent blurring. Update made by Olivia.
 * 
 * Version 1.47: October 14, 2021
 * * Bug Fixes!
 * ** Prevents Number Input window from having a NaN value due to holding down
 *    the fast forward key. Fix made by Arisu.
 * * Compatibility Update
 * ** Added compatibility functionality for future plugins.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Feature!
 * ** New Plugin Parameter added by Yanfly:
 * *** Plugin Parameters > QoL Settings > Misc > Font Width Fix
 * **** Fixes the font width issue with non-monospaced fonts in the Message
 *      Window. This is now an optional fix.
 * 
 * Version 1.46: September 23, 2021
 * * Documentation Update!
 * ** Added line to Plugin Command: "System: Battle System Change":
 * *** Some battle systems REQUIRE their specific plugins!
 * ** Added lines to "Plugin Parameters: Battle System":
 * *** Some battle systems REQUIRE their specific plugins! This means if you do
 *     not have the required battle system plugin installed, it will not change
 *     over. The Core Engine plugin does not contain data for all of the battle
 *     systems inside its code.
 * 
 * Version 1.45: September 17, 2021
 * * Bug Fixes!
 * ** Fixed a problem with "Picture: Coordinates Mode" to properly utilize the
 *    correct picture ID. Fix made by Arisu.
 * ** RPG Maker MZ Bug Fix:
 * *** Instant Text Discrepancy for Window_Message
 * **** Window_Message displays text differently when it draws letters one by
 *      one versus when the text is displayed instantly. This isn't noticeable
 *      with the default font, but it's very visible when using something like
 *      Arial. The error is due to Bitmap.measureTextWidth yielding a rounded
 *      value per letter versus per word. The Core Engine will provide a bug
 *      fix that will single out the cause and make it so that only
 *      Window_Message will not utilize any round number values when
 *      determining the width of each letter, whether or not it is shown
 *      instantly. This change will only affect Window_Message and not any
 *      other window in order to prevent unintended side effects.
 * **** Fix made by Yanfly.
 * * Compatibility Update!
 * ** RPG Maker MZ 1.3.3 compatibility.
 * *** Updated how gauges are drawn.
 * * Documentation Update!
 * ** Help file updated for new RPG Maker MZ bug fix.
 * 
 * Version 1.44: August 20, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Command added by Irina and sponsored by Anon.
 * *** "Animation: Play at Coordinate"
 * **** Plays an animation on the screen at a specific x, y coordinate even if
 *      there is no sprite attached.
 * 
 * Version 1.43: July 23, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Command added by Irina and sponsored by Archeia!
 * *** "Picture: Coordinates Mode"
 * **** Play Test Mode only!
 * **** Gets the coordinates of a specific picture as you move it across the
 *      screen.
 * **** Helpful for those who don't want to do guess work on the screen
 *      coordinates when it comes to placing down pictures.
 * 
 * Version 1.42: July 16, 2021
 * * Documentation Update
 * ** Added text to "Plugin Parameters: Color Settings" for clarification:
 * *** If the game's Window Skin is changed mid-game, the colors used will
 *     still be based off the default Window Skin's colors. This is due to
 *     storing them in a cache and preventing extra processing and reduces lag.
 * 
 * Version 1.41: July 2, 2021
 * * Compatibility Update
 * ** Further compatibility update with RPG Maker MZ 1.3.0+.
 * * Documentation Update
 * ** Added extra notes to "Important Changes: Bug Fixes" section for the
 *    "Window Skin Bleeding" bug:
 * *** This bug is fixed in the core scripts for RPG Maker MZ v1.3.0+.
 * 
 * Version 1.40: June 25, 2021
 * * Compatibility Update
 * ** Compatibility update with RPG Maker MZ 1.3.0+.
 * * Documentation Update:
 * ** Plugin Parameters > Window Settings > Back Opacity
 * *** As of version 1.3.0, this is no longer needed.
 * *** This will still work for lower versions.
 * ** Help file updated for new features.
 * * Feature Updates!
 * ** Window Skin Bleeding fix updated to newest version.
 * * New Plugin Parameters added:
 * ** Plugin Parmaeters > Screen Resolution Settings
 * *** These settings have been moved from the UI settings to be its own thing.
 * **** This is mostly for RPG Maker MZ version 1.3.0 and up where the Troops
 *      tab has been updated to match the screen resolution settings found in
 *      the System 2 Database tab.
 * *** Reposition Enemies > For MZ 1.3.0+?
 * **** Both of these plugin parameters need to be set to true in order for the
 *      repositioning to work for MZ v1.3.0.
 * **** If the Core Script is below 1.3.0, this setting is ignored. This does
 *      not take into account what version the editor is on. Pay attention to
 *      that as the plugin will not auto adjust for it.
 * 
 * Version 1.39: June 18, 2021
 * * Bug Fixes!
 * ** Number Inputs should now work with the controller if keyboard Number
 *    Input is enabled. Fix made by Olivia.
 * ** RPG Maker Bug: Termination Clear Effects
 * *** In RPG Maker MZ, requesting an animation while transitioning between
 *     scenes, such as going from the map scene to the battle scene, can cause
 *     crashes. This is because the animation queue does not take off
 *     immediately and will likely register incorrect targets for the scene.
 *     This plugin will forcefully clear any registered animations and balloon
 *     effects when terminating a scene in order to prevent crashes.
 * * Documentation Update!
 * ** Help file updated for updated features.
 * * Feature Update!
 * ** <Battle View: x> Troop Name tags can now work with comment tags.
 * ** <Battle System: x> Troop Name tags can now work with comment tags.
 * *** Updates made by Irina.
 * 
 * Version 1.38: June 11, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Command added by Irina and sponsored by Caz!
 * *** Picture: Show Icon
 * **** Shows an icon instead of a picture image.
 * **** The picture icon can be controlled like any other picture.
 * 
 * Version 1.37: May 21, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Arisu:
 * *** Switches: Randomize ID(s)
 * *** Switches: Randomize Range
 * *** Switches: Toggle ID(s)
 * *** Switches: Toggle Range
 * **** These Plugin Commands allow you to randomize the ON/OFF positions of
 *      switches or toggle them so that they flip their ON/OFF status.
 * 
 * Version 1.36: May 14, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Irina:
 * *** Export: All Maps Text
 * *** Export: All Troops Text
 * *** Export: Current Map Text
 * *** Export: Current Troop Text
 * **** Play Test Only Plugin Commands. These Plugin Commands are used for
 *      extracting all messages, show choices, comments, and scrolling text to
 *      parse and export them as a TXT file. Useful for getting a game's script
 *      to a voice actor or voice actress.
 * 
 * Version 1.35: May 7, 2021
 * * Documentation Update!
 * ** Added the following text to "Parameter Settings" Plugin Parameters for
 *    extra clarity regarding Parameter Caps:
 * *** These settings DO NOT raise the editor's maximum values. If you want to
 *     raise an enemy's maximum parameter value past their default cap, use the
 *     associated notetag for them instead.
 * 
 * Version 1.34: April 23, 2021
 * * Bug Fixes!
 * ** For the vanilla Equip Status window, custom parameters with integer
 *    values will now show up as integers and not percentiles. Fix by Olivia.
 * * Documentation Update!
 * ** Added clarity to the <param: x> notetag for enemies.
 * *** This notetag does NOT work with X Parameters, S Parameters, or any
 *     custom parameters. This notetag ONLY works with the base parameters.
 * 
 * Version 1.33: April 9, 2021
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Window Skin Bleeding
 * *** Since the v1.2.0 update, Window.prototype._refreshBack's frame value has
 *     been set from 96 to 95. This results in the window skin bleeding past
 *     the window's intended borders. The Core Engine now reverts this change
 *     to prevent the bleeding effect from happening.
 * * Feature Update!
 * ** "Encounter Rate Minimum" now has a valid minimum value of 1. Update made
 *    by Olivia.
 * 
 * Version 1.32: April 2, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Yanfly:
 * *** Plugin Parameters > QoL Settings > Battle Test > Add Item Type
 * *** Plugin Parameters > QoL Settings > Battle Test > Add Weapon Type
 * *** Plugin Parameters > QoL Settings > Battle Test > Add Armor Type
 * *** Plugin Parameters > QoL Settings > Battle Test > Added Quantity
 * **** By default, RPG Maker MZ only adds 99 of items and not weapons or armor
 *      making it awkward for testing specific battle mechanics. These settings
 *      allow you to add in custom amounts of items, weapons, and/or armors if
 *      you so wish.
 * 
 * Version 1.31: March 26, 2021
 * * Feature Update!
 * ** Title screen buttons will now become fully opaque when hovered over them
 *    instead of only when pressed. Update made by Yanfly.
 * 
 * Version 1.30: March 19, 2021
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Invisible Battle Sprites
 * *** If you removed a party member during battle and added that exact party
 *     member back into the same slot, their sprite would appear invisible. The
 *     VisuStella Core Engine will fix this problem and prevent it from
 *     happening. Fix made by Olivia.
 * * Compatibility Update
 * ** Added compatibility functionality for future plugins.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Arisu:
 * *** Plugin Parameters > QoL Settings > Misc > Ani: Mirror Offset
 * **** When animations are mirrored, mirror their Offset X values, too.
 * ** New animation name tags added by Arisu:
 * *** <Mirror Offset X> and <No Mirror Offset X>
 * **** If these text tags are placed in an animation's name, it will cause the
 *      offset X value to be mirrored when the animation is mirrored or have it
 *      ignored despite being mirrored.
 * 
 * Version 1.29: March 12, 2021
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Interactable window client area does not conform to the
 *    window's declared scale when the scale is anything but 1.0. This will now
 *    be fixed through this plugin. Fix made by Olivia.
 * * Documentation Update!
 * ** Added documentation for new RPG Maker MZ bug fixes!
 * ** Help file updated for updated features.
 * * Feature Update!
 * ** Name Input should be more controller-friendly. If a controller is
 *    connected upon entering the name change scene, it will use the default
 *    manual-entry mode instead of the keyboard-entry mode. If a controller
 *    button is pressed during the keyboard-entry mode, it will automatically
 *    switch to the manual-entry mode.
 * ** This plugin does not provide support for controllers that are undetected
 *    by RPG Maker MZ's default controller support.
 * ** This feature was already implemented since version 1.27 but wasn't
 *    documented so here we are. Update made by Irina.
 * 
 * Version 1.28: March 5, 2021
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: The arrows drawn by a window skin will no longer by
 *    placed on a half pixel when a window's size is an odd number. This would
 *    cause sprite tearing problems and look awful. Fix made by Irina.
 * * Documentation Update!
 * ** Added documentation for new RPG Maker MZ bug fixes!
 * 
 * Version 1.27: February 26, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Moved "Show Scrolling Text, additional functionality" section from Bug
 *    Fixes to Major Changes as it was placed in the wrong section.
 * * New Features!
 * ** New Plugin Parameter added by Yanfly.
 * *** Plugin Parameters > Keyboard Input > Name Input > Banned Words
 * **** Insert words you don't want your players to use for character names.
 * 
 * Version 1.26: February 19, 2021
 * * Bug Fixes!
 * ** Certain Plugin Parameters no longer have settings that restrict them to
 *    a maximum of 1. Fix made by Arisu.
 * * Feature Update!
 * ** Changed the default value for a New Game > Common Event upon Play Testing
 *    to 0 to prevent confusion. Update made by Arisu.
 * 
 * Version 1.25: February 5, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** Show Scrolling Text, additional functionality added by Arisu
 * *** The event command "Show Scrolling Text" now has additional functionality
 *     as long as the VisuStella MZ Core Engine is installed. If the game dev
 *     inserts "// Script Call" (without the quotes) inside the scrolling text,
 *     then the entirity of the Show Scrolling Text event command will be ran
 *     as a giant script call event command.
 * *** The reason why this functionality is added is because the "Script..."
 *     event command contains only 12 lines maximum. This means for any script
 *     call larger than 12 lines of code cannot be done by normal means as each
 *     script call is ran as a separate instance.
 * *** By repurposing the "Show Scrolling Text" event command to be able to
 *     function as an extended "Script..." event command, such a thing is now
 *     possible with less hassle and more lines to code with.
 * *** This effect does not occur if the Show Scrolling Text event command does
 *     not have "// Script Call" in its contents.
 * 
 * Version 1.24: January 29, 2021
 * * Documentation Update!
 * ** Plugin Parameters: Custom Parameters Settings added the following note:
 * *** For clarification, these settings do NOT create brand-new parameters for
 *     you to use and add to your game nor are the bonuses supported by other
 *     plugins in the VisuStella MZ library. These settings exist to function
 *     as a bridge for non-VisuStella MZ plugins that have created their own
 *     parameter values and to show them inside VisuStella menus.
 * * Feature Update!
 * ** Default JS Plugin Parameter for the Title Command: "Shutdown" now has a
 *    note in it that reads: "Do NOT use this command with mobile devices or
 *    browser games. All it does is cause the game to display a blank, black
 *    canvas which the player is unable to do anything with. It does NOT force
 *    close the browser tab nor the app."
 * *** This is also why this command is disabled by default for any non-NodeJS
 *     client deployed game versions.
 * ** Disabled some bug fixes made by the Core Engine for the default RMMZ code
 *    base since the 1.1.1 version now contains those very same fixes.
 * 
 * Version 1.23: January 22, 2021
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.22: January 15, 2021
 * * Documentation Update!
 * ** Added documentation for new RPG Maker MZ bug fixes!
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Sprite_Timer is added to the spriteset for the parent
 *    scene, making it affected by any filers, zooms, and/or blurs, hindering
 *    its readability.
 * 
 * Version 1.21: January 8, 2021
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New Plugin Parameters added by Arisu:
 * *** Plugin Parameters > Keyboard Input > Controls > WASD Movement
 * *** Plugin Parameters > Keyboard Input > Controls > R Button: Dash Toggle
 * 
 * Version 1.20: January 1, 2021
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.19: December 25, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s) and feature updates!
 * * Bug Fixes!
 * ** Fixed typo inside of the comments inside the JS: Quick Functions.
 * * Feature Update!
 * ** Plugin Parameters > Color Settings > Outline Color is now renamed to
 *    Font Outline.
 * * New Features!
 * ** New Plugin Parameters added by Shaz!
 * *** Plugin Parameters > Color Settings > Gauge Number Outline
 * 
 * Version 1.18: December 18, 2020
 * * Bug Fixes!
 * ** Compatible string text from the Items and Equips Core will no longer
 *    register MaxHP and MaxMP as percentile values for the info window.
 * ** RPG Maker MZ Bug: Gamepads no longer go rapidfire after a cleared input.
 *    There is now a period of delay for gamepads after an input clear.
 * ** RPG Maker MZ Bug: Unusable items on an individual-actor basis will no
 *    longer be overwritten by party-based usability for battle. Fix by Yanfly.
 * ** RPG Maker MV animations will no longer crash for unplayable sound
 *    effects. Fix made by Yanfly.
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * ** Added documentation for new RPG Maker MZ bug fixes!
 * * New Features!
 * ** New Plugin Parameters added by Yanfly!
 * *** Plugin Parameters > Button Assist > Key: Shift
 * *** Plugin Parameters > Button Assist > Key: Tab
 * **** These let you assign text codes to the Shift and Tab buttons for the
 *      Button Assist windows.
 * *** Plugin Parameters > QoL Settings > Misc > NewGame > CommonEvent
 * **** For an all version (including non-play test) common event to start new
 *      games with.
 * 
 * Version 1.17: December 11, 2020
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.16: December 4, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * Feature Update!
 * ** Button Assist Window for the change name scene will now default to "Tab"
 *    for switching between both modes. Update made by Yanfly.
 * * New Features!
 * ** New Plugin Parameter added by Yanfly:
 * *** Plugin Parameters > Keyboard Input > Default Mode
 * **** Select default mode when entering the scene.
 * 
 * Version 1.15: November 29, 2020
 * * Bug Fixes!
 * ** Pressing "Enter" in the change name scene while the actor's name is
 *    completely empty will no longer result in endless buzzer sounds. Fix made
 *    by Arisu.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * Feature Update!
 * ** For the name change scene, the "Tab" key now also lets the user switch
 *    between the two modes. Update made by Yanfly.
 * * New Features!
 * ** Two new plugin parameters added to Keyboard Input:
 * *** "Switch To Keyboard" and "Switch To Manual"
 * **** These determine the text used for the button assist window when
 *      switching between the two modes. Update made by Yanfly.
 * **** Button Assist window now takes into consideration for these texts.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.14: November 22, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New Plugin Command added by Yanfly!
 * *** System: Load Images
 * **** Allows you to (pre) load up images ahead of time.
 * 
 * Version 1.13: November 15, 2020
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.12: November 8, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * Feature Update!
 * ** Screen Shake Plugin Parameters and JS: Quick Function Plugin Parameters
 *    have been taken off experimental status.
 * * New Features!
 * ** New plugin parameters added by Arisu.
 * *** Plugin Parameters > Keyboard Input
 * **** Settings for the game that utilize keyboard input. These are primarily
 *      for the name input scene (Scene_Name) and the number input event
 *      command. These settings have only been tested on English keyboards and
 *      may or may not be compatible with other languages, so please disable
 *      these features if they do not fit in with your game.
 * 
 * Version 1.11: November 1, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Feature Update!
 * ** Bitmap smoothing now takes into consideration for rounding coordinates.
 *    Update made by Irina.
 * 
 * Version 1.10: October 25, 2020
 * * Feature Update!
 * ** Sprite animation location now adjusts position relative to the sprite's
 *    scale, too. Update made by Arisu.
 *
 * Version 1.09: October 18, 2020
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Auto Battle Lock Up. Fixed by Yanfly.
 * *** If an auto battle Actor fights against an enemy whose DEF/MDF is too
 *     high, they will not use any actions at all. This can cause potential
 *     game freezing and softlocks. This plugin will change that and have them
 *     default to a regular Attack.
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * 
 * Version 1.08: October 11, 2020
 * * Feature Update!
 * ** Altered sprite bitmaps via the various draw functions will now be marked
 *    as modified and will automatically purge themselves from graphical memory
 *    upon a sprite's removal to free up more resources. Change made by Yanfly.
 * ** Picture Sprite Origin anchors are now tied to the Game_Picture show and
 *    move commands instead of the Game_Interpretter commands. Change by Arisu.
 * 
 * Version 1.07: October 4, 2020
 * * Documentation Update!
 * ** New documentation added for the new Plugin Parameter category:
 *    "Custom Parameters".
 * * New Features!
 * ** New Plugin Parameter "Custom Parameters" added by Yanfly.
 * *** Create custom parameters for your game! These will appear in
 *     VisuStella MZ menus.
 * 
 * Version 1.06: September 27, 2020
 * * Bug Fixes!
 * ** Battler evasion pose can now occur if there is a miss. These were made
 *    separate in RPG Maker MZ and misses didn't enable the evasion pose. Fix
 *    made by Olivia.
 * * New Features!
 * ** New notetags for Maps and name tags for Troops added by Yanfly!
 * *** <Frontview>, <Sideview> to change the battle view for that specific map,
 *     or troop regardless of what other settings are.
 * *** <DTB>, <TPB Active>, <TPB Wait> to change the battle system for that
 *     specific map or troop regardless of what other settings are.
 * 
 * Version 1.05: September 20, 2020
 * * Bug Fixes!
 * ** <Level: x> notetag for enemies is now fixed! Fix made by Arisu.
 * * Documentation Update!
 * ** Documentation added for the new "System: Battle System Change" Plugin
 *    Command and removed the old "System: Set Time Progress Battle".
 * * Feature Update!
 * ** The Plugin Command "System: Set Time Progress Battle" has been replaced
 *    with "System: Battle System Change" instead. This is to accommodate
 *    future plugins that allow for different battle systems. Added by Yanfly.
 * *** If you have previously used "System: Set Time Progress Battle", please
 *     replace them. We apologize for the inconvenience.
 * * New Features!
 * ** In the Core Engine's plugin parameters, you can now set the Battle System
 *    used. This will default to whatever is the game database's setting. This
 *    feature is used for the future when new battle systems are made. Feature
 *    added by Yanfly.
 * 
 * Version 1.04: September 13, 2020
 * * Documentation Update!
 * ** Added new documentation for the "Title Command List" and Title Picture
 *    Buttons" plugin parameters. They now have a dedicated section each.
 * * Feature Updates!
 * ** Moved the "Title Command List" and "Title Picture Buttons" parameters
 *    from the Menu Layout > Title settings. They were far too hidden away and
 *    users had a hard time finding them. Update made by Yanfly.
 * *** Users who have customized these settings before will need to readjust
 *     them again. We apologize for the inconvenience.
 * 
 * Version 1.03: September 6, 2020
 * * Bug Fixes!
 * ** Having QoL > Modern Controls disabled (why would you) used to prevent the
 *    down button from working. It works again. Fix made by Yanfly.
 * * New Feature!
 * ** Plugin default settings now come with a "Game End" option on the title
 *    screen. For those updating from version 1.02 or order, you can add this
 *    in by opening the Core Engine > Plugin Parameters > Menu Layout Settings
 *    > press "delete" on Scene_Title > open it up, then the new settings will
 *    fill in automatically.
 * * New Experimental Feature Added:
 * ** Screen Shake Settings added to the Plugin Parameters.
 * *** Screen Shake: Custom Plugin Command added!
 * *** Credit to Aries of Sheratan, who gave us permission to use her formula.
 * *** We'll be expanding on more screen shaking options in the future.
 * * Optimization Update
 * ** Digit Grouping now works more efficiently.
 * 
 * Version 1.02: August 30, 2020
 * * New Feature!
 * ** New Plugin Command: "Picture: Erase All". Added by Olivia.
 * *** Erases all pictures on the screen because it's extremely tedious to do
 *     it one by one.
 * ** New Plugin Command: "Picture: Erase Range"
 * *** Erases all pictures within a range of numbers because it's extremely
 *     tedious to do it one by one.
 * * Optimization Update
 * ** Added a more accurate means of parsing numbers for Digit Grouping.
 * ** Window_Base.prototype.textSizeEx now stores data to a cache.
 * * Documentation Update
 * ** Added a section to Major Changes: New Hard-Coded Features on
 *    Digit Grouping and explaining its intricacies.
 * ** Added a note to Plugin Parameters > UI > Reposition Actors to ignore the
 *    setting if using the Battle Core.
 * 
 * Version 1.01: August 23, 2020
 * * Bug Fixes!
 * ** Digit grouping fixed to allow text codes to detect values larger than
 *    1000. Fix made by Olivia and Yanfly.
 * ** Param Plus, Rate, Flat notetags fixed. Fix made by Yanfly.
 * * New Experimental Feature Added:
 * ** JS: Quick Functions found in the Plugin Parameters
 *
 * Version 1.00: August 20, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Animation
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AnimationPoint
 * @text Animation: Play at Coordinate
 * @desc Plays an animation on the screen at a specific x, y
 * coordinate even if there is no sprite attached.
 *
 * @arg AnimationID:num
 * @text Animation ID
 * @parent Animation
 * @type animation
 * @desc Plays this animation.
 * @default 1
 * 
 * @arg Coordinates
 *
 * @arg pointX:eval
 * @text X
 * @parent Coordinates
 * @desc X coordinate used for the animation.
 * You may use JavaScript code.
 * @default Graphics.width / 2
 *
 * @arg pointY:eval
 * @text Y
 * @parent Coordinates
 * @desc Y coordinate used for the animation.
 * You may use JavaScript code.
 * @default Graphics.height / 2
 *
 * @arg Mirror:eval
 * @text Mirror Animation?
 * @parent Animation
 * @type boolean
 * @on Mirror
 * @off Normal
 * @desc Mirror the animation?
 * @default false
 *
 * @arg Mute:eval
 * @text Mute Animation?
 * @parent Animation
 * @type boolean
 * @on Mute
 * @off Normal
 * @desc Mute the animation?
 * @default false
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Audio
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AudioChangeBgmVolume
 * @text Audio: Change Current BGM Volume
 * @desc Changes the current BGM volume without changing any of the
 * current BGM's other properties and without restarting the BGM.
 *
 * @arg volume:eval
 * @text Volume
 * @desc Change the current BGM's volume to what amount?
 * You may use JavaScript code. Use numbers from 0 to 100.
 * @default 100
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command AudioChangeBgmPitch
 * @text Audio: Change Current BGM Pitch
 * @desc Changes the current BGM pitch without changing any of the
 * current BGM's other properties and without restarting the BGM.
 *
 * @arg pitch:eval
 * @text Pitch
 * @desc Change the current BGM's pitch to what amount?
 * You may use JavaScript code. Use numbers from 50 to 150.
 * @default 100
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command AudioChangeBgmPan
 * @text Audio: Change Current BGM Pan
 * @desc Changes the current BGM pan without changing any of the
 * current BGM's other properties and without restarting the BGM.
 *
 * @arg pan:eval
 * @text Pan
 * @desc Change the current BGM's pan to what amount?
 * You may use JavaScript code. Use numbers from -100 to 100.
 * @default 0
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command AudioChangeBgsVolume
 * @text Audio: Change Current BGS Volume
 * @desc Changes the current BGS volume without changing any of the
 * current BGS's other properties and without restarting the BGS.
 *
 * @arg volume:eval
 * @text Volume
 * @desc Change the current BGS's volume to what amount?
 * You may use JavaScript code. Use numbers from 0 to 100.
 * @default 100
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command AudioChangeBgsPitch
 * @text Audio: Change Current BGS Pitch
 * @desc Changes the current BGS pitch without changing any of the
 * current BGS's other properties and without restarting the BGS.
 *
 * @arg pitch:eval
 * @text Pitch
 * @desc Change the current BGS's pitch to what amount?
 * You may use JavaScript code. Use numbers from 50 to 150.
 * @default 100
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command AudioChangeBgsPan
 * @text Audio: Change Current BGS Pan
 * @desc Changes the current BGS pan without changing any of the
 * current BGS's other properties and without restarting the BGS.
 *
 * @arg pan:eval
 * @text Pan
 * @desc Change the current BGS's pan to what amount?
 * You may use JavaScript code. Use numbers from -100 to 100.
 * @default 0
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Debug
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command DebugConsoleLastControllerID
 * @text Debug: Current Controller ID
 * @desc PLAY TEST ONLY. Shows current controller ID in debug console.
 * Also copies to computer clipboard if possible.
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Export
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ExportAllMapText
 * @text Export: All Maps Text
 * @desc PLAY TEST ONLY. Exports all of the text from all maps,
 * their events, event pages, and any associated Common Events.
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command ExportAllTroopText
 * @text Export: All Troops Text
 * @desc PLAY TEST ONLY. Exports all of the text from all troops,
 * their event pages, and any associated Common Events.
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command ExportCurMapText
 * @text Export: Current Map Text
 * @desc PLAY TEST ONLY. Exports all of the text on the current map,
 * its events, the event pages, and any associated Common Events.
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command ExportCurTroopText
 * @text Export: Current Troop Text
 * @desc PLAY TEST ONLY. Exports all of the text on the current troop,
 * the troop's event pages, and any associated Common Events.
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Game
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command OpenURL
 * @text Game: Open URL
 * @desc Opens a website URL from the game.
 *
 * @arg URL:str
 * @text URL
 * @desc Where do you want to take the player?
 * @default https://www.google.com/
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Gold
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GoldChange
 * @text Gold: Gain/Lose
 * @desc Allows you to give/take more gold than the event editor limit.
 *
 * @arg value:eval
 * @text Value
 * @desc How much gold should the player gain/lose?
 * Use negative values to remove gold. You may use JS.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Map
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command MapOnceParallel
 * @text Map: Once Parallel
 * @desc Plays a Common Event parallel to the event once without
 * repeating itself when done. Map only!
 *
 * @arg CommonEventID:num
 * @text Common Event ID
 * @type common_event
 * @desc The ID of the parallel Common Event to play.
 * Does NOT repeat itself when finished.
 * @default 1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Picture
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureCoordinatesMode
 * @text Picture: Coordinates Mode
 * @desc Play Test Mode only! Gets the coordinates of a specific
 * picture as you move it across the screen.
 *
 * @arg PictureID:num
 * @text Picture ID
 * @type number
 * @min 1
 * @desc The ID of the pictures to track the coordinates of.
 * @default 1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureEasingType
 * @text Picture: Easing Type
 * @desc Changes the easing type to a number of options.
 *
 * @arg pictureId:num
 * @text Picture ID
 * @type number
 * @min 1
 * @desc Which picture do you wish to apply this easing to?
 * @default 1
 *
 * @arg easingType:str
 * @text Easing Type
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default Linear
 *
 * @arg LineBreak
 * @text ------------------------
 * @default --------------------------------
 *
 * @arg Instructions1
 * @text Instructions
 * @default Insert this Plugin Command after
 *
 * @arg Instructions2
 * @text -
 * @default a "Move Picture" event command.
 * 
 * @arg Instructions3
 * @text -
 * @default Turn off "Wait for Completion"
 *
 * @arg Instructions4
 * @text -
 * @default in the "Move Picture" event.
 *
 * @arg Instructions5
 * @text -
 * @default You may have to add in your own
 *
 * @arg Instructions6
 * @text -
 * @default "Wait" event command after.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureEraseAll
 * @text Picture: Erase All
 * @desc Erases all pictures on the screen because it's extremely
 * tedious to do it one by one.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureEraseRange
 * @text Picture: Erase Range
 * @desc Erases all pictures within a range of numbers because it's
 * extremely tedious to do it one by one.
 *
 * @arg StartID:num
 * @text Starting ID
 * @type number
 * @min 1
 * @desc The starting ID of the pictures to erase.
 * @default 1
 *
 * @arg EndingID:num
 * @text Ending ID
 * @type number
 * @min 1
 * @desc The ending ID of the pictures to erase.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureRotateBy
 * @text Picture: Rotate By Angle
 * @desc Rotates target picture by a amount angle over a set duration
 * instead of continuously.
 * 
 * @arg PictureID:eval
 * @text Picture ID Number
 * @desc What is the ID of the picture you wish to rotate? Use a
 * number between 1 and 100. You may use JavaScript code.
 * @default 1
 * 
 * @arg AdjustAngle:eval
 * @text Adjust Angle
 * @desc What is the angle you wish to rotate the picture by?
 * Use degrees (360 degrees per full rotation).
 * @default 0
 *
 * @arg easingType:str
 * @text Easing Type
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default Linear
 *
 * @arg Duration:eval
 * @text Duration
 * @desc Duration of rotation effect in frames.
 * 60 frames = 1 second. You may use JavaScript code.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion
 * @parent Duration:eval
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until completion before moving onto the next event?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureRotate
 * @text Picture: Rotate to Angle
 * @desc Rotates target picture to a certain angle over a set duration
 * instead of continuously.
 * 
 * @arg PictureID:eval
 * @text Picture ID Number
 * @desc What is the ID of the picture you wish to rotate? Use a
 * number between 1 and 100. You may use JavaScript code.
 * @default 1
 * 
 * @arg TargetAngle:eval
 * @text Target Angle
 * @desc What is the target angle you wish to rotate the picture?
 * Use degrees (360 degrees per full rotation).
 * @default 0
 *
 * @arg easingType:str
 * @text Easing Type
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default Linear
 *
 * @arg Duration:eval
 * @text Duration
 * @desc Duration of rotation effect in frames.
 * 60 frames = 1 second. You may use JavaScript code.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion
 * @parent Duration:eval
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until completion before moving onto the next event?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 * 
 * @command PictureShowIcon
 * @text Picture: Show Icon
 * @desc Shows an icon instead of a picture image.
 * The picture icon can be controlled like any other picture.
 * 
 * @arg General
 * 
 * @arg PictureID:eval
 * @text Picture ID Number
 * @parent General
 * @desc What is the ID of the picture you wish to show at? Use a
 * number between 1 and 100. You may use JavaScript code.
 * @default 1
 * 
 * @arg IconIndex:eval
 * @text Icon Index
 * @parent General
 * @desc Select the icon index to use for this picture.
 * You may use JavaScript code.
 * @default 23
 *
 * @arg Smooth:eval
 * @text Smooth Icon?
 * @parent General
 * @type boolean
 * @on Smooth
 * @off Pixelate
 * @desc This will make the icon smoothed out or pixelated.
 * @default false
 * 
 * @arg PictureSettings
 * @text Picture Settings
 *
 * @arg Settings:struct
 * @text Settings
 * @parent PictureSettings
 * @type struct<ShowPicture>
 * @desc Alter the settings for how the picture will be shown.
 * @default {"Position":"","Origin:num":"0","PositionX:eval":"0","PositionY:eval":"0","Scale":"","ScaleX:eval":"100","ScaleY:eval":"100","Blend":"","Opacity:eval":"255","BlendMode:num":"0"}
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_ScreenShake
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ScreenShake
 * @text Screen Shake: Custom
 * @desc Creates a custom screen shake effect and also sets
 * the following uses of screen shake to this style.
 *
 * @arg Type:str
 * @text Shake Style
 * @type select
 * @option Original
 * @value original
 * @option Random
 * @value random
 * @option Horizontal
 * @value horizontal
 * @option Vertical
 * @value vertical
 * @desc Select shake style type.
 * @default random
 *
 * @arg Power:num
 * @text Power
 * @type number
 * @min 1
 * @max 9
 * @desc Power level for screen shake.
 * @default 5
 *
 * @arg Speed:num
 * @text Speed
 * @type number
 * @min 1
 * @max 9
 * @desc Speed level for screen shake.
 * @default 5
 *
 * @arg Duration:eval
 * @text Duration
 * @desc Duration of screenshake.
 * You can use code as well.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion
 * @parent Duration:eval
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until completion before moving onto the next event?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Switch
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SwitchRandomizeOne
 * @text Switches: Randomize ID(s)
 * @desc Select specific Switch ID's to randomize ON/OFF.
 *
 * @arg IDs:arraynum
 * @text Switch ID(s)
 * @type switch[]
 * @desc Select which Switch ID(s) to toggle.
 * @default ["1"]
 *
 * @arg Chance:num
 * @text Chance for ON
 * @type number
 * @min 1
 * @max 100
 * @desc Chance out of 100 that determines the switches to be ON.
 * @default 50
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SwitchRandomizeRange
 * @text Switches: Randomize Range
 * @desc Select specific Switch ID Range to randomize ON/OFF.
 * The ratio determines the ON/OFF distribution.
 *
 * @arg StartID:num
 * @text Starting ID
 * @type switch
 * @desc The starting ID of the Switch to toggle.
 * @default 1
 *
 * @arg EndingID:num
 * @text Ending ID
 * @type switch
 * @desc The ending ID of the Switch to toggle.
 * @default 20
 *
 * @arg Chance:num
 * @text Chance for ON
 * @type number
 * @min 1
 * @max 100
 * @desc Chance out of 100 that determines the switches to be ON.
 * @default 50
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SwitchToggleOne
 * @text Switches: Toggle ID(s)
 * @desc Select specific Switch ID's to toggle ON/OFF.
 * ON becomes OFF. OFF becomes ON.
 *
 * @arg IDs:arraynum
 * @text Switch ID(s)
 * @type switch[]
 * @desc Select which Switch ID(s) to toggle.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SwitchToggleRange
 * @text Switches: Toggle Range
 * @desc Select specific Switch ID Range to toggle ON/OFF.
 * ON becomes OFF. OFF becomes ON.
 *
 * @arg StartID:num
 * @text Starting ID
 * @type switch
 * @desc The starting ID of the Switch to toggle.
 * @default 1
 *
 * @arg EndingID:num
 * @text Ending ID
 * @type switch
 * @desc The ending ID of the Switch to toggle.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_System
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemSetBattleSystem
 * @text System: Battle System Change
 * @desc Switch to a different battle system in-game.
 * Some battle systems REQUIRE their specific plugins!
 *
 * @arg option:str
 * @text Change To
 * @type select
 * @option Database Default (Use game database setting)
 * @value database
 * @option -
 * @value database
 * @option DTB: Default Turn Battle
 * @value dtb
 * @option TPB Active: Time Progress Battle (Active)
 * @value tpb active
 * @option TPB Wait: Time Progress Battle (Wait)
 * @value tpb wait
 * @option -
 * @value database
 * @option BTB: Brave Turn Battle (Req VisuMZ_2_BattleSystemBTB)
 * @value btb
 * @option CTB: Charge Turn Battle (Req VisuMZ_2_BattleSystemCTB)
 * @value ctb
 * @option ETB: Energy Turn Battle (Req VisuMZ_2_BattleSystemETB)
 * @value etb
 * @option FTB: Free Turn Battle (Req VisuMZ_2_BattleSystemFTB)
 * @value ftb
 * @option OTB: Order Turn Battle (Req VisuMZ_2_BattleSystemOTB)
 * @value otb
 * @option PTB: Press Turn Battle (Req VisuMZ_2_BattleSystemPTB)
 * @value ptb
 * @option STB: Standard Turn Battle (Req VisuMZ_2_BattleSystemSTB)
 * @value stb
 * @desc Choose which battle system to switch to.
 * @default database
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemLoadImages
 * @text System: Load Images
 * @desc Allows you to (pre) load up images ahead of time.
 *
 * @arg animations:arraystr
 * @text img/animations/
 * @type file[]
 * @dir img/animations/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg battlebacks1:arraystr
 * @text img/battlebacks1/
 * @type file[]
 * @dir img/battlebacks1/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg battlebacks2:arraystr
 * @text img/battlebacks2/
 * @type file[]
 * @dir img/battlebacks2/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg characters:arraystr
 * @text img/characters/
 * @type file[]
 * @dir img/characters/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg enemies:arraystr
 * @text img/enemies/
 * @type file[]
 * @dir img/enemies/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg faces:arraystr
 * @text img/faces/
 * @type file[]
 * @dir img/faces/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg parallaxes:arraystr
 * @text img/parallaxes/
 * @type file[]
 * @dir img/parallaxes/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg pictures:arraystr
 * @text img/pictures/
 * @type file[]
 * @dir img/pictures/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg sv_actors:arraystr
 * @text img/sv_actors/
 * @type file[]
 * @dir img/sv_actors/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg sv_enemies:arraystr
 * @text img/sv_enemies/
 * @type file[]
 * @dir img/sv_enemies/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg system:arraystr
 * @text img/system/
 * @type file[]
 * @dir img/system/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg tilesets:arraystr
 * @text img/tilesets/
 * @type file[]
 * @dir img/tilesets/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg titles1:arraystr
 * @text img/titles1/
 * @type file[]
 * @dir img/titles1/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg titles2:arraystr
 * @text img/titles2/
 * @type file[]
 * @dir img/titles2/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemSetFontSize
 * @text System: Main Font Size
 * @desc Set the game's main font size.
 *
 * @arg option:num
 * @text Change To
 * @type number
 * @min 1
 * @desc Change the font size to this number.
 * @default 26
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemSetSideView
 * @text System: Side View Battle
 * @desc Switch between Front View or Side View for battle.
 *
 * @arg option:str
 * @text Change To
 * @type select
 * @option Front View
 * @value Front View
 * @option Side View
 * @value Side View
 * @option Toggle
 * @value Toggle
 * @desc Choose which view type to switch to.
 * @default Toggle
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemSetWindowPadding
 * @text System: Window Padding
 * @desc Change the game's window padding amount.
 *
 * @arg option:num
 * @text Change To
 * @type number
 * @min 1
 * @desc Change the game's standard window padding to this value.
 * Default: 12
 * @default 12
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_TextPopup
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command TextPopupShow
 * @text Text Popup: Show Text
 * @desc Adds text to a text popup window to briefly appear.
 * Multiple text popups will be queued.
 *
 * @arg text:json
 * @text Text
 * @type note
 * @desc Write the text that you want to appear here.
 * You may use text codes.
 * @default "Insert message here."
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Variable
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command VariableEvalReference
 * @text Variable: JS Eval
 * @desc Pick a variable ID and value to alter through JS.
 * Functions like RM2k3's Variable Pointers.
 *
 * @arg id:eval
 * @text Variable ID
 * @desc This is the target variable to alter.
 * You may use JavaScript. ie: $gameVariables.value(1)
 * @default 1
 *
 * @arg operation:str
 * @text Operation Type
 * @type select
 * @option Set
 * @value =
 * @option Add
 * @value +
 * @option Sub
 * @value -
 * @option Mul
 * @value *
 * @option Div
 * @value /
 * @option Mod
 * @value %
 * @desc What operation do you wish to use for this Plugin Command?
 * @default =
 *
 * @arg operand:eval
 * @text Operand Modifier
 * @desc Value to be used in calculating the target variable.
 * You may use JavaScript. ie: $gameVariables.value(1)
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command VariableJsBlock
 * @text Variable: JS Block
 * @desc Pick a variable ID and value to alter through JS.
 * Functions like RM2k3's Variable Pointers.
 *
 * @arg id:func
 * @text Variable ID
 * @type note
 * @desc This is the target variable to alter.
 * You may use JavaScript. ie: $gameVariables.value(1)
 * @default "// Declare Variables\nlet varID = 1;\n\n// Perform Calculations\n\n// Return Variable ID\nreturn varID;"
 *
 * @arg operation:str
 * @text Operation Type
 * @type select
 * @option Set
 * @value =
 * @option Add
 * @value +
 * @option Sub
 * @value -
 * @option Mul
 * @value *
 * @option Div
 * @value /
 * @option Mod
 * @value %
 * @desc What operation do you wish to use for this Plugin Command?
 * @default =
 *
 * @arg operand:func
 * @text Operand Modifier
 * @type note
 * @desc Value to be used in calculating the target variable.
 * You may use JavaScript. ie: $gameVariables.value(1)
 * @default "// Declare Variables\nlet value = 0;\n\n// Perform Calculations\n\n// Return Variable ID\nreturn value;"
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_End
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param CoreEngine
 * @default Plugin Parameters
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param QoL:struct
 * @text Quality of Life Settings
 * @type struct<QoLSettings>
 * @desc Quality of Life settings for both developers and players.
 * @default {"PlayTest":"","NewGameBoot:eval":"false","ForceNoPlayTest:eval":"false","OpenConsole:eval":"true","F6key:eval":"true","F7key:eval":"true","NewGameCommonEvent:num":"0","BattleTest":"","BTestItems:eval":"true","BTestWeapons:eval":"true","BTestArmors:eval":"true","BTestAddedQuantity:num":"90","ShiftR_Toggle:eval":"true","ShiftT_Toggle:eval":"true","DigitGrouping":"","DigitGroupingStandardText:eval":"true","DigitGroupingExText:eval":"true","DigitGroupingDamageSprites:eval":"true","DigitGroupingGaugeSprites:eval":"true","DigitGroupingLocale:str":"en-US","PlayerBenefit":"","EncounterRateMinimum:num":"10","EscapeAlways:eval":"true","ImprovedAccuracySystem:eval":"true","AccuracyBoost:eval":"true","LevelUpFullHp:eval":"true","LevelUpFullMp:eval":"true","Pictures":"","AntiZoomPictures:eval":"true","PictureContainers":"","DetachBattlePictureContainer:eval":"false","DetachMapPictureContainer:eval":"false","Misc":"","AnimationMirrorOffset:eval":"false","AutoStretch:str":"default","FontShadows:eval":"false","FontSmoothing:eval":"true","FontWidthFix:eval":"true","KeyItemProtect:eval":"true","MapNameTextCode:eval":"true","ModernControls:eval":"true","MvAnimationRate:num":"4","NewGameCommonEventAll:num":"0","NoTileShadows:eval":"false","PixelateImageRendering:eval":"false","RequireFocus:eval":"false","ShortcutScripts:eval":"true","SmartEventCollisionPriority:eval":"true","SubfolderParse:eval":"true"}
 * 
 * @param BattleSystem:str
 * @text Battle System
 * @type select
 * @option Database Default (Use game database setting)
 * @value database
 * @option -
 * @value database
 * @option DTB: Default Turn Battle
 * @value dtb
 * @option TPB Active: Time Progress Battle (Active)
 * @value tpb active
 * @option TPB wait: Time Progress Battle (Wait)
 * @value tpb wait
 * @option -
 * @value database
 * @option BTB: Brave Turn Battle (Req VisuMZ_2_BattleSystemBTB)
 * @value btb
 * @option CTB: Charge Turn Battle (Req VisuMZ_2_BattleSystemCTB)
 * @value ctb
 * @option ETB: Energy Turn Battle (Req VisuMZ_2_BattleSystemETB)
 * @value etb
 * @option FTB: Free Turn Battle (Req VisuMZ_2_BattleSystemFTB)
 * @value ftb
 * @option OTB: Order Turn Battle (Req VisuMZ_2_BattleSystemOTB)
 * @value otb
 * @option PTB: Press Turn Battle (Req VisuMZ_2_BattleSystemPTB)
 * @value ptb
 * @option STB: Standard Turn Battle (Req VisuMZ_2_BattleSystemSTB)
 * @value stb
 * @desc Choose which battle system to use for your game.
 * Some battle systems REQUIRE their specific plugins!
 * @default database
 *
 * @param Color:struct
 * @text Color Settings
 * @type struct<Color>
 * @desc Change the colors used for in-game text.
 * @default {"BasicColors":"","ColorNormal:str":"0","ColorSystem:str":"16","ColorCrisis:str":"17","ColorDeath:str":"18","ColorGaugeBack:str":"19","ColorHPGauge1:str":"20","ColorHPGauge2:str":"21","ColorMPGauge1:str":"22","ColorMPGauge2:str":"23","ColorMPCost:str":"23","ColorPowerUp:str":"24","ColorPowerDown:str":"25","ColorCTGauge1:str":"26","ColorCTGauge2:str":"27","ColorTPGauge1:str":"28","ColorTPGauge2:str":"29","ColorTPCost:str":"29","ColorPending:str":"#2a847d","ColorExpGauge1:str":"30","ColorExpGauge2:str":"31","ColorMaxLvGauge1:str":"14","ColorMaxLvGauge2:str":"6","AlphaColors":"","OutlineColor:str":"rgba(0, 0, 0, 0.6)","DimColor1:str":"rgba(0, 0, 0, 0.6)","DimColor2:str":"rgba(0, 0, 0, 0)","ItemBackColor1:str":"rgba(32, 32, 32, 0.5)","ItemBackColor2:str":"rgba(0, 0, 0, 0.5)","ConditionalColors":"","ActorHPColor:func":"\"// Set the variables used in this function.\\nlet actor = arguments[0];\\n\\n// Check if the actor exists. If not, return normal.\\nif (!actor) {\\n    return this.normalColor();\\n\\n// If the actor is dead, return death color.\\n} else if (actor.isDead()) {\\n    return this.deathColor();\\n\\n// If the actor is dying, return crisis color.\\n} else if (actor.isDying()) {\\n    return this.crisisColor();\\n\\n// Otherwise, return the normal color.\\n} else {\\n    return this.normalColor();\\n}\"","ActorMPColor:func":"\"// Set the variables used in this function.\\nlet actor = arguments[0];\\n\\n// Check if the actor exists. If not, return normal.\\nif (!actor) {\\n    return this.normalColor();\\n\\n// If MP rate is below 25%, return crisis color.\\n} else if (actor.mpRate() < 0.25) {\\n    return this.crisisColor();\\n\\n// Otherwise, return the normal color.\\n} else {\\n    return this.normalColor();\\n}\"","ActorTPColor:func":"\"// Set the variables used in this function.\\nlet actor = arguments[0];\\n\\n// Check if the actor exists. If not, return normal.\\nif (!actor) {\\n    return this.normalColor();\\n\\n// If TP rate is below 25%, return crisis color.\\n} else if (actor.tpRate() < 0.25) {\\n    return this.crisisColor();\\n\\n// Otherwise, return the normal color.\\n} else {\\n    return this.normalColor();\\n}\"","ParamChange:func":"\"// Set the variables used in this function.\\nlet change = arguments[0];\\n\\n// If a positive change, use power up color.\\nif (change > 0) {\\n    return this.powerUpColor();\\n\\n// If a negative change, use power down color.\\n} else if (change < 0) {\\n    return this.powerDownColor();\\n\\n// Otherwise, return the normal color.\\n} else {\\n    return this.normalColor();\\n}\"","DamageColor:func":"\"// Set the variables used in this function.\\nlet colorType = arguments[0];\\n\\n// Check the value of the color type\\n// and return an appropriate color.\\nswitch (colorType) {\\n\\n    case 0: // HP damage\\n        return \\\"#ffffff\\\";\\n\\n    case 1: // HP recover\\n        return \\\"#b9ffb5\\\";\\n\\n    case 2: // MP damage\\n        return \\\"#bb88bb\\\";\\n\\n    case 3: // MP recover\\n        return \\\"#80b0ff\\\";\\n\\n    default:\\n        return \\\"#808080\\\";\\n}\""}
 *
 * @param Gold:struct
 * @text Gold Settings
 * @type struct<Gold>
 * @desc Change up how gold operates and is displayed in-game.
 * @default {"GoldMax:num":"999999999","GoldFontSize:num":"24","GoldIcon:num":"314","GoldOverlap:str":"A Lot","ItemStyle:eval":"true"}
 *
 * @param ImgLoad:struct
 * @text Image Loading
 * @type struct<ImgLoad>
 * @desc Game images that will be loaded upon booting up the game.
 * Use this responsibly!!!
 * @default {"animations:arraystr":"[]","battlebacks1:arraystr":"[]","battlebacks2:arraystr":"[]","characters:arraystr":"[]","enemies:arraystr":"[]","faces:arraystr":"[]","parallaxes:arraystr":"[]","pictures:arraystr":"[]","sv_actors:arraystr":"[]","sv_enemies:arraystr":"[]","system:arraystr":"[\"Balloon\",\"IconSet\"]","tilesets:arraystr":"[]","titles1:arraystr":"[]","titles2:arraystr":"[]"}
 *
 * @param KeyboardInput:struct
 * @text Keyboard Input
 * @type struct<KeyboardInput>
 * @desc Settings for the game that utilize keyboard input.
 * @default {"Controls":"","WASD:eval":"false","DashToggleR:eval":"false","NameInput":"","EnableNameInput:eval":"true","DefaultMode:str":"keyboard","QwertyLayout:eval":"true","NameInputMessage:eval":"\"Type in this character's name.\\nPress \\\\c[5]ENTER\\\\c[0] when you're done.\\n\\n-or-\\n\\nPress \\\\c[5]arrow keys\\\\c[0]/\\\\c[5]TAB\\\\c[0] to switch\\nto manual character entry.\\n\\nPress \\\\c[5]ESC\\\\c[0]/\\\\c[5]TAB\\\\c[0] to use to keyboard.\"","NumberInput":"","EnableNumberInput:eval":"true","ButtonAssist":"","Keyboard:str":"Keyboard","Manual:str":"Manual"}
 *
 * @param MenuBg:struct
 * @text Menu Background Settings
 * @type struct<MenuBg>
 * @desc Change how menu backgrounds look for each scene.
 * @default {"Scene_Menu:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Item:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Skill:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Equip:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Status:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Options:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Save:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Load:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_GameEnd:struct":"{\"SnapshotOpacity:num\":\"128\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Shop:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Name:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Unlisted:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}"}
 *
 * @param ButtonAssist:struct
 * @text Menu Button Assist Window
 * @type struct<ButtonAssist>
 * @desc Settings pertaining to the Button Assist window found in in-game menus.
 * @default {"General":"","Enable:eval":"true","Location:str":"bottom","BgType:num":"0","Text":"","TextFmt:str":"%1:%2","MultiKeyFmt:str":"%1/%2","OkText:str":"Select","CancelText:str":"Back","SwitchActorText:str":"Switch Ally","Keys":"","KeyUnlisted:str":"\\}❪%1❫\\{","KeyUP:str":"^","KeyDOWN:str":"v","KeyLEFT:str":"<<","KeyRIGHT:str":">>","KeySHIFT:str":"\\}❪SHIFT❫\\{","KeyTAB:str":"\\}❪TAB❫\\{","KeyA:str":"A","KeyB:str":"B","KeyC:str":"C","KeyD:str":"D","KeyE:str":"E","KeyF:str":"F","KeyG:str":"G","KeyH:str":"H","KeyI:str":"I","KeyJ:str":"J","KeyK:str":"K","KeyL:str":"L","KeyM:str":"M","KeyN:str":"N","KeyO:str":"O","KeyP:str":"P","KeyQ:str":"Q","KeyR:str":"R","KeyS:str":"S","KeyT:str":"T","KeyU:str":"U","KeyV:str":"V","KeyW:str":"W","KeyX:str":"X","KeyY:str":"Y","KeyZ:str":"Z"}
 *
 * @param ControllerButtons:arraystruct
 * @text Controller Button Assist
 * @parent ButtonAssist:struct
 * @type struct<ControllerButtons>[]
 * @desc Make different icons appear for the Button Assist window when using different controllers.
 * @default []
 *
 * @param MenuLayout:struct
 * @text Menu Layout Settings
 * @type struct<MenuLayout>
 * @desc Change how menu layouts look for each scene.
 * @default {"Title:struct":"{\"TitleScreen\":\"\",\"DocumentTitleFmt:str\":\"%1: %2 - Version %3\",\"Subtitle:str\":\"Subtitle\",\"Version:str\":\"0.00\",\"drawGameTitle:func\":\"\\\"const x = 20;\\\\nconst y = Graphics.height / 4;\\\\nconst maxWidth = Graphics.width - x * 2;\\\\nconst text = $dataSystem.gameTitle;\\\\nconst bitmap = this._gameTitleSprite.bitmap;\\\\nbitmap.fontFace = $gameSystem.mainFontFace();\\\\nbitmap.outlineColor = \\\\\\\"black\\\\\\\";\\\\nbitmap.outlineWidth = 8;\\\\nbitmap.fontSize = 72;\\\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\\\\\"center\\\\\\\");\\\"\",\"drawGameSubtitle:func\":\"\\\"const x = 20;\\\\nconst y = Graphics.height / 4 + 72;\\\\nconst maxWidth = Graphics.width - x * 2;\\\\nconst text = Scene_Title.subtitle;\\\\nconst bitmap = this._gameTitleSprite.bitmap;\\\\nbitmap.fontFace = $gameSystem.mainFontFace();\\\\nbitmap.outlineColor = \\\\\\\"black\\\\\\\";\\\\nbitmap.outlineWidth = 6;\\\\nbitmap.fontSize = 48;\\\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\\\\\"center\\\\\\\");\\\"\",\"drawGameVersion:func\":\"\\\"const bitmap = this._gameTitleSprite.bitmap;\\\\nconst x = 0;\\\\nconst y = Graphics.height - 20;\\\\nconst width = Math.round(Graphics.width / 4);\\\\nconst height = 20;\\\\nconst c1 = ColorManager.dimColor1();\\\\nconst c2 = ColorManager.dimColor2();\\\\nconst text = 'Version ' + Scene_Title.version;\\\\nbitmap.gradientFillRect(x, y, width, height, c1, c2);\\\\nbitmap.fontFace = $gameSystem.mainFontFace();\\\\nbitmap.outlineColor = \\\\\\\"black\\\\\\\";\\\\nbitmap.outlineWidth = 3;\\\\nbitmap.fontSize = 16;\\\\nbitmap.drawText(text, x + 4, y, Graphics.width, height, \\\\\\\"left\\\\\\\");\\\"\",\"CommandRect:func\":\"\\\"const offsetX = $dataSystem.titleCommandWindow.offsetX;\\\\nconst offsetY = $dataSystem.titleCommandWindow.offsetY;\\\\nconst rows = this.commandWindowRows();\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = (Graphics.boxWidth - width) / 2 + offsetX;\\\\nconst y = Graphics.boxHeight - height - 96 + offsetY;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ButtonFadeSpeed:num\":\"4\"}","MainMenu:struct":"{\"CommandWindow\":\"\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const width = this.mainCommandWidth();\\\\nconst height = this.mainAreaHeight() - this.goldWindowRect().height;\\\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"GoldWindow\":\"\",\"GoldBgType:num\":\"0\",\"GoldRect:func\":\"\\\"const rows = 1;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\\\nconst y = this.mainAreaBottom() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const width = Graphics.boxWidth - this.mainCommandWidth();\\\\nconst height = this.mainAreaHeight();\\\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","ItemMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.helpAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.helpAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CategoryWindow\":\"\",\"CategoryBgType:num\":\"0\",\"CategoryRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ItemWindow\":\"\",\"ItemBgType:num\":\"0\",\"ItemRect:func\":\"\\\"const x = 0;\\\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaBottom() - y;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ActorWindow\":\"\",\"ActorBgType:num\":\"0\",\"ActorRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","SkillMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.helpAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.helpAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"SkillTypeWindow\":\"\",\"SkillTypeBgType:num\":\"0\",\"SkillTypeRect:func\":\"\\\"const rows = 3;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const width = Graphics.boxWidth - this.mainCommandWidth();\\\\nconst height = this._skillTypeWindow.height;\\\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ItemWindow\":\"\",\"ItemBgType:num\":\"0\",\"ItemRect:func\":\"\\\"const x = 0;\\\\nconst y = this._statusWindow.y + this._statusWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._statusWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ActorWindow\":\"\",\"ActorBgType:num\":\"0\",\"ActorRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","EquipMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.helpAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.helpAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = this.statusWidth();\\\\nconst height = this.mainAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CommandWindow\":\"\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const x = this.statusWidth();\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"SlotWindow\":\"\",\"SlotBgType:num\":\"0\",\"SlotRect:func\":\"\\\"const commandWindowRect = this.commandWindowRect();\\\\nconst x = this.statusWidth();\\\\nconst y = commandWindowRect.y + commandWindowRect.height;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this.mainAreaHeight() - commandWindowRect.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ItemWindow\":\"\",\"ItemBgType:num\":\"0\",\"ItemRect:func\":\"\\\"return this.slotWindowRect();\\\"\"}","StatusMenu:struct":"{\"ProfileWindow\":\"\",\"ProfileBgType:num\":\"0\",\"ProfileRect:func\":\"\\\"const width = Graphics.boxWidth;\\\\nconst height = this.profileHeight();\\\\nconst x = 0;\\\\nconst y = this.mainAreaBottom() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.statusParamsWindowRect().y - y;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusParamsWindow\":\"\",\"StatusParamsBgType:num\":\"0\",\"StatusParamsRect:func\":\"\\\"const width = this.statusParamsWidth();\\\\nconst height = this.statusParamsHeight();\\\\nconst x = 0;\\\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusEquipWindow\":\"\",\"StatusEquipBgType:num\":\"0\",\"StatusEquipRect:func\":\"\\\"const width = Graphics.boxWidth - this.statusParamsWidth();\\\\nconst height = this.statusParamsHeight();\\\\nconst x = this.statusParamsWidth();\\\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","OptionsMenu:struct":"{\"OptionsWindow\":\"\",\"OptionsBgType:num\":\"0\",\"OptionsRect:func\":\"\\\"const n = Math.min(this.maxCommands(), this.maxVisibleCommands());\\\\nconst width = 400;\\\\nconst height = this.calcWindowHeight(n, true);\\\\nconst x = (Graphics.boxWidth - width) / 2;\\\\nconst y = (Graphics.boxHeight - height) / 2;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","SaveMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, false);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ListWindow\":\"\",\"ListBgType:num\":\"0\",\"ListRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","LoadMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, false);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ListWindow\":\"\",\"ListBgType:num\":\"0\",\"ListRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","GameEnd:struct":"{\"CommandList:arraystruct\":\"[\\\"{\\\\\\\"Symbol:str\\\\\\\":\\\\\\\"toTitle\\\\\\\",\\\\\\\"TextStr:str\\\\\\\":\\\\\\\"Untitled\\\\\\\",\\\\\\\"TextJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return TextManager.toTitle;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ShowJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"EnableJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ExtJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return null;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"CallHandlerJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"SceneManager._scene.commandToTitle();\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Symbol:str\\\\\\\":\\\\\\\"cancel\\\\\\\",\\\\\\\"TextStr:str\\\\\\\":\\\\\\\"Untitled\\\\\\\",\\\\\\\"TextJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return TextManager.cancel;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ShowJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"EnableJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ExtJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return null;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"CallHandlerJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"SceneManager._scene.popScene();\\\\\\\\\\\\\\\"\\\\\\\"}\\\"]\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const rows = 2;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = (Graphics.boxWidth - width) / 2;\\\\nconst y = (Graphics.boxHeight - height) / 2;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","ShopMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const wx = 0;\\\\nconst wy = this.helpAreaTop();\\\\nconst ww = Graphics.boxWidth;\\\\nconst wh = this.helpAreaHeight();\\\\nreturn new Rectangle(wx, wy, ww, wh);\\\"\",\"GoldWindow\":\"\",\"GoldBgType:num\":\"0\",\"GoldRect:func\":\"\\\"const rows = 1;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = Graphics.boxWidth - width;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CommandWindow\":\"\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = this._goldWindow.x;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"DummyWindow\":\"\",\"DummyBgType:num\":\"0\",\"DummyRect:func\":\"\\\"const x = 0;\\\\nconst y = this._commandWindow.y + this._commandWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._commandWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"NumberWindow\":\"\",\"NumberBgType:num\":\"0\",\"NumberRect:func\":\"\\\"const x = 0;\\\\nconst y = this._dummyWindow.y;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this._dummyWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const width = this.statusWidth();\\\\nconst height = this._dummyWindow.height;\\\\nconst x = Graphics.boxWidth - width;\\\\nconst y = this._dummyWindow.y;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"BuyWindow\":\"\",\"BuyBgType:num\":\"0\",\"BuyRect:func\":\"\\\"const x = 0;\\\\nconst y = this._dummyWindow.y;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this._dummyWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CategoryWindow\":\"\",\"CategoryBgType:num\":\"0\",\"CategoryRect:func\":\"\\\"const x = 0;\\\\nconst y = this._dummyWindow.y;\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"SellWindow\":\"\",\"SellBgType:num\":\"0\",\"SellRect:func\":\"\\\"const x = 0;\\\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height =\\\\n    this.mainAreaHeight() -\\\\n    this._commandWindow.height -\\\\n    this._categoryWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","NameMenu:struct":"{\"EditWindow\":\"\",\"EditBgType:num\":\"0\",\"EditRect:func\":\"\\\"const rows = 9;\\\\nconst inputWindowHeight = this.calcWindowHeight(rows, true);\\\\nconst padding = $gameSystem.windowPadding();\\\\nconst width = 600;\\\\nconst height = Math.min(ImageManager.faceHeight + padding * 2, this.mainAreaHeight() - inputWindowHeight);\\\\nconst x = (Graphics.boxWidth - width) / 2;\\\\nconst y = (this.mainAreaHeight() - (height + inputWindowHeight)) / 2 + this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"InputWindow\":\"\",\"InputBgType:num\":\"0\",\"InputRect:func\":\"\\\"const x = this._editWindow.x;\\\\nconst y = this._editWindow.y + this._editWindow.height;\\\\nconst rows = 9;\\\\nconst width = this._editWindow.width;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}"}
 *
 * @param Param:struct
 * @text Parameter Settings
 * @type struct<Param>
 * @desc Change up the limits of parameters and how they're calculated.
 * @default {"DisplayedParams:arraystr":"[\"ATK\",\"DEF\",\"MAT\",\"MDF\",\"AGI\",\"LUK\"]","ExtDisplayedParams:arraystr":"[\"MaxHP\",\"MaxMP\",\"ATK\",\"DEF\",\"MAT\",\"MDF\",\"AGI\",\"LUK\"]","BasicParameters":"","CrisisRate:num":"0.25","BasicParameterFormula:func":"\"// Determine the variables used in this calculation.\\nlet paramId = arguments[0];\\nlet base = this.paramBase(paramId);\\nlet plus = this.paramPlus(paramId);\\nlet paramRate = this.paramRate(paramId);\\nlet buffRate = this.paramBuffRate(paramId);\\nlet flatBonus = this.paramFlatBonus(paramId);\\n\\n// Formula to determine total parameter value.\\nlet value = (base + plus) * paramRate * buffRate + flatBonus;\\n\\n// Determine the limits\\nconst maxValue = this.paramMax(paramId);\\nconst minValue = this.paramMin(paramId);\\n\\n// Final value\\nreturn Math.round(value.clamp(minValue, maxValue));\"","BasicParamCaps":"","BasicActorParamCaps":"","BasicActorParamMax0:str":"9999","BasicActorParamMax1:str":"9999","BasicActorParamMax2:str":"999","BasicActorParamMax3:str":"999","BasicActorParamMax4:str":"999","BasicActorParamMax5:str":"999","BasicActorParamMax6:str":"999","BasicActorParamMax7:str":"999","BasicEnemyParamCaps":"","BasicEnemyParamMax0:str":"999999","BasicEnemyParamMax1:str":"9999","BasicEnemyParamMax2:str":"999","BasicEnemyParamMax3:str":"999","BasicEnemyParamMax4:str":"999","BasicEnemyParamMax5:str":"999","BasicEnemyParamMax6:str":"999","BasicEnemyParamMax7:str":"999","XParameters":"","XParameterFormula:func":"\"// Determine the variables used in this calculation.\\nlet xparamId = arguments[0];\\nlet base = this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);\\nlet plus = this.xparamPlus(xparamId);\\nlet paramRate = this.xparamRate(xparamId);\\nlet flatBonus = this.xparamFlatBonus(xparamId);\\n\\n// Formula to determine total parameter value.\\nlet value = (base + plus) * paramRate + flatBonus;\\n\\n// Final value\\nreturn value;\"","XParamVocab":"","XParamVocab0:str":"Hit","XParamVocab1:str":"Evasion","XParamVocab2:str":"Critical Rate","XParamVocab3:str":"Critical Evade","XParamVocab4:str":"Magic Evade","XParamVocab5:str":"Magic Reflect","XParamVocab6:str":"Counter","XParamVocab7:str":"HP Regen","XParamVocab8:str":"MP Regen","XParamVocab9:str":"TP Regen","SParameters":"","SParameterFormula:func":"\"// Determine the variables used in this calculation.\\nlet sparamId = arguments[0];\\nlet base = this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);\\nlet plus = this.sparamPlus(sparamId);\\nlet paramRate = this.sparamRate(sparamId);\\nlet flatBonus = this.sparamFlatBonus(sparamId);\\n\\n// Formula to determine total parameter value.\\nlet value = (base + plus) * paramRate + flatBonus;\\n\\n// Final value\\nreturn value;\"","SParamVocab":"","SParamVocab0:str":"Aggro","SParamVocab1:str":"Guard","SParamVocab2:str":"Recovery","SParamVocab3:str":"Item Effect","SParamVocab4:str":"MP Cost","SParamVocab5:str":"TP Charge","SParamVocab6:str":"Physical DMG","SParamVocab7:str":"Magical DMG","SParamVocab8:str":"Floor DMG","SParamVocab9:str":"EXP Gain","Icons":"","DrawIcons:eval":"true","IconParam0:str":"84","IconParam1:str":"165","IconParam2:str":"76","IconParam3:str":"81","IconParam4:str":"101","IconParam5:str":"133","IconParam6:str":"140","IconParam7:str":"87","IconXParam0:str":"102","IconXParam1:str":"82","IconXParam2:str":"78","IconXParam3:str":"82","IconXParam4:str":"171","IconXParam5:str":"222","IconXParam6:str":"77","IconXParam7:str":"72","IconXParam8:str":"72","IconXParam9:str":"72","IconSParam0:str":"5","IconSParam1:str":"128","IconSParam2:str":"72","IconSParam3:str":"176","IconSParam4:str":"165","IconSParam5:str":"164","IconSParam6:str":"76","IconSParam7:str":"79","IconSParam8:str":"141","IconSParam9:str":"73"}
 *
 * @param CustomParam:arraystruct
 * @text Custom Parameters
 * @parent Param:struct
 * @type struct<CustomParam>[]
 * @desc Create custom parameters for your game!
 * These will appear in VisuStella MZ menus.
 * @default ["{\"ParamName:str\":\"Strength\",\"Abbreviation:str\":\"str\",\"Icon:num\":\"77\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.atk * 0.75) + (user.def * 0.25);\\\"\"}","{\"ParamName:str\":\"Dexterity\",\"Abbreviation:str\":\"dex\",\"Icon:num\":\"82\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.agi * 0.75) + (user.atk * 0.25);\\\"\"}","{\"ParamName:str\":\"Constitution\",\"Abbreviation:str\":\"con\",\"Icon:num\":\"81\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.def * 0.75) + (user.mdf * 0.25);\\\"\"}","{\"ParamName:str\":\"Intelligence\",\"Abbreviation:str\":\"int\",\"Icon:num\":\"79\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.mat * 0.75) + (user.mdf * 0.25);\\\"\"}","{\"ParamName:str\":\"Wisdom\",\"Abbreviation:str\":\"wis\",\"Icon:num\":\"72\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.mdf * 0.75) + (user.luk * 0.25);\\\"\"}","{\"ParamName:str\":\"Charisma\",\"Abbreviation:str\":\"cha\",\"Icon:num\":\"84\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.luk * 0.75) + (user.agi * 0.25);\\\"\"}"]
 *
 * @param ScreenResolution:struct
 * @text Screen Resolution Settings
 * @type struct<ScreenResolution>
 * @desc Alter various properties to make the game look better for varying screen resolutions.
 * @default {"Maps":"","AutoScrollLockX:eval":"true","AutoScrollLockY:eval":"true","DisplayLockX:num":"0.15625","DisplayLockY:num":"0.00000","Troops":"","RepositionActors:eval":"true","RepositionEnemies:eval":"true","RepositionEnemies130:eval":"false"}
 *
 * @param ScreenShake:struct
 * @text Screen Shake Settings
 * @type struct<ScreenShake>
 * @desc Get more screen shake effects into your game!
 * @default {"DefaultStyle:str":"random","originalJS:func":"\"// Calculation\\nthis.x += Math.round($gameScreen.shake());\"","randomJS:func":"\"// Calculation\\n// Original Formula by Aries of Sheratan\\nconst power = $gameScreen._shakePower * 0.75;\\nconst speed = $gameScreen._shakeSpeed * 0.60;\\nconst duration = $gameScreen._shakeDuration;\\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\"","horzJS:func":"\"// Calculation\\n// Original Formula by Aries of Sheratan\\nconst power = $gameScreen._shakePower * 0.75;\\nconst speed = $gameScreen._shakeSpeed * 0.60;\\nconst duration = $gameScreen._shakeDuration;\\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\"","vertJS:func":"\"// Calculation\\n// Original Formula by Aries of Sheratan\\nconst power = $gameScreen._shakePower * 0.75;\\nconst speed = $gameScreen._shakeSpeed * 0.60;\\nconst duration = $gameScreen._shakeDuration;\\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\""}
 *
 * @param TitleCommandList:arraystruct
 * @text Title Command List
 * @type struct<Command>[]
 * @desc Window commands used by the title screen.
 * Add new commands here.
 * @default ["{\"Symbol:str\":\"newGame\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.newGame;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandNewGame();\\\"\"}","{\"Symbol:str\":\"continue\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.continue_;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return DataManager.isAnySavefileExists();\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandContinue();\\\"\"}","{\"Symbol:str\":\"options\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.options;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandOptions();\\\"\"}","{\"Symbol:str\":\"shutdown\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.gameEnd;\\\"\",\"ShowJS:func\":\"\\\"return Utils.isNwjs();\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager.exit();\\\\n\\\\n// Note!\\\\n// Do NOT use this command with mobile devices or\\\\n// browser games. All it does is cause the game to\\\\n// display a blank, black canvas which the player\\\\n// is unable to do anything with. It does NOT force\\\\n// close the browser tab nor the app.\\\"\"}"]
 *
 * @param TitlePicButtons:arraystruct
 * @text Title Picture Buttons
 * @type struct<TitlePictureButton>[]
 * @desc Buttons that can be inserted into the title screen.
 * Add new title buttons here.
 * @default []
 *
 * @param UI:struct
 * @text UI Settings
 * @type struct<UI>
 * @desc Change up various in-game UI aspects.
 * @default {"UIArea":"","FadeSpeed:num":"24","BoxMargin:num":"4","CommandWidth:num":"240","BottomHelp:eval":"false","RightMenus:eval":"true","ShowButtons:eval":"true","cancelShowButton:eval":"true","menuShowButton:eval":"true","pagedownShowButton:eval":"true","numberShowButton:eval":"true","ButtonHeight:num":"52","BottomButtons:eval":"false","SideButtons:eval":"true","MenuObjects":"","LvExpGauge:eval":"true","ParamArrow:str":"→","TextCodeSupport":"","TextCodeClassNames:eval":"true","TextCodeNicknames:eval":"true"}
 *
 * @param Window:struct
 * @text Window Settings
 * @type struct<Window>
 * @desc Adjust various in-game window settings.
 * @default {"WindowDefaults":"","EnableMasking:eval":"false","LineHeight:num":"36","ItemPadding:num":"8","BackOpacity:num":"192","TranslucentOpacity:num":"160","OpenSpeed:num":"32","ColSpacing:num":"8","RowSpacing:num":"4","ScrollBar":"","ShowScrollBar:eval":"true","BarThickness:num":"2","BarOffset:num":"+2","BarBodyColor:str":"0","OffBarColor:str":"7","OffBarOpacity:num":"128","SelectableItems":"","ShowItemBackground:eval":"true","ItemHeight:num":"8","DrawItemBackgroundJS:func":"\"const rect = arguments[0];\\nconst c1 = ColorManager.itemBackColor1();\\nconst c2 = ColorManager.itemBackColor2();\\nconst x = rect.x;\\nconst y = rect.y;\\nconst w = rect.width;\\nconst h = rect.height;\\nthis.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);\\nthis.contentsBack.strokeRect(x, y, w, h, c1);\"","TextPopup":"","DurationPerChat:num":"1.5","MinDuration:num":"90","MaxDuration:num":"300"}
 *
 * @param jsQuickFunc:arraystruct
 * @text JS: Quick Functions
 * @type struct<jsQuickFunc>[]
 * @desc Create quick JavaScript functions available from the
 * global namespace. Use with caution and moderation!!!
 * @default ["{\"FunctionName:str\":\"Example\",\"CodeJS:json\":\"\\\"// Insert this as a function anywhere you can input code\\\\n// such as Script Calls or Conditional Branch Scripts.\\\\n\\\\n// Process Code\\\\nreturn 'Example';\\\"\"}","{\"FunctionName:str\":\"Bad  Code  Name\",\"CodeJS:json\":\"\\\"// If a function name has spaces in them, the spaces will\\\\n// be removed. \\\\\\\"Bad  Code  Name\\\\\\\" becomes \\\\\\\"BadCodeName\\\\\\\".\\\\n\\\\n// Process Code\\\\nOhNoItsBadCode()\\\\n\\\\n// If a function has bad code, a fail safe will catch the\\\\n// error and display it in the console.\\\"\"}","{\"FunctionName:str\":\"RandomNumber\",\"CodeJS:json\":\"\\\"// This generates a random number from 0 to itself.\\\\n// Example: RandomNumber(10)\\\\n\\\\n// Process Code\\\\nconst number = (arguments[0] || 0) + 1;\\\\nreturn Math.floor(number * Math.random());\\\"\"}","{\"FunctionName:str\":\"RandomBetween\",\"CodeJS:json\":\"\\\"// This generates a random number between two arguments.\\\\n// Example: RandomBetween(5, 10)\\\\n\\\\n// Process Code\\\\nlet min = Math.min(arguments[0] || 0, arguments[1] || 0);\\\\nlet max = Math.max(arguments[0] || 0, arguments[1] || 0);\\\\nreturn Math.floor(Math.random() * (max - min + 1) + min);\\\"\"}","{\"FunctionName:str\":\"RandomFrom\",\"CodeJS:json\":\"\\\"// Selects a number from the list of inserted numbers.\\\\n// Example: RandomFrom(5, 10, 15, 20)\\\\n\\\\n// Process Code\\\\nreturn arguments[Math.randomInt(arguments.length)];\\\"\"}"]
 *
 * @param BreakEnd1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param End Of
 * @default Plugin Parameters
 *
 * @param BreakEnd2
 * @text --------------------------
 * @default ----------------------------------
 *
 */
/* ----------------------------------------------------------------------------
 * Quality of Life Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~QoLSettings:
 *
 * @param PlayTest
 * @text Play Test
 *
 * @param NewGameBoot:eval
 * @text New Game on Boot
 * @parent PlayTest
 * @type boolean
 * @on Start New Game
 * @off Keep Title Screen
 * @desc Automatically start a new game on Play Test?
 * Only enabled during Play Test.
 * @default false
 *
 * @param ForceNoPlayTest:eval
 * @text No Play Test Mode
 * @parent PlayTest
 * @type boolean
 * @on Cancel Play Test
 * @off Keep Play Test
 * @desc Force the game to be out of Play Test mode when play testing.
 * @default false
 *
 * @param OpenConsole:eval
 * @text Open Console on Boot
 * @parent PlayTest
 * @type boolean
 * @on Open
 * @off Don't Open
 * @desc Open the Debug Console upon booting up your game?
 * Only enabled during Play Test.
 * @default true
 *
 * @param F6key:eval
 * @text F6: Toggle Sound
 * @parent PlayTest
 * @type boolean
 * @on Enable
 * @off Don't
 * @desc F6 Key Function: Turn on all sound to 100% or to 0%,
 * toggling between the two.
 * @default true
 *
 * @param F7key:eval
 * @text F7: Toggle Fast Mode
 * @parent PlayTest
 * @type boolean
 * @on Enable
 * @off Don't
 * @desc F7 Key Function: Toggle fast mode.
 * @default true
 *
 * @param CtrlQuickLoad:eval
 * @text CTRL + n: Quick Load
 * @parent PlayTest
 * @type boolean
 * @on Enable
 * @off Don't
 * @desc CTRL + a number from 1 to 9 will yield a quick load of
 * that safe file. Does not count auto saves.
 * @default true
 *
 * @param NewGameCommonEvent:num
 * @text NewGame > CommonEvent
 * @parent PlayTest
 * @type common_event
 * @desc Runs a common event each time a new game during play test
 * session is started.
 * @default 0
 *
 * @param BattleTest
 * @text Battle Test
 *
 * @param BTestItems:eval
 * @text Add Item Type
 * @parent BattleTest
 * @type boolean
 * @on Add
 * @off Don't
 * @desc Add copies of each database item?
 * Effective only during battle test.
 * @default true
 *
 * @param BTestWeapons:eval
 * @text Add Weapon Type
 * @parent BattleTest
 * @type boolean
 * @on Add
 * @off Don't
 * @desc Add copies of each database weapon?
 * Effective only during battle test.
 * @default true
 *
 * @param BTestArmors:eval
 * @text Add Armor Type
 * @parent BattleTest
 * @type boolean
 * @on Add
 * @off Don't
 * @desc Add copies of each database armor?
 * Effective only during battle test.
 * @default true
 *
 * @param BTestAddedQuantity:num
 * @text Added Quantity
 * @parent BattleTest
 * @type number
 * @min 1
 * @desc Determines how many items are added during a battle test instead of the maximum amount.
 * @default 90
 *
 * @param ShiftR_Toggle:eval
 * @text Shift+R: Recover All
 * @parent BattleTest
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc For Play Test only! During battle, pressing SHIFT + R will refill the whole party's HP and MP and status.
 * @default true
 *
 * @param ShiftT_Toggle:eval
 * @text Shift+T: Full TP
 * @parent BattleTest
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc For Play Test only! During battle, pressing SHIFT + T will refill the whole party's TP.
 * @default true
 *
 * @param DigitGrouping
 * @text Digit Grouping
 *
 * @param DigitGroupingStandardText:eval
 * @text Standard Text
 * @parent DigitGrouping
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Make numbers like 1234567 appear like 1,234,567 for
 * standard text inside windows?
 * @default true
 *
 * @param DigitGroupingExText:eval
 * @text Ex Text
 * @parent DigitGrouping
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Make numbers like 1234567 appear like 1,234,567 for
 * ex text, written through drawTextEx (like messages)?
 * @default true
 *
 * @param DigitGroupingDamageSprites:eval
 * @text Damage Sprites
 * @parent DigitGrouping
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Make numbers like 1234567 appear like 1,234,567 for
 * in-battle damage sprites?
 * @default true
 *
 * @param DigitGroupingGaugeSprites:eval
 * @text Gauge Sprites
 * @parent DigitGrouping
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Make numbers like 1234567 appear like 1,234,567 for
 * visible gauge sprites such as HP, MP, and TP gauges?
 * @default true
 *
 * @param DigitGroupingLocale:str
 * @text Country/Locale
 * @parent DigitGrouping
 * @type combo
 * @option ar-SA
 * @option bn-BD
 * @option bn-IN
 * @option cs-CZ
 * @option da-DK
 * @option de-AT
 * @option de-CH
 * @option de-DE
 * @option el-GR
 * @option en-AU
 * @option en-CA
 * @option en-GB
 * @option en-IE
 * @option en-IN
 * @option en-NZ
 * @option en-US
 * @option en-ZA
 * @option es-AR
 * @option es-CL
 * @option es-CO
 * @option es-ES
 * @option es-MX
 * @option es-US
 * @option fi-FI
 * @option fr-BE
 * @option fr-CA
 * @option fr-CH
 * @option fr-FR
 * @option he-IL
 * @option hi-IN
 * @option hu-HU
 * @option id-ID
 * @option it-CH
 * @option it-IT
 * @option jp-JP
 * @option ko-KR
 * @option nl-BE
 * @option nl-NL
 * @option no-NO
 * @option pl-PL
 * @option pt-BR
 * @option pt-PT
 * @option ro-RO
 * @option ru-RU
 * @option sk-SK
 * @option sv-SE
 * @option ta-IN
 * @option ta-LK
 * @option th-TH
 * @option tr-TR
 * @option zh-CN
 * @option zh-HK
 * @option zh-TW
 * @desc Base the digit grouping on which country/locale?
 * @default en-US
 *
 * @param PlayerBenefit
 * @text Player Benefit
 *
 * @param EncounterRateMinimum:num
 * @text Encounter Rate Min
 * @parent PlayerBenefit
 * @min 1
 * @desc Minimum number of steps the player can take without any random encounters.
 * @default 10
 *
 * @param EscapeAlways:eval
 * @text Escape Always
 * @parent PlayerBenefit
 * @type boolean
 * @on Always
 * @off Default
 * @desc If the player wants to escape a battle, let them escape the battle with 100% chance.
 * @default true
 *
 * @param ImprovedAccuracySystem:eval
 * @text Accuracy Formula
 * @parent PlayerBenefit
 * @type boolean
 * @on Improve
 * @off Default
 * @desc Accuracy formula calculation change to
 * Skill Hit% * (User HIT - Target EVA) for better results.
 * @default true
 *
 * @param AccuracyBoost:eval
 * @text Accuracy Boost
 * @parent PlayerBenefit
 * @type boolean
 * @on Boost
 * @off Default
 * @desc Boost HIT and EVA rates in favor of the player.
 * @default true
 *
 * @param LevelUpFullHp:eval
 * @text Level Up -> Full HP
 * @parent PlayerBenefit
 * @type boolean
 * @on Heal
 * @off Default
 * @desc Recovers full HP when an actor levels up.
 * @default true
 *
 * @param LevelUpFullMp:eval
 * @text Level Up -> Full MP
 * @parent PlayerBenefit
 * @type boolean
 * @on Heal
 * @off Default
 * @desc Recovers full MP when an actor levels up.
 * @default true
 *
 * @param Pictures
 * @text Picture-Related
 *
 * @param AntiZoomPictures:eval
 * @text Anti-Zoom Pictures
 * @parent Pictures
 * @type boolean
 * @on Anti-Zoom
 * @off Normal
 * @desc If on, prevents pictures from being affected by zoom.
 * @default true
 * 
 * @param PictureContainers
 * @text Picture Containers
 * @parent Pictures
 *
 * @param DetachBattlePictureContainer:eval
 * @text Detach in Battle
 * @parent PictureContainers
 * @type boolean
 * @on Detach
 * @off Normal
 * @desc If detached, picture container will be separated from
 * the spriteset while on the battle scene.
 * @default false
 *
 * @param DetachMapPictureContainer:eval
 * @text Detach in Map
 * @parent PictureContainers
 * @type boolean
 * @on Detach
 * @off Normal
 * @desc If detached, picture container will be separated from
 * the spriteset while on the map scene.
 * @default false
 *
 * @param Misc
 * @text Misc
 *
 * @param AnimationMirrorOffset:eval
 * @text Ani: Mirror Offset
 * @parent Misc
 * @type boolean
 * @on Mirror
 * @off Don't Mirror
 * @desc When animations are mirrored,
 * mirror their Offset X values, too.
 * @default false
 *
 * @param AutoStretch:str
 * @text Auto-Stretch
 * @parent Misc
 * @type select
 * @option Default
 * @value default
 * @option Stretch
 * @value stretch
 * @option Normal
 * @value normal
 * @desc Automatically stretch the game to fit the size of the client?
 * @default default
 *
 * @param FontShadows:eval
 * @text Font Shadows
 * @parent Misc
 * @type boolean
 * @on Shadows
 * @off Outlines
 * @desc If on, text uses shadows instead of outlines.
 * @default false
 *
 * @param FontSmoothing:eval
 * @text Font Smoothing
 * @parent Misc
 * @type boolean
 * @on Smooth
 * @off None
 * @desc If on, smoothes fonts shown in-game.
 * @default true
 *
 * @param FontWidthFix:eval
 * @text Font Width Fix
 * @parent Misc
 * @type boolean
 * @on Fix
 * @off Default
 * @desc Fixes the font width issue with instant display
 * non-monospaced fonts in the Message Window.
 * @default true
 *
 * @param KeyItemProtect:eval
 * @text Key Item Protection
 * @parent Misc
 * @type boolean
 * @on Unsellable
 * @off Sellable
 * @desc If on, prevents Key Items from being able to be sold and from being able to be consumed.
 * @default true
 *
 * @param MapNameTextCode:eval
 * @text Map Name Text Code
 * @parent Misc
 * @type boolean
 * @on Text Codes
 * @off Raw Text
 * @desc If on, map names will use text codes.
 * If off, only the raw map name will be used.
 * @default true
 *
 * @param ModernControls:eval
 * @text Modern Controls
 * @parent Misc
 * @type boolean
 * @on Enable
 * @off Default
 * @desc If on, allows usage of the Home/End buttons as well as other modern configs. Affects other VisuStella plugins.
 * @default true
 *
 * @param MvAnimationRate:num
 * @text MV Animation Rate
 * @parent Misc
 * @min 1
 * @max 10
 * @desc Adjusts the rate at which MV animations play.
 * Default: 4. Lower for faster. Higher for slower.
 * @default 4
 *
 * @param NewGameCommonEventAll:num
 * @text NewGame > CommonEvent
 * @parent Misc
 * @type common_event
 * @desc Runs a common event each time a new game during any session is started.
 * @default 0
 *
 * @param NoTileShadows:eval
 * @text No Tile Shadows
 * @parent Misc
 * @type boolean
 * @on Disable Tile Shadows
 * @off Default
 * @desc Removes tile shadows from being displayed in-game.
 * @default false
 *
 * @param PixelateImageRendering:eval
 * @text Pixel Image Rendering
 * @parent Misc
 * @type boolean
 * @on Pixelate
 * @off Smooth
 * @desc If on, pixelates the image rendering (for pixel games).
 * @default false
 *
 * @param RequireFocus:eval
 * @text Require Focus?
 * @parent Misc
 * @type boolean
 * @on Require
 * @off No Requirement
 * @desc Requires the game to be focused? If the game isn't
 * focused, it will pause if it's not the active window.
 * @default true
 *
 * @param ShortcutScripts:eval
 * @text Shortcut Scripts
 * @parent Misc
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables shortcut-based scripts.
 * View the helpfile for more information.
 * @default true
 *
 * @param SmartEventCollisionPriority:eval
 * @text Smart Event Collision
 * @parent Misc
 * @type boolean
 * @on Only Same Level
 * @off Default
 * @desc Makes events only able to collide with one another if they're 'Same as characters' priority.
 * @default true
 *
 * @param SubfolderParse:eval
 * @text Subfolder Name Purge
 * @parent Misc
 * @type boolean
 * @on Purge Subfolders Names
 * @off Don't Purge Name
 * @desc Purge subfolder name from Plugin Parameters when reading
 * data to let Plugin Commands work properly.
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Color Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Color:
 *
 * @param BasicColors
 * @text Basic Colors
 *
 * @param ColorNormal:str
 * @text Normal
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 0
 *
 * @param ColorSystem:str
 * @text System
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 16
 *
 * @param ColorCrisis:str
 * @text Crisis
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 17
 *
 * @param ColorDeath:str
 * @text Death
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 18
 *
 * @param ColorGaugeBack:str
 * @text Gauge Back
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 19
 *
 * @param ColorHPGauge1:str
 * @text HP Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 20
 *
 * @param ColorHPGauge2:str
 * @text HP Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 21
 *
 * @param ColorMPGauge1:str
 * @text MP Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 22
 *
 * @param ColorMPGauge2:str
 * @text MP Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 23
 *
 * @param ColorMPCost:str
 * @text MP Cost
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 23
 *
 * @param ColorPowerUp:str
 * @text Power Up
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 24
 *
 * @param ColorPowerDown:str
 * @text Power Down
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 25
 *
 * @param ColorCTGauge1:str
 * @text CT Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 26
 *
 * @param ColorCTGauge2:str
 * @text CT Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 27
 *
 * @param ColorTPGauge1:str
 * @text TP Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 28
 *
 * @param ColorTPGauge2:str
 * @text TP Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 29
 *
 * @param ColorTPCost:str
 * @text TP Cost
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 29
 *
 * @param ColorPending:str
 * @text Pending Color
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default #2a847d
 *
 * @param ColorExpGauge1:str
 * @text EXP Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 30
 *
 * @param ColorExpGauge2:str
 * @text EXP Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 31
 *
 * @param ColorMaxLvGauge1:str
 * @text MaxLv Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 14
 *
 * @param ColorMaxLvGauge2:str
 * @text MaxLv Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 6
 *
 * @param AlphaColors
 * @text Alpha Colors
 *
 * @param OutlineColor:str
 * @text Window Font Outline
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0.6)
 *
 * @param OutlineColorGauge:str
 * @text Gauge Number Outline
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 1.0)
 *
 * @param DimColor1:str
 * @text Dim Color 1
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0.6)
 *
 * @param DimColor2:str
 * @text Dim Color 2
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0)
 *
 * @param ItemBackColor1:str
 * @text Item Back Color 1
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(32, 32, 32, 0.5)
 *
 * @param ItemBackColor2:str
 * @text Item Back Color 2
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0.5)
 *
 * @param ConditionalColors
 * @text Conditional Colors
 *
 * @param ActorHPColor:func
 * @text JS: Actor HP Color
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining what HP color to use for actors.
 * @default "// Set the variables used in this function.\nlet actor = arguments[0];\n\n// Check if the actor exists. If not, return normal.\nif (!actor) {\n    return this.normalColor();\n\n// If the actor is dead, return death color.\n} else if (actor.isDead()) {\n    return this.deathColor();\n\n// If the actor is dying, return crisis color.\n} else if (actor.isDying()) {\n    return this.crisisColor();\n\n// Otherwise, return the normal color.\n} else {\n    return this.normalColor();\n}"
 *
 * @param ActorMPColor:func
 * @text JS: Actor MP Color
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining what MP color to use for actors.
 * @default "// Set the variables used in this function.\nlet actor = arguments[0];\n\n// Check if the actor exists. If not, return normal.\nif (!actor) {\n    return this.normalColor();\n\n// If MP rate is below 25%, return crisis color.\n} else if (actor.mpRate() < 0.25) {\n    return this.crisisColor();\n\n// Otherwise, return the normal color.\n} else {\n    return this.normalColor();\n}"
 *
 * @param ActorTPColor:func
 * @text JS: Actor TP Color
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining what TP color to use for actors.
 * @default "// Set the variables used in this function.\nlet actor = arguments[0];\n\n// Check if the actor exists. If not, return normal.\nif (!actor) {\n    return this.normalColor();\n\n// If TP rate is below 25%, return crisis color.\n} else if (actor.tpRate() < 0.25) {\n    return this.crisisColor();\n\n// Otherwise, return the normal color.\n} else {\n    return this.normalColor();\n}"
 *
 * @param ParamChange:func
 * @text JS: Parameter Change
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining whatcolor to use for parameter changes.
 * @default "// Set the variables used in this function.\nlet change = arguments[0];\n\n// If a positive change, use power up color.\nif (change > 0) {\n    return this.powerUpColor();\n\n// If a negative change, use power down color.\n} else if (change < 0) {\n    return this.powerDownColor();\n\n// Otherwise, return the normal color.\n} else {\n    return this.normalColor();\n}"
 *
 * @param DamageColor:func
 * @text JS: Damage Colors
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining what color to use for damage types.
 * @default "// Set the variables used in this function.\nlet colorType = arguments[0];\n\n// Check the value of the color type\n// and return an appropriate color.\nswitch (colorType) {\n\n    case 0: // HP damage\n        return \"#ffffff\";\n\n    case 1: // HP recover\n        return \"#b9ffb5\";\n\n    case 2: // MP damage\n        return \"#bb88bb\";\n\n    case 3: // MP recover\n        return \"#80b0ff\";\n\n    default:\n        return \"#808080\";\n}"
 */
/* ----------------------------------------------------------------------------
 * Gold Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Gold:
 *
 * @param GoldMax:num
 * @text Gold Max
 * @type num
 * @min 1
 * @desc Maximum amount of Gold the party can hold.
 * Default 99999999
 * @default 99999999
 *
 * @param GoldFontSize:num
 * @text Gold Font Size
 * @type number
 * @min 1
 * @desc Font size used for displaying Gold inside Gold Windows.
 * Default: 26
 * @default 24
 *
 * @param GoldIcon:num
 * @text Gold Icon
 * @desc Icon used to represent Gold.
 * Use 0 for no icon.
 * @default 314
 *
 * @param GoldOverlap:str
 * @text Gold Overlap
 * @desc Text used too much Gold to fit in the window.
 * @default A Lot
 *
 * @param ItemStyle:eval
 * @text Item Style
 * @type boolean
 * @on Enable
 * @off Normal
 * @desc Draw gold in the item style?
 * ie: Icon, Label, Value
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Image Loading Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ImgLoad:
 *
 * @param animations:arraystr
 * @text img/animations/
 * @type file[]
 * @dir img/animations/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param battlebacks1:arraystr
 * @text img/battlebacks1/
 * @type file[]
 * @dir img/battlebacks1/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param battlebacks2:arraystr
 * @text img/battlebacks2/
 * @type file[]
 * @dir img/battlebacks2/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param characters:arraystr
 * @text img/characters/
 * @type file[]
 * @dir img/characters/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param enemies:arraystr
 * @text img/enemies/
 * @type file[]
 * @dir img/enemies/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param faces:arraystr
 * @text img/faces/
 * @type file[]
 * @dir img/faces/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param parallaxes:arraystr
 * @text img/parallaxes/
 * @type file[]
 * @dir img/parallaxes/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param pictures:arraystr
 * @text img/pictures/
 * @type file[]
 * @dir img/pictures/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param sv_actors:arraystr
 * @text img/sv_actors/
 * @type file[]
 * @dir img/sv_actors/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param sv_enemies:arraystr
 * @text img/sv_enemies/
 * @type file[]
 * @dir img/sv_enemies/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param system:arraystr
 * @text img/system/
 * @type file[]
 * @dir img/system/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default ["Balloon","IconSet"]
 *
 * @param tilesets:arraystr
 * @text img/tilesets/
 * @type file[]
 * @dir img/tilesets/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param titles1:arraystr
 * @text img/titles1/
 * @type file[]
 * @dir img/titles1/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param titles2:arraystr
 * @text img/titles2/
 * @type file[]
 * @dir img/titles2/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 */
/* ----------------------------------------------------------------------------
 * Keyboard Input Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~KeyboardInput:
 *
 * @param Controls
 *
 * @param WASD:eval
 * @text WASD Movement
 * @parent Controls
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables or disables WASD movement for your game project.
 * Moves the W page down button to E.
 * @default false
 *
 * @param DashToggleR:eval
 * @text R Button: Dash Toggle
 * @parent Controls
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables or disables R button as an Always Dash option toggle.
 * @default false
 *
 * @param NameInput
 * @text Name Input
 *
 * @param EnableNameInput:eval
 * @text Enable?
 * @parent NameInput
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables keyboard input for name entry.
 * Only tested with English keyboards.
 * @default true
 * 
 * @param DefaultMode:str
 * @text Default Mode
 * @parent NameInput
 * @type select
 * @option Default - Uses Arrow Keys to select letters.
 * @value default
 * @option Keyboard - Uses Keyboard to type in letters.
 * @value keyboard
 * @desc Select default mode when entering the scene.
 * @default keyboard
 *
 * @param QwertyLayout:eval
 * @text QWERTY Layout
 * @parent NameInput
 * @type boolean
 * @on QWERTY Layout
 * @off ABCDEF Layout
 * @desc Uses the QWERTY layout for manual entry.
 * @default true
 *
 * @param NameInputMessage:eval
 * @text Keyboard Message
 * @parent NameInput
 * @type note
 * @desc The message displayed when allowing keyboard entry.
 * You may use text codes here.
 * @default "Type in this character's name.\nPress \\c[5]ENTER\\c[0] when you're done.\n\n-or-\n\nPress \\c[5]arrow keys\\c[0]/\\c[5]TAB\\c[0] to switch\nto manual character entry.\n\nPress \\c[5]ESC\\c[0]/\\c[5]TAB\\c[0] to use to keyboard."
 * 
 * @param BannedWords:arraystr
 * @text Banned Words
 * @parent NameInput
 * @type string[]
 * @desc Players cannot use these words for names.
 * These include words inside the names.
 * @default []
 *
 * @param NumberInput
 * @text Number Input
 *
 * @param EnableNumberInput:eval
 * @text Enable?
 * @parent NumberInput
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables keyboard input for number entry.
 * Only tested with English keyboards.
 * @default true
 *
 * @param ButtonAssist
 * @text Button Assist
 * 
 * @param Finish:str
 * @text Finish Entry
 * @parent ButtonAssist
 * @desc Text used to describe finish entry.
 * @default Finish
 * 
 * @param PageChange:str
 * @text Page Change
 * @parent ButtonAssist
 * @desc Text used to describe character page changing.
 * @default Page
 * 
 * @param Keyboard:str
 * @text Switch To Keyboard
 * @parent ButtonAssist
 * @desc Text used to describe the keyboard switch.
 * @default Keyboard
 * 
 * @param Manual:str
 * @text Switch To Manual
 * @parent ButtonAssist
 * @desc Text used to describe the manual entry switch.
 * @default Manual
 *
 */
/* ----------------------------------------------------------------------------
 * Menu Background Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MenuBg:
 * 
 * @param BlurStrength:num
 * @text Blur Strength
 * @desc Strength used for menu background snapshots.
 * Default: 8. Higher is stronger. Lower is weaker.
 * @default 8
 *
 * @param Scene_Menu:struct
 * @text Scene_Menu
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Item:struct
 * @text Scene_Item
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Skill:struct
 * @text Scene_Skill
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Equip:struct
 * @text Scene_Equip
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Status:struct
 * @text Scene_Status
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Options:struct
 * @text Scene_Options
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Save:struct
 * @text Scene_Save
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Load:struct
 * @text Scene_Load
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_GameEnd:struct
 * @text Scene_GameEnd
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"128","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Shop:struct
 * @text Scene_Shop
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Name:struct
 * @text Scene_Name
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Unlisted:struct
 * @text Scene_Unlisted
 * @type struct<BgSettings>
 * @desc The individual background settings for any scenes that aren't listed here.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 */
/* ----------------------------------------------------------------------------
 * Background Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~BgSettings:
 *
 * @param SnapshotOpacity:num
 * @text Snapshop Opacity
 * @type number
 * @min 0
 * @max 255
 * @desc Snapshot opacity for the scene.
 * @default 192
 *
 * @param BgFilename1:str
 * @text Background 1
 * @type file
 * @dir img/titles1/
 * @desc Filename used for the bottom background image.
 * Leave empty if you don't wish to use one.
 * @default 
 *
 * @param BgFilename2:str
 * @text Background 2
 * @type file
 * @dir img/titles2/
 * @desc Filename used for the upper background image.
 * Leave empty if you don't wish to use one.
 * @default 
 *
 */
/* ----------------------------------------------------------------------------
 * Menu Button Assist Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ButtonAssist:
 *
 * @param General
 *
 * @param Enable:eval
 * @text Enable
 * @parent General
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Enable the Menu Button Assist Window.
 * @default true
 *
 * @param Location:str
 * @text Location
 * @parent General
 * @type select
 * @option Top of Screen
 * @value top
 * @option Bottom of Screen
 * @value bottom
 * @desc Determine the location of the Button Assist Window.
 * Requires Plugin Parameters => UI => Side Buttons ON.
 * @default bottom
 *
 * @param BgType:num
 * @text Background Type
 * @parent General
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param SplitEscape:eval
 * @text Split "Escape"
 * @parent General
 * @type boolean
 * @on Split
 * @off Don't
 * @desc "Split" makes separate instances of "Cancel" and "Menu".
 * Requires custom Input.keyMapper with "cancel" and "menu".
 * @default false
 *
 * @param Text
 *
 * @param TextFmt:str
 * @text Text Format
 * @parent Text
 * @desc Format on how the buttons are displayed.
 * Text codes allowed. %1 - Key, %2 - Text
 * @default %1:%2
 *
 * @param MultiKeyFmt:str
 * @text Multi-Key Format
 * @parent Text
 * @desc Format for actions with multiple keys.
 * Text codes allowed. %1 - Key 1, %2 - Key 2
 * @default %1/%2
 *
 * @param OkText:str
 * @text OK Text
 * @parent Text
 * @desc Default text used to display OK Key Action.
 * Text codes allowed.
 * @default Select
 *
 * @param CancelText:str
 * @text Cancel Text
 * @parent Text
 * @desc Default text used to display Cancel Key Action.
 * Text codes allowed.
 * @default Back
 *
 * @param SwitchActorText:str
 * @text Switch Actor Text
 * @parent Text
 * @desc Default text used to display Switch Actor Action.
 * Text codes allowed.
 * @default Switch Ally
 *
 * @param Keys
 *
 * @param KeyUnlisted:str
 * @text Key: Unlisted Format
 * @parent Keys
 * @desc If a key is not listed below, use this format.
 * Text codes allowed. %1 - Key
 * @default \}❪%1❫\{
 *
 * @param KeyUP:str
 * @text Key: Up
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default ^
 *
 * @param KeyDOWN:str
 * @text Key: Down
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default v
 *
 * @param KeyLEFT:str
 * @text Key: Left
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default <<
 *
 * @param KeyRIGHT:str
 * @text Key: Right
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default >>
 *
 * @param KeySHIFT:str
 * @text Key: Shift
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default \}❪SHIFT❫\{
 *
 * @param KeyTAB:str
 * @text Key: Tab
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default \}❪TAB❫\{
 *
 * @param KeyA:str
 * @text Key: A
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default A
 *
 * @param KeyB:str
 * @text Key: B
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default B
 *
 * @param KeyC:str
 * @text Key: C
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default C
 *
 * @param KeyD:str
 * @text Key: D
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default D
 *
 * @param KeyE:str
 * @text Key: E
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default E
 *
 * @param KeyF:str
 * @text Key: F
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default F
 *
 * @param KeyG:str
 * @text Key: G
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default G
 *
 * @param KeyH:str
 * @text Key: H
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default H
 *
 * @param KeyI:str
 * @text Key: I
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default I
 *
 * @param KeyJ:str
 * @text Key: J
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default J
 *
 * @param KeyK:str
 * @text Key: K
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default K
 *
 * @param KeyL:str
 * @text Key: L
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default L
 *
 * @param KeyM:str
 * @text Key: M
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default M
 *
 * @param KeyN:str
 * @text Key: N
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default N
 *
 * @param KeyO:str
 * @text Key: O
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default O
 *
 * @param KeyP:str
 * @text Key: P
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default P
 *
 * @param KeyQ:str
 * @text Key: Q
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default Q
 *
 * @param KeyR:str
 * @text Key: R
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default R
 *
 * @param KeyS:str
 * @text Key: S
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default S
 *
 * @param KeyT:str
 * @text Key: T
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default T
 *
 * @param KeyU:str
 * @text Key: U
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default U
 *
 * @param KeyV:str
 * @text Key: V
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default V
 *
 * @param KeyW:str
 * @text Key: W
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default W
 *
 * @param KeyX:str
 * @text Key: X
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default X
 *
 * @param KeyY:str
 * @text Key: Y
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default Y
 *
 * @param KeyZ:str
 * @text Key: Z
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default Z
 *
 */
/* ----------------------------------------------------------------------------
 * Controller Buttons Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ControllerButtons:
 *
 * @param ID
 * @text ID Information
 *
 * @param Name:str
 * @text Controller ID Name
 * @parent ID
 * @desc Exact string used for this controller ID. Plugin Command
 * "Debug: Current Controller ID" for ID help.
 * @default Untitled
 *
 * @param Match:str
 * @text Similarity Match
 * @parent ID
 * @desc Similar text used for this controller ID. Plugin Command
 * "Debug: Current Controller ID" for ID help.
 * @default Untitled
 * 
 * @param Directions
 *
 * @param up:str
 * @text Up
 * @parent Directions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default 
 *
 * @param left:str
 * @text Left
 * @parent Directions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default 
 *
 * @param right:str
 * @text Right
 * @parent Directions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default 
 *
 * @param down:str
 * @text Down
 * @parent Directions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default 
 * 
 * @param Actions
 *
 * @param ok:str
 * @text OK
 * @parent Actions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default 
 *
 * @param cancel:str
 * @text Cancel
 * @parent Actions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default 
 *
 * @param menu:str
 * @text Menu
 * @parent Actions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default 
 *
 * @param shift:str
 * @text Shift
 * @parent Actions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default 
 *
 * @param pageup:str
 * @text Page Up
 * @parent Actions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default 
 *
 * @param pagedown:str
 * @text Page Down
 * @parent Actions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default 
 *
 */
/* ----------------------------------------------------------------------------
 * Menu Layout Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MenuLayout:
 *
 * @param Title:struct
 * @text Scene_Title
 * @parent SceneSettings
 * @type struct<Title>
 * @desc Various options on adjusting the Title Scene.
 * @default {"TitleScreen":"","DocumentTitleFmt:str":"%1: %2 - Version %3","Subtitle:str":"Subtitle","Version:str":"0.00","drawGameTitle:func":"\"const x = 20;\\nconst y = Graphics.height / 4;\\nconst maxWidth = Graphics.width - x * 2;\\nconst text = $dataSystem.gameTitle;\\nconst bitmap = this._gameTitleSprite.bitmap;\\nbitmap.fontFace = $gameSystem.mainFontFace();\\nbitmap.outlineColor = \\\"black\\\";\\nbitmap.outlineWidth = 8;\\nbitmap.fontSize = 72;\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\"center\\\");\"","drawGameSubtitle:func":"\"const x = 20;\\nconst y = Graphics.height / 4 + 72;\\nconst maxWidth = Graphics.width - x * 2;\\nconst text = Scene_Title.subtitle;\\nconst bitmap = this._gameTitleSprite.bitmap;\\nbitmap.fontFace = $gameSystem.mainFontFace();\\nbitmap.outlineColor = \\\"black\\\";\\nbitmap.outlineWidth = 6;\\nbitmap.fontSize = 48;\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\"center\\\");\"","drawGameVersion:func":"\"const bitmap = this._gameTitleSprite.bitmap;\\nconst x = 0;\\nconst y = Graphics.height - 20;\\nconst width = Math.round(Graphics.width / 4);\\nconst height = 20;\\nconst c1 = ColorManager.dimColor1();\\nconst c2 = ColorManager.dimColor2();\\nconst text = 'Version ' + Scene_Title.version;\\nbitmap.gradientFillRect(x, y, width, height, c1, c2);\\nbitmap.fontFace = $gameSystem.mainFontFace();\\nbitmap.outlineColor = \\\"black\\\";\\nbitmap.outlineWidth = 3;\\nbitmap.fontSize = 16;\\nbitmap.drawText(text, x + 4, y, Graphics.width, height, \\\"left\\\");\"","CommandRect:func":"\"const offsetX = $dataSystem.titleCommandWindow.offsetX;\\nconst offsetY = $dataSystem.titleCommandWindow.offsetY;\\nconst rows = this.commandWindowRows();\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = (Graphics.boxWidth - width) / 2 + offsetX;\\nconst y = Graphics.boxHeight - height - 96 + offsetY;\\nreturn new Rectangle(x, y, width, height);\"","ButtonFadeSpeed:num":"4"}
 *
 * @param MainMenu:struct
 * @text Scene_Menu
 * @parent SceneSettings
 * @type struct<MainMenu>
 * @desc Various options on adjusting the Main Menu Scene.
 * @default {"CommandWindow":"","CommandBgType:num":"0","CommandRect:func":"\"const width = this.mainCommandWidth();\\nconst height = this.mainAreaHeight() - this.goldWindowRect().height;\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","GoldWindow":"","GoldBgType:num":"0","GoldRect:func":"\"const rows = 1;\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\nconst y = this.mainAreaBottom() - height;\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const width = Graphics.boxWidth - this.mainCommandWidth();\\nconst height = this.mainAreaHeight();\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param ItemMenu:struct
 * @text Scene_Item
 * @parent SceneSettings
 * @type struct<ItemMenu>
 * @desc Various options on adjusting the Item Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.helpAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.helpAreaHeight();\\nreturn new Rectangle(x, y, width, height);\"","CategoryWindow":"","CategoryBgType:num":"0","CategoryRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = Graphics.boxWidth;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\"","ItemWindow":"","ItemBgType:num":"0","ItemRect:func":"\"const x = 0;\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaBottom() - y;\\nreturn new Rectangle(x, y, width, height);\"","ActorWindow":"","ActorBgType:num":"0","ActorRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight();\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param SkillMenu:struct
 * @text Scene_Skill
 * @parent SceneSettings
 * @type struct<SkillMenu>
 * @desc Various options on adjusting the Skill Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.helpAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.helpAreaHeight();\\nreturn new Rectangle(x, y, width, height);\"","SkillTypeWindow":"","SkillTypeBgType:num":"0","SkillTypeRect:func":"\"const rows = 3;\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const width = Graphics.boxWidth - this.mainCommandWidth();\\nconst height = this._skillTypeWindow.height;\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","ItemWindow":"","ItemBgType:num":"0","ItemRect:func":"\"const x = 0;\\nconst y = this._statusWindow.y + this._statusWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight() - this._statusWindow.height;\\nreturn new Rectangle(x, y, width, height);\"","ActorWindow":"","ActorBgType:num":"0","ActorRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight();\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param EquipMenu:struct
 * @text Scene_Equip
 * @parent SceneSettings
 * @type struct<EquipMenu>
 * @desc Various options on adjusting the Equip Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.helpAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.helpAreaHeight();\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst width = this.statusWidth();\\nconst height = this.mainAreaHeight();\\nreturn new Rectangle(x, y, width, height);\"","CommandWindow":"","CommandBgType:num":"0","CommandRect:func":"\"const x = this.statusWidth();\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = Graphics.boxWidth - this.statusWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\"","SlotWindow":"","SlotBgType:num":"0","SlotRect:func":"\"const commandWindowRect = this.commandWindowRect();\\nconst x = this.statusWidth();\\nconst y = commandWindowRect.y + commandWindowRect.height;\\nconst width = Graphics.boxWidth - this.statusWidth();\\nconst height = this.mainAreaHeight() - commandWindowRect.height;\\nreturn new Rectangle(x, y, width, height);\"","ItemWindow":"","ItemBgType:num":"0","ItemRect:func":"\"return this.slotWindowRect();\""}
 *
 * @param StatusMenu:struct
 * @text Scene_Status
 * @parent SceneSettings
 * @type struct<StatusMenu>
 * @desc Various options on adjusting the Status Menu Scene.
 * @default {"ProfileWindow":"","ProfileBgType:num":"0","ProfileRect:func":"\"const width = Graphics.boxWidth;\\nconst height = this.profileHeight();\\nconst x = 0;\\nconst y = this.mainAreaBottom() - height;\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.statusParamsWindowRect().y - y;\\nreturn new Rectangle(x, y, width, height);\"","StatusParamsWindow":"","StatusParamsBgType:num":"0","StatusParamsRect:func":"\"const width = this.statusParamsWidth();\\nconst height = this.statusParamsHeight();\\nconst x = 0;\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\nreturn new Rectangle(x, y, width, height);\"","StatusEquipWindow":"","StatusEquipBgType:num":"0","StatusEquipRect:func":"\"const width = Graphics.boxWidth - this.statusParamsWidth();\\nconst height = this.statusParamsHeight();\\nconst x = this.statusParamsWidth();\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param OptionsMenu:struct
 * @text Scene_Options
 * @parent SceneSettings
 * @type struct<OptionsMenu>
 * @desc Various options on adjusting the Options Menu Scene.
 * @default {"OptionsWindow":"","OptionsBgType:num":"0","OptionsRect:func":"\"const n = Math.min(this.maxCommands(), this.maxVisibleCommands());\\nconst width = 400;\\nconst height = this.calcWindowHeight(n, true);\\nconst x = (Graphics.boxWidth - width) / 2;\\nconst y = (Graphics.boxHeight - height) / 2;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param SaveMenu:struct
 * @text Scene_Save
 * @parent SceneSettings
 * @type struct<SaveMenu>
 * @desc Various options on adjusting the Save Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = Graphics.boxWidth;\\nconst height = this.calcWindowHeight(rows, false);\\nreturn new Rectangle(x, y, width, height);\"","ListWindow":"","ListBgType:num":"0","ListRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param LoadMenu:struct
 * @text Scene_Load
 * @parent SceneSettings
 * @type struct<LoadMenu>
 * @desc Various options on adjusting the Load Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = Graphics.boxWidth;\\nconst height = this.calcWindowHeight(rows, false);\\nreturn new Rectangle(x, y, width, height);\"","ListWindow":"","ListBgType:num":"0","ListRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param GameEnd:struct
 * @text Scene_GameEnd
 * @parent SceneSettings
 * @type struct<GameEnd>
 * @desc Various options on adjusting the Game End Scene.
 * @default {"CommandList:arraystruct":"[\"{\\\"Symbol:str\\\":\\\"toTitle\\\",\\\"TextStr:str\\\":\\\"Untitled\\\",\\\"TextJS:func\\\":\\\"\\\\\\\"return TextManager.toTitle;\\\\\\\"\\\",\\\"ShowJS:func\\\":\\\"\\\\\\\"return true;\\\\\\\"\\\",\\\"EnableJS:func\\\":\\\"\\\\\\\"return true;\\\\\\\"\\\",\\\"ExtJS:func\\\":\\\"\\\\\\\"return null;\\\\\\\"\\\",\\\"CallHandlerJS:func\\\":\\\"\\\\\\\"SceneManager._scene.commandToTitle();\\\\\\\"\\\"}\",\"{\\\"Symbol:str\\\":\\\"cancel\\\",\\\"TextStr:str\\\":\\\"Untitled\\\",\\\"TextJS:func\\\":\\\"\\\\\\\"return TextManager.cancel;\\\\\\\"\\\",\\\"ShowJS:func\\\":\\\"\\\\\\\"return true;\\\\\\\"\\\",\\\"EnableJS:func\\\":\\\"\\\\\\\"return true;\\\\\\\"\\\",\\\"ExtJS:func\\\":\\\"\\\\\\\"return null;\\\\\\\"\\\",\\\"CallHandlerJS:func\\\":\\\"\\\\\\\"SceneManager._scene.popScene();\\\\\\\"\\\"}\"]","CommandBgType:num":"0","CommandRect:func":"\"const rows = 2;\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = (Graphics.boxWidth - width) / 2;\\nconst y = (Graphics.boxHeight - height) / 2;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param ShopMenu:struct
 * @text Scene_Shop
 * @parent SceneSettings
 * @type struct<ShopMenu>
 * @desc Various options on adjusting the Shop Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const wx = 0;\\nconst wy = this.helpAreaTop();\\nconst ww = Graphics.boxWidth;\\nconst wh = this.helpAreaHeight();\\nreturn new Rectangle(wx, wy, ww, wh);\"","GoldWindow":"","GoldBgType:num":"0","GoldRect:func":"\"const rows = 1;\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = Graphics.boxWidth - width;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","CommandWindow":"","CommandBgType:num":"0","CommandRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = this._goldWindow.x;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\"","DummyWindow":"","DummyBgType:num":"0","DummyRect:func":"\"const x = 0;\\nconst y = this._commandWindow.y + this._commandWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight() - this._commandWindow.height;\\nreturn new Rectangle(x, y, width, height);\"","NumberWindow":"","NumberBgType:num":"0","NumberRect:func":"\"const x = 0;\\nconst y = this._dummyWindow.y;\\nconst width = Graphics.boxWidth - this.statusWidth();\\nconst height = this._dummyWindow.height;\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const width = this.statusWidth();\\nconst height = this._dummyWindow.height;\\nconst x = Graphics.boxWidth - width;\\nconst y = this._dummyWindow.y;\\nreturn new Rectangle(x, y, width, height);\"","BuyWindow":"","BuyBgType:num":"0","BuyRect:func":"\"const x = 0;\\nconst y = this._dummyWindow.y;\\nconst width = Graphics.boxWidth - this.statusWidth();\\nconst height = this._dummyWindow.height;\\nreturn new Rectangle(x, y, width, height);\"","CategoryWindow":"","CategoryBgType:num":"0","CategoryRect:func":"\"const x = 0;\\nconst y = this._dummyWindow.y;\\nconst rows = 1;\\nconst width = Graphics.boxWidth;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\"","SellWindow":"","SellBgType:num":"0","SellRect:func":"\"const x = 0;\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height =\\n    this.mainAreaHeight() -\\n    this._commandWindow.height -\\n    this._categoryWindow.height;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param NameMenu:struct
 * @text Scene_Name
 * @parent SceneSettings
 * @type struct<NameMenu>
 * @desc Various options on adjusting the Actor Rename Scene.
 * @default {"EditWindow":"","EditBgType:num":"0","EditRect:func":"\"const rows = 9;\\nconst inputWindowHeight = this.calcWindowHeight(rows, true);\\nconst padding = $gameSystem.windowPadding();\\nconst width = 600;\\nconst height = Math.min(ImageManager.faceHeight + padding * 2, this.mainAreaHeight() - inputWindowHeight);\\nconst x = (Graphics.boxWidth - width) / 2;\\nconst y = (this.mainAreaHeight() - (height + inputWindowHeight)) / 2 + this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","InputWindow":"","InputBgType:num":"0","InputRect:func":"\"const x = this._editWindow.x;\\nconst y = this._editWindow.y + this._editWindow.height;\\nconst rows = 9;\\nconst width = this._editWindow.width;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\""}
 *
 */
/* ----------------------------------------------------------------------------
 * Main Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MainMenu:
 *
 * @param CommandWindow
 * @text Command Window
 *
 * @param CommandBgType:num
 * @text Background Type
 * @parent CommandWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent CommandWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = this.mainCommandWidth();\nconst height = this.mainAreaHeight() - this.goldWindowRect().height;\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param GoldWindow
 * @text Gold Window
 *
 * @param GoldBgType:num
 * @text Background Type
 * @parent GoldWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param GoldRect:func
 * @text JS: X, Y, W, H
 * @parent GoldWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 1;\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\nconst y = this.mainAreaBottom() - height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.boxWidth - this.mainCommandWidth();\nconst height = this.mainAreaHeight();\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Item Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ItemMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.helpAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.helpAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param CategoryWindow
 * @text Category Window
 *
 * @param CategoryBgType:num
 * @text Background Type
 * @parent CategoryWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param CategoryRect:func
 * @text JS: X, Y, W, H
 * @parent CategoryWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = Graphics.boxWidth;\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ItemWindow
 * @text Item Window
 *
 * @param ItemBgType:num
 * @text Background Type
 * @parent ItemWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ItemRect:func
 * @text JS: X, Y, W, H
 * @parent ItemWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._categoryWindow.y + this._categoryWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaBottom() - y;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ActorWindow
 * @text Actor Window
 *
 * @param ActorBgType:num
 * @text Background Type
 * @parent ActorWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ActorRect:func
 * @text JS: X, Y, W, H
 * @parent ActorWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Skill Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~SkillMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.helpAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.helpAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param SkillTypeWindow
 * @text Skill Type Window
 *
 * @param SkillTypeBgType:num
 * @text Background Type
 * @parent SkillTypeWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param SkillTypeRect:func
 * @text JS: X, Y, W, H
 * @parent SkillTypeWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 3;\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.boxWidth - this.mainCommandWidth();\nconst height = this._skillTypeWindow.height;\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ItemWindow
 * @text Item Window
 *
 * @param ItemBgType:num
 * @text Background Type
 * @parent ItemWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ItemRect:func
 * @text JS: X, Y, W, H
 * @parent ItemWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._statusWindow.y + this._statusWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight() - this._statusWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ActorWindow
 * @text Actor Window
 *
 * @param ActorBgType:num
 * @text Background Type
 * @parent ActorWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ActorRect:func
 * @text JS: X, Y, W, H
 * @parent ActorWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Equip Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~EquipMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.helpAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.helpAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst width = this.statusWidth();\nconst height = this.mainAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param CommandWindow
 * @text Command Window
 *
 * @param CommandBgType:num
 * @text Background Type
 * @parent CommandWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent CommandWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = this.statusWidth();\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = Graphics.boxWidth - this.statusWidth();\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param SlotWindow
 * @text Slot Window
 *
 * @param SlotBgType:num
 * @text Background Type
 * @parent SlotWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param SlotRect:func
 * @text JS: X, Y, W, H
 * @parent SlotWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const commandWindowRect = this.commandWindowRect();\nconst x = this.statusWidth();\nconst y = commandWindowRect.y + commandWindowRect.height;\nconst width = Graphics.boxWidth - this.statusWidth();\nconst height = this.mainAreaHeight() - commandWindowRect.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ItemWindow
 * @text Item Window
 *
 * @param ItemBgType:num
 * @text Background Type
 * @parent ItemWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ItemRect:func
 * @text JS: X, Y, W, H
 * @parent ItemWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "return this.slotWindowRect();"
 *
 */
/* ----------------------------------------------------------------------------
 * Status Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~StatusMenu:
 *
 * @param ProfileWindow
 * @text Profile Window
 *
 * @param ProfileBgType:num
 * @text Background Type
 * @parent ProfileWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ProfileRect:func
 * @text JS: X, Y, W, H
 * @parent ProfileWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.boxWidth;\nconst height = this.profileHeight();\nconst x = 0;\nconst y = this.mainAreaBottom() - height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.statusParamsWindowRect().y - y;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusParamsWindow
 * @text Parameters Window
 *
 * @param StatusParamsBgType:num
 * @text Background Type
 * @parent StatusParamsWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param StatusParamsRect:func
 * @text JS: X, Y, W, H
 * @parent StatusParamsWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = this.statusParamsWidth();\nconst height = this.statusParamsHeight();\nconst x = 0;\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusEquipWindow
 * @text Equipment Window
 *
 * @param StatusEquipBgType:num
 * @text Background Type
 * @parent StatusEquipWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param StatusEquipRect:func
 * @text JS: X, Y, W, H
 * @parent StatusEquipWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.boxWidth - this.statusParamsWidth();\nconst height = this.statusParamsHeight();\nconst x = this.statusParamsWidth();\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Options Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~OptionsMenu:
 *
 * @param OptionsWindow
 * @text Options Window
 *
 * @param OptionsBgType:num
 * @text Background Type
 * @parent OptionsWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param OptionsRect:func
 * @text JS: X, Y, W, H
 * @parent OptionsWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const n = Math.min(this.maxCommands(), this.maxVisibleCommands());\nconst width = 400;\nconst height = this.calcWindowHeight(n, true);\nconst x = (Graphics.boxWidth - width) / 2;\nconst y = (Graphics.boxHeight - height) / 2;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Save Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~SaveMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = Graphics.boxWidth;\nconst height = this.calcWindowHeight(rows, false);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ListWindow
 * @text List Window
 *
 * @param ListBgType:num
 * @text Background Type
 * @parent ListWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ListRect:func
 * @text JS: X, Y, W, H
 * @parent ListWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop() + this._helpWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight() - this._helpWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Load Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~LoadMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = Graphics.boxWidth;\nconst height = this.calcWindowHeight(rows, false);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ListWindow
 * @text List Window
 *
 * @param ListBgType:num
 * @text Background Type
 * @parent ListWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ListRect:func
 * @text JS: X, Y, W, H
 * @parent ListWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop() + this._helpWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight() - this._helpWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Game End Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~GameEnd:
 *
 * @param CommandList:arraystruct
 * @text Command Window List
 * @type struct<Command>[]
 * @desc Window commands used by the Game End screen.
 * Add new commands here.
 * @default ["{\"Symbol:str\":\"toTitle\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.toTitle;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandToTitle();\\\"\"}","{\"Symbol:str\":\"cancel\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.cancel;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.popScene();\\\"\"}"]
 *
 * @param CommandBgType:num
 * @text Background Type
 * @parent CommandList:arraystruct
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent CommandList:arraystruct
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 2;\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = (Graphics.boxWidth - width) / 2;\nconst y = (Graphics.boxHeight - height) / 2;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Shop Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ShopMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const wx = 0;\nconst wy = this.helpAreaTop();\nconst ww = Graphics.boxWidth;\nconst wh = this.helpAreaHeight();\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param GoldWindow
 * @text Gold Window
 *
 * @param GoldBgType:num
 * @text Background Type
 * @parent GoldWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param GoldRect:func
 * @text JS: X, Y, W, H
 * @parent GoldWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 1;\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = Graphics.boxWidth - width;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param CommandWindow
 * @text Command Window
 *
 * @param CommandBgType:num
 * @text Background Type
 * @parent CommandWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent CommandWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = this._goldWindow.x;\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param DummyWindow
 * @text Dummy Window
 *
 * @param DummyBgType:num
 * @text Background Type
 * @parent DummyWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param DummyRect:func
 * @text JS: X, Y, W, H
 * @parent DummyWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._commandWindow.y + this._commandWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight() - this._commandWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param NumberWindow
 * @text Number Window
 *
 * @param NumberBgType:num
 * @text Background Type
 * @parent NumberWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param NumberRect:func
 * @text JS: X, Y, W, H
 * @parent NumberWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._dummyWindow.y;\nconst width = Graphics.boxWidth - this.statusWidth();\nconst height = this._dummyWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = this.statusWidth();\nconst height = this._dummyWindow.height;\nconst x = Graphics.boxWidth - width;\nconst y = this._dummyWindow.y;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param BuyWindow
 * @text Buy Window
 *
 * @param BuyBgType:num
 * @text Background Type
 * @parent BuyWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param BuyRect:func
 * @text JS: X, Y, W, H
 * @parent BuyWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._dummyWindow.y;\nconst width = Graphics.boxWidth - this.statusWidth();\nconst height = this._dummyWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param CategoryWindow
 * @text Category Window
 *
 * @param CategoryBgType:num
 * @text Background Type
 * @parent CategoryWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param CategoryRect:func
 * @text JS: X, Y, W, H
 * @parent CategoryWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._dummyWindow.y;\nconst rows = 1;\nconst width = Graphics.boxWidth;\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param SellWindow
 * @text Sell Window
 *
 * @param SellBgType:num
 * @text Background Type
 * @parent SellWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param SellRect:func
 * @text JS: X, Y, W, H
 * @parent SellWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._categoryWindow.y + this._categoryWindow.height;\nconst width = Graphics.boxWidth;\nconst height =\n    this.mainAreaHeight() -\n    this._commandWindow.height -\n    this._categoryWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Name Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~NameMenu:
 *
 * @param EditWindow
 * @text Edit Window
 *
 * @param EditBgType:num
 * @text Background Type
 * @parent EditWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param EditRect:func
 * @text JS: X, Y, W, H
 * @parent EditWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 9;\nconst inputWindowHeight = this.calcWindowHeight(rows, true);\nconst padding = $gameSystem.windowPadding();\nconst width = 600;\nconst height = Math.min(ImageManager.faceHeight + padding * 2, this.mainAreaHeight() - inputWindowHeight);\nconst x = (Graphics.boxWidth - width) / 2;\nconst y = (this.mainAreaHeight() - (height + inputWindowHeight)) / 2 + this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param InputWindow
 * @text Input Window
 *
 * @param InputBgType:num
 * @text Background Type
 * @parent InputWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param InputRect:func
 * @text JS: X, Y, W, H
 * @parent InputWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = this._editWindow.x;\nconst y = this._editWindow.y + this._editWindow.height;\nconst rows = 9;\nconst width = this._editWindow.width;\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Title Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Title:
 *
 * @param TitleScreen
 * @text Title Screen
 *
 * @param DocumentTitleFmt:str
 * @text Document Title Format
 * @parent TitleScreen
 * @desc Format to display text in document title.
 * %1 - Main Title, %2 - Subtitle, %3 - Version
 * @default %1: %2 - Version %3
 *
 * @param Subtitle:str
 * @text Subtitle
 * @parent TitleScreen
 * @desc Subtitle to be displayed under the title name.
 * @default Subtitle
 *
 * @param Version:str
 * @text Version
 * @parent TitleScreen
 * @desc Version to be display in the title screen corner.
 * @default 0.00
 *
 * @param drawGameTitle:func
 * @text JS: Draw Title
 * @type note
 * @parent TitleScreen
 * @desc Code used to draw the game title.
 * @default "const x = 20;\nconst y = Graphics.height / 4;\nconst maxWidth = Graphics.width - x * 2;\nconst text = $dataSystem.gameTitle;\nconst bitmap = this._gameTitleSprite.bitmap;\nbitmap.fontFace = $gameSystem.mainFontFace();\nbitmap.outlineColor = \"black\";\nbitmap.outlineWidth = 8;\nbitmap.fontSize = 72;\nbitmap.drawText(text, x, y, maxWidth, 48, \"center\");"
 *
 * @param drawGameSubtitle:func
 * @text JS: Draw Subtitle
 * @type note
 * @parent TitleScreen
 * @desc Code used to draw the game subtitle.
 * @default "const x = 20;\nconst y = Graphics.height / 4 + 72;\nconst maxWidth = Graphics.width - x * 2;\nconst text = Scene_Title.subtitle;\nconst bitmap = this._gameTitleSprite.bitmap;\nbitmap.fontFace = $gameSystem.mainFontFace();\nbitmap.outlineColor = \"black\";\nbitmap.outlineWidth = 6;\nbitmap.fontSize = 48;\nbitmap.drawText(text, x, y, maxWidth, 48, \"center\");"
 *
 * @param drawGameVersion:func
 * @text JS: Draw Version
 * @type note
 * @parent TitleScreen
 * @desc Code used to draw the game version.
 * @default "const bitmap = this._gameTitleSprite.bitmap;\nconst x = 0;\nconst y = Graphics.height - 20;\nconst width = Math.round(Graphics.width / 4);\nconst height = 20;\nconst c1 = ColorManager.dimColor1();\nconst c2 = ColorManager.dimColor2();\nconst text = 'Version ' + Scene_Title.version;\nbitmap.gradientFillRect(x, y, width, height, c1, c2);\nbitmap.fontFace = $gameSystem.mainFontFace();\nbitmap.outlineColor = \"black\";\nbitmap.outlineWidth = 3;\nbitmap.fontSize = 16;\nbitmap.drawText(text, x + 4, y, Graphics.width, height, \"left\");"
 *
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent TitleScreen
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const offsetX = $dataSystem.titleCommandWindow.offsetX;\nconst offsetY = $dataSystem.titleCommandWindow.offsetY;\nconst rows = this.commandWindowRows();\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = (Graphics.boxWidth - width) / 2 + offsetX;\nconst y = Graphics.boxHeight - height - 96 + offsetY;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ButtonFadeSpeed:num
 * @text Button Fade Speed
 * @parent TitleScreen
 * @type number
 * @min 1
 * @max 255
 * @desc Speed at which the buttons fade in at (1-255).
 * @default 4
 *
 */
/* ----------------------------------------------------------------------------
 * Parameter Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Param:
 *
 * @param DisplayedParams:arraystr
 * @text Displayed Parameters
 * @type combo[]
 * @option MaxHP
 * @option MaxMP
 * @option ATK
 * @option DEF
 * @option MAT
 * @option MDF
 * @option AGI
 * @option LUK
 * @option HIT
 * @option EVA
 * @option CRI
 * @option CEV
 * @option MEV
 * @option MRF
 * @option CNT
 * @option HRG
 * @option MRG
 * @option TRG
 * @option TGR
 * @option GRD
 * @option REC
 * @option PHA
 * @option MCR
 * @option TCR
 * @option PDR
 * @option MDR
 * @option FDR
 * @option EXR
 * @desc A list of the parameters that will be displayed in-game.
 * @default ["ATK","DEF","MAT","MDF","AGI","LUK"]
 *
 * @param ExtDisplayedParams:arraystr
 * @text Extended Parameters
 * @parent DisplayedParams:arraystr
 * @type combo[]
 * @option MaxHP
 * @option MaxMP
 * @option ATK
 * @option DEF
 * @option MAT
 * @option MDF
 * @option AGI
 * @option LUK
 * @option HIT
 * @option EVA
 * @option CRI
 * @option CEV
 * @option MEV
 * @option MRF
 * @option CNT
 * @option HRG
 * @option MRG
 * @option TRG
 * @option TGR
 * @option GRD
 * @option REC
 * @option PHA
 * @option MCR
 * @option TCR
 * @option PDR
 * @option MDR
 * @option FDR
 * @option EXR
 * @desc The list shown in extended scenes (for other VisuStella plugins).
 * @default ["MaxHP","MaxMP","ATK","DEF","MAT","MDF","AGI","LUK"]
 *
 * @param BasicParameters
 * @text Basic Parameters
 *
 * @param ShowActorLevel:eval
 * @text Show Actor Level?
 * @parent BasicParameters
 * @type boolean
 * @on Show
 * @off Don't Show
 * @desc Show the actor level when displaying actors?
 * Affects for most windows in-game.
 * @default true
 *
 * @param ConvertToBase:eval
 * @text Convert JS To Base?
 * @parent BasicParameters
 * @type boolean
 * @on Convert
 * @off Don't
 * @desc Automatically convert <JS param Plus/Rate/Flat: code>
 * to use base parameters to prevent infinite loops.
 * @default true
 *
 * @param CrisisRate:num
 * @text HP Crisis Rate
 * @parent BasicParameters
 * @desc HP Ratio at which a battler can be considered in crisis mode.
 * @default 0.25
 *
 * @param BasicParameterFormula:func
 * @text JS: Formula
 * @parent BasicParameters
 * @type note
 * @desc Formula used to determine the total value all 8 basic parameters: MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, LUK.
 * @default "// Determine the variables used in this calculation.\nlet paramId = arguments[0];\nlet base = this.paramBase(paramId);\nlet plus = this.paramPlus(paramId);\nlet paramRate = this.paramRate(paramId);\nlet buffRate = this.paramBuffRate(paramId);\nlet flatBonus = this.paramFlatBonus(paramId);\n\n// Formula to determine total parameter value.\nlet value = (base + plus) * paramRate * buffRate + flatBonus;\n\n// Determine the limits\nconst maxValue = this.paramMax(paramId);\nconst minValue = this.paramMin(paramId);\n\n// Final value\nreturn Math.round(value.clamp(minValue, maxValue));"
 *
 * @param BasicParamCaps
 * @text Parameter Caps
 * @parent BasicParameters
 *
 * @param BasicActorParamCaps
 * @text Actors
 * @parent BasicParamCaps
 *
 * @param BasicActorParamMax0:str
 * @text MaxHP Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine MaxHP cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 9999
 *
 * @param BasicActorParamMax1:str
 * @text MaxMP Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine MaxMP cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 9999
 *
 * @param BasicActorParamMax2:str
 * @text ATK Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine ATK cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax3:str
 * @text DEF Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine DEF cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax4:str
 * @text MAT Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine MAT cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax5:str
 * @text MDF Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine MDF cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax6:str
 * @text AGI Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine AGI cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax7:str
 * @text LUK Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine LUK cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamCaps
 * @text Enemies
 * @parent BasicParamCaps
 *
 * @param BasicEnemyParamMax0:str
 * @text MaxHP Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine MaxHP cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999999
 *
 * @param BasicEnemyParamMax1:str
 * @text MaxMP Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine MaxMP cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 9999
 *
 * @param BasicEnemyParamMax2:str
 * @text ATK Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine ATK cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax3:str
 * @text DEF Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine DEF cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax4:str
 * @text MAT Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine MAT cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax5:str
 * @text MDF Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine MDF cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax6:str
 * @text AGI Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine AGI cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax7:str
 * @text LUK Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine LUK cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param XParameters
 * @text X Parameters
 *
 * @param XParameterFormula:func
 * @text JS: Formula
 * @parent XParameters
 * @type note
 * @desc Formula used to determine the total value all 10 X parameters: HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, TRG.
 * @default "// Determine the variables used in this calculation.\nlet xparamId = arguments[0];\nlet base = this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);\nlet plus = this.xparamPlus(xparamId);\nlet paramRate = this.xparamRate(xparamId);\nlet flatBonus = this.xparamFlatBonus(xparamId);\n\n// Formula to determine total parameter value.\nlet value = (base + plus) * paramRate + flatBonus;\n\n// Final value\nreturn value;"
 *
 * @param XParamVocab
 * @text Vocabulary
 * @parent XParameters
 *
 * @param XParamVocab0:str
 * @text HIT
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Hit
 *
 * @param XParamVocab1:str
 * @text EVA
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Evasion
 *
 * @param XParamVocab2:str
 * @text CRI
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Crit.Rate
 *
 * @param XParamVocab3:str
 * @text CEV
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Crit.Evade
 *
 * @param XParamVocab4:str
 * @text MEV
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Magic Evade
 *
 * @param XParamVocab5:str
 * @text MRF
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Magic Reflect
 *
 * @param XParamVocab6:str
 * @text CNT
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Counter
 *
 * @param XParamVocab7:str
 * @text HRG
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default HP Regen
 *
 * @param XParamVocab8:str
 * @text MRG
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default MP Regen
 *
 * @param XParamVocab9:str
 * @text TRG
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default TP Regen
 *
 * @param SParameters
 * @text S Parameters
 *
 * @param SParameterFormula:func
 * @text JS: Formula
 * @parent SParameters
 * @type note
 * @desc Formula used to determine the total value all 10 S parameters: TGR, GRD, REC, PHA, MCR, TCR, PDR, MDR, FDR, EXR.
 * @default "// Determine the variables used in this calculation.\nlet sparamId = arguments[0];\nlet base = this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);\nlet plus = this.sparamPlus(sparamId);\nlet paramRate = this.sparamRate(sparamId);\nlet flatBonus = this.sparamFlatBonus(sparamId);\n\n// Formula to determine total parameter value.\nlet value = (base + plus) * paramRate + flatBonus;\n\n// Final value\nreturn value;"
 *
 * @param SParamVocab
 * @text Vocabulary
 * @parent SParameters
 *
 * @param SParamVocab0:str
 * @text TGR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Aggro
 *
 * @param SParamVocab1:str
 * @text GRD
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Guard
 *
 * @param SParamVocab2:str
 * @text REC
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Recovery
 *
 * @param SParamVocab3:str
 * @text PHA
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Item Effect
 *
 * @param SParamVocab4:str
 * @text MCR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default MP Cost
 *
 * @param SParamVocab5:str
 * @text TCR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default TP Charge
 *
 * @param SParamVocab6:str
 * @text PDR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Physical DMG
 *
 * @param SParamVocab7:str
 * @text MDR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Magical DMG
 *
 * @param SParamVocab8:str
 * @text FDR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Floor DMG
 *
 * @param SParamVocab9:str
 * @text EXR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default EXP Gain
 *
 * @param Icons
 * @text Icons
 *
 * @param DrawIcons:eval
 * @text Draw Icons?
 * @parent Icons
 * @type boolean
 * @on Draw
 * @off Don't Draw
 * @desc Draw icons next to parameter names?
 * @default true
 *
 * @param IconParam0:str
 * @text MaxHP
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 84
 *
 * @param IconParam1:str
 * @text MaxMP
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 165
 *
 * @param IconParam2:str
 * @text ATK
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 76
 *
 * @param IconParam3:str
 * @text DEF
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 81
 *
 * @param IconParam4:str
 * @text MAT
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 101
 *
 * @param IconParam5:str
 * @text MDF
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 133
 *
 * @param IconParam6:str
 * @text AGI
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 140
 *
 * @param IconParam7:str
 * @text LUK
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 87
 *
 * @param IconXParam0:str
 * @text HIT
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 102
 *
 * @param IconXParam1:str
 * @text EVA
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 82
 *
 * @param IconXParam2:str
 * @text CRI
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 78
 *
 * @param IconXParam3:str
 * @text CEV
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 82
 *
 * @param IconXParam4:str
 * @text MEV
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 171
 *
 * @param IconXParam5:str
 * @text MRF
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 222
 *
 * @param IconXParam6:str
 * @text CNT
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 77
 *
 * @param IconXParam7:str
 * @text HRG
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 72
 *
 * @param IconXParam8:str
 * @text MRG
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 72
 *
 * @param IconXParam9:str
 * @text TRG
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 72
 *
 * @param IconSParam0:str
 * @text TGR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 5
 *
 * @param IconSParam1:str
 * @text GRD
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 128
 *
 * @param IconSParam2:str
 * @text REC
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 72
 *
 * @param IconSParam3:str
 * @text PHA
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 176
 *
 * @param IconSParam4:str
 * @text MCR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 165
 *
 * @param IconSParam5:str
 * @text TCR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 164
 *
 * @param IconSParam6:str
 * @text PDR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 76
 *
 * @param IconSParam7:str
 * @text MDR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 79
 *
 * @param IconSParam8:str
 * @text FDR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 141
 *
 * @param IconSParam9:str
 * @text EXR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 73
 *
 */
/* ----------------------------------------------------------------------------
 * Commands Struct
 * ----------------------------------------------------------------------------
 */
/*~struct~Command:
 *
 * @param Symbol:str
 * @text Symbol
 * @desc The symbol used for this command.
 * @default Symbol
 *
 * @param TextStr:str
 * @text STR: Text
 * @desc Displayed text used for this title command.
 * If this has a value, ignore the JS: Text version.
 * @default Untitled
 *
 * @param TextJS:func
 * @text JS: Text
 * @type note
 * @desc JavaScript code used to determine string used for the displayed name.
 * @default "return 'Text';"
 *
 * @param ShowJS:func
 * @text JS: Show
 * @type note
 * @desc JavaScript code used to determine if the item is shown or not.
 * @default "return true;"
 *
 * @param EnableJS:func
 * @text JS: Enable
 * @type note
 * @desc JavaScript code used to determine if the item is enabled or not.
 * @default "return true;"
 *
 * @param ExtJS:func
 * @text JS: Ext
 * @type note
 * @desc JavaScript code used to determine any ext data that should be added.
 * @default "return null;"
 *
 * @param CallHandlerJS:func
 * @text JS: Run Code
 * @type note
 * @desc JavaScript code that runs once this command is selected.
 * @default ""
 *
 */
/* ----------------------------------------------------------------------------
 * Title Picture Buttons
 * ----------------------------------------------------------------------------
 */
/*~struct~TitlePictureButton:
 *
 * @param PictureFilename:str
 * @text Picture's Filename
 * @type file
 * @dir img/pictures/
 * @desc Filename used for the picture.
 * @default 
 *
 * @param ButtonURL:str
 * @text Button URL
 * @desc URL for the button to go to upon being clicked.
 * @default https://www.google.com/
 *
 * @param PositionJS:func
 * @text JS: Position
 * @type note
 * @desc JavaScript code that helps determine the button's Position.
 * @default "this.x = Graphics.width - this.bitmap.width - 20;\nthis.y = Graphics.height - this.bitmap.height - 20;"
 *
 * @param OnLoadJS:func
 * @text JS: On Load
 * @type note
 * @desc JavaScript code that runs once this button bitmap is loaded.
 * @default "this.opacity = 0;\nthis.visible = true;"
 *
 * @param CallHandlerJS:func
 * @text JS: Run Code
 * @type note
 * @desc JavaScript code that runs once this button is pressed.
 * @default "const url = this._data.ButtonURL;\nVisuMZ.openURL(url);"
 *
 */
/* ----------------------------------------------------------------------------
 * UI Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~UI:
 *
 * @param UIArea
 * @text UI Area
 *
 * @param FadeSpeed:num
 * @text Fade Speed
 * @parent UIArea
 * @desc Default fade speed for transitions.
 * @default 24
 *
 * @param BoxMargin:num
 * @text Box Margin
 * @parent UIArea
 * @type number
 * @min 0
 * @desc Set the margin in pixels for the screen borders.
 * Default: 4
 * @default 4
 *
 * @param CommandWidth:num
 * @text Command Window Width
 * @parent UIArea
 * @type number
 * @min 1
 * @desc Sets the width for standard Command Windows.
 * Default: 240
 * @default 240
 *
 * @param BottomHelp:eval
 * @text Bottom Help Window
 * @parent UIArea
 * @type boolean
 * @on Bottom
 * @off Top
 * @desc Put the Help Window at the bottom of the screen?
 * @default false
 *
 * @param RightMenus:eval
 * @text Right Aligned Menus
 * @parent UIArea
 * @type boolean
 * @on Right
 * @off Left
 * @desc Put most command windows to the right side of the screen.
 * @default true
 *
 * @param ShowButtons:eval
 * @text Show Buttons
 * @parent UIArea
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show clickable buttons in your game?
 * This will affect all buttons.
 * @default true
 *
 * @param cancelShowButton:eval
 * @text Show Cancel Button
 * @parent ShowButtons:eval
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show cancel button?
 * If 'Show Buttons' is false, this will be hidden.
 * @default true
 *
 * @param menuShowButton:eval
 * @text Show Menu Button
 * @parent ShowButtons:eval
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show main menu button from the map scene?
 * If 'Show Buttons' is false, this will be hidden.
 * @default true
 *
 * @param pagedownShowButton:eval
 * @text Show Page Up/Down
 * @parent ShowButtons:eval
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show page up/down buttons?
 * If 'Show Buttons' is false, this will be hidden.
 * @default true
 *
 * @param numberShowButton:eval
 * @text Show Number Buttons
 * @parent ShowButtons:eval
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show number adjustment buttons?
 * If 'Show Buttons' is false, this will be hidden.
 * @default true
 *
 * @param ButtonHeight:num
 * @text Button Area Height
 * @parent UIArea
 * @type number
 * @min 1
 * @desc Sets the height for the button area.
 * Default: 52
 * @default 52
 *
 * @param BottomButtons:eval
 * @text Bottom Buttons
 * @parent UIArea
 * @type boolean
 * @on Bottom
 * @off Top
 * @desc Put the buttons at the bottom of the screen?
 * @default false
 *
 * @param SideButtons:eval
 * @text Side Buttons
 * @parent UIArea
 * @type boolean
 * @on Side
 * @off Normal
 * @desc Push buttons to the side of the UI if there is room.
 * @default true
 *
 * @param StateIconsNonFrame:eval
 * @text State Icons Non-Frame
 * @parent UIArea
 * @type boolean
 * @on Non-Frame
 * @off Normal
 * @desc Replace sprite frame system for non-frame.
 * Better for any instances where icons are zoomed.
 * @default true
 *
 * @param MenuObjects
 * @text Menu Objects
 *
 * @param LvExpGauge:eval
 * @text Level -> EXP Gauge
 * @parent MenuObjects
 * @type boolean
 * @on Draw Gauge
 * @off Keep As Is
 * @desc Draw an EXP Gauge under the drawn level.
 * @default true
 *
 * @param ParamArrow:str
 * @text Parameter Arrow
 * @parent MenuObjects
 * @desc The arrow used to show changes in the parameter values.
 * @default →
 *
 * @param TextCodeSupport
 * @text Text Code Support
 *
 * @param TextCodeClassNames:eval
 * @text Class Names
 * @parent TextCodeSupport
 * @type boolean
 * @on Suport Text Codes
 * @off Normal Text
 * @desc Make class names support text codes?
 * @default true
 *
 * @param TextCodeNicknames:eval
 * @text Nicknames
 * @parent TextCodeSupport
 * @type boolean
 * @on Suport Text Codes
 * @off Normal Text
 * @desc Make nicknames support text codes?
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Window Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Window:
 *
 * @param WindowDefaults
 * @text Defaults
 *
 * @param EnableMasking:eval
 * @text Enable Masking
 * @parent WindowDefaults
 * @type boolean
 * @on Masking On
 * @off Masking Off
 * @desc Enable window masking (windows hide other windows behind 
 * them)? WARNING: Turning it on can obscure data.
 * @default false
 *
 * @param CorrectSkinBleeding:eval
 * @text Correct Skin Bleed
 * @parent WindowDefaults
 * @type boolean
 * @on Correct
 * @off Don't Correct
 * @desc Corrects window skin bleeding bug when used with higher
 * screen resolutions?
 * @default true
 *
 * @param LineHeight:num
 * @text Line Height
 * @parent WindowDefaults
 * @desc Default line height used for standard windows.
 * Default: 36. Avoid using odd numbers.
 * @default 36
 *
 * @param ItemPadding:num
 * @text Item Padding
 * @parent WindowDefaults
 * @desc Default line padding used for standard windows.
 * Default: 8. Avoid using odd numbers.
 * @default 8
 *
 * @param BackOpacity:num
 * @text Back Opacity
 * @parent WindowDefaults
 * @desc Default back opacity used for standard windows.
 * Default: 192
 * @default 192
 *
 * @param TranslucentOpacity:num
 * @text Translucent Opacity
 * @parent WindowDefaults
 * @desc Default translucent opacity used for standard windows.
 * Default: 160
 * @default 160
 *
 * @param OpenSpeed:num
 * @text Window Opening Speed
 * @parent WindowDefaults
 * @desc Default open speed used for standard windows.
 * Default: 32 (Use a number between 0-255)
 * @default 32
 * @default 24
 *
 * @param ColSpacing:num
 * @text Column Spacing
 * @parent WindowDefaults
 * @desc Default column spacing for selectable windows.
 * Default: 8
 * @default 8
 *
 * @param RowSpacing:num
 * @text Row Spacing
 * @parent WindowDefaults
 * @desc Default row spacing for selectable windows.
 * Default: 4
 * @default 4
 * 
 * @param ScrollBar
 * @text Scroll Bar
 *
 * @param ShowScrollBar:eval
 * @text Show Scroll Bar?
 * @parent ScrollBar
 * @type boolean
 * @on Show Scroll Bar
 * @off Don't Show
 * @desc Show the scroll bar for scrollable windows?
 * @default true
 *
 * @param BarThickness:num
 * @text Thickness
 * @parent ScrollBar
 * @type number
 * @min 1
 * @desc How thick do you want the scroll bar to be?
 * @default 2
 *
 * @param BarOffset:num
 * @text Offset
 * @parent ScrollBar
 * @desc How much do you want to offset the scroll bar by?
 * @default +2
 *
 * @param BarBodyColor:str
 * @text Bar Body Color
 * @parent ScrollBar
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 0
 *
 * @param OffBarColor:str
 * @text Off Bar Color
 * @parent ScrollBar
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 7
 *
 * @param OffBarOpacity:num
 * @text Off Bar Opacity
 * @parent ScrollBar
 * @type number
 * @min 1
 * @max 255
 * @desc What opacity value do you want the off bar opacity
 * to be? Use a number between 0 and 255.
 * @default 128
 * 
 * @param SelectableItems
 * @text Selectable Items
 *
 * @param ShowItemBackground:eval
 * @text Show Background?
 * @parent SelectableItems
 * @type boolean
 * @on Show Backgrounds
 * @off No Backgrounds
 * @desc Selectable menu items have dark boxes behind them. Show them?
 * @default true
 *
 * @param ItemHeight:num
 * @text Item Height Padding
 * @parent SelectableItems
 * @desc Default padding for selectable items.
 * Default: 8. Avoid using odd numbers.
 * @default 8
 *
 * @param DrawItemBackgroundJS:func
 * @text JS: Draw Background
 * @parent SelectableItems
 * @type note
 * @desc Code used to draw the background rectangle behind clickable menu objects
 * @default "const rect = arguments[0];\nconst c1 = ColorManager.itemBackColor1();\nconst c2 = ColorManager.itemBackColor2();\nconst x = rect.x;\nconst y = rect.y;\nconst w = rect.width;\nconst h = rect.height;\nthis.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);\nthis.contentsBack.strokeRect(x, y, w, h, c1);"
 *
 * @param TextPopup
 * @text Text Popup Window
 *
 * @param DurationPerChat:num
 * @text Duration Per Text
 * @parent TextPopup
 * @desc What is the increase in duration per text character?
 * @default 1.5
 *
 * @param MinDuration:num
 * @text Minimum Duration
 * @parent TextPopup
 * @type number
 * @min 1
 * @desc Minimum duration for window to stay on the screen.
 * @default 90
 *
 * @param MaxDuration:num
 * @text Maximum Duration
 * @parent TextPopup
 * @type number
 * @min 1
 * @desc Maximum duration for window to stay on the screen.
 * @default 300
 * 
 */
/* ----------------------------------------------------------------------------
 * Screen Resolution Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ScreenResolution:
 *
 * @param Maps
 * 
 * @param AutoScrollLockX:eval
 * @text Scroll Lock Small X?
 * @parent Maps
 * @type boolean
 * @on Auto-Lock
 * @off Keep As Is
 * @desc Automatically scroll lock X scrolling if the map is too small?
 * @default true
 * 
 * @param AutoScrollLockY:eval
 * @text Scroll Lock Small Y?
 * @parent Maps
 * @type boolean
 * @on Auto-Lock
 * @off Keep As Is
 * @desc Automatically scroll lock Y scrolling if the map is too small?
 * @default true
 * 
 * @param DisplayLockX:num
 * @text Locked Display X?
 * @parent Maps
 * @desc What display X value do you want for auto-scroll locked
 * maps? Use a number between 0 and 1 for best results.
 * @default 0.15625
 * 
 * @param DisplayLockY:num
 * @text Locked Display Y?
 * @parent Maps
 * @desc What display Y value do you want for auto-scroll locked
 * maps? Use a number between 0 and 1 for best results.
 * @default 0.00000
 * 
 * @param Troops
 *
 * @param RepositionActors:eval
 * @text Reposition Actors
 * @parent Troops
 * @type boolean
 * @on Reposition
 * @off Keep As Is
 * @desc Update the position of actors in battle if the screen resolution has changed. Ignore if using Battle Core.
 * @default true
 *
 * @param RepositionEnemies:eval
 * @text Reposition Enemies
 * @parent Troops
 * @type boolean
 * @on Reposition
 * @off Keep As Is
 * @desc Update the position of enemies in battle if the screen resolution has changed.
 * @default true
 *
 * @param RepositionEnemies130:eval
 * @text For MZ 1.3.0+?
 * @parent RepositionEnemies:eval
 * @type boolean
 * @on Reposition
 * @off Keep As Is
 * @desc Both this parameter and its parent parameter need to be on when using RPG Maker MZ 1.3.0+.
 * @default false
 *
 */
/* ----------------------------------------------------------------------------
 * Screen Shake Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ScreenShake:
 *
 * @param DefaultStyle:str
 * @text Default Style
 * @type select
 * @option Original
 * @value original
 * @option Random
 * @value random
 * @option Horizontal
 * @value horizontal
 * @option Vertical
 * @value vertical
 * @desc The default style used for screen shakes.
 * @default random
 *
 * @param originalJS:func
 * @text JS: Original Style
 * @type note
 * @desc This code gives you control over screen shake for this
 * screen shake style.
 * @default "// Calculation\nthis.x += Math.round($gameScreen.shake());"
 *
 * @param randomJS:func
 * @text JS: Random Style
 * @type note
 * @desc This code gives you control over screen shake for this
 * screen shake style.
 * @default "// Calculation\n// Original Formula by Aries of Sheratan\nconst power = $gameScreen._shakePower * 0.75;\nconst speed = $gameScreen._shakeSpeed * 0.60;\nconst duration = $gameScreen._shakeDuration;\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);"
 *
 * @param horzJS:func
 * @text JS: Horizontal Style
 * @type note
 * @desc This code gives you control over screen shake for this
 * screen shake style.
 * @default "// Calculation\n// Original Formula by Aries of Sheratan\nconst power = $gameScreen._shakePower * 0.75;\nconst speed = $gameScreen._shakeSpeed * 0.60;\nconst duration = $gameScreen._shakeDuration;\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);"
 *
 * @param vertJS:func
 * @text JS: Vertical Style
 * @type note
 * @desc This code gives you control over screen shake for this
 * screen shake style.
 * @default "// Calculation\n// Original Formula by Aries of Sheratan\nconst power = $gameScreen._shakePower * 0.75;\nconst speed = $gameScreen._shakeSpeed * 0.60;\nconst duration = $gameScreen._shakeDuration;\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);"
 *
 */
/* ----------------------------------------------------------------------------
 * Custom Parameter Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~CustomParam:
 *
 * @param ParamName:str
 * @text Parameter Name
 * @desc What's the parameter's name?
 * Used for VisuStella MZ menus.
 * @default Untitled
 *
 * @param Abbreviation:str
 * @text Abbreviation
 * @parent ParamName:str
 * @desc What abbreviation do you want to use for the parameter?
 * Do not use special characters. Avoid numbers if possible.
 * @default unt
 *
 * @param Icon:num
 * @text Icon
 * @parent ParamName:str
 * @desc What icon do you want to use to represent this parameter?
 * Used for VisuStella MZ menus.
 * @default 160
 *
 * @param Type:str
 * @text Type
 * @parent ParamName:str
 * @type select
 * @option Integer (Whole Numbers Only)
 * @value integer
 * @option Float (Decimals are Allowed)
 * @value float
 * @desc What kind of number value will be returned with this parameter?
 * @default integer
 *
 * @param ValueJS:json
 * @text JS: Value
 * @type note
 * @desc Run this code when this parameter is to be returned.
 * @default "// Declare Constants\nconst user = this;\n\n// Calculations\nreturn 1;"
 *
 */
/* ----------------------------------------------------------------------------
 * Show Picture Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ShowPicture:
 * 
 * @param Position
 *
 * @param Origin:num
 * @text Origin
 * @parent Position
 * @type select
 * @option 0 - Upper Left
 * @value 0
 * @option 1 - Center
 * @value 1
 * @desc What is the origin of this picture icon?
 * @default 0
 *
 * @param PositionX:eval
 * @text Position X
 * @parent Position
 * @desc X coordinate of the picture.
 * You may use JavaScript code.
 * @default 0
 *
 * @param PositionY:eval
 * @text Position Y
 * @parent Position
 * @desc Y coordinate of the picture.
 * You may use JavaScript code.
 * @default 0
 * 
 * @param Scale
 *
 * @param ScaleX:eval
 * @text Width %
 * @parent Scale
 * @desc Horizontal scale of the picture.
 * You may use JavaScript code.
 * @default 100
 *
 * @param ScaleY:eval
 * @text Height %
 * @parent Scale
 * @desc Vertical scale of the picture.
 * You may use JavaScript code.
 * @default 100
 * 
 * @param Blend
 *
 * @param Opacity:eval
 * @text Opacity
 * @parent Blend
 * @desc Insert a number to determine opacity level. Use a
 * number between 0 and 255. You may use JavaScript code.
 * @default 255
 *
 * @param BlendMode:num
 * @text Blend Mode
 * @parent Blend
 * @type select
 * @option 0 - Normal
 * @value 0
 * @option 1 - Additive
 * @value 1
 * @option 2 - Multiply
 * @value 2
 * @option 3 - Screen
 * @value 3
 * @desc What kind of blend mode do you wish to apply to the picture?
 * @default 0
 *
 */
/* ----------------------------------------------------------------------------
 * JS Quick Function Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~jsQuickFunc:
 *
 * @param FunctionName:str
 * @text Function Name
 * @desc The function's name in the global namespace.
 * Will not overwrite functions/variables of the same name.
 * @default Untitled
 *
 * @param CodeJS:json
 * @text JS: Code
 * @type note
 * @desc Run this code when using the function.
 * @default "// Insert this as a function anywhere you can input code\n// such as Script Calls or Conditional Branch Scripts.\n\n// Process Code\n"
 *
 */
//=============================================================================

const _0x100070=_0x7e7c;(function(_0x1463de,_0x428c66){const _0x3d72b8=_0x7e7c,_0x496bea=_0x1463de();while(!![]){try{const _0x8ba5fe=-parseInt(_0x3d72b8(0x755))/0x1*(-parseInt(_0x3d72b8(0x848))/0x2)+-parseInt(_0x3d72b8(0x883))/0x3*(-parseInt(_0x3d72b8(0xcd))/0x4)+parseInt(_0x3d72b8(0x676))/0x5*(parseInt(_0x3d72b8(0x7a6))/0x6)+parseInt(_0x3d72b8(0x350))/0x7+-parseInt(_0x3d72b8(0x6eb))/0x8+-parseInt(_0x3d72b8(0x367))/0x9*(-parseInt(_0x3d72b8(0x857))/0xa)+-parseInt(_0x3d72b8(0x3a8))/0xb;if(_0x8ba5fe===_0x428c66)break;else _0x496bea['push'](_0x496bea['shift']());}catch(_0x3b3e47){_0x496bea['push'](_0x496bea['shift']());}}}(_0x3196,0x360a6));var label=_0x100070(0x785),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x100070(0x247)](function(_0x19b556){const _0x1874cb=_0x100070;return _0x19b556['status']&&_0x19b556[_0x1874cb(0x1f3)][_0x1874cb(0x4c7)]('['+label+']');})[0x0];function _0x7e7c(_0x185420,_0x22fb6f){const _0x319658=_0x3196();return _0x7e7c=function(_0x7e7cf7,_0x946f8b){_0x7e7cf7=_0x7e7cf7-0xb5;let _0x447925=_0x319658[_0x7e7cf7];return _0x447925;},_0x7e7c(_0x185420,_0x22fb6f);}VisuMZ[label][_0x100070(0x598)]=VisuMZ[label]['Settings']||{},VisuMZ['ConvertParams']=function(_0x5307a6,_0x139d73){const _0x2e7b9d=_0x100070;for(const _0x533c86 in _0x139d73){if(_0x533c86[_0x2e7b9d(0x4aa)](/(.*):(.*)/i)){const _0x35ff9a=String(RegExp['$1']),_0x385c93=String(RegExp['$2'])[_0x2e7b9d(0x4f4)]()['trim']();let _0xbcf0a6,_0x50ac28,_0x34bd1d;switch(_0x385c93){case'NUM':_0xbcf0a6=_0x139d73[_0x533c86]!==''?Number(_0x139d73[_0x533c86]):0x0;break;case'ARRAYNUM':_0x50ac28=_0x139d73[_0x533c86]!==''?JSON[_0x2e7b9d(0x75f)](_0x139d73[_0x533c86]):[],_0xbcf0a6=_0x50ac28[_0x2e7b9d(0x22e)](_0xbdb6ed=>Number(_0xbdb6ed));break;case _0x2e7b9d(0x60e):_0xbcf0a6=_0x139d73[_0x533c86]!==''?eval(_0x139d73[_0x533c86]):null;break;case _0x2e7b9d(0x456):_0x50ac28=_0x139d73[_0x533c86]!==''?JSON[_0x2e7b9d(0x75f)](_0x139d73[_0x533c86]):[],_0xbcf0a6=_0x50ac28['map'](_0x30be92=>eval(_0x30be92));break;case _0x2e7b9d(0x142):_0xbcf0a6=_0x139d73[_0x533c86]!==''?JSON[_0x2e7b9d(0x75f)](_0x139d73[_0x533c86]):'';break;case _0x2e7b9d(0x17e):_0x50ac28=_0x139d73[_0x533c86]!==''?JSON[_0x2e7b9d(0x75f)](_0x139d73[_0x533c86]):[],_0xbcf0a6=_0x50ac28[_0x2e7b9d(0x22e)](_0x522406=>JSON[_0x2e7b9d(0x75f)](_0x522406));break;case _0x2e7b9d(0x485):_0xbcf0a6=_0x139d73[_0x533c86]!==''?new Function(JSON[_0x2e7b9d(0x75f)](_0x139d73[_0x533c86])):new Function(_0x2e7b9d(0x391));break;case _0x2e7b9d(0x2a2):_0x50ac28=_0x139d73[_0x533c86]!==''?JSON[_0x2e7b9d(0x75f)](_0x139d73[_0x533c86]):[],_0xbcf0a6=_0x50ac28[_0x2e7b9d(0x22e)](_0x2fa7b3=>new Function(JSON['parse'](_0x2fa7b3)));break;case _0x2e7b9d(0x31c):_0xbcf0a6=_0x139d73[_0x533c86]!==''?String(_0x139d73[_0x533c86]):'';break;case _0x2e7b9d(0x1af):_0x50ac28=_0x139d73[_0x533c86]!==''?JSON[_0x2e7b9d(0x75f)](_0x139d73[_0x533c86]):[],_0xbcf0a6=_0x50ac28[_0x2e7b9d(0x22e)](_0x299bcf=>String(_0x299bcf));break;case _0x2e7b9d(0x312):_0x34bd1d=_0x139d73[_0x533c86]!==''?JSON[_0x2e7b9d(0x75f)](_0x139d73[_0x533c86]):{},_0x5307a6[_0x35ff9a]={},VisuMZ[_0x2e7b9d(0x4b1)](_0x5307a6[_0x35ff9a],_0x34bd1d);continue;case _0x2e7b9d(0x1e8):_0x50ac28=_0x139d73[_0x533c86]!==''?JSON[_0x2e7b9d(0x75f)](_0x139d73[_0x533c86]):[],_0xbcf0a6=_0x50ac28['map'](_0x152b16=>VisuMZ['ConvertParams']({},JSON[_0x2e7b9d(0x75f)](_0x152b16)));break;default:continue;}_0x5307a6[_0x35ff9a]=_0xbcf0a6;}}return _0x5307a6;},VisuMZ['CoreEngine']['SceneManager_exit']=SceneManager['exit'],SceneManager[_0x100070(0x2f9)]=function(){const _0x3955e0=_0x100070;VisuMZ[_0x3955e0(0x785)]['SceneManager_exit']['call'](this);if(Utils[_0x3955e0(0x3bf)]>='1.4.4'){if(typeof nw===_0x3955e0(0x132))nw[_0x3955e0(0x52c)]['quit']();}},(_0x3907af=>{const _0x8f145e=_0x100070,_0x607af4=_0x3907af[_0x8f145e(0x554)];for(const _0x973ccb of dependencies){if(!Imported[_0x973ccb]){alert('%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.'['format'](_0x607af4,_0x973ccb)),SceneManager[_0x8f145e(0x2f9)]();break;}}const _0x8cdbd7=_0x3907af[_0x8f145e(0x1f3)];if(_0x8cdbd7[_0x8f145e(0x4aa)](/\[Version[ ](.*?)\]/i)){const _0x2a1f9f=Number(RegExp['$1']);_0x2a1f9f!==VisuMZ[label]['version']&&(alert(_0x8f145e(0x6c2)['format'](_0x607af4,_0x2a1f9f)),SceneManager['exit']());}if(_0x8cdbd7[_0x8f145e(0x4aa)](/\[Tier[ ](\d+)\]/i)){const _0x9df5b1=Number(RegExp['$1']);_0x9df5b1<tier?(alert(_0x8f145e(0x61f)[_0x8f145e(0x4fd)](_0x607af4,_0x9df5b1,tier)),SceneManager['exit']()):tier=Math[_0x8f145e(0x23f)](_0x9df5b1,tier);}VisuMZ[_0x8f145e(0x4b1)](VisuMZ[label][_0x8f145e(0x598)],_0x3907af['parameters']);})(pluginData),((()=>{const _0x48408c=_0x100070;if(VisuMZ[_0x48408c(0x785)][_0x48408c(0x598)][_0x48408c(0x1f9)][_0x48408c(0x89a)]??!![])for(const _0x56d4f2 in $plugins){const _0x36a1ef=$plugins[_0x56d4f2];_0x36a1ef['name'][_0x48408c(0x4aa)](/(.*)\/(.*)/i)&&(_0x36a1ef[_0x48408c(0x554)]=String(RegExp['$2']['trim']()));}})()),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x2eb),_0x3cc215=>{const _0x6dcef=_0x100070;if(!SceneManager[_0x6dcef(0x196)])return;if(!SceneManager[_0x6dcef(0x196)][_0x6dcef(0x3a3)])return;VisuMZ['ConvertParams'](_0x3cc215,_0x3cc215);const _0xd4559a=Math['round'](_0x3cc215[_0x6dcef(0x1e2)]),_0x8b0402=Math[_0x6dcef(0x884)](_0x3cc215[_0x6dcef(0x6ba)]);$gameTemp[_0x6dcef(0x494)](_0xd4559a,_0x8b0402,_0x3cc215[_0x6dcef(0x2a9)],_0x3cc215[_0x6dcef(0x885)],_0x3cc215[_0x6dcef(0x2db)]);}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x7c2),_0x2544e8=>{const _0xcb3dd8=_0x100070;VisuMZ['ConvertParams'](_0x2544e8,_0x2544e8);const _0x1cb6d9=Math[_0xcb3dd8(0x884)](_0x2544e8[_0xcb3dd8(0x41f)])['clamp'](0x0,0x64),_0x290901=AudioManager[_0xcb3dd8(0x347)];_0x290901&&(_0x290901[_0xcb3dd8(0x41f)]=_0x1cb6d9,_0x290901[_0xcb3dd8(0x83e)]=AudioManager[_0xcb3dd8(0x56a)]['seek'](),AudioManager[_0xcb3dd8(0x500)](_0x290901),AudioManager[_0xcb3dd8(0x3b9)](_0x290901,_0x290901[_0xcb3dd8(0x83e)]),AudioManager[_0xcb3dd8(0x56a)]['_startPlaying'](_0x290901[_0xcb3dd8(0x83e)]));}),PluginManager['registerCommand'](pluginData[_0x100070(0x554)],'AudioChangeBgmPitch',_0x41c304=>{const _0x1680ad=_0x100070;VisuMZ['ConvertParams'](_0x41c304,_0x41c304);const _0x256fd6=Math['round'](_0x41c304[_0x1680ad(0x4bd)])[_0x1680ad(0x2d3)](0x32,0x96),_0x59e4a6=AudioManager[_0x1680ad(0x347)];_0x59e4a6&&(_0x59e4a6['pitch']=_0x256fd6,_0x59e4a6[_0x1680ad(0x83e)]=AudioManager['_bgmBuffer'][_0x1680ad(0x820)](),AudioManager['updateBgmParameters'](_0x59e4a6),AudioManager[_0x1680ad(0x3b9)](_0x59e4a6,_0x59e4a6[_0x1680ad(0x83e)]),AudioManager[_0x1680ad(0x56a)][_0x1680ad(0x34d)](_0x59e4a6['pos']));}),PluginManager['registerCommand'](pluginData['name'],'AudioChangeBgmPan',_0x13762f=>{const _0x508157=_0x100070;VisuMZ[_0x508157(0x4b1)](_0x13762f,_0x13762f);const _0xca33d0=Math[_0x508157(0x884)](_0x13762f[_0x508157(0x879)])['clamp'](-0x64,0x64),_0x49e266=AudioManager[_0x508157(0x347)];_0x49e266&&(_0x49e266[_0x508157(0x879)]=_0xca33d0,_0x49e266[_0x508157(0x83e)]=AudioManager['_bgmBuffer']['seek'](),AudioManager[_0x508157(0x500)](_0x49e266),AudioManager[_0x508157(0x3b9)](_0x49e266,_0x49e266[_0x508157(0x83e)]),AudioManager[_0x508157(0x56a)]['_startPlaying'](_0x49e266[_0x508157(0x83e)]));}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],'AudioChangeBgsVolume',_0x2c1696=>{const _0x3aad34=_0x100070;VisuMZ[_0x3aad34(0x4b1)](_0x2c1696,_0x2c1696);const _0x54d334=Math[_0x3aad34(0x884)](_0x2c1696['volume'])['clamp'](0x0,0x64),_0x3e56d3=AudioManager['_currentBgs'];_0x3e56d3&&(_0x3e56d3[_0x3aad34(0x41f)]=_0x54d334,_0x3e56d3[_0x3aad34(0x83e)]=AudioManager[_0x3aad34(0x779)][_0x3aad34(0x820)](),AudioManager[_0x3aad34(0x58a)](_0x3e56d3),AudioManager['playBgs'](_0x3e56d3,_0x3e56d3[_0x3aad34(0x83e)]),AudioManager[_0x3aad34(0x779)][_0x3aad34(0x34d)](_0x3e56d3[_0x3aad34(0x83e)]));}),PluginManager[_0x100070(0x24d)](pluginData['name'],_0x100070(0x715),_0x1255cc=>{const _0x2c187b=_0x100070;VisuMZ[_0x2c187b(0x4b1)](_0x1255cc,_0x1255cc);const _0x318315=Math[_0x2c187b(0x884)](_0x1255cc[_0x2c187b(0x4bd)])[_0x2c187b(0x2d3)](0x32,0x96),_0x584b5a=AudioManager[_0x2c187b(0x14f)];_0x584b5a&&(_0x584b5a['pitch']=_0x318315,_0x584b5a['pos']=AudioManager['_bgsBuffer'][_0x2c187b(0x820)](),AudioManager['updateBgsParameters'](_0x584b5a),AudioManager[_0x2c187b(0x842)](_0x584b5a,_0x584b5a[_0x2c187b(0x83e)]),AudioManager['_bgsBuffer']['_startPlaying'](_0x584b5a[_0x2c187b(0x83e)]));}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x53a),_0x3d638b=>{const _0x220b38=_0x100070;VisuMZ[_0x220b38(0x4b1)](_0x3d638b,_0x3d638b);const _0x328f16=Math['round'](_0x3d638b['pan'])[_0x220b38(0x2d3)](-0x64,0x64),_0x26b869=AudioManager[_0x220b38(0x14f)];_0x26b869&&(_0x26b869[_0x220b38(0x879)]=_0x328f16,_0x26b869[_0x220b38(0x83e)]=AudioManager[_0x220b38(0x779)][_0x220b38(0x820)](),AudioManager[_0x220b38(0x58a)](_0x26b869),AudioManager[_0x220b38(0x842)](_0x26b869,_0x26b869[_0x220b38(0x83e)]),AudioManager[_0x220b38(0x779)][_0x220b38(0x34d)](_0x26b869[_0x220b38(0x83e)]));}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],'DebugConsoleLastControllerID',_0x40a248=>{const _0x564e86=_0x100070;if(!$gameTemp[_0x564e86(0x16d)]())return;const _0x3874ad=Input['getLastUsedGamepadType']();console[_0x564e86(0x4ce)](_0x3874ad);}),PluginManager['registerCommand'](pluginData[_0x100070(0x554)],_0x100070(0x659),_0x11ebab=>{const _0x3ab75b=_0x100070;if(!$gameTemp[_0x3ab75b(0x16d)]())return;if(!Utils[_0x3ab75b(0x4e4)]())return;SceneManager[_0x3ab75b(0x196)]['_active']=![],VisuMZ[_0x3ab75b(0x785)][_0x3ab75b(0x70f)]();}),PluginManager['registerCommand'](pluginData['name'],_0x100070(0x1ad),_0x3ad8d3=>{const _0xef9587=_0x100070;if(!$gameTemp['isPlaytest']())return;if(!Utils[_0xef9587(0x4e4)]())return;SceneManager[_0xef9587(0x196)][_0xef9587(0xef)]=![],VisuMZ[_0xef9587(0x785)][_0xef9587(0x858)]();}),PluginManager[_0x100070(0x24d)](pluginData['name'],_0x100070(0xc9),_0x4a4fa6=>{const _0x20bed1=_0x100070;if(!$gameTemp[_0x20bed1(0x16d)]())return;if(!Utils[_0x20bed1(0x4e4)]())return;if(!$gameMap)return;if($gameMap[_0x20bed1(0x772)]()<=0x0)return;VisuMZ['ConvertParams'](_0x4a4fa6,_0x4a4fa6);const _0x61242c=_0x20bed1(0x830)[_0x20bed1(0x4fd)]($gameMap[_0x20bed1(0x772)]()['padZero'](0x3)),_0x9c9254=VisuMZ['CoreEngine'][_0x20bed1(0x3e2)]($gameMap['mapId']());VisuMZ[_0x20bed1(0x785)][_0x20bed1(0x60c)](_0x9c9254,_0x61242c,!![]);}),PluginManager[_0x100070(0x24d)](pluginData['name'],'ExportCurTroopText',_0x334958=>{const _0x27fdd6=_0x100070;if(!$gameTemp['isPlaytest']())return;if(!Utils[_0x27fdd6(0x4e4)]())return;if(!$gameParty['inBattle']())return;VisuMZ[_0x27fdd6(0x4b1)](_0x334958,_0x334958);const _0x4e508f='Troop%1'[_0x27fdd6(0x4fd)]($gameTroop[_0x27fdd6(0x1cd)]['padZero'](0x4)),_0x5e4aec=VisuMZ[_0x27fdd6(0x785)]['ExtractStrFromTroop']($gameTroop['_troopId']);VisuMZ[_0x27fdd6(0x785)][_0x27fdd6(0x60c)](_0x5e4aec,_0x4e508f,!![]);}),VisuMZ[_0x100070(0x785)]['ExportString']=function(_0x27a710,_0x286451,_0x40612b){const _0x421d27=_0x100070,_0x363310=require('fs');let _0x345bc7=_0x421d27(0x7db)['format'](_0x286451||'0');_0x363310[_0x421d27(0x59a)](_0x345bc7,_0x27a710,_0x52f248=>{const _0x368198=_0x421d27;if(_0x52f248)throw err;else _0x40612b&&alert(_0x368198(0xd4)['format'](_0x345bc7));});},VisuMZ['CoreEngine'][_0x100070(0x70f)]=function(){const _0x231a25=_0x100070,_0x47dd79=[];for(const _0x5b27ed of $dataMapInfos){if(!_0x5b27ed)continue;_0x47dd79[_0x231a25(0x443)](_0x5b27ed['id']);}const _0x538673=_0x47dd79[_0x231a25(0x1ba)]*0x64+Math[_0x231a25(0x5d6)](0x64);alert(_0x231a25(0x11f)['format'](_0x538673)),this[_0x231a25(0x1ec)]=[],this[_0x231a25(0x167)]=$dataMap;for(const _0x2081fe of _0x47dd79){VisuMZ[_0x231a25(0x785)][_0x231a25(0x792)](_0x2081fe);}setTimeout(VisuMZ[_0x231a25(0x785)][_0x231a25(0x4f5)]['bind'](this),_0x538673);},VisuMZ['CoreEngine'][_0x100070(0x792)]=function(_0x3907b9){const _0x3ba623=_0x100070,_0x17a4d4=_0x3ba623(0x76e)[_0x3ba623(0x4fd)](_0x3907b9[_0x3ba623(0x22d)](0x3)),_0x417ea3=new XMLHttpRequest(),_0x2559ca=_0x3ba623(0x129)+_0x17a4d4;_0x417ea3['open'](_0x3ba623(0x27a),_0x2559ca),_0x417ea3[_0x3ba623(0x410)]('application/json'),_0x417ea3[_0x3ba623(0x435)]=()=>this[_0x3ba623(0x827)](_0x417ea3,_0x3907b9,_0x17a4d4,_0x2559ca),_0x417ea3[_0x3ba623(0x565)]=()=>DataManager['onXhrError'](_0x3ba623(0x354),_0x17a4d4,_0x2559ca),_0x417ea3[_0x3ba623(0x219)]();},VisuMZ[_0x100070(0x785)]['storeMapData']=function(_0x1540e3,_0x2e8cd0,_0x226580,_0x21918a){const _0x27b5cf=_0x100070;$dataMap=JSON[_0x27b5cf(0x75f)](_0x1540e3[_0x27b5cf(0x47f)]),DataManager['onLoad']($dataMap),this['_storedMapText'][_0x2e8cd0]=VisuMZ[_0x27b5cf(0x785)]['ExtractStrFromMap'](_0x2e8cd0),$dataMap=this[_0x27b5cf(0x167)];},VisuMZ['CoreEngine'][_0x100070(0x4f5)]=function(){const _0x543325=_0x100070,_0xe9c920=_0x543325(0x663);this['_storedMapText'][_0x543325(0x3d5)](undefined)[_0x543325(0x3d5)]('')[_0x543325(0x3d5)](null);const _0x143bb8=this[_0x543325(0x1ec)][_0x543325(0x257)](_0x543325(0x599))['trim']();VisuMZ[_0x543325(0x785)][_0x543325(0x60c)](_0x143bb8,_0xe9c920,!![]),SceneManager[_0x543325(0x196)]['_active']=!![];},VisuMZ['CoreEngine'][_0x100070(0x3e2)]=function(_0x1ce8e1){const _0x3d39b3=_0x100070;if(!$dataMap)return'';let _0x501f44='█'[_0x3d39b3(0x127)](0x46)+'\x0a\x0a',_0x20643c='═'[_0x3d39b3(0x127)](0x46)+'\x0a\x0a',_0xb747e1='';this[_0x3d39b3(0x7b9)]=0x0;for(const _0x212204 of $dataMap[_0x3d39b3(0x7a4)]){if(!_0x212204)continue;let _0x1360b7=_0x212204['id'],_0x204718=_0x212204['name'],_0x31fe45=_0x212204['pages'];for(const _0x299944 of _0x31fe45){const _0x5cee15=_0x31fe45[_0x3d39b3(0x17b)](_0x299944)+0x1;let _0x33b0dd=_0x20643c+_0x3d39b3(0x1fe),_0x53f512=VisuMZ[_0x3d39b3(0x785)][_0x3d39b3(0x7e6)](_0x299944[_0x3d39b3(0x386)]);if(_0x53f512[_0x3d39b3(0x1ba)]>0x0){if(_0xb747e1[_0x3d39b3(0x1ba)]>0x0)_0xb747e1+=_0x20643c+_0x3d39b3(0x599);else{const _0x4a5d97=$dataMapInfos[_0x1ce8e1][_0x3d39b3(0x554)];_0xb747e1+=_0x501f44+_0x3d39b3(0x4ed)[_0x3d39b3(0x4fd)](_0x1ce8e1,_0x4a5d97||_0x3d39b3(0x46e))+_0x501f44;}_0xb747e1+=_0x33b0dd[_0x3d39b3(0x4fd)](_0x1360b7,_0x204718,_0x5cee15,_0x53f512);}}}return _0xb747e1[_0x3d39b3(0x1ba)]>0x0&&(_0xb747e1+=_0x20643c),_0xb747e1;},VisuMZ[_0x100070(0x785)][_0x100070(0x858)]=function(){const _0x44faca=_0x100070,_0x558974=$dataTroops['length']*0xa+Math['randomInt'](0xa);alert(_0x44faca(0x63c)[_0x44faca(0x4fd)](_0x558974));const _0x25f06a=[];for(const _0x140fe0 of $dataTroops){if(!_0x140fe0)continue;const _0x1a190a=_0x140fe0['id'];_0x25f06a[_0x1a190a]=VisuMZ['CoreEngine']['ExtractStrFromTroop'](_0x1a190a);}setTimeout(VisuMZ['CoreEngine'][_0x44faca(0x567)][_0x44faca(0x4b0)](this,_0x25f06a),_0x558974);},VisuMZ['CoreEngine'][_0x100070(0x39b)]=function(_0xbeada4){const _0x544ffd=_0x100070;if(!$dataTroops[_0xbeada4])return'';let _0x352fb8='█'[_0x544ffd(0x127)](0x46)+'\x0a\x0a',_0x59ee62='═'['repeat'](0x46)+'\x0a\x0a',_0x3646e8='';this[_0x544ffd(0x7b9)]=0x0;const _0x22fdb0=$dataTroops[_0xbeada4];let _0x94f7ce=_0x22fdb0[_0x544ffd(0x20f)];for(const _0x4c7c44 of _0x94f7ce){const _0x5624f9=_0x94f7ce[_0x544ffd(0x17b)](_0x4c7c44)+0x1;let _0x43e2ab=_0x59ee62+_0x544ffd(0x2f1),_0x40985e=VisuMZ[_0x544ffd(0x785)][_0x544ffd(0x7e6)](_0x4c7c44[_0x544ffd(0x386)]);_0x40985e[_0x544ffd(0x1ba)]>0x0&&(_0x3646e8['length']>0x0?_0x3646e8+=_0x59ee62+_0x544ffd(0x599):_0x3646e8+=_0x352fb8+'〖〖〖\x20Troop\x20%1:\x20%2\x20Script\x20〗〗〗\x0a\x0a'[_0x544ffd(0x4fd)](_0xbeada4,_0x22fdb0[_0x544ffd(0x554)]||'Unnamed')+_0x352fb8,_0x3646e8+=_0x43e2ab['format'](_0x5624f9,_0x40985e));}return _0x3646e8['length']>0x0&&(_0x3646e8+=_0x59ee62),_0x3646e8;},VisuMZ['CoreEngine'][_0x100070(0x567)]=function(_0x3f30bd){const _0x739739=_0x100070,_0x5e4abf=_0x739739(0x868);_0x3f30bd['remove'](undefined)[_0x739739(0x3d5)]('')[_0x739739(0x3d5)](null);const _0x189cbd=_0x3f30bd['join'](_0x739739(0x599))[_0x739739(0x60f)]();VisuMZ['CoreEngine']['ExportString'](_0x189cbd,_0x5e4abf,!![]),SceneManager[_0x739739(0x196)]['_active']=!![];},VisuMZ['CoreEngine']['ExtractStrFromList']=function(_0x37bd85){const _0x1a980f=_0x100070;let _0x459cd1='\x0a'+'─'[_0x1a980f(0x127)](0x46)+'\x0a',_0x2f6966='\x0a'+'┄'[_0x1a980f(0x127)](0x46)+'\x0a',_0x118ec7='';for(const _0x2cc858 of _0x37bd85){if(!_0x2cc858)continue;if(_0x2cc858[_0x1a980f(0x57b)]===0x65)_0x118ec7+=_0x459cd1+'\x0a',_0x118ec7+='〘Show\x20Text〙\x0a',_0x2cc858[_0x1a980f(0x595)][0x4]!==''&&_0x2cc858[_0x1a980f(0x595)][0x4]!==undefined&&(_0x118ec7+=_0x1a980f(0x413)['format'](_0x2cc858['parameters'][0x4]));else{if(_0x2cc858[_0x1a980f(0x57b)]===0x191)_0x118ec7+=_0x1a980f(0x742)[_0x1a980f(0x4fd)](_0x2cc858['parameters'][0x0]);else{if(_0x2cc858['code']===0x192)_0x118ec7+=_0x459cd1,_0x118ec7+='%1〘Choice\x20%2〙\x20%3%1'[_0x1a980f(0x4fd)](_0x2f6966,_0x2cc858[_0x1a980f(0x595)][0x0]+0x1,_0x2cc858[_0x1a980f(0x595)][0x1]);else{if(_0x2cc858[_0x1a980f(0x57b)]===0x193)_0x118ec7+=_0x459cd1,_0x118ec7+=_0x1a980f(0x543)['format'](_0x2f6966);else{if(_0x2cc858[_0x1a980f(0x57b)]===0x194)_0x118ec7+=_0x459cd1,_0x118ec7+='%1〘End\x20Choice\x20Selection〙%1'[_0x1a980f(0x4fd)](_0x2f6966);else{if(_0x2cc858[_0x1a980f(0x57b)]===0x69)_0x118ec7+=_0x459cd1+'\x0a',_0x118ec7+=_0x1a980f(0x70d);else{if(_0x2cc858[_0x1a980f(0x57b)]===0x6c)_0x118ec7+=_0x459cd1+'\x0a',_0x118ec7+='》Comment《\x0a%1\x0a'['format'](_0x2cc858['parameters'][0x0]);else{if(_0x2cc858['code']===0x198)_0x118ec7+=_0x1a980f(0x742)[_0x1a980f(0x4fd)](_0x2cc858['parameters'][0x0]);else{if(_0x2cc858[_0x1a980f(0x57b)]===0x75){const _0x4d8770=$dataCommonEvents[_0x2cc858['parameters'][0x0]];if(_0x4d8770&&this[_0x1a980f(0x7b9)]<=0xa){this['_commonEventLayers']++;let _0x4a0d2e=VisuMZ['CoreEngine'][_0x1a980f(0x7e6)](_0x4d8770['list']);_0x4a0d2e['length']>0x0&&(_0x118ec7+=_0x459cd1,_0x118ec7+=_0x2f6966,_0x118ec7+=_0x1a980f(0x5fb)[_0x1a980f(0x4fd)](_0x4d8770['id'],_0x4d8770['name']),_0x118ec7+=_0x2f6966,_0x118ec7+=_0x4a0d2e,_0x118ec7+=_0x2f6966,_0x118ec7+='〘Common\x20Event\x20%1:\x20%2〙\x20End'[_0x1a980f(0x4fd)](_0x4d8770['id'],_0x4d8770[_0x1a980f(0x554)]),_0x118ec7+=_0x2f6966),this['_commonEventLayers']--;}}}}}}}}}}}return _0x118ec7['length']>0x0&&(_0x118ec7+=_0x459cd1),_0x118ec7;},PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x620),_0x1d635f=>{const _0x17b4a4=_0x100070;VisuMZ[_0x17b4a4(0x4b1)](_0x1d635f,_0x1d635f);const _0x267010=_0x1d635f['URL'];VisuMZ[_0x17b4a4(0x584)](_0x267010);}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x269),_0x59b9da=>{const _0x8d37f=_0x100070;VisuMZ[_0x8d37f(0x4b1)](_0x59b9da,_0x59b9da);const _0x470d68=_0x59b9da[_0x8d37f(0x712)]||0x0;$gameParty[_0x8d37f(0x1d9)](_0x470d68);}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x553),_0x148aa6=>{const _0x123b7f=_0x100070;if(!SceneManager[_0x123b7f(0x177)]())return;VisuMZ['ConvertParams'](_0x148aa6,_0x148aa6);const _0x12eaf8=_0x148aa6[_0x123b7f(0x371)];SceneManager['_scene'][_0x123b7f(0x578)](_0x12eaf8);}),PluginManager['registerCommand'](pluginData[_0x100070(0x554)],_0x100070(0x249),_0x5039d8=>{const _0x32d76d=_0x100070;if(!$gameTemp['isPlaytest']())return;if(!Utils[_0x32d76d(0x4e4)]())return;VisuMZ['ConvertParams'](_0x5039d8,_0x5039d8);const _0x378ce2=_0x5039d8[_0x32d76d(0x76c)]||0x1;$gameTemp[_0x32d76d(0x52f)]=_0x378ce2;}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x522),_0x3bf9ee=>{const _0x5c918f=_0x100070;VisuMZ[_0x5c918f(0x4b1)](_0x3bf9ee,_0x3bf9ee);const _0x204a8c=_0x3bf9ee[_0x5c918f(0x2d6)]||0x1,_0x4f1cb3=_0x3bf9ee[_0x5c918f(0x3d7)]||_0x5c918f(0x80e),_0x1e8d20=$gameScreen['picture'](_0x204a8c);_0x1e8d20&&_0x1e8d20['setEasingType'](_0x4f1cb3);}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x6fc),_0x46fa72=>{const _0x162a98=_0x100070;for(let _0x3489b6=0x1;_0x3489b6<=$gameScreen['maxPictures']();_0x3489b6++){$gameScreen[_0x162a98(0x84d)](_0x3489b6);}}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x53b),_0x4c5d6a=>{const _0x3cedfb=_0x100070;VisuMZ['ConvertParams'](_0x4c5d6a,_0x4c5d6a);const _0x6e9d59=Math[_0x3cedfb(0x369)](_0x4c5d6a[_0x3cedfb(0x17f)],_0x4c5d6a['EndingID']),_0x54cf7e=Math[_0x3cedfb(0x23f)](_0x4c5d6a['StartID'],_0x4c5d6a[_0x3cedfb(0x6f7)]);for(let _0x32ab32=_0x6e9d59;_0x32ab32<=_0x54cf7e;_0x32ab32++){$gameScreen[_0x3cedfb(0x84d)](_0x32ab32);}}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x2cf),_0x331b77=>{const _0x1de72c=_0x100070;VisuMZ['ConvertParams'](_0x331b77,_0x331b77);const _0x30003b=Math[_0x1de72c(0x884)](_0x331b77[_0x1de72c(0x76c)])[_0x1de72c(0x2d3)](0x1,0x64),_0x29048e=-Number(_0x331b77[_0x1de72c(0x556)]||0x0),_0x1b434c=Math[_0x1de72c(0x23f)](_0x331b77[_0x1de72c(0x74d)]||0x0,0x0),_0x2e6307=_0x331b77[_0x1de72c(0x3d7)]||'Linear',_0x3bb7e3=_0x331b77['Wait'],_0x18e89f=$gameScreen['picture'](_0x30003b);if(!_0x18e89f)return;_0x18e89f[_0x1de72c(0x37e)](_0x29048e,_0x1b434c,_0x2e6307);if(_0x3bb7e3){const _0x172229=$gameTemp[_0x1de72c(0x253)]();if(_0x172229)_0x172229['wait'](_0x1b434c);}}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x3a6),_0x1f5d77=>{const _0x34562f=_0x100070;VisuMZ[_0x34562f(0x4b1)](_0x1f5d77,_0x1f5d77);const _0x2d33be=Math[_0x34562f(0x884)](_0x1f5d77[_0x34562f(0x76c)])[_0x34562f(0x2d3)](0x1,0x64),_0x143ac5=-Number(_0x1f5d77[_0x34562f(0x260)]||0x0),_0x15743=Math[_0x34562f(0x23f)](_0x1f5d77[_0x34562f(0x74d)]||0x0,0x0),_0x3bb9be=_0x1f5d77['easingType']||_0x34562f(0x80e),_0x37bda5=_0x1f5d77[_0x34562f(0x762)],_0x121948=$gameScreen[_0x34562f(0x46d)](_0x2d33be);if(!_0x121948)return;_0x121948['setAnglePlusData'](_0x143ac5,_0x15743,_0x3bb9be);if(_0x37bda5){const _0x108668=$gameTemp[_0x34562f(0x253)]();if(_0x108668)_0x108668['wait'](_0x15743);}}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x42a),_0x226b7e=>{const _0x1a2467=_0x100070;VisuMZ[_0x1a2467(0x4b1)](_0x226b7e,_0x226b7e);const _0x565cc1=Math[_0x1a2467(0x884)](_0x226b7e[_0x1a2467(0x76c)])[_0x1a2467(0x2d3)](0x1,0x64),_0x448689=_0x226b7e[_0x1a2467(0x598)],_0x45c1e3=_0x448689['Origin']['clamp'](0x0,0x1),_0x36f5ea=Math[_0x1a2467(0x884)](_0x448689[_0x1a2467(0x668)]||0x0),_0x2043d1=Math[_0x1a2467(0x884)](_0x448689['PositionY']||0x0),_0x578ce4=Math[_0x1a2467(0x884)](_0x448689['ScaleX']||0x0),_0x5ec5a0=Math[_0x1a2467(0x884)](_0x448689[_0x1a2467(0x4ec)]||0x0),_0x58fe0b=Math[_0x1a2467(0x884)](_0x448689[_0x1a2467(0x84f)])['clamp'](0x0,0xff),_0x4991af=_0x448689[_0x1a2467(0x6d2)],_0x126448=_0x1a2467(0x58e),_0x30f28e=_0x226b7e['Smooth']?_0x1a2467(0xe8):'Pixelated',_0x4fc339=_0x126448[_0x1a2467(0x4fd)](_0x226b7e[_0x1a2467(0x853)],_0x30f28e);$gameScreen['showPicture'](_0x565cc1,_0x4fc339,_0x45c1e3,_0x36f5ea,_0x2043d1,_0x578ce4,_0x5ec5a0,_0x58fe0b,_0x4991af);}),PluginManager['registerCommand'](pluginData[_0x100070(0x554)],_0x100070(0x108),_0x5d430f=>{const _0x4b58ef=_0x100070;VisuMZ[_0x4b58ef(0x4b1)](_0x5d430f,_0x5d430f);const _0x26e73c=_0x5d430f['Type']||_0x4b58ef(0x569),_0x19b078=_0x5d430f[_0x4b58ef(0x401)][_0x4b58ef(0x2d3)](0x1,0x9),_0xb94599=_0x5d430f['Speed'][_0x4b58ef(0x2d3)](0x1,0x9),_0x254317=_0x5d430f[_0x4b58ef(0x74d)]||0x1,_0x321b89=_0x5d430f['Wait'];$gameScreen[_0x4b58ef(0x581)](_0x26e73c),$gameScreen[_0x4b58ef(0x23c)](_0x19b078,_0xb94599,_0x254317);if(_0x321b89){const _0x58bef7=$gameTemp[_0x4b58ef(0x253)]();if(_0x58bef7)_0x58bef7[_0x4b58ef(0x430)](_0x254317);}}),PluginManager['registerCommand'](pluginData['name'],_0x100070(0x615),_0x4687d5=>{const _0xfed074=_0x100070;if($gameParty[_0xfed074(0x460)]())return;VisuMZ[_0xfed074(0x4b1)](_0x4687d5,_0x4687d5);const _0x441859=_0x4687d5[_0xfed074(0x7b7)],_0x4d57c9=(_0x4687d5['Chance']||0x0)/0x64;for(const _0x2b1f32 of _0x441859){const _0x1c2920=Math[_0xfed074(0x569)]()<=_0x4d57c9;$gameSwitches[_0xfed074(0x1ca)](_0x2b1f32,_0x1c2920);}}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x28a),_0x5e6466=>{const _0x127145=_0x100070;if($gameParty[_0x127145(0x460)]())return;VisuMZ[_0x127145(0x4b1)](_0x5e6466,_0x5e6466);const _0x3593cc=Math['min'](_0x5e6466[_0x127145(0x17f)],_0x5e6466['EndingID']),_0x2dd9ba=Math[_0x127145(0x23f)](_0x5e6466[_0x127145(0x17f)],_0x5e6466[_0x127145(0x6f7)]),_0x14083f=(_0x5e6466[_0x127145(0x6d5)]||0x0)/0x64;for(let _0x2da5e7=_0x3593cc;_0x2da5e7<=_0x2dd9ba;_0x2da5e7++){const _0x4f47c1=Math[_0x127145(0x569)]()<=_0x14083f;$gameSwitches[_0x127145(0x1ca)](_0x2da5e7,_0x4f47c1);}}),PluginManager['registerCommand'](pluginData['name'],'SwitchToggleOne',_0x3a9195=>{const _0x11b2e0=_0x100070;if($gameParty[_0x11b2e0(0x460)]())return;VisuMZ[_0x11b2e0(0x4b1)](_0x3a9195,_0x3a9195);const _0x366b2b=_0x3a9195[_0x11b2e0(0x7b7)];for(const _0x14f11c of _0x366b2b){const _0x495aa8=$gameSwitches[_0x11b2e0(0x712)](_0x14f11c);$gameSwitches[_0x11b2e0(0x1ca)](_0x14f11c,!_0x495aa8);}}),PluginManager[_0x100070(0x24d)](pluginData['name'],'SwitchToggleRange',_0xf6d710=>{const _0x369be5=_0x100070;if($gameParty['inBattle']())return;VisuMZ['ConvertParams'](_0xf6d710,_0xf6d710);const _0x34a851=Math[_0x369be5(0x369)](_0xf6d710[_0x369be5(0x17f)],_0xf6d710[_0x369be5(0x6f7)]),_0x5ca3da=Math[_0x369be5(0x23f)](_0xf6d710['StartID'],_0xf6d710['EndingID']);for(let _0x2c1c34=_0x34a851;_0x2c1c34<=_0x5ca3da;_0x2c1c34++){const _0x4949de=$gameSwitches[_0x369be5(0x712)](_0x2c1c34);$gameSwitches[_0x369be5(0x1ca)](_0x2c1c34,!_0x4949de);}}),PluginManager[_0x100070(0x24d)](pluginData['name'],_0x100070(0x40e),_0x3cbca3=>{const _0x4ec492=_0x100070;VisuMZ[_0x4ec492(0x4b1)](_0x3cbca3,_0x3cbca3);const _0x539de3=_0x3cbca3[_0x4ec492(0x5e3)]||0x1;$gameSystem[_0x4ec492(0x6f3)](_0x539de3);}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x3cf),_0x3653a1=>{const _0x1e3118=_0x100070;if($gameParty[_0x1e3118(0x460)]())return;VisuMZ['ConvertParams'](_0x3653a1,_0x3653a1);const _0x163d07=_0x3653a1[_0x1e3118(0x5e3)];if(_0x163d07[_0x1e3118(0x4aa)](/Front/i))$gameSystem[_0x1e3118(0x495)](![]);else _0x163d07[_0x1e3118(0x4aa)](/Side/i)?$gameSystem[_0x1e3118(0x495)](!![]):$gameSystem['setSideView'](!$gameSystem['isSideView']());}),PluginManager['registerCommand'](pluginData[_0x100070(0x554)],_0x100070(0x53e),_0x308083=>{const _0x32fef9=_0x100070;if($gameParty[_0x32fef9(0x460)]())return;VisuMZ['ConvertParams'](_0x308083,_0x308083);const _0x4860a1=[_0x32fef9(0x289),_0x32fef9(0x462),'me','se'];for(const _0x547602 of _0x4860a1){const _0x42b305=_0x308083[_0x547602],_0x635b02=_0x32fef9(0x469)['format'](_0x547602);for(const _0x3b85fc of _0x42b305){AudioManager[_0x32fef9(0x5c8)](_0x635b02,_0x3b85fc);}}}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],'SystemLoadImages',_0x3640bd=>{const _0x38017d=_0x100070;if($gameParty[_0x38017d(0x460)]())return;VisuMZ[_0x38017d(0x4b1)](_0x3640bd,_0x3640bd);const _0x22e8e4=['animations',_0x38017d(0x7e9),'battlebacks2',_0x38017d(0xc1),'enemies','faces',_0x38017d(0x521),'pictures',_0x38017d(0x6e9),'sv_enemies',_0x38017d(0x7b2),_0x38017d(0x355),_0x38017d(0x206),_0x38017d(0x813)];for(const _0x5e6e01 of _0x22e8e4){const _0x416efa=_0x3640bd[_0x5e6e01],_0x3563c2=_0x38017d(0xf3)['format'](_0x5e6e01);for(const _0x3446b8 of _0x416efa){ImageManager[_0x38017d(0x627)](_0x3563c2,_0x3446b8);}}}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],'SystemSetBattleSystem',_0x2b9f7e=>{const _0x228135=_0x100070;if($gameParty[_0x228135(0x460)]())return;VisuMZ[_0x228135(0x4b1)](_0x2b9f7e,_0x2b9f7e);const _0x5b2126=_0x2b9f7e[_0x228135(0x5e3)]['toUpperCase']()[_0x228135(0x60f)](),_0x1da625=VisuMZ['CoreEngine'][_0x228135(0x344)](_0x5b2126);$gameSystem[_0x228135(0xbc)](_0x1da625);}),VisuMZ['CoreEngine'][_0x100070(0x344)]=function(_0x196327){const _0xd174ca=_0x100070;_0x196327=_0x196327||_0xd174ca(0x143),_0x196327=String(_0x196327)[_0xd174ca(0x4f4)]()[_0xd174ca(0x60f)]();switch(_0x196327){case _0xd174ca(0x841):return 0x0;case _0xd174ca(0x250):return 0x1;case'TPB\x20WAIT':return 0x2;case'CTB':if(Imported[_0xd174ca(0x1ce)])return _0xd174ca(0x3ec);break;case _0xd174ca(0x336):if(Imported[_0xd174ca(0xfb)])return _0xd174ca(0x336);break;case _0xd174ca(0x7cd):if(Imported['VisuMZ_2_BattleSystemBTB'])return _0xd174ca(0x7cd);break;case _0xd174ca(0x4e6):if(Imported[_0xd174ca(0x412)])return _0xd174ca(0x4e6);break;case _0xd174ca(0x789):if(Imported[_0xd174ca(0x874)])return _0xd174ca(0x789);break;case _0xd174ca(0x166):if(Imported[_0xd174ca(0x550)])return _0xd174ca(0x166);break;case _0xd174ca(0x549):if(Imported['VisuMZ_2_BattleSystemPTB'])return _0xd174ca(0x549);break;}return $dataSystem['battleSystem'];},PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],'SystemSetWindowPadding',_0x56b0a1=>{const _0x138429=_0x100070;VisuMZ[_0x138429(0x4b1)](_0x56b0a1,_0x56b0a1);const _0x1f65c6=_0x56b0a1[_0x138429(0x5e3)]||0x1;$gameSystem[_0x138429(0x2ef)](_0x1f65c6);}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x69c),_0xa3a1de=>{const _0x364f9f=_0x100070;VisuMZ['ConvertParams'](_0xa3a1de,_0xa3a1de);const _0x35f043=_0xa3a1de[_0x364f9f(0x27d)]||'';$textPopup(_0x35f043);}),PluginManager[_0x100070(0x24d)](pluginData[_0x100070(0x554)],_0x100070(0x34b),_0x260581=>{const _0x28b489=_0x100070;VisuMZ[_0x28b489(0x4b1)](_0x260581,_0x260581);const _0x34ad3a=_0x260581['id']||0x1,_0x54c921=_0x260581['operation'],_0x2ede3b=_0x260581[_0x28b489(0x692)]||0x0;let _0x2aa24f=$gameVariables[_0x28b489(0x712)](_0x34ad3a)||0x0;switch(_0x54c921){case'=':_0x2aa24f=_0x2ede3b;break;case'+':_0x2aa24f+=_0x2ede3b;break;case'-':_0x2aa24f-=_0x2ede3b;break;case'*':_0x2aa24f*=_0x2ede3b;break;case'/':_0x2aa24f/=_0x2ede3b;break;case'%':_0x2aa24f%=_0x2ede3b;break;}_0x2aa24f=_0x2aa24f||0x0,$gameVariables[_0x28b489(0x1ca)](_0x34ad3a,_0x2aa24f);}),PluginManager[_0x100070(0x24d)](pluginData['name'],'VariableJsBlock',_0x81f89c=>{const _0x423d3d=_0x100070;VisuMZ[_0x423d3d(0x4b1)](_0x81f89c,_0x81f89c);const _0x1e0c02=_0x81f89c['id']()||0x1,_0x11643d=_0x81f89c[_0x423d3d(0x45b)],_0x5948bf=_0x81f89c[_0x423d3d(0x692)]()||0x0;let _0xb790c8=$gameVariables[_0x423d3d(0x712)](_0x1e0c02)||0x0;switch(_0x11643d){case'=':_0xb790c8=_0x5948bf;break;case'+':_0xb790c8+=_0x5948bf;break;case'-':_0xb790c8-=_0x5948bf;break;case'*':_0xb790c8*=_0x5948bf;break;case'/':_0xb790c8/=_0x5948bf;break;case'%':_0xb790c8%=_0x5948bf;break;}_0xb790c8=_0xb790c8||0x0,$gameVariables['setValue'](_0x1e0c02,_0xb790c8);}),VisuMZ[_0x100070(0x785)][_0x100070(0x365)]=Scene_Boot[_0x100070(0x7ae)]['onDatabaseLoaded'],Scene_Boot[_0x100070(0x7ae)][_0x100070(0x5a9)]=function(){const _0x56338f=_0x100070;VisuMZ['CoreEngine'][_0x56338f(0x365)][_0x56338f(0x703)](this),this[_0x56338f(0x104)](),this[_0x56338f(0x816)](),this['process_VisuMZ_CoreEngine_Settings'](),this[_0x56338f(0x63b)](),this['process_VisuMZ_CoreEngine_CustomParameters'](),this[_0x56338f(0x329)](),VisuMZ['ParseAllNotetags']();},VisuMZ[_0x100070(0x785)]['RegExp']={},Scene_Boot[_0x100070(0x7ae)][_0x100070(0x104)]=function(){const _0x208377=_0x100070,_0x6984b4=[_0x208377(0xbd),_0x208377(0xe1),_0x208377(0x431),_0x208377(0x6fd),'MAT','MDF','AGI',_0x208377(0x50b)],_0x1d43a2=[_0x208377(0x5cd),_0x208377(0x22c),'CRI',_0x208377(0x6e4),_0x208377(0x3ae),_0x208377(0x535),_0x208377(0x415),'HRG',_0x208377(0x55d),_0x208377(0x455)],_0x3c5846=[_0x208377(0x845),_0x208377(0x488),_0x208377(0xf8),'PHA',_0x208377(0x2ec),'TCR',_0x208377(0x5ba),'MDR',_0x208377(0x81d),_0x208377(0xb5)],_0x5e294d=[_0x6984b4,_0x1d43a2,_0x3c5846],_0x56123b=[_0x208377(0x605),_0x208377(0x1c1),_0x208377(0xc7),_0x208377(0x35e),_0x208377(0x13f),_0x208377(0x840),'Rate2',_0x208377(0x867),'Flat1',_0x208377(0x294)];for(const _0x5be0a9 of _0x5e294d){let _0x364f0d='';if(_0x5be0a9===_0x6984b4)_0x364f0d=_0x208377(0x79a);if(_0x5be0a9===_0x1d43a2)_0x364f0d=_0x208377(0x516);if(_0x5be0a9===_0x3c5846)_0x364f0d=_0x208377(0x683);for(const _0x3c7ec6 of _0x56123b){let _0x4a0786=_0x208377(0x42b)[_0x208377(0x4fd)](_0x364f0d,_0x3c7ec6);VisuMZ[_0x208377(0x785)]['RegExp'][_0x4a0786]=[],VisuMZ[_0x208377(0x785)][_0x208377(0x408)][_0x4a0786+'JS']=[];let _0x2eb2bc=_0x208377(0x5fc);if(['Plus','Flat'][_0x208377(0x4c7)](_0x3c7ec6))_0x2eb2bc+=_0x208377(0x199);else{if([_0x208377(0x1c1),'Flat1'][_0x208377(0x4c7)](_0x3c7ec6))_0x2eb2bc+='([\x5c+\x5c-]\x5cd+)([%％])>';else{if([_0x208377(0xc7),_0x208377(0x294)]['includes'](_0x3c7ec6))_0x2eb2bc+='([\x5c+\x5c-]\x5cd+\x5c.?\x5cd+)>';else{if(_0x3c7ec6===_0x208377(0x35e))_0x2eb2bc+=_0x208377(0x1a3);else{if(_0x3c7ec6==='Rate1')_0x2eb2bc+=_0x208377(0x530);else _0x3c7ec6===_0x208377(0x3c2)&&(_0x2eb2bc+=_0x208377(0x2ad));}}}}for(const _0x434ccc of _0x5be0a9){let _0x14e83b=_0x3c7ec6[_0x208377(0x617)](/[\d+]/g,'')['toUpperCase']();const _0x2d4891=_0x2eb2bc['format'](_0x434ccc,_0x14e83b);VisuMZ['CoreEngine'][_0x208377(0x408)][_0x4a0786]['push'](new RegExp(_0x2d4891,'i'));const _0xa0866c='<JS\x20%1\x20%2:[\x20](.*)>'[_0x208377(0x4fd)](_0x434ccc,_0x14e83b);VisuMZ[_0x208377(0x785)][_0x208377(0x408)][_0x4a0786+'JS']['push'](new RegExp(_0xa0866c,'i'));}}}},Scene_Boot[_0x100070(0x7ae)][_0x100070(0x816)]=function(){const _0x44b593=_0x100070;if(VisuMZ[_0x44b593(0x134)])return;},Scene_Boot[_0x100070(0x7ae)][_0x100070(0x520)]=function(){const _0x38e789=_0x100070,_0x76ef9e=VisuMZ['CoreEngine']['Settings'];_0x76ef9e[_0x38e789(0x1f9)][_0x38e789(0x3b0)]&&VisuMZ[_0x38e789(0x6df)](!![]);_0x76ef9e[_0x38e789(0x1f9)][_0x38e789(0x7e7)]&&(Input[_0x38e789(0x817)][0x23]=_0x38e789(0x51f),Input[_0x38e789(0x817)][0x24]=_0x38e789(0x3fb));if(_0x76ef9e[_0x38e789(0x7ea)]){const _0x2c3cfa=_0x76ef9e[_0x38e789(0x7ea)];_0x2c3cfa['KeySHIFT']=_0x2c3cfa[_0x38e789(0x343)]||_0x38e789(0x2a3),_0x2c3cfa[_0x38e789(0x407)]=_0x2c3cfa[_0x38e789(0x407)]||_0x38e789(0x54d);}_0x76ef9e[_0x38e789(0x78a)][_0x38e789(0x21c)]&&(Input[_0x38e789(0x817)][0x57]='up',Input[_0x38e789(0x817)][0x41]=_0x38e789(0xbf),Input['keyMapper'][0x53]=_0x38e789(0x2a8),Input['keyMapper'][0x44]=_0x38e789(0x12e),Input[_0x38e789(0x817)][0x45]=_0x38e789(0x802)),_0x76ef9e['KeyboardInput'][_0x38e789(0x794)]&&(Input[_0x38e789(0x817)][0x52]='dashToggle'),_0x76ef9e[_0x38e789(0x7a7)][_0x38e789(0x474)]=_0x76ef9e['Param'][_0x38e789(0x474)][_0x38e789(0x22e)](_0x2656ae=>_0x2656ae[_0x38e789(0x4f4)]()['trim']()),_0x76ef9e[_0x38e789(0x7a7)][_0x38e789(0x690)]=_0x76ef9e['Param'][_0x38e789(0x690)][_0x38e789(0x22e)](_0xe3142e=>_0xe3142e[_0x38e789(0x4f4)]()[_0x38e789(0x60f)]()),_0x76ef9e[_0x38e789(0x1f9)][_0x38e789(0x7b6)]=_0x76ef9e[_0x38e789(0x1f9)][_0x38e789(0x7b6)]??!![],_0x76ef9e['QoL'][_0x38e789(0xb6)]=_0x76ef9e[_0x38e789(0x1f9)][_0x38e789(0xb6)]??!![],_0x76ef9e[_0x38e789(0x7ea)][_0x38e789(0xc8)]&&VisuMZ[_0x38e789(0x785)][_0x38e789(0x821)]();},VisuMZ[_0x100070(0x785)][_0x100070(0x821)]=function(){const _0x2e2405=_0x100070;let _0x39e2d4=![],_0x465ab7=![];for(let _0x4b7bd2 in Input[_0x2e2405(0x817)]){const _0x2a184b=Input[_0x2e2405(0x817)][_0x4b7bd2];if(_0x2a184b===_0x2e2405(0x1c9))_0x39e2d4=!![];if(_0x2a184b==='cancel')_0x465ab7=!![];if(_0x39e2d4&&_0x465ab7)return;}let _0x49f090=_0x2e2405(0x159);_0x49f090+=_0x2e2405(0x5cf),_0x49f090+=_0x2e2405(0x5e7),_0x49f090+=_0x2e2405(0x20d),_0x49f090+=_0x2e2405(0x10d),alert(_0x49f090),SceneManager['exit']();},Scene_Boot[_0x100070(0x7ae)][_0x100070(0x63b)]=function(){const _0x3ba554=_0x100070;this[_0x3ba554(0x4a0)]();},Scene_Boot[_0x100070(0x7ae)][_0x100070(0x4a0)]=function(){const _0xa4843c=_0x100070,_0x375fd3=VisuMZ[_0xa4843c(0x785)][_0xa4843c(0x598)][_0xa4843c(0x782)];for(const _0x414c8d of _0x375fd3){const _0x3e5b59=_0x414c8d[_0xa4843c(0x2b4)][_0xa4843c(0x617)](/[ ]/g,''),_0x38908f=_0x414c8d[_0xa4843c(0x741)];VisuMZ[_0xa4843c(0x785)][_0xa4843c(0x85b)](_0x3e5b59,_0x38908f);}},VisuMZ[_0x100070(0x785)][_0x100070(0x85b)]=function(_0x20d516,_0x1275b3){const _0x30a92e=_0x100070;if(!!window[_0x20d516]){if($gameTemp[_0x30a92e(0x16d)]())console[_0x30a92e(0x4ce)](_0x30a92e(0x33f)[_0x30a92e(0x4fd)](_0x20d516));}const _0x378efe=_0x30a92e(0x18e)['format'](_0x20d516,_0x1275b3);window[_0x20d516]=new Function(_0x378efe);},Scene_Boot[_0x100070(0x7ae)][_0x100070(0x75c)]=function(){const _0x34784b=_0x100070,_0x68175e=VisuMZ['CoreEngine'][_0x34784b(0x598)][_0x34784b(0x221)];if(!_0x68175e)return;for(const _0xadbeaa of _0x68175e){if(!_0xadbeaa)continue;VisuMZ[_0x34784b(0x785)][_0x34784b(0x651)](_0xadbeaa);}},VisuMZ[_0x100070(0x785)]['CustomParamNames']={},VisuMZ[_0x100070(0x785)]['CustomParamIcons']={},VisuMZ[_0x100070(0x785)][_0x100070(0x5a7)]={},VisuMZ[_0x100070(0x785)][_0x100070(0x6fb)]={},VisuMZ[_0x100070(0x785)]['createCustomParameter']=function(_0x48a55e){const _0xa046b3=_0x100070,_0x1447c9=_0x48a55e[_0xa046b3(0x447)],_0x47249f=_0x48a55e[_0xa046b3(0x2b9)],_0x4f94a4=_0x48a55e[_0xa046b3(0x4ba)],_0x6e164=_0x48a55e[_0xa046b3(0x634)],_0x2c7ae0=new Function(_0x48a55e['ValueJS']);VisuMZ[_0xa046b3(0x785)][_0xa046b3(0x363)][_0x1447c9[_0xa046b3(0x4f4)]()['trim']()]=_0x47249f,VisuMZ[_0xa046b3(0x785)][_0xa046b3(0x735)][_0x1447c9['toUpperCase']()[_0xa046b3(0x60f)]()]=_0x4f94a4,VisuMZ[_0xa046b3(0x785)][_0xa046b3(0x5a7)][_0x1447c9[_0xa046b3(0x4f4)]()[_0xa046b3(0x60f)]()]=_0x6e164,VisuMZ[_0xa046b3(0x785)][_0xa046b3(0x6fb)][_0x1447c9[_0xa046b3(0x4f4)]()[_0xa046b3(0x60f)]()]=_0x1447c9,Object['defineProperty'](Game_BattlerBase[_0xa046b3(0x7ae)],_0x1447c9,{'get'(){const _0x5469d2=_0xa046b3,_0x21743a=_0x2c7ae0[_0x5469d2(0x703)](this);return _0x6e164===_0x5469d2(0x4b5)?Math['round'](_0x21743a):_0x21743a;}});},VisuMZ[_0x100070(0x785)]['ControllerButtons']={},VisuMZ[_0x100070(0x785)][_0x100070(0x27f)]={},Scene_Boot[_0x100070(0x7ae)][_0x100070(0x329)]=function(){const _0x4265ed=_0x100070,_0x1c3585=VisuMZ['CoreEngine'][_0x4265ed(0x598)]['ControllerButtons'];for(const _0xfb0b50 of _0x1c3585){const _0x3dee89=(_0xfb0b50[_0x4265ed(0x536)]||'')[_0x4265ed(0x1d4)]()['trim'](),_0xf4cac8=(_0xfb0b50[_0x4265ed(0x133)]||'')[_0x4265ed(0x1d4)]()['trim']();VisuMZ[_0x4265ed(0x785)][_0x4265ed(0x1c4)][_0x3dee89]=_0xfb0b50,VisuMZ['CoreEngine'][_0x4265ed(0x27f)][_0xf4cac8]=_0x3dee89;}},VisuMZ[_0x100070(0x134)]=function(){const _0x252607=_0x100070;for(const _0x488679 of $dataActors){if(_0x488679)VisuMZ[_0x252607(0x83b)](_0x488679);}for(const _0x180cfb of $dataClasses){if(_0x180cfb)VisuMZ['ParseClassNotetags'](_0x180cfb);}for(const _0x5a69d0 of $dataSkills){if(_0x5a69d0)VisuMZ[_0x252607(0x83d)](_0x5a69d0);}for(const _0x4f9a19 of $dataItems){if(_0x4f9a19)VisuMZ['ParseItemNotetags'](_0x4f9a19);}for(const _0x17295e of $dataWeapons){if(_0x17295e)VisuMZ['ParseWeaponNotetags'](_0x17295e);}for(const _0x5ede25 of $dataArmors){if(_0x5ede25)VisuMZ[_0x252607(0x72f)](_0x5ede25);}for(const _0x3fcb1e of $dataEnemies){if(_0x3fcb1e)VisuMZ['ParseEnemyNotetags'](_0x3fcb1e);}for(const _0x5377ba of $dataStates){if(_0x5377ba)VisuMZ[_0x252607(0x68c)](_0x5377ba);}for(const _0xae35a2 of $dataTilesets){if(_0xae35a2)VisuMZ[_0x252607(0x689)](_0xae35a2);}},VisuMZ[_0x100070(0x83b)]=function(_0x38c452){},VisuMZ['ParseClassNotetags']=function(_0x2fdec5){},VisuMZ[_0x100070(0x83d)]=function(_0x35adbd){},VisuMZ[_0x100070(0x6c0)]=function(_0x16e273){},VisuMZ['ParseWeaponNotetags']=function(_0x18bb0d){},VisuMZ[_0x100070(0x72f)]=function(_0x46ae92){},VisuMZ[_0x100070(0x897)]=function(_0x2fda30){},VisuMZ[_0x100070(0x68c)]=function(_0x5cde33){},VisuMZ[_0x100070(0x689)]=function(_0x4d5320){},VisuMZ[_0x100070(0x785)]['ParseActorNotetags']=VisuMZ[_0x100070(0x83b)],VisuMZ['ParseActorNotetags']=function(_0x447208){const _0x1c592e=_0x100070;VisuMZ['CoreEngine']['ParseActorNotetags']['call'](this,_0x447208);const _0x5d8013=_0x447208[_0x1c592e(0x507)];if(_0x5d8013[_0x1c592e(0x4aa)](/<MAX LEVEL:[ ](\d+)>/i)){_0x447208[_0x1c592e(0x847)]=Number(RegExp['$1']);if(_0x447208['maxLevel']===0x0)_0x447208['maxLevel']=Number['MAX_SAFE_INTEGER'];}_0x5d8013[_0x1c592e(0x4aa)](/<INITIAL LEVEL:[ ](\d+)>/i)&&(_0x447208[_0x1c592e(0x6a5)]=Math[_0x1c592e(0x369)](Number(RegExp['$1']),_0x447208['maxLevel']));},VisuMZ[_0x100070(0x785)][_0x100070(0x29c)]=VisuMZ[_0x100070(0x29c)],VisuMZ[_0x100070(0x29c)]=function(_0x3e2130){const _0xf71768=_0x100070;VisuMZ[_0xf71768(0x785)][_0xf71768(0x29c)]['call'](this,_0x3e2130);if(_0x3e2130[_0xf71768(0x1df)])for(const _0x45cfdf of _0x3e2130[_0xf71768(0x1df)]){_0x45cfdf[_0xf71768(0x507)][_0xf71768(0x4aa)](/<LEARN AT LEVEL:[ ](\d+)>/i)&&(_0x45cfdf[_0xf71768(0x42e)]=Math[_0xf71768(0x23f)](Number(RegExp['$1']),0x1));}},VisuMZ[_0x100070(0x785)][_0x100070(0x897)]=VisuMZ['ParseEnemyNotetags'],VisuMZ[_0x100070(0x897)]=function(_0x359264){const _0x36d36a=_0x100070;VisuMZ[_0x36d36a(0x785)][_0x36d36a(0x897)][_0x36d36a(0x703)](this,_0x359264),_0x359264[_0x36d36a(0x42e)]=0x1;const _0x4efe84=_0x359264[_0x36d36a(0x507)];if(_0x4efe84[_0x36d36a(0x4aa)](/<LEVEL:[ ](\d+)>/i))_0x359264[_0x36d36a(0x42e)]=Number(RegExp['$1']);if(_0x4efe84[_0x36d36a(0x4aa)](/<MAXHP:[ ](\d+)>/i))_0x359264[_0x36d36a(0x138)][0x0]=Number(RegExp['$1']);if(_0x4efe84[_0x36d36a(0x4aa)](/<MAXMP:[ ](\d+)>/i))_0x359264['params'][0x1]=Number(RegExp['$1']);if(_0x4efe84[_0x36d36a(0x4aa)](/<ATK:[ ](\d+)>/i))_0x359264[_0x36d36a(0x138)][0x2]=Number(RegExp['$1']);if(_0x4efe84[_0x36d36a(0x4aa)](/<DEF:[ ](\d+)>/i))_0x359264[_0x36d36a(0x138)][0x3]=Number(RegExp['$1']);if(_0x4efe84[_0x36d36a(0x4aa)](/<MAT:[ ](\d+)>/i))_0x359264['params'][0x4]=Number(RegExp['$1']);if(_0x4efe84[_0x36d36a(0x4aa)](/<MDF:[ ](\d+)>/i))_0x359264['params'][0x5]=Number(RegExp['$1']);if(_0x4efe84[_0x36d36a(0x4aa)](/<AGI:[ ](\d+)>/i))_0x359264[_0x36d36a(0x138)][0x6]=Number(RegExp['$1']);if(_0x4efe84[_0x36d36a(0x4aa)](/<LUK:[ ](\d+)>/i))_0x359264['params'][0x7]=Number(RegExp['$1']);if(_0x4efe84[_0x36d36a(0x4aa)](/<EXP:[ ](\d+)>/i))_0x359264['exp']=Number(RegExp['$1']);if(_0x4efe84[_0x36d36a(0x4aa)](/<GOLD:[ ](\d+)>/i))_0x359264[_0x36d36a(0x498)]=Number(RegExp['$1']);},VisuMZ[_0x100070(0x785)][_0x100070(0x638)]=Graphics[_0x100070(0x640)],Graphics[_0x100070(0x640)]=function(){const _0x3fd920=_0x100070;switch(VisuMZ[_0x3fd920(0x785)][_0x3fd920(0x598)][_0x3fd920(0x1f9)][_0x3fd920(0x1d1)]){case _0x3fd920(0x5a5):return!![];case _0x3fd920(0x4c9):return![];default:return VisuMZ[_0x3fd920(0x785)][_0x3fd920(0x638)][_0x3fd920(0x703)](this);}},VisuMZ[_0x100070(0x785)][_0x100070(0x2b7)]=Graphics[_0x100070(0x688)],Graphics[_0x100070(0x688)]=function(_0x4fa724,_0x30825b,_0x257ebd=null){VisuMZ['CoreEngine']['Graphics_printError']['call'](this,_0x4fa724,_0x30825b,_0x257ebd),VisuMZ['ShowDevTools'](![]);},VisuMZ['CoreEngine'][_0x100070(0x559)]=Graphics[_0x100070(0x75b)],Graphics[_0x100070(0x75b)]=function(_0x36ea01){const _0x4256f0=_0x100070;VisuMZ['CoreEngine']['Graphics_centerElement'][_0x4256f0(0x703)](this,_0x36ea01),this['_centerElementCoreEngine'](_0x36ea01);},Graphics[_0x100070(0x107)]=function(_0x515cf3){const _0x32c3d4=_0x100070;VisuMZ[_0x32c3d4(0x785)]['Settings'][_0x32c3d4(0x1f9)][_0x32c3d4(0x68a)]&&(_0x515cf3[_0x32c3d4(0x420)]['font-smooth']='none');VisuMZ[_0x32c3d4(0x785)][_0x32c3d4(0x598)][_0x32c3d4(0x1f9)][_0x32c3d4(0x198)]&&(_0x515cf3['style'][_0x32c3d4(0x12d)]='pixelated');const _0x2c3a93=Math[_0x32c3d4(0x23f)](0x0,Math[_0x32c3d4(0x279)](_0x515cf3[_0x32c3d4(0x1ed)]*this[_0x32c3d4(0x41a)])),_0x2351cd=Math[_0x32c3d4(0x23f)](0x0,Math[_0x32c3d4(0x279)](_0x515cf3[_0x32c3d4(0x6c5)]*this[_0x32c3d4(0x41a)]));_0x515cf3[_0x32c3d4(0x420)][_0x32c3d4(0x1ed)]=_0x2c3a93+'px',_0x515cf3[_0x32c3d4(0x420)][_0x32c3d4(0x6c5)]=_0x2351cd+'px';},VisuMZ[_0x100070(0x785)][_0x100070(0x78e)]=Bitmap[_0x100070(0x7ae)][_0x100070(0x811)],Bitmap['prototype']['initialize']=function(_0x5de61c,_0x15fc45){const _0x2c792e=_0x100070;VisuMZ[_0x2c792e(0x785)][_0x2c792e(0x78e)][_0x2c792e(0x703)](this,_0x5de61c,_0x15fc45),this['_smooth']=!(VisuMZ[_0x2c792e(0x785)][_0x2c792e(0x598)][_0x2c792e(0x1f9)][_0x2c792e(0x198)]??!![]);},Bitmap[_0x100070(0x7ae)][_0x100070(0x4a3)]=function(){const _0x527f29=_0x100070;this[_0x527f29(0x86e)]=!![];},VisuMZ[_0x100070(0x785)][_0x100070(0x45f)]=Sprite[_0x100070(0x7ae)][_0x100070(0x4f0)],Sprite[_0x100070(0x7ae)][_0x100070(0x4f0)]=function(){const _0x1513e6=_0x100070;if(this['_texture'])VisuMZ[_0x1513e6(0x785)][_0x1513e6(0x45f)][_0x1513e6(0x703)](this);this[_0x1513e6(0x6d3)]();},Sprite[_0x100070(0x7ae)]['destroyCoreEngineMarkedBitmaps']=function(){const _0xb8a420=_0x100070;if(!this[_0xb8a420(0x6ed)])return;if(!this[_0xb8a420(0x6ed)][_0xb8a420(0x86e)])return;this['bitmap'][_0xb8a420(0x78c)]&&!this['_bitmap'][_0xb8a420(0x78c)][_0xb8a420(0x6b6)]&&this[_0xb8a420(0x6ed)]['destroy']();},VisuMZ[_0x100070(0x785)][_0x100070(0x612)]=Bitmap[_0x100070(0x7ae)][_0x100070(0x836)],Bitmap[_0x100070(0x7ae)][_0x100070(0x836)]=function(_0x47bd95,_0x47fdc9){const _0x2371c9=_0x100070;VisuMZ['CoreEngine'][_0x2371c9(0x612)][_0x2371c9(0x703)](this,_0x47bd95,_0x47fdc9),this[_0x2371c9(0x4a3)]();},VisuMZ[_0x100070(0x785)][_0x100070(0x226)]=Bitmap[_0x100070(0x7ae)]['blt'],Bitmap['prototype'][_0x100070(0x808)]=function(_0x37ee0f,_0x9e94e4,_0x56aa7c,_0x5e7305,_0x2eaa2f,_0x291dd7,_0x4a76c5,_0x3d05ca,_0x569034){const _0x291c73=_0x100070;_0x9e94e4=Math[_0x291c73(0x884)](_0x9e94e4),_0x56aa7c=Math[_0x291c73(0x884)](_0x56aa7c),_0x5e7305=Math['round'](_0x5e7305),_0x2eaa2f=Math['round'](_0x2eaa2f),_0x291dd7=Math[_0x291c73(0x884)](_0x291dd7),_0x4a76c5=Math[_0x291c73(0x884)](_0x4a76c5),VisuMZ[_0x291c73(0x785)]['Bitmap_blt']['call'](this,_0x37ee0f,_0x9e94e4,_0x56aa7c,_0x5e7305,_0x2eaa2f,_0x291dd7,_0x4a76c5,_0x3d05ca,_0x569034),this['markCoreEngineModified']();},VisuMZ[_0x100070(0x785)]['Bitmap_clearRect']=Bitmap[_0x100070(0x7ae)]['clearRect'],Bitmap['prototype'][_0x100070(0x310)]=function(_0x58dab4,_0x39cdd2,_0x291ff0,_0x326240){const _0x9d791a=_0x100070;VisuMZ[_0x9d791a(0x785)][_0x9d791a(0x2d7)][_0x9d791a(0x703)](this,_0x58dab4,_0x39cdd2,_0x291ff0,_0x326240),this[_0x9d791a(0x4a3)]();},VisuMZ[_0x100070(0x785)][_0x100070(0x492)]=Bitmap[_0x100070(0x7ae)]['fillRect'],Bitmap['prototype'][_0x100070(0xe6)]=function(_0x11b276,_0x1dcfae,_0x35d2ae,_0x2ce032,_0x30259e){const _0x115f83=_0x100070;VisuMZ[_0x115f83(0x785)][_0x115f83(0x492)][_0x115f83(0x703)](this,_0x11b276,_0x1dcfae,_0x35d2ae,_0x2ce032,_0x30259e),this[_0x115f83(0x4a3)]();},VisuMZ['CoreEngine'][_0x100070(0x891)]=Bitmap['prototype'][_0x100070(0x890)],Bitmap[_0x100070(0x7ae)]['strokeRect']=function(_0x37ead4,_0x17d8d0,_0x19e29b,_0x27e857,_0x4f8ec6){const _0x54c6e2=_0x100070;VisuMZ['CoreEngine']['Bitmap_strokeRect'][_0x54c6e2(0x703)](this,_0x37ead4,_0x17d8d0,_0x19e29b,_0x27e857,_0x4f8ec6),this[_0x54c6e2(0x4a3)]();},VisuMZ[_0x100070(0x785)][_0x100070(0x576)]=Bitmap[_0x100070(0x7ae)][_0x100070(0x3a4)],Bitmap['prototype'][_0x100070(0x3a4)]=function(_0x275508,_0x3f3fb3,_0x2711e4,_0x40ab67,_0xd57c04,_0x511edf,_0x15e83d){const _0x2bbe8e=_0x100070;VisuMZ[_0x2bbe8e(0x785)][_0x2bbe8e(0x576)][_0x2bbe8e(0x703)](this,_0x275508,_0x3f3fb3,_0x2711e4,_0x40ab67,_0xd57c04,_0x511edf,_0x15e83d),this[_0x2bbe8e(0x4a3)]();},VisuMZ[_0x100070(0x785)][_0x100070(0xfd)]=Bitmap[_0x100070(0x7ae)][_0x100070(0x856)],Bitmap[_0x100070(0x7ae)][_0x100070(0x856)]=function(_0x44c8cf,_0x550dc2,_0x19ea07,_0x442d51){const _0x3467ce=_0x100070;_0x44c8cf=Math[_0x3467ce(0x884)](_0x44c8cf),_0x550dc2=Math[_0x3467ce(0x884)](_0x550dc2),_0x19ea07=Math[_0x3467ce(0x884)](_0x19ea07),VisuMZ[_0x3467ce(0x785)][_0x3467ce(0xfd)][_0x3467ce(0x703)](this,_0x44c8cf,_0x550dc2,_0x19ea07,_0x442d51),this[_0x3467ce(0x4a3)]();},VisuMZ[_0x100070(0x785)]['Bitmap_measureTextWidth']=Bitmap[_0x100070(0x7ae)]['measureTextWidth'],Bitmap[_0x100070(0x7ae)][_0x100070(0x4ad)]=function(_0x27aab8){const _0x5dba83=_0x100070;return Math[_0x5dba83(0x5fd)](VisuMZ[_0x5dba83(0x785)][_0x5dba83(0xc5)][_0x5dba83(0x703)](this,_0x27aab8));},VisuMZ[_0x100070(0x785)][_0x100070(0x4eb)]=Bitmap[_0x100070(0x7ae)][_0x100070(0x100)],Bitmap['prototype']['drawText']=function(_0x4d50b9,_0x297029,_0x2bf24d,_0x386a92,_0x136090,_0x3dcb4f){const _0x5da9e1=_0x100070;_0x297029=Math[_0x5da9e1(0x884)](_0x297029),_0x2bf24d=Math[_0x5da9e1(0x884)](_0x2bf24d),_0x386a92=Math[_0x5da9e1(0x5fd)](_0x386a92),_0x136090=Math[_0x5da9e1(0x5fd)](_0x136090),VisuMZ['CoreEngine'][_0x5da9e1(0x4eb)][_0x5da9e1(0x703)](this,_0x4d50b9,_0x297029,_0x2bf24d,_0x386a92,_0x136090,_0x3dcb4f),this[_0x5da9e1(0x4a3)]();},VisuMZ[_0x100070(0x785)][_0x100070(0x1a2)]=Bitmap[_0x100070(0x7ae)][_0x100070(0x7ee)],Bitmap[_0x100070(0x7ae)][_0x100070(0x7ee)]=function(_0x2e7e17,_0x4c7d11,_0x4d264d,_0x58bb97){const _0x35b4a8=_0x100070;VisuMZ[_0x35b4a8(0x785)]['Settings']['QoL'][_0x35b4a8(0xd8)]?this[_0x35b4a8(0x83f)](_0x2e7e17,_0x4c7d11,_0x4d264d,_0x58bb97):VisuMZ[_0x35b4a8(0x785)][_0x35b4a8(0x1a2)]['call'](this,_0x2e7e17,_0x4c7d11,_0x4d264d,_0x58bb97);},Bitmap['prototype'][_0x100070(0x83f)]=function(_0x204abf,_0x4ab759,_0x5209cf,_0x1587b1){const _0x5ae347=_0x100070,_0x5a73f7=this[_0x5ae347(0x3de)];_0x5a73f7['fillStyle']=this['outlineColor'],_0x5a73f7['fillText'](_0x204abf,_0x4ab759+0x2,_0x5209cf+0x2,_0x1587b1);},VisuMZ[_0x100070(0x785)][_0x100070(0x872)]=Input[_0x100070(0x85d)],Input[_0x100070(0x85d)]=function(){const _0x58d398=_0x100070;VisuMZ[_0x58d398(0x785)][_0x58d398(0x872)][_0x58d398(0x703)](this),this['_inputString']=undefined,this[_0x58d398(0xcf)]=undefined,this['_gamepadWait']=Input[_0x58d398(0xe9)];},VisuMZ[_0x100070(0x785)][_0x100070(0x5ee)]=Input[_0x100070(0x723)],Input[_0x100070(0x723)]=function(){const _0x3bb5d1=_0x100070;VisuMZ[_0x3bb5d1(0x785)][_0x3bb5d1(0x5ee)]['call'](this);if(this[_0x3bb5d1(0x701)])this[_0x3bb5d1(0x701)]--;},VisuMZ['CoreEngine'][_0x100070(0x17a)]=Input[_0x100070(0x81f)],Input[_0x100070(0x81f)]=function(){const _0x44a5dd=_0x100070;if(this[_0x44a5dd(0x701)])return;VisuMZ[_0x44a5dd(0x785)][_0x44a5dd(0x17a)][_0x44a5dd(0x703)](this);},VisuMZ['CoreEngine'][_0x100070(0x66b)]=Input['_setupEventHandlers'],Input[_0x100070(0x3ed)]=function(){const _0x35342d=_0x100070;VisuMZ[_0x35342d(0x785)]['Input_setupEventHandlers'][_0x35342d(0x703)](this),document[_0x35342d(0x871)](_0x35342d(0x422),this[_0x35342d(0x2cd)][_0x35342d(0x4b0)](this));},VisuMZ[_0x100070(0x785)]['Input_onKeyDown']=Input[_0x100070(0x545)],Input[_0x100070(0x545)]=function(_0x43e94d){const _0x5accbb=_0x100070;this[_0x5accbb(0xcf)]=_0x43e94d['keyCode'],VisuMZ[_0x5accbb(0x785)][_0x5accbb(0x3be)][_0x5accbb(0x703)](this,_0x43e94d),this['setLastGamepadUsed'](null);},Input['_onKeyPress']=function(_0x307d4c){const _0x41fbf2=_0x100070;this[_0x41fbf2(0x67d)](_0x307d4c);},Input['_registerKeyInput']=function(_0x295470){const _0x394d10=_0x100070;this['_inputSpecialKeyCode']=_0x295470[_0x394d10(0x781)];let _0x1625cc=String[_0x394d10(0x650)](_0x295470['charCode']);this['_inputString']===undefined?this[_0x394d10(0x191)]=_0x1625cc:this[_0x394d10(0x191)]+=_0x1625cc;},VisuMZ[_0x100070(0x785)][_0x100070(0x517)]=Input[_0x100070(0x2d1)],Input[_0x100070(0x2d1)]=function(_0x1502b1){const _0x26406b=_0x100070;if(_0x1502b1===0x8)return![];return VisuMZ[_0x26406b(0x785)][_0x26406b(0x517)][_0x26406b(0x703)](this,_0x1502b1);},Input['isSpecialCode']=function(_0x37ea6b){const _0xd0e710=_0x100070;if(_0x37ea6b[_0xd0e710(0x4aa)](/backspace/i))return this[_0xd0e710(0xcf)]===0x8;if(_0x37ea6b[_0xd0e710(0x4aa)](/enter/i))return this[_0xd0e710(0xcf)]===0xd;if(_0x37ea6b[_0xd0e710(0x4aa)](/escape/i))return this[_0xd0e710(0xcf)]===0x1b;},Input[_0x100070(0x188)]=function(){return[0x30,0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39]['contains'](this['_inputSpecialKeyCode']);},Input[_0x100070(0x4fb)]=function(){const _0x4c834e=_0x100070;return[0x25,0x26,0x27,0x28][_0x4c834e(0x69e)](this[_0x4c834e(0xcf)]);},Input[_0x100070(0x114)]=function(){const _0x4cedd6=_0x100070;if(navigator[_0x4cedd6(0x736)]){const _0x4a0687=navigator[_0x4cedd6(0x736)]();if(_0x4a0687)for(const _0x4dd8f1 of _0x4a0687){if(_0x4dd8f1&&_0x4dd8f1['connected'])return!![];}}return![];},Input[_0x100070(0x25f)]=function(){const _0x4c6dba=_0x100070;if(navigator[_0x4c6dba(0x736)]){const _0x25aec1=navigator[_0x4c6dba(0x736)]();if(_0x25aec1)for(const _0x4d8f13 of _0x25aec1){if(_0x4d8f13&&_0x4d8f13[_0x4c6dba(0x88b)]){if(this[_0x4c6dba(0x1a4)](_0x4d8f13))return!![];if(this[_0x4c6dba(0x4ef)](_0x4d8f13))return!![];}}}return![];},Input['isGamepadButtonPressed']=function(_0x107114){const _0xd1a5d4=_0x100070,_0x288b02=_0x107114[_0xd1a5d4(0x209)];for(let _0x3d9c9d=0x0;_0x3d9c9d<_0x288b02[_0xd1a5d4(0x1ba)];_0x3d9c9d++){if(_0x288b02[_0x3d9c9d][_0xd1a5d4(0x7e5)])return!![];}return![];},Input[_0x100070(0x4ef)]=function(_0x1cf97d){const _0x2707cc=_0x1cf97d['axes'],_0x46c023=0.5;if(_0x2707cc[0x0]<-_0x46c023)return!![];if(_0x2707cc[0x0]>_0x46c023)return!![];if(_0x2707cc[0x1]<-_0x46c023)return!![];if(_0x2707cc[0x1]>_0x46c023)return!![];return![];},Input[_0x100070(0x748)]=function(){const _0x5afa56=_0x100070;return this[_0x5afa56(0x11d)]||null;},Input['setLastGamepadUsed']=function(_0x4ebc23){const _0x36f906=_0x100070;this[_0x36f906(0x11d)]=_0x4ebc23;},VisuMZ[_0x100070(0x785)]['Input_updateGamepadState']=Input['_updateGamepadState'],Input[_0x100070(0x3f5)]=function(_0x91ee85){const _0x4988f2=_0x100070;VisuMZ[_0x4988f2(0x785)][_0x4988f2(0x3d0)][_0x4988f2(0x703)](this,_0x91ee85),(this[_0x4988f2(0x1a4)](_0x91ee85)||this[_0x4988f2(0x4ef)](_0x91ee85))&&this[_0x4988f2(0x232)](_0x91ee85);},Input[_0x100070(0x189)]=function(){const _0x443eae=_0x100070;return this[_0x443eae(0x11d)]?this[_0x443eae(0x11d)]['id']:'Keyboard';},VisuMZ[_0x100070(0x785)][_0x100070(0x7c4)]=Tilemap[_0x100070(0x7ae)][_0x100070(0x39a)],Tilemap[_0x100070(0x7ae)]['_addShadow']=function(_0x197c51,_0x4b4bd0,_0x449060,_0x122e58){const _0x591ce8=_0x100070;if($gameMap&&$gameMap[_0x591ce8(0x780)]())return;VisuMZ['CoreEngine'][_0x591ce8(0x7c4)][_0x591ce8(0x703)](this,_0x197c51,_0x4b4bd0,_0x449060,_0x122e58);},Tilemap[_0x100070(0x2d9)]['prototype']['_createInternalTextures']=function(){const _0x4ba040=_0x100070;this[_0x4ba040(0x804)]();for(let _0x2e59ef=0x0;_0x2e59ef<Tilemap['Layer']['MAX_GL_TEXTURES'];_0x2e59ef++){const _0x355fd4=new PIXI['BaseTexture']();_0x355fd4['setSize'](0x800,0x800),VisuMZ[_0x4ba040(0x785)][_0x4ba040(0x598)][_0x4ba040(0x1f9)][_0x4ba040(0x198)]&&(_0x355fd4[_0x4ba040(0x5bc)]=PIXI['SCALE_MODES'][_0x4ba040(0x4bf)]),this['_internalTextures']['push'](_0x355fd4);}},WindowLayer[_0x100070(0x7ae)][_0x100070(0x674)]=function(){const _0x43595f=_0x100070;return SceneManager&&SceneManager[_0x43595f(0x196)]?SceneManager[_0x43595f(0x196)][_0x43595f(0x373)]():!![];},VisuMZ[_0x100070(0x785)]['WindowLayer_render']=WindowLayer[_0x100070(0x7ae)]['render'],WindowLayer['prototype']['render']=function render(_0x37fa82){const _0x137493=_0x100070;this['isMaskingEnabled']()?VisuMZ['CoreEngine']['WindowLayer_render'][_0x137493(0x703)](this,_0x37fa82):this[_0x137493(0xf0)](_0x37fa82);},WindowLayer['prototype']['renderNoMask']=function render(_0x85620d){const _0x216df7=_0x100070;if(!this['visible'])return;const _0x34aa14=new PIXI['Graphics'](),_0xa7f9d7=_0x85620d['gl'],_0x1475c2=this[_0x216df7(0x149)]['clone']();_0x85620d[_0x216df7(0x721)][_0x216df7(0x7a5)](),_0x34aa14[_0x216df7(0x65b)]=this[_0x216df7(0x65b)],_0x85620d[_0x216df7(0x1f8)][_0x216df7(0x7af)](),_0xa7f9d7[_0x216df7(0x77a)](_0xa7f9d7[_0x216df7(0x5eb)]);while(_0x1475c2[_0x216df7(0x1ba)]>0x0){const _0xea817c=_0x1475c2[_0x216df7(0x653)]();_0xea817c[_0x216df7(0x6dd)]&&_0xea817c['visible']&&_0xea817c[_0x216df7(0x6b3)]>0x0&&(_0xa7f9d7[_0x216df7(0x85f)](_0xa7f9d7['EQUAL'],0x0,~0x0),_0xa7f9d7[_0x216df7(0x499)](_0xa7f9d7[_0x216df7(0x35a)],_0xa7f9d7[_0x216df7(0x35a)],_0xa7f9d7[_0x216df7(0x35a)]),_0xea817c[_0x216df7(0x86b)](_0x85620d),_0x85620d['batch'][_0x216df7(0x7af)](),_0x34aa14[_0x216df7(0x85d)](),_0xa7f9d7[_0x216df7(0x85f)](_0xa7f9d7[_0x216df7(0xc0)],0x1,~0x0),_0xa7f9d7[_0x216df7(0x499)](_0xa7f9d7[_0x216df7(0x555)],_0xa7f9d7[_0x216df7(0x555)],_0xa7f9d7['REPLACE']),_0xa7f9d7[_0x216df7(0x309)](_0xa7f9d7[_0x216df7(0x39e)],_0xa7f9d7[_0x216df7(0x44e)]),_0x34aa14[_0x216df7(0x86b)](_0x85620d),_0x85620d['batch'][_0x216df7(0x7af)](),_0xa7f9d7[_0x216df7(0x309)](_0xa7f9d7[_0x216df7(0x44e)],_0xa7f9d7[_0x216df7(0x130)]));}_0xa7f9d7[_0x216df7(0x582)](_0xa7f9d7['STENCIL_TEST']),_0xa7f9d7[_0x216df7(0x85d)](_0xa7f9d7[_0x216df7(0x59f)]),_0xa7f9d7[_0x216df7(0x626)](0x0),_0x85620d['batch'][_0x216df7(0x7af)]();for(const _0x37c105 of this['children']){!_0x37c105[_0x216df7(0x6dd)]&&_0x37c105[_0x216df7(0x803)]&&_0x37c105[_0x216df7(0x86b)](_0x85620d);}_0x85620d['batch'][_0x216df7(0x7af)]();},DataManager[_0x100070(0x869)]=function(_0x378d28){const _0x3e988d=_0x100070;return this['isItem'](_0x378d28)&&_0x378d28[_0x3e988d(0x25b)]===0x2;},VisuMZ[_0x100070(0x785)][_0x100070(0x3e6)]=DataManager[_0x100070(0x398)],DataManager[_0x100070(0x398)]=function(){const _0x1118f3=_0x100070;VisuMZ[_0x1118f3(0x785)][_0x1118f3(0x3e6)][_0x1118f3(0x703)](this),this['reservePlayTestNewGameCommonEvent'](),this[_0x1118f3(0x61d)]();},DataManager['reservePlayTestNewGameCommonEvent']=function(){const _0x472901=_0x100070;if($gameTemp[_0x472901(0x16d)]()){const _0x29b7af=VisuMZ[_0x472901(0x785)][_0x472901(0x598)][_0x472901(0x1f9)]['NewGameCommonEvent'];if(_0x29b7af>0x0)$gameTemp[_0x472901(0x3bb)](_0x29b7af);}},DataManager['reserveNewGameCommonEvent']=function(){const _0x47f16f=_0x100070,_0x154a34=VisuMZ[_0x47f16f(0x785)]['Settings'][_0x47f16f(0x1f9)][_0x47f16f(0x4fc)]||0x0;if(_0x154a34>0x0)$gameTemp[_0x47f16f(0x3bb)](_0x154a34);},DataManager[_0x100070(0x644)]=function(_0x691a1e){const _0x17b478=_0x100070,_0x336cc2=$dataTroops[_0x691a1e];if(!_0x336cc2)return'';let _0x45986e='';_0x45986e+=_0x336cc2[_0x17b478(0x554)];for(const _0x41c4f3 of _0x336cc2[_0x17b478(0x20f)]){for(const _0xa71397 of _0x41c4f3['list']){[0x6c,0x198][_0x17b478(0x4c7)](_0xa71397['code'])&&(_0x45986e+='\x0a',_0x45986e+=_0xa71397[_0x17b478(0x595)][0x0]);}}return _0x45986e;};(VisuMZ[_0x100070(0x785)]['Settings']['QoL']['ShortcutScripts']??!![])&&($scene=null,VisuMZ[_0x100070(0x785)][_0x100070(0x3fa)]=Scene_Base[_0x100070(0x7ae)]['create'],Scene_Base[_0x100070(0x7ae)][_0x100070(0x68d)]=function(){const _0x579f23=_0x100070;VisuMZ[_0x579f23(0x785)][_0x579f23(0x3fa)][_0x579f23(0x703)](this),$scene=this;},$spriteset=null,VisuMZ['CoreEngine']['Scene_Map_createSpriteset']=Scene_Map[_0x100070(0x7ae)]['createSpriteset'],Scene_Map['prototype'][_0x100070(0x7ad)]=function(){const _0x1c926a=_0x100070;VisuMZ[_0x1c926a(0x785)][_0x1c926a(0x2c0)][_0x1c926a(0x703)](this),$spriteset=this[_0x1c926a(0x3a3)];},VisuMZ[_0x100070(0x785)]['Scene_Battle_createSpriteset']=Scene_Battle[_0x100070(0x7ae)][_0x100070(0x7ad)],Scene_Battle[_0x100070(0x7ae)][_0x100070(0x7ad)]=function(){const _0x53d52f=_0x100070;VisuMZ[_0x53d52f(0x785)][_0x53d52f(0xbe)][_0x53d52f(0x703)](this),$spriteset=this[_0x53d52f(0x3a3)];},VisuMZ[_0x100070(0x785)][_0x100070(0x55f)]=Scene_Base[_0x100070(0x7ae)][_0x100070(0x697)],Scene_Base[_0x100070(0x7ae)][_0x100070(0x697)]=function(){const _0x3645e3=_0x100070;VisuMZ[_0x3645e3(0x785)][_0x3645e3(0x55f)]['call'](this),$spriteset=null,$subject=null,$targets=null,$target=null;},$subject=null,$targets=null,$target=null,VisuMZ[_0x100070(0x785)][_0x100070(0x2b0)]=BattleManager[_0x100070(0x723)],BattleManager[_0x100070(0x723)]=function(_0x774864){const _0x4ae56b=_0x100070;VisuMZ['CoreEngine'][_0x4ae56b(0x2b0)][_0x4ae56b(0x703)](this,_0x774864),this['updateBattleVariables']();},BattleManager[_0x100070(0x240)]=function(){const _0x4eeff1=_0x100070;$subject=this[_0x4eeff1(0x357)],$targets=this[_0x4eeff1(0xd9)],$target=this['_target']||this[_0x4eeff1(0xd9)][0x0];},$event=null,VisuMZ['CoreEngine'][_0x100070(0x2fd)]=Game_Event[_0x100070(0x7ae)][_0x100070(0x18d)],Game_Event[_0x100070(0x7ae)]['start']=function(){VisuMZ['CoreEngine']['Game_Event_start']['call'](this),$event=this;},VisuMZ[_0x100070(0x785)][_0x100070(0x43b)]=Scene_Map[_0x100070(0x7ae)][_0x100070(0x723)],Scene_Map['prototype'][_0x100070(0x723)]=function(){const _0x1e0e8a=_0x100070;VisuMZ[_0x1e0e8a(0x785)][_0x1e0e8a(0x43b)][_0x1e0e8a(0x703)](this),$gameMap[_0x1e0e8a(0x613)]();},Game_Map[_0x100070(0x7ae)][_0x100070(0x613)]=function(){const _0x100c41=_0x100070;!this[_0x100c41(0x162)]()&&$event!==null&&($event=null);},$commonEvent=function(_0x4f035f){const _0x250d48=_0x100070;if($gameTemp)$gameTemp[_0x250d48(0x3bb)](_0x4f035f);});;$onceParallel=function(_0x19855f,_0x2f54b2){const _0x38c3f8=_0x100070;if(SceneManager[_0x38c3f8(0x177)]())SceneManager['_scene'][_0x38c3f8(0x578)](_0x19855f,_0x2f54b2);else{if(SceneManager[_0x38c3f8(0x30e)]()){if(Imported[_0x38c3f8(0x681)])SceneManager[_0x38c3f8(0x196)][_0x38c3f8(0x578)](_0x19855f);else $gameTemp&&$gameTemp[_0x38c3f8(0x16d)]()&&alert(_0x38c3f8(0x63e));}else $gameTemp&&$gameTemp[_0x38c3f8(0x16d)]()&&alert(_0x38c3f8(0x56c));}},StorageManager[_0x100070(0x46f)]=function(_0x388163){return new Promise((_0x3db3ff,_0x24a39)=>{const _0x17d05b=_0x7e7c;try{const _0x473e2b=pako[_0x17d05b(0x14a)](_0x388163,{'to':_0x17d05b(0xdc),'level':0x1});if(_0x473e2b[_0x17d05b(0x1ba)]>=0xc350){}_0x3db3ff(_0x473e2b);}catch(_0x214786){_0x24a39(_0x214786);}});},TextManager[_0x100070(0xd0)]=['','','',_0x100070(0x45a),'','',_0x100070(0x16f),'',_0x100070(0x163),_0x100070(0x444),'','',_0x100070(0x32c),_0x100070(0x291),'ENTER_SPECIAL','','SHIFT',_0x100070(0x389),'ALT','PAUSE',_0x100070(0x89d),_0x100070(0x3d8),_0x100070(0x5f8),_0x100070(0x504),'FINAL',_0x100070(0x4a9),'',_0x100070(0x3c9),'CONVERT',_0x100070(0x6c6),'ACCEPT','MODECHANGE',_0x100070(0x783),_0x100070(0x440),_0x100070(0x37c),_0x100070(0x672),_0x100070(0x105),_0x100070(0x657),'UP',_0x100070(0x2fc),'DOWN',_0x100070(0x609),_0x100070(0x331),_0x100070(0x305),_0x100070(0x21d),'INSERT',_0x100070(0x35c),'','0','1','2','3','4','5','6','7','8','9','COLON',_0x100070(0x7f8),_0x100070(0x106),_0x100070(0x3e0),'GREATER_THAN',_0x100070(0x124),'AT','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',_0x100070(0x822),'','CONTEXT_MENU','',_0x100070(0x52b),_0x100070(0x458),'NUMPAD1',_0x100070(0xda),_0x100070(0x6ae),_0x100070(0x442),_0x100070(0x1f2),_0x100070(0x686),_0x100070(0x572),_0x100070(0x88a),'NUMPAD9',_0x100070(0xeb),_0x100070(0x1b1),_0x100070(0x372),_0x100070(0x1b6),_0x100070(0xcb),'DIVIDE','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10',_0x100070(0x4cc),'F12','F13','F14',_0x100070(0x604),_0x100070(0x480),_0x100070(0x3c0),_0x100070(0x643),_0x100070(0x483),_0x100070(0x4de),_0x100070(0x18c),_0x100070(0x58f),_0x100070(0xca),_0x100070(0x302),'','','','','','','','',_0x100070(0x77e),_0x100070(0x7f5),'WIN_OEM_FJ_JISHO',_0x100070(0x2ee),_0x100070(0x58c),'WIN_OEM_FJ_LOYA',_0x100070(0x852),'','','','','','','','','','CIRCUMFLEX',_0x100070(0x586),_0x100070(0x3fc),'HASH',_0x100070(0x21f),'PERCENT',_0x100070(0x7c3),_0x100070(0x843),'OPEN_PAREN','CLOSE_PAREN',_0x100070(0x28c),_0x100070(0x7d5),'PIPE',_0x100070(0x710),_0x100070(0x2af),'CLOSE_CURLY_BRACKET',_0x100070(0x614),'','','','',_0x100070(0x44f),_0x100070(0x7cf),_0x100070(0x6f6),'','',_0x100070(0x7f8),_0x100070(0x3e0),_0x100070(0x33c),'MINUS',_0x100070(0x1b7),_0x100070(0x298),_0x100070(0x37f),'','','','','','','','','','','','','','','','','','','','','','','','','','',_0x100070(0x6f8),'BACK_SLASH','CLOSE_BRACKET',_0x100070(0x7c0),'','META',_0x100070(0x776),'',_0x100070(0x6b9),'WIN_ICO_00','','WIN_ICO_CLEAR','','',_0x100070(0x518),'WIN_OEM_JUMP',_0x100070(0x2ca),'WIN_OEM_PA2','WIN_OEM_PA3','WIN_OEM_WSCTRL',_0x100070(0x496),_0x100070(0x61e),'WIN_OEM_FINISH',_0x100070(0x4b8),_0x100070(0x69a),_0x100070(0x295),'WIN_OEM_BACKTAB',_0x100070(0x752),_0x100070(0x31f),'EXSEL','EREOF',_0x100070(0x5ca),_0x100070(0xce),'',_0x100070(0x662),_0x100070(0x87d),''],TextManager[_0x100070(0x112)]=VisuMZ['CoreEngine'][_0x100070(0x598)][_0x100070(0x7ea)]['OkText'],TextManager['buttonAssistCancel']=VisuMZ[_0x100070(0x785)]['Settings'][_0x100070(0x7ea)][_0x100070(0x2a1)],TextManager[_0x100070(0x591)]=VisuMZ['CoreEngine'][_0x100070(0x598)][_0x100070(0x7ea)]['SwitchActorText'],VisuMZ[_0x100070(0x785)][_0x100070(0x5f2)]=TextManager[_0x100070(0x79a)],TextManager[_0x100070(0x79a)]=function(_0xe819f3){const _0x45f028=_0x100070;return typeof _0xe819f3==='number'?VisuMZ[_0x45f028(0x785)][_0x45f028(0x5f2)][_0x45f028(0x703)](this,_0xe819f3):this[_0x45f028(0x479)](_0xe819f3);},TextManager[_0x100070(0x479)]=function(_0x3d6c7f){const _0x24be44=_0x100070;_0x3d6c7f=String(_0x3d6c7f||'')[_0x24be44(0x4f4)]();const _0xf74b36=VisuMZ['CoreEngine'][_0x24be44(0x598)][_0x24be44(0x7a7)];if(_0x3d6c7f===_0x24be44(0xbd))return $dataSystem[_0x24be44(0x125)][_0x24be44(0x138)][0x0];if(_0x3d6c7f===_0x24be44(0xe1))return $dataSystem[_0x24be44(0x125)]['params'][0x1];if(_0x3d6c7f===_0x24be44(0x431))return $dataSystem[_0x24be44(0x125)]['params'][0x2];if(_0x3d6c7f==='DEF')return $dataSystem[_0x24be44(0x125)]['params'][0x3];if(_0x3d6c7f===_0x24be44(0x84a))return $dataSystem[_0x24be44(0x125)][_0x24be44(0x138)][0x4];if(_0x3d6c7f===_0x24be44(0x187))return $dataSystem[_0x24be44(0x125)][_0x24be44(0x138)][0x5];if(_0x3d6c7f===_0x24be44(0x587))return $dataSystem[_0x24be44(0x125)]['params'][0x6];if(_0x3d6c7f===_0x24be44(0x50b))return $dataSystem[_0x24be44(0x125)][_0x24be44(0x138)][0x7];if(_0x3d6c7f===_0x24be44(0x5cd))return _0xf74b36['XParamVocab0'];if(_0x3d6c7f===_0x24be44(0x22c))return _0xf74b36[_0x24be44(0x315)];if(_0x3d6c7f===_0x24be44(0x5f0))return _0xf74b36[_0x24be44(0x453)];if(_0x3d6c7f===_0x24be44(0x6e4))return _0xf74b36[_0x24be44(0x3a9)];if(_0x3d6c7f===_0x24be44(0x3ae))return _0xf74b36[_0x24be44(0x729)];if(_0x3d6c7f===_0x24be44(0x535))return _0xf74b36[_0x24be44(0x846)];if(_0x3d6c7f===_0x24be44(0x415))return _0xf74b36[_0x24be44(0x427)];if(_0x3d6c7f==='HRG')return _0xf74b36[_0x24be44(0x6c1)];if(_0x3d6c7f===_0x24be44(0x55d))return _0xf74b36[_0x24be44(0x47e)];if(_0x3d6c7f==='TRG')return _0xf74b36[_0x24be44(0x376)];if(_0x3d6c7f===_0x24be44(0x845))return _0xf74b36[_0x24be44(0x74f)];if(_0x3d6c7f===_0x24be44(0x488))return _0xf74b36[_0x24be44(0x137)];if(_0x3d6c7f==='REC')return _0xf74b36[_0x24be44(0x2e2)];if(_0x3d6c7f===_0x24be44(0x4c8))return _0xf74b36[_0x24be44(0x29f)];if(_0x3d6c7f===_0x24be44(0x2ec))return _0xf74b36[_0x24be44(0x2a0)];if(_0x3d6c7f===_0x24be44(0x87f))return _0xf74b36[_0x24be44(0x734)];if(_0x3d6c7f===_0x24be44(0x5ba))return _0xf74b36['SParamVocab6'];if(_0x3d6c7f===_0x24be44(0x368))return _0xf74b36[_0x24be44(0x6bc)];if(_0x3d6c7f===_0x24be44(0x81d))return _0xf74b36['SParamVocab8'];if(_0x3d6c7f===_0x24be44(0xb5))return _0xf74b36['SParamVocab9'];if(VisuMZ[_0x24be44(0x785)]['CustomParamNames'][_0x3d6c7f])return VisuMZ[_0x24be44(0x785)][_0x24be44(0x363)][_0x3d6c7f];return'';},TextManager[_0x100070(0x59b)]=function(_0x506302){const _0x266cc9=_0x100070,_0x1d643a=Input[_0x266cc9(0x189)]();return _0x1d643a===_0x266cc9(0x214)?this['getKeyboardInputButtonString'](_0x506302):this[_0x266cc9(0x320)](_0x1d643a,_0x506302);},TextManager[_0x100070(0x11e)]=function(_0x44ff4a){const _0xab3fdb=_0x100070;let _0x5a53c5=VisuMZ[_0xab3fdb(0x785)][_0xab3fdb(0x598)]['ButtonAssist'][_0xab3fdb(0xc8)];if(!_0x5a53c5){if(_0x44ff4a===_0xab3fdb(0x44a))_0x44ff4a=_0xab3fdb(0x2e4);if(_0x44ff4a===_0xab3fdb(0x1c9))_0x44ff4a=_0xab3fdb(0x2e4);}let _0x3ddea4=[];for(let _0x3854bc in Input[_0xab3fdb(0x817)]){_0x3854bc=Number(_0x3854bc);if(_0x3854bc>=0x60&&_0x3854bc<=0x69)continue;if([0x12,0x20][_0xab3fdb(0x4c7)](_0x3854bc))continue;_0x44ff4a===Input[_0xab3fdb(0x817)][_0x3854bc]&&_0x3ddea4[_0xab3fdb(0x443)](_0x3854bc);}for(let _0x49dac5=0x0;_0x49dac5<_0x3ddea4[_0xab3fdb(0x1ba)];_0x49dac5++){_0x3ddea4[_0x49dac5]=TextManager[_0xab3fdb(0xd0)][_0x3ddea4[_0x49dac5]];}return this[_0xab3fdb(0x889)](_0x3ddea4);},TextManager[_0x100070(0x889)]=function(_0x33dc5b){const _0x2ac461=_0x100070,_0x26ba67=VisuMZ[_0x2ac461(0x785)][_0x2ac461(0x598)]['ButtonAssist'],_0x47465e=_0x26ba67[_0x2ac461(0x39f)];let _0x32ac23='';if(_0x33dc5b[_0x2ac461(0x4c7)]('UP'))_0x32ac23='UP';else{if(_0x33dc5b[_0x2ac461(0x4c7)](_0x2ac461(0x184)))_0x32ac23=_0x2ac461(0x184);else{if(_0x33dc5b['includes'](_0x2ac461(0x657)))_0x32ac23='LEFT';else _0x33dc5b[_0x2ac461(0x4c7)]('RIGHT')?_0x32ac23=_0x2ac461(0x2fc):_0x32ac23=_0x33dc5b[_0x2ac461(0x146)]();}}const _0xac0684='Key%1'[_0x2ac461(0x4fd)](_0x32ac23);return _0x26ba67[_0xac0684]?_0x26ba67[_0xac0684]:_0x47465e[_0x2ac461(0x4fd)](_0x32ac23);},TextManager['getInputMultiButtonStrings']=function(_0x3bfc3b,_0xd9b3ba){const _0x5ab9cd=_0x100070,_0x1c531f=VisuMZ[_0x5ab9cd(0x785)][_0x5ab9cd(0x598)][_0x5ab9cd(0x7ea)],_0x3bf7e4=_0x1c531f[_0x5ab9cd(0x82d)],_0x1cb6bc=this[_0x5ab9cd(0x59b)](_0x3bfc3b),_0xb1265a=this[_0x5ab9cd(0x59b)](_0xd9b3ba);return _0x3bf7e4[_0x5ab9cd(0x4fd)](_0x1cb6bc,_0xb1265a);},TextManager[_0x100070(0x320)]=function(_0x4c6266,_0x3f81bc){const _0x43e814=_0x100070,_0x4ec734=_0x4c6266[_0x43e814(0x1d4)]()[_0x43e814(0x60f)](),_0x4ff1e2=VisuMZ[_0x43e814(0x785)][_0x43e814(0x1c4)][_0x4ec734];if(!_0x4ff1e2)return this[_0x43e814(0x377)](_0x4c6266,_0x3f81bc);return _0x4ff1e2[_0x3f81bc]||this[_0x43e814(0x11e)](_0x4c6266,_0x3f81bc);},TextManager[_0x100070(0x377)]=function(_0x2bbb25,_0x3649ca){const _0x4d0257=_0x100070,_0x41a0a6=_0x2bbb25[_0x4d0257(0x1d4)]()[_0x4d0257(0x60f)]();for(const _0x4b5dd5 in VisuMZ[_0x4d0257(0x785)][_0x4d0257(0x27f)]){if(_0x41a0a6['includes'](_0x4b5dd5)){const _0x1b0cbc=VisuMZ[_0x4d0257(0x785)][_0x4d0257(0x27f)][_0x4b5dd5],_0x3d6d26=VisuMZ[_0x4d0257(0x785)][_0x4d0257(0x1c4)][_0x1b0cbc];return _0x3d6d26[_0x3649ca]||this['getKeyboardInputButtonString'](_0x3649ca);}}return this[_0x4d0257(0x11e)](_0x3649ca);},VisuMZ[_0x100070(0x785)][_0x100070(0x5d4)]=ColorManager[_0x100070(0x5ab)],ColorManager['loadWindowskin']=function(){const _0x1f96fd=_0x100070;VisuMZ[_0x1f96fd(0x785)][_0x1f96fd(0x5d4)]['call'](this),this[_0x1f96fd(0x823)]=this[_0x1f96fd(0x823)]||{};},ColorManager['getColorDataFromPluginParameters']=function(_0x2480d5,_0x177bf2){const _0x192fea=_0x100070;return _0x177bf2=String(_0x177bf2),this[_0x192fea(0x823)]=this[_0x192fea(0x823)]||{},_0x177bf2['match'](/#(.*)/i)?this['_colorCache'][_0x2480d5]=_0x192fea(0x203)[_0x192fea(0x4fd)](String(RegExp['$1'])):this['_colorCache'][_0x2480d5]=this[_0x192fea(0x178)](Number(_0x177bf2)),this['_colorCache'][_0x2480d5];},ColorManager[_0x100070(0x27b)]=function(_0x176332){const _0x203cab=_0x100070;return _0x176332=String(_0x176332),_0x176332[_0x203cab(0x4aa)](/#(.*)/i)?_0x203cab(0x203)['format'](String(RegExp['$1'])):this['textColor'](Number(_0x176332));},ColorManager[_0x100070(0xc2)]=function(){this['_colorCache']={};},ColorManager[_0x100070(0x285)]=function(){const _0x32504c=_0x100070,_0x55f516=_0x32504c(0x795);this[_0x32504c(0x823)]=this['_colorCache']||{};if(this[_0x32504c(0x823)][_0x55f516])return this[_0x32504c(0x823)][_0x55f516];const _0x158f30=VisuMZ[_0x32504c(0x785)][_0x32504c(0x598)][_0x32504c(0x87c)][_0x32504c(0x4e1)];return this['getColorDataFromPluginParameters'](_0x55f516,_0x158f30);},ColorManager[_0x100070(0x414)]=function(){const _0x215d17=_0x100070,_0xd1c418=_0x215d17(0x6cb);this[_0x215d17(0x823)]=this[_0x215d17(0x823)]||{};if(this[_0x215d17(0x823)][_0xd1c418])return this[_0x215d17(0x823)][_0xd1c418];const _0x52df8b=VisuMZ['CoreEngine'][_0x215d17(0x598)]['Color']['ColorSystem'];return this[_0x215d17(0x6b7)](_0xd1c418,_0x52df8b);},ColorManager['crisisColor']=function(){const _0x2a9cde=_0x100070,_0x4635db='_stored_crisisColor';this[_0x2a9cde(0x823)]=this['_colorCache']||{};if(this[_0x2a9cde(0x823)][_0x4635db])return this[_0x2a9cde(0x823)][_0x4635db];const _0x3b9bfd=VisuMZ[_0x2a9cde(0x785)][_0x2a9cde(0x598)][_0x2a9cde(0x87c)][_0x2a9cde(0x1b2)];return this['getColorDataFromPluginParameters'](_0x4635db,_0x3b9bfd);},ColorManager[_0x100070(0x546)]=function(){const _0x7c7fac=_0x100070,_0xefc2e4=_0x7c7fac(0x13d);this[_0x7c7fac(0x823)]=this[_0x7c7fac(0x823)]||{};if(this[_0x7c7fac(0x823)][_0xefc2e4])return this[_0x7c7fac(0x823)][_0xefc2e4];const _0x54f9f0=VisuMZ['CoreEngine'][_0x7c7fac(0x598)][_0x7c7fac(0x87c)][_0x7c7fac(0x80a)];return this[_0x7c7fac(0x6b7)](_0xefc2e4,_0x54f9f0);},ColorManager[_0x100070(0x345)]=function(){const _0x375d41=_0x100070,_0x29721b=_0x375d41(0x24b);this[_0x375d41(0x823)]=this[_0x375d41(0x823)]||{};if(this[_0x375d41(0x823)][_0x29721b])return this[_0x375d41(0x823)][_0x29721b];const _0x3ed425=VisuMZ[_0x375d41(0x785)][_0x375d41(0x598)][_0x375d41(0x87c)][_0x375d41(0x6db)];return this[_0x375d41(0x6b7)](_0x29721b,_0x3ed425);},ColorManager['hpGaugeColor1']=function(){const _0x1dce2b=_0x100070,_0x391a04='_stored_hpGaugeColor1';this['_colorCache']=this[_0x1dce2b(0x823)]||{};if(this[_0x1dce2b(0x823)][_0x391a04])return this[_0x1dce2b(0x823)][_0x391a04];const _0x3b18d8=VisuMZ[_0x1dce2b(0x785)]['Settings'][_0x1dce2b(0x87c)][_0x1dce2b(0x324)];return this[_0x1dce2b(0x6b7)](_0x391a04,_0x3b18d8);},ColorManager[_0x100070(0x53c)]=function(){const _0x5bd17e=_0x100070,_0x56fd8b=_0x5bd17e(0x577);this[_0x5bd17e(0x823)]=this[_0x5bd17e(0x823)]||{};if(this[_0x5bd17e(0x823)][_0x56fd8b])return this[_0x5bd17e(0x823)][_0x56fd8b];const _0x2c14c9=VisuMZ[_0x5bd17e(0x785)]['Settings'][_0x5bd17e(0x87c)][_0x5bd17e(0x766)];return this[_0x5bd17e(0x6b7)](_0x56fd8b,_0x2c14c9);},ColorManager[_0x100070(0x583)]=function(){const _0x5c3405=_0x100070,_0x3f38d3=_0x5c3405(0x69d);this[_0x5c3405(0x823)]=this[_0x5c3405(0x823)]||{};if(this[_0x5c3405(0x823)][_0x3f38d3])return this['_colorCache'][_0x3f38d3];const _0x22cbd8=VisuMZ['CoreEngine'][_0x5c3405(0x598)][_0x5c3405(0x87c)][_0x5c3405(0x743)];return this[_0x5c3405(0x6b7)](_0x3f38d3,_0x22cbd8);},ColorManager[_0x100070(0x3ff)]=function(){const _0x27be9b=_0x100070,_0x437e23=_0x27be9b(0x880);this['_colorCache']=this[_0x27be9b(0x823)]||{};if(this['_colorCache'][_0x437e23])return this[_0x27be9b(0x823)][_0x437e23];const _0x2663ba=VisuMZ[_0x27be9b(0x785)][_0x27be9b(0x598)][_0x27be9b(0x87c)]['ColorMPGauge2'];return this['getColorDataFromPluginParameters'](_0x437e23,_0x2663ba);},ColorManager[_0x100070(0x2d4)]=function(){const _0x2d049f=_0x100070,_0x41212a='_stored_mpCostColor';this[_0x2d049f(0x823)]=this[_0x2d049f(0x823)]||{};if(this[_0x2d049f(0x823)][_0x41212a])return this[_0x2d049f(0x823)][_0x41212a];const _0x2ecaf7=VisuMZ[_0x2d049f(0x785)][_0x2d049f(0x598)][_0x2d049f(0x87c)][_0x2d049f(0x70c)];return this[_0x2d049f(0x6b7)](_0x41212a,_0x2ecaf7);},ColorManager[_0x100070(0x202)]=function(){const _0x2d1615=_0x100070,_0xad5c02=_0x2d1615(0x88e);this[_0x2d1615(0x823)]=this[_0x2d1615(0x823)]||{};if(this['_colorCache'][_0xad5c02])return this[_0x2d1615(0x823)][_0xad5c02];const _0x74d4d2=VisuMZ[_0x2d1615(0x785)]['Settings'][_0x2d1615(0x87c)][_0x2d1615(0x103)];return this[_0x2d1615(0x6b7)](_0xad5c02,_0x74d4d2);},ColorManager['powerDownColor']=function(){const _0x138ae3=_0x100070,_0xc0e7ce=_0x138ae3(0x854);this['_colorCache']=this['_colorCache']||{};if(this['_colorCache'][_0xc0e7ce])return this[_0x138ae3(0x823)][_0xc0e7ce];const _0x24c170=VisuMZ['CoreEngine'][_0x138ae3(0x598)][_0x138ae3(0x87c)][_0x138ae3(0x82f)];return this['getColorDataFromPluginParameters'](_0xc0e7ce,_0x24c170);},ColorManager[_0x100070(0x44d)]=function(){const _0x34dcc7=_0x100070,_0x3cbc77='_stored_ctGaugeColor1';this['_colorCache']=this[_0x34dcc7(0x823)]||{};if(this['_colorCache'][_0x3cbc77])return this[_0x34dcc7(0x823)][_0x3cbc77];const _0x362632=VisuMZ[_0x34dcc7(0x785)][_0x34dcc7(0x598)]['Color'][_0x34dcc7(0x403)];return this[_0x34dcc7(0x6b7)](_0x3cbc77,_0x362632);},ColorManager[_0x100070(0x579)]=function(){const _0x3fda3a=_0x100070,_0x1a9843=_0x3fda3a(0x168);this[_0x3fda3a(0x823)]=this[_0x3fda3a(0x823)]||{};if(this['_colorCache'][_0x1a9843])return this[_0x3fda3a(0x823)][_0x1a9843];const _0x511619=VisuMZ[_0x3fda3a(0x785)]['Settings'][_0x3fda3a(0x87c)][_0x3fda3a(0x6be)];return this[_0x3fda3a(0x6b7)](_0x1a9843,_0x511619);},ColorManager[_0x100070(0x64a)]=function(){const _0x910d79=_0x100070,_0x21660b=_0x910d79(0x4d2);this[_0x910d79(0x823)]=this['_colorCache']||{};if(this[_0x910d79(0x823)][_0x21660b])return this[_0x910d79(0x823)][_0x21660b];const _0x14a3de=VisuMZ[_0x910d79(0x785)][_0x910d79(0x598)][_0x910d79(0x87c)][_0x910d79(0x190)];return this[_0x910d79(0x6b7)](_0x21660b,_0x14a3de);},ColorManager[_0x100070(0x560)]=function(){const _0x1b5ce6=_0x100070,_0x577e31=_0x1b5ce6(0x32b);this[_0x1b5ce6(0x823)]=this[_0x1b5ce6(0x823)]||{};if(this[_0x1b5ce6(0x823)][_0x577e31])return this[_0x1b5ce6(0x823)][_0x577e31];const _0x18bd7e=VisuMZ[_0x1b5ce6(0x785)][_0x1b5ce6(0x598)][_0x1b5ce6(0x87c)][_0x1b5ce6(0x59e)];return this['getColorDataFromPluginParameters'](_0x577e31,_0x18bd7e);},ColorManager['tpCostColor']=function(){const _0x2a5db6=_0x100070,_0xf4cdb1=_0x2a5db6(0x4c4);this[_0x2a5db6(0x823)]=this[_0x2a5db6(0x823)]||{};if(this['_colorCache'][_0xf4cdb1])return this['_colorCache'][_0xf4cdb1];const _0x7020df=VisuMZ[_0x2a5db6(0x785)]['Settings'][_0x2a5db6(0x87c)]['ColorTPCost'];return this[_0x2a5db6(0x6b7)](_0xf4cdb1,_0x7020df);},ColorManager[_0x100070(0x1c5)]=function(){const _0x449b79=_0x100070,_0x27ecbe=_0x449b79(0x411);this[_0x449b79(0x823)]=this[_0x449b79(0x823)]||{};if(this[_0x449b79(0x823)][_0x27ecbe])return this[_0x449b79(0x823)][_0x27ecbe];const _0x19a8f8=VisuMZ['CoreEngine']['Settings'][_0x449b79(0x87c)][_0x449b79(0x3a7)];return this[_0x449b79(0x6b7)](_0x27ecbe,_0x19a8f8);},ColorManager['expGaugeColor1']=function(){const _0x32ccd0=_0x100070,_0x36464e=_0x32ccd0(0x7bb);this[_0x32ccd0(0x823)]=this[_0x32ccd0(0x823)]||{};if(this[_0x32ccd0(0x823)][_0x36464e])return this[_0x32ccd0(0x823)][_0x36464e];const _0x3621fe=VisuMZ[_0x32ccd0(0x785)][_0x32ccd0(0x598)]['Color'][_0x32ccd0(0x7a1)];return this[_0x32ccd0(0x6b7)](_0x36464e,_0x3621fe);},ColorManager[_0x100070(0x328)]=function(){const _0x34ab0b=_0x100070,_0x5bfab6=_0x34ab0b(0x89b);this['_colorCache']=this[_0x34ab0b(0x823)]||{};if(this[_0x34ab0b(0x823)][_0x5bfab6])return this[_0x34ab0b(0x823)][_0x5bfab6];const _0x20a4f4=VisuMZ[_0x34ab0b(0x785)][_0x34ab0b(0x598)][_0x34ab0b(0x87c)][_0x34ab0b(0x244)];return this['getColorDataFromPluginParameters'](_0x5bfab6,_0x20a4f4);},ColorManager['maxLvGaugeColor1']=function(){const _0x14869a=_0x100070,_0x40b355='_stored_maxLvGaugeColor1';this[_0x14869a(0x823)]=this[_0x14869a(0x823)]||{};if(this['_colorCache'][_0x40b355])return this[_0x14869a(0x823)][_0x40b355];const _0x1024c0=VisuMZ['CoreEngine'][_0x14869a(0x598)][_0x14869a(0x87c)][_0x14869a(0x147)];return this[_0x14869a(0x6b7)](_0x40b355,_0x1024c0);},ColorManager[_0x100070(0x80c)]=function(){const _0x2ecd62=_0x100070,_0x44f8b8=_0x2ecd62(0x2b1);this['_colorCache']=this[_0x2ecd62(0x823)]||{};if(this[_0x2ecd62(0x823)][_0x44f8b8])return this['_colorCache'][_0x44f8b8];const _0x1e5aa2=VisuMZ['CoreEngine'][_0x2ecd62(0x598)][_0x2ecd62(0x87c)]['ColorMaxLvGauge2'];return this['getColorDataFromPluginParameters'](_0x44f8b8,_0x1e5aa2);},ColorManager[_0x100070(0x54a)]=function(_0x5c8244){const _0x18d6d2=_0x100070;return VisuMZ[_0x18d6d2(0x785)]['Settings'][_0x18d6d2(0x87c)][_0x18d6d2(0x62c)]['call'](this,_0x5c8244);},ColorManager['mpColor']=function(_0x5b9b13){const _0x46eed1=_0x100070;return VisuMZ['CoreEngine']['Settings']['Color'][_0x46eed1(0x5b4)][_0x46eed1(0x703)](this,_0x5b9b13);},ColorManager[_0x100070(0x3e7)]=function(_0x34102a){const _0x1b38cd=_0x100070;return VisuMZ[_0x1b38cd(0x785)][_0x1b38cd(0x598)][_0x1b38cd(0x87c)][_0x1b38cd(0x47d)][_0x1b38cd(0x703)](this,_0x34102a);},ColorManager['paramchangeTextColor']=function(_0x426b50){const _0xfc7da4=_0x100070;return VisuMZ[_0xfc7da4(0x785)][_0xfc7da4(0x598)][_0xfc7da4(0x87c)][_0xfc7da4(0x57c)]['call'](this,_0x426b50);},ColorManager['damageColor']=function(_0x3dc189){const _0x4472ec=_0x100070;return VisuMZ['CoreEngine'][_0x4472ec(0x598)][_0x4472ec(0x87c)][_0x4472ec(0x101)][_0x4472ec(0x703)](this,_0x3dc189);},ColorManager[_0x100070(0x7b8)]=function(){const _0x159a8d=_0x100070;return VisuMZ[_0x159a8d(0x785)][_0x159a8d(0x598)][_0x159a8d(0x87c)][_0x159a8d(0x55a)];},ColorManager[_0x100070(0x66c)]=function(){const _0x92b3dc=_0x100070;return VisuMZ[_0x92b3dc(0x785)][_0x92b3dc(0x598)][_0x92b3dc(0x87c)][_0x92b3dc(0x1dc)]||_0x92b3dc(0x2c3);},ColorManager[_0x100070(0x1db)]=function(){const _0x12757d=_0x100070;return VisuMZ[_0x12757d(0x785)]['Settings'][_0x12757d(0x87c)][_0x12757d(0x2f6)]||_0x12757d(0x764);},ColorManager[_0x100070(0x524)]=function(){const _0x3b6fc9=_0x100070;return VisuMZ[_0x3b6fc9(0x785)][_0x3b6fc9(0x598)][_0x3b6fc9(0x87c)]['DimColor1'];},ColorManager['dimColor2']=function(){const _0x2f6fe5=_0x100070;return VisuMZ[_0x2f6fe5(0x785)][_0x2f6fe5(0x598)][_0x2f6fe5(0x87c)][_0x2f6fe5(0x5e9)];},ColorManager[_0x100070(0x754)]=function(){const _0x1afa14=_0x100070;return VisuMZ[_0x1afa14(0x785)][_0x1afa14(0x598)][_0x1afa14(0x87c)]['ItemBackColor1'];},ColorManager[_0x100070(0x539)]=function(){const _0x377406=_0x100070;return VisuMZ[_0x377406(0x785)][_0x377406(0x598)]['Color'][_0x377406(0x3ee)];},SceneManager[_0x100070(0x487)]=[],SceneManager[_0x100070(0x30e)]=function(){const _0x2133ec=_0x100070;return this[_0x2133ec(0x196)]&&this[_0x2133ec(0x196)]['constructor']===Scene_Battle;},SceneManager[_0x100070(0x177)]=function(){const _0x4ac99d=_0x100070;return this['_scene']&&this[_0x4ac99d(0x196)][_0x4ac99d(0x1f7)]===Scene_Map;},SceneManager[_0x100070(0x70a)]=function(){const _0x29a0c0=_0x100070;return this['_scene']&&this[_0x29a0c0(0x196)]instanceof Scene_Map;},VisuMZ[_0x100070(0x785)][_0x100070(0x2c1)]=SceneManager[_0x100070(0x811)],SceneManager[_0x100070(0x811)]=function(){const _0x4554ac=_0x100070;VisuMZ[_0x4554ac(0x785)][_0x4554ac(0x2c1)]['call'](this),this['initVisuMZCoreEngine']();},VisuMZ['CoreEngine'][_0x100070(0x1e9)]=SceneManager[_0x100070(0x15e)],SceneManager[_0x100070(0x15e)]=function(_0x58e645){const _0x1cf15b=_0x100070;if($gameTemp)this[_0x1cf15b(0x36d)](_0x58e645);VisuMZ['CoreEngine'][_0x1cf15b(0x1e9)][_0x1cf15b(0x703)](this,_0x58e645);},SceneManager[_0x100070(0x36d)]=function(_0x4665dd){const _0x43c0e2=_0x100070;if(!_0x4665dd[_0x43c0e2(0x511)]&&!_0x4665dd[_0x43c0e2(0x304)])switch(_0x4665dd[_0x43c0e2(0x781)]){case 0x52:this[_0x43c0e2(0x5a0)]();break;case 0x54:this[_0x43c0e2(0x806)]();break;case 0x75:this[_0x43c0e2(0x855)]();break;case 0x76:if(Input[_0x43c0e2(0x11c)]('shift')||Input[_0x43c0e2(0x11c)]('ctrl'))return;this[_0x43c0e2(0x5e6)]();break;}else{if(_0x4665dd[_0x43c0e2(0x511)]){let _0x22da27=_0x4665dd[_0x43c0e2(0x781)];if(_0x22da27>=0x31&&_0x22da27<=0x39){const _0x3c0691=_0x22da27-0x30;return SceneManager[_0x43c0e2(0x1f6)](_0x3c0691);}else{if(_0x22da27>=0x61&&_0x22da27<=0x69){const _0x4a9b2c=_0x22da27-0x60;return SceneManager[_0x43c0e2(0x1f6)](_0x4a9b2c);}}}}},SceneManager[_0x100070(0x855)]=function(){const _0x47da7d=_0x100070;if($gameTemp['isPlaytest']()&&VisuMZ[_0x47da7d(0x785)][_0x47da7d(0x598)][_0x47da7d(0x1f9)][_0x47da7d(0x6b0)]){ConfigManager[_0x47da7d(0x476)]!==0x0?(ConfigManager[_0x47da7d(0x759)]=0x0,ConfigManager['bgsVolume']=0x0,ConfigManager['meVolume']=0x0,ConfigManager[_0x47da7d(0x476)]=0x0):(ConfigManager[_0x47da7d(0x759)]=0x64,ConfigManager[_0x47da7d(0x7ec)]=0x64,ConfigManager[_0x47da7d(0x29d)]=0x64,ConfigManager[_0x47da7d(0x476)]=0x64);ConfigManager[_0x47da7d(0x48b)]();if(this[_0x47da7d(0x196)]['constructor']===Scene_Options){if(this[_0x47da7d(0x196)][_0x47da7d(0x385)])this[_0x47da7d(0x196)]['_optionsWindow'][_0x47da7d(0x5ad)]();if(this[_0x47da7d(0x196)]['_listWindow'])this[_0x47da7d(0x196)][_0x47da7d(0x364)]['refresh']();}}},SceneManager['playTestF7']=function(){const _0x55f136=_0x100070;$gameTemp[_0x55f136(0x16d)]()&&VisuMZ[_0x55f136(0x785)][_0x55f136(0x598)][_0x55f136(0x1f9)]['F7key']&&($gameTemp[_0x55f136(0x2a4)]=!$gameTemp['_playTestFastMode']);},SceneManager[_0x100070(0x5a0)]=function(){const _0x121c75=_0x100070;if(!VisuMZ[_0x121c75(0x785)][_0x121c75(0x598)][_0x121c75(0x1f9)][_0x121c75(0x7b6)])return;if(!$gameTemp[_0x121c75(0x16d)]())return;if(!SceneManager[_0x121c75(0x30e)]())return;if(!Input['isPressed'](_0x121c75(0x653)))return;for(const _0x206e8a of $gameParty[_0x121c75(0x30f)]()){if(!_0x206e8a)continue;_0x206e8a['recoverAll']();}},SceneManager[_0x100070(0x806)]=function(){const _0x117d22=_0x100070;if(!VisuMZ[_0x117d22(0x785)][_0x117d22(0x598)][_0x117d22(0x1f9)][_0x117d22(0xb6)])return;if(!$gameTemp['isPlaytest']())return;if(!SceneManager[_0x117d22(0x30e)]())return;if(!Input[_0x117d22(0x11c)](_0x117d22(0x653)))return;for(const _0x2ccb1c of $gameParty['members']()){if(!_0x2ccb1c)continue;_0x2ccb1c['gainSilentTp'](_0x2ccb1c[_0x117d22(0x3e8)]());}},SceneManager[_0x100070(0x1f6)]=function(_0x234681){const _0xfe593b=_0x100070;if(!$gameTemp[_0xfe593b(0x16d)]())return;if(!DataManager[_0xfe593b(0x1fc)](_0x234681))return;if(!(VisuMZ['CoreEngine'][_0xfe593b(0x598)][_0xfe593b(0x1f9)]['CtrlQuickLoad']??!![]))return;this[_0xfe593b(0x443)](Scene_QuickLoad),this[_0xfe593b(0x1bb)](_0x234681);},SceneManager[_0x100070(0x85a)]=function(){const _0x3f7011=_0x100070;this[_0x3f7011(0xd1)]=![],this[_0x3f7011(0x763)]=!VisuMZ['CoreEngine']['Settings']['UI'][_0x3f7011(0x4b6)];},SceneManager[_0x100070(0x2f4)]=function(_0x5070d1){const _0x5003b8=_0x100070;VisuMZ[_0x5003b8(0x785)][_0x5003b8(0x598)]['UI'][_0x5003b8(0x1ae)]&&(this['_sideButtonLayout']=_0x5070d1);},SceneManager['isSideButtonLayout']=function(){const _0x4bc099=_0x100070;return this[_0x4bc099(0xd1)];},SceneManager['areButtonsHidden']=function(){const _0x487603=_0x100070;return this[_0x487603(0x763)];},SceneManager[_0x100070(0x652)]=function(){const _0x2f0a17=_0x100070;return this['areButtonsHidden']()||this[_0x2f0a17(0x425)]();},VisuMZ[_0x100070(0x785)][_0x100070(0x20e)]=SceneManager[_0x100070(0x646)],SceneManager['isGameActive']=function(){const _0x37806a=_0x100070;return VisuMZ[_0x37806a(0x785)][_0x37806a(0x598)][_0x37806a(0x1f9)][_0x37806a(0x388)]?VisuMZ['CoreEngine'][_0x37806a(0x20e)][_0x37806a(0x703)](this):!![];},SceneManager[_0x100070(0x5fa)]=function(_0x5d7ad0){const _0x83cf36=_0x100070;if(_0x5d7ad0 instanceof Error)this[_0x83cf36(0x677)](_0x5d7ad0);else _0x5d7ad0 instanceof Array&&_0x5d7ad0[0x0]==='LoadError'?this[_0x83cf36(0x1a9)](_0x5d7ad0):this[_0x83cf36(0x508)](_0x5d7ad0);this['stop']();},VisuMZ[_0x100070(0x785)][_0x100070(0x284)]=BattleManager['processEscape'],BattleManager['processEscape']=function(){const _0x515524=_0x100070;return VisuMZ[_0x515524(0x785)][_0x515524(0x598)]['QoL'][_0x515524(0x625)]?this['processAlwaysEscape']():VisuMZ['CoreEngine'][_0x515524(0x284)][_0x515524(0x703)](this);},BattleManager[_0x100070(0x7cb)]=function(){const _0x1863fa=_0x100070;return $gameParty[_0x1863fa(0x155)](),SoundManager[_0x1863fa(0x352)](),this[_0x1863fa(0x698)](),!![];},BattleManager[_0x100070(0x79c)]=function(){return $gameSystem['getBattleSystem']()>=0x1;},BattleManager[_0x100070(0x3d1)]=function(){const _0x2e8c0a=_0x100070;return $gameSystem[_0x2e8c0a(0x5d5)]()===0x1;},VisuMZ['CoreEngine'][_0x100070(0x174)]=Game_Temp[_0x100070(0x7ae)][_0x100070(0x811)],Game_Temp[_0x100070(0x7ae)][_0x100070(0x811)]=function(){const _0x46f7e2=_0x100070;VisuMZ[_0x46f7e2(0x785)]['Game_Temp_initialize']['call'](this),this['forceOutOfPlaytest'](),this['createFauxAnimationQueue'](),this[_0x46f7e2(0x747)]();},Game_Temp['prototype'][_0x100070(0x42c)]=function(){const _0x5af529=_0x100070;VisuMZ[_0x5af529(0x785)][_0x5af529(0x598)][_0x5af529(0x1f9)][_0x5af529(0x3aa)]&&(this[_0x5af529(0x83a)]=![]);},Game_Temp['prototype'][_0x100070(0x152)]=function(_0x2a738d){const _0x3ebdc4=_0x100070;this[_0x3ebdc4(0x6ef)]=_0x2a738d;},Game_Temp[_0x100070(0x7ae)][_0x100070(0x253)]=function(){return this['_lastPluginCommandInterpreter'];},Game_Temp['prototype'][_0x100070(0x1a6)]=function(){const _0x6c66e5=_0x100070;this[_0x6c66e5(0x2c2)]=undefined,this[_0x6c66e5(0xec)]=undefined,this['_forcedBattleGridSystem']=undefined;},Game_Temp[_0x100070(0x7ae)][_0x100070(0x69f)]=function(_0xb24d63){const _0xa62618=_0x100070;$gameMap&&$dataMap&&$dataMap[_0xa62618(0x507)]&&this[_0xa62618(0x464)]($dataMap['note']);const _0x2404f5=$dataTroops[_0xb24d63];if(_0x2404f5){let _0xaeffc0=DataManager[_0xa62618(0x644)](_0x2404f5['id']);this['parseForcedGameTroopSettingsCoreEngine'](_0xaeffc0);}},Game_Temp[_0x100070(0x7ae)]['parseForcedGameTroopSettingsCoreEngine']=function(_0x727a7c){const _0x44e892=_0x100070;if(!_0x727a7c)return;if(_0x727a7c[_0x44e892(0x4aa)](/<(?:FRONTVIEW|FRONT VIEW|FV)>/i))this[_0x44e892(0x2c2)]='FV';else{if(_0x727a7c[_0x44e892(0x4aa)](/<(?:SIDEVIEW|SIDE VIEW|SV)>/i))this[_0x44e892(0x2c2)]='SV';else{if(_0x727a7c[_0x44e892(0x4aa)](/<(?:BATTLEVIEW|BATTLE VIEW):[ ](.*)>/i)){const _0x433a93=String(RegExp['$1']);if(_0x433a93[_0x44e892(0x4aa)](/(?:FRONTVIEW|FRONT VIEW|FV)/i))this[_0x44e892(0x2c2)]='FV';else _0x433a93[_0x44e892(0x4aa)](/(?:SIDEVIEW|SIDE VIEW|SV)/i)&&(this[_0x44e892(0x2c2)]='SV');}}}if(_0x727a7c[_0x44e892(0x4aa)](/<(?:DTB)>/i))this['_forcedBattleSys']=0x0;else{if(_0x727a7c[_0x44e892(0x4aa)](/<(?:TPB|ATB)[ ]ACTIVE>/i))this['_forcedBattleSys']=0x1;else{if(_0x727a7c[_0x44e892(0x4aa)](/<(?:TPB|ATB)[ ]WAIT>/i))this[_0x44e892(0xec)]=0x2;else{if(_0x727a7c[_0x44e892(0x4aa)](/<(?:TPB|ATB)>/i))this[_0x44e892(0xec)]=0x2;else{if(_0x727a7c[_0x44e892(0x4aa)](/<(?:CTB)>/i))Imported[_0x44e892(0x1ce)]&&(this['_forcedBattleSys']='CTB');else{if(_0x727a7c[_0x44e892(0x4aa)](/<(?:STB)>/i))Imported[_0x44e892(0xfb)]&&(this['_forcedBattleSys']='STB');else{if(_0x727a7c[_0x44e892(0x4aa)](/<(?:BTB)>/i))Imported[_0x44e892(0x7ba)]&&(this[_0x44e892(0xec)]=_0x44e892(0x7cd));else{if(_0x727a7c['match'](/<(?:FTB)>/i))Imported[_0x44e892(0x412)]&&(this[_0x44e892(0xec)]=_0x44e892(0x4e6));else{if(_0x727a7c[_0x44e892(0x4aa)](/<(?:OTB)>/i))Imported[_0x44e892(0x874)]&&(this[_0x44e892(0xec)]=_0x44e892(0x789));else{if(_0x727a7c[_0x44e892(0x4aa)](/<(?:ETB)>/i))Imported[_0x44e892(0x550)]&&(this[_0x44e892(0xec)]='ETB');else{if(_0x727a7c[_0x44e892(0x4aa)](/<(?:PTB)>/i))Imported['VisuMZ_2_BattleSystemPTB']&&(this[_0x44e892(0xec)]=_0x44e892(0x549));else{if(_0x727a7c['match'](/<(?:BATTLEVIEW|BATTLE VIEW):[ ](.*)>/i)){const _0x3725a8=String(RegExp['$1']);if(_0x3725a8[_0x44e892(0x4aa)](/DTB/i))this['_forcedBattleSys']=0x0;else{if(_0x3725a8[_0x44e892(0x4aa)](/(?:TPB|ATB)[ ]ACTIVE/i))this[_0x44e892(0xec)]=0x1;else{if(_0x3725a8['match'](/(?:TPB|ATB)[ ]WAIT/i))this[_0x44e892(0xec)]=0x2;else{if(_0x3725a8[_0x44e892(0x4aa)](/CTB/i))Imported[_0x44e892(0x1ce)]&&(this['_forcedBattleSys']=_0x44e892(0x3ec));else{if(_0x3725a8['match'](/STB/i))Imported['VisuMZ_2_BattleSystemSTB']&&(this[_0x44e892(0xec)]=_0x44e892(0x336));else{if(_0x3725a8[_0x44e892(0x4aa)](/BTB/i))Imported[_0x44e892(0x7ba)]&&(this[_0x44e892(0xec)]=_0x44e892(0x7cd));else{if(_0x3725a8[_0x44e892(0x4aa)](/FTB/i))Imported['VisuMZ_2_BattleSystemFTB']&&(this['_forcedBattleSys']=_0x44e892(0x4e6));else{if(_0x3725a8[_0x44e892(0x4aa)](/OTB/i))Imported[_0x44e892(0x874)]&&(this[_0x44e892(0xec)]=_0x44e892(0x789));else{if(_0x3725a8['match'](/ETB/i))Imported[_0x44e892(0x550)]&&(this[_0x44e892(0xec)]=_0x44e892(0x166));else _0x3725a8[_0x44e892(0x4aa)](/PTB/i)&&(Imported[_0x44e892(0x1eb)]&&(this['_forcedBattleSys']=_0x44e892(0x549)));}}}}}}}}}}}}}}}}}}}}if(_0x727a7c[_0x44e892(0x4aa)](/<(?:|BATTLE )GRID>/i))this[_0x44e892(0xd7)]=!![];else _0x727a7c[_0x44e892(0x4aa)](/<NO (?:|BATTLE )GRID>/i)&&(this['_forcedBattleGridSystem']=![]);},Game_Temp[_0x100070(0x7ae)][_0x100070(0x34a)]=function(){const _0x1bc9c2=_0x100070;this[_0x1bc9c2(0x4a7)]=[];},Game_Temp[_0x100070(0x7ae)][_0x100070(0x4da)]=function(_0x57af0f,_0xba821d,_0x4d4176,_0x1e060d){const _0x275eff=_0x100070;if(!this[_0x275eff(0x370)]())return;_0x4d4176=_0x4d4176||![],_0x1e060d=_0x1e060d||![];if($dataAnimations[_0xba821d]){const _0x3a2806={'targets':_0x57af0f,'animationId':_0xba821d,'mirror':_0x4d4176,'mute':_0x1e060d};this[_0x275eff(0x4a7)][_0x275eff(0x443)](_0x3a2806);for(const _0x423c40 of _0x57af0f){_0x423c40[_0x275eff(0x837)]&&_0x423c40['startAnimation']();}}},Game_Temp[_0x100070(0x7ae)][_0x100070(0x370)]=function(){return!![];},Game_Temp['prototype']['retrieveFauxAnimation']=function(){const _0x5353da=_0x100070;return this[_0x5353da(0x4a7)][_0x5353da(0x653)]();},Game_Temp['prototype'][_0x100070(0x747)]=function(){const _0x3c978f=_0x100070;this[_0x3c978f(0x4d8)]=[];},Game_Temp['prototype'][_0x100070(0x494)]=function(_0x6e9b26,_0x470dc0,_0x51d21b,_0x594ba4,_0x29aaae){if(!this['showPointAnimations']())return;_0x594ba4=_0x594ba4||![],_0x29aaae=_0x29aaae||![];if($dataAnimations[_0x51d21b]){const _0x476560={'x':_0x6e9b26,'y':_0x470dc0,'animationId':_0x51d21b,'mirror':_0x594ba4,'mute':_0x29aaae};this['_pointAnimationQueue']['push'](_0x476560);}},Game_Temp[_0x100070(0x7ae)][_0x100070(0x5ea)]=function(){return!![];},Game_Temp['prototype']['retrievePointAnimation']=function(){const _0x3f727e=_0x100070;return this[_0x3f727e(0x4d8)][_0x3f727e(0x653)]();},VisuMZ['CoreEngine'][_0x100070(0x1c8)]=Game_System[_0x100070(0x7ae)]['initialize'],Game_System['prototype'][_0x100070(0x811)]=function(){const _0x43e490=_0x100070;VisuMZ[_0x43e490(0x785)]['Game_System_initialize'][_0x43e490(0x703)](this),this['initCoreEngine']();},Game_System[_0x100070(0x7ae)][_0x100070(0x3c6)]=function(){const _0x3dd2e4=_0x100070;this['_CoreEngineSettings']={'SideView':$dataSystem[_0x3dd2e4(0x3a2)],'BattleSystem':this[_0x3dd2e4(0x3e1)](),'FontSize':$dataSystem[_0x3dd2e4(0x120)][_0x3dd2e4(0xb8)],'Padding':0xc};},Game_System[_0x100070(0x7ae)][_0x100070(0x7a0)]=function(){const _0x1ae366=_0x100070;if($gameTemp[_0x1ae366(0x2c2)]==='SV')return!![];else{if($gameTemp[_0x1ae366(0x2c2)]==='FV')return![];}if(this[_0x1ae366(0x1fb)]===undefined)this[_0x1ae366(0x3c6)]();if(this[_0x1ae366(0x1fb)][_0x1ae366(0x2df)]===undefined)this[_0x1ae366(0x3c6)]();return this[_0x1ae366(0x1fb)][_0x1ae366(0x2df)];},Game_System[_0x100070(0x7ae)][_0x100070(0x495)]=function(_0x16862b){const _0x50fcb6=_0x100070;if(this[_0x50fcb6(0x1fb)]===undefined)this[_0x50fcb6(0x3c6)]();if(this['_CoreEngineSettings'][_0x50fcb6(0x2df)]===undefined)this[_0x50fcb6(0x3c6)]();this['_CoreEngineSettings'][_0x50fcb6(0x2df)]=_0x16862b;},Game_System[_0x100070(0x7ae)][_0x100070(0x171)]=function(){const _0x5d2de9=_0x100070;if(this[_0x5d2de9(0x1fb)]===undefined)this[_0x5d2de9(0x3c6)]();this[_0x5d2de9(0x1fb)][_0x5d2de9(0x1ee)]=this['initialBattleSystem']();},Game_System[_0x100070(0x7ae)]['initialBattleSystem']=function(){const _0x26a355=_0x100070,_0x5094a9=(VisuMZ[_0x26a355(0x785)][_0x26a355(0x598)][_0x26a355(0x1ee)]||'DATABASE')[_0x26a355(0x4f4)]()[_0x26a355(0x60f)]();return VisuMZ[_0x26a355(0x785)][_0x26a355(0x344)](_0x5094a9);},Game_System['prototype'][_0x100070(0x5d5)]=function(){const _0x5e5c74=_0x100070;if($gameTemp[_0x5e5c74(0xec)]!==undefined)return $gameTemp[_0x5e5c74(0xec)];if(this['_CoreEngineSettings']===undefined)this[_0x5e5c74(0x3c6)]();if(this[_0x5e5c74(0x1fb)][_0x5e5c74(0x1ee)]===undefined)this['resetBattleSystem']();return this[_0x5e5c74(0x1fb)][_0x5e5c74(0x1ee)];},Game_System[_0x100070(0x7ae)][_0x100070(0xbc)]=function(_0x15d5bc){const _0x1c019f=_0x100070;if(this[_0x1c019f(0x1fb)]===undefined)this[_0x1c019f(0x3c6)]();if(this[_0x1c019f(0x1fb)][_0x1c019f(0x1ee)]===undefined)this['resetBattleSystem']();this[_0x1c019f(0x1fb)]['BattleSystem']=_0x15d5bc;},Game_System[_0x100070(0x7ae)][_0x100070(0x64b)]=function(){const _0x3ea11e=_0x100070;if(this[_0x3ea11e(0x1fb)]===undefined)this['initCoreEngine']();if(this['_CoreEngineSettings'][_0x3ea11e(0x23d)]===undefined)this[_0x3ea11e(0x3c6)]();return this[_0x3ea11e(0x1fb)][_0x3ea11e(0x23d)];},Game_System[_0x100070(0x7ae)]['setMainFontSize']=function(_0x503487){const _0x372718=_0x100070;if(this[_0x372718(0x1fb)]===undefined)this['initCoreEngine']();if(this[_0x372718(0x1fb)][_0x372718(0x77f)]===undefined)this['initCoreEngine']();this[_0x372718(0x1fb)]['FontSize']=_0x503487;},Game_System['prototype'][_0x100070(0x65a)]=function(){const _0x5a73b4=_0x100070;if(this[_0x5a73b4(0x1fb)]===undefined)this[_0x5a73b4(0x3c6)]();if(this[_0x5a73b4(0x1fb)][_0x5a73b4(0x5e4)]===undefined)this[_0x5a73b4(0x3c6)]();return this[_0x5a73b4(0x1fb)][_0x5a73b4(0x5e4)];},Game_System[_0x100070(0x7ae)][_0x100070(0x2ef)]=function(_0x73959d){const _0x23cc15=_0x100070;if(this[_0x23cc15(0x1fb)]===undefined)this[_0x23cc15(0x3c6)]();if(this[_0x23cc15(0x1fb)][_0x23cc15(0x77f)]===undefined)this[_0x23cc15(0x3c6)]();this[_0x23cc15(0x1fb)][_0x23cc15(0x5e4)]=_0x73959d;},VisuMZ[_0x100070(0x785)]['Game_Screen_initialize']=Game_Screen[_0x100070(0x7ae)]['initialize'],Game_Screen[_0x100070(0x7ae)][_0x100070(0x811)]=function(){const _0x83396=_0x100070;VisuMZ['CoreEngine'][_0x83396(0x4ae)][_0x83396(0x703)](this),this[_0x83396(0x1a8)]();},Game_Screen[_0x100070(0x7ae)][_0x100070(0x1a8)]=function(){const _0xdca49a=_0x100070,_0x368d93=VisuMZ[_0xdca49a(0x785)][_0xdca49a(0x598)][_0xdca49a(0x108)];this[_0xdca49a(0x6f9)]=_0x368d93?.['DefaultStyle']||_0xdca49a(0x569);},Game_Screen[_0x100070(0x7ae)][_0x100070(0x378)]=function(){const _0x447799=_0x100070;if(this[_0x447799(0x6f9)]===undefined)this[_0x447799(0x1a8)]();return this[_0x447799(0x6f9)];},Game_Screen[_0x100070(0x7ae)][_0x100070(0x581)]=function(_0x292ec6){const _0x56945f=_0x100070;if(this['_coreEngineShakeStyle']===undefined)this[_0x56945f(0x1a8)]();this[_0x56945f(0x6f9)]=_0x292ec6[_0x56945f(0x1d4)]()['trim']();},Game_Picture[_0x100070(0x7ae)]['isMapScrollLinked']=function(){const _0x119e0a=_0x100070;if($gameParty['inBattle']())return![];return this[_0x119e0a(0x679)]()&&this[_0x119e0a(0x679)]()[_0x119e0a(0x299)](0x0)==='!';},Game_Picture[_0x100070(0x7ae)]['onlyfilename']=function(){const _0x510377=_0x100070;return this[_0x510377(0x24e)][_0x510377(0x213)]('/')['pop']();},VisuMZ['CoreEngine'][_0x100070(0x18a)]=Game_Picture[_0x100070(0x7ae)]['x'],Game_Picture[_0x100070(0x7ae)]['x']=function(){const _0x3556b2=_0x100070;return this[_0x3556b2(0x3ac)]()?this['xScrollLinkedOffset']():VisuMZ[_0x3556b2(0x785)]['Game_Picture_x'][_0x3556b2(0x703)](this);},Game_Picture['prototype']['xScrollLinkedOffset']=function(){const _0x288121=_0x100070,_0x36395d=$gameMap[_0x288121(0x356)]()*$gameMap['tileWidth']();return(this['_x']-_0x36395d)*$gameScreen['zoomScale']();},VisuMZ[_0x100070(0x785)][_0x100070(0x68b)]=Game_Picture[_0x100070(0x7ae)]['y'],Game_Picture[_0x100070(0x7ae)]['y']=function(){const _0x19d45e=_0x100070;return this[_0x19d45e(0x3ac)]()?this['yScrollLinkedOffset']():VisuMZ[_0x19d45e(0x785)]['Game_Picture_y']['call'](this);},Game_Picture[_0x100070(0x7ae)][_0x100070(0x751)]=function(){const _0x585d37=_0x100070,_0x1a741a=$gameMap[_0x585d37(0x7da)]()*$gameMap[_0x585d37(0x2c9)]();return(this['_y']-_0x1a741a)*$gameScreen[_0x585d37(0x15f)]();},VisuMZ[_0x100070(0x785)][_0x100070(0x749)]=Game_Picture['prototype']['scaleX'],Game_Picture[_0x100070(0x7ae)]['scaleX']=function(){const _0x4ee267=_0x100070;let _0x38b8bd=VisuMZ['CoreEngine'][_0x4ee267(0x749)][_0x4ee267(0x703)](this);return this[_0x4ee267(0x3ac)]()&&(_0x38b8bd*=$gameScreen['zoomScale']()),_0x38b8bd;},VisuMZ[_0x100070(0x785)][_0x100070(0x436)]=Game_Picture[_0x100070(0x7ae)][_0x100070(0x180)],Game_Picture[_0x100070(0x7ae)]['scaleY']=function(){const _0x2c9b98=_0x100070;let _0x36f2e4=VisuMZ[_0x2c9b98(0x785)]['Game_Picture_scaleY']['call'](this);return this[_0x2c9b98(0x3ac)]()&&(_0x36f2e4*=$gameScreen[_0x2c9b98(0x15f)]()),_0x36f2e4;},Game_Picture[_0x100070(0x7ae)][_0x100070(0x5e5)]=function(_0x4566e8){this['_coreEasingType']=_0x4566e8;},VisuMZ[_0x100070(0x785)][_0x100070(0x1f5)]=Game_Picture[_0x100070(0x7ae)]['calcEasing'],Game_Picture[_0x100070(0x7ae)]['calcEasing']=function(_0x1ced5a){const _0x32cbaf=_0x100070;return this[_0x32cbaf(0x3b5)]=this['_coreEasingType']||0x0,[0x0,0x1,0x2,0x3][_0x32cbaf(0x4c7)](this[_0x32cbaf(0x3b5)])?VisuMZ['CoreEngine'][_0x32cbaf(0x1f5)]['call'](this,_0x1ced5a):VisuMZ[_0x32cbaf(0x702)](_0x1ced5a,this['_coreEasingType']);},VisuMZ['CoreEngine'][_0x100070(0x7b4)]=Game_Picture[_0x100070(0x7ae)][_0x100070(0x4ff)],Game_Picture[_0x100070(0x7ae)][_0x100070(0x4ff)]=function(){const _0x5b4a8b=_0x100070;VisuMZ[_0x5b4a8b(0x785)]['Game_Picture_initRotation'][_0x5b4a8b(0x703)](this),this[_0x5b4a8b(0x610)]();},Game_Picture['prototype'][_0x100070(0x610)]=function(){const _0x494a23=_0x100070;this[_0x494a23(0x16a)]={'current':0x0,'target':0x0,'duration':0x0,'wholeDuration':0x0,'easingType':_0x494a23(0x80e)};},VisuMZ[_0x100070(0x785)][_0x100070(0x1e1)]=Game_Picture[_0x100070(0x7ae)][_0x100070(0x2ed)],Game_Picture[_0x100070(0x7ae)][_0x100070(0x2ed)]=function(){const _0x2c735f=_0x100070;let _0x209d80=VisuMZ[_0x2c735f(0x785)][_0x2c735f(0x1e1)][_0x2c735f(0x703)](this);return _0x209d80+=this[_0x2c735f(0x51a)](),_0x209d80;},Game_Picture[_0x100070(0x7ae)][_0x100070(0x51a)]=function(){const _0x421d62=_0x100070;if(this[_0x421d62(0x16a)]===undefined)this[_0x421d62(0x610)]();return this[_0x421d62(0x16a)][_0x421d62(0x18b)]||0x0;},Game_Picture[_0x100070(0x7ae)][_0x100070(0x42d)]=function(_0x5c5d1f,_0x29691e,_0x214891){const _0xa5f29f=_0x100070;if(this[_0xa5f29f(0x16a)]===undefined)this[_0xa5f29f(0x610)]();this['_anglePlus'][_0xa5f29f(0x829)]=_0x5c5d1f||0x0,this[_0xa5f29f(0x16a)]['duration']=_0x29691e||0x0,this['_anglePlus'][_0xa5f29f(0x1d2)]=_0x29691e||0x0,this[_0xa5f29f(0x16a)]['easingType']=_0x214891||_0xa5f29f(0x80e),_0x29691e<=0x0&&(this['_anglePlus'][_0xa5f29f(0x18b)]=this['_anglePlus']['target']);},Game_Picture['prototype'][_0x100070(0x37e)]=function(_0x1e393d,_0x2d2cd8,_0x12192b){const _0x4a19f2=_0x100070;if(this[_0x4a19f2(0x16a)]===undefined)this[_0x4a19f2(0x610)]();this['_anglePlus'][_0x4a19f2(0x829)]+=_0x1e393d||0x0,this[_0x4a19f2(0x16a)]['duration']=_0x2d2cd8||0x0,this[_0x4a19f2(0x16a)]['wholeDuration']=_0x2d2cd8||0x0,this[_0x4a19f2(0x16a)][_0x4a19f2(0x3d7)]=_0x12192b||_0x4a19f2(0x80e),_0x2d2cd8<=0x0&&(this[_0x4a19f2(0x16a)][_0x4a19f2(0x18b)]=this[_0x4a19f2(0x16a)][_0x4a19f2(0x829)]);},VisuMZ['CoreEngine'][_0x100070(0x271)]=Game_Picture[_0x100070(0x7ae)]['updateRotation'],Game_Picture[_0x100070(0x7ae)][_0x100070(0x43d)]=function(){const _0x5c826e=_0x100070;VisuMZ[_0x5c826e(0x785)]['Game_Picture_updateRotation'][_0x5c826e(0x703)](this),this[_0x5c826e(0x223)]();},Game_Picture[_0x100070(0x7ae)][_0x100070(0x223)]=function(){const _0x61f125=_0x100070;if(this['_anglePlus']===undefined)this[_0x61f125(0x610)]();const _0x1d3b01=this['_anglePlus'];if(_0x1d3b01['duration']<=0x0)return;_0x1d3b01[_0x61f125(0x18b)]=this['applyEasingAnglePlus'](_0x1d3b01[_0x61f125(0x18b)],_0x1d3b01[_0x61f125(0x829)]),_0x1d3b01[_0x61f125(0x814)]--,_0x1d3b01[_0x61f125(0x814)]<=0x0&&(_0x1d3b01[_0x61f125(0x18b)]=_0x1d3b01[_0x61f125(0x829)]);},Game_Picture[_0x100070(0x7ae)][_0x100070(0x7dc)]=function(_0x551eb6,_0x446e4e){const _0x20b8d0=_0x100070,_0x5846d3=this[_0x20b8d0(0x16a)],_0x4cff5a=_0x5846d3[_0x20b8d0(0x3d7)],_0x43af68=_0x5846d3[_0x20b8d0(0x814)],_0x51d993=_0x5846d3[_0x20b8d0(0x1d2)],_0x190d5d=VisuMZ[_0x20b8d0(0x702)]((_0x51d993-_0x43af68)/_0x51d993,_0x4cff5a),_0x59048e=VisuMZ[_0x20b8d0(0x702)]((_0x51d993-_0x43af68+0x1)/_0x51d993,_0x4cff5a),_0x5e3e74=(_0x551eb6-_0x446e4e*_0x190d5d)/(0x1-_0x190d5d);return _0x5e3e74+(_0x446e4e-_0x5e3e74)*_0x59048e;},VisuMZ[_0x100070(0x785)][_0x100070(0x4d0)]=Game_Action[_0x100070(0x7ae)][_0x100070(0x4d5)],Game_Action[_0x100070(0x7ae)]['itemHit']=function(_0x5f33a8){const _0x249dae=_0x100070;return VisuMZ[_0x249dae(0x785)]['Settings'][_0x249dae(0x1f9)][_0x249dae(0x5f6)]?this[_0x249dae(0x649)](_0x5f33a8):VisuMZ[_0x249dae(0x785)][_0x249dae(0x4d0)]['call'](this,_0x5f33a8);},Game_Action[_0x100070(0x7ae)][_0x100070(0x649)]=function(_0x14487e){const _0x14ae23=_0x100070,_0x15bdb8=this[_0x14ae23(0x2b2)](_0x14487e),_0x4ca87f=this[_0x14ae23(0x211)](_0x14487e),_0x1c36c1=this[_0x14ae23(0x86c)](_0x14487e);return _0x15bdb8*(_0x4ca87f-_0x1c36c1);},VisuMZ[_0x100070(0x785)][_0x100070(0x2e6)]=Game_Action[_0x100070(0x7ae)][_0x100070(0x40a)],Game_Action[_0x100070(0x7ae)]['itemEva']=function(_0x25600f){const _0x248ac2=_0x100070;return VisuMZ['CoreEngine'][_0x248ac2(0x598)][_0x248ac2(0x1f9)][_0x248ac2(0x5f6)]?0x0:VisuMZ['CoreEngine'][_0x248ac2(0x2e6)][_0x248ac2(0x703)](this,_0x25600f);},Game_Action[_0x100070(0x7ae)][_0x100070(0x2b2)]=function(_0xbea05e){const _0x4183a3=_0x100070;return this[_0x4183a3(0x6e2)]()[_0x4183a3(0x503)]*0.01;},Game_Action['prototype'][_0x100070(0x211)]=function(_0x3a8f9f){const _0x3792b4=_0x100070;if(VisuMZ[_0x3792b4(0x785)][_0x3792b4(0x598)][_0x3792b4(0x1f9)][_0x3792b4(0x33d)]&&this['isItem']())return 0x1;return this[_0x3792b4(0x815)]()?VisuMZ[_0x3792b4(0x785)][_0x3792b4(0x598)][_0x3792b4(0x1f9)][_0x3792b4(0x33d)]&&this[_0x3792b4(0x4df)]()[_0x3792b4(0x51e)]()?this[_0x3792b4(0x4df)]()[_0x3792b4(0x1cb)]+0.05:this[_0x3792b4(0x4df)]()[_0x3792b4(0x1cb)]:0x1;},Game_Action['prototype'][_0x100070(0x86c)]=function(_0x4a0009){const _0x548515=_0x100070;if(this[_0x548515(0x4df)]()[_0x548515(0x51e)]()===_0x4a0009[_0x548515(0x51e)]())return 0x0;if(this[_0x548515(0x815)]())return VisuMZ[_0x548515(0x785)][_0x548515(0x598)][_0x548515(0x1f9)][_0x548515(0x33d)]&&_0x4a0009[_0x548515(0x2bb)]()?_0x4a0009[_0x548515(0x6fa)]-0.05:_0x4a0009[_0x548515(0x6fa)];else return this['isMagical']()?_0x4a0009['mev']:0x0;},VisuMZ[_0x100070(0x785)]['Game_Action_updateLastTarget']=Game_Action['prototype'][_0x100070(0x337)],Game_Action[_0x100070(0x7ae)][_0x100070(0x337)]=function(_0x536609){const _0x372b0f=_0x100070;VisuMZ[_0x372b0f(0x785)]['Game_Action_updateLastTarget']['call'](this,_0x536609);if(VisuMZ['CoreEngine'][_0x372b0f(0x598)]['QoL']['ImprovedAccuracySystem'])return;const _0x3ac7d2=_0x536609[_0x372b0f(0x6d4)]();_0x3ac7d2[_0x372b0f(0x45d)]&&(0x1-this[_0x372b0f(0x40a)](_0x536609)>this[_0x372b0f(0x4d5)](_0x536609)&&(_0x3ac7d2['missed']=![],_0x3ac7d2[_0x372b0f(0x870)]=!![]));},VisuMZ[_0x100070(0x785)][_0x100070(0x280)]=Game_BattlerBase[_0x100070(0x7ae)]['initMembers'],Game_BattlerBase['prototype'][_0x100070(0x722)]=function(){const _0x4a5b17=_0x100070;this['_cache']={},VisuMZ[_0x4a5b17(0x785)][_0x4a5b17(0x280)]['call'](this);},VisuMZ[_0x100070(0x785)][_0x100070(0x59d)]=Game_BattlerBase['prototype'][_0x100070(0x5ad)],Game_BattlerBase['prototype'][_0x100070(0x5ad)]=function(){const _0x2855b6=_0x100070;this[_0x2855b6(0x4cf)]={},VisuMZ['CoreEngine'][_0x2855b6(0x59d)][_0x2855b6(0x703)](this);},Game_BattlerBase[_0x100070(0x7ae)][_0x100070(0x601)]=function(_0x14aa91){const _0x39f632=_0x100070;return this['_cache']=this[_0x39f632(0x4cf)]||{},this[_0x39f632(0x4cf)][_0x14aa91]!==undefined;},VisuMZ[_0x100070(0x785)][_0x100070(0x7fd)]=function(_0x510e15){const _0x5e444d=_0x100070;return _0x510e15=_0x510e15||'',_0x510e15='\x20'+_0x510e15,(VisuMZ[_0x5e444d(0x785)][_0x5e444d(0x598)]['Param']['ConvertToBase']??!![])&&(_0x510e15=_0x510e15[_0x5e444d(0x617)](/\s(?:USER|THIS)\.mhp\b/gi,_0x5e444d(0x437)),_0x510e15=_0x510e15[_0x5e444d(0x617)](/\s(?:USER|THIS)\.mmp\b/gi,_0x5e444d(0x56f)),_0x510e15=_0x510e15[_0x5e444d(0x617)](/\s(?:USER|THIS)\.atk\b/gi,_0x5e444d(0x5c7)),_0x510e15=_0x510e15[_0x5e444d(0x617)](/\s(?:USER|THIS)\.def\b/gi,_0x5e444d(0x826)),_0x510e15=_0x510e15['replace'](/\s(?:USER|THIS)\.mat\b/gi,_0x5e444d(0x568)),_0x510e15=_0x510e15[_0x5e444d(0x617)](/\s(?:USER|THIS)\.mdf\b/gi,_0x5e444d(0x5c1)),_0x510e15=_0x510e15[_0x5e444d(0x617)](/\s(?:USER|THIS)\.agi\b/gi,_0x5e444d(0x6e6)),_0x510e15=_0x510e15['replace'](/\s(?:USER|THIS)\.luk\b/gi,_0x5e444d(0x519)),_0x510e15=_0x510e15[_0x5e444d(0x617)](/\s(?:USER|THIS)\.param\(/gi,_0x5e444d(0x79e))),_0x510e15=_0x510e15[_0x5e444d(0x617)](/\suser\./gi,'\x20this.'),_0x510e15;},Game_BattlerBase[_0x100070(0x7ae)]['paramPlus']=function(_0x19c5db){const _0x2368fe=_0x100070,_0x1b63cf=(_0x20dbdc,_0x39be57)=>{const _0x23695f=_0x7e7c;if(!_0x39be57)return _0x20dbdc;if(_0x39be57[_0x23695f(0x507)][_0x23695f(0x4aa)](VisuMZ[_0x23695f(0x785)][_0x23695f(0x408)][_0x23695f(0x10f)][_0x19c5db])){var _0x2819e5=Number(RegExp['$1']);_0x20dbdc+=_0x2819e5;}if(_0x39be57[_0x23695f(0x507)][_0x23695f(0x4aa)](VisuMZ[_0x23695f(0x785)][_0x23695f(0x408)]['paramPlusJS'][_0x19c5db])){var _0x2fc1ff=String(RegExp['$1']);_0x2fc1ff=VisuMZ['CoreEngine'][_0x23695f(0x7fd)](_0x2fc1ff);try{_0x20dbdc+=eval(_0x2fc1ff);}catch(_0x20fdb0){if($gameTemp[_0x23695f(0x16d)]())console['log'](_0x20fdb0);}}return _0x20dbdc;};return this[_0x2368fe(0x665)]()[_0x2368fe(0x1d3)](_0x1b63cf,this[_0x2368fe(0x193)][_0x19c5db]);},Game_BattlerBase['prototype']['paramMax']=function(_0xe4cd59){const _0x52d390=_0x100070;var _0x30fb9a=_0x52d390(0x3c5)+(this['isActor']()?_0x52d390(0x1f1):_0x52d390(0x32a))+_0x52d390(0x6bb)+_0xe4cd59;if(this['checkCacheKey'](_0x30fb9a))return this['_cache'][_0x30fb9a];this[_0x52d390(0x4cf)][_0x30fb9a]=eval(VisuMZ[_0x52d390(0x785)][_0x52d390(0x598)]['Param'][_0x30fb9a]);const _0x2b431e=(_0x13e7b8,_0x250016)=>{const _0x5671c7=_0x52d390;if(!_0x250016)return _0x13e7b8;if(_0x250016[_0x5671c7(0x507)]['match'](VisuMZ[_0x5671c7(0x785)][_0x5671c7(0x408)][_0x5671c7(0x629)][_0xe4cd59])){var _0x37b76a=Number(RegExp['$1']);if(_0x37b76a===0x0)_0x37b76a=Number[_0x5671c7(0x4ee)];_0x13e7b8=Math[_0x5671c7(0x23f)](_0x13e7b8,_0x37b76a);}if(_0x250016[_0x5671c7(0x507)]['match'](VisuMZ['CoreEngine'][_0x5671c7(0x408)]['paramMaxJS'][_0xe4cd59])){var _0x408598=String(RegExp['$1']);_0x408598=VisuMZ['CoreEngine'][_0x5671c7(0x7fd)](_0x408598);try{_0x13e7b8=Math[_0x5671c7(0x23f)](_0x13e7b8,Number(eval(_0x408598)));}catch(_0x1be47b){if($gameTemp[_0x5671c7(0x16d)]())console[_0x5671c7(0x4ce)](_0x1be47b);}}return _0x13e7b8;};if(this['_cache'][_0x30fb9a]===0x0)this['_cache'][_0x30fb9a]=Number['MAX_SAFE_INTEGER'];return this['_cache'][_0x30fb9a]=this[_0x52d390(0x665)]()['reduce'](_0x2b431e,this[_0x52d390(0x4cf)][_0x30fb9a]),this['_cache'][_0x30fb9a];},Game_BattlerBase[_0x100070(0x7ae)][_0x100070(0x6ad)]=function(_0x33f3ea){const _0xf85053=_0x100070,_0x19b869=this[_0xf85053(0x791)](Game_BattlerBase[_0xf85053(0x859)],_0x33f3ea),_0x1607da=(_0x585953,_0x168822)=>{const _0x3c4e43=_0xf85053;if(!_0x168822)return _0x585953;if(_0x168822[_0x3c4e43(0x507)]['match'](VisuMZ['CoreEngine'][_0x3c4e43(0x408)][_0x3c4e43(0x87a)][_0x33f3ea])){var _0x46e2f3=Number(RegExp['$1'])/0x64;_0x585953*=_0x46e2f3;}if(_0x168822[_0x3c4e43(0x507)]['match'](VisuMZ[_0x3c4e43(0x785)][_0x3c4e43(0x408)]['paramRate2'][_0x33f3ea])){var _0x46e2f3=Number(RegExp['$1']);_0x585953*=_0x46e2f3;}if(_0x168822['note'][_0x3c4e43(0x4aa)](VisuMZ[_0x3c4e43(0x785)][_0x3c4e43(0x408)][_0x3c4e43(0x5b9)][_0x33f3ea])){var _0x1d3bc0=String(RegExp['$1']);_0x1d3bc0=VisuMZ[_0x3c4e43(0x785)][_0x3c4e43(0x7fd)](_0x1d3bc0);try{_0x585953*=eval(_0x1d3bc0);}catch(_0x3039cc){if($gameTemp[_0x3c4e43(0x16d)]())console[_0x3c4e43(0x4ce)](_0x3039cc);}}return _0x585953;};return this[_0xf85053(0x665)]()['reduce'](_0x1607da,_0x19b869);},Game_BattlerBase[_0x100070(0x7ae)]['paramFlatBonus']=function(_0x3d4297){const _0x1c4298=_0x100070,_0x43a2b6=(_0x5e053f,_0x496141)=>{const _0x23c8cf=_0x7e7c;if(!_0x496141)return _0x5e053f;if(_0x496141['note'][_0x23c8cf(0x4aa)](VisuMZ['CoreEngine'][_0x23c8cf(0x408)]['paramFlat'][_0x3d4297])){var _0xb810a0=Number(RegExp['$1']);_0x5e053f+=_0xb810a0;}if(_0x496141[_0x23c8cf(0x507)]['match'](VisuMZ[_0x23c8cf(0x785)][_0x23c8cf(0x408)]['paramFlatJS'][_0x3d4297])){var _0x4e043a=String(RegExp['$1']);_0x4e043a=VisuMZ[_0x23c8cf(0x785)][_0x23c8cf(0x7fd)](_0x4e043a);try{_0x5e053f+=eval(_0x4e043a);}catch(_0x570081){if($gameTemp[_0x23c8cf(0x16d)]())console[_0x23c8cf(0x4ce)](_0x570081);}}return _0x5e053f;};return this['traitObjects']()[_0x1c4298(0x1d3)](_0x43a2b6,0x0);},Game_BattlerBase[_0x100070(0x7ae)][_0x100070(0x79a)]=function(_0x17704a){const _0x365b94=_0x100070;let _0x4c267b=_0x365b94(0x79a)+_0x17704a+_0x365b94(0x1fa);if(this[_0x365b94(0x601)](_0x4c267b))return this[_0x365b94(0x4cf)][_0x4c267b];return this['_cache'][_0x4c267b]=Math[_0x365b94(0x884)](VisuMZ[_0x365b94(0x785)]['Settings'][_0x365b94(0x7a7)][_0x365b94(0x6b2)][_0x365b94(0x703)](this,_0x17704a)),this['_cache'][_0x4c267b];},Game_BattlerBase[_0x100070(0x7ae)][_0x100070(0x2ae)]=function(_0x1a4d35){const _0x1932a5=(_0x3a6d2b,_0x399e48)=>{const _0x1deaf0=_0x7e7c;if(!_0x399e48)return _0x3a6d2b;if(_0x399e48['note'][_0x1deaf0(0x4aa)](VisuMZ[_0x1deaf0(0x785)][_0x1deaf0(0x408)]['xparamPlus1'][_0x1a4d35])){var _0x4324ab=Number(RegExp['$1'])/0x64;_0x3a6d2b+=_0x4324ab;}if(_0x399e48[_0x1deaf0(0x507)][_0x1deaf0(0x4aa)](VisuMZ[_0x1deaf0(0x785)][_0x1deaf0(0x408)]['xparamPlus2'][_0x1a4d35])){var _0x4324ab=Number(RegExp['$1']);_0x3a6d2b+=_0x4324ab;}if(_0x399e48['note'][_0x1deaf0(0x4aa)](VisuMZ[_0x1deaf0(0x785)]['RegExp']['xparamPlusJS'][_0x1a4d35])){var _0x4cee10=String(RegExp['$1']);_0x4cee10=VisuMZ[_0x1deaf0(0x785)]['JsReplaceUserVar'](_0x4cee10);try{_0x3a6d2b+=eval(_0x4cee10);}catch(_0x1e2636){if($gameTemp[_0x1deaf0(0x16d)]())console['log'](_0x1e2636);}}return _0x3a6d2b;};return this['traitObjects']()['reduce'](_0x1932a5,0x0);},Game_BattlerBase[_0x100070(0x7ae)]['xparamRate']=function(_0x56cab9){const _0x35f98a=_0x100070,_0x9b6ddd=(_0x7fa13a,_0x2ea1ea)=>{const _0x42800e=_0x7e7c;if(!_0x2ea1ea)return _0x7fa13a;if(_0x2ea1ea[_0x42800e(0x507)]['match'](VisuMZ[_0x42800e(0x785)][_0x42800e(0x408)]['xparamRate1'][_0x56cab9])){var _0x22e892=Number(RegExp['$1'])/0x64;_0x7fa13a*=_0x22e892;}if(_0x2ea1ea[_0x42800e(0x507)][_0x42800e(0x4aa)](VisuMZ[_0x42800e(0x785)][_0x42800e(0x408)]['xparamRate2'][_0x56cab9])){var _0x22e892=Number(RegExp['$1']);_0x7fa13a*=_0x22e892;}if(_0x2ea1ea[_0x42800e(0x507)][_0x42800e(0x4aa)](VisuMZ['CoreEngine'][_0x42800e(0x408)][_0x42800e(0x5ec)][_0x56cab9])){var _0x339c0b=String(RegExp['$1']);_0x339c0b=VisuMZ['CoreEngine'][_0x42800e(0x7fd)](_0x339c0b);try{_0x7fa13a*=eval(_0x339c0b);}catch(_0x116a70){if($gameTemp[_0x42800e(0x16d)]())console[_0x42800e(0x4ce)](_0x116a70);}}return _0x7fa13a;};return this[_0x35f98a(0x665)]()[_0x35f98a(0x1d3)](_0x9b6ddd,0x1);},Game_BattlerBase['prototype'][_0x100070(0x3ad)]=function(_0x3808be){const _0x131545=_0x100070,_0x2a604d=(_0x80ca25,_0x518d39)=>{const _0x2e6c47=_0x7e7c;if(!_0x518d39)return _0x80ca25;if(_0x518d39[_0x2e6c47(0x507)][_0x2e6c47(0x4aa)](VisuMZ[_0x2e6c47(0x785)][_0x2e6c47(0x408)]['xparamFlat1'][_0x3808be])){var _0x40b344=Number(RegExp['$1'])/0x64;_0x80ca25+=_0x40b344;}if(_0x518d39[_0x2e6c47(0x507)]['match'](VisuMZ[_0x2e6c47(0x785)]['RegExp'][_0x2e6c47(0x38b)][_0x3808be])){var _0x40b344=Number(RegExp['$1']);_0x80ca25+=_0x40b344;}if(_0x518d39[_0x2e6c47(0x507)][_0x2e6c47(0x4aa)](VisuMZ[_0x2e6c47(0x785)][_0x2e6c47(0x408)]['xparamFlatJS'][_0x3808be])){var _0x52983c=String(RegExp['$1']);_0x52983c=VisuMZ['CoreEngine']['JsReplaceUserVar'](_0x52983c);try{_0x80ca25+=eval(_0x52983c);}catch(_0x1fd9b7){if($gameTemp['isPlaytest']())console[_0x2e6c47(0x4ce)](_0x1fd9b7);}}return _0x80ca25;};return this[_0x131545(0x665)]()[_0x131545(0x1d3)](_0x2a604d,0x0);},Game_BattlerBase['prototype'][_0x100070(0x516)]=function(_0x32901c){const _0x45064c=_0x100070;let _0x4a4a7d='xparam'+_0x32901c+'Total';if(this[_0x45064c(0x601)](_0x4a4a7d))return this['_cache'][_0x4a4a7d];return this[_0x45064c(0x4cf)][_0x4a4a7d]=VisuMZ['CoreEngine'][_0x45064c(0x598)][_0x45064c(0x7a7)]['XParameterFormula']['call'](this,_0x32901c),this[_0x45064c(0x4cf)][_0x4a4a7d];},Game_BattlerBase['prototype']['sparamPlus']=function(_0x5b8ab5){const _0x5baad4=_0x100070,_0x391391=(_0x2fff19,_0x10452f)=>{const _0x4466cb=_0x7e7c;if(!_0x10452f)return _0x2fff19;if(_0x10452f[_0x4466cb(0x507)]['match'](VisuMZ[_0x4466cb(0x785)][_0x4466cb(0x408)][_0x4466cb(0x6a0)][_0x5b8ab5])){var _0x3cd7ba=Number(RegExp['$1'])/0x64;_0x2fff19+=_0x3cd7ba;}if(_0x10452f[_0x4466cb(0x507)][_0x4466cb(0x4aa)](VisuMZ[_0x4466cb(0x785)][_0x4466cb(0x408)]['sparamPlus2'][_0x5b8ab5])){var _0x3cd7ba=Number(RegExp['$1']);_0x2fff19+=_0x3cd7ba;}if(_0x10452f[_0x4466cb(0x507)][_0x4466cb(0x4aa)](VisuMZ['CoreEngine'][_0x4466cb(0x408)]['sparamPlusJS'][_0x5b8ab5])){var _0x2509b8=String(RegExp['$1']);_0x2509b8=VisuMZ[_0x4466cb(0x785)][_0x4466cb(0x7fd)](_0x2509b8);try{_0x2fff19+=eval(_0x2509b8);}catch(_0x4a9924){if($gameTemp['isPlaytest']())console[_0x4466cb(0x4ce)](_0x4a9924);}}return _0x2fff19;};return this[_0x5baad4(0x665)]()['reduce'](_0x391391,0x0);},Game_BattlerBase[_0x100070(0x7ae)][_0x100070(0x14b)]=function(_0x448713){const _0x431b06=_0x100070,_0x4a7086=(_0x5dbbdf,_0x3dbdd6)=>{const _0xfd2e5a=_0x7e7c;if(!_0x3dbdd6)return _0x5dbbdf;if(_0x3dbdd6[_0xfd2e5a(0x507)][_0xfd2e5a(0x4aa)](VisuMZ['CoreEngine'][_0xfd2e5a(0x408)][_0xfd2e5a(0x571)][_0x448713])){var _0x322c4a=Number(RegExp['$1'])/0x64;_0x5dbbdf*=_0x322c4a;}if(_0x3dbdd6[_0xfd2e5a(0x507)][_0xfd2e5a(0x4aa)](VisuMZ[_0xfd2e5a(0x785)][_0xfd2e5a(0x408)]['sparamRate2'][_0x448713])){var _0x322c4a=Number(RegExp['$1']);_0x5dbbdf*=_0x322c4a;}if(_0x3dbdd6[_0xfd2e5a(0x507)][_0xfd2e5a(0x4aa)](VisuMZ[_0xfd2e5a(0x785)][_0xfd2e5a(0x408)]['sparamRateJS'][_0x448713])){var _0x429c51=String(RegExp['$1']);_0x429c51=VisuMZ[_0xfd2e5a(0x785)][_0xfd2e5a(0x7fd)](_0x429c51);try{_0x5dbbdf*=eval(_0x429c51);}catch(_0x580665){if($gameTemp[_0xfd2e5a(0x16d)]())console['log'](_0x580665);}}return _0x5dbbdf;};return this[_0x431b06(0x665)]()[_0x431b06(0x1d3)](_0x4a7086,0x1);},Game_BattlerBase[_0x100070(0x7ae)]['sparamFlatBonus']=function(_0x1bff00){const _0x333b72=_0x100070,_0x13cf58=(_0x36d542,_0x4e5b8d)=>{const _0x5c69a3=_0x7e7c;if(!_0x4e5b8d)return _0x36d542;if(_0x4e5b8d[_0x5c69a3(0x507)][_0x5c69a3(0x4aa)](VisuMZ[_0x5c69a3(0x785)]['RegExp'][_0x5c69a3(0x563)][_0x1bff00])){var _0x2133f9=Number(RegExp['$1'])/0x64;_0x36d542+=_0x2133f9;}if(_0x4e5b8d[_0x5c69a3(0x507)][_0x5c69a3(0x4aa)](VisuMZ['CoreEngine'][_0x5c69a3(0x408)][_0x5c69a3(0x76f)][_0x1bff00])){var _0x2133f9=Number(RegExp['$1']);_0x36d542+=_0x2133f9;}if(_0x4e5b8d['note'][_0x5c69a3(0x4aa)](VisuMZ['CoreEngine'][_0x5c69a3(0x408)][_0x5c69a3(0x834)][_0x1bff00])){var _0x45b38f=String(RegExp['$1']);_0x45b38f=VisuMZ[_0x5c69a3(0x785)]['JsReplaceUserVar'](_0x45b38f);try{_0x36d542+=eval(_0x45b38f);}catch(_0x1ea19f){if($gameTemp[_0x5c69a3(0x16d)]())console['log'](_0x1ea19f);}}return _0x36d542;};return this[_0x333b72(0x665)]()[_0x333b72(0x1d3)](_0x13cf58,0x0);},Game_BattlerBase['prototype'][_0x100070(0x683)]=function(_0x3851b7){const _0x26bc2f=_0x100070;let _0x2e2b8b=_0x26bc2f(0x683)+_0x3851b7+_0x26bc2f(0x1fa);if(this[_0x26bc2f(0x601)](_0x2e2b8b))return this[_0x26bc2f(0x4cf)][_0x2e2b8b];return this[_0x26bc2f(0x4cf)][_0x2e2b8b]=VisuMZ[_0x26bc2f(0x785)][_0x26bc2f(0x598)][_0x26bc2f(0x7a7)][_0x26bc2f(0x10a)][_0x26bc2f(0x703)](this,_0x3851b7),this['_cache'][_0x2e2b8b];},Game_BattlerBase[_0x100070(0x7ae)][_0x100070(0x44c)]=function(_0x1a36df,_0x4e5c8f){const _0xc492d6=_0x100070;if(typeof paramId===_0xc492d6(0x236))return this['param'](_0x1a36df);_0x1a36df=String(_0x1a36df||'')[_0xc492d6(0x4f4)]();if(_0x1a36df===_0xc492d6(0xbd))return this['param'](0x0);if(_0x1a36df===_0xc492d6(0xe1))return this[_0xc492d6(0x79a)](0x1);if(_0x1a36df==='ATK')return this[_0xc492d6(0x79a)](0x2);if(_0x1a36df==='DEF')return this[_0xc492d6(0x79a)](0x3);if(_0x1a36df===_0xc492d6(0x84a))return this[_0xc492d6(0x79a)](0x4);if(_0x1a36df===_0xc492d6(0x187))return this[_0xc492d6(0x79a)](0x5);if(_0x1a36df==='AGI')return this[_0xc492d6(0x79a)](0x6);if(_0x1a36df===_0xc492d6(0x50b))return this[_0xc492d6(0x79a)](0x7);if(_0x1a36df==='HIT')return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this[_0xc492d6(0x516)](0x0)*0x64))+'%':this[_0xc492d6(0x516)](0x0);if(_0x1a36df===_0xc492d6(0x22c))return _0x4e5c8f?String(Math['round'](this[_0xc492d6(0x516)](0x1)*0x64))+'%':this[_0xc492d6(0x516)](0x1);if(_0x1a36df==='CRI')return _0x4e5c8f?String(Math['round'](this['xparam'](0x2)*0x64))+'%':this[_0xc492d6(0x516)](0x2);if(_0x1a36df===_0xc492d6(0x6e4))return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this[_0xc492d6(0x516)](0x3)*0x64))+'%':this['xparam'](0x3);if(_0x1a36df===_0xc492d6(0x3ae))return _0x4e5c8f?String(Math['round'](this['xparam'](0x4)*0x64))+'%':this[_0xc492d6(0x516)](0x4);if(_0x1a36df==='MRF')return _0x4e5c8f?String(Math['round'](this[_0xc492d6(0x516)](0x5)*0x64))+'%':this[_0xc492d6(0x516)](0x5);if(_0x1a36df===_0xc492d6(0x415))return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this[_0xc492d6(0x516)](0x6)*0x64))+'%':this['xparam'](0x6);if(_0x1a36df===_0xc492d6(0x7cc))return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this[_0xc492d6(0x516)](0x7)*0x64))+'%':this[_0xc492d6(0x516)](0x7);if(_0x1a36df===_0xc492d6(0x55d))return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this['xparam'](0x8)*0x64))+'%':this[_0xc492d6(0x516)](0x8);if(_0x1a36df==='TRG')return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this[_0xc492d6(0x516)](0x9)*0x64))+'%':this['xparam'](0x9);if(_0x1a36df===_0xc492d6(0x845))return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this[_0xc492d6(0x683)](0x0)*0x64))+'%':this['sparam'](0x0);if(_0x1a36df===_0xc492d6(0x488))return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this[_0xc492d6(0x683)](0x1)*0x64))+'%':this['sparam'](0x1);if(_0x1a36df===_0xc492d6(0xf8))return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this[_0xc492d6(0x683)](0x2)*0x64))+'%':this[_0xc492d6(0x683)](0x2);if(_0x1a36df===_0xc492d6(0x4c8))return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this[_0xc492d6(0x683)](0x3)*0x64))+'%':this['sparam'](0x3);if(_0x1a36df===_0xc492d6(0x2ec))return _0x4e5c8f?String(Math['round'](this[_0xc492d6(0x683)](0x4)*0x64))+'%':this[_0xc492d6(0x683)](0x4);if(_0x1a36df===_0xc492d6(0x87f))return _0x4e5c8f?String(Math['round'](this['sparam'](0x5)*0x64))+'%':this[_0xc492d6(0x683)](0x5);if(_0x1a36df===_0xc492d6(0x5ba))return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this[_0xc492d6(0x683)](0x6)*0x64))+'%':this['sparam'](0x6);if(_0x1a36df===_0xc492d6(0x368))return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this['sparam'](0x7)*0x64))+'%':this['sparam'](0x7);if(_0x1a36df===_0xc492d6(0x81d))return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this[_0xc492d6(0x683)](0x8)*0x64))+'%':this[_0xc492d6(0x683)](0x8);if(_0x1a36df===_0xc492d6(0xb5))return _0x4e5c8f?String(Math[_0xc492d6(0x884)](this['sparam'](0x9)*0x64))+'%':this[_0xc492d6(0x683)](0x9);if(VisuMZ['CoreEngine'][_0xc492d6(0x6fb)][_0x1a36df]){const _0x45ee47=VisuMZ[_0xc492d6(0x785)][_0xc492d6(0x6fb)][_0x1a36df],_0x55a1f7=this[_0x45ee47];return VisuMZ['CoreEngine'][_0xc492d6(0x5a7)][_0x1a36df]===_0xc492d6(0x4b5)?_0x55a1f7:_0x4e5c8f?String(Math[_0xc492d6(0x884)](_0x55a1f7*0x64))+'%':_0x55a1f7;}return'';},Game_BattlerBase[_0x100070(0x7ae)][_0x100070(0x6c8)]=function(){const _0x44d95d=_0x100070;return this[_0x44d95d(0x58d)]()&&this['_hp']<this[_0x44d95d(0x14e)]*VisuMZ[_0x44d95d(0x785)][_0x44d95d(0x598)][_0x44d95d(0x7a7)]['CrisisRate'];},Game_Battler[_0x100070(0x7ae)][_0x100070(0x26d)]=function(){const _0x5d775d=_0x100070;SoundManager['playMiss'](),this[_0x5d775d(0x809)]('evade');},VisuMZ['CoreEngine'][_0x100070(0x452)]=Game_Actor[_0x100070(0x7ae)][_0x100070(0x5b7)],Game_Actor['prototype'][_0x100070(0x5b7)]=function(_0x4754ed){const _0x3c287f=_0x100070;if(this[_0x3c287f(0x42e)]>0x63)return this[_0x3c287f(0x2fa)](_0x4754ed);return VisuMZ[_0x3c287f(0x785)][_0x3c287f(0x452)]['call'](this,_0x4754ed);},Game_Actor['prototype']['paramBaseAboveLevel99']=function(_0x280220){const _0x578126=_0x100070,_0x2342ec=this[_0x578126(0x54e)]()[_0x578126(0x138)][_0x280220][0x63],_0xe1f537=this['currentClass']()[_0x578126(0x138)][_0x280220][0x62];return _0x2342ec+(_0x2342ec-_0xe1f537)*(this[_0x578126(0x42e)]-0x63);},VisuMZ[_0x100070(0x785)]['Game_Actor_changeClass']=Game_Actor['prototype'][_0x100070(0x70b)],Game_Actor[_0x100070(0x7ae)][_0x100070(0x70b)]=function(_0x4a1043,_0xede803){const _0x1b7ad8=_0x100070;$gameTemp[_0x1b7ad8(0x1cf)]=!![],VisuMZ[_0x1b7ad8(0x785)]['Game_Actor_changeClass'][_0x1b7ad8(0x703)](this,_0x4a1043,_0xede803),$gameTemp[_0x1b7ad8(0x1cf)]=undefined;},VisuMZ[_0x100070(0x785)][_0x100070(0x3f3)]=Game_Actor[_0x100070(0x7ae)][_0x100070(0x7e3)],Game_Actor[_0x100070(0x7ae)][_0x100070(0x7e3)]=function(){const _0x226d56=_0x100070;VisuMZ[_0x226d56(0x785)][_0x226d56(0x3f3)][_0x226d56(0x703)](this);if(!$gameTemp['_changingClass'])this['levelUpRecovery']();},Game_Actor['prototype'][_0x100070(0x720)]=function(){const _0x120775=_0x100070;this['_cache']={};if(VisuMZ[_0x120775(0x785)]['Settings'][_0x120775(0x1f9)][_0x120775(0x72a)])this[_0x120775(0x5c0)]=this[_0x120775(0x14e)];if(VisuMZ[_0x120775(0x785)][_0x120775(0x598)]['QoL'][_0x120775(0x561)])this[_0x120775(0x40c)]=this['mmp'];},Game_Actor[_0x100070(0x7ae)][_0x100070(0x5c2)]=function(){const _0x5af34f=_0x100070;if(this[_0x5af34f(0x7c7)]())return 0x1;const _0x3a6fa5=this[_0x5af34f(0x242)]()-this[_0x5af34f(0x86d)](),_0x384ebe=this[_0x5af34f(0x778)]()-this[_0x5af34f(0x86d)]();return(_0x384ebe/_0x3a6fa5)['clamp'](0x0,0x1);},Game_Actor['prototype'][_0x100070(0x665)]=function(){const _0x9b7581=_0x100070,_0x3a4292=Game_Battler[_0x9b7581(0x7ae)][_0x9b7581(0x665)]['call'](this);for(const _0x58b016 of this[_0x9b7581(0x170)]()){_0x58b016&&_0x3a4292['push'](_0x58b016);}return _0x3a4292[_0x9b7581(0x443)](this[_0x9b7581(0x54e)](),this[_0x9b7581(0x787)]()),_0x3a4292;},VisuMZ[_0x100070(0x785)][_0x100070(0x7d9)]=Game_Actor[_0x100070(0x7ae)][_0x100070(0x22f)],Game_Actor[_0x100070(0x7ae)][_0x100070(0x22f)]=function(){const _0x5d3663=_0x100070;if(!$gameParty[_0x5d3663(0x460)]())return!![];return VisuMZ[_0x5d3663(0x785)]['Game_Actor_isPreserveTp']['call'](this);},VisuMZ['CoreEngine'][_0x100070(0x395)]=Game_Unit['prototype']['onBattleStart'],Game_Unit['prototype'][_0x100070(0x38d)]=function(_0x16b435){const _0x1e3aa7=_0x100070;this[_0x1e3aa7(0x632)]=!![],VisuMZ['CoreEngine']['Game_Unit_onBattleStart'][_0x1e3aa7(0x703)](this,_0x16b435);},VisuMZ[_0x100070(0x785)][_0x100070(0x851)]=Game_Unit[_0x100070(0x7ae)][_0x100070(0x461)],Game_Unit['prototype']['onBattleEnd']=function(){const _0x11fba4=_0x100070;for(const _0x3f3ca7 of this[_0x11fba4(0x30f)]()){_0x3f3ca7&&!_0x3f3ca7[_0x11fba4(0x22f)]()&&_0x3f3ca7['clearTp']();}VisuMZ[_0x11fba4(0x785)][_0x11fba4(0x851)][_0x11fba4(0x703)](this);},Object['defineProperty'](Game_Enemy['prototype'],_0x100070(0x42e),{'get':function(){return this['getLevel']();},'configurable':!![]}),Game_Enemy[_0x100070(0x7ae)][_0x100070(0x580)]=function(){const _0x28656c=_0x100070;return this[_0x28656c(0x788)]()[_0x28656c(0x42e)];},Game_Enemy[_0x100070(0x7ae)]['moveRelativeToResolutionChange']=function(){const _0x2eb553=_0x100070;!this['_repositioned']&&(this[_0x2eb553(0x47b)]+=Math[_0x2eb553(0x884)]((Graphics['height']-0x270)/0x2),this[_0x2eb553(0x47b)]-=Math[_0x2eb553(0x279)]((Graphics[_0x2eb553(0x6c5)]-Graphics[_0x2eb553(0x50e)])/0x2),$gameSystem[_0x2eb553(0x7a0)]()?this[_0x2eb553(0xc6)]-=Math[_0x2eb553(0x279)]((Graphics['width']-Graphics[_0x2eb553(0x693)])/0x2):this[_0x2eb553(0xc6)]+=Math[_0x2eb553(0x884)]((Graphics[_0x2eb553(0x693)]-0x330)/0x2)),this[_0x2eb553(0x397)]=!![];},Game_Party[_0x100070(0x7ae)]['maxGold']=function(){const _0x553ecf=_0x100070;return VisuMZ[_0x553ecf(0x785)][_0x553ecf(0x598)][_0x553ecf(0x2f2)]['GoldMax'];},VisuMZ[_0x100070(0x785)][_0x100070(0x528)]=Game_Party['prototype'][_0x100070(0x65d)],Game_Party[_0x100070(0x7ae)][_0x100070(0x65d)]=function(_0x3dabda){const _0x2f6e41=_0x100070;if(VisuMZ[_0x2f6e41(0x785)][_0x2f6e41(0x598)][_0x2f6e41(0x1f9)][_0x2f6e41(0x831)]&&DataManager['isKeyItem'](_0x3dabda))return;VisuMZ[_0x2f6e41(0x785)][_0x2f6e41(0x528)][_0x2f6e41(0x703)](this,_0x3dabda);},Game_Party[_0x100070(0x7ae)]['setupBattleTestItems']=function(){const _0xef76fb=_0x100070,_0x3c459d=VisuMZ[_0xef76fb(0x785)][_0xef76fb(0x598)][_0xef76fb(0x1f9)],_0x51bca1=_0x3c459d[_0xef76fb(0x71d)]??0x63;let _0xe99d80=[];(_0x3c459d[_0xef76fb(0x73b)]??!![])&&(_0xe99d80=_0xe99d80[_0xef76fb(0x489)]($dataItems));(_0x3c459d['BTestWeapons']??!![])&&(_0xe99d80=_0xe99d80[_0xef76fb(0x489)]($dataWeapons));(_0x3c459d[_0xef76fb(0x7f9)]??!![])&&(_0xe99d80=_0xe99d80[_0xef76fb(0x489)]($dataArmors));for(const _0x39549c of _0xe99d80){if(!_0x39549c)continue;if(_0x39549c[_0xef76fb(0x554)][_0xef76fb(0x60f)]()<=0x0)continue;if(_0x39549c[_0xef76fb(0x554)][_0xef76fb(0x4aa)](/-----/i))continue;this[_0xef76fb(0x278)](_0x39549c,_0x51bca1);}},VisuMZ[_0x100070(0x785)][_0x100070(0x750)]=Game_Troop[_0x100070(0x7ae)][_0x100070(0x5e1)],Game_Troop[_0x100070(0x7ae)]['setup']=function(_0x1b3b03){const _0x5d3e24=_0x100070;$gameTemp['clearForcedGameTroopSettingsCoreEngine'](),$gameTemp[_0x5d3e24(0x69f)](_0x1b3b03),VisuMZ[_0x5d3e24(0x785)]['Game_Troop_setup'][_0x5d3e24(0x703)](this,_0x1b3b03);},VisuMZ[_0x100070(0x785)][_0x100070(0x800)]=Game_Map[_0x100070(0x7ae)]['setup'],Game_Map['prototype'][_0x100070(0x5e1)]=function(_0x23d110){const _0x5755d9=_0x100070;VisuMZ[_0x5755d9(0x785)][_0x5755d9(0x800)][_0x5755d9(0x703)](this,_0x23d110),this['checkCoreEngineDisplayCenter'](),this[_0x5755d9(0x881)](_0x23d110),this[_0x5755d9(0x3d9)]();},Game_Map[_0x100070(0x7ae)]['setupCoreEngine']=function(){const _0x1dd25d=_0x100070;this[_0x1dd25d(0x157)]=VisuMZ[_0x1dd25d(0x785)]['Settings'][_0x1dd25d(0x1f9)][_0x1dd25d(0x6aa)]||![];const _0x3e90f1=VisuMZ[_0x1dd25d(0x785)][_0x1dd25d(0x598)]['ScreenResolution'],_0x4d5170=$dataMap?$dataMap[_0x1dd25d(0x507)]||'':'';if(_0x4d5170['match'](/<SHOW TILE SHADOWS>/i))this[_0x1dd25d(0x157)]=![];else _0x4d5170[_0x1dd25d(0x4aa)](/<HIDE TILE SHADOWS>/i)&&(this['_hideTileShadows']=!![]);if(_0x4d5170[_0x1dd25d(0x4aa)](/<SCROLL LOCK X>/i))this[_0x1dd25d(0x4e8)]()[_0x1dd25d(0x57a)]=!![],this[_0x1dd25d(0x4e8)]()['displayX']=_0x3e90f1['DisplayLockX'];else _0x4d5170[_0x1dd25d(0x4aa)](/<SCROLL LOCK X: (.*?)>/i)&&(this['centerCameraCheckData']()[_0x1dd25d(0x57a)]=!![],this['centerCameraCheckData']()[_0x1dd25d(0x356)]=Number(RegExp['$1']));if(_0x4d5170['match'](/<SCROLL LOCK Y>/i))this[_0x1dd25d(0x4e8)]()[_0x1dd25d(0x346)]=!![],this[_0x1dd25d(0x4e8)]()[_0x1dd25d(0x7da)]=_0x3e90f1[_0x1dd25d(0x220)];else _0x4d5170[_0x1dd25d(0x4aa)](/<SCROLL LOCK Y: (.*?)>/i)&&(this[_0x1dd25d(0x4e8)]()['centerY']=!![],this[_0x1dd25d(0x4e8)]()[_0x1dd25d(0x7da)]=Number(RegExp['$1']));},Game_Map['prototype']['areTileShadowsHidden']=function(){const _0x258897=_0x100070;if(this[_0x258897(0x157)]===undefined)this[_0x258897(0x881)]();return this[_0x258897(0x157)];},Game_Map[_0x100070(0x7ae)][_0x100070(0x459)]=function(){const _0x8ca8ae=_0x100070,_0x1dea91=VisuMZ['CoreEngine'][_0x8ca8ae(0x598)]['ScreenResolution'];this[_0x8ca8ae(0x709)]={'centerX':![],'centerY':![],'displayX':0x0,'displayY':0x0};if(_0x1dea91[_0x8ca8ae(0x237)]){const _0x49a6c6=Graphics[_0x8ca8ae(0x1ed)]/this[_0x8ca8ae(0xf6)]();_0x49a6c6%0x1!==0x0&&Math[_0x8ca8ae(0x5fd)](_0x49a6c6)===this[_0x8ca8ae(0x1ed)]()&&!this['isLoopHorizontal']()&&(this[_0x8ca8ae(0x709)]['centerX']=!![],this[_0x8ca8ae(0x709)]['displayX']=_0x1dea91['DisplayLockX']||0x0);}if(_0x1dea91[_0x8ca8ae(0x61a)]){const _0x36b6a1=Graphics[_0x8ca8ae(0x6c5)]/this[_0x8ca8ae(0x2c9)]();_0x36b6a1%0x1!==0x0&&Math[_0x8ca8ae(0x5fd)](_0x36b6a1)===this[_0x8ca8ae(0x6c5)]()&&!this['isLoopVertical']()&&(this['_centerCameraCheck']['centerY']=!![],this[_0x8ca8ae(0x709)]['displayY']=_0x1dea91['DisplayLockY']||0x0);}$gameScreen[_0x8ca8ae(0x15f)]()===0x1&&(this[_0x8ca8ae(0x4e8)]()[_0x8ca8ae(0x57a)]&&(this[_0x8ca8ae(0x17d)]=this['centerCameraCheckData']()[_0x8ca8ae(0x356)]),this[_0x8ca8ae(0x4e8)]()[_0x8ca8ae(0x346)]&&(this[_0x8ca8ae(0x375)]=this[_0x8ca8ae(0x4e8)]()[_0x8ca8ae(0x7da)]));},VisuMZ[_0x100070(0x785)][_0x100070(0x6e0)]=Game_Map[_0x100070(0x7ae)]['setDisplayPos'],Game_Map[_0x100070(0x7ae)][_0x100070(0x1c6)]=function(_0x35eb3c,_0x443a9d){const _0x5aff80=_0x100070;VisuMZ[_0x5aff80(0x785)][_0x5aff80(0x6e0)][_0x5aff80(0x703)](this,_0x35eb3c,_0x443a9d),$gameScreen[_0x5aff80(0x15f)]()===0x1&&(!this['isLoopHorizontal']()&&this[_0x5aff80(0x4e8)]()[_0x5aff80(0x57a)]&&(this['_displayX']=this[_0x5aff80(0x4e8)]()[_0x5aff80(0x356)]),!this[_0x5aff80(0x7ce)]()&&this[_0x5aff80(0x4e8)]()[_0x5aff80(0x346)]&&(this[_0x5aff80(0x375)]=this[_0x5aff80(0x4e8)]()[_0x5aff80(0x7da)]));},Game_Map[_0x100070(0x7ae)][_0x100070(0x4e8)]=function(){const _0x597676=_0x100070;if(this['_centerCameraCheck']===undefined)this[_0x597676(0x459)]();return this[_0x597676(0x709)];},VisuMZ[_0x100070(0x785)]['Game_Map_scrollDown']=Game_Map[_0x100070(0x7ae)][_0x100070(0x38a)],Game_Map[_0x100070(0x7ae)]['scrollDown']=function(_0x571e9b){const _0x381b14=_0x100070;if(this[_0x381b14(0x4e8)]()[_0x381b14(0x346)]&&$gameScreen['zoomScale']()===0x1){this['_displayY']=this[_0x381b14(0x4e8)]()[_0x381b14(0x7da)];return;}VisuMZ[_0x381b14(0x785)][_0x381b14(0x6bd)]['call'](this,_0x571e9b);},VisuMZ[_0x100070(0x785)][_0x100070(0x849)]=Game_Map['prototype'][_0x100070(0x4f8)],Game_Map[_0x100070(0x7ae)][_0x100070(0x4f8)]=function(_0x1f25f6){const _0x4fb818=_0x100070;if(this[_0x4fb818(0x4e8)]()[_0x4fb818(0x57a)]&&$gameScreen[_0x4fb818(0x15f)]()===0x1){this[_0x4fb818(0x17d)]=this[_0x4fb818(0x4e8)]()[_0x4fb818(0x356)];return;}VisuMZ[_0x4fb818(0x785)][_0x4fb818(0x849)]['call'](this,_0x1f25f6);},VisuMZ[_0x100070(0x785)][_0x100070(0x6d7)]=Game_Map['prototype'][_0x100070(0x887)],Game_Map[_0x100070(0x7ae)][_0x100070(0x887)]=function(_0xbc39ab){const _0x4cfff0=_0x100070;if(this[_0x4cfff0(0x4e8)]()[_0x4cfff0(0x57a)]&&$gameScreen[_0x4cfff0(0x15f)]()===0x1){this['_displayX']=this[_0x4cfff0(0x4e8)]()['displayX'];return;}VisuMZ[_0x4cfff0(0x785)][_0x4cfff0(0x6d7)]['call'](this,_0xbc39ab);},VisuMZ[_0x100070(0x785)][_0x100070(0x592)]=Game_Map[_0x100070(0x7ae)][_0x100070(0x6d6)],Game_Map[_0x100070(0x7ae)][_0x100070(0x6d6)]=function(_0x12c770){const _0x2aadcc=_0x100070;if(this[_0x2aadcc(0x4e8)]()[_0x2aadcc(0x346)]&&$gameScreen[_0x2aadcc(0x15f)]()===0x1){this['_displayY']=this[_0x2aadcc(0x4e8)]()[_0x2aadcc(0x7da)];return;}VisuMZ[_0x2aadcc(0x785)][_0x2aadcc(0x592)][_0x2aadcc(0x703)](this,_0x12c770);},Game_Map['prototype']['setupTileExtendTerrainTags']=function(){const _0x1a00ae=_0x100070;this[_0x1a00ae(0x449)]={};const _0x1a6907=this[_0x1a00ae(0x5de)]();if(!_0x1a6907)return{};const _0x3356f8=_0x1a6907[_0x1a00ae(0x507)]||'',_0x14783a=/<(?:TALLER|EXT|EXTEND|RAISE)[ ]BY[ ](\d+):[ ](.*)>/gi;let _0x41e691={};const _0x1b71e6=_0x3356f8[_0x1a00ae(0x4aa)](_0x14783a);if(_0x1b71e6)for(const _0xfbc007 of _0x1b71e6){_0xfbc007[_0x1a00ae(0x4aa)](_0x14783a);const _0xcd089d=Number(RegExp['$1'])[_0x1a00ae(0x2d3)](0x1,0x10),_0x48ad10=String(RegExp['$2'])[_0x1a00ae(0x213)](',')[_0x1a00ae(0x22e)](_0x11407b=>Number(_0x11407b)[_0x1a00ae(0x2d3)](0x1,0x7));for(const _0xe1e177 of _0x48ad10){_0x41e691[_0xe1e177]=_0xcd089d;}}this[_0x1a00ae(0x449)]=_0x41e691;},Game_Map[_0x100070(0x7ae)][_0x100070(0x4af)]=function(){const _0x336fda=_0x100070;if(this[_0x336fda(0x449)]===undefined)this[_0x336fda(0x3d9)]();return this[_0x336fda(0x449)];},Game_Map[_0x100070(0x7ae)][_0x100070(0x5aa)]=function(_0x1297bb){const _0x450275=_0x100070;if(_0x1297bb>=0x400)return![];const _0x8443bb=$gameMap['getTileExtendTerrainTags']();if(Object[_0x450275(0x512)](_0x8443bb)[_0x450275(0x1ba)]<=0x0)return![];const _0x28eb51=this[_0x450275(0x6a4)](),_0x237155=_0x28eb51[_0x1297bb]>>0xc,_0x446615=_0x8443bb[_0x237155]||0x0;return _0x446615>0x0;},VisuMZ[_0x100070(0x785)][_0x100070(0x5db)]=Game_Map[_0x100070(0x7ae)][_0x100070(0x767)],Game_Map[_0x100070(0x7ae)][_0x100070(0x767)]=function(_0x470d77){const _0x3ed590=_0x100070;VisuMZ[_0x3ed590(0x785)]['Game_Map_changeTileset']['call'](this,_0x470d77),this[_0x3ed590(0x513)](),SceneManager[_0x3ed590(0x196)][_0x3ed590(0x3a3)][_0x3ed590(0x723)]();},Game_Map[_0x100070(0x7ae)]['refreshSpritesetForExtendedTiles']=function(){const _0x2b2170=_0x100070,_0x53df9b=this[_0x2b2170(0x4af)]();if(Object['keys'](_0x53df9b)[_0x2b2170(0x1ba)]<=0x0)return;const _0x2ab48b=SceneManager[_0x2b2170(0x196)]['_spriteset'];_0x2ab48b&&(_0x2ab48b[_0x2b2170(0x5bf)]&&_0x2ab48b['removeTileExtendSprites'](),_0x2ab48b[_0x2b2170(0x379)]&&_0x2ab48b[_0x2b2170(0x379)]());},VisuMZ['CoreEngine'][_0x100070(0x878)]=Game_Character[_0x100070(0x7ae)][_0x100070(0x72d)],Game_Character[_0x100070(0x7ae)]['processMoveCommand']=function(_0x17e9f6){const _0x2b3df0=_0x100070;try{VisuMZ[_0x2b3df0(0x785)][_0x2b3df0(0x878)][_0x2b3df0(0x703)](this,_0x17e9f6);}catch(_0x34c820){if($gameTemp[_0x2b3df0(0x16d)]())console[_0x2b3df0(0x4ce)](_0x34c820);}},Game_Player[_0x100070(0x7ae)][_0x100070(0x77c)]=function(){const _0x51f20f=_0x100070,_0x126850=$gameMap['encounterStep']();this['_encounterCount']=Math[_0x51f20f(0x5d6)](_0x126850)+Math[_0x51f20f(0x5d6)](_0x126850)+this[_0x51f20f(0x5d7)]();},Game_Player[_0x100070(0x7ae)][_0x100070(0x5d7)]=function(){const _0x1300d2=_0x100070;return $dataMap&&$dataMap['note']&&$dataMap[_0x1300d2(0x507)][_0x1300d2(0x4aa)](/<MINIMUM ENCOUNTER STEPS:[ ](\d+)>/i)?Number(RegExp['$1']):VisuMZ[_0x1300d2(0x785)][_0x1300d2(0x598)]['QoL'][_0x1300d2(0x67f)];},VisuMZ[_0x100070(0x785)]['Game_Event_isCollidedWithEvents']=Game_Event[_0x100070(0x7ae)][_0x100070(0x7f3)],Game_Event[_0x100070(0x7ae)][_0x100070(0x7f3)]=function(_0x1967aa,_0x5e93ac){const _0x564db5=_0x100070;return this['isSmartEventCollisionOn']()?this[_0x564db5(0x36a)](_0x1967aa,_0x5e93ac):VisuMZ['CoreEngine'][_0x564db5(0xe4)][_0x564db5(0x703)](this,_0x1967aa,_0x5e93ac);},Game_Event['prototype']['isSmartEventCollisionOn']=function(){const _0x4339cc=_0x100070;return VisuMZ[_0x4339cc(0x785)][_0x4339cc(0x598)][_0x4339cc(0x1f9)][_0x4339cc(0x1d0)];},Game_Event['prototype'][_0x100070(0x36a)]=function(_0x38dba7,_0x1fc15b){const _0x4e606a=_0x100070;if(!this[_0x4e606a(0xde)]())return![];else{const _0x45356a=$gameMap['eventsXyNt'](_0x38dba7,_0x1fc15b)[_0x4e606a(0x247)](_0x37de64=>_0x37de64[_0x4e606a(0xde)]());return _0x45356a[_0x4e606a(0x1ba)]>0x0;}},VisuMZ[_0x100070(0x785)][_0x100070(0x30a)]=Game_Interpreter[_0x100070(0x7ae)][_0x100070(0x181)],Game_Interpreter[_0x100070(0x7ae)][_0x100070(0x181)]=function(_0x1a2a10){const _0x147f4f=_0x100070,_0x9f4bcb=this[_0x147f4f(0xf1)]();return _0x9f4bcb['match'](/\/\/[ ]SCRIPT[ ]CALL/i)?this[_0x147f4f(0x899)](_0x9f4bcb):VisuMZ[_0x147f4f(0x785)][_0x147f4f(0x30a)][_0x147f4f(0x703)](this,_0x1a2a10);},Game_Interpreter['prototype'][_0x100070(0xf1)]=function(){const _0x2490df=_0x100070;let _0x21cc73='',_0x30b7ea=this['_index']+0x1;while(this[_0x2490df(0x596)][_0x30b7ea]&&this[_0x2490df(0x596)][_0x30b7ea][_0x2490df(0x57b)]===0x195){_0x21cc73+=this['_list'][_0x30b7ea]['parameters'][0x0]+'\x0a',_0x30b7ea++;}return _0x21cc73;},Game_Interpreter[_0x100070(0x7ae)][_0x100070(0x899)]=function(_0x45a234){const _0x2a6f13=_0x100070;try{eval(_0x45a234);}catch(_0x2cc438){$gameTemp['isPlaytest']()&&(console[_0x2a6f13(0x4ce)](_0x2a6f13(0x875)),console['log'](_0x2cc438));}return!![];},VisuMZ[_0x100070(0x785)][_0x100070(0x5c4)]=Game_Interpreter[_0x100070(0x7ae)][_0x100070(0x330)],Game_Interpreter[_0x100070(0x7ae)][_0x100070(0x330)]=function(_0x278322){const _0x2a58f5=_0x100070;try{VisuMZ[_0x2a58f5(0x785)][_0x2a58f5(0x5c4)][_0x2a58f5(0x703)](this,_0x278322);}catch(_0x209690){$gameTemp[_0x2a58f5(0x16d)]()&&(console[_0x2a58f5(0x4ce)]('Conditional\x20Branch\x20Script\x20Error'),console[_0x2a58f5(0x4ce)](_0x209690)),this[_0x2a58f5(0x468)]();}return!![];},VisuMZ['CoreEngine'][_0x100070(0x682)]=Game_Interpreter[_0x100070(0x7ae)][_0x100070(0x231)],Game_Interpreter[_0x100070(0x7ae)][_0x100070(0x231)]=function(_0x692566){const _0x3edce0=_0x100070;try{VisuMZ[_0x3edce0(0x785)]['Game_Interpreter_command122'][_0x3edce0(0x703)](this,_0x692566);}catch(_0xfddcf9){$gameTemp[_0x3edce0(0x16d)]()&&(console[_0x3edce0(0x4ce)](_0x3edce0(0x541)),console[_0x3edce0(0x4ce)](_0xfddcf9));}return!![];},VisuMZ[_0x100070(0x785)][_0x100070(0x293)]=Game_Interpreter[_0x100070(0x7ae)]['command355'],Game_Interpreter[_0x100070(0x7ae)][_0x100070(0x153)]=function(){const _0x1db329=_0x100070;try{VisuMZ[_0x1db329(0x785)][_0x1db329(0x293)]['call'](this);}catch(_0x1fee64){$gameTemp['isPlaytest']()&&(console[_0x1db329(0x4ce)](_0x1db329(0x876)),console[_0x1db329(0x4ce)](_0x1fee64));}return!![];},VisuMZ[_0x100070(0x785)]['Game_Interpreter_PluginCommand']=Game_Interpreter['prototype']['command357'],Game_Interpreter[_0x100070(0x7ae)]['command357']=function(_0xecab65){const _0x2ff4ab=_0x100070;return $gameTemp[_0x2ff4ab(0x152)](this),VisuMZ[_0x2ff4ab(0x785)][_0x2ff4ab(0x27c)][_0x2ff4ab(0x703)](this,_0xecab65);},Scene_Base[_0x100070(0x7ae)]['fadeSpeed']=function(){const _0x52e5e5=_0x100070;return VisuMZ[_0x52e5e5(0x785)]['Settings']['UI'][_0x52e5e5(0x631)];},Scene_Base[_0x100070(0x7ae)]['isBottomHelpMode']=function(){const _0x2aa325=_0x100070;return VisuMZ['CoreEngine'][_0x2aa325(0x598)]['UI'][_0x2aa325(0x4f7)];},Scene_Base[_0x100070(0x7ae)]['isBottomButtonMode']=function(){const _0xec9a96=_0x100070;return VisuMZ[_0xec9a96(0x785)][_0xec9a96(0x598)]['UI'][_0xec9a96(0x26f)];},Scene_Base['prototype']['isRightInputMode']=function(){const _0x4cab23=_0x100070;return VisuMZ['CoreEngine'][_0x4cab23(0x598)]['UI']['RightMenus'];},Scene_Base['prototype'][_0x100070(0x6d0)]=function(){const _0x2d6e24=_0x100070;return VisuMZ[_0x2d6e24(0x785)][_0x2d6e24(0x598)]['UI'][_0x2d6e24(0x7be)];},Scene_Base[_0x100070(0x7ae)]['buttonAreaHeight']=function(){const _0x4ad84a=_0x100070;return VisuMZ[_0x4ad84a(0x785)][_0x4ad84a(0x598)]['UI'][_0x4ad84a(0x1b9)];},Scene_Base[_0x100070(0x7ae)][_0x100070(0x373)]=function(){const _0x5b80e3=_0x100070;return VisuMZ[_0x5b80e3(0x785)][_0x5b80e3(0x598)][_0x5b80e3(0x775)][_0x5b80e3(0xdd)];},VisuMZ[_0x100070(0x785)]['Scene_Base_createWindowLayer']=Scene_Base[_0x100070(0x7ae)]['createWindowLayer'],Scene_Base[_0x100070(0x7ae)]['createWindowLayer']=function(){const _0x23c01e=_0x100070;VisuMZ[_0x23c01e(0x785)][_0x23c01e(0x34f)]['call'](this),this['createButtonAssistWindow'](),this['createTextPopupWindow'](),this['_windowLayer']['x']=Math[_0x23c01e(0x884)](this[_0x23c01e(0x65c)]['x']),this[_0x23c01e(0x65c)]['y']=Math[_0x23c01e(0x884)](this['_windowLayer']['y']);},Scene_Base['prototype'][_0x100070(0x7f4)]=function(){},Scene_Base[_0x100070(0x7ae)][_0x100070(0x5a8)]=function(){const _0x75ed7c=_0x100070;this[_0x75ed7c(0x3b8)]=new Window_TextPopup(),this[_0x75ed7c(0x4c1)](this[_0x75ed7c(0x3b8)]);},$textPopup=function(_0x45219f){const _0xefa6cd=_0x100070,_0x49fa83=SceneManager[_0xefa6cd(0x196)]['_textPopupWindow'];_0x49fa83&&_0x49fa83['addQueue'](_0x45219f);},Scene_Base[_0x100070(0x7ae)][_0x100070(0x7c9)]=function(){const _0x2c429b=_0x100070;return TextManager[_0x2c429b(0x30d)](_0x2c429b(0x351),_0x2c429b(0x802));},Scene_Base['prototype'][_0x100070(0x59c)]=function(){const _0x55d28d=_0x100070;return TextManager[_0x55d28d(0x59b)]('tab');},Scene_Base[_0x100070(0x7ae)]['buttonAssistKey3']=function(){const _0x3f0a06=_0x100070;return TextManager['getInputButtonString'](_0x3f0a06(0x653));},Scene_Base[_0x100070(0x7ae)][_0x100070(0x6f1)]=function(){const _0x58925e=_0x100070;return TextManager[_0x58925e(0x59b)]('ok');},Scene_Base[_0x100070(0x7ae)][_0x100070(0x7c1)]=function(){const _0x5535c8=_0x100070;return TextManager['getInputButtonString'](_0x5535c8(0x44a));},Scene_Base[_0x100070(0x7ae)]['buttonAssistText1']=function(){const _0x397b0f=_0x100070;return this[_0x397b0f(0x2cb)]&&this['_pageupButton']['visible']?TextManager[_0x397b0f(0x591)]:'';},Scene_Base[_0x100070(0x7ae)]['buttonAssistText2']=function(){return'';},Scene_Base[_0x100070(0x7ae)][_0x100070(0x2a7)]=function(){return'';},Scene_Base['prototype'][_0x100070(0x21e)]=function(){const _0x44cdde=_0x100070;return TextManager[_0x44cdde(0x112)];},Scene_Base[_0x100070(0x7ae)][_0x100070(0x313)]=function(){const _0xa452f7=_0x100070;return TextManager[_0xa452f7(0x36c)];},Scene_Base[_0x100070(0x7ae)][_0x100070(0x3b1)]=function(){return 0x0;},Scene_Base[_0x100070(0x7ae)][_0x100070(0x75d)]=function(){return 0x0;},Scene_Base[_0x100070(0x7ae)][_0x100070(0xc4)]=function(){return 0x0;},Scene_Base[_0x100070(0x7ae)]['buttonAssistOffset4']=function(){return 0x0;},Scene_Base[_0x100070(0x7ae)][_0x100070(0x4c0)]=function(){return 0x0;},VisuMZ[_0x100070(0x785)][_0x100070(0x76b)]=Scene_Boot['prototype'][_0x100070(0x300)],Scene_Boot[_0x100070(0x7ae)][_0x100070(0x300)]=function(){const _0x191a1a=_0x100070;VisuMZ['CoreEngine'][_0x191a1a(0x76b)][_0x191a1a(0x703)](this),this[_0x191a1a(0x7a8)]();},Scene_Boot['prototype']['loadGameImagesCoreEngine']=function(){const _0x9cce00=_0x100070,_0x1ff362=['animations',_0x9cce00(0x7e9),'battlebacks2','characters',_0x9cce00(0x85e),_0x9cce00(0x150),_0x9cce00(0x521),_0x9cce00(0x3ba),_0x9cce00(0x6e9),_0x9cce00(0x4cb),_0x9cce00(0x7b2),_0x9cce00(0x355),_0x9cce00(0x206),_0x9cce00(0x813)];for(const _0x32ef55 of _0x1ff362){const _0x58ffa5=VisuMZ[_0x9cce00(0x785)][_0x9cce00(0x598)][_0x9cce00(0x797)][_0x32ef55],_0x5ce47d='img/%1/'[_0x9cce00(0x4fd)](_0x32ef55);for(const _0x43a64f of _0x58ffa5){ImageManager[_0x9cce00(0x627)](_0x5ce47d,_0x43a64f);}}},VisuMZ['CoreEngine'][_0x100070(0x882)]=Scene_Boot[_0x100070(0x7ae)][_0x100070(0x342)],Scene_Boot['prototype']['startNormalGame']=function(){const _0x586294=_0x100070;Utils[_0x586294(0x405)](_0x586294(0x619))&&VisuMZ['CoreEngine'][_0x586294(0x598)][_0x586294(0x1f9)][_0x586294(0x1ab)]?this[_0x586294(0x594)]():VisuMZ[_0x586294(0x785)][_0x586294(0x882)][_0x586294(0x703)](this);},Scene_Boot[_0x100070(0x7ae)][_0x100070(0x594)]=function(){const _0x5c8b39=_0x100070;this[_0x5c8b39(0xd5)](),DataManager[_0x5c8b39(0x398)](),SceneManager[_0x5c8b39(0x2c5)](Scene_Map);},Scene_Boot[_0x100070(0x7ae)][_0x100070(0x669)]=function(){const _0x15386f=_0x100070,_0x558344=$dataSystem[_0x15386f(0x120)]['uiAreaWidth'],_0x5063cd=$dataSystem[_0x15386f(0x120)][_0x15386f(0x80b)],_0xc92283=VisuMZ['CoreEngine']['Settings']['UI'][_0x15386f(0x1fd)];Graphics['boxWidth']=_0x558344-_0xc92283*0x2,Graphics[_0x15386f(0x50e)]=_0x5063cd-_0xc92283*0x2,this[_0x15386f(0x3f0)]();},VisuMZ['CoreEngine']['Scene_Boot_updateDocumentTitle']=Scene_Boot[_0x100070(0x7ae)][_0x100070(0x6c7)],Scene_Boot[_0x100070(0x7ae)][_0x100070(0x6c7)]=function(){const _0xcf264e=_0x100070;this[_0xcf264e(0x6ea)]()?this[_0xcf264e(0x818)]():VisuMZ[_0xcf264e(0x785)][_0xcf264e(0x41d)]['call'](this);},Scene_Boot[_0x100070(0x7ae)][_0x100070(0x6ea)]=function(){const _0x4787b7=_0x100070;if(Scene_Title[_0x4787b7(0x5ae)]==='')return![];if(Scene_Title['subtitle']===_0x4787b7(0x201))return![];if(Scene_Title[_0x4787b7(0x158)]==='')return![];if(Scene_Title[_0x4787b7(0x158)]===_0x4787b7(0x445))return![];return!![];},Scene_Boot[_0x100070(0x7ae)]['makeDocumentTitle']=function(){const _0x11c970=_0x100070,_0x3c5322=$dataSystem[_0x11c970(0x4d7)],_0x370aff=Scene_Title['subtitle']||'',_0x580860=Scene_Title[_0x11c970(0x158)]||'',_0x146471=VisuMZ[_0x11c970(0x785)]['Settings'][_0x11c970(0x54f)][_0x11c970(0x63d)][_0x11c970(0x55b)],_0x24b598=_0x146471[_0x11c970(0x4fd)](_0x3c5322,_0x370aff,_0x580860);document[_0x11c970(0x31a)]=_0x24b598;},Scene_Boot[_0x100070(0x7ae)][_0x100070(0x3f0)]=function(){const _0x2708ed=_0x100070;if(VisuMZ[_0x2708ed(0x785)][_0x2708ed(0x598)]['UI'][_0x2708ed(0x1ae)]){const _0x53638e=Graphics[_0x2708ed(0x1ed)]-Graphics['boxWidth']-VisuMZ[_0x2708ed(0x785)][_0x2708ed(0x598)]['UI']['BoxMargin']*0x2,_0x24b3d1=Sprite_Button[_0x2708ed(0x7ae)][_0x2708ed(0x622)][_0x2708ed(0x703)](this)*0x4;if(_0x53638e>=_0x24b3d1)SceneManager[_0x2708ed(0x2f4)](!![]);}},Scene_Title[_0x100070(0x5ae)]=VisuMZ[_0x100070(0x785)][_0x100070(0x598)]['MenuLayout']['Title'][_0x100070(0x201)],Scene_Title[_0x100070(0x158)]=VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x54f)]['Title']['Version'],Scene_Title[_0x100070(0x457)]=VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x6da)],VisuMZ[_0x100070(0x785)][_0x100070(0x48c)]=Scene_Title['prototype'][_0x100070(0x699)],Scene_Title[_0x100070(0x7ae)]['drawGameTitle']=function(){const _0x9c74c4=_0x100070;VisuMZ[_0x9c74c4(0x785)]['Settings']['MenuLayout']['Title'][_0x9c74c4(0x699)][_0x9c74c4(0x703)](this);if(Scene_Title['subtitle']!==''&&Scene_Title[_0x9c74c4(0x5ae)]!=='Subtitle')this['drawGameSubtitle']();if(Scene_Title[_0x9c74c4(0x158)]!==''&&Scene_Title['version']!==_0x9c74c4(0x445))this['drawGameVersion']();},Scene_Title[_0x100070(0x7ae)]['drawGameSubtitle']=function(){const _0x40cd2a=_0x100070;VisuMZ[_0x40cd2a(0x785)][_0x40cd2a(0x598)][_0x40cd2a(0x54f)][_0x40cd2a(0x63d)][_0x40cd2a(0x234)][_0x40cd2a(0x703)](this);},Scene_Title[_0x100070(0x7ae)][_0x100070(0x53f)]=function(){const _0x7ebc49=_0x100070;VisuMZ[_0x7ebc49(0x785)]['Settings'][_0x7ebc49(0x54f)][_0x7ebc49(0x63d)][_0x7ebc49(0x53f)][_0x7ebc49(0x703)](this);},Scene_Title[_0x100070(0x7ae)]['createCommandWindow']=function(){const _0x261e1e=_0x100070;this[_0x261e1e(0x731)]();const _0x431255=$dataSystem[_0x261e1e(0x1ff)][_0x261e1e(0x429)],_0x2b21c6=this[_0x261e1e(0x273)]();this[_0x261e1e(0x7a3)]=new Window_TitleCommand(_0x2b21c6),this[_0x261e1e(0x7a3)][_0x261e1e(0x72b)](_0x431255);const _0x25f872=this[_0x261e1e(0x273)]();this[_0x261e1e(0x7a3)][_0x261e1e(0x5c5)](_0x25f872['x'],_0x25f872['y'],_0x25f872[_0x261e1e(0x1ed)],_0x25f872[_0x261e1e(0x6c5)]),this['_commandWindow'][_0x261e1e(0x22a)](),this[_0x261e1e(0x7a3)][_0x261e1e(0x5ad)](),this[_0x261e1e(0x7a3)]['selectLast'](),this[_0x261e1e(0x667)](this[_0x261e1e(0x7a3)]);},Scene_Title[_0x100070(0x7ae)][_0x100070(0x55c)]=function(){const _0xedbd5f=_0x100070;return this[_0xedbd5f(0x7a3)]?this['_commandWindow']['maxItems']():VisuMZ['CoreEngine']['Settings'][_0xedbd5f(0x4c5)][_0xedbd5f(0x1ba)];},Scene_Title['prototype'][_0x100070(0x273)]=function(){const _0x3afc91=_0x100070;return VisuMZ[_0x3afc91(0x785)][_0x3afc91(0x598)][_0x3afc91(0x54f)][_0x3afc91(0x63d)][_0x3afc91(0x451)][_0x3afc91(0x703)](this);},Scene_Title[_0x100070(0x7ae)][_0x100070(0x731)]=function(){const _0x1c6823=_0x100070;for(const _0x3bd90a of Scene_Title[_0x1c6823(0x457)]){const _0x3735d0=new Sprite_TitlePictureButton(_0x3bd90a);this[_0x1c6823(0x4c1)](_0x3735d0);}},VisuMZ[_0x100070(0x785)][_0x100070(0x506)]=Scene_Map['prototype'][_0x100070(0x811)],Scene_Map[_0x100070(0x7ae)][_0x100070(0x811)]=function(){const _0x16bf0e=_0x100070;VisuMZ[_0x16bf0e(0x785)]['Scene_Map_initialize'][_0x16bf0e(0x703)](this),$gameTemp[_0x16bf0e(0x1a6)](),this[_0x16bf0e(0x68e)]();},VisuMZ[_0x100070(0x785)]['Scene_Map_updateMainMultiply']=Scene_Map[_0x100070(0x7ae)][_0x100070(0x4b9)],Scene_Map['prototype'][_0x100070(0x4b9)]=function(){const _0x45a269=_0x100070;VisuMZ[_0x45a269(0x785)][_0x45a269(0x71e)]['call'](this),$gameTemp['_playTestFastMode']&&!$gameMessage[_0x45a269(0x416)]()&&(this['updateMain'](),SceneManager[_0x45a269(0x258)]());},Scene_Map[_0x100070(0x7ae)][_0x100070(0x697)]=function(){const _0x32586e=_0x100070;Scene_Message['prototype'][_0x32586e(0x697)]['call'](this),!SceneManager[_0x32586e(0xe3)](Scene_Battle)&&(this['_spriteset'][_0x32586e(0x723)](),this[_0x32586e(0x275)][_0x32586e(0x724)](),this[_0x32586e(0x65c)][_0x32586e(0x803)]=![],SceneManager['snapForBackground']()),$gameScreen[_0x32586e(0x3af)](),this['clearOnceParallelInterpreters']();},VisuMZ[_0x100070(0x785)][_0x100070(0x119)]=Scene_Map[_0x100070(0x7ae)][_0x100070(0x5f7)],Scene_Map['prototype']['createMenuButton']=function(){const _0x34333c=_0x100070;VisuMZ['CoreEngine'][_0x34333c(0x119)]['call'](this),SceneManager['isSideButtonLayout']()&&this[_0x34333c(0x1ac)]();},Scene_Map[_0x100070(0x7ae)][_0x100070(0x1ac)]=function(){const _0x2229ee=_0x100070;this[_0x2229ee(0x6a7)]['x']=Graphics[_0x2229ee(0x693)]+0x4;},VisuMZ[_0x100070(0x785)][_0x100070(0x2a5)]=Scene_Map[_0x100070(0x7ae)]['updateScene'],Scene_Map[_0x100070(0x7ae)][_0x100070(0x3a0)]=function(){const _0x550988=_0x100070;VisuMZ[_0x550988(0x785)][_0x550988(0x2a5)][_0x550988(0x703)](this),this[_0x550988(0x71a)]();},Scene_Map[_0x100070(0x7ae)][_0x100070(0x71a)]=function(){const _0x26af3e=_0x100070;Input[_0x26af3e(0x7f7)]('dashToggle')&&(ConfigManager['alwaysDash']=!ConfigManager[_0x26af3e(0x1bf)],ConfigManager['save']());},VisuMZ[_0x100070(0x785)]['Scene_Map_updateMain']=Scene_Map[_0x100070(0x7ae)][_0x100070(0x339)],Scene_Map['prototype'][_0x100070(0x339)]=function(){const _0x513151=_0x100070;VisuMZ[_0x513151(0x785)][_0x513151(0x7e4)][_0x513151(0x703)](this),this[_0x513151(0x29a)]();},Scene_Map['prototype']['clearOnceParallelInterpreters']=function(){const _0x55de7a=_0x100070;this[_0x55de7a(0x208)]=[];},Scene_Map[_0x100070(0x7ae)][_0x100070(0x29a)]=function(){const _0x4642a0=_0x100070;if(!this[_0x4642a0(0x208)])return;for(const _0x2065f3 of this[_0x4642a0(0x208)]){_0x2065f3&&_0x2065f3['update']();}},Scene_Map[_0x100070(0x7ae)]['playOnceParallelInterpreter']=function(_0x21897b,_0x20adc0){const _0x1701b3=_0x100070,_0x3eb4e3=$dataCommonEvents[_0x21897b];if(!_0x3eb4e3)return;const _0x4a4cf1=new Game_OnceParallelInterpreter();this[_0x1701b3(0x54b)](_0x4a4cf1),_0x4a4cf1[_0x1701b3(0x55e)](_0x21897b),_0x4a4cf1[_0x1701b3(0x491)](_0x20adc0);},Scene_Map[_0x100070(0x7ae)][_0x100070(0x54b)]=function(_0x250ec1){const _0x18ff1e=_0x100070;this[_0x18ff1e(0x208)]=this[_0x18ff1e(0x208)]||[],this[_0x18ff1e(0x208)][_0x18ff1e(0x443)](_0x250ec1);},Scene_Map['prototype']['removeOnceParallelInterpreter']=function(_0x595986){const _0x35d8df=_0x100070;this[_0x35d8df(0x208)]=this[_0x35d8df(0x208)]||[],this[_0x35d8df(0x208)]['remove'](_0x595986);};function Game_OnceParallelInterpreter(){const _0x3461f5=_0x100070;this[_0x3461f5(0x811)](...arguments);}Game_OnceParallelInterpreter['prototype']=Object[_0x100070(0x68d)](Game_Interpreter[_0x100070(0x7ae)]),Game_OnceParallelInterpreter[_0x100070(0x7ae)][_0x100070(0x1f7)]=Game_OnceParallelInterpreter,Game_OnceParallelInterpreter['prototype'][_0x100070(0x55e)]=function(_0xba7d47){const _0x5845c0=_0x100070,_0x5241eb=$dataCommonEvents[_0xba7d47];_0x5241eb?this[_0x5845c0(0x5e1)](_0x5241eb[_0x5845c0(0x386)],0x0):this['terminate']();},Game_OnceParallelInterpreter[_0x100070(0x7ae)][_0x100070(0x491)]=function(_0x3e376b){const _0x4997f8=_0x100070;this[_0x4997f8(0x77d)]=_0x3e376b||0x0;},Game_OnceParallelInterpreter['prototype']['terminate']=function(){const _0x26df28=_0x100070;if(!SceneManager[_0x26df28(0x177)]())return;SceneManager['_scene']['removeOnceParallelInterpreter'](this),Game_Interpreter[_0x26df28(0x7ae)][_0x26df28(0x697)][_0x26df28(0x703)](this);},VisuMZ[_0x100070(0x785)][_0x100070(0x67e)]=Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x217)],Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x217)]=function(){const _0x5adf8d=_0x100070;let _0x385c11=0x0;return SceneManager[_0x5adf8d(0x652)]()?_0x385c11=this[_0x5adf8d(0x245)]():_0x385c11=VisuMZ['CoreEngine'][_0x5adf8d(0x67e)][_0x5adf8d(0x703)](this),_0x385c11;},Scene_MenuBase['prototype']['helpAreaTopSideButtonLayout']=function(){const _0x8ad3ab=_0x100070;return this[_0x8ad3ab(0x230)]()?this['mainAreaBottom']():0x0;},VisuMZ[_0x100070(0x785)]['Scene_MenuBase_mainAreaTop']=Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x89e)],Scene_MenuBase[_0x100070(0x7ae)]['mainAreaTop']=function(){const _0x1a514b=_0x100070;return SceneManager[_0x1a514b(0x652)]()?this[_0x1a514b(0x3da)]():VisuMZ[_0x1a514b(0x785)][_0x1a514b(0xf7)][_0x1a514b(0x703)](this);},Scene_MenuBase['prototype'][_0x100070(0x3da)]=function(){const _0x2c195d=_0x100070;if(!this[_0x2c195d(0x230)]())return this[_0x2c195d(0x4f2)]();else return this[_0x2c195d(0x417)]()&&this[_0x2c195d(0x308)]()===_0x2c195d(0x5ff)?Window_ButtonAssist[_0x2c195d(0x7ae)][_0x2c195d(0x113)]():0x0;},VisuMZ['CoreEngine'][_0x100070(0x19b)]=Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x40f)],Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x40f)]=function(){const _0xaa5723=_0x100070;let _0x44efb2=0x0;return SceneManager[_0xaa5723(0x652)]()?_0x44efb2=this[_0xaa5723(0x1e3)]():_0x44efb2=VisuMZ[_0xaa5723(0x785)][_0xaa5723(0x19b)]['call'](this),this[_0xaa5723(0x417)]()&&this[_0xaa5723(0x308)]()!==_0xaa5723(0x301)&&(_0x44efb2-=Window_ButtonAssist[_0xaa5723(0x7ae)]['lineHeight']()),_0x44efb2;},Scene_MenuBase['prototype'][_0x100070(0x1e3)]=function(){const _0x59cf6a=_0x100070;return Graphics[_0x59cf6a(0x50e)]-this['helpAreaHeight']();},VisuMZ['CoreEngine'][_0x100070(0x510)]=Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x7bd)],Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x7bd)]=function(){const _0x175e07=_0x100070,_0x2d0f39=VisuMZ[_0x175e07(0x785)][_0x175e07(0x598)][_0x175e07(0x35d)][_0x175e07(0x7b0)]??0x8;this[_0x175e07(0x4e2)]=new PIXI[(_0x175e07(0x6d1))][(_0x175e07(0x263))](_0x2d0f39),this[_0x175e07(0x7f0)]=new Sprite(),this[_0x175e07(0x7f0)]['bitmap']=SceneManager[_0x175e07(0x88f)](),this[_0x175e07(0x7f0)][_0x175e07(0x6d1)]=[this['_backgroundFilter']],this[_0x175e07(0x4c1)](this[_0x175e07(0x7f0)]),this[_0x175e07(0xcc)](0xc0),this[_0x175e07(0xcc)](this['getBackgroundOpacity']()),this[_0x175e07(0x30b)]();},Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x2c8)]=function(){const _0x4fe281=_0x100070,_0xa37014=String(this['constructor'][_0x4fe281(0x554)]),_0x4daf02=this[_0x4fe281(0x179)](_0xa37014);return _0x4daf02?_0x4daf02[_0x4fe281(0x5df)]:0xc0;},Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x30b)]=function(){const _0x18512c=_0x100070,_0x4b2388=String(this[_0x18512c(0x1f7)][_0x18512c(0x554)]),_0x4b67b9=this[_0x18512c(0x179)](_0x4b2388);_0x4b67b9&&(_0x4b67b9['BgFilename1']!==''||_0x4b67b9[_0x18512c(0xfa)]!=='')&&(this[_0x18512c(0x886)]=new Sprite(ImageManager[_0x18512c(0x7ab)](_0x4b67b9['BgFilename1'])),this[_0x18512c(0x266)]=new Sprite(ImageManager[_0x18512c(0x590)](_0x4b67b9[_0x18512c(0xfa)])),this[_0x18512c(0x4c1)](this['_backSprite1']),this[_0x18512c(0x4c1)](this[_0x18512c(0x266)]),this[_0x18512c(0x886)][_0x18512c(0x6ed)]['addLoadListener'](this[_0x18512c(0xf2)][_0x18512c(0x4b0)](this,this[_0x18512c(0x886)])),this[_0x18512c(0x266)][_0x18512c(0x6ed)][_0x18512c(0x4e3)](this['adjustSprite'][_0x18512c(0x4b0)](this,this[_0x18512c(0x266)])));},Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x179)]=function(_0x44f81c){const _0x2c6151=_0x100070;return VisuMZ[_0x2c6151(0x785)][_0x2c6151(0x598)]['MenuBg'][_0x44f81c]||VisuMZ[_0x2c6151(0x785)][_0x2c6151(0x598)][_0x2c6151(0x35d)][_0x2c6151(0x505)];},Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0xf2)]=function(_0x58f217){const _0x3e9a98=_0x100070;this[_0x3e9a98(0x65f)](_0x58f217),this['centerSprite'](_0x58f217);},VisuMZ[_0x100070(0x785)][_0x100070(0x5f1)]=Scene_MenuBase['prototype']['createCancelButton'],Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x12a)]=function(){const _0x1aa2d2=_0x100070;VisuMZ[_0x1aa2d2(0x785)][_0x1aa2d2(0x5f1)][_0x1aa2d2(0x703)](this),SceneManager[_0x1aa2d2(0x425)]()&&this[_0x1aa2d2(0x3b4)]();},Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x3b4)]=function(){this['_cancelButton']['x']=Graphics['boxWidth']+0x4;},VisuMZ[_0x100070(0x785)][_0x100070(0x36f)]=Scene_MenuBase[_0x100070(0x7ae)]['createPageButtons'],Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x3d3)]=function(){const _0x3f77c9=_0x100070;VisuMZ['CoreEngine'][_0x3f77c9(0x36f)][_0x3f77c9(0x703)](this),SceneManager[_0x3f77c9(0x425)]()&&this['movePageButtonSideButtonLayout']();},Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x600)]=function(){const _0xb19d64=_0x100070;this[_0xb19d64(0x2cb)]['x']=-0x1*(this['_pageupButton'][_0xb19d64(0x1ed)]+this[_0xb19d64(0x3c3)][_0xb19d64(0x1ed)]+0x8),this[_0xb19d64(0x3c3)]['x']=-0x1*(this[_0xb19d64(0x3c3)][_0xb19d64(0x1ed)]+0x4);},Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x417)]=function(){const _0x413a08=_0x100070;return VisuMZ[_0x413a08(0x785)][_0x413a08(0x598)][_0x413a08(0x7ea)][_0x413a08(0x637)];},Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x308)]=function(){const _0x5a63d8=_0x100070;return SceneManager[_0x5a63d8(0x425)]()||SceneManager[_0x5a63d8(0x11a)]()?VisuMZ[_0x5a63d8(0x785)]['Settings'][_0x5a63d8(0x7ea)][_0x5a63d8(0x1f0)]:'button';},Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x7f4)]=function(){const _0x4f8a22=_0x100070;if(!this[_0x4f8a22(0x417)]())return;const _0x2734c4=this[_0x4f8a22(0x737)]();this['_buttonAssistWindow']=new Window_ButtonAssist(_0x2734c4),this[_0x4f8a22(0x667)](this[_0x4f8a22(0x3fd)]);},Scene_MenuBase[_0x100070(0x7ae)][_0x100070(0x737)]=function(){const _0x31cfcc=_0x100070;return this[_0x31cfcc(0x308)]()===_0x31cfcc(0x301)?this[_0x31cfcc(0x6a3)]():this[_0x31cfcc(0x475)]();},Scene_MenuBase[_0x100070(0x7ae)]['buttonAssistWindowButtonRect']=function(){const _0x2d2a73=_0x100070,_0x4bbeee=ConfigManager[_0x2d2a73(0x801)]?(Sprite_Button[_0x2d2a73(0x7ae)][_0x2d2a73(0x622)]()+0x6)*0x2:0x0,_0x3fdd77=this[_0x2d2a73(0x261)](),_0x1ac57c=Graphics['boxWidth']-_0x4bbeee*0x2,_0x10f104=this[_0x2d2a73(0x28b)]();return new Rectangle(_0x4bbeee,_0x3fdd77,_0x1ac57c,_0x10f104);},Scene_MenuBase[_0x100070(0x7ae)]['buttonAssistWindowSideRect']=function(){const _0x5907cc=_0x100070,_0x532de7=Graphics['boxWidth'],_0x52ed25=Window_ButtonAssist[_0x5907cc(0x7ae)][_0x5907cc(0x113)](),_0x5e57cc=0x0;let _0x17fc85=0x0;return this[_0x5907cc(0x308)]()===_0x5907cc(0x5ff)?_0x17fc85=0x0:_0x17fc85=Graphics[_0x5907cc(0x50e)]-_0x52ed25,new Rectangle(_0x5e57cc,_0x17fc85,_0x532de7,_0x52ed25);},Scene_Menu[_0x100070(0x118)]=VisuMZ['CoreEngine'][_0x100070(0x598)][_0x100070(0x54f)][_0x100070(0x48f)],VisuMZ['CoreEngine'][_0x100070(0x145)]=Scene_Menu[_0x100070(0x7ae)][_0x100070(0x68d)],Scene_Menu['prototype'][_0x100070(0x68d)]=function(){const _0x2f3f2d=_0x100070;VisuMZ[_0x2f3f2d(0x785)]['Scene_Menu_create'][_0x2f3f2d(0x703)](this),this[_0x2f3f2d(0x186)]();},Scene_Menu[_0x100070(0x7ae)][_0x100070(0x186)]=function(){const _0x3419c3=_0x100070;this[_0x3419c3(0x7a3)]&&this[_0x3419c3(0x7a3)][_0x3419c3(0x72b)](Scene_Menu[_0x3419c3(0x118)][_0x3419c3(0x50c)]),this[_0x3419c3(0x4ea)]&&this[_0x3419c3(0x4ea)][_0x3419c3(0x72b)](Scene_Menu[_0x3419c3(0x118)]['GoldBgType']),this[_0x3419c3(0x195)]&&this['_statusWindow'][_0x3419c3(0x72b)](Scene_Menu[_0x3419c3(0x118)]['StatusBgType']);},Scene_Menu[_0x100070(0x7ae)][_0x100070(0x273)]=function(){const _0x5886c1=_0x100070;return Scene_Menu[_0x5886c1(0x118)][_0x5886c1(0x451)][_0x5886c1(0x703)](this);},Scene_Menu[_0x100070(0x7ae)][_0x100070(0x17c)]=function(){const _0x5e0356=_0x100070;return Scene_Menu[_0x5e0356(0x118)]['GoldRect']['call'](this);},Scene_Menu['prototype'][_0x100070(0x382)]=function(){const _0x153d5d=_0x100070;return Scene_Menu['layoutSettings'][_0x153d5d(0x11b)][_0x153d5d(0x703)](this);},Scene_Item[_0x100070(0x118)]=VisuMZ[_0x100070(0x785)]['Settings'][_0x100070(0x54f)][_0x100070(0x185)],VisuMZ[_0x100070(0x785)][_0x100070(0x41e)]=Scene_Item[_0x100070(0x7ae)][_0x100070(0x68d)],Scene_Item[_0x100070(0x7ae)]['create']=function(){const _0x549609=_0x100070;VisuMZ[_0x549609(0x785)][_0x549609(0x41e)][_0x549609(0x703)](this),this[_0x549609(0x186)]();},Scene_Item['prototype']['setCoreEngineUpdateWindowBg']=function(){const _0x4fbcc1=_0x100070;this[_0x4fbcc1(0x18f)]&&this['_helpWindow'][_0x4fbcc1(0x72b)](Scene_Item[_0x4fbcc1(0x118)]['HelpBgType']),this[_0x4fbcc1(0x678)]&&this['_categoryWindow']['setBackgroundType'](Scene_Item[_0x4fbcc1(0x118)][_0x4fbcc1(0x5ed)]),this['_itemWindow']&&this[_0x4fbcc1(0x695)][_0x4fbcc1(0x72b)](Scene_Item[_0x4fbcc1(0x118)][_0x4fbcc1(0x306)]),this[_0x4fbcc1(0x6de)]&&this['_actorWindow'][_0x4fbcc1(0x72b)](Scene_Item['layoutSettings']['ActorBgType']);},Scene_Item[_0x100070(0x7ae)]['helpWindowRect']=function(){const _0x3e6ea1=_0x100070;return Scene_Item[_0x3e6ea1(0x118)][_0x3e6ea1(0x3b7)]['call'](this);},Scene_Item['prototype'][_0x100070(0x38c)]=function(){const _0x27a9c8=_0x100070;return Scene_Item[_0x27a9c8(0x118)][_0x27a9c8(0x78b)][_0x27a9c8(0x703)](this);},Scene_Item[_0x100070(0x7ae)]['itemWindowRect']=function(){const _0x5c7b45=_0x100070;return Scene_Item[_0x5c7b45(0x118)][_0x5c7b45(0x768)][_0x5c7b45(0x703)](this);},Scene_Item[_0x100070(0x7ae)]['actorWindowRect']=function(){const _0x3a2e5e=_0x100070;return Scene_Item[_0x3a2e5e(0x118)][_0x3a2e5e(0x48e)][_0x3a2e5e(0x703)](this);},Scene_Skill[_0x100070(0x118)]=VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x54f)][_0x100070(0x47a)],VisuMZ[_0x100070(0x785)][_0x100070(0x3d4)]=Scene_Skill[_0x100070(0x7ae)][_0x100070(0x68d)],Scene_Skill[_0x100070(0x7ae)][_0x100070(0x68d)]=function(){const _0x400628=_0x100070;VisuMZ[_0x400628(0x785)][_0x400628(0x3d4)][_0x400628(0x703)](this),this['setCoreEngineUpdateWindowBg']();},Scene_Skill[_0x100070(0x7ae)][_0x100070(0x186)]=function(){const _0xd79063=_0x100070;this[_0xd79063(0x18f)]&&this[_0xd79063(0x18f)][_0xd79063(0x72b)](Scene_Skill[_0xd79063(0x118)][_0xd79063(0x825)]),this[_0xd79063(0x647)]&&this['_skillTypeWindow'][_0xd79063(0x72b)](Scene_Skill[_0xd79063(0x118)][_0xd79063(0x5f3)]),this[_0xd79063(0x195)]&&this['_statusWindow']['setBackgroundType'](Scene_Skill['layoutSettings'][_0xd79063(0xb7)]),this[_0xd79063(0x695)]&&this[_0xd79063(0x695)][_0xd79063(0x72b)](Scene_Skill[_0xd79063(0x118)]['ItemBgType']),this[_0xd79063(0x6de)]&&this['_actorWindow'][_0xd79063(0x72b)](Scene_Skill['layoutSettings'][_0xd79063(0x589)]);},Scene_Skill[_0x100070(0x7ae)][_0x100070(0x6e1)]=function(){const _0x1cda03=_0x100070;return Scene_Skill['layoutSettings']['HelpRect'][_0x1cda03(0x703)](this);},Scene_Skill['prototype'][_0x100070(0x40b)]=function(){const _0x3b0684=_0x100070;return Scene_Skill[_0x3b0684(0x118)][_0x3b0684(0x2b8)][_0x3b0684(0x703)](this);},Scene_Skill['prototype'][_0x100070(0x382)]=function(){return Scene_Skill['layoutSettings']['StatusRect']['call'](this);},Scene_Skill[_0x100070(0x7ae)][_0x100070(0x2b6)]=function(){const _0xa9d276=_0x100070;return Scene_Skill[_0xa9d276(0x118)][_0xa9d276(0x768)][_0xa9d276(0x703)](this);},Scene_Skill[_0x100070(0x7ae)][_0x100070(0x57f)]=function(){const _0x3ceed3=_0x100070;return Scene_Skill[_0x3ceed3(0x118)][_0x3ceed3(0x48e)][_0x3ceed3(0x703)](this);},Scene_Equip['layoutSettings']=VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x54f)][_0x100070(0x687)],VisuMZ[_0x100070(0x785)][_0x100070(0x1a5)]=Scene_Equip[_0x100070(0x7ae)][_0x100070(0x68d)],Scene_Equip['prototype'][_0x100070(0x68d)]=function(){const _0x30664a=_0x100070;VisuMZ[_0x30664a(0x785)][_0x30664a(0x1a5)][_0x30664a(0x703)](this),this[_0x30664a(0x186)]();},Scene_Equip[_0x100070(0x7ae)][_0x100070(0x186)]=function(){const _0x132686=_0x100070;this['_helpWindow']&&this[_0x132686(0x18f)][_0x132686(0x72b)](Scene_Equip[_0x132686(0x118)][_0x132686(0x825)]),this['_statusWindow']&&this['_statusWindow'][_0x132686(0x72b)](Scene_Equip[_0x132686(0x118)][_0x132686(0xb7)]),this[_0x132686(0x7a3)]&&this[_0x132686(0x7a3)][_0x132686(0x72b)](Scene_Equip[_0x132686(0x118)][_0x132686(0x50c)]),this[_0x132686(0x7ff)]&&this[_0x132686(0x7ff)][_0x132686(0x72b)](Scene_Equip['layoutSettings'][_0x132686(0x531)]),this[_0x132686(0x695)]&&this[_0x132686(0x695)][_0x132686(0x72b)](Scene_Equip[_0x132686(0x118)][_0x132686(0x306)]);},Scene_Equip[_0x100070(0x7ae)][_0x100070(0x6e1)]=function(){const _0x21ead8=_0x100070;return Scene_Equip[_0x21ead8(0x118)][_0x21ead8(0x3b7)][_0x21ead8(0x703)](this);},Scene_Equip[_0x100070(0x7ae)][_0x100070(0x382)]=function(){const _0x1d408b=_0x100070;return Scene_Equip[_0x1d408b(0x118)][_0x1d408b(0x11b)][_0x1d408b(0x703)](this);},Scene_Equip['prototype'][_0x100070(0x273)]=function(){const _0xd07981=_0x100070;return Scene_Equip[_0xd07981(0x118)][_0xd07981(0x451)][_0xd07981(0x703)](this);},Scene_Equip[_0x100070(0x7ae)][_0x100070(0x515)]=function(){const _0x5da6fb=_0x100070;return Scene_Equip[_0x5da6fb(0x118)][_0x5da6fb(0x43c)][_0x5da6fb(0x703)](this);},Scene_Equip[_0x100070(0x7ae)][_0x100070(0x2b6)]=function(){const _0x49bb3c=_0x100070;return Scene_Equip[_0x49bb3c(0x118)][_0x49bb3c(0x768)][_0x49bb3c(0x703)](this);},Scene_Status[_0x100070(0x118)]=VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x54f)][_0x100070(0x564)],VisuMZ[_0x100070(0x785)][_0x100070(0x1a0)]=Scene_Status[_0x100070(0x7ae)][_0x100070(0x68d)],Scene_Status['prototype']['create']=function(){const _0x501447=_0x100070;VisuMZ['CoreEngine'][_0x501447(0x1a0)][_0x501447(0x703)](this),this[_0x501447(0x186)]();},Scene_Status['prototype'][_0x100070(0x186)]=function(){const _0x49e4d0=_0x100070;this[_0x49e4d0(0x73d)]&&this[_0x49e4d0(0x73d)][_0x49e4d0(0x72b)](Scene_Status['layoutSettings'][_0x49e4d0(0x538)]),this[_0x49e4d0(0x195)]&&this[_0x49e4d0(0x195)][_0x49e4d0(0x72b)](Scene_Status[_0x49e4d0(0x118)]['StatusBgType']),this['_statusParamsWindow']&&this['_statusParamsWindow'][_0x49e4d0(0x72b)](Scene_Status[_0x49e4d0(0x118)][_0x49e4d0(0x303)]),this[_0x49e4d0(0xd3)]&&this[_0x49e4d0(0xd3)][_0x49e4d0(0x72b)](Scene_Status[_0x49e4d0(0x118)][_0x49e4d0(0x50a)]);},Scene_Status[_0x100070(0x7ae)][_0x100070(0x61c)]=function(){const _0x320736=_0x100070;return Scene_Status['layoutSettings']['ProfileRect'][_0x320736(0x703)](this);},Scene_Status[_0x100070(0x7ae)][_0x100070(0x382)]=function(){const _0x42a1a9=_0x100070;return Scene_Status[_0x42a1a9(0x118)][_0x42a1a9(0x11b)][_0x42a1a9(0x703)](this);},Scene_Status['prototype'][_0x100070(0x2f3)]=function(){const _0x28df2c=_0x100070;return Scene_Status[_0x28df2c(0x118)][_0x28df2c(0x753)][_0x28df2c(0x703)](this);},Scene_Status['prototype'][_0x100070(0x760)]=function(){const _0x5948ce=_0x100070;return Scene_Status[_0x5948ce(0x118)][_0x5948ce(0x892)]['call'](this);},Scene_Options[_0x100070(0x118)]=VisuMZ['CoreEngine']['Settings'][_0x100070(0x54f)][_0x100070(0x6b1)],VisuMZ['CoreEngine'][_0x100070(0x392)]=Scene_Options[_0x100070(0x7ae)]['create'],Scene_Options[_0x100070(0x7ae)][_0x100070(0x68d)]=function(){const _0x1059d0=_0x100070;VisuMZ[_0x1059d0(0x785)][_0x1059d0(0x392)][_0x1059d0(0x703)](this),this[_0x1059d0(0x186)]();},Scene_Options[_0x100070(0x7ae)][_0x100070(0x186)]=function(){const _0x1d38f6=_0x100070;this['_optionsWindow']&&this[_0x1d38f6(0x385)][_0x1d38f6(0x72b)](Scene_Options[_0x1d38f6(0x118)][_0x1d38f6(0x60d)]);},Scene_Options[_0x100070(0x7ae)][_0x100070(0x216)]=function(){const _0x2e3c64=_0x100070;return Scene_Options['layoutSettings']['OptionsRect'][_0x2e3c64(0x703)](this);},Scene_Save['layoutSettings']=VisuMZ[_0x100070(0x785)][_0x100070(0x598)]['MenuLayout'][_0x100070(0x7eb)],Scene_Save[_0x100070(0x7ae)][_0x100070(0x68d)]=function(){const _0x43e16c=_0x100070;Scene_File['prototype'][_0x43e16c(0x68d)][_0x43e16c(0x703)](this),this[_0x43e16c(0x186)]();},Scene_Save[_0x100070(0x7ae)][_0x100070(0x186)]=function(){const _0xdc31b8=_0x100070;this['_helpWindow']&&this[_0xdc31b8(0x18f)][_0xdc31b8(0x72b)](Scene_Save[_0xdc31b8(0x118)]['HelpBgType']),this['_listWindow']&&this[_0xdc31b8(0x364)][_0xdc31b8(0x72b)](Scene_Save[_0xdc31b8(0x118)][_0xdc31b8(0x56e)]);},Scene_Save[_0x100070(0x7ae)][_0x100070(0x6e1)]=function(){const _0x5edacc=_0x100070;return Scene_Save[_0x5edacc(0x118)][_0x5edacc(0x3b7)]['call'](this);},Scene_Save[_0x100070(0x7ae)][_0x100070(0x758)]=function(){const _0x4aa63d=_0x100070;return Scene_Save[_0x4aa63d(0x118)][_0x4aa63d(0x292)]['call'](this);},Scene_Load[_0x100070(0x118)]=VisuMZ[_0x100070(0x785)]['Settings'][_0x100070(0x54f)][_0x100070(0x664)],Scene_Load[_0x100070(0x7ae)][_0x100070(0x68d)]=function(){const _0x553bcc=_0x100070;Scene_File['prototype'][_0x553bcc(0x68d)]['call'](this),this[_0x553bcc(0x186)]();},Scene_Load['prototype'][_0x100070(0x186)]=function(){const _0x40a36a=_0x100070;this[_0x40a36a(0x18f)]&&this[_0x40a36a(0x18f)]['setBackgroundType'](Scene_Load[_0x40a36a(0x118)][_0x40a36a(0x825)]),this[_0x40a36a(0x364)]&&this[_0x40a36a(0x364)][_0x40a36a(0x72b)](Scene_Load[_0x40a36a(0x118)][_0x40a36a(0x56e)]);},Scene_Load['prototype']['helpWindowRect']=function(){const _0x123382=_0x100070;return Scene_Load[_0x123382(0x118)]['HelpRect'][_0x123382(0x703)](this);},Scene_Load[_0x100070(0x7ae)][_0x100070(0x758)]=function(){const _0x3ce367=_0x100070;return Scene_Load[_0x3ce367(0x118)][_0x3ce367(0x292)][_0x3ce367(0x703)](this);};function Scene_QuickLoad(){const _0x154ad4=_0x100070;this[_0x154ad4(0x811)](...arguments);}Scene_QuickLoad[_0x100070(0x7ae)]=Object['create'](Scene_Load[_0x100070(0x7ae)]),Scene_QuickLoad[_0x100070(0x7ae)][_0x100070(0x1f7)]=Scene_QuickLoad,Scene_QuickLoad['prototype'][_0x100070(0x811)]=function(){const _0x5ae91a=_0x100070;Scene_Load[_0x5ae91a(0x7ae)][_0x5ae91a(0x811)]['call'](this);},Scene_QuickLoad[_0x100070(0x7ae)][_0x100070(0x68d)]=function(){const _0x2d0513=_0x100070;this[_0x2d0513(0x6c3)](this['_saveFileID']);},Scene_QuickLoad['prototype'][_0x100070(0x52a)]=function(_0x2b3c33){this['_saveFileID']=_0x2b3c33;},Scene_QuickLoad[_0x100070(0x7ae)][_0x100070(0x18d)]=function(){const _0x192dff=_0x100070;Scene_MenuBase[_0x192dff(0x7ae)][_0x192dff(0x18d)]['call'](this);},Scene_GameEnd[_0x100070(0x118)]=VisuMZ[_0x100070(0x785)]['Settings'][_0x100070(0x54f)][_0x100070(0x7d6)],VisuMZ['CoreEngine'][_0x100070(0x62a)]=Scene_GameEnd[_0x100070(0x7ae)][_0x100070(0x7bd)],Scene_GameEnd[_0x100070(0x7ae)][_0x100070(0x7bd)]=function(){const _0x27c410=_0x100070;Scene_MenuBase[_0x27c410(0x7ae)][_0x27c410(0x7bd)][_0x27c410(0x703)](this);},Scene_GameEnd[_0x100070(0x7ae)][_0x100070(0x705)]=function(){const _0x4d4d2b=_0x100070,_0x637278=this[_0x4d4d2b(0x273)]();this[_0x4d4d2b(0x7a3)]=new Window_GameEnd(_0x637278),this['_commandWindow'][_0x4d4d2b(0x84c)](_0x4d4d2b(0x44a),this['popScene'][_0x4d4d2b(0x4b0)](this)),this['addWindow'](this['_commandWindow']),this['_commandWindow']['setBackgroundType'](Scene_GameEnd[_0x4d4d2b(0x118)][_0x4d4d2b(0x50c)]);},Scene_GameEnd[_0x100070(0x7ae)][_0x100070(0x273)]=function(){const _0x45ba8a=_0x100070;return Scene_GameEnd['layoutSettings'][_0x45ba8a(0x451)][_0x45ba8a(0x703)](this);},Scene_Shop['layoutSettings']=VisuMZ[_0x100070(0x785)]['Settings'][_0x100070(0x54f)][_0x100070(0x325)],VisuMZ['CoreEngine'][_0x100070(0x423)]=Scene_Shop[_0x100070(0x7ae)][_0x100070(0x68d)],Scene_Shop[_0x100070(0x7ae)]['create']=function(){const _0x2ee5e1=_0x100070;VisuMZ[_0x2ee5e1(0x785)][_0x2ee5e1(0x423)][_0x2ee5e1(0x703)](this),this[_0x2ee5e1(0x186)]();},Scene_Shop[_0x100070(0x7ae)][_0x100070(0x186)]=function(){const _0x415797=_0x100070;this[_0x415797(0x18f)]&&this[_0x415797(0x18f)][_0x415797(0x72b)](Scene_Shop[_0x415797(0x118)][_0x415797(0x825)]),this[_0x415797(0x4ea)]&&this[_0x415797(0x4ea)]['setBackgroundType'](Scene_Shop[_0x415797(0x118)][_0x415797(0x78f)]),this[_0x415797(0x7a3)]&&this['_commandWindow'][_0x415797(0x72b)](Scene_Shop['layoutSettings'][_0x415797(0x50c)]),this['_dummyWindow']&&this[_0x415797(0x6f2)][_0x415797(0x72b)](Scene_Shop[_0x415797(0x118)][_0x415797(0x666)]),this[_0x415797(0x633)]&&this[_0x415797(0x633)][_0x415797(0x72b)](Scene_Shop[_0x415797(0x118)][_0x415797(0x5b2)]),this[_0x415797(0x195)]&&this[_0x415797(0x195)][_0x415797(0x72b)](Scene_Shop['layoutSettings']['StatusBgType']),this[_0x415797(0x685)]&&this['_buyWindow'][_0x415797(0x72b)](Scene_Shop['layoutSettings'][_0x415797(0x252)]),this[_0x415797(0x678)]&&this['_categoryWindow'][_0x415797(0x72b)](Scene_Shop[_0x415797(0x118)][_0x415797(0x5ed)]),this[_0x415797(0x68f)]&&this[_0x415797(0x68f)]['setBackgroundType'](Scene_Shop[_0x415797(0x118)][_0x415797(0x5da)]);},Scene_Shop['prototype'][_0x100070(0x6e1)]=function(){const _0x3e04d6=_0x100070;return Scene_Shop[_0x3e04d6(0x118)]['HelpRect'][_0x3e04d6(0x703)](this);},Scene_Shop[_0x100070(0x7ae)][_0x100070(0x17c)]=function(){const _0x3eecf0=_0x100070;return Scene_Shop[_0x3eecf0(0x118)][_0x3eecf0(0x716)][_0x3eecf0(0x703)](this);},Scene_Shop['prototype']['commandWindowRect']=function(){const _0x5c064c=_0x100070;return Scene_Shop['layoutSettings'][_0x5c064c(0x451)]['call'](this);},Scene_Shop[_0x100070(0x7ae)][_0x100070(0x733)]=function(){const _0xf45234=_0x100070;return Scene_Shop['layoutSettings']['DummyRect'][_0xf45234(0x703)](this);},Scene_Shop[_0x100070(0x7ae)][_0x100070(0x282)]=function(){return Scene_Shop['layoutSettings']['NumberRect']['call'](this);},Scene_Shop['prototype'][_0x100070(0x382)]=function(){const _0x210c22=_0x100070;return Scene_Shop['layoutSettings'][_0x210c22(0x11b)]['call'](this);},Scene_Shop[_0x100070(0x7ae)][_0x100070(0x660)]=function(){const _0x506f6b=_0x100070;return Scene_Shop[_0x506f6b(0x118)][_0x506f6b(0xe7)][_0x506f6b(0x703)](this);},Scene_Shop[_0x100070(0x7ae)][_0x100070(0x38c)]=function(){const _0x23ac26=_0x100070;return Scene_Shop['layoutSettings'][_0x23ac26(0x78b)][_0x23ac26(0x703)](this);},Scene_Shop[_0x100070(0x7ae)][_0x100070(0x259)]=function(){const _0x4645a9=_0x100070;return Scene_Shop[_0x4645a9(0x118)][_0x4645a9(0x896)][_0x4645a9(0x703)](this);},Scene_Name[_0x100070(0x118)]=VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x54f)]['NameMenu'],VisuMZ[_0x100070(0x785)][_0x100070(0x31d)]=Scene_Name['prototype'][_0x100070(0x68d)],Scene_Name[_0x100070(0x7ae)][_0x100070(0x68d)]=function(){const _0x43aff4=_0x100070;VisuMZ[_0x43aff4(0x785)]['Scene_Name_create'][_0x43aff4(0x703)](this),this[_0x43aff4(0x186)]();},Scene_Name['prototype'][_0x100070(0x186)]=function(){const _0x5bf88c=_0x100070;this['_editWindow']&&this[_0x5bf88c(0x256)][_0x5bf88c(0x72b)](Scene_Name[_0x5bf88c(0x118)][_0x5bf88c(0x264)]),this[_0x5bf88c(0x839)]&&this[_0x5bf88c(0x839)][_0x5bf88c(0x72b)](Scene_Name[_0x5bf88c(0x118)]['InputBgType']);},Scene_Name[_0x100070(0x7ae)][_0x100070(0x3cc)]=function(){return 0x0;},Scene_Name[_0x100070(0x7ae)][_0x100070(0x46c)]=function(){const _0x2f03cb=_0x100070;return Scene_Name['layoutSettings'][_0x2f03cb(0x21a)][_0x2f03cb(0x703)](this);},Scene_Name[_0x100070(0x7ae)]['inputWindowRect']=function(){const _0x40b804=_0x100070;return Scene_Name[_0x40b804(0x118)][_0x40b804(0x1c0)][_0x40b804(0x703)](this);},Scene_Name['prototype'][_0x100070(0x66f)]=function(){const _0xa70d8b=_0x100070;if(!this['_inputWindow'])return![];return VisuMZ[_0xa70d8b(0x785)][_0xa70d8b(0x598)]['KeyboardInput'][_0xa70d8b(0x66f)];},Scene_Name[_0x100070(0x7ae)][_0x100070(0x7c9)]=function(){const _0x2a733c=_0x100070;if(this['EnableNameInput']()&&this['_inputWindow']['_mode']!==_0x2a733c(0x486))return TextManager[_0x2a733c(0x30d)]('pageup',_0x2a733c(0x802));return Scene_MenuBase[_0x2a733c(0x7ae)][_0x2a733c(0x7c9)][_0x2a733c(0x703)](this);},Scene_Name[_0x100070(0x7ae)][_0x100070(0x39d)]=function(){const _0x1b051c=_0x100070;return this[_0x1b051c(0x66f)]()?TextManager[_0x1b051c(0x59b)](_0x1b051c(0x161)):Scene_MenuBase['prototype']['buttonAssistKey3'][_0x1b051c(0x703)](this);},Scene_Name['prototype']['buttonAssistKey4']=function(){const _0x5ca004=_0x100070;if(this[_0x5ca004(0x66f)]()&&this[_0x5ca004(0x839)][_0x5ca004(0x7bf)]===_0x5ca004(0x486))return TextManager['makeInputButtonString']([_0x5ca004(0x291)]);return Scene_MenuBase['prototype'][_0x5ca004(0x6f1)]['call'](this);},Scene_Name[_0x100070(0x7ae)][_0x100070(0x7c1)]=function(){const _0x405cca=_0x100070;if(this[_0x405cca(0x66f)]()&&this['_inputWindow'][_0x405cca(0x7bf)]===_0x405cca(0x486))return TextManager[_0x405cca(0x889)](['BKSP']);return Scene_MenuBase[_0x405cca(0x7ae)][_0x405cca(0x7c1)][_0x405cca(0x703)](this);},Scene_Name[_0x100070(0x7ae)][_0x100070(0x866)]=function(){const _0x288a68=_0x100070;if(this[_0x288a68(0x66f)]()&&this[_0x288a68(0x839)]['_mode']!==_0x288a68(0x486)){const _0x566bae=VisuMZ[_0x288a68(0x785)][_0x288a68(0x598)][_0x288a68(0x78a)];return _0x566bae['PageChange']||_0x288a68(0x1be);}return Scene_MenuBase[_0x288a68(0x7ae)][_0x288a68(0x866)][_0x288a68(0x703)](this);},Scene_Name[_0x100070(0x7ae)][_0x100070(0x2a7)]=function(){const _0x48a619=_0x100070;if(this[_0x48a619(0x66f)]()){const _0xf6257a=VisuMZ[_0x48a619(0x785)][_0x48a619(0x598)][_0x48a619(0x78a)];return this[_0x48a619(0x839)]['_mode']===_0x48a619(0x486)?_0xf6257a['Keyboard']||'Keyboard':_0xf6257a[_0x48a619(0x484)]||'Manual';}else return Scene_MenuBase[_0x48a619(0x7ae)][_0x48a619(0x2a7)][_0x48a619(0x703)](this);},Scene_Name['prototype'][_0x100070(0x21e)]=function(){const _0x2c7742=_0x100070;if(this[_0x2c7742(0x66f)]()){const _0x42ce82=VisuMZ[_0x2c7742(0x785)][_0x2c7742(0x598)][_0x2c7742(0x78a)];if(this[_0x2c7742(0x839)][_0x2c7742(0x7bf)]===_0x2c7742(0x486))return _0x42ce82[_0x2c7742(0x2dc)]||_0x2c7742(0x2dc);}return Scene_MenuBase[_0x2c7742(0x7ae)][_0x2c7742(0x21e)][_0x2c7742(0x703)](this);},VisuMZ['CoreEngine'][_0x100070(0x6ce)]=Scene_Name[_0x100070(0x7ae)][_0x100070(0x71f)],Scene_Name['prototype'][_0x100070(0x71f)]=function(){const _0x25a516=_0x100070;this[_0x25a516(0x88c)]()?this[_0x25a516(0x78d)]():VisuMZ[_0x25a516(0x785)][_0x25a516(0x6ce)][_0x25a516(0x703)](this);},Scene_Name[_0x100070(0x7ae)]['doesNameContainBannedWords']=function(){const _0x5c76f4=_0x100070,_0x2cd68a=VisuMZ[_0x5c76f4(0x785)][_0x5c76f4(0x598)][_0x5c76f4(0x78a)];if(!_0x2cd68a)return![];const _0x488db6=_0x2cd68a[_0x5c76f4(0x473)];if(!_0x488db6)return![];const _0x27b0f7=this[_0x5c76f4(0x256)][_0x5c76f4(0x554)]()[_0x5c76f4(0x1d4)]();for(const _0x4a867a of _0x488db6){if(_0x27b0f7['includes'](_0x4a867a[_0x5c76f4(0x1d4)]()))return!![];}return![];},Scene_Name[_0x100070(0x7ae)][_0x100070(0x78d)]=function(){SoundManager['playBuzzer']();},VisuMZ[_0x100070(0x785)][_0x100070(0x832)]=Scene_Battle[_0x100070(0x7ae)][_0x100070(0x723)],Scene_Battle[_0x100070(0x7ae)][_0x100070(0x723)]=function(){const _0x2026f0=_0x100070;VisuMZ[_0x2026f0(0x785)][_0x2026f0(0x832)][_0x2026f0(0x703)](this);if($gameTemp[_0x2026f0(0x2a4)])this['updatePlayTestF7']();},Scene_Battle['prototype'][_0x100070(0x1b3)]=function(){const _0x48d555=_0x100070;!BattleManager[_0x48d555(0x824)]()&&!this[_0x48d555(0x810)]&&!$gameMessage[_0x48d555(0x416)]()&&(this['_playtestF7Looping']=!![],this['update'](),SceneManager['updateEffekseer'](),this[_0x48d555(0x810)]=![]);},VisuMZ[_0x100070(0x785)]['Scene_Battle_createCancelButton']=Scene_Battle[_0x100070(0x7ae)][_0x100070(0x12a)],Scene_Battle[_0x100070(0x7ae)][_0x100070(0x12a)]=function(){const _0x1b1f34=_0x100070;VisuMZ[_0x1b1f34(0x785)][_0x1b1f34(0x165)][_0x1b1f34(0x703)](this),SceneManager[_0x1b1f34(0x425)]()&&this[_0x1b1f34(0x380)]();},Scene_Battle['prototype'][_0x100070(0x380)]=function(){const _0x3debef=_0x100070;this[_0x3debef(0x276)]['x']=Graphics[_0x3debef(0x693)]+0x4,this[_0x3debef(0x7b1)]()?this[_0x3debef(0x276)]['y']=Graphics[_0x3debef(0x50e)]-this[_0x3debef(0x28b)]():this[_0x3debef(0x276)]['y']=0x0;},VisuMZ[_0x100070(0x785)][_0x100070(0x82b)]=Sprite_Button[_0x100070(0x7ae)]['initialize'],Sprite_Button['prototype']['initialize']=function(_0x5a3e63){const _0xf87928=_0x100070;VisuMZ['CoreEngine'][_0xf87928(0x82b)][_0xf87928(0x703)](this,_0x5a3e63),this[_0xf87928(0x548)]();},Sprite_Button[_0x100070(0x7ae)][_0x100070(0x548)]=function(){const _0x58ea8f=_0x100070,_0x55ca7c=VisuMZ['CoreEngine'][_0x58ea8f(0x598)]['UI'];this[_0x58ea8f(0x4e0)]=![];switch(this['_buttonType']){case'cancel':this['_isButtonHidden']=!_0x55ca7c[_0x58ea8f(0x404)];break;case'pageup':case _0x58ea8f(0x802):this[_0x58ea8f(0x4e0)]=!_0x55ca7c[_0x58ea8f(0x574)];break;case _0x58ea8f(0x2a8):case'up':case _0x58ea8f(0x5a6):case'up2':case'ok':this[_0x58ea8f(0x4e0)]=!_0x55ca7c[_0x58ea8f(0xf9)];break;case _0x58ea8f(0x1c9):this[_0x58ea8f(0x4e0)]=!_0x55ca7c[_0x58ea8f(0x24c)];break;}},VisuMZ[_0x100070(0x785)][_0x100070(0x3fe)]=Sprite_Button[_0x100070(0x7ae)][_0x100070(0x5d8)],Sprite_Button[_0x100070(0x7ae)][_0x100070(0x5d8)]=function(){const _0x25340a=_0x100070;SceneManager[_0x25340a(0x11a)]()||this[_0x25340a(0x4e0)]?this[_0x25340a(0xe2)]():VisuMZ[_0x25340a(0x785)][_0x25340a(0x3fe)][_0x25340a(0x703)](this);},Sprite_Button[_0x100070(0x7ae)]['hideButtonFromView']=function(){const _0x5d3d2e=_0x100070;this[_0x5d3d2e(0x803)]=![],this[_0x5d3d2e(0x2da)]=0x0,this['x']=Graphics[_0x5d3d2e(0x1ed)]*0xa,this['y']=Graphics['height']*0xa;},VisuMZ['CoreEngine'][_0x100070(0x16e)]=Sprite_Battler['prototype'][_0x100070(0x551)],Sprite_Battler['prototype']['startMove']=function(_0x2b4aca,_0x4e17ba,_0x4477f7){const _0x17ee9a=_0x100070;(this[_0x17ee9a(0x5d0)]!==_0x2b4aca||this['_targetOffsetY']!==_0x4e17ba)&&(this[_0x17ee9a(0x23e)](_0x17ee9a(0x80e)),this['_movementWholeDuration']=_0x4477f7),VisuMZ['CoreEngine']['Sprite_Battler_startMove'][_0x17ee9a(0x703)](this,_0x2b4aca,_0x4e17ba,_0x4477f7);},Sprite_Battler[_0x100070(0x7ae)]['setMoveEasingType']=function(_0x58272a){const _0x116f51=_0x100070;this[_0x116f51(0x28d)]=_0x58272a;},Sprite_Battler[_0x100070(0x7ae)]['updateMove']=function(){const _0x7417a4=_0x100070;if(this[_0x7417a4(0x1e0)]<=0x0)return;const _0x401154=this[_0x7417a4(0x1e0)],_0x2430ee=this[_0x7417a4(0x2d8)],_0x4ec1e2=this[_0x7417a4(0x28d)];this['_offsetX']=this[_0x7417a4(0x248)](this[_0x7417a4(0x467)],this[_0x7417a4(0x5d0)],_0x401154,_0x2430ee,_0x4ec1e2),this['_offsetY']=this[_0x7417a4(0x248)](this[_0x7417a4(0x227)],this['_targetOffsetY'],_0x401154,_0x2430ee,_0x4ec1e2),this[_0x7417a4(0x1e0)]--;if(this[_0x7417a4(0x1e0)]<=0x0)this[_0x7417a4(0x6af)]();},Sprite_Battler['prototype']['applyEasing']=function(_0x5018fc,_0xb69067,_0x568177,_0xb0be8f,_0x2f2e58){const _0x6bf7db=_0x100070,_0x1ef91f=VisuMZ[_0x6bf7db(0x702)]((_0xb0be8f-_0x568177)/_0xb0be8f,_0x2f2e58||'Linear'),_0x452484=VisuMZ[_0x6bf7db(0x702)]((_0xb0be8f-_0x568177+0x1)/_0xb0be8f,_0x2f2e58||_0x6bf7db(0x80e)),_0x2ffd71=(_0x5018fc-_0xb69067*_0x1ef91f)/(0x1-_0x1ef91f);return _0x2ffd71+(_0xb69067-_0x2ffd71)*_0x452484;},VisuMZ[_0x100070(0x785)][_0x100070(0x102)]=Sprite_Actor[_0x100070(0x7ae)][_0x100070(0x318)],Sprite_Actor[_0x100070(0x7ae)][_0x100070(0x318)]=function(_0x673d6c){const _0x3edc9a=_0x100070;VisuMZ[_0x3edc9a(0x785)][_0x3edc9a(0x598)]['UI'][_0x3edc9a(0x642)]?this[_0x3edc9a(0x707)](_0x673d6c):VisuMZ[_0x3edc9a(0x785)]['Sprite_Actor_setActorHome'][_0x3edc9a(0x703)](this,_0x673d6c);},Sprite_Actor[_0x100070(0x7ae)][_0x100070(0x707)]=function(_0xd64fd2){const _0x3f30c4=_0x100070;let _0x5864d8=Math[_0x3f30c4(0x884)](Graphics[_0x3f30c4(0x1ed)]/0x2+0xc0);_0x5864d8-=Math[_0x3f30c4(0x279)]((Graphics[_0x3f30c4(0x1ed)]-Graphics['boxWidth'])/0x2),_0x5864d8+=_0xd64fd2*0x20;let _0x32bae5=Graphics[_0x3f30c4(0x6c5)]-0xc8-$gameParty[_0x3f30c4(0x6e7)]()*0x30;_0x32bae5-=Math['floor']((Graphics[_0x3f30c4(0x6c5)]-Graphics[_0x3f30c4(0x50e)])/0x2),_0x32bae5+=_0xd64fd2*0x30,this[_0x3f30c4(0x80f)](_0x5864d8,_0x32bae5);},Sprite_Actor[_0x100070(0x7ae)][_0x100070(0x532)]=function(){const _0x44985b=_0x100070;this[_0x44985b(0x551)](0x4b0,0x0,0x78);},Sprite_Animation[_0x100070(0x7ae)]['setMute']=function(_0x151da3){const _0x2f8b54=_0x100070;this[_0x2f8b54(0x268)]=_0x151da3;},VisuMZ[_0x100070(0x785)]['Sprite_Animation_processSoundTimings']=Sprite_Animation[_0x100070(0x7ae)][_0x100070(0x3b3)],Sprite_Animation[_0x100070(0x7ae)][_0x100070(0x3b3)]=function(){const _0x5e558a=_0x100070;if(this['_muteSound'])return;VisuMZ[_0x5e558a(0x785)][_0x5e558a(0x19d)]['call'](this);},VisuMZ[_0x100070(0x785)][_0x100070(0x6ac)]=Sprite_Animation[_0x100070(0x7ae)][_0x100070(0x173)],Sprite_Animation[_0x100070(0x7ae)][_0x100070(0x173)]=function(_0x47bc5c){const _0x58dc98=_0x100070;this[_0x58dc98(0x7d4)]()?this[_0x58dc98(0x428)](_0x47bc5c):VisuMZ['CoreEngine']['Sprite_Animation_setViewport'][_0x58dc98(0x703)](this,_0x47bc5c);},Sprite_Animation[_0x100070(0x7ae)][_0x100070(0x7d4)]=function(){const _0x4b1eda=_0x100070;if(!this[_0x4b1eda(0x341)])return![];const _0x3e3b50=this[_0x4b1eda(0x341)][_0x4b1eda(0x554)]||'';if(_0x3e3b50[_0x4b1eda(0x4aa)](/<MIRROR OFFSET X>/i))return!![];if(_0x3e3b50['match'](/<NO MIRROR OFFSET X>/i))return![];return VisuMZ[_0x4b1eda(0x785)][_0x4b1eda(0x598)]['QoL'][_0x4b1eda(0x4f1)];},Sprite_Animation['prototype'][_0x100070(0x428)]=function(_0x50cc0e){const _0x3ecf27=_0x100070,_0x25aa8e=this['_viewportSize'],_0x2adb2e=this[_0x3ecf27(0x5ef)],_0x49c64f=this['_animation'][_0x3ecf27(0x406)]*(this[_0x3ecf27(0x540)]?-0x1:0x1)-_0x25aa8e/0x2,_0x1a9506=this[_0x3ecf27(0x341)][_0x3ecf27(0x2fb)]-_0x2adb2e/0x2,_0x4ed10e=this[_0x3ecf27(0x25e)](_0x50cc0e);_0x50cc0e['gl'][_0x3ecf27(0x5f5)](_0x49c64f+_0x4ed10e['x'],_0x1a9506+_0x4ed10e['y'],_0x25aa8e,_0x2adb2e);},Sprite_Animation[_0x100070(0x7ae)]['targetSpritePosition']=function(_0x3d6bb0){const _0x642c41=_0x100070;if(_0x3d6bb0[_0x642c41(0x27e)]){}const _0x1c9860=this[_0x642c41(0x341)]['name'];let _0x5bfc49=_0x3d6bb0[_0x642c41(0x6c5)]*_0x3d6bb0['scale']['y'],_0x4c6fa7=0x0,_0x4c3469=-_0x5bfc49/0x2;if(_0x1c9860[_0x642c41(0x4aa)](/<(?:HEAD|HEADER|TOP)>/i))_0x4c3469=-_0x5bfc49;if(_0x1c9860[_0x642c41(0x4aa)](/<(?:FOOT|FOOTER|BOTTOM)>/i))_0x4c3469=0x0;if(this[_0x642c41(0x341)][_0x642c41(0x75e)])_0x4c3469=0x0;if(_0x1c9860[_0x642c41(0x4aa)](/<(?:LEFT)>/i))_0x4c6fa7=-_0x3d6bb0['width']/0x2;if(_0x1c9860['match'](/<(?:RIGHT)>/i))_0x4c6fa7=_0x3d6bb0[_0x642c41(0x1ed)]/0x2;_0x1c9860['match'](/<ANCHOR X:[ ](\d+\.?\d*)>/i)&&(_0x4c6fa7=Number(RegExp['$1'])*_0x3d6bb0[_0x642c41(0x1ed)]);_0x1c9860['match'](/<ANCHOR Y:[ ](\d+\.?\d*)>/i)&&(_0x4c3469=(0x1-Number(RegExp['$1']))*-_0x5bfc49);_0x1c9860[_0x642c41(0x4aa)](/<ANCHOR:[ ](\d+\.?\d*),[ ](\d+\.?\d*)>/i)&&(_0x4c6fa7=Number(RegExp['$1'])*_0x3d6bb0[_0x642c41(0x1ed)],_0x4c3469=(0x1-Number(RegExp['$2']))*-_0x5bfc49);if(_0x1c9860[_0x642c41(0x4aa)](/<OFFSET X:[ ]([\+\-]\d+)>/i))_0x4c6fa7+=Number(RegExp['$1']);if(_0x1c9860[_0x642c41(0x4aa)](/<OFFSET Y:[ ]([\+\-]\d+)>/i))_0x4c3469+=Number(RegExp['$1']);_0x1c9860['match'](/<OFFSET:[ ]([\+\-]\d+),[ ]([\+\-]\d+)>/i)&&(_0x4c6fa7+=Number(RegExp['$1']),_0x4c3469+=Number(RegExp['$2']));const _0x50796e=new Point(_0x4c6fa7,_0x4c3469);return _0x3d6bb0[_0x642c41(0x639)](),_0x3d6bb0[_0x642c41(0x509)][_0x642c41(0x222)](_0x50796e);},Sprite_AnimationMV[_0x100070(0x7ae)][_0x100070(0x744)]=function(){const _0x293865=_0x100070;this[_0x293865(0x139)]=VisuMZ[_0x293865(0x785)][_0x293865(0x598)][_0x293865(0x1f9)]['MvAnimationRate']??0x4,this[_0x293865(0x311)](),this[_0x293865(0x139)]=this[_0x293865(0x139)][_0x293865(0x2d3)](0x1,0xa);},Sprite_AnimationMV[_0x100070(0x7ae)]['setupCustomRateCoreEngine']=function(){const _0x49f7d2=_0x100070;if(!this[_0x49f7d2(0x341)]);const _0xeaab02=this[_0x49f7d2(0x341)][_0x49f7d2(0x554)]||'';_0xeaab02[_0x49f7d2(0x4aa)](/<RATE:[ ](\d+)>/i)&&(this[_0x49f7d2(0x139)]=(Number(RegExp['$1'])||0x1)[_0x49f7d2(0x2d3)](0x1,0xa));},Sprite_AnimationMV[_0x100070(0x7ae)][_0x100070(0x439)]=function(_0x11160d){const _0x2eab91=_0x100070;this[_0x2eab91(0x268)]=_0x11160d;},VisuMZ[_0x100070(0x785)][_0x100070(0x20c)]=Sprite_AnimationMV[_0x100070(0x7ae)]['processTimingData'],Sprite_AnimationMV[_0x100070(0x7ae)][_0x100070(0xfc)]=function(_0x10a8c5){const _0x13750a=_0x100070;this[_0x13750a(0x268)]&&(_0x10a8c5=JsonEx[_0x13750a(0x35b)](_0x10a8c5),_0x10a8c5['se']&&(_0x10a8c5['se'][_0x13750a(0x41f)]=0x0)),VisuMZ[_0x13750a(0x785)][_0x13750a(0x20c)][_0x13750a(0x703)](this,_0x10a8c5);},VisuMZ[_0x100070(0x785)][_0x100070(0x441)]=Sprite_AnimationMV['prototype'][_0x100070(0x5dd)],Sprite_AnimationMV[_0x100070(0x7ae)][_0x100070(0x5dd)]=function(){const _0xbd831e=_0x100070;VisuMZ[_0xbd831e(0x785)][_0xbd831e(0x441)]['call'](this);if(this[_0xbd831e(0x341)][_0xbd831e(0xee)]===0x3){if(this['x']===0x0)this['x']=Math[_0xbd831e(0x884)](Graphics[_0xbd831e(0x1ed)]/0x2);if(this['y']===0x0)this['y']=Math[_0xbd831e(0x884)](Graphics[_0xbd831e(0x6c5)]/0x2);}},Sprite_Damage['prototype']['createDigits']=function(_0x5371c4){const _0x34fcc8=_0x100070;let _0x427cd3=Math['abs'](_0x5371c4)['toString']();this[_0x34fcc8(0x383)]()&&(_0x427cd3=VisuMZ[_0x34fcc8(0x89c)](_0x427cd3));const _0x42e136=this[_0x34fcc8(0xb8)](),_0x431298=Math[_0x34fcc8(0x279)](_0x42e136*0.75);for(let _0xe2d4cd=0x0;_0xe2d4cd<_0x427cd3['length'];_0xe2d4cd++){const _0x474cea=this[_0x34fcc8(0x700)](_0x431298,_0x42e136);_0x474cea[_0x34fcc8(0x6ed)][_0x34fcc8(0x100)](_0x427cd3[_0xe2d4cd],0x0,0x0,_0x431298,_0x42e136,_0x34fcc8(0x255)),_0x474cea['x']=(_0xe2d4cd-(_0x427cd3[_0x34fcc8(0x1ba)]-0x1)/0x2)*_0x431298,_0x474cea['dy']=-_0xe2d4cd;}},Sprite_Damage[_0x100070(0x7ae)][_0x100070(0x383)]=function(){const _0x391231=_0x100070;return VisuMZ[_0x391231(0x785)][_0x391231(0x598)][_0x391231(0x1f9)][_0x391231(0x116)];},Sprite_Damage[_0x100070(0x7ae)][_0x100070(0x3e9)]=function(){return ColorManager['outlineColorDmg']();},VisuMZ['CoreEngine'][_0x100070(0x409)]=Sprite_Gauge['prototype'][_0x100070(0x838)],Sprite_Gauge['prototype'][_0x100070(0x838)]=function(){const _0x5a6fb2=_0x100070;return VisuMZ['CoreEngine']['Sprite_Gauge_gaugeRate'][_0x5a6fb2(0x703)](this)[_0x5a6fb2(0x2d3)](0x0,0x1);},VisuMZ[_0x100070(0x785)][_0x100070(0x1e5)]=Sprite_Gauge[_0x100070(0x7ae)][_0x100070(0x175)],Sprite_Gauge[_0x100070(0x7ae)][_0x100070(0x175)]=function(){const _0x5acf6d=_0x100070;let _0x1f71ac=VisuMZ[_0x5acf6d(0x785)][_0x5acf6d(0x1e5)][_0x5acf6d(0x703)](this);return _0x1f71ac;},Sprite_Gauge['prototype']['drawValue']=function(){const _0x2d2db7=_0x100070;let _0xaa616f=this[_0x2d2db7(0x175)]();this['useDigitGrouping']()&&(_0xaa616f=VisuMZ[_0x2d2db7(0x89c)](_0xaa616f));const _0x24f68f=this[_0x2d2db7(0x798)]()-0x1,_0x5404ff=this['textHeight']?this[_0x2d2db7(0x5b0)]():this['bitmapHeight']();this[_0x2d2db7(0x83c)](),this['bitmap'][_0x2d2db7(0x100)](_0xaa616f,0x0,0x0,_0x24f68f,_0x5404ff,_0x2d2db7(0x12e));},Sprite_Gauge[_0x100070(0x7ae)]['valueOutlineWidth']=function(){return 0x3;},Sprite_Gauge['prototype']['useDigitGrouping']=function(){const _0x4d3a53=_0x100070;return VisuMZ[_0x4d3a53(0x785)][_0x4d3a53(0x598)][_0x4d3a53(0x1f9)]['DigitGroupingGaugeSprites'];},Sprite_Gauge[_0x100070(0x7ae)]['valueOutlineColor']=function(){const _0x1157f0=_0x100070;return ColorManager[_0x1157f0(0x1db)]();},Sprite_StateIcon[_0x100070(0x424)]=VisuMZ[_0x100070(0x785)]['Settings']['UI'][_0x100070(0x32d)]??!![],VisuMZ[_0x100070(0x785)][_0x100070(0x6ee)]=Sprite_StateIcon[_0x100070(0x7ae)][_0x100070(0x627)],Sprite_StateIcon[_0x100070(0x7ae)]['loadBitmap']=function(){const _0x235d1b=_0x100070;Sprite_StateIcon[_0x235d1b(0x424)]?this[_0x235d1b(0x5b1)]():VisuMZ[_0x235d1b(0x785)]['Sprite_StateIcon_loadBitmap'][_0x235d1b(0x703)](this);},Sprite_StateIcon[_0x100070(0x7ae)][_0x100070(0x5b1)]=function(){const _0x128bce=_0x100070;this['bitmap']=new Bitmap(ImageManager[_0x128bce(0x288)],ImageManager[_0x128bce(0x1bc)]),this[_0x128bce(0x400)]=ImageManager[_0x128bce(0x1d8)](_0x128bce(0x3f8));},VisuMZ[_0x100070(0x785)][_0x100070(0x156)]=Sprite_StateIcon[_0x100070(0x7ae)][_0x100070(0x418)],Sprite_StateIcon[_0x100070(0x7ae)]['updateFrame']=function(){const _0x485657=_0x100070;Sprite_StateIcon[_0x485657(0x424)]?this[_0x485657(0x3dc)]():VisuMZ[_0x485657(0x785)][_0x485657(0x156)]['call'](this);},Sprite_StateIcon[_0x100070(0x7ae)]['updateFrameCoreEngine']=function(){const _0x3490f3=_0x100070;if(this[_0x3490f3(0x70e)]===this[_0x3490f3(0x393)])return;this[_0x3490f3(0x70e)]=this[_0x3490f3(0x393)];const _0x1874fa=ImageManager[_0x3490f3(0x288)],_0x4e4288=ImageManager[_0x3490f3(0x1bc)],_0x34a69f=this[_0x3490f3(0x393)]%0x10*_0x1874fa,_0x9bf7e8=Math['floor'](this[_0x3490f3(0x393)]/0x10)*_0x4e4288,_0x4a4d7e=this[_0x3490f3(0x400)],_0x243966=this[_0x3490f3(0x6ed)];_0x243966['clear'](),_0x243966[_0x3490f3(0x808)](_0x4a4d7e,_0x34a69f,_0x9bf7e8,_0x1874fa,_0x4e4288,0x0,0x0,_0x243966[_0x3490f3(0x1ed)],_0x243966['height']);},VisuMZ[_0x100070(0x785)][_0x100070(0x6a2)]=Sprite_Picture[_0x100070(0x7ae)][_0x100070(0x627)],Sprite_Picture[_0x100070(0x7ae)][_0x100070(0x627)]=function(){const _0x141a60=_0x100070;this[_0x141a60(0x6e3)]&&this[_0x141a60(0x6e3)][_0x141a60(0x4aa)](/VisuMZ CoreEngine PictureIcon (\d+)/i)?this[_0x141a60(0x66e)](Number(RegExp['$1'])):VisuMZ['CoreEngine'][_0x141a60(0x6a2)][_0x141a60(0x703)](this);},Sprite_Picture[_0x100070(0x7ae)][_0x100070(0x66e)]=function(_0x641d47){const _0x524f8f=_0x100070,_0x133b56=ImageManager[_0x524f8f(0x288)],_0x4af68c=ImageManager[_0x524f8f(0x1bc)],_0x512fa8=this['_pictureName'][_0x524f8f(0x4aa)](/SMOOTH/i);this[_0x524f8f(0x6ed)]=new Bitmap(_0x133b56,_0x4af68c);const _0x4ee97e=ImageManager[_0x524f8f(0x1d8)](_0x524f8f(0x3f8)),_0x3f436a=_0x641d47%0x10*_0x133b56,_0x4ab3a5=Math['floor'](_0x641d47/0x10)*_0x4af68c;this[_0x524f8f(0x6ed)][_0x524f8f(0x215)]=_0x512fa8,this[_0x524f8f(0x6ed)][_0x524f8f(0x808)](_0x4ee97e,_0x3f436a,_0x4ab3a5,_0x133b56,_0x4af68c,0x0,0x0,_0x133b56,_0x4af68c);};function Sprite_TitlePictureButton(){this['initialize'](...arguments);}Sprite_TitlePictureButton['prototype']=Object[_0x100070(0x68d)](Sprite_Clickable[_0x100070(0x7ae)]),Sprite_TitlePictureButton['prototype'][_0x100070(0x1f7)]=Sprite_TitlePictureButton,Sprite_TitlePictureButton[_0x100070(0x7ae)][_0x100070(0x811)]=function(_0xafa044){const _0x4151d6=_0x100070;Sprite_Clickable[_0x4151d6(0x7ae)][_0x4151d6(0x811)][_0x4151d6(0x703)](this),this[_0x4151d6(0x585)]=_0xafa044,this[_0x4151d6(0x6bf)]=null,this[_0x4151d6(0x5e1)]();},Sprite_TitlePictureButton[_0x100070(0x7ae)][_0x100070(0x5e1)]=function(){const _0x313aaa=_0x100070;this['x']=Graphics[_0x313aaa(0x1ed)],this['y']=Graphics[_0x313aaa(0x6c5)],this[_0x313aaa(0x803)]=![],this['setupButtonImage']();},Sprite_TitlePictureButton[_0x100070(0x7ae)][_0x100070(0x7a2)]=function(){const _0x102f43=_0x100070;this[_0x102f43(0x6ed)]=ImageManager[_0x102f43(0x1ef)](this[_0x102f43(0x585)][_0x102f43(0x602)]),this['bitmap'][_0x102f43(0x4e3)](this[_0x102f43(0x807)]['bind'](this));},Sprite_TitlePictureButton[_0x100070(0x7ae)][_0x100070(0x807)]=function(){const _0x333381=_0x100070;this[_0x333381(0x585)]['OnLoadJS'][_0x333381(0x703)](this),this['_data'][_0x333381(0x267)][_0x333381(0x703)](this),this['setClickHandler'](this[_0x333381(0x585)][_0x333381(0x799)][_0x333381(0x4b0)](this));},Sprite_TitlePictureButton[_0x100070(0x7ae)][_0x100070(0x723)]=function(){const _0x3960d1=_0x100070;Sprite_Clickable[_0x3960d1(0x7ae)][_0x3960d1(0x723)][_0x3960d1(0x703)](this),this[_0x3960d1(0x5d8)](),this['processTouch']();},Sprite_TitlePictureButton['prototype'][_0x100070(0xe5)]=function(){const _0x1d0d6f=_0x100070;return VisuMZ['CoreEngine'][_0x1d0d6f(0x598)][_0x1d0d6f(0x54f)][_0x1d0d6f(0x63d)][_0x1d0d6f(0x3cd)];},Sprite_TitlePictureButton[_0x100070(0x7ae)][_0x100070(0x5d8)]=function(){const _0x45cf8c=_0x100070;this[_0x45cf8c(0x635)]||this[_0x45cf8c(0x390)]?this[_0x45cf8c(0x2da)]=0xff:(this['opacity']+=this[_0x45cf8c(0x803)]?this[_0x45cf8c(0xe5)]():-0x1*this[_0x45cf8c(0xe5)](),this[_0x45cf8c(0x2da)]=Math['min'](0xc0,this[_0x45cf8c(0x2da)]));},Sprite_TitlePictureButton[_0x100070(0x7ae)][_0x100070(0xea)]=function(_0x562ea6){const _0x45874c=_0x100070;this[_0x45874c(0x6bf)]=_0x562ea6;},Sprite_TitlePictureButton[_0x100070(0x7ae)][_0x100070(0x182)]=function(){const _0x5afeb6=_0x100070;this[_0x5afeb6(0x6bf)]&&this[_0x5afeb6(0x6bf)]();};function Sprite_ExtendedTile(){this['initialize'](...arguments);}Sprite_ExtendedTile[_0x100070(0x7ae)]=Object['create'](Sprite['prototype']),Sprite_ExtendedTile[_0x100070(0x7ae)][_0x100070(0x1f7)]=Sprite_ExtendedTile,Sprite_ExtendedTile[_0x100070(0x7ae)][_0x100070(0x811)]=function(_0x505f47,_0x514f48,_0x594696,_0xe8d74e){const _0x135fea=_0x100070;this['_shiftY']=Game_CharacterBase[_0x135fea(0x144)]||-0x6,this[_0x135fea(0x433)]=_0x505f47,this['_mapY']=_0x514f48,this['_tile']=_0x594696,this['_patternHeight']=_0xe8d74e,Sprite[_0x135fea(0x7ae)]['initialize'][_0x135fea(0x703)](this),this[_0x135fea(0x3eb)](),this[_0x135fea(0x6d8)](),this['setTileFrame'](),this[_0x135fea(0x723)]();},Sprite_ExtendedTile[_0x100070(0x7ae)]['createSubSprite']=function(){const _0x40a086=_0x100070;this[_0x40a086(0x4d4)]=new Sprite(),this[_0x40a086(0x4d4)][_0x40a086(0x844)]['x']=0.5,this[_0x40a086(0x4d4)][_0x40a086(0x844)]['y']=0x1,this[_0x40a086(0x4d4)]['y']=-this['_shiftY']+0x1,this['addChild'](this['_tileSprite']);},Sprite_ExtendedTile[_0x100070(0x7ae)][_0x100070(0x6d8)]=function(){const _0x1e0f14=_0x100070,_0xab6137=$gameMap[_0x1e0f14(0x5de)](),_0x326015=0x5+Math[_0x1e0f14(0x279)](this[_0x1e0f14(0x76d)]/0x100);this[_0x1e0f14(0x4d4)][_0x1e0f14(0x6ed)]=ImageManager[_0x1e0f14(0x79b)](_0xab6137['tilesetNames'][_0x326015]);},Sprite_ExtendedTile[_0x100070(0x7ae)][_0x100070(0x14d)]=function(){const _0xa55082=_0x100070,_0x39abe1=this[_0xa55082(0x76d)],_0x115d3b=$gameMap['tileWidth'](),_0x5d349f=$gameMap[_0xa55082(0x2c9)](),_0x390712=(Math['floor'](_0x39abe1/0x80)%0x2*0x8+_0x39abe1%0x8)*_0x115d3b,_0x47f95e=Math[_0xa55082(0x279)](_0x39abe1%0x100/0x8)%0x10*_0x5d349f,_0x242efc=this[_0xa55082(0x5b5)]*_0x5d349f;this[_0xa55082(0x4d4)][_0xa55082(0x2de)](_0x390712,_0x47f95e-_0x242efc,_0x115d3b,_0x5d349f+_0x242efc);},Sprite_ExtendedTile[_0x100070(0x7ae)][_0x100070(0x723)]=function(){const _0x38ba8b=_0x100070;Sprite[_0x38ba8b(0x7ae)][_0x38ba8b(0x723)][_0x38ba8b(0x703)](this),this['updatePosition']();},Sprite_ExtendedTile[_0x100070(0x7ae)][_0x100070(0x5dd)]=function(){const _0x1bc73e=_0x100070,_0x456e47=$gameMap[_0x1bc73e(0xf6)](),_0x1a0ab7=$gameMap['tileHeight'](),_0x911119=this[_0x1bc73e(0x433)],_0xbd317f=this[_0x1bc73e(0x6ca)];this['x']=Math['floor'](($gameMap['adjustX'](_0x911119)+0.5)*_0x456e47),this['y']=Math[_0x1bc73e(0x279)](($gameMap[_0x1bc73e(0x730)](_0xbd317f)+0x1)*_0x1a0ab7)+this['_shiftY']-0x1;},VisuMZ[_0x100070(0x785)][_0x100070(0x286)]=Spriteset_Base['prototype']['initialize'],Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x811)]=function(){const _0x58f5a9=_0x100070;VisuMZ[_0x58f5a9(0x785)][_0x58f5a9(0x286)][_0x58f5a9(0x703)](this),this[_0x58f5a9(0x6cc)]();},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x6cc)]=function(){const _0x273612=_0x100070;this[_0x273612(0x5a1)]=[],this['_pointAnimationSprites']=[],this['_cacheScaleX']=this['scale']['x'],this[_0x273612(0x502)]=this[_0x273612(0x2e5)]['y'];},VisuMZ['CoreEngine'][_0x100070(0x64e)]=Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x4f0)],Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x4f0)]=function(_0x527e5f){const _0x1f39e0=_0x100070;this[_0x1f39e0(0x340)](),this['removeAllPointAnimations'](),VisuMZ[_0x1f39e0(0x785)]['Spriteset_Base_destroy'][_0x1f39e0(0x703)](this,_0x527e5f);},VisuMZ[_0x100070(0x785)][_0x100070(0x317)]=Spriteset_Base['prototype']['update'],Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x723)]=function(){const _0x28147f=_0x100070;VisuMZ[_0x28147f(0x785)][_0x28147f(0x317)][_0x28147f(0x703)](this),this[_0x28147f(0x26e)](),this[_0x28147f(0x7c8)](),this['updateFauxAnimations'](),this[_0x28147f(0x53d)]();},Spriteset_Base['prototype']['updatePictureSettings']=function(){},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x7c8)]=function(){const _0x54dedf=_0x100070;if(!VisuMZ[_0x54dedf(0x785)][_0x54dedf(0x598)][_0x54dedf(0x1f9)][_0x54dedf(0x38f)])return;if(this['_cacheScaleX']===this[_0x54dedf(0x2e5)]['x']&&this[_0x54dedf(0x502)]===this[_0x54dedf(0x2e5)]['y'])return;this[_0x54dedf(0x5a2)](),this[_0x54dedf(0x207)]=this[_0x54dedf(0x2e5)]['x'],this[_0x54dedf(0x502)]=this['scale']['y'];},Spriteset_Base['prototype'][_0x100070(0x5a2)]=function(){const _0x275ea5=_0x100070;if(SceneManager[_0x275ea5(0x177)]()&&Spriteset_Map[_0x275ea5(0x297)])return;else{if(SceneManager[_0x275ea5(0x30e)]()&&Spriteset_Battle[_0x275ea5(0x297)])return;}this['scale']['x']!==0x0&&(this[_0x275ea5(0x2e1)][_0x275ea5(0x2e5)]['x']=0x1/this[_0x275ea5(0x2e5)]['x'],this[_0x275ea5(0x2e1)]['x']=-(this['x']/this[_0x275ea5(0x2e5)]['x'])),this[_0x275ea5(0x2e5)]['y']!==0x0&&(this[_0x275ea5(0x2e1)][_0x275ea5(0x2e5)]['y']=0x1/this['scale']['y'],this['_pictureContainer']['y']=-(this['y']/this[_0x275ea5(0x2e5)]['y']));},VisuMZ['CoreEngine'][_0x100070(0x862)]=Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x5dd)],Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x5dd)]=function(){const _0x2b7000=_0x100070;VisuMZ[_0x2b7000(0x785)][_0x2b7000(0x862)][_0x2b7000(0x703)](this),this[_0x2b7000(0x333)]();},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x333)]=function(){const _0x4b7535=_0x100070;if(!$gameScreen)return;if($gameScreen[_0x4b7535(0x13e)]<=0x0)return;this['x']-=Math[_0x4b7535(0x884)]($gameScreen[_0x4b7535(0x3f6)]());const _0x4d8fe9=$gameScreen[_0x4b7535(0x378)]();switch($gameScreen[_0x4b7535(0x378)]()){case _0x4b7535(0x54c):this[_0x4b7535(0x648)]();break;case _0x4b7535(0x861):this['updatePositionCoreEngineShakeHorz']();break;case _0x4b7535(0x2dd):this[_0x4b7535(0x399)]();break;default:this['updatePositionCoreEngineShakeRand']();break;}},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x648)]=function(){const _0x296df8=_0x100070,_0x54ca90=VisuMZ[_0x296df8(0x785)][_0x296df8(0x598)][_0x296df8(0x108)];if(_0x54ca90&&_0x54ca90['originalJS'])return _0x54ca90['originalJS']['call'](this);this['x']+=Math[_0x296df8(0x884)]($gameScreen[_0x296df8(0x3f6)]());},Spriteset_Base['prototype']['updatePositionCoreEngineShakeRand']=function(){const _0x5b1f8e=_0x100070,_0x2e74db=VisuMZ[_0x5b1f8e(0x785)][_0x5b1f8e(0x598)]['ScreenShake'];if(_0x2e74db&&_0x2e74db[_0x5b1f8e(0x210)])return _0x2e74db['randomJS'][_0x5b1f8e(0x703)](this);const _0xfef21d=$gameScreen[_0x5b1f8e(0x470)]*0.75,_0x267f79=$gameScreen[_0x5b1f8e(0x323)]*0.6,_0x45d271=$gameScreen[_0x5b1f8e(0x13e)];this['x']+=Math[_0x5b1f8e(0x884)](Math[_0x5b1f8e(0x5d6)](_0xfef21d)-Math[_0x5b1f8e(0x5d6)](_0x267f79))*(Math[_0x5b1f8e(0x369)](_0x45d271,0x1e)*0.5),this['y']+=Math[_0x5b1f8e(0x884)](Math[_0x5b1f8e(0x5d6)](_0xfef21d)-Math['randomInt'](_0x267f79))*(Math['min'](_0x45d271,0x1e)*0.5);},Spriteset_Base[_0x100070(0x7ae)]['updatePositionCoreEngineShakeHorz']=function(){const _0x534dc4=_0x100070,_0x1c5b00=VisuMZ['CoreEngine'][_0x534dc4(0x598)][_0x534dc4(0x108)];if(_0x1c5b00&&_0x1c5b00[_0x534dc4(0x48a)])return _0x1c5b00[_0x534dc4(0x48a)][_0x534dc4(0x703)](this);const _0x4f73e0=$gameScreen['_shakePower']*0.75,_0x4b32ce=$gameScreen[_0x534dc4(0x323)]*0.6,_0x1f1430=$gameScreen[_0x534dc4(0x13e)];this['x']+=Math[_0x534dc4(0x884)](Math[_0x534dc4(0x5d6)](_0x4f73e0)-Math[_0x534dc4(0x5d6)](_0x4b32ce))*(Math[_0x534dc4(0x369)](_0x1f1430,0x1e)*0.5);},Spriteset_Base['prototype'][_0x100070(0x399)]=function(){const _0x25932f=_0x100070,_0x5be5ab=VisuMZ[_0x25932f(0x785)][_0x25932f(0x598)]['ScreenShake'];if(_0x5be5ab&&_0x5be5ab[_0x25932f(0x62e)])return _0x5be5ab[_0x25932f(0x62e)][_0x25932f(0x703)](this);const _0x5eb9c8=$gameScreen[_0x25932f(0x470)]*0.75,_0x5205fe=$gameScreen[_0x25932f(0x323)]*0.6,_0x2dea3d=$gameScreen[_0x25932f(0x13e)];this['y']+=Math[_0x25932f(0x884)](Math['randomInt'](_0x5eb9c8)-Math[_0x25932f(0x5d6)](_0x5205fe))*(Math['min'](_0x2dea3d,0x1e)*0.5);},Spriteset_Base['prototype'][_0x100070(0x37d)]=function(){const _0x3b8478=_0x100070;for(const _0x366af8 of this[_0x3b8478(0x5a1)]){!_0x366af8[_0x3b8478(0x394)]()&&this[_0x3b8478(0x2ff)](_0x366af8);}this['processFauxAnimationRequests']();},Spriteset_Base[_0x100070(0x7ae)]['processFauxAnimationRequests']=function(){const _0x1ce7d3=_0x100070;for(;;){const _0x25d2a2=$gameTemp[_0x1ce7d3(0x472)]();if(_0x25d2a2)this[_0x1ce7d3(0x62d)](_0x25d2a2);else break;}},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x62d)]=function(_0xb93f1b){const _0x812488=_0x100070,_0x4c7326=$dataAnimations[_0xb93f1b[_0x812488(0x272)]],_0x2eee69=_0xb93f1b[_0x812488(0x5f9)],_0x446d53=_0xb93f1b[_0x812488(0x7ed)],_0x8394ef=_0xb93f1b[_0x812488(0x274)];let _0x3b7c5f=this[_0x812488(0x3c4)]();const _0x152095=this[_0x812488(0x4c3)]();if(this['isAnimationForEach'](_0x4c7326))for(const _0x2c365c of _0x2eee69){this[_0x812488(0x75a)]([_0x2c365c],_0x4c7326,_0x446d53,_0x3b7c5f,_0x8394ef),_0x3b7c5f+=_0x152095;}else this[_0x812488(0x75a)](_0x2eee69,_0x4c7326,_0x446d53,_0x3b7c5f,_0x8394ef);},Spriteset_Base[_0x100070(0x7ae)]['createAnimationSprite']=function(_0x51b1ee,_0xbee318,_0x4466ed,_0x17f34a){const _0x529464=_0x100070,_0x41f8ad=this[_0x529464(0x117)](_0xbee318),_0x254d57=new(_0x41f8ad?Sprite_AnimationMV:Sprite_Animation)(),_0x234eda=this[_0x529464(0x67a)](_0x51b1ee),_0x499619=this[_0x529464(0x3c4)](),_0x1cf4d0=_0x17f34a>_0x499619?this[_0x529464(0x670)]():null;this[_0x529464(0x434)](_0x51b1ee[0x0])&&(_0x4466ed=!_0x4466ed),_0x254d57[_0x529464(0x7fe)]=_0x51b1ee,_0x254d57[_0x529464(0x5e1)](_0x234eda,_0xbee318,_0x4466ed,_0x17f34a,_0x1cf4d0),this['addAnimationSpriteToContainer'](_0x254d57),this[_0x529464(0xff)][_0x529464(0x443)](_0x254d57);},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x75a)]=function(_0x513a0c,_0x336e93,_0x42a691,_0x7ad3de,_0x1fa497){const _0x3dd6e2=_0x100070,_0x11f732=this[_0x3dd6e2(0x117)](_0x336e93),_0x490947=new(_0x11f732?Sprite_AnimationMV:Sprite_Animation)(),_0xdcc841=this[_0x3dd6e2(0x67a)](_0x513a0c);this[_0x3dd6e2(0x434)](_0x513a0c[0x0])&&(_0x42a691=!_0x42a691);_0x490947[_0x3dd6e2(0x7fe)]=_0x513a0c,_0x490947[_0x3dd6e2(0x5e1)](_0xdcc841,_0x336e93,_0x42a691,_0x7ad3de),_0x490947['setMute'](_0x1fa497),this['addAnimationSpriteToContainer'](_0x490947);if(this[_0x3dd6e2(0xff)])this['_animationSprites'][_0x3dd6e2(0x3d5)](_0x490947);this[_0x3dd6e2(0x5a1)]['push'](_0x490947);},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x1b4)]=function(_0x5a2734){const _0x385aff=_0x100070;this[_0x385aff(0x740)][_0x385aff(0x4c1)](_0x5a2734);},Spriteset_Base['prototype'][_0x100070(0x218)]=function(_0x55affe){const _0x4c5ad5=_0x100070;this[_0x4c5ad5(0xff)][_0x4c5ad5(0x3d5)](_0x55affe),this['removeAnimationFromContainer'](_0x55affe);for(const _0x5f0e00 of _0x55affe['targetObjects']){_0x5f0e00[_0x4c5ad5(0x544)]&&_0x5f0e00['endAnimation']();}_0x55affe[_0x4c5ad5(0x4f0)]();},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x2ff)]=function(_0xd0270d){const _0xd1998c=_0x100070;this[_0xd1998c(0x5a1)][_0xd1998c(0x3d5)](_0xd0270d),this[_0xd1998c(0x3ea)](_0xd0270d);for(const _0x6dd841 of _0xd0270d[_0xd1998c(0x7fe)]){_0x6dd841['endAnimation']&&_0x6dd841[_0xd1998c(0x544)]();}_0xd0270d[_0xd1998c(0x4f0)]();},Spriteset_Base['prototype'][_0x100070(0x3ea)]=function(_0x5dac0b){const _0x137dca=_0x100070;this[_0x137dca(0x740)][_0x137dca(0x265)](_0x5dac0b);},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x340)]=function(){const _0x251709=_0x100070;for(const _0x191c6e of this[_0x251709(0x5a1)]){this[_0x251709(0x2ff)](_0x191c6e);}},Spriteset_Base['prototype'][_0x100070(0x24f)]=function(){const _0xbee46=_0x100070;return this[_0xbee46(0x5a1)][_0xbee46(0x1ba)]>0x0;},Spriteset_Base[_0x100070(0x7ae)]['updatePointAnimations']=function(){const _0x52dfc6=_0x100070;for(const _0xa7940e of this['_pointAnimationSprites']){!_0xa7940e[_0x52dfc6(0x394)]()&&this[_0x52dfc6(0x6cf)](_0xa7940e);}this[_0x52dfc6(0x51b)]();},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x51b)]=function(){for(;;){const _0x40bbab=$gameTemp['retrievePointAnimation']();if(_0x40bbab)this['createPointAnimation'](_0x40bbab);else break;}},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x44b)]=function(_0x1c8d7f){const _0x56de2f=_0x100070,_0x4529e5=$dataAnimations[_0x1c8d7f[_0x56de2f(0x272)]],_0x2f2c45=this['createPointAnimationTargets'](_0x1c8d7f),_0x4b8366=_0x1c8d7f[_0x56de2f(0x7ed)],_0x37dce5=_0x1c8d7f['mute'];let _0x56e757=this[_0x56de2f(0x3c4)]();const _0x3ef7dc=this[_0x56de2f(0x4c3)]();if(this['isAnimationForEach'](_0x4529e5))for(const _0x102b55 of _0x2f2c45){this[_0x56de2f(0x77b)]([_0x102b55],_0x4529e5,_0x4b8366,_0x56e757,_0x37dce5),_0x56e757+=_0x3ef7dc;}else this[_0x56de2f(0x77b)](_0x2f2c45,_0x4529e5,_0x4b8366,_0x56e757,_0x37dce5);},Spriteset_Base[_0x100070(0x7ae)]['createPointAnimationTargets']=function(_0x1ff037){const _0x519c7f=_0x100070,_0x16d0c4=new Sprite_Clickable(),_0x92dc81=this[_0x519c7f(0x419)]();_0x16d0c4['x']=_0x1ff037['x']-_0x92dc81['x'],_0x16d0c4['y']=_0x1ff037['y']-_0x92dc81['y'],_0x16d0c4['z']=0x64;const _0x505981=this[_0x519c7f(0x419)]();return _0x505981[_0x519c7f(0x4c1)](_0x16d0c4),[_0x16d0c4];},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x419)]=function(){return this;},Spriteset_Map[_0x100070(0x7ae)][_0x100070(0x419)]=function(){const _0xbbbcdc=_0x100070;return this[_0xbbbcdc(0x3a1)]||this;},Spriteset_Battle[_0x100070(0x7ae)][_0x100070(0x419)]=function(){const _0x4d743e=_0x100070;return this[_0x4d743e(0x16c)]||this;},Spriteset_Base[_0x100070(0x7ae)]['createPointAnimationSprite']=function(_0x5ea6a3,_0xfc11b3,_0xdb23e1,_0x24b840,_0x4ccaa5){const _0x3ba95c=_0x100070,_0x49c929=this[_0x3ba95c(0x117)](_0xfc11b3),_0x5b20a5=new(_0x49c929?Sprite_AnimationMV:Sprite_Animation)();_0x5b20a5[_0x3ba95c(0x7fe)]=_0x5ea6a3,_0x5b20a5[_0x3ba95c(0x5e1)](_0x5ea6a3,_0xfc11b3,_0xdb23e1,_0x24b840),_0x5b20a5[_0x3ba95c(0x439)](_0x4ccaa5),this['addAnimationSpriteToContainer'](_0x5b20a5),this[_0x3ba95c(0x1e4)]['push'](_0x5b20a5);},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x6cf)]=function(_0x41fa75){const _0x52097d=_0x100070;this[_0x52097d(0x1e4)][_0x52097d(0x3d5)](_0x41fa75),this[_0x52097d(0x740)]['removeChild'](_0x41fa75);for(const _0x387722 of _0x41fa75[_0x52097d(0x7fe)]){_0x387722[_0x52097d(0x544)]&&_0x387722[_0x52097d(0x544)]();const _0x367ed6=this['getPointAnimationLayer']();if(_0x367ed6)_0x367ed6[_0x52097d(0x265)](_0x387722);}_0x41fa75[_0x52097d(0x4f0)]();},Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x7fa)]=function(){const _0x7febd8=_0x100070;for(const _0x429bca of this[_0x7febd8(0x1e4)]){this['removePointAnimation'](_0x429bca);}},Spriteset_Base['prototype'][_0x100070(0x5bb)]=function(){const _0x23274e=_0x100070;return this[_0x23274e(0x1e4)][_0x23274e(0x1ba)]>0x0;},VisuMZ[_0x100070(0x785)][_0x100070(0x4a4)]=Spriteset_Base['prototype'][_0x100070(0x421)],Spriteset_Base[_0x100070(0x7ae)][_0x100070(0x421)]=function(){const _0x55ba23=_0x100070;return VisuMZ[_0x55ba23(0x785)]['Spriteset_Base_isAnimationPlaying'][_0x55ba23(0x703)](this)||this['isPointAnimationPlaying']();},Spriteset_Map[_0x100070(0x297)]=VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x1f9)][_0x100070(0x172)]||![],VisuMZ[_0x100070(0x785)]['Scene_Map_createSpriteset_detach']=Scene_Map[_0x100070(0x7ae)]['createSpriteset'],Scene_Map[_0x100070(0x7ae)][_0x100070(0x7ad)]=function(){const _0x11cc9a=_0x100070;VisuMZ[_0x11cc9a(0x785)][_0x11cc9a(0x74e)]['call'](this);if(!Spriteset_Map['DETACH_PICTURE_CONTAINER'])return;const _0x446b10=this[_0x11cc9a(0x3a3)];if(!_0x446b10)return;this['_pictureContainer']=_0x446b10[_0x11cc9a(0x2e1)];if(!this[_0x11cc9a(0x2e1)])return;this['addChild'](this['_pictureContainer']);},VisuMZ[_0x100070(0x785)][_0x100070(0x1cc)]=Spriteset_Map[_0x100070(0x7ae)][_0x100070(0x4be)],Spriteset_Map[_0x100070(0x7ae)][_0x100070(0x4be)]=function(){const _0x368223=_0x100070;VisuMZ[_0x368223(0x785)][_0x368223(0x1cc)][_0x368223(0x703)](this),this[_0x368223(0x379)]();},Spriteset_Map[_0x100070(0x7ae)][_0x100070(0x379)]=function(){const _0x5e0340=_0x100070,_0x1c7aac=$gameMap[_0x5e0340(0x5de)]();if(!_0x1c7aac)return;const _0x4f1fc4=$gameMap['getTileExtendTerrainTags']();if(Object[_0x5e0340(0x512)](_0x4f1fc4)[_0x5e0340(0x1ba)]<=0x0)return;const _0x5d1cfa=$gameMap[_0x5e0340(0x6a4)]();this['_tileExtendSprites']=this[_0x5e0340(0x322)]||[];for(let _0x4b1f8c=0x0;_0x4b1f8c<$gameMap[_0x5e0340(0x6c5)]();_0x4b1f8c++){for(let _0x5d73ce=0x0;_0x5d73ce<$gameMap[_0x5e0340(0x1ed)]();_0x5d73ce++){for(const _0x1e6a82 of $gameMap[_0x5e0340(0x224)](_0x5d73ce,_0x4b1f8c)){const _0x3dd1ce=_0x5d1cfa[_0x1e6a82]>>0xc,_0x261d33=_0x4f1fc4[_0x3dd1ce]||0x0;if(_0x261d33<=0x0)continue;this['createExtendedTileSprite'](_0x5d73ce,_0x4b1f8c,_0x1e6a82,_0x261d33);}}}},Spriteset_Map[_0x100070(0x7ae)][_0x100070(0x5bf)]=function(){const _0x263ebc=_0x100070;this[_0x263ebc(0x322)]=this[_0x263ebc(0x322)]||[];for(const _0x39e68a of this[_0x263ebc(0x322)]){this[_0x263ebc(0x3a1)]['removeChild'](_0x39e68a);}this[_0x263ebc(0x322)]=[];},Spriteset_Map[_0x100070(0x7ae)][_0x100070(0x128)]=function(_0x2107bc,_0x24221e,_0x3d191b,_0x4c811b){const _0xe93043=_0x100070,_0x1dbca0=new Sprite_ExtendedTile(_0x2107bc,_0x24221e,_0x3d191b,_0x4c811b),_0x455212=$gameMap['tilesetFlags']();_0x455212[_0x3d191b]&0x10?_0x1dbca0['z']=0x4:_0x1dbca0['z']=0x3,this[_0xe93043(0x3a1)][_0xe93043(0x4c1)](_0x1dbca0),this[_0xe93043(0x322)]['push'](_0x1dbca0);},VisuMZ[_0x100070(0x785)]['Tilemap_addSpotTile']=Tilemap[_0x100070(0x7ae)]['_addSpotTile'],Tilemap[_0x100070(0x7ae)][_0x100070(0x81a)]=function(_0x565109,_0xbcae6e,_0x4885a1){const _0x5d41f1=_0x100070;if($gameMap[_0x5d41f1(0x5aa)](_0x565109))return;VisuMZ[_0x5d41f1(0x785)][_0x5d41f1(0x454)][_0x5d41f1(0x703)](this,_0x565109,_0xbcae6e,_0x4885a1);},Spriteset_Battle[_0x100070(0x297)]=VisuMZ['CoreEngine'][_0x100070(0x598)][_0x100070(0x1f9)][_0x100070(0x154)]||![],VisuMZ[_0x100070(0x785)][_0x100070(0x3db)]=Scene_Battle[_0x100070(0x7ae)]['createSpriteset'],Scene_Battle[_0x100070(0x7ae)][_0x100070(0x7ad)]=function(){const _0x48b556=_0x100070;VisuMZ[_0x48b556(0x785)]['Scene_Battle_createSpriteset_detach'][_0x48b556(0x703)](this);if(!Spriteset_Battle[_0x48b556(0x297)])return;const _0x1d9c42=this['_spriteset'];if(!_0x1d9c42)return;this[_0x48b556(0x2e1)]=_0x1d9c42[_0x48b556(0x2e1)];if(!this[_0x48b556(0x2e1)])return;this[_0x48b556(0x4c1)](this[_0x48b556(0x2e1)]);},Spriteset_Battle['prototype']['createBackground']=function(){const _0x19145d=_0x100070;this[_0x19145d(0x4e2)]=new PIXI[(_0x19145d(0x6d1))][(_0x19145d(0x263))](clamp=!![]),this[_0x19145d(0x7f0)]=new Sprite(),this[_0x19145d(0x7f0)][_0x19145d(0x6ed)]=SceneManager[_0x19145d(0x88f)](),this[_0x19145d(0x7f0)]['filters']=[this['_backgroundFilter']],this[_0x19145d(0xdb)]['addChild'](this[_0x19145d(0x7f0)]);},VisuMZ[_0x100070(0x785)][_0x100070(0x1e7)]=Spriteset_Battle[_0x100070(0x7ae)][_0x100070(0x645)],Spriteset_Battle[_0x100070(0x7ae)][_0x100070(0x645)]=function(){const _0x473cf0=_0x100070;this[_0x473cf0(0x72c)]()&&this['repositionEnemiesByResolution'](),VisuMZ[_0x473cf0(0x785)][_0x473cf0(0x1e7)][_0x473cf0(0x703)](this);},Spriteset_Battle['prototype'][_0x100070(0x72c)]=function(){const _0x5185c1=_0x100070,_0x458f37=VisuMZ[_0x5185c1(0x785)][_0x5185c1(0x598)][_0x5185c1(0x2ab)];if(!_0x458f37)return![];if(Utils[_0x5185c1(0x3bf)]>=_0x5185c1(0x4ca)&&!_0x458f37[_0x5185c1(0x29e)])return![];if(Utils[_0x5185c1(0x3bf)]>='1.10.0'&&!_0x458f37['RepositionEnemies130'])return![];return _0x458f37[_0x5185c1(0x37a)];},Spriteset_Battle[_0x100070(0x7ae)]['repositionEnemiesByResolution']=function(){const _0x15b6eb=_0x100070;for(member of $gameTroop[_0x15b6eb(0x30f)]()){member['moveRelativeToResolutionChange']();}},VisuMZ['CoreEngine'][_0x100070(0x873)]=Window_Base[_0x100070(0x7ae)]['initialize'],Window_Base[_0x100070(0x7ae)][_0x100070(0x811)]=function(_0x47bc29){const _0x28be9b=_0x100070;_0x47bc29['x']=Math[_0x28be9b(0x884)](_0x47bc29['x']),_0x47bc29['y']=Math[_0x28be9b(0x884)](_0x47bc29['y']),_0x47bc29[_0x28be9b(0x1ed)]=Math[_0x28be9b(0x884)](_0x47bc29[_0x28be9b(0x1ed)]),_0x47bc29['height']=Math[_0x28be9b(0x884)](_0x47bc29['height']),this[_0x28be9b(0x4f3)](),VisuMZ[_0x28be9b(0x785)][_0x28be9b(0x873)]['call'](this,_0x47bc29),this[_0x28be9b(0xdf)]();},Window_Base['prototype'][_0x100070(0x4f3)]=function(){const _0x41ea3c=_0x100070;this[_0x41ea3c(0x5f4)]=VisuMZ[_0x41ea3c(0x785)]['Settings']['QoL']['DigitGroupingStandardText'],this[_0x41ea3c(0x82e)]=VisuMZ[_0x41ea3c(0x785)]['Settings'][_0x41ea3c(0x1f9)]['DigitGroupingExText'];},Window_Base[_0x100070(0x7ae)][_0x100070(0x113)]=function(){const _0x5670de=_0x100070;return VisuMZ[_0x5670de(0x785)][_0x5670de(0x598)][_0x5670de(0x775)][_0x5670de(0x4e5)];},Window_Base['prototype'][_0x100070(0x7e0)]=function(){const _0x4296bf=_0x100070;return VisuMZ[_0x4296bf(0x785)][_0x4296bf(0x598)][_0x4296bf(0x775)][_0x4296bf(0x50f)];},Window_Base[_0x100070(0x7ae)][_0x100070(0x691)]=function(){const _0x535143=_0x100070;$gameSystem[_0x535143(0x4a1)]?this[_0x535143(0x7f2)]=$gameSystem['windowOpacity']():this['backOpacity']=VisuMZ['CoreEngine'][_0x535143(0x598)][_0x535143(0x775)]['BackOpacity'];},Window_Base[_0x100070(0x7ae)][_0x100070(0x4bc)]=function(){const _0x200a2b=_0x100070;return VisuMZ[_0x200a2b(0x785)][_0x200a2b(0x598)][_0x200a2b(0x775)][_0x200a2b(0x151)];},Window_Base[_0x100070(0x7ae)][_0x100070(0x4cd)]=function(){const _0x2430a3=_0x100070;return VisuMZ[_0x2430a3(0x785)][_0x2430a3(0x598)]['Window'][_0x2430a3(0x115)];},VisuMZ['CoreEngine'][_0x100070(0x616)]=Window_Base[_0x100070(0x7ae)][_0x100070(0x723)],Window_Base[_0x100070(0x7ae)][_0x100070(0x723)]=function(){const _0x42c2dd=_0x100070;VisuMZ[_0x42c2dd(0x785)][_0x42c2dd(0x616)]['call'](this),this[_0x42c2dd(0x527)]();},Window_Base[_0x100070(0x7ae)][_0x100070(0x243)]=function(){const _0xd08335=_0x100070;this[_0xd08335(0x6e5)]&&(this[_0xd08335(0x6b3)]+=this[_0xd08335(0x4cd)](),this[_0xd08335(0x34c)]()&&(this[_0xd08335(0x6e5)]=![]));},Window_Base[_0x100070(0x7ae)][_0x100070(0x684)]=function(){const _0x542996=_0x100070;this[_0x542996(0x588)]&&(this[_0x542996(0x6b3)]-=this[_0x542996(0x4cd)](),this[_0x542996(0x790)]()&&(this[_0x542996(0x588)]=![]));},VisuMZ[_0x100070(0x785)][_0x100070(0x4f6)]=Window_Base['prototype'][_0x100070(0x100)],Window_Base[_0x100070(0x7ae)][_0x100070(0x100)]=function(_0xc478db,_0x1b3666,_0x9e23ff,_0x307e0f,_0x24727c){const _0x2ae4d7=_0x100070;if(this[_0x2ae4d7(0x383)]())_0xc478db=VisuMZ[_0x2ae4d7(0x89c)](_0xc478db);VisuMZ[_0x2ae4d7(0x785)][_0x2ae4d7(0x4f6)][_0x2ae4d7(0x703)](this,_0xc478db,_0x1b3666,_0x9e23ff,_0x307e0f,_0x24727c);},Window_Base['prototype'][_0x100070(0x383)]=function(){const _0x5d3306=_0x100070;return this[_0x5d3306(0x5f4)];},VisuMZ['CoreEngine']['Window_Base_createTextState']=Window_Base['prototype']['createTextState'],Window_Base[_0x100070(0x7ae)]['createTextState']=function(_0xf3e421,_0x47ccde,_0x53b282,_0x560c81){const _0x4e5d1e=_0x100070;var _0x51ce4b=VisuMZ['CoreEngine'][_0x4e5d1e(0x4d9)][_0x4e5d1e(0x703)](this,_0xf3e421,_0x47ccde,_0x53b282,_0x560c81);if(this[_0x4e5d1e(0x233)]())_0x51ce4b['text']=String(VisuMZ[_0x4e5d1e(0x89c)](_0x51ce4b['text']))||'';return _0x51ce4b;},Window_Base[_0x100070(0x7ae)]['useDigitGroupingEx']=function(){return this['_digitGroupingEx'];},Window_Base[_0x100070(0x7ae)][_0x100070(0x865)]=function(_0x582999){this['_digitGrouping']=_0x582999;},Window_Base[_0x100070(0x7ae)][_0x100070(0x558)]=function(_0x2f7da9){this['_digitGroupingEx']=_0x2f7da9;},VisuMZ[_0x100070(0x785)][_0x100070(0x148)]=Window_Base[_0x100070(0x7ae)][_0x100070(0x82c)],Window_Base[_0x100070(0x7ae)][_0x100070(0x82c)]=function(_0x59ee4e,_0x5cac4c,_0x5eeec1){const _0x2d7f8e=_0x100070;_0x5cac4c=Math[_0x2d7f8e(0x884)](_0x5cac4c),_0x5eeec1=Math[_0x2d7f8e(0x884)](_0x5eeec1),VisuMZ[_0x2d7f8e(0x785)][_0x2d7f8e(0x148)][_0x2d7f8e(0x703)](this,_0x59ee4e,_0x5cac4c,_0x5eeec1);},VisuMZ['CoreEngine'][_0x100070(0x630)]=Window_Base[_0x100070(0x7ae)][_0x100070(0x621)],Window_Base[_0x100070(0x7ae)][_0x100070(0x621)]=function(_0x55198b,_0x2dfc88,_0x3b17ab,_0x38e649,_0x3e6bc2,_0x536339){const _0x203f73=_0x100070;_0x3e6bc2=_0x3e6bc2||ImageManager[_0x203f73(0x3c8)],_0x536339=_0x536339||ImageManager[_0x203f73(0x111)],_0x3b17ab=Math[_0x203f73(0x884)](_0x3b17ab),_0x38e649=Math[_0x203f73(0x884)](_0x38e649),_0x3e6bc2=Math[_0x203f73(0x884)](_0x3e6bc2),_0x536339=Math[_0x203f73(0x884)](_0x536339),VisuMZ[_0x203f73(0x785)][_0x203f73(0x630)]['call'](this,_0x55198b,_0x2dfc88,_0x3b17ab,_0x38e649,_0x3e6bc2,_0x536339);},VisuMZ[_0x100070(0x785)][_0x100070(0x6cd)]=Window_Base[_0x100070(0x7ae)][_0x100070(0x680)],Window_Base[_0x100070(0x7ae)][_0x100070(0x680)]=function(_0x9bf9bc,_0x3e1813,_0x150a69,_0x222d49){const _0x437899=_0x100070;_0x150a69=Math['round'](_0x150a69),_0x222d49=Math[_0x437899(0x884)](_0x222d49),VisuMZ['CoreEngine'][_0x437899(0x6cd)][_0x437899(0x703)](this,_0x9bf9bc,_0x3e1813,_0x150a69,_0x222d49);},VisuMZ[_0x100070(0x785)]['Window_Selectable_itemRect']=Window_Selectable[_0x100070(0x7ae)][_0x100070(0x5fe)],Window_Selectable[_0x100070(0x7ae)][_0x100070(0x5fe)]=function(_0xf11bed){const _0x4b0063=_0x100070;let _0x417516=VisuMZ[_0x4b0063(0x785)]['Window_Selectable_itemRect'][_0x4b0063(0x703)](this,_0xf11bed);return _0x417516['x']=Math[_0x4b0063(0x884)](_0x417516['x']),_0x417516['y']=Math['round'](_0x417516['y']),_0x417516['width']=Math[_0x4b0063(0x884)](_0x417516[_0x4b0063(0x1ed)]),_0x417516['height']=Math['round'](_0x417516[_0x4b0063(0x6c5)]),_0x417516;},VisuMZ[_0x100070(0x785)][_0x100070(0x76a)]=Window_StatusBase[_0x100070(0x7ae)][_0x100070(0x319)],Window_StatusBase[_0x100070(0x7ae)]['drawActorSimpleStatus']=function(_0x2feb50,_0x395f20,_0x32b274){const _0x4aa678=_0x100070;_0x395f20=Math[_0x4aa678(0x884)](_0x395f20),_0x32b274=Math[_0x4aa678(0x884)](_0x32b274),VisuMZ[_0x4aa678(0x785)][_0x4aa678(0x76a)][_0x4aa678(0x703)](this,_0x2feb50,_0x395f20,_0x32b274);},Window_Base[_0x100070(0x7ae)]['initCoreEasing']=function(){const _0x5ec82d=_0x100070;this['_coreEasing']={'duration':0x0,'wholeDuration':0x0,'type':_0x5ec82d(0x2a6),'targetX':this['x'],'targetY':this['y'],'targetScaleX':this[_0x5ec82d(0x2e5)]['x'],'targetScaleY':this[_0x5ec82d(0x2e5)]['y'],'targetOpacity':this[_0x5ec82d(0x2da)],'targetBackOpacity':this[_0x5ec82d(0x7f2)],'targetContentsOpacity':this[_0x5ec82d(0x5b6)]};},Window_Base['prototype'][_0x100070(0x527)]=function(){const _0x47a251=_0x100070;if(!this[_0x47a251(0x2d2)])return;if(this[_0x47a251(0x2d2)][_0x47a251(0x814)]<=0x0)return;this['x']=this['applyCoreEasing'](this['x'],this[_0x47a251(0x2d2)][_0x47a251(0x192)]),this['y']=this['applyCoreEasing'](this['y'],this['_coreEasing'][_0x47a251(0x40d)]),this[_0x47a251(0x2e5)]['x']=this[_0x47a251(0x7a9)](this[_0x47a251(0x2e5)]['x'],this[_0x47a251(0x2d2)][_0x47a251(0x63a)]),this['scale']['y']=this[_0x47a251(0x7a9)](this[_0x47a251(0x2e5)]['y'],this['_coreEasing'][_0x47a251(0x898)]),this[_0x47a251(0x2da)]=this[_0x47a251(0x7a9)](this['opacity'],this[_0x47a251(0x2d2)][_0x47a251(0x64c)]),this['backOpacity']=this[_0x47a251(0x7a9)](this[_0x47a251(0x7f2)],this[_0x47a251(0x2d2)][_0x47a251(0x1f4)]),this[_0x47a251(0x5b6)]=this[_0x47a251(0x7a9)](this[_0x47a251(0x5b6)],this[_0x47a251(0x2d2)]['targetContentsOpacity']),this['_coreEasing'][_0x47a251(0x814)]--;},Window_Base[_0x100070(0x7ae)][_0x100070(0x7a9)]=function(_0x5b34c2,_0x2ede11){const _0x37c98b=_0x100070;if(!this[_0x37c98b(0x2d2)])return _0x2ede11;const _0x47ee97=this[_0x37c98b(0x2d2)][_0x37c98b(0x814)],_0x3c4df2=this[_0x37c98b(0x2d2)]['wholeDuration'],_0x30fd0f=this['calcCoreEasing']((_0x3c4df2-_0x47ee97)/_0x3c4df2),_0x7f3fa5=this[_0x37c98b(0x5d3)]((_0x3c4df2-_0x47ee97+0x1)/_0x3c4df2),_0x3f345b=(_0x5b34c2-_0x2ede11*_0x30fd0f)/(0x1-_0x30fd0f);return _0x3f345b+(_0x2ede11-_0x3f345b)*_0x7f3fa5;},Window_Base[_0x100070(0x7ae)]['calcCoreEasing']=function(_0x303517){const _0x483a06=_0x100070;if(!this[_0x483a06(0x2d2)])return _0x303517;return VisuMZ[_0x483a06(0x702)](_0x303517,this[_0x483a06(0x2d2)][_0x483a06(0x160)]||'LINEAR');},Window_Base[_0x100070(0x7ae)][_0x100070(0x6c9)]=function(_0x266ae0,_0x5cf5c0){const _0x5330d2=_0x100070;if(!this[_0x5330d2(0x2d2)])return;this['x']=this[_0x5330d2(0x2d2)][_0x5330d2(0x192)],this['y']=this[_0x5330d2(0x2d2)]['targetY'],this['scale']['x']=this['_coreEasing'][_0x5330d2(0x63a)],this[_0x5330d2(0x2e5)]['y']=this['_coreEasing'][_0x5330d2(0x898)],this[_0x5330d2(0x2da)]=this[_0x5330d2(0x2d2)][_0x5330d2(0x64c)],this[_0x5330d2(0x7f2)]=this[_0x5330d2(0x2d2)][_0x5330d2(0x1f4)],this[_0x5330d2(0x5b6)]=this[_0x5330d2(0x2d2)]['targetContentsOpacity'],this[_0x5330d2(0x5d1)](_0x266ae0,_0x5cf5c0,this['x'],this['y'],this[_0x5330d2(0x2e5)]['x'],this[_0x5330d2(0x2e5)]['y'],this['opacity'],this[_0x5330d2(0x7f2)],this[_0x5330d2(0x5b6)]);},Window_Base[_0x100070(0x7ae)][_0x100070(0x5d1)]=function(_0x33cdbb,_0x5d8873,_0x4681ec,_0x3f02f2,_0x4de60f,_0x557b96,_0x177785,_0x5dd1ec,_0x3457cc){const _0x2341bf=_0x100070;this[_0x2341bf(0x2d2)]={'duration':_0x33cdbb,'wholeDuration':_0x33cdbb,'type':_0x5d8873,'targetX':_0x4681ec,'targetY':_0x3f02f2,'targetScaleX':_0x4de60f,'targetScaleY':_0x557b96,'targetOpacity':_0x177785,'targetBackOpacity':_0x5dd1ec,'targetContentsOpacity':_0x3457cc};},Window_Base[_0x100070(0x7ae)][_0x100070(0x1c2)]=function(_0x16f547,_0x27f2e5,_0x5129a9,_0x2ec405,_0x23f92c){const _0x2a789b=_0x100070;this[_0x2a789b(0x46a)](),this[_0x2a789b(0x41b)][_0x2a789b(0xb8)]=VisuMZ[_0x2a789b(0x785)][_0x2a789b(0x598)][_0x2a789b(0x2f2)]['GoldFontSize'];const _0x4d3c0c=VisuMZ[_0x2a789b(0x785)][_0x2a789b(0x598)][_0x2a789b(0x2f2)][_0x2a789b(0x33b)];if(_0x4d3c0c>0x0&&_0x27f2e5===TextManager['currencyUnit']){const _0x136c13=_0x2ec405+(this[_0x2a789b(0x113)]()-ImageManager[_0x2a789b(0x1bc)])/0x2;this[_0x2a789b(0x82c)](_0x4d3c0c,_0x5129a9+(_0x23f92c-ImageManager['iconWidth']),_0x136c13),_0x23f92c-=ImageManager[_0x2a789b(0x288)]+0x4;}else this['changeTextColor'](ColorManager[_0x2a789b(0x414)]()),this[_0x2a789b(0x100)](_0x27f2e5,_0x5129a9,_0x2ec405,_0x23f92c,_0x2a789b(0x12e)),_0x23f92c-=this[_0x2a789b(0x21b)](_0x27f2e5)+0x6;this[_0x2a789b(0x262)]();const _0x1f85a6=this[_0x2a789b(0x21b)](this['_digitGrouping']?VisuMZ[_0x2a789b(0x89c)](_0x16f547):_0x16f547);_0x1f85a6>_0x23f92c?this[_0x2a789b(0x100)](VisuMZ[_0x2a789b(0x785)][_0x2a789b(0x598)]['Gold'][_0x2a789b(0x661)],_0x5129a9,_0x2ec405,_0x23f92c,_0x2a789b(0x12e)):this[_0x2a789b(0x100)](_0x16f547,_0x5129a9,_0x2ec405,_0x23f92c,_0x2a789b(0x12e)),this['resetFontSettings']();},Window_Base[_0x100070(0x7ae)]['drawIconBySize']=function(_0x491c57,_0x5255c2,_0x192084,_0x2b70cb,_0x46d0fc){const _0x3152ad=_0x100070,_0x345935=ImageManager['loadSystem'](_0x3152ad(0x3f8)),_0x294eee=ImageManager[_0x3152ad(0x288)],_0xe18786=ImageManager[_0x3152ad(0x1bc)],_0x4db3c6=_0x491c57%0x10*_0x294eee,_0x3d4f51=Math[_0x3152ad(0x279)](_0x491c57/0x10)*_0xe18786,_0x40bec8=_0x2b70cb,_0x8af8d1=_0x2b70cb;this[_0x3152ad(0x41b)][_0x3152ad(0x471)][_0x3152ad(0x1aa)]=_0x46d0fc,this['contents']['blt'](_0x345935,_0x4db3c6,_0x3d4f51,_0x294eee,_0xe18786,_0x5255c2,_0x192084,_0x40bec8,_0x8af8d1),this[_0x3152ad(0x41b)]['_context'][_0x3152ad(0x1aa)]=!![];},Window_Base['prototype'][_0x100070(0x3ce)]=function(_0x4f9a75,_0x21f7c0,_0x484892,_0x4f9157,_0x297e43,_0x489807){const _0x209db7=_0x100070,_0x39b51b=Math[_0x209db7(0x279)]((_0x484892-0x2)*_0x4f9157),_0x43738e=Sprite_Gauge['prototype']['gaugeHeight']['call'](this),_0xb5ffc0=_0x21f7c0+this['lineHeight']()-_0x43738e-0x2;this[_0x209db7(0x41b)][_0x209db7(0xe6)](_0x4f9a75,_0xb5ffc0,_0x484892,_0x43738e,ColorManager[_0x209db7(0x345)]()),this[_0x209db7(0x41b)][_0x209db7(0x3a4)](_0x4f9a75+0x1,_0xb5ffc0+0x1,_0x39b51b,_0x43738e-0x2,_0x297e43,_0x489807);},Window_Scrollable[_0x100070(0x426)]={'enabled':VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x775)][_0x100070(0x16b)]??!![],'thickness':VisuMZ[_0x100070(0x785)]['Settings'][_0x100070(0x775)][_0x100070(0x7b3)]??0x2,'offset':VisuMZ[_0x100070(0x785)]['Settings'][_0x100070(0x775)][_0x100070(0x60b)]??0x2,'bodyColor':VisuMZ['CoreEngine'][_0x100070(0x598)][_0x100070(0x775)][_0x100070(0x5e2)]??0x0,'offColor':VisuMZ[_0x100070(0x785)]['Settings'][_0x100070(0x775)]['OffBarColor']??0x7,'offOpacity':VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x775)][_0x100070(0x5ce)]??0x80},Window_Base[_0x100070(0x7ae)]['isScrollBarVisible']=function(){const _0xbad4b2=_0x100070;return Window_Scrollable[_0xbad4b2(0x426)][_0xbad4b2(0x465)]&&Window_Scrollable['SCROLLBAR']['thickness']>0x0;},VisuMZ[_0x100070(0x785)][_0x100070(0x466)]=Window_Base[_0x100070(0x7ae)]['createContents'],Window_Base[_0x100070(0x7ae)][_0x100070(0x22a)]=function(){const _0x52549d=_0x100070;VisuMZ[_0x52549d(0x785)][_0x52549d(0x466)][_0x52549d(0x703)](this),this[_0x52549d(0x251)](),this[_0x52549d(0x49d)](!![]),this[_0x52549d(0x49d)](![]);},Window_Base[_0x100070(0x7ae)][_0x100070(0x251)]=function(){const _0x320079=_0x100070;if(!this[_0x320079(0x2fe)]())return;if(this[_0x320079(0x534)]||this[_0x320079(0x73a)])return;this['_lastScrollBarValues']={'horz':null,'vert':null,'maxHorz':null,'maxVert':null},this[_0x320079(0x534)]=new Sprite(),this[_0x320079(0x73a)]=new Sprite(),this[_0x320079(0x4c1)](this[_0x320079(0x534)]),this['addChild'](this[_0x320079(0x73a)]);},Window_Base[_0x100070(0x7ae)]['setupScrollBarBitmap']=function(_0x396fe4){const _0x549678=_0x100070,_0x3ce2e6=_0x396fe4?this[_0x549678(0x534)]:this[_0x549678(0x73a)];if(!_0x3ce2e6)return;const _0x40d518=Window_Scrollable['SCROLLBAR'],_0xc57710=_0x40d518[_0x549678(0xf4)],_0x3b2b86=_0x396fe4?this[_0x549678(0x628)]-_0xc57710*0x2:_0xc57710,_0x5e994c=_0x396fe4?_0xc57710:this[_0x549678(0x3f2)]-_0xc57710*0x2;_0x3ce2e6['bitmap']=new Bitmap(_0x3b2b86,_0x5e994c),_0x3ce2e6['setFrame'](0x0,0x0,_0x3b2b86,_0x5e994c),this['updateScrollBarPosition'](_0x396fe4);},VisuMZ[_0x100070(0x785)][_0x100070(0x5c3)]=Window_Base[_0x100070(0x7ae)][_0x100070(0x110)],Window_Base[_0x100070(0x7ae)][_0x100070(0x110)]=function(){const _0x4b0b5c=_0x100070;VisuMZ['CoreEngine']['Window_Base_destroyContents'][_0x4b0b5c(0x703)](this),this['destroyScrollBarBitmaps']();},Window_Base[_0x100070(0x7ae)][_0x100070(0x725)]=function(){const _0x120b33=_0x100070,_0x5ae26c=[this[_0x120b33(0x534)],this[_0x120b33(0x73a)]];for(const _0x2e28a7 of _0x5ae26c){if(_0x2e28a7&&_0x2e28a7[_0x120b33(0x6ed)])_0x2e28a7['bitmap'][_0x120b33(0x4f0)]();}},VisuMZ['CoreEngine'][_0x100070(0x205)]=Window_Scrollable['prototype']['update'],Window_Scrollable[_0x100070(0x7ae)]['update']=function(){const _0x150b90=_0x100070;VisuMZ[_0x150b90(0x785)][_0x150b90(0x205)][_0x150b90(0x703)](this),this[_0x150b90(0x481)]();},Window_Scrollable['prototype'][_0x100070(0x481)]=function(){const _0x56f0d5=_0x100070;this['updateScrollBarVisibility'](),this[_0x56f0d5(0x448)](!![]),this['checkScrollBarBitmap'](![]),this[_0x56f0d5(0x7fc)](!![]),this['updateScrollBarPosition'](![]);},Window_Scrollable[_0x100070(0x7ae)]['updateScrollBarVisibility']=function(){const _0x3ce984=_0x100070,_0x4812fa=[this[_0x3ce984(0x534)],this[_0x3ce984(0x73a)]];for(const _0x5a27a5 of _0x4812fa){_0x5a27a5&&(_0x5a27a5[_0x3ce984(0x803)]=this[_0x3ce984(0x2fe)]()&&this[_0x3ce984(0x34c)]());}},Window_Scrollable['prototype'][_0x100070(0x448)]=function(_0x316f44){const _0x43b8c7=_0x100070;if(!this[_0x43b8c7(0x66a)])return;const _0x5a3b62=this['scrollbar'](_0x316f44),_0x4a836d=this['maxScrollbar'](_0x316f44),_0x42d36d=_0x316f44?_0x43b8c7(0x241):_0x43b8c7(0x24a),_0x48b3d2=_0x316f44?_0x43b8c7(0x15a):'maxVert';(this[_0x43b8c7(0x66a)][_0x42d36d]!==_0x5a3b62||this[_0x43b8c7(0x66a)][_0x48b3d2]!==_0x4a836d)&&(this[_0x43b8c7(0x66a)][_0x42d36d]=_0x5a3b62,this[_0x43b8c7(0x66a)][_0x48b3d2]=_0x4a836d,this[_0x43b8c7(0x1dd)](_0x316f44,_0x5a3b62,_0x4a836d));},Window_Scrollable[_0x100070(0x7ae)]['scrollbar']=function(_0x229c98){const _0x45d772=_0x100070;if(this['_allTextHeight']!==undefined)return _0x229c98?this[_0x45d772(0x7e2)]():this[_0x45d772(0x6e8)]['y'];return _0x229c98?this[_0x45d772(0x7e2)]():this[_0x45d772(0x3e5)]();},Window_Scrollable[_0x100070(0x7ae)][_0x100070(0x58b)]=function(_0x388097){const _0x2207d2=_0x100070;if(this['_allTextHeight']!==undefined)return _0x388097?this['maxScrollX']():Math[_0x2207d2(0x23f)](0x0,this[_0x2207d2(0x529)]-this[_0x2207d2(0x3f2)]);return _0x388097?this[_0x2207d2(0x3ef)]():this[_0x2207d2(0x5a4)]();},Window_Scrollable[_0x100070(0x7ae)][_0x100070(0x523)]=function(){const _0x370758=_0x100070;if(this['_allTextHeight']!==undefined)return Math[_0x370758(0x23f)](0x0,this[_0x370758(0x529)]);return this['overallHeight']();},Window_Scrollable[_0x100070(0x7ae)][_0x100070(0x1dd)]=function(_0x1c4dcd,_0x5aabca,_0x35b16f){const _0x1b5e0e=_0x100070,_0x147bd3=_0x1c4dcd?this[_0x1b5e0e(0x534)]:this[_0x1b5e0e(0x73a)];if(!_0x147bd3)return;if(!_0x147bd3['bitmap'])return;const _0x4a5ffb=_0x147bd3[_0x1b5e0e(0x6ed)];_0x4a5ffb['clear']();if(_0x35b16f<=0x0)return;const _0x25ef56=_0x1c4dcd?this[_0x1b5e0e(0x628)]/this[_0x1b5e0e(0x32f)]():this[_0x1b5e0e(0x3f2)]/this['scrollbarHeight'](),_0x353c20=_0x1c4dcd?Math[_0x1b5e0e(0x884)](_0x5aabca*_0x25ef56):0x0,_0x3b42b1=_0x1c4dcd?0x0:Math[_0x1b5e0e(0x884)](_0x5aabca*_0x25ef56),_0x53b013=_0x1c4dcd?Math[_0x1b5e0e(0x884)](_0x4a5ffb[_0x1b5e0e(0x1ed)]*_0x25ef56):_0x4a5ffb[_0x1b5e0e(0x1ed)],_0x21fa8f=_0x1c4dcd?_0x4a5ffb[_0x1b5e0e(0x6c5)]:Math[_0x1b5e0e(0x884)](_0x4a5ffb[_0x1b5e0e(0x6c5)]*_0x25ef56),_0x52d0a=Window_Scrollable[_0x1b5e0e(0x426)],_0x29fb29=ColorManager['getColor'](_0x52d0a[_0x1b5e0e(0x3f1)]),_0x30ab6e=ColorManager[_0x1b5e0e(0x27b)](_0x52d0a[_0x1b5e0e(0x655)]),_0x2d1d6a=_0x52d0a['offOpacity'];_0x4a5ffb[_0x1b5e0e(0x501)]=_0x2d1d6a,_0x4a5ffb['fillAll'](_0x29fb29),_0x4a5ffb[_0x1b5e0e(0x501)]=0xff,_0x4a5ffb[_0x1b5e0e(0xe6)](_0x353c20,_0x3b42b1,_0x53b013,_0x21fa8f,_0x30ab6e);},Window_Base[_0x100070(0x7ae)][_0x100070(0x7fc)]=function(_0x234df1){const _0x3bec6f=_0x100070,_0x27499d=_0x234df1?this[_0x3bec6f(0x534)]:this[_0x3bec6f(0x73a)];if(!_0x27499d)return;const _0x4b2191=Window_Scrollable['SCROLLBAR'],_0x46e116=_0x4b2191[_0x3bec6f(0xf4)],_0x4f2274=_0x4b2191[_0x3bec6f(0x366)];if(!_0x27499d[_0x3bec6f(0x65b)])return;_0x27499d['x']=this[_0x3bec6f(0x47c)]+(_0x234df1?_0x46e116:this[_0x3bec6f(0x628)]+_0x4f2274),_0x27499d['y']=this[_0x3bec6f(0x47c)]+(_0x234df1?this[_0x3bec6f(0x3f2)]+_0x4f2274:_0x46e116);},Window_Selectable[_0x100070(0x7ae)][_0x100070(0x732)]=function(_0x4c8a78){const _0x1bf223=_0x100070;let _0x3ecbc1=this['index']();const _0x3e7c38=this[_0x1bf223(0x6a9)](),_0x3e1ebf=this['maxCols']();if(this['isUseModernControls']()&&(_0x3ecbc1<_0x3e7c38||_0x4c8a78&&_0x3e1ebf===0x1)){_0x3ecbc1+=_0x3e1ebf;if(_0x3ecbc1>=_0x3e7c38)_0x3ecbc1=_0x3e7c38-0x1;this[_0x1bf223(0x6c4)](_0x3ecbc1);}else!this['isUseModernControls']()&&((_0x3ecbc1<_0x3e7c38-_0x3e1ebf||_0x4c8a78&&_0x3e1ebf===0x1)&&this[_0x1bf223(0x6c4)]((_0x3ecbc1+_0x3e1ebf)%_0x3e7c38));},VisuMZ[_0x100070(0x785)][_0x100070(0x307)]=Window_Selectable[_0x100070(0x7ae)]['cursorDown'],Window_Selectable['prototype'][_0x100070(0x732)]=function(_0x8e6465){const _0x1ae6ac=_0x100070;this[_0x1ae6ac(0x5cb)]()&&_0x8e6465&&this['maxCols']()===0x1&&this[_0x1ae6ac(0x835)]()===this[_0x1ae6ac(0x6a9)]()-0x1?this['smoothSelect'](0x0):VisuMZ['CoreEngine'][_0x1ae6ac(0x307)]['call'](this,_0x8e6465);},Window_Selectable['prototype']['cursorUp']=function(_0x280b86){const _0xd88131=_0x100070;let _0xb7875f=Math['max'](0x0,this[_0xd88131(0x835)]());const _0x54064f=this['maxItems'](),_0xfadb17=this[_0xd88131(0x708)]();if(this['isUseModernControls']()&&_0xb7875f>0x0||_0x280b86&&_0xfadb17===0x1){_0xb7875f-=_0xfadb17;if(_0xb7875f<=0x0)_0xb7875f=0x0;this[_0xd88131(0x6c4)](_0xb7875f);}else!this['isUseModernControls']()&&((_0xb7875f>=_0xfadb17||_0x280b86&&_0xfadb17===0x1)&&this['smoothSelect']((_0xb7875f-_0xfadb17+_0x54064f)%_0x54064f));},VisuMZ['CoreEngine'][_0x100070(0x706)]=Window_Selectable['prototype']['cursorUp'],Window_Selectable['prototype']['cursorUp']=function(_0x5b5df5){const _0x2d9c80=_0x100070;this[_0x2d9c80(0x5cb)]()&&_0x5b5df5&&this[_0x2d9c80(0x708)]()===0x1&&this[_0x2d9c80(0x835)]()===0x0?this[_0x2d9c80(0x6c4)](this[_0x2d9c80(0x6a9)]()-0x1):VisuMZ['CoreEngine'][_0x2d9c80(0x706)][_0x2d9c80(0x703)](this,_0x5b5df5);},Window_Selectable[_0x100070(0x7ae)]['isUseModernControls']=function(){const _0x573902=_0x100070;return VisuMZ[_0x573902(0x785)][_0x573902(0x598)]['QoL'][_0x573902(0x7e7)];},VisuMZ['CoreEngine']['Window_Selectable_processCursorMove']=Window_Selectable[_0x100070(0x7ae)]['processCursorMove'],Window_Selectable[_0x100070(0x7ae)]['processCursorMove']=function(){const _0xf6d5a7=_0x100070;this[_0xf6d5a7(0x5cb)]()?(this[_0xf6d5a7(0x43e)](),this['processCursorHomeEndTrigger']()):VisuMZ[_0xf6d5a7(0x785)][_0xf6d5a7(0x566)][_0xf6d5a7(0x703)](this);},Window_Selectable[_0x100070(0x7ae)][_0x100070(0x450)]=function(){return!![];},Window_Selectable[_0x100070(0x7ae)][_0x100070(0x43e)]=function(){const _0x3a5010=_0x100070;if(this['isCursorMovable']()){const _0x3a54fb=this[_0x3a5010(0x835)]();Input[_0x3a5010(0x4bb)](_0x3a5010(0x2a8))&&(Input[_0x3a5010(0x11c)](_0x3a5010(0x653))&&this[_0x3a5010(0x450)]()?this[_0x3a5010(0x4d1)]():this[_0x3a5010(0x732)](Input[_0x3a5010(0x7f7)](_0x3a5010(0x2a8)))),Input['isRepeated']('up')&&(Input[_0x3a5010(0x11c)](_0x3a5010(0x653))&&this[_0x3a5010(0x450)]()?this[_0x3a5010(0x338)]():this[_0x3a5010(0x796)](Input[_0x3a5010(0x7f7)]('up'))),Input['isRepeated'](_0x3a5010(0x12e))&&this[_0x3a5010(0x2e9)](Input[_0x3a5010(0x7f7)](_0x3a5010(0x12e))),Input['isRepeated'](_0x3a5010(0xbf))&&this[_0x3a5010(0x636)](Input[_0x3a5010(0x7f7)](_0x3a5010(0xbf))),!this['isHandled'](_0x3a5010(0x802))&&Input[_0x3a5010(0x4bb)](_0x3a5010(0x802))&&this['cursorPagedown'](),!this['isHandled'](_0x3a5010(0x351))&&Input[_0x3a5010(0x4bb)](_0x3a5010(0x351))&&this[_0x3a5010(0x338)](),this['index']()!==_0x3a54fb&&this[_0x3a5010(0x30c)]();}},Window_Selectable[_0x100070(0x7ae)][_0x100070(0x87e)]=function(){const _0x5c33d6=_0x100070;if(this[_0x5c33d6(0x25d)]()){const _0x5f3f1a=this[_0x5c33d6(0x835)]();Input[_0x5c33d6(0x7f7)]('home')&&this[_0x5c33d6(0x6c4)](Math[_0x5c33d6(0x369)](this['index'](),0x0)),Input[_0x5c33d6(0x7f7)]('end')&&this['smoothSelect'](Math[_0x5c33d6(0x23f)](this[_0x5c33d6(0x835)](),this['maxItems']()-0x1)),this[_0x5c33d6(0x835)]()!==_0x5f3f1a&&this[_0x5c33d6(0x30c)]();}},VisuMZ[_0x100070(0x785)][_0x100070(0x4ac)]=Window_Selectable['prototype'][_0x100070(0x2e0)],Window_Selectable[_0x100070(0x7ae)][_0x100070(0x2e0)]=function(){const _0x55d9f9=_0x100070;this[_0x55d9f9(0x5cb)]()?this[_0x55d9f9(0x4ab)]():VisuMZ['CoreEngine'][_0x55d9f9(0x4ac)][_0x55d9f9(0x703)](this);},Window_Selectable['prototype'][_0x100070(0x4ab)]=function(){const _0x1f25ce=_0x100070;VisuMZ[_0x1f25ce(0x785)][_0x1f25ce(0x4ac)][_0x1f25ce(0x703)](this);},Window_Selectable[_0x100070(0x7ae)]['colSpacing']=function(){const _0x54e993=_0x100070;return VisuMZ[_0x54e993(0x785)]['Settings'][_0x54e993(0x775)][_0x54e993(0x877)];},Window_Selectable[_0x100070(0x7ae)]['rowSpacing']=function(){const _0x5273a7=_0x100070;return VisuMZ[_0x5273a7(0x785)]['Settings'][_0x5273a7(0x775)]['RowSpacing'];},Window_Selectable[_0x100070(0x7ae)][_0x100070(0x3f9)]=function(){const _0x490047=_0x100070;return Window_Scrollable[_0x490047(0x7ae)][_0x490047(0x3f9)][_0x490047(0x703)](this)+VisuMZ['CoreEngine'][_0x490047(0x598)]['Window'][_0x490047(0x12b)];;},VisuMZ[_0x100070(0x785)][_0x100070(0x26c)]=Window_Selectable[_0x100070(0x7ae)]['drawBackgroundRect'],Window_Selectable[_0x100070(0x7ae)][_0x100070(0x43f)]=function(_0x2fec27){const _0x7f20b6=_0x100070,_0x2be3db=VisuMZ['CoreEngine'][_0x7f20b6(0x598)][_0x7f20b6(0x775)];if(_0x2be3db[_0x7f20b6(0x3d6)]===![])return;_0x2be3db[_0x7f20b6(0x6a6)]?_0x2be3db['DrawItemBackgroundJS'][_0x7f20b6(0x703)](this,_0x2fec27):VisuMZ[_0x7f20b6(0x785)][_0x7f20b6(0x26c)][_0x7f20b6(0x703)](this,_0x2fec27);},VisuMZ['CoreEngine'][_0x100070(0x49a)]=Window_Gold[_0x100070(0x7ae)][_0x100070(0x5ad)],Window_Gold['prototype'][_0x100070(0x5ad)]=function(){const _0x2b7d56=_0x100070;this['isItemStyle']()?this[_0x2b7d56(0x514)]():VisuMZ['CoreEngine'][_0x2b7d56(0x49a)][_0x2b7d56(0x703)](this);},Window_Gold['prototype'][_0x100070(0x13a)]=function(){const _0x473238=_0x100070;if(TextManager[_0x473238(0x26a)]!==this['currencyUnit']())return![];return VisuMZ['CoreEngine'][_0x473238(0x598)]['Gold'][_0x473238(0x6b4)];},Window_Gold['prototype'][_0x100070(0x514)]=function(){const _0x126c1a=_0x100070;this[_0x126c1a(0x46a)](),this['contents'][_0x126c1a(0x85d)](),this[_0x126c1a(0x41b)]['fontSize']=VisuMZ[_0x126c1a(0x785)]['Settings']['Gold']['GoldFontSize'];const _0x47bbc3=VisuMZ[_0x126c1a(0x785)][_0x126c1a(0x598)][_0x126c1a(0x2f2)]['GoldIcon'],_0x50cc0f=this['itemLineRect'](0x0);if(_0x47bbc3>0x0){const _0x51fe87=ImageManager[_0x126c1a(0x2b3)]||0x20,_0x24300d=_0x51fe87-ImageManager[_0x126c1a(0x288)],_0x1fded8=_0x50cc0f['y']+(this[_0x126c1a(0x113)]()-ImageManager[_0x126c1a(0x1bc)])/0x2;this[_0x126c1a(0x82c)](_0x47bbc3,_0x50cc0f['x']+Math[_0x126c1a(0x5fd)](_0x24300d/0x2),_0x1fded8);const _0x568dfa=_0x51fe87+0x4;_0x50cc0f['x']+=_0x568dfa,_0x50cc0f[_0x126c1a(0x1ed)]-=_0x568dfa;}this['changeTextColor'](ColorManager[_0x126c1a(0x414)]()),this[_0x126c1a(0x100)](this[_0x126c1a(0x26a)](),_0x50cc0f['x'],_0x50cc0f['y'],_0x50cc0f[_0x126c1a(0x1ed)],_0x126c1a(0xbf));const _0xd22800=this[_0x126c1a(0x21b)](this[_0x126c1a(0x26a)]())+0x6;;_0x50cc0f['x']+=_0xd22800,_0x50cc0f[_0x126c1a(0x1ed)]-=_0xd22800,this[_0x126c1a(0x262)]();const _0x39bccc=this['value'](),_0x2ce841=this['textWidth'](this[_0x126c1a(0x5f4)]?VisuMZ[_0x126c1a(0x89c)](this[_0x126c1a(0x712)]()):this[_0x126c1a(0x712)]());_0x2ce841>_0x50cc0f['width']?this[_0x126c1a(0x100)](VisuMZ['CoreEngine'][_0x126c1a(0x598)][_0x126c1a(0x2f2)]['GoldOverlap'],_0x50cc0f['x'],_0x50cc0f['y'],_0x50cc0f['width'],_0x126c1a(0x12e)):this['drawText'](this[_0x126c1a(0x712)](),_0x50cc0f['x'],_0x50cc0f['y'],_0x50cc0f[_0x126c1a(0x1ed)],_0x126c1a(0x12e)),this[_0x126c1a(0x46a)]();},Window_StatusBase[_0x100070(0x7ae)]['drawParamText']=function(_0x7ab80c,_0x3fa5eb,_0x57587d,_0x1c2ffd,_0x3e6c5d){const _0x34a9c4=_0x100070;_0x1c2ffd=String(_0x1c2ffd||'')[_0x34a9c4(0x4f4)]();if(VisuMZ[_0x34a9c4(0x785)]['Settings'][_0x34a9c4(0x7a7)][_0x34a9c4(0x73c)]){const _0x10e1b4=VisuMZ[_0x34a9c4(0x2bd)](_0x1c2ffd);if(_0x3e6c5d)this['drawIconBySize'](_0x10e1b4,_0x7ab80c,_0x3fa5eb,this[_0x34a9c4(0x25a)]()),_0x57587d-=this[_0x34a9c4(0x25a)]()+0x2,_0x7ab80c+=this[_0x34a9c4(0x25a)]()+0x2;else{const _0x1a4504=ImageManager[_0x34a9c4(0x2b3)]||0x20,_0x261b8d=ImageManager[_0x34a9c4(0x446)]||0x20,_0x596645=_0x1a4504-ImageManager[_0x34a9c4(0x288)],_0x3df2cb=_0x261b8d-ImageManager[_0x34a9c4(0x1bc)];let _0x34c434=0x2,_0xa2a8fc=0x2;this[_0x34a9c4(0x113)]()!==0x24&&(_0xa2a8fc=Math[_0x34a9c4(0x279)]((this['lineHeight']()-_0x261b8d)/0x2));const _0x7afbc8=_0x7ab80c+Math[_0x34a9c4(0x279)](_0x596645/0x2)+_0x34c434,_0x56c139=_0x3fa5eb+Math[_0x34a9c4(0x279)](_0x3df2cb/0x2)+_0xa2a8fc;this[_0x34a9c4(0x82c)](_0x10e1b4,_0x7afbc8,_0x56c139),_0x57587d-=_0x1a4504+0x4,_0x7ab80c+=_0x1a4504+0x4;}}const _0x4c2f17=TextManager[_0x34a9c4(0x79a)](_0x1c2ffd);this[_0x34a9c4(0x46a)](),this['changeTextColor'](ColorManager['systemColor']()),_0x3e6c5d?(this[_0x34a9c4(0x41b)][_0x34a9c4(0xb8)]=this[_0x34a9c4(0x3df)](),this[_0x34a9c4(0x41b)][_0x34a9c4(0x100)](_0x4c2f17,_0x7ab80c,_0x3fa5eb,_0x57587d,this[_0x34a9c4(0x25a)](),_0x34a9c4(0xbf))):this[_0x34a9c4(0x100)](_0x4c2f17,_0x7ab80c,_0x3fa5eb,_0x57587d),this[_0x34a9c4(0x46a)]();},Window_StatusBase[_0x100070(0x7ae)]['smallParamFontSize']=function(){const _0x6aeeca=_0x100070;return $gameSystem[_0x6aeeca(0x64b)]()-0x8;},Window_StatusBase[_0x100070(0x7ae)][_0x100070(0x5af)]=function(_0x5e3396,_0x2f23f7,_0x594505,_0x11c9c){const _0x363ed9=_0x100070;_0x11c9c=_0x11c9c||0xa8,this[_0x363ed9(0x262)]();if(VisuMZ['CoreEngine'][_0x363ed9(0x598)]['UI'][_0x363ed9(0x745)])this['drawTextEx'](_0x5e3396[_0x363ed9(0x54e)]()[_0x363ed9(0x554)],_0x2f23f7,_0x594505,_0x11c9c);else{const _0x3d7f30=_0x5e3396[_0x363ed9(0x54e)]()[_0x363ed9(0x554)][_0x363ed9(0x617)](/\\I\[(\d+)\]/gi,'');this[_0x363ed9(0x100)](_0x3d7f30,_0x2f23f7,_0x594505,_0x11c9c);}},Window_StatusBase[_0x100070(0x7ae)][_0x100070(0x7b5)]=function(_0x5f094a,_0x8fb836,_0x28c9dc,_0x80e2c6){const _0x47ce0f=_0x100070;_0x80e2c6=_0x80e2c6||0x10e,this[_0x47ce0f(0x262)]();if(VisuMZ[_0x47ce0f(0x785)][_0x47ce0f(0x598)]['UI'][_0x47ce0f(0x2b5)])this[_0x47ce0f(0x7d7)](_0x5f094a[_0x47ce0f(0x49f)](),_0x8fb836,_0x28c9dc,_0x80e2c6);else{const _0x277a6b=_0x5f094a['nickname']()[_0x47ce0f(0x617)](/\\I\[(\d+)\]/gi,'');this[_0x47ce0f(0x100)](_0x5f094a['nickname'](),_0x8fb836,_0x28c9dc,_0x80e2c6);}},VisuMZ[_0x100070(0x785)]['Window_StatusBase_drawActorLevel']=Window_StatusBase[_0x100070(0x7ae)][_0x100070(0x7ac)],Window_StatusBase[_0x100070(0x7ae)][_0x100070(0x7ac)]=function(_0x3ea74a,_0x2018ce,_0x12b570){const _0x37a6f0=_0x100070;if(VisuMZ['CoreEngine'][_0x37a6f0(0x598)][_0x37a6f0(0x7a7)][_0x37a6f0(0x4c6)]===![])return;if(this[_0x37a6f0(0x1d6)]())this[_0x37a6f0(0x61b)](_0x3ea74a,_0x2018ce,_0x12b570);VisuMZ[_0x37a6f0(0x785)]['Window_StatusBase_drawActorLevel']['call'](this,_0x3ea74a,_0x2018ce,_0x12b570);},Window_StatusBase[_0x100070(0x7ae)][_0x100070(0x1d6)]=function(){const _0x43641c=_0x100070;return VisuMZ[_0x43641c(0x785)][_0x43641c(0x598)]['UI'][_0x43641c(0x805)];},Window_StatusBase[_0x100070(0x7ae)]['drawActorExpGauge']=function(_0x4aba25,_0x234ce2,_0x465f22){const _0x260953=_0x100070;if(!_0x4aba25)return;if(!_0x4aba25[_0x260953(0x51e)]())return;const _0x4e1fb0=0x80,_0x257912=_0x4aba25[_0x260953(0x5c2)]();let _0xc7ba86=ColorManager[_0x260953(0x5b3)](),_0x44aeff=ColorManager[_0x260953(0x328)]();_0x257912>=0x1&&(_0xc7ba86=ColorManager[_0x260953(0x74c)](),_0x44aeff=ColorManager[_0x260953(0x80c)]()),this[_0x260953(0x3ce)](_0x234ce2,_0x465f22,_0x4e1fb0,_0x257912,_0xc7ba86,_0x44aeff);},Window_EquipStatus[_0x100070(0x7ae)][_0x100070(0x42f)]=function(){const _0x46fa40=_0x100070;let _0x56e8c2=0x0;for(const _0x161bee of VisuMZ[_0x46fa40(0x785)][_0x46fa40(0x598)][_0x46fa40(0x7a7)]['DisplayedParams']){const _0x22ac36=this['itemPadding'](),_0x5fe193=this[_0x46fa40(0x73e)](_0x56e8c2);this[_0x46fa40(0x6b5)](_0x22ac36,_0x5fe193,_0x161bee),_0x56e8c2++;}},Window_EquipStatus[_0x100070(0x7ae)][_0x100070(0x13b)]=function(_0x2bd927,_0x2f589e,_0x59caaa){const _0x4a7f39=_0x100070,_0x3c7380=this[_0x4a7f39(0x4b7)]()-this[_0x4a7f39(0x7e0)]()*0x2;this[_0x4a7f39(0x67c)](_0x2bd927,_0x2f589e,_0x3c7380,_0x59caaa,![]);},Window_EquipStatus[_0x100070(0x7ae)][_0x100070(0x36b)]=function(_0x4d7d52,_0x2fa30c,_0x20907c){const _0x30d8b8=_0x100070,_0x15bb79=this[_0x30d8b8(0xed)]();this['resetTextColor'](),this[_0x30d8b8(0x100)](this[_0x30d8b8(0x32e)]['paramValueByName'](_0x20907c,!![]),_0x4d7d52,_0x2fa30c,_0x15bb79,_0x30d8b8(0x12e));},Window_EquipStatus[_0x100070(0x7ae)][_0x100070(0x15b)]=function(_0x42c452,_0x32c7ed){const _0x546eac=_0x100070,_0x10e15f=this[_0x546eac(0x81c)]();this[_0x546eac(0x656)](ColorManager[_0x546eac(0x414)]());const _0x28feed=VisuMZ['CoreEngine']['Settings']['UI'][_0x546eac(0x463)];this[_0x546eac(0x100)](_0x28feed,_0x42c452,_0x32c7ed,_0x10e15f,'center');},Window_EquipStatus[_0x100070(0x7ae)]['drawNewParam']=function(_0x10167b,_0x47ade8,_0x1d4aef){const _0x1b7f6c=_0x100070,_0x922d28=this[_0x1b7f6c(0xed)](),_0x56366a=this[_0x1b7f6c(0x49b)][_0x1b7f6c(0x44c)](_0x1d4aef),_0x3d8721=_0x56366a-this[_0x1b7f6c(0x32e)][_0x1b7f6c(0x44c)](_0x1d4aef);this[_0x1b7f6c(0x656)](ColorManager[_0x1b7f6c(0x12f)](_0x3d8721)),this[_0x1b7f6c(0x100)](this[_0x1b7f6c(0x49b)][_0x1b7f6c(0x44c)](_0x1d4aef,!![]),_0x10167b,_0x47ade8,_0x922d28,'right');},VisuMZ[_0x100070(0x785)]['Window_EquipItem_isEnabled']=Window_EquipItem['prototype']['isEnabled'],Window_EquipItem[_0x100070(0x7ae)][_0x100070(0x1b5)]=function(_0xe610b8){const _0x465cd2=_0x100070;return _0xe610b8&&this['_actor']?this[_0x465cd2(0x32e)][_0x465cd2(0x3f4)](_0xe610b8):VisuMZ['CoreEngine'][_0x465cd2(0x713)][_0x465cd2(0x703)](this,_0xe610b8);},Window_StatusParams[_0x100070(0x7ae)][_0x100070(0x6a9)]=function(){const _0x1f72b4=_0x100070;return VisuMZ[_0x1f72b4(0x785)][_0x1f72b4(0x598)]['Param'][_0x1f72b4(0x474)]['length'];},Window_StatusParams[_0x100070(0x7ae)][_0x100070(0x6b5)]=function(_0x397f9b){const _0x1f8436=_0x100070,_0x5db9f7=this[_0x1f8436(0x33e)](_0x397f9b),_0x1c0ef1=VisuMZ[_0x1f8436(0x785)][_0x1f8436(0x598)]['Param'][_0x1f8436(0x474)][_0x397f9b],_0x4fe921=TextManager[_0x1f8436(0x79a)](_0x1c0ef1),_0x26be07=this[_0x1f8436(0x32e)]['paramValueByName'](_0x1c0ef1,!![]);this[_0x1f8436(0x67c)](_0x5db9f7['x'],_0x5db9f7['y'],0xa0,_0x1c0ef1,![]),this[_0x1f8436(0x262)](),this['drawText'](_0x26be07,_0x5db9f7['x']+0xa0,_0x5db9f7['y'],0x3c,_0x1f8436(0x12e));};if(VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x78a)]['EnableNameInput']){VisuMZ['CoreEngine'][_0x100070(0x598)][_0x100070(0x78a)][_0x100070(0x1c7)]&&(Window_NameInput[_0x100070(0x3c7)]=['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','\x27','`','Z','X','C','V','B','N','M',',','.','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l',':','~','z','x','c','v','b','n','m','\x22',';','1','2','3','4','5','6','7','8','9','0','!','@','#','$','%','^','&','*','(',')','<','>','[',']','-','_','/','\x20',_0x100070(0x1be),'OK']);;VisuMZ[_0x100070(0x785)]['Window_NameInput_initialize']=Window_NameInput[_0x100070(0x7ae)][_0x100070(0x811)],Window_NameInput[_0x100070(0x7ae)][_0x100070(0x811)]=function(_0x479a84){const _0x92ce69=_0x100070;this[_0x92ce69(0x7bf)]=this['defaultInputMode'](),VisuMZ[_0x92ce69(0x785)]['Window_NameInput_initialize']['call'](this,_0x479a84),this[_0x92ce69(0x7bf)]===_0x92ce69(0x51c)?this[_0x92ce69(0x726)](0x0):(Input[_0x92ce69(0x85d)](),this['deselect']());},Window_NameInput[_0x100070(0x7ae)][_0x100070(0x537)]=function(){const _0x413c7a=_0x100070;if(Input['isGamepadConnected']())return _0x413c7a(0x51c);return VisuMZ[_0x413c7a(0x785)][_0x413c7a(0x598)][_0x413c7a(0x78a)]['DefaultMode']||_0x413c7a(0x486);},VisuMZ[_0x100070(0x785)]['Window_NameInput_processHandling']=Window_NameInput[_0x100070(0x7ae)][_0x100070(0x62b)],Window_NameInput[_0x100070(0x7ae)][_0x100070(0x62b)]=function(){const _0x36a19b=_0x100070;if(!this[_0x36a19b(0x34c)]())return;if(!this['active'])return;if(this[_0x36a19b(0x7bf)]===_0x36a19b(0x486)&&Input[_0x36a19b(0x25f)]())this['switchModes'](_0x36a19b(0x51c));else{if(Input['isSpecialCode'](_0x36a19b(0x19a)))Input[_0x36a19b(0x85d)](),this[_0x36a19b(0x56d)]();else{if(Input[_0x36a19b(0x7f7)](_0x36a19b(0x161)))Input[_0x36a19b(0x85d)](),this[_0x36a19b(0x7bf)]===_0x36a19b(0x486)?this[_0x36a19b(0x2ac)]('default'):this[_0x36a19b(0x2ac)](_0x36a19b(0x486));else{if(this[_0x36a19b(0x7bf)]==='keyboard')this['processKeyboardHandling']();else Input['isSpecialCode'](_0x36a19b(0x2e4))?(Input['clear'](),this['switchModes'](_0x36a19b(0x486))):VisuMZ[_0x36a19b(0x785)][_0x36a19b(0x374)]['call'](this);}}}},VisuMZ[_0x100070(0x785)]['Window_NameInput_processTouch']=Window_NameInput['prototype']['processTouch'],Window_NameInput[_0x100070(0x7ae)][_0x100070(0x2e0)]=function(){const _0x49f113=_0x100070;if(!this[_0x49f113(0x7f6)]())return;if(this[_0x49f113(0x7bf)]===_0x49f113(0x486)){if(TouchInput[_0x49f113(0x7f7)]()&&this['isTouchedInsideFrame']())this[_0x49f113(0x2ac)](_0x49f113(0x51c));else TouchInput[_0x49f113(0x20b)]()&&this[_0x49f113(0x2ac)](_0x49f113(0x51c));}else VisuMZ['CoreEngine']['Window_NameInput_processTouch'][_0x49f113(0x703)](this);},Window_NameInput[_0x100070(0x7ae)][_0x100070(0x86f)]=function(){const _0x55376e=_0x100070;if(Input['isSpecialCode'](_0x55376e(0x4fe)))Input[_0x55376e(0x85d)](),this[_0x55376e(0x3bc)]();else{if(Input[_0x55376e(0x191)]!==undefined){let _0x46b437=Input[_0x55376e(0x191)],_0x1fe691=_0x46b437[_0x55376e(0x1ba)];for(let _0x42a800=0x0;_0x42a800<_0x1fe691;++_0x42a800){this['_editWindow'][_0x55376e(0x557)](_0x46b437[_0x42a800])?SoundManager[_0x55376e(0x123)]():SoundManager['playBuzzer']();}Input[_0x55376e(0x85d)]();}}},Window_NameInput[_0x100070(0x7ae)][_0x100070(0x2ac)]=function(_0x549aac){const _0x218f82=_0x100070;let _0x598b36=this['_mode'];this[_0x218f82(0x7bf)]=_0x549aac,_0x598b36!==this[_0x218f82(0x7bf)]&&(this[_0x218f82(0x5ad)](),SoundManager[_0x218f82(0x123)](),this['_mode']===_0x218f82(0x51c)?this[_0x218f82(0x726)](0x0):this[_0x218f82(0x726)](-0x1));},VisuMZ[_0x100070(0x785)][_0x100070(0x3bd)]=Window_NameInput['prototype'][_0x100070(0x732)],Window_NameInput[_0x100070(0x7ae)][_0x100070(0x732)]=function(_0x4c1154){const _0x2d9b3c=_0x100070;if(this['_mode']==='keyboard'&&!Input[_0x2d9b3c(0x4fb)]())return;if(Input[_0x2d9b3c(0x188)]())return;VisuMZ[_0x2d9b3c(0x785)][_0x2d9b3c(0x3bd)][_0x2d9b3c(0x703)](this,_0x4c1154),this[_0x2d9b3c(0x2ac)](_0x2d9b3c(0x51c));},VisuMZ[_0x100070(0x785)]['Window_NameInput_cursorUp']=Window_NameInput[_0x100070(0x7ae)][_0x100070(0x796)],Window_NameInput[_0x100070(0x7ae)][_0x100070(0x796)]=function(_0x114099){const _0x8de5f3=_0x100070;if(this[_0x8de5f3(0x7bf)]==='keyboard'&&!Input['isArrowPressed']())return;if(Input[_0x8de5f3(0x188)]())return;VisuMZ[_0x8de5f3(0x785)]['Window_NameInput_cursorUp'][_0x8de5f3(0x703)](this,_0x114099),this[_0x8de5f3(0x2ac)]('default');},VisuMZ[_0x100070(0x785)]['Window_NameInput_cursorRight']=Window_NameInput[_0x100070(0x7ae)][_0x100070(0x2e9)],Window_NameInput[_0x100070(0x7ae)][_0x100070(0x2e9)]=function(_0x5013b){const _0x9fc68c=_0x100070;if(this[_0x9fc68c(0x7bf)]===_0x9fc68c(0x486)&&!Input['isArrowPressed']())return;if(Input[_0x9fc68c(0x188)]())return;VisuMZ[_0x9fc68c(0x785)][_0x9fc68c(0x229)][_0x9fc68c(0x703)](this,_0x5013b),this['switchModes'](_0x9fc68c(0x51c));},VisuMZ['CoreEngine'][_0x100070(0x31b)]=Window_NameInput[_0x100070(0x7ae)][_0x100070(0x636)],Window_NameInput[_0x100070(0x7ae)]['cursorLeft']=function(_0xe413d4){const _0x779fd6=_0x100070;if(this['_mode']===_0x779fd6(0x486)&&!Input['isArrowPressed']())return;if(Input[_0x779fd6(0x188)]())return;VisuMZ['CoreEngine'][_0x779fd6(0x31b)][_0x779fd6(0x703)](this,_0xe413d4),this[_0x779fd6(0x2ac)](_0x779fd6(0x51c));},VisuMZ[_0x100070(0x785)]['Window_NameInput_cursorPagedown']=Window_NameInput[_0x100070(0x7ae)][_0x100070(0x4d1)],Window_NameInput[_0x100070(0x7ae)][_0x100070(0x4d1)]=function(){const _0x120cdf=_0x100070;if(this[_0x120cdf(0x7bf)]===_0x120cdf(0x486))return;if(Input[_0x120cdf(0x188)]())return;VisuMZ[_0x120cdf(0x785)]['Window_NameInput_cursorPagedown'][_0x120cdf(0x703)](this),this[_0x120cdf(0x2ac)](_0x120cdf(0x51c));},VisuMZ[_0x100070(0x785)]['Window_NameInput_cursorPageup']=Window_NameInput[_0x100070(0x7ae)]['cursorPageup'],Window_NameInput[_0x100070(0x7ae)][_0x100070(0x338)]=function(){const _0x1aa343=_0x100070;if(this['_mode']==='keyboard')return;if(Input[_0x1aa343(0x188)]())return;VisuMZ[_0x1aa343(0x785)]['Window_NameInput_cursorPageup']['call'](this),this['switchModes'](_0x1aa343(0x51c));},VisuMZ[_0x100070(0x785)][_0x100070(0x860)]=Window_NameInput[_0x100070(0x7ae)][_0x100070(0x5ad)],Window_NameInput[_0x100070(0x7ae)]['refresh']=function(){const _0x471be1=_0x100070;if(this[_0x471be1(0x7bf)]===_0x471be1(0x486)){this['contents']['clear'](),this[_0x471be1(0x50d)]['clear'](),this[_0x471be1(0x262)]();let _0x1fbf73=VisuMZ[_0x471be1(0x785)][_0x471be1(0x598)][_0x471be1(0x78a)][_0x471be1(0x7c6)][_0x471be1(0x213)]('\x0a'),_0x220e93=_0x1fbf73[_0x471be1(0x1ba)],_0x1a629a=(this['innerHeight']-_0x220e93*this[_0x471be1(0x113)]())/0x2;for(let _0x22dbbd=0x0;_0x22dbbd<_0x220e93;++_0x22dbbd){let _0x4ad57c=_0x1fbf73[_0x22dbbd],_0xe55a7f=this['textSizeEx'](_0x4ad57c)['width'],_0x1f614f=Math['floor']((this[_0x471be1(0x41b)][_0x471be1(0x1ed)]-_0xe55a7f)/0x2);this[_0x471be1(0x7d7)](_0x4ad57c,_0x1f614f,_0x1a629a),_0x1a629a+=this[_0x471be1(0x113)]();}}else VisuMZ[_0x471be1(0x785)][_0x471be1(0x860)]['call'](this);};};VisuMZ['CoreEngine'][_0x100070(0x4a5)]=Window_ShopSell[_0x100070(0x7ae)]['isEnabled'],Window_ShopSell[_0x100070(0x7ae)]['isEnabled']=function(_0x39b198){const _0x199300=_0x100070;return VisuMZ['CoreEngine'][_0x199300(0x598)][_0x199300(0x1f9)]['KeyItemProtect']&&DataManager['isKeyItem'](_0x39b198)?![]:VisuMZ['CoreEngine']['Window_ShopSell_isEnabled']['call'](this,_0x39b198);},Window_NumberInput['prototype'][_0x100070(0x5cb)]=function(){return![];};VisuMZ['CoreEngine'][_0x100070(0x598)]['KeyboardInput'][_0x100070(0x126)]&&(VisuMZ[_0x100070(0x785)][_0x100070(0xbb)]=Window_NumberInput[_0x100070(0x7ae)]['start'],Window_NumberInput['prototype']['start']=function(){const _0x36e819=_0x100070;VisuMZ['CoreEngine'][_0x36e819(0xbb)][_0x36e819(0x703)](this),this[_0x36e819(0x726)](this['_maxDigits']-0x1),Input[_0x36e819(0x85d)]();},VisuMZ[_0x100070(0x785)]['Window_NumberInput_processDigitChange']=Window_NumberInput[_0x100070(0x7ae)][_0x100070(0x1b8)],Window_NumberInput['prototype'][_0x100070(0x1b8)]=function(){const _0x57c1d8=_0x100070;if(!this[_0x57c1d8(0x7f6)]())return;if(Input[_0x57c1d8(0x188)]())this[_0x57c1d8(0x13c)]();else{if(Input[_0x57c1d8(0x547)](_0x57c1d8(0x19a)))this[_0x57c1d8(0x7d3)]();else{if(Input['_inputSpecialKeyCode']===0x2e)this[_0x57c1d8(0x2bc)]();else{if(Input[_0x57c1d8(0xcf)]===0x24)this[_0x57c1d8(0x4b4)]();else Input[_0x57c1d8(0xcf)]===0x23?this['processKeyboardEnd']():VisuMZ['CoreEngine'][_0x57c1d8(0x7df)][_0x57c1d8(0x703)](this);}}}},Window_NumberInput[_0x100070(0x7ae)][_0x100070(0x593)]=function(){const _0x42d400=_0x100070;if(!this[_0x42d400(0x25d)]())return;Input[_0x42d400(0x188)]()?this[_0x42d400(0x13c)]():Window_Selectable[_0x42d400(0x7ae)]['processCursorMove'][_0x42d400(0x703)](this);},Window_NumberInput['prototype']['processCursorHomeEndTrigger']=function(){},Window_NumberInput[_0x100070(0x7ae)][_0x100070(0x13c)]=function(){const _0x5c26d3=_0x100070;if(String(this['_number'])['length']>=this[_0x5c26d3(0x525)])return;const _0x47071d=Number(String(this[_0x5c26d3(0x773)])+Input[_0x5c26d3(0x191)]);if(isNaN(_0x47071d))return;this['_number']=_0x47071d;const _0x25f95b='9'[_0x5c26d3(0x127)](this['_maxDigits']);this[_0x5c26d3(0x773)]=this['_number'][_0x5c26d3(0x2d3)](0x0,_0x25f95b),Input[_0x5c26d3(0x85d)](),this[_0x5c26d3(0x5ad)](),SoundManager[_0x5c26d3(0x438)](),this[_0x5c26d3(0x726)](this[_0x5c26d3(0x525)]-0x1);},Window_NumberInput[_0x100070(0x7ae)][_0x100070(0x7d3)]=function(){const _0x46dfd1=_0x100070;this[_0x46dfd1(0x773)]=Number(String(this['_number'])[_0x46dfd1(0x6ec)](0x0,-0x1)),this[_0x46dfd1(0x773)]=Math['max'](0x0,this[_0x46dfd1(0x773)]),Input['clear'](),this[_0x46dfd1(0x5ad)](),SoundManager['playCursor'](),this[_0x46dfd1(0x726)](this[_0x46dfd1(0x525)]-0x1);},Window_NumberInput[_0x100070(0x7ae)]['processKeyboardDelete']=function(){const _0x1c7637=_0x100070;this[_0x1c7637(0x773)]=Number(String(this['_number'])['substring'](0x1)),this[_0x1c7637(0x773)]=Math[_0x1c7637(0x23f)](0x0,this[_0x1c7637(0x773)]),Input['clear'](),this[_0x1c7637(0x5ad)](),SoundManager['playCursor'](),this[_0x1c7637(0x726)](this[_0x1c7637(0x525)]-0x1);},Window_NumberInput[_0x100070(0x7ae)][_0x100070(0x4b4)]=function(){const _0x421600=_0x100070;if(this[_0x421600(0x835)]()===0x0)return;Input[_0x421600(0x85d)](),this[_0x421600(0x5ad)](),SoundManager['playCursor'](),this['select'](0x0);},Window_NumberInput[_0x100070(0x7ae)][_0x100070(0x46b)]=function(){const _0x2e5886=_0x100070;if(this[_0x2e5886(0x835)]()===this[_0x2e5886(0x525)]-0x1)return;Input['clear'](),this[_0x2e5886(0x5ad)](),SoundManager[_0x2e5886(0x438)](),this[_0x2e5886(0x726)](this['_maxDigits']-0x1);});;function _0x3196(){const _0x1f7327=['openness','ItemStyle','drawItem','destroyed','getColorDataFromPluginParameters','text%1','WIN_ICO_HELP','pointY','ParamMax','SParamVocab7','Game_Map_scrollDown','ColorCTGauge2','_clickHandler','ParseItemNotetags','XParamVocab7','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','executeLoad','smoothSelect','height','NONCONVERT','updateDocumentTitle','isDying','anchorCoreEasing','_mapY','_stored_systemColor','initMembersCoreEngine','Window_Base_drawCharacter','Scene_Name_onInputOk','removePointAnimation','mainCommandWidth','filters','BlendMode','destroyCoreEngineMarkedBitmaps','result','Chance','scrollUp','Game_Map_scrollRight','loadTileBitmap','_dimmerSprite','TitlePicButtons','ColorGaugeBack','IconSParam6','_isWindow','_actorWindow','ShowDevTools','Game_Map_setDisplayPos','helpWindowRect','item','_pictureName','CEV','_opening','this.paramBase(6)','maxBattleMembers','origin','sv_actors','isFullDocumentTitle','819000jbajVg','slice','bitmap','Sprite_StateIcon_loadBitmap','_lastPluginCommandInterpreter','Game_Picture_show','buttonAssistKey4','_dummyWindow','setMainFontSize','platform','pow','VOLUME_UP','EndingID','OPEN_BRACKET','_coreEngineShakeStyle','eva','CustomParamAbb','PictureEraseAll','DEF','requiredWtypeId1','_textQueue','createChildSprite','_gamepadWait','ApplyEasing','call','_tpbState','createCommandWindow','Window_Selectable_cursorUp','setActorHomeRepositioned','maxCols','_centerCameraCheck','isInstanceOfSceneMap','changeClass','ColorMPCost','〘Scrolling\x20Text〙\x0a','_lastIconIndex','ExportStrFromAllMaps','HYPHEN_MINUS','setAnchor','value','Window_EquipItem_isEnabled','_downArrowSprite','AudioChangeBgsPitch','GoldRect','Game_Picture_move','IconSParam3','addQueue','updateDashToggle','Current\x20tileset\x20has\x20incomplete\x20flag\x20data.','Click\x20\x22Copy\x20Page\x22\x20from\x20another\x20tileset\x27s\x20pages','BTestAddedQuantity','Scene_Map_updateMainMultiply','onInputOk','levelUpRecovery','framebuffer','initMembers','update','hide','destroyScrollBarBitmaps','select','OUTSINE','Center','XParamVocab4','LevelUpFullHp','setBackgroundType','coreEngineRepositionEnemies','processMoveCommand','X:\x20%1','ParseArmorNotetags','adjustY','createTitleButtons','cursorDown','dummyWindowRect','SParamVocab5','CustomParamIcons','getGamepads','buttonAssistWindowRect','Scene_Map_shouldAutosave','Armor-%1-%2','_scrollBarVert','BTestItems','DrawIcons','_profileWindow','paramY','OUTCIRC','_effectsContainer','CodeJS','%1\x0a','ColorMPGauge1','setupRate','TextCodeClassNames','numActions','createPointAnimationQueue','getLastGamepadUsed','Game_Picture_scaleX','State-%1-%2','evaluate','maxLvGaugeColor1','Duration','Scene_Map_createSpriteset_detach','SParamVocab0','Game_Troop_setup','yScrollLinkedOffset','ATTN','StatusParamsRect','itemBackColor1','5051LMVOqo','updatePadding','setColorTone','listWindowRect','bgmVolume','createFauxAnimationSprite','_centerElement','process_VisuMZ_CoreEngine_CustomParameters','buttonAssistOffset2','alignBottom','parse','statusEquipWindowRect','ExtJS','Wait','_hideButtons','rgba(0,\x200,\x200,\x201.0)','measureTextWidthNoRounding','ColorHPGauge2','changeTileset','ItemRect','onActorChange','Window_StatusBase_drawActorSimpleStatus','Scene_Boot_loadSystemImages','PictureID','_tile','Map%1.json','sparamFlat2','_refreshBack','etypeId','mapId','_number','INBACK','Window','ALTGR','needsUpdate','currentExp','_bgsBuffer','enable','createPointAnimationSprite','makeEncounterCount','_eventId','NUM_LOCK','TimeProgress','areTileShadowsHidden','keyCode','jsQuickFunc','SPACE','_targetY','CoreEngine','_refreshArrows','actor','enemy','OTB','KeyboardInput','CategoryRect','_baseTexture','onInputBannedWords','Bitmap_initialize','GoldBgType','isClosed','traitsPi','loadMapData','IconParam3','DashToggleR','_stored_normalColor','cursorUp','ImgLoad','bitmapWidth','CallHandlerJS','param','loadTileset','isTpb','makeFontBigger','this.paramBase(','isAutoColorAffected','isSideView','ColorExpGauge1','setupButtonImage','_commandWindow','events','forceStencil','6132GwfHBy','Param','loadGameImagesCoreEngine','applyCoreEasing','_stypeId','loadTitle1','drawActorLevel','createSpriteset','prototype','flush','BlurStrength','isBottomButtonMode','system','BarThickness','Game_Picture_initRotation','drawActorNickname','ShiftR_Toggle','IDs','outlineColor','_commonEventLayers','VisuMZ_2_BattleSystemBTB','_stored_expGaugeColor1','hasEncryptedImages','createBackground','CommandWidth','_mode','QUOTE','buttonAssistKey5','AudioChangeBgmVolume','AMPERSAND','Tilemap_addShadow','selectLast','NameInputMessage','isMaxLevel','updatePictureAntiZoom','buttonAssistKey1','cos','processAlwaysEscape','HRG','BTB','isLoopVertical','VOLUME_DOWN','turn','updateAnchor','_scaleX','processKeyboardBackspace','isAnimationOffsetXMirrored','PLUS','GameEnd','drawTextEx','refreshWithTextCodeSupport','Game_Actor_isPreserveTp','displayY','Exported_Script_%1.txt','applyEasingAnglePlus','_tpbChargeTime','show','Window_NumberInput_processDigitChange','itemPadding','DurationPerChat','scrollX','levelUp','Scene_Map_updateMain','pressed','ExtractStrFromList','ModernControls','focus','battlebacks1','ButtonAssist','SaveMenu','bgsVolume','mirror','_drawTextOutline','isClosing','_backgroundSprite','Sprite_Picture_updateOrigin','backOpacity','isCollidedWithEvents','createButtonAssistWindow','SCROLL_LOCK','isOpenAndActive','isTriggered','SEMICOLON','BTestArmors','removeAllPointAnimations','MaxDuration','updateScrollBarPosition','JsReplaceUserVar','targetObjects','_slotWindow','Game_Map_setup','touchUI','pagedown','visible','_destroyInternalTextures','LvExpGauge','playTestShiftT','onButtonImageLoad','blt','requestMotion','ColorDeath','uiAreaHeight','maxLvGaugeColor2','battlerHue','Linear','setHome','_playtestF7Looping','initialize','MIN_SAFE_INTEGER','titles2','duration','isPhysical','process_VisuMZ_CoreEngine_Notetags','keyMapper','makeDocumentTitle','_lastX','_addSpotTile','UpdatePictureCoordinates','rightArrowWidth','FDR','_backSprite','_pollGamepads','seek','CheckSplitEscape','OS_KEY','_colorCache','isInputting','HelpBgType','this.paramBase(3)','storeMapData','setAttack','target','OUTBOUNCE','Sprite_Button_initialize','drawIcon','MultiKeyFmt','_digitGroupingEx','ColorPowerDown','Map%1','KeyItemProtect','Scene_Battle_update','maxTurns','sparamFlatJS','index','resize','startAnimation','gaugeRate','_inputWindow','_isPlaytest','ParseActorNotetags','setupValueFont','ParseSkillNotetags','pos','_drawTextShadow','Rate1','DTB','playBgs','UNDERSCORE','anchor','TGR','XParamVocab5','maxLevel','58YwlVov','Game_Map_scrollLeft','MAT','_makeFontNameText','setHandler','erasePicture','_startDecrypting','Opacity','Window_MapName_refresh','Game_Unit_onBattleEnd','WIN_OEM_FJ_ROYA','IconIndex','_stored_powerDownColor','playTestF6','drawCircle','1503710rObePZ','ExportStrFromAllTroops','TRAIT_PARAM','initVisuMZCoreEngine','createJsQuickFunction','close','clear','enemies','stencilFunc','Window_NameInput_refresh','horizontal','Spriteset_Base_updatePosition','INCIRC','skills','enableDigitGrouping','buttonAssistText1','Flat','AllTroops','isKeyItem','addCommand','render','targetEvaRate','currentLevelExp','_customModified','processKeyboardHandling','evaded','addEventListener','Input_clear','Window_Base_initialize','VisuMZ_2_BattleSystemOTB','Show\x20Scrolling\x20Text\x20Script\x20Error','Script\x20Call\x20Error','ColSpacing','Game_Character_processMoveCommand','pan','paramRate1','deselect','Color','WIN_OEM_CLEAR','processCursorHomeEndTrigger','TCR','_stored_mpGaugeColor2','setupCoreEngine','Scene_Boot_startNormalGame','1127172gmhnlS','round','Mirror','_backSprite1','scrollRight','TextStr','makeInputButtonString','NUMPAD8','connected','doesNameContainBannedWords','addChildToBack','_stored_powerUpColor','backgroundBitmap','strokeRect','Bitmap_strokeRect','StatusEquipRect','_updateFilterArea','outbounce','src','SellRect','ParseEnemyNotetags','targetScaleY','runCombinedScrollingTextAsCode','SubfolderParse','_stored_expGaugeColor2','GroupDigits','CAPSLOCK','mainAreaTop','EXR','ShiftT_Toggle','StatusBgType','fontSize','waiting','TextFmt','Window_NumberInput_start','setBattleSystem','MAXHP','Scene_Battle_createSpriteset','left','ALWAYS','characters','clearCachedKeys','_startLoading','buttonAssistOffset3','Bitmap_measureTextWidth','_screenX','Plus2','SplitEscape','ExportCurMapText','F23','DECIMAL','setBackgroundOpacity','4dlNkdf','ZOOM','_inputSpecialKeyCode','stringKeyMap','_sideButtonLayout','autoRemovalTiming','_statusEquipWindow','Saved\x20file\x20as\x20%1\x20in\x20project\x20folder.','checkPlayerLocation','setGuard','_forcedBattleGridSystem','FontShadows','_targets','NUMPAD2','_baseSprite','string','EnableMasking','isNormalPriority','initCoreEasing','IconSParam4','MAXMP','hideButtonFromView','isNextScene','Game_Event_isCollidedWithEvents','fadeSpeed','fillRect','BuyRect','Smooth','keyRepeatWait','setClickHandler','MULTIPLY','_forcedBattleSys','paramWidth','position','_active','renderNoMask','getCombinedScrollingText','adjustSprite','img/%1/','thickness','child_process','tileWidth','Scene_MenuBase_mainAreaTop','REC','numberShowButton','BgFilename2','VisuMZ_2_BattleSystemSTB','processTimingData','Bitmap_drawCircle','Item-%1-%2','_animationSprites','drawText','DamageColor','Sprite_Actor_setActorHome','ColorPowerUp','process_VisuMZ_CoreEngine_RegExp','HOME','LESS_THAN','_centerElementCoreEngine','ScreenShake','INELASTIC','SParameterFormula','canAttack','buttonAssistKey%1','If\x20you\x20don\x27t\x20want\x20this\x20option,\x20set\x20Split\x20Escape\x20option\x20back\x20to\x20false.','BattleManager_invokeCounterAttack','paramPlus','destroyContents','faceHeight','buttonAssistOk','lineHeight','isGamepadConnected','OpenSpeed','DigitGroupingDamageSprites','isMVAnimation','layoutSettings','Scene_Map_createMenuButton','areButtonsHidden','StatusRect','isPressed','_lastGamepad','getKeyboardInputButtonString','Export\x20Map\x20Text\x20operation\x20will\x20finish\x20in\x20%1\x20ms(s)','advanced','_logWindow','nah','playOk','QUESTION_MARK','terms','EnableNumberInput','repeat','createExtendedTileSprite','data/','createCancelButton','ItemHeight','windowRect','image-rendering','right','paramchangeTextColor','ONE_MINUS_SRC_ALPHA','IconSParam9','object','Match','ParseAllNotetags','nw.gui','updateWaitMode','SParamVocab1','params','_rate','isItemStyle','drawParamName','processKeyboardDigitChange','_stored_deathColor','_shakeDuration','Rate','Game_Action_setAttack','IconXParam6','JSON','DATABASE','DEFAULT_SHIFT_Y','Scene_Menu_create','pop','ColorMaxLvGauge1','Window_Base_drawIcon','children','deflate','sparamRate','IconParam2','setTileFrame','mhp','_currentBgs','faces','TranslucentOpacity','setLastPluginCommandInterpreter','command355','DetachBattlePictureContainer','performEscape','Sprite_StateIcon_updateFrame','_hideTileShadows','version','ERROR!\x0a\x0aCore\x20Engine\x20>\x20Plugin\x20Parameters\x20>\x20Button\x20Assist\x20>\x20Split\x20Escape\x0a\x0a','maxHorz','drawRightArrow','win32','toLocaleString','onKeyDown','zoomScale','type','tab','isEventRunning','BACKSPACE','updatePictureCoordinates','Scene_Battle_createCancelButton','ETB','_currentMap','_stored_ctGaugeColor2','_bypassCanCounterCheck','_anglePlus','ShowScrollBar','_battleField','isPlaytest','Sprite_Battler_startMove','HELP','equips','resetBattleSystem','DetachMapPictureContainer','setViewport','Game_Temp_initialize','currentValue','makeActionList','isSceneMap','textColor','getCustomBackgroundSettings','Input_pollGamepads','indexOf','goldWindowRect','_displayX','ARRAYJSON','StartID','scaleY','command105','onClick','tpbAcceleration','DOWN','ItemMenu','setCoreEngineUpdateWindowBg','MDF','isNumpadPressed','getLastUsedGamepadType','Game_Picture_x','current','F21','start','\x0a\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%2\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20console.log(\x27JS\x20Quick\x20Function\x20\x22%1\x22\x20Error!\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20','_helpWindow','ColorTPGauge1','_inputString','targetX','_paramPlus','textSizeEx','_statusWindow','_scene','_lastY','PixelateImageRendering','([\x5c+\x5c-]\x5cd+)>','backspace','Scene_MenuBase_mainAreaHeight','INOUTQUAD','Sprite_Animation_processSoundTimings','OUTELASTIC','_balloonQueue','Scene_Status_create','setupFont','Bitmap_drawTextOutline','(\x5cd+)>','isGamepadButtonPressed','Scene_Equip_create','clearForcedGameTroopSettingsCoreEngine','OUTQUINT','initCoreEngineScreenShake','catchLoadError','imageSmoothingEnabled','NewGameBoot','moveMenuButtonSideButtonLayout','ExportAllTroopText','SideButtons','ARRAYSTR','VIEWPORT','ADD','ColorCrisis','updatePlayTestF7','addAnimationSpriteToContainer','isEnabled','SUBTRACT','PERIOD','processDigitChange','ButtonHeight','length','prepareNextScene','iconHeight','_targetScaleY','Page','alwaysDash','InputRect','Plus1','drawCurrencyValue','setEnemyAction','ControllerButtons','pendingColor','setDisplayPos','QwertyLayout','Game_System_initialize','menu','setValue','hit','Spriteset_Map_createTilemap','_troopId','VisuMZ_2_BattleSystemCTB','_changingClass','SmartEventCollisionPriority','AutoStretch','wholeDuration','reduce','toLowerCase','Y:\x20%1','isExpGaugeDrawn','IconXParam0','loadSystem','gainGold','initBasic','outlineColorGauge','OutlineColorDmg','refreshScrollBarBitmap','useFontWidthFix','learnings','_movementDuration','Game_Picture_angle','pointX','mainAreaHeightSideButtonLayout','_pointAnimationSprites','Sprite_Gauge_currentValue','IconXParam3','Spriteset_Battle_createEnemies','ARRAYSTRUCT','SceneManager_onKeyDown','_originalViewport','VisuMZ_2_BattleSystemPTB','_storedMapText','width','BattleSystem','loadPicture','Location','Actor','NUMPAD5','description','targetBackOpacity','Game_Picture_calcEasing','playtestQuickLoad','constructor','batch','QoL','Total','_CoreEngineSettings','savefileInfo','BoxMargin','《《《\x20Event\x20%1:\x20%2,\x20Page\x20%3\x20》》》\x0a%4\x0a','titleCommandWindow','EnableJS','Subtitle','powerUpColor','#%1','Scene_Load','Window_Scrollable_update','titles1','_cacheScaleX','_onceParallelInterpreters','buttons','_lastOrigin','isCancelled','Sprite_AnimationMV_processTimingData','keys\x20for\x20both\x20\x22cancel\x22\x20and\x20\x22menu\x22!\x0a\x0a','SceneManager_isGameActive','pages','randomJS','subjectHitRate','updateDuration','split','Keyboard','smooth','optionsWindowRect','helpAreaTop','removeAnimation','send','EditRect','textWidth','WASD','PRINTSCREEN','buttonAssistText4','DOLLAR','DisplayLockY','CustomParam','apply','updateAnglePlus','layeredTiles','consumable','Bitmap_blt','_offsetY','IconSParam5','Window_NameInput_cursorRight','createContents','invokeCounterAttack','EVA','padZero','map','isPreserveTp','isBottomHelpMode','command122','setLastGamepadUsed','useDigitGroupingEx','drawGameSubtitle','darwin','number','AutoScrollLockX','_onError','_windowskin','Scene_Base_terminateAnimationClearBugFix','INOUTBACK','startShake','FontSize','setMoveEasingType','max','updateBattleVariables','horz','nextLevelExp','updateOpen','ColorExpGauge2','helpAreaTopSideButtonLayout','key%1','filter','applyEasing','PictureCoordinatesMode','vert','_stored_gaugeBackColor','menuShowButton','registerCommand','_name','isFauxAnimationPlaying','TPB\x20ACTIVE','createScrollBarSprites','BuyBgType','getLastPluginCommandInterpreter','toFixed','center','_editWindow','join','updateEffekseer','sellWindowRect','gaugeLineHeight','itypeId','Game_Picture_updateMove','isCursorMovable','targetPosition','isGamepadTriggered','TargetAngle','buttonY','resetTextColor','BlurFilter','EditBgType','removeChild','_backSprite2','PositionJS','_muteSound','GoldChange','currencyUnit','guardSkillId','Window_Selectable_drawBackgroundRect','performMiss','updatePictureSettings','BottomButtons','canUse','Game_Picture_updateRotation','animationId','commandWindowRect','mute','_mapNameWindow','_cancelButton','_origin','gainItem','floor','GET','getColor','Game_Interpreter_PluginCommand','text','_mainSprite','ControllerMatches','Game_BattlerBase_initMembers','PreserveNumbers','numberWindowRect','showDevTools','BattleManager_processEscape','normalColor','Spriteset_Base_initialize','stypeId','iconWidth','bgm','SwitchRandomizeRange','buttonAreaHeight','ASTERISK','_moveEasingType','INQUAD','onTpbCharged','Untitled','ENTER','ListRect','Game_Interpreter_command355','Flat2','WIN_OEM_ENLW','redraw','DETACH_PICTURE_CONTAINER','SLASH','charAt','updateOnceParallelInterpreters','Enemy-%1-%2','ParseClassNotetags','meVolume','RepositionEnemies130','SParamVocab3','SParamVocab4','CancelText','ARRAYFUNC','\x5c}❪SHIFT❫\x5c{','_playTestFastMode','Scene_Map_updateScene','LINEAR','buttonAssistText3','down','AnimationID','VisuMZ_4_UniqueTileEffects','ScreenResolution','switchModes','(\x5cd+\x5c.?\x5cd+)>','xparamPlus','OPEN_CURLY_BRACKET','BattleManager_update','_stored_maxLvGaugeColor2','itemSuccessRate','standardIconWidth','FunctionName','TextCodeNicknames','itemWindowRect','Graphics_printError','SkillTypeRect','ParamName','Game_Picture_initBasic','isEnemy','processKeyboardDelete','GetParamIcon','Weapon-%1-%2','showIncompleteTilesetError','Scene_Map_createSpriteset','SceneManager_initialize','_forcedTroopView','rgba(0,\x200,\x200,\x200.7)','checkPassage','goto','skillId','OUTQUART','getBackgroundOpacity','tileHeight','WIN_OEM_PA1','_pageupButton','_pauseSignSprite','_onKeyPress','_width','PictureRotateBy','updateKeyText','_shouldPreventDefault','_coreEasing','clamp','mpCostColor','Skill-%1-%2','pictureId','Bitmap_clearRect','_movementWholeDuration','Renderer','opacity','Mute','Finish','vertical','setFrame','SideView','processTouch','_pictureContainer','SParamVocab2','numRepeats','escape','scale','Game_Action_itemEva','_targetScaleX','_timerSprite','cursorRight','Game_Battler_initTpbChargeTime','AnimationPoint','MCR','angle','WIN_OEM_FJ_MASSHOU','setWindowPadding','skillTypes','《《《\x20Page\x20%1\x20》》》\x0a%2\x0a','Gold','statusParamsWindowRect','setSideButtonLayout','_scrollDuration','OutlineColorGauge','INCUBIC','sceneTerminationClearEffects','exit','paramBaseAboveLevel99','offsetY','RIGHT','Game_Event_start','isScrollBarVisible','removeFauxAnimation','loadSystemImages','button','F24','StatusParamsBgType','altKey','EXECUTE','ItemBgType','Window_Selectable_cursorDown','getButtonAssistLocation','blendFunc','Game_Interpreter_command105','createCustomBackgroundImages','playCursorSound','getInputMultiButtonStrings','isSceneBattle','members','clearRect','setupCustomRateCoreEngine','STRUCT','buttonAssistText5','INOUTCUBIC','XParamVocab1','updateMotion','Spriteset_Base_update','setActorHome','drawActorSimpleStatus','title','Window_NameInput_cursorLeft','STR','Scene_Name_create','IconParam1','CRSEL','getControllerInputButtonString','sqrt','_tileExtendSprites','_shakeSpeed','ColorHPGauge1','ShopMenu','RevertPreserveNumbers','IconParam7','expGaugeColor2','process_VisuMZ_CoreEngine_ControllerButtons','Enemy','_stored_tpGaugeColor2','CLEAR','StateIconsNonFrame','_actor','overallWidth','command111','PRINT','_pictureCoordinatesWindow','updatePositionCoreEngine','_duration','_timeDuration','STB','updateLastTarget','cursorPageup','updateMain','INOUTBOUNCE','GoldIcon','COMMA','AccuracyBoost','itemLineRect','WARNING:\x20%1\x20has\x20already\x20been\x20declared\x0aand\x20cannot\x20be\x20used\x20as\x20a\x20Quick\x20JS\x20Function','removeAllFauxAnimations','_animation','startNormalGame','KeySHIFT','CreateBattleSystemID','gaugeBackColor','centerY','_currentBgm','makeAutoBattleActions','_onLoad','createFauxAnimationQueue','VariableEvalReference','isOpen','_startPlaying','IconSParam0','Scene_Base_createWindowLayer','932869AhbCzM','pageup','playEscape','sin','$dataMap','tilesets','displayX','_subject','textAlign','%1:\x20Exit\x20','KEEP','makeDeepCopy','DELETE','MenuBg','Max','framesMin','Scene_Map_createSpritesetFix','buttonAssistOffset%1','drawBackground','CustomParamNames','_listWindow','Scene_Boot_onDatabaseLoaded','offset','9gkANno','MDR','min','checkSmartEventCollision','drawCurrentParam','buttonAssistCancel','onKeyDownKeysF6F7','makeCoreEngineCommandList','Scene_MenuBase_createPageButtons','showFauxAnimations','CommonEventID','SEPARATOR','isWindowMaskingEnabled','Window_NameInput_processHandling','_displayY','XParamVocab9','getControllerInputButtonMatch','getCoreEngineScreenShakeStyle','createTileExtendSprites','RepositionEnemies','findSymbol','PGDN','updateFauxAnimations','changeAnglePlusData','BACK_QUOTE','repositionCancelButtonSideButtonLayout','filterArea','statusWindowRect','useDigitGrouping','activate','_optionsWindow','list','MinDuration','RequireFocus','CTRL','scrollDown','xparamFlat2','categoryWindowRect','onBattleStart','alpha','AntiZoomPictures','_hovered','return\x200','Scene_Options_create','_iconIndex','isPlaying','Game_Unit_onBattleStart','charging','_repositioned','setupNewGame','updatePositionCoreEngineShakeVert','_addShadow','ExtractStrFromTroop','_loadingState','buttonAssistKey3','ZERO','KeyUnlisted','updateScene','_tilemap','optSideView','_spriteset','gradientFillRect','updateOrigin','PictureRotate','ColorTPCost','8282406fcnHED','XParamVocab3','ForceNoPlayTest','atypeId','isMapScrollLinked','xparamFlatBonus','MEV','clearZoom','OpenConsole','buttonAssistOffset1','allIcons','processSoundTimings','moveCancelButtonSideButtonLayout','_coreEasingType','SETTINGS','HelpRect','_textPopupWindow','playBgm','pictures','reserveCommonEvent','onNameOk','Window_NameInput_cursorDown','Input_onKeyDown','RPGMAKER_VERSION','F17','_upArrowSprite','Rate2','_pagedownButton','animationBaseDelay','Basic','initCoreEngine','LATIN1','faceWidth','ESC','Class-%1-%2','setActionState','helpAreaHeight','ButtonFadeSpeed','drawGauge','SystemSetSideView','Input_updateGamepadState','isActiveTpb','TextJS','createPageButtons','Scene_Skill_create','remove','ShowItemBackground','easingType','KANA','setupTileExtendTerrainTags','mainAreaTopSideButtonLayout','Scene_Battle_createSpriteset_detach','updateFrameCoreEngine','drawActorIcons','context','smallParamFontSize','EQUALS','initialBattleSystem','ExtractStrFromMap','get','IconParam4','scrollY','DataManager_setupNewGame','tpColor','maxTp','valueOutlineColor','removeAnimationFromContainer','createSubSprite','CTB','_setupEventHandlers','ItemBackColor2','maxScrollX','determineSideButtonLayoutValid','offColor','innerHeight','Game_Actor_levelUp','canEquip','_updateGamepadState','shake','updateData','IconSet','itemHeight','Scene_Base_create','home','DOUBLE_QUOTE','_buttonAssistWindow','Sprite_Button_updateOpacity','mpGaugeColor2','_srcBitmap','Power','%2%1%3','ColorCTGauge1','cancelShowButton','isOptionValid','offsetX','KeyTAB','RegExp','Sprite_Gauge_gaugeRate','itemEva','skillTypeWindowRect','_mp','targetY','SystemSetFontSize','mainAreaHeight','overrideMimeType','_stored_pendingColor','VisuMZ_2_BattleSystemFTB','【%1】\x0a','systemColor','CNT','isBusy','isMenuButtonAssistEnabled','updateFrame','getPointAnimationLayer','_realScale','contents','processDrawIcon','Scene_Boot_updateDocumentTitle','Scene_Item_create','volume','style','isAnimationPlaying','keypress','Scene_Shop_create','NON_FRAME','isSideButtonLayout','SCROLLBAR','XParamVocab6','setViewportCoreEngineFix','background','PictureShowIcon','%1%2','forceOutOfPlaytest','setAnglePlusData','level','drawAllParams','wait','ATK','baseId','_mapX','animationShouldMirror','onload','Game_Picture_scaleY','this.paramBase(0)','playCursor','setMute','exec','Scene_Map_update','SlotRect','updateRotation','processCursorMoveModernControls','drawBackgroundRect','PGUP','Sprite_AnimationMV_updatePosition','NUMPAD4','push','TAB','0.00','standardIconHeight','Abbreviation','checkScrollBarBitmap','_tileExtendTerrainTags','cancel','createPointAnimation','paramValueByName','ctGaugeColor1','ONE','VOLUME_MUTE','allowShiftScrolling','CommandRect','Game_Actor_paramBase','XParamVocab2','Tilemap_addSpotTile','TRG','ARRAYEVAL','pictureButtons','NUMPAD0','checkCoreEngineDisplayCenter','CANCEL','operation','CorrectSkinBleeding','missed','_text','Sprite_destroy','inBattle','onBattleEnd','bgs','ParamArrow','parseForcedGameTroopSettingsCoreEngine','enabled','Window_Base_createContents','_offsetX','skipBranch','%1/','resetFontSettings','processKeyboardEnd','editWindowRect','picture','Unnamed','jsonToZip','_shakePower','_context','retrieveFauxAnimation','BannedWords','DisplayedParams','buttonAssistWindowSideRect','seVolume','makeFontSmaller','_displayedPassageError','paramName','SkillMenu','_screenY','padding','ActorTPColor','XParamVocab8','responseText','F16','updateScrollBars','BgType','F19','Manual','FUNC','keyboard','_storedStack','GRD','concat','horzJS','save','Scene_Title_drawGameTitle','ConvertNumberToString','ActorRect','MainMenu','_drawTextBody','setEvent','Bitmap_fillRect','IconSParam2','requestPointAnimation','setSideView','WIN_OEM_CUSEL','updateShadow','gold','stencilOp','Window_Gold_refresh','_tempActor','isEventTest','setupScrollBarBitmap','ShowJS','nickname','process_VisuMZ_CoreEngine_jsQuickFunctions','windowOpacity','_destroyCanvas','markCoreEngineModified','Spriteset_Base_isAnimationPlaying','Window_ShopSell_isEnabled','Upper\x20Left','_fauxAnimationQueue','asin','HANJA','match','processTouchModernControls','Window_Selectable_processTouch','measureTextWidth','Game_Screen_initialize','getTileExtendTerrainTags','bind','ConvertParams','setSkill','INQUART','processKeyboardHome','integer','ShowButtons','paramX','WIN_OEM_COPY','updateMainMultiply','Icon','isRepeated','translucentOpacity','pitch','createTilemap','NEAREST','buttonAssistOffset5','addChild','drawing','animationNextDelay','_stored_tpCostColor','TitleCommandList','ShowActorLevel','includes','PHA','normal','1.3.0','sv_enemies','F11','openingSpeed','log','_cache','Game_Action_itemHit','cursorPagedown','_stored_tpGaugeColor1','_clientArea','_tileSprite','itemHit','open','gameTitle','_pointAnimationQueue','Window_Base_createTextState','requestFauxAnimation','drawTextTopAligned','IconXParam8','_image','F20','subject','_isButtonHidden','ColorNormal','_backgroundFilter','addLoadListener','isNwjs','LineHeight','FTB','_targetAnchor','centerCameraCheckData','createKeyJS','_goldWindow','Bitmap_drawText','ScaleY','〖〖〖\x20Map\x20%1:\x20%2\x20Script\x20〗〗〗\x0a\x0a','MAX_SAFE_INTEGER','isGamepadAxisMoved','destroy','AnimationMirrorOffset','helpAreaBottom','initDigitGrouping','toUpperCase','exportAllMapStrings','Window_Base_drawText','BottomHelp','scrollLeft','baseTextRect','dimColor2','isArrowPressed','NewGameCommonEventAll','format','enter','initRotation','updateBgmParameters','paintOpacity','_cacheScaleY','successRate','JUNJA','Scene_Unlisted','Scene_Map_initialize','note','catchUnknownError','worldTransform','StatusEquipBgType','LUK','CommandBgType','contentsBack','boxHeight','ItemPadding','Scene_MenuBase_createBackground','ctrlKey','keys','refreshSpritesetForExtendedTiles','drawGoldItemStyle','slotWindowRect','xparam','Input_shouldPreventDefault','WIN_OEM_RESET','this.paramBase(7)','anglePlus','processPointAnimationRequests','default','INOUTSINE','isActor','end','process_VisuMZ_CoreEngine_Settings','parallaxes','PictureEasingType','scrollbarHeight','dimColor1','_maxDigits','Scene_Battle_createSpritesetFix','updateCoreEasing','Game_Party_consumeItem','_allTextHeight','prepare','SLEEP','App','_scaleY','IconXParam4','_pictureCoordinatesMode','(\x5cd+)([%％])>','SlotBgType','retreat','buttonAssistText%1','_scrollBarHorz','MRF','Name','defaultInputMode','ProfileBgType','itemBackColor2','AudioChangeBgsPan','PictureEraseRange','hpGaugeColor2','updatePointAnimations','SystemLoadAudio','drawGameVersion','_mirror','Control\x20Variables\x20Script\x20Error','\x20Origin:\x20%1','%1〘Choice\x20Cancel〙%1','endAnimation','_onKeyDown','deathColor','isSpecialCode','initButtonHidden','PTB','hpColor','addOnceParallelInterpreter','original','\x5c}❪TAB❫\x5c{','currentClass','MenuLayout','VisuMZ_2_BattleSystemETB','startMove','makeCommandList','MapOnceParallel','name','REPLACE','AdjustAngle','add','enableDigitGroupingEx','Graphics_centerElement','OutlineColor','DocumentTitleFmt','commandWindowRows','MRG','setCommonEvent','Scene_Base_terminate','tpGaugeColor2','LevelUpFullMp','_animationQueue','sparamFlat1','StatusMenu','onerror','Window_Selectable_processCursorMove','exportAllTroopStrings','this.paramBase(4)','random','_bgmBuffer','IconXParam5','This\x20scene\x20cannot\x20utilize\x20a\x20Once\x20Parallel!','processBack','ListBgType','this.paramBase(1)','checkSubstitute','sparamRate1','NUMPAD7','createDimmerSprite','pagedownShowButton','endAction','Bitmap_gradientFillRect','_stored_hpGaugeColor2','playOnceParallelInterpreter','ctGaugeColor2','centerX','code','ParamChange','Game_Action_numRepeats','IconSParam1','actorWindowRect','getLevel','setCoreEngineScreenShakeStyle','disable','mpGaugeColor1','openURL','_data','EXCLAMATION','AGI','_closing','ActorBgType','updateBgsParameters','maxScrollbar','WIN_OEM_FJ_TOUROKU','isAlive','VisuMZ\x20CoreEngine\x20PictureIcon\x20%1\x20%2','F22','loadTitle2','buttonAssistSwitch','Game_Map_scrollUp','processCursorMove','startAutoNewGame','parameters','_list','attackSkillId','Settings','\x0a\x0a\x0a\x0a\x0a','writeFile','getInputButtonString','buttonAssistKey2','Game_BattlerBase_refresh','ColorTPGauge2','STENCIL_BUFFER_BIT','playTestShiftR','_fauxAnimationSprites','adjustPictureAntiZoom','playCancel','maxScrollY','stretch','down2','CustomParamType','createTextPopupWindow','onDatabaseLoaded','isTileExtended','loadWindowskin','_refreshPauseSign','refresh','subtitle','drawActorClass','textHeight','loadBitmapCoreEngine','NumberBgType','expGaugeColor1','ActorMPColor','_patternHeight','contentsOpacity','paramBase','drawSegment','paramRateJS','PDR','isPointAnimationPlaying','scaleMode','allTiles','restore','removeTileExtendSprites','_hp','this.paramBase(5)','expRate','Window_Base_destroyContents','Game_Interpreter_command111','move','INSINE','this.paramBase(2)','createBuffer','saveViewport','PLAY','isUseModernControls','INOUTELASTIC','HIT','OffBarOpacity','You\x20do\x20not\x20have\x20a\x20custom\x20Input.keyMapper\x20with\x20\x22cancel\x22\x20and\x20\x22menu\x22\x20','_targetOffsetX','setupCoreEasing','updateMove','calcCoreEasing','ColorManager_loadWindowskin','getBattleSystem','randomInt','encounterStepsMinimum','updateOpacity','bitmapHeight','SellBgType','Game_Map_changeTileset','expParams','updatePosition','tileset','SnapshotOpacity','Game_Interpreter_updateWaitMode','setup','BarBodyColor','option','Padding','setEasingType','playTestF7','buttons!\x20Go\x20to\x20project\x27s\x20rmmz_core.js\x20and\x20modify\x20Input.keyMapper\x20','updateText','DimColor2','showPointAnimations','STENCIL_TEST','xparamRateJS','CategoryBgType','Input_update','_viewportSize','CRI','Scene_MenuBase_createCancelButton','TextManager_param','SkillTypeBgType','_digitGrouping','viewport','ImprovedAccuracySystem','createMenuButton','EISU','targets','catchException','〘Common\x20Event\x20%1:\x20%2〙\x20Start','<%1\x20%2:[\x20]','ceil','itemRect','top','movePageButtonSideButtonLayout','checkCacheKey','PictureFilename','_anchor','F15','Plus','IconXParam7','INOUTQUART','shouldAutosave','SELECT','_commandList','BarOffset','ExportString','OptionsBgType','EVAL','trim','initRotationCoreEngine','en-US','Bitmap_resize','updateCurrentEvent','TILDE','SwitchRandomizeOne','Window_Base_update','replace','_height','test','AutoScrollLockY','drawActorExpGauge','profileWindowRect','reserveNewGameCommonEvent','WIN_OEM_ATTN','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','OpenURL','drawFace','blockWidth','Window_SkillList_includes','alphabetic','EscapeAlways','clearStencil','loadBitmap','innerWidth','paramMax','Scene_GameEnd_createBackground','processHandling','ActorHPColor','createFauxAnimation','vertJS','INBOUNCE','Window_Base_drawFace','FadeSpeed','_inBattle','_numberWindow','Type','_pressed','cursorLeft','Enable','Graphics_defaultStretchMode','updateTransform','targetScaleX','process_VisuMZ_CoreEngine_Functions','Export\x20Troop\x20Text\x20operation\x20will\x20finish\x20in\x20%1\x20ms(s)','Title','Once\x20Parallel\x20for\x20Battle\x20requires\x20VisuMZ_1_BattleCore!','Scene_SingleLoadTransition','_defaultStretchMode','IconXParam2','RepositionActors','F18','createTroopNote','createEnemies','isGameActive','_skillTypeWindow','updatePositionCoreEngineShakeOriginal','itemHitImprovedAccuracy','tpGaugeColor1','mainFontSize','targetOpacity','Symbol','Spriteset_Base_destroy','refreshActor','fromCharCode','createCustomParameter','areButtonsOutsideMainUI','shift','setTopRow','bodyColor','changeTextColor','LEFT','font','ExportAllMapText','windowPadding','transform','_windowLayer','consumeItem','PRESERVCONVERSION(%1)','scaleSprite','buyWindowRect','GoldOverlap','PA1','AllMaps','LoadMenu','traitObjects','DummyBgType','addWindow','PositionX','adjustBoxSize','_lastScrollBarValues','Input_setupEventHandlers','outlineColorDmg','active','loadIconBitmap','EnableNameInput','lastAnimationSprite','IconParam5','END','_previousClass','isMaskingEnabled','IconSParam8','1325XTbfGB','catchNormalError','_categoryWindow','onlyfilename','makeTargetSprites','globalAlpha','drawParamText','_registerKeyInput','Scene_MenuBase_helpAreaTop','EncounterRateMinimum','drawCharacter','VisuMZ_1_BattleCore','Game_Interpreter_command122','sparam','updateClose','_buyWindow','NUMPAD6','EquipMenu','printError','ParseTilesetNotetags','FontSmoothing','Game_Picture_y','ParseStateNotetags','create','clearOnceParallelInterpreters','_sellWindow','ExtDisplayedParams','updateBackOpacity','operand','boxWidth','and\x20add\x20it\x20onto\x20this\x20one.','_itemWindow','INOUTEXPO','terminate','onEscapeSuccess','drawGameTitle','WIN_OEM_AUTO','endBattlerActions','TextPopupShow','_stored_mpGaugeColor1','contains','applyForcedGameTroopSettingsCoreEngine','sparamPlus1','displayName','Sprite_Picture_loadBitmap','buttonAssistWindowButtonRect','tilesetFlags','initialLevel','DrawItemBackgroundJS','_menuButton','_battlerName','maxItems','NoTileShadows','Window_TitleCommand_selectLast','Sprite_Animation_setViewport','paramRate','NUMPAD3','onMoveEnd','F6key','OptionsMenu','BasicParameterFormula'];_0x3196=function(){return _0x1f7327;};return _0x3196();}VisuMZ[_0x100070(0x785)][_0x100070(0x850)]=Window_MapName[_0x100070(0x7ae)][_0x100070(0x5ad)],Window_MapName[_0x100070(0x7ae)]['refresh']=function(){const _0x51346c=_0x100070;VisuMZ[_0x51346c(0x785)]['Settings'][_0x51346c(0x1f9)]['MapNameTextCode']?this['refreshWithTextCodeSupport']():VisuMZ[_0x51346c(0x785)][_0x51346c(0x850)][_0x51346c(0x703)](this);},Window_MapName[_0x100070(0x7ae)][_0x100070(0x7d8)]=function(){const _0x2aff11=_0x100070;this[_0x2aff11(0x41b)]['clear']();if($gameMap[_0x2aff11(0x6a1)]()){const _0x4e749c=this[_0x2aff11(0x628)];this[_0x2aff11(0x362)](0x0,0x0,_0x4e749c,this[_0x2aff11(0x113)]());const _0x4c4c04=this['textSizeEx']($gameMap[_0x2aff11(0x6a1)]())[_0x2aff11(0x1ed)];this[_0x2aff11(0x7d7)]($gameMap[_0x2aff11(0x6a1)](),Math[_0x2aff11(0x279)]((_0x4e749c-_0x4c4c04)/0x2),0x0);}},Window_TitleCommand[_0x100070(0x60a)]=VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x4c5)],Window_TitleCommand[_0x100070(0x7ae)][_0x100070(0x552)]=function(){this['makeCoreEngineCommandList']();},Window_TitleCommand['prototype'][_0x100070(0x36e)]=function(){const _0x4b2983=_0x100070;for(const _0x1fc994 of Window_TitleCommand[_0x4b2983(0x60a)]){if(_0x1fc994[_0x4b2983(0x49e)][_0x4b2983(0x703)](this)){const _0x233862=_0x1fc994['Symbol'];let _0x2a8929=_0x1fc994[_0x4b2983(0x888)];if(['',_0x4b2983(0x290)][_0x4b2983(0x4c7)](_0x2a8929))_0x2a8929=_0x1fc994[_0x4b2983(0x3d2)][_0x4b2983(0x703)](this);const _0x50f683=_0x1fc994[_0x4b2983(0x200)][_0x4b2983(0x703)](this),_0x53d290=_0x1fc994[_0x4b2983(0x761)][_0x4b2983(0x703)](this);this[_0x4b2983(0x86a)](_0x2a8929,_0x233862,_0x50f683,_0x53d290),this[_0x4b2983(0x84c)](_0x233862,_0x1fc994[_0x4b2983(0x799)][_0x4b2983(0x4b0)](this,_0x53d290));}}},VisuMZ['CoreEngine'][_0x100070(0x6ab)]=Window_TitleCommand[_0x100070(0x7ae)][_0x100070(0x7c5)],Window_TitleCommand[_0x100070(0x7ae)][_0x100070(0x7c5)]=function(){const _0x16711a=_0x100070;VisuMZ[_0x16711a(0x785)][_0x16711a(0x6ab)][_0x16711a(0x703)](this);if(!Window_TitleCommand['_lastCommandSymbol'])return;const _0x438d2e=this[_0x16711a(0x37b)](Window_TitleCommand['_lastCommandSymbol']),_0x17400a=Math[_0x16711a(0x279)](this['maxVisibleItems']()/0x2)-0x1;this['smoothSelect'](_0x438d2e),this[_0x16711a(0x2f5)]>0x1&&(this['_scrollDuration']=0x1,this['updateSmoothScroll']()),this[_0x16711a(0x654)](_0x438d2e-_0x17400a);},Window_GameEnd[_0x100070(0x60a)]=VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x54f)][_0x100070(0x7d6)]['CommandList'],Window_GameEnd[_0x100070(0x7ae)][_0x100070(0x552)]=function(){this['makeCoreEngineCommandList']();},Window_GameEnd[_0x100070(0x7ae)][_0x100070(0x36e)]=function(){const _0x2bed9a=_0x100070;for(const _0x4e8f2b of Window_GameEnd[_0x2bed9a(0x60a)]){if(_0x4e8f2b[_0x2bed9a(0x49e)][_0x2bed9a(0x703)](this)){const _0xfd27f0=_0x4e8f2b[_0x2bed9a(0x64d)];let _0x1d1c49=_0x4e8f2b['TextStr'];if(['',_0x2bed9a(0x290)][_0x2bed9a(0x4c7)](_0x1d1c49))_0x1d1c49=_0x4e8f2b[_0x2bed9a(0x3d2)][_0x2bed9a(0x703)](this);const _0x4424ba=_0x4e8f2b[_0x2bed9a(0x200)][_0x2bed9a(0x703)](this),_0x48454b=_0x4e8f2b[_0x2bed9a(0x761)][_0x2bed9a(0x703)](this);this['addCommand'](_0x1d1c49,_0xfd27f0,_0x4424ba,_0x48454b),this['setHandler'](_0xfd27f0,_0x4e8f2b[_0x2bed9a(0x799)][_0x2bed9a(0x4b0)](this,_0x48454b));}}};function Window_ButtonAssist(){const _0x309fa6=_0x100070;this[_0x309fa6(0x811)](...arguments);}Window_ButtonAssist[_0x100070(0x7ae)]=Object[_0x100070(0x68d)](Window_Base[_0x100070(0x7ae)]),Window_ButtonAssist[_0x100070(0x7ae)][_0x100070(0x1f7)]=Window_ButtonAssist,Window_ButtonAssist[_0x100070(0x7ae)]['initialize']=function(_0x4076f8){const _0x4f8d94=_0x100070;this['_data']={},Window_Base['prototype']['initialize']['call'](this,_0x4076f8),this[_0x4f8d94(0x72b)](VisuMZ[_0x4f8d94(0x785)][_0x4f8d94(0x598)][_0x4f8d94(0x7ea)][_0x4f8d94(0x482)]||0x0),this[_0x4f8d94(0x5ad)]();},Window_ButtonAssist[_0x100070(0x7ae)][_0x100070(0x113)]=function(){const _0x16ca66=_0x100070;return this[_0x16ca66(0x3f2)]||Window_Base[_0x16ca66(0x7ae)]['lineHeight'][_0x16ca66(0x703)](this);},Window_ButtonAssist[_0x100070(0x7ae)][_0x100070(0x79d)]=function(){const _0x172077=_0x100070;this[_0x172077(0x41b)][_0x172077(0xb8)]<=0x60&&(this[_0x172077(0x41b)][_0x172077(0xb8)]+=0x6);},Window_ButtonAssist[_0x100070(0x7ae)][_0x100070(0x477)]=function(){const _0x526502=_0x100070;this[_0x526502(0x41b)][_0x526502(0xb8)]>=0x18&&(this[_0x526502(0x41b)]['fontSize']-=0x6);},Window_ButtonAssist[_0x100070(0x7ae)]['update']=function(){const _0x25e90f=_0x100070;Window_Base[_0x25e90f(0x7ae)][_0x25e90f(0x723)][_0x25e90f(0x703)](this),this[_0x25e90f(0x2d0)]();},Window_ButtonAssist[_0x100070(0x7ae)]['updatePadding']=function(){const _0x2694a5=_0x100070;this[_0x2694a5(0x47c)]=SceneManager[_0x2694a5(0x196)]['getButtonAssistLocation']()!==_0x2694a5(0x301)?0x0:0x8;},Window_ButtonAssist['prototype']['updateKeyText']=function(){const _0x4063ff=_0x100070,_0x4e8f73=SceneManager['_scene'];for(let _0x47940b=0x1;_0x47940b<=0x5;_0x47940b++){if(this[_0x4063ff(0x585)][_0x4063ff(0x246)[_0x4063ff(0x4fd)](_0x47940b)]!==_0x4e8f73[_0x4063ff(0x10c)[_0x4063ff(0x4fd)](_0x47940b)]())return this[_0x4063ff(0x5ad)]();if(this[_0x4063ff(0x585)][_0x4063ff(0x6b8)[_0x4063ff(0x4fd)](_0x47940b)]!==_0x4e8f73[_0x4063ff(0x533)[_0x4063ff(0x4fd)](_0x47940b)]())return this[_0x4063ff(0x5ad)]();}},Window_ButtonAssist[_0x100070(0x7ae)][_0x100070(0x5ad)]=function(){const _0x2a84f7=_0x100070;this[_0x2a84f7(0x41b)]['clear']();for(let _0x3effde=0x1;_0x3effde<=0x5;_0x3effde++){this[_0x2a84f7(0x5b8)](_0x3effde);}},Window_ButtonAssist[_0x100070(0x7ae)][_0x100070(0x5b8)]=function(_0xcce89b){const _0x368965=_0x100070,_0x489d7c=this['innerWidth']/0x5,_0x120e17=SceneManager[_0x368965(0x196)],_0x1d35d4=_0x120e17[_0x368965(0x10c)[_0x368965(0x4fd)](_0xcce89b)](),_0x891017=_0x120e17[_0x368965(0x533)[_0x368965(0x4fd)](_0xcce89b)]();this[_0x368965(0x585)][_0x368965(0x246)[_0x368965(0x4fd)](_0xcce89b)]=_0x1d35d4,this[_0x368965(0x585)]['text%1'['format'](_0xcce89b)]=_0x891017;if(_0x1d35d4==='')return;if(_0x891017==='')return;const _0x2f2d45=_0x120e17[_0x368965(0x361)[_0x368965(0x4fd)](_0xcce89b)](),_0x51e892=this[_0x368965(0x7e0)](),_0x49f838=_0x489d7c*(_0xcce89b-0x1)+_0x51e892+_0x2f2d45,_0xd53517=VisuMZ[_0x368965(0x785)][_0x368965(0x598)][_0x368965(0x7ea)][_0x368965(0xba)];this['drawTextEx'](_0xd53517[_0x368965(0x4fd)](_0x1d35d4,_0x891017),_0x49f838,0x0,_0x489d7c-_0x51e892*0x2);},VisuMZ['CoreEngine'][_0x100070(0x5e0)]=Game_Interpreter[_0x100070(0x7ae)][_0x100070(0x136)],Game_Interpreter[_0x100070(0x7ae)][_0x100070(0x136)]=function(){const _0x2895aa=_0x100070;if($gameTemp['_pictureCoordinatesMode']!==undefined)return VisuMZ['CoreEngine'][_0x2895aa(0x81b)]();return VisuMZ[_0x2895aa(0x785)]['Game_Interpreter_updateWaitMode'][_0x2895aa(0x703)](this);},VisuMZ[_0x100070(0x785)][_0x100070(0x81b)]=function(){const _0x3404a4=_0x100070,_0xa6acea=$gameTemp['_pictureCoordinatesMode']||0x0;(_0xa6acea<0x0||_0xa6acea>0x64||TouchInput[_0x3404a4(0x20b)]()||Input[_0x3404a4(0x7f7)](_0x3404a4(0x44a)))&&($gameTemp[_0x3404a4(0x52f)]=undefined,Input[_0x3404a4(0x85d)](),TouchInput[_0x3404a4(0x85d)]());const _0x5a36bb=$gameScreen[_0x3404a4(0x46d)](_0xa6acea);return _0x5a36bb&&(_0x5a36bb['_x']=TouchInput['_x'],_0x5a36bb['_y']=TouchInput['_y']),VisuMZ[_0x3404a4(0x785)][_0x3404a4(0x164)](),$gameTemp[_0x3404a4(0x52f)]!==undefined;},VisuMZ[_0x100070(0x785)][_0x100070(0x164)]=function(){const _0xaaa367=_0x100070,_0x33bcfc=SceneManager[_0xaaa367(0x196)];if(!_0x33bcfc)return;!_0x33bcfc[_0xaaa367(0x332)]&&(SoundManager['playLoad'](),_0x33bcfc['_pictureCoordinatesWindow']=new Window_PictureCoordinates(),_0x33bcfc[_0xaaa367(0x4c1)](_0x33bcfc[_0xaaa367(0x332)])),$gameTemp[_0xaaa367(0x52f)]===undefined&&(SoundManager[_0xaaa367(0x5a3)](),_0x33bcfc[_0xaaa367(0x265)](_0x33bcfc[_0xaaa367(0x332)]),_0x33bcfc[_0xaaa367(0x332)]=undefined);};function Window_PictureCoordinates(){const _0x1004e7=_0x100070;this[_0x1004e7(0x811)](...arguments);}Window_PictureCoordinates[_0x100070(0x7ae)]=Object[_0x100070(0x68d)](Window_Base[_0x100070(0x7ae)]),Window_PictureCoordinates[_0x100070(0x7ae)][_0x100070(0x1f7)]=Window_PictureCoordinates,Window_PictureCoordinates['prototype'][_0x100070(0x811)]=function(){const _0x8853ba=_0x100070;this[_0x8853ba(0x20a)]=_0x8853ba(0x122),this[_0x8853ba(0x819)]='nah',this[_0x8853ba(0x197)]='nah';const _0x3eb34d=this[_0x8853ba(0x12c)]();Window_Base['prototype']['initialize'][_0x8853ba(0x703)](this,_0x3eb34d),this[_0x8853ba(0x72b)](0x2);},Window_PictureCoordinates[_0x100070(0x7ae)][_0x100070(0x12c)]=function(){const _0x5c55a3=_0x100070;let _0x12581c=0x0,_0x1f599a=Graphics[_0x5c55a3(0x6c5)]-this[_0x5c55a3(0x113)](),_0x3c7697=Graphics['width'],_0x274d55=this['lineHeight']();return new Rectangle(_0x12581c,_0x1f599a,_0x3c7697,_0x274d55);},Window_PictureCoordinates[_0x100070(0x7ae)][_0x100070(0x756)]=function(){const _0x5ad0df=_0x100070;this[_0x5ad0df(0x47c)]=0x0;},Window_PictureCoordinates['prototype'][_0x100070(0x723)]=function(){const _0x42fd06=_0x100070;Window_Base[_0x42fd06(0x7ae)][_0x42fd06(0x723)]['call'](this),this[_0x42fd06(0x3f7)]();},Window_PictureCoordinates[_0x100070(0x7ae)]['updateData']=function(){const _0x4f010c=_0x100070;if(!this[_0x4f010c(0x777)]())return;this[_0x4f010c(0x5ad)]();},Window_PictureCoordinates[_0x100070(0x7ae)][_0x100070(0x777)]=function(){const _0x71e948=_0x100070,_0x1958e8=$gameTemp['_pictureCoordinatesMode'],_0x477e16=$gameScreen[_0x71e948(0x46d)](_0x1958e8);return _0x477e16?this['_lastOrigin']!==_0x477e16[_0x71e948(0x277)]||this['_lastX']!==_0x477e16['_x']||this['_lastY']!==_0x477e16['_y']:![];},Window_PictureCoordinates[_0x100070(0x7ae)]['refresh']=function(){const _0x5091b9=_0x100070;this[_0x5091b9(0x41b)][_0x5091b9(0x85d)]();const _0x1d4f78=$gameTemp[_0x5091b9(0x52f)],_0x5b453a=$gameScreen[_0x5091b9(0x46d)](_0x1d4f78);if(!_0x5b453a)return;this[_0x5091b9(0x20a)]=_0x5b453a[_0x5091b9(0x277)],this[_0x5091b9(0x819)]=_0x5b453a['_x'],this[_0x5091b9(0x197)]=_0x5b453a['_y'];const _0xb61dae=ColorManager[_0x5091b9(0x754)]();this['contents']['fillRect'](0x0,0x0,this['innerWidth'],this['innerHeight'],_0xb61dae);const _0x241ab2=_0x5091b9(0x542)[_0x5091b9(0x4fd)](_0x5b453a[_0x5091b9(0x277)]===0x0?_0x5091b9(0x4a6):_0x5091b9(0x728)),_0x188587=_0x5091b9(0x72e)[_0x5091b9(0x4fd)](_0x5b453a['_x']),_0xc4c4e=_0x5091b9(0x1d5)[_0x5091b9(0x4fd)](_0x5b453a['_y']),_0x95f38d=_0x5091b9(0x359)[_0x5091b9(0x4fd)](TextManager['getInputButtonString'](_0x5091b9(0x44a)));let _0x168d2b=Math[_0x5091b9(0x279)](this[_0x5091b9(0x628)]/0x4);this[_0x5091b9(0x100)](_0x241ab2,_0x168d2b*0x0,0x0,_0x168d2b),this[_0x5091b9(0x100)](_0x188587,_0x168d2b*0x1,0x0,_0x168d2b,_0x5091b9(0x255)),this[_0x5091b9(0x100)](_0xc4c4e,_0x168d2b*0x2,0x0,_0x168d2b,'center');const _0x8fd677=this[_0x5091b9(0x194)](_0x95f38d)[_0x5091b9(0x1ed)],_0x422575=this[_0x5091b9(0x628)]-_0x8fd677;this[_0x5091b9(0x7d7)](_0x95f38d,_0x422575,0x0,_0x8fd677);};function Window_TextPopup(){const _0x430cbf=_0x100070;this[_0x430cbf(0x811)](...arguments);}Window_TextPopup[_0x100070(0x7ae)]=Object[_0x100070(0x68d)](Window_Base['prototype']),Window_TextPopup['prototype']['constructor']=Window_TextPopup,Window_TextPopup[_0x100070(0x3b6)]={'framesPerChar':VisuMZ[_0x100070(0x785)][_0x100070(0x598)][_0x100070(0x775)][_0x100070(0x7e1)]??1.5,'framesMin':VisuMZ['CoreEngine']['Settings'][_0x100070(0x775)][_0x100070(0x387)]??0x5a,'framesMax':VisuMZ['CoreEngine'][_0x100070(0x598)][_0x100070(0x775)][_0x100070(0x7fb)]??0x12c},Window_TextPopup[_0x100070(0x7ae)][_0x100070(0x811)]=function(){const _0x6228e0=_0x100070,_0x2d5599=new Rectangle(0x0,0x0,0x1,0x1);Window_Base['prototype'][_0x6228e0(0x811)]['call'](this,_0x2d5599),this[_0x6228e0(0x6b3)]=0x0,this['_text']='',this[_0x6228e0(0x6ff)]=[],this[_0x6228e0(0x335)]=0x0;},Window_TextPopup['prototype'][_0x100070(0x79f)]=function(){return!![];},Window_TextPopup['prototype'][_0x100070(0x719)]=function(_0x471c3e){const _0x41d5cd=_0x100070;if(this[_0x41d5cd(0x6ff)][this[_0x41d5cd(0x6ff)][_0x41d5cd(0x1ba)]-0x1]===_0x471c3e)return;this['_textQueue']['push'](_0x471c3e),SceneManager[_0x41d5cd(0x196)][_0x41d5cd(0x4c1)](this);},Window_TextPopup['prototype']['update']=function(){const _0x542ed2=_0x100070;Window_Base[_0x542ed2(0x7ae)]['update'][_0x542ed2(0x703)](this),this[_0x542ed2(0x5e8)](),this['updateDuration']();},Window_TextPopup[_0x100070(0x7ae)]['updateText']=function(){const _0x33c588=_0x100070;if(this[_0x33c588(0x45e)]!=='')return;if(this[_0x33c588(0x6ff)]['length']<=0x0)return;if(!this[_0x33c588(0x790)]())return;this[_0x33c588(0x45e)]=this[_0x33c588(0x6ff)][_0x33c588(0x653)]();const _0x570e3f=Window_TextPopup[_0x33c588(0x3b6)],_0x5eddbe=Math[_0x33c588(0x5fd)](this['_text']['length']*_0x570e3f['framesPerChar']);this['_timeDuration']=_0x5eddbe['clamp'](_0x570e3f[_0x33c588(0x35f)],_0x570e3f['framesMax']);const _0x5aadff=this[_0x33c588(0x194)](this['_text']);let _0x3b2b06=_0x5aadff[_0x33c588(0x1ed)]+this[_0x33c588(0x7e0)]()*0x2;_0x3b2b06+=$gameSystem[_0x33c588(0x65a)]()*0x2;let _0x3e53e5=Math['max'](_0x5aadff['height'],this[_0x33c588(0x113)]());_0x3e53e5+=$gameSystem['windowPadding']()*0x2;const _0x9168a0=Math[_0x33c588(0x884)]((Graphics['width']-_0x3b2b06)/0x2),_0x9b82ff=Math[_0x33c588(0x884)]((Graphics['height']-_0x3e53e5)/0x2),_0x45ff78=new Rectangle(_0x9168a0,_0x9b82ff,_0x3b2b06,_0x3e53e5);this[_0x33c588(0x5c5)](_0x45ff78['x'],_0x45ff78['y'],_0x45ff78[_0x33c588(0x1ed)],_0x45ff78['height']),this[_0x33c588(0x22a)](),this['refresh'](),this[_0x33c588(0x4d6)](),SceneManager['_scene'][_0x33c588(0x4c1)](this);},Window_TextPopup[_0x100070(0x7ae)]['refresh']=function(){const _0x1c5c41=_0x100070,_0x22934d=this[_0x1c5c41(0x4f9)]();this['contents'][_0x1c5c41(0x85d)](),this[_0x1c5c41(0x7d7)](this['_text'],_0x22934d['x'],_0x22934d['y'],_0x22934d[_0x1c5c41(0x1ed)]);},Window_TextPopup['prototype'][_0x100070(0x212)]=function(){const _0x3143dd=_0x100070;if(this['isOpening']()||this[_0x3143dd(0x7ef)]())return;if(this['_timeDuration']<=0x0)return;this['_timeDuration']--,this[_0x3143dd(0x335)]<=0x0&&(this[_0x3143dd(0x85c)](),this['_text']='');},VisuMZ[_0x100070(0x6df)]=function(_0x2db8b9){const _0x5b9f97=_0x100070;if(Utils[_0x5b9f97(0x405)](_0x5b9f97(0x619))){var _0x2cf906=require(_0x5b9f97(0x135))['Window'][_0x5b9f97(0x3e3)]();SceneManager[_0x5b9f97(0x283)]();if(_0x2db8b9)setTimeout(_0x2cf906[_0x5b9f97(0x7e8)][_0x5b9f97(0x4b0)](_0x2cf906),0x190);}},VisuMZ[_0x100070(0x702)]=function(_0x21d10b,_0x430b1f){const _0x328339=_0x100070;_0x430b1f=_0x430b1f['toUpperCase']();var _0x13ba02=1.70158,_0x149b04=0.7;switch(_0x430b1f){case _0x328339(0x2a6):return _0x21d10b;case _0x328339(0x5c6):return-0x1*Math[_0x328339(0x7ca)](_0x21d10b*(Math['PI']/0x2))+0x1;case _0x328339(0x727):return Math[_0x328339(0x353)](_0x21d10b*(Math['PI']/0x2));case _0x328339(0x51d):return-0.5*(Math['cos'](Math['PI']*_0x21d10b)-0x1);case _0x328339(0x28e):return _0x21d10b*_0x21d10b;case'OUTQUAD':return _0x21d10b*(0x2-_0x21d10b);case _0x328339(0x19c):return _0x21d10b<0.5?0x2*_0x21d10b*_0x21d10b:-0x1+(0x4-0x2*_0x21d10b)*_0x21d10b;case _0x328339(0x2f7):return _0x21d10b*_0x21d10b*_0x21d10b;case'OUTCUBIC':var _0x4e99f2=_0x21d10b-0x1;return _0x4e99f2*_0x4e99f2*_0x4e99f2+0x1;case _0x328339(0x314):return _0x21d10b<0.5?0x4*_0x21d10b*_0x21d10b*_0x21d10b:(_0x21d10b-0x1)*(0x2*_0x21d10b-0x2)*(0x2*_0x21d10b-0x2)+0x1;case _0x328339(0x4b3):return _0x21d10b*_0x21d10b*_0x21d10b*_0x21d10b;case _0x328339(0x2c7):var _0x4e99f2=_0x21d10b-0x1;return 0x1-_0x4e99f2*_0x4e99f2*_0x4e99f2*_0x4e99f2;case _0x328339(0x607):var _0x4e99f2=_0x21d10b-0x1;return _0x21d10b<0.5?0x8*_0x21d10b*_0x21d10b*_0x21d10b*_0x21d10b:0x1-0x8*_0x4e99f2*_0x4e99f2*_0x4e99f2*_0x4e99f2;case'INQUINT':return _0x21d10b*_0x21d10b*_0x21d10b*_0x21d10b*_0x21d10b;case _0x328339(0x1a7):var _0x4e99f2=_0x21d10b-0x1;return 0x1+_0x4e99f2*_0x4e99f2*_0x4e99f2*_0x4e99f2*_0x4e99f2;case'INOUTQUINT':var _0x4e99f2=_0x21d10b-0x1;return _0x21d10b<0.5?0x10*_0x21d10b*_0x21d10b*_0x21d10b*_0x21d10b*_0x21d10b:0x1+0x10*_0x4e99f2*_0x4e99f2*_0x4e99f2*_0x4e99f2*_0x4e99f2;case'INEXPO':if(_0x21d10b===0x0)return 0x0;return Math[_0x328339(0x6f5)](0x2,0xa*(_0x21d10b-0x1));case'OUTEXPO':if(_0x21d10b===0x1)return 0x1;return-Math[_0x328339(0x6f5)](0x2,-0xa*_0x21d10b)+0x1;case _0x328339(0x696):if(_0x21d10b===0x0||_0x21d10b===0x1)return _0x21d10b;var _0x303805=_0x21d10b*0x2,_0x1d9522=_0x303805-0x1;if(_0x303805<0x1)return 0.5*Math[_0x328339(0x6f5)](0x2,0xa*_0x1d9522);return 0.5*(-Math['pow'](0x2,-0xa*_0x1d9522)+0x2);case _0x328339(0x863):var _0x303805=_0x21d10b/0x1;return-0x1*(Math['sqrt'](0x1-_0x303805*_0x21d10b)-0x1);case _0x328339(0x73f):var _0x4e99f2=_0x21d10b-0x1;return Math['sqrt'](0x1-_0x4e99f2*_0x4e99f2);case'INOUTCIRC':var _0x303805=_0x21d10b*0x2,_0x1d9522=_0x303805-0x2;if(_0x303805<0x1)return-0.5*(Math[_0x328339(0x321)](0x1-_0x303805*_0x303805)-0x1);return 0.5*(Math[_0x328339(0x321)](0x1-_0x1d9522*_0x1d9522)+0x1);case _0x328339(0x774):return _0x21d10b*_0x21d10b*((_0x13ba02+0x1)*_0x21d10b-_0x13ba02);case'OUTBACK':var _0x303805=_0x21d10b/0x1-0x1;return _0x303805*_0x303805*((_0x13ba02+0x1)*_0x303805+_0x13ba02)+0x1;break;case _0x328339(0x23b):var _0x303805=_0x21d10b*0x2,_0xbb75bb=_0x303805-0x2,_0x46b82d=_0x13ba02*1.525;if(_0x303805<0x1)return 0.5*_0x303805*_0x303805*((_0x46b82d+0x1)*_0x303805-_0x46b82d);return 0.5*(_0xbb75bb*_0xbb75bb*((_0x46b82d+0x1)*_0xbb75bb+_0x46b82d)+0x2);case _0x328339(0x109):if(_0x21d10b===0x0||_0x21d10b===0x1)return _0x21d10b;var _0x303805=_0x21d10b/0x1,_0x1d9522=_0x303805-0x1,_0x545586=0x1-_0x149b04,_0x46b82d=_0x545586/(0x2*Math['PI'])*Math[_0x328339(0x4a8)](0x1);return-(Math[_0x328339(0x6f5)](0x2,0xa*_0x1d9522)*Math[_0x328339(0x353)]((_0x1d9522-_0x46b82d)*(0x2*Math['PI'])/_0x545586));case _0x328339(0x19e):var _0x545586=0x1-_0x149b04,_0x303805=_0x21d10b*0x2;if(_0x21d10b===0x0||_0x21d10b===0x1)return _0x21d10b;var _0x46b82d=_0x545586/(0x2*Math['PI'])*Math['asin'](0x1);return Math[_0x328339(0x6f5)](0x2,-0xa*_0x303805)*Math[_0x328339(0x353)]((_0x303805-_0x46b82d)*(0x2*Math['PI'])/_0x545586)+0x1;case _0x328339(0x5cc):var _0x545586=0x1-_0x149b04;if(_0x21d10b===0x0||_0x21d10b===0x1)return _0x21d10b;var _0x303805=_0x21d10b*0x2,_0x1d9522=_0x303805-0x1,_0x46b82d=_0x545586/(0x2*Math['PI'])*Math[_0x328339(0x4a8)](0x1);if(_0x303805<0x1)return-0.5*(Math[_0x328339(0x6f5)](0x2,0xa*_0x1d9522)*Math[_0x328339(0x353)]((_0x1d9522-_0x46b82d)*(0x2*Math['PI'])/_0x545586));return Math[_0x328339(0x6f5)](0x2,-0xa*_0x1d9522)*Math[_0x328339(0x353)]((_0x1d9522-_0x46b82d)*(0x2*Math['PI'])/_0x545586)*0.5+0x1;case _0x328339(0x82a):var _0x303805=_0x21d10b/0x1;if(_0x303805<0x1/2.75)return 7.5625*_0x303805*_0x303805;else{if(_0x303805<0x2/2.75){var _0xbb75bb=_0x303805-1.5/2.75;return 7.5625*_0xbb75bb*_0xbb75bb+0.75;}else{if(_0x303805<2.5/2.75){var _0xbb75bb=_0x303805-2.25/2.75;return 7.5625*_0xbb75bb*_0xbb75bb+0.9375;}else{var _0xbb75bb=_0x303805-2.625/2.75;return 7.5625*_0xbb75bb*_0xbb75bb+0.984375;}}}case _0x328339(0x62f):var _0x46ed7d=0x1-VisuMZ[_0x328339(0x702)](0x1-_0x21d10b,_0x328339(0x894));return _0x46ed7d;case _0x328339(0x33a):if(_0x21d10b<0.5)var _0x46ed7d=VisuMZ[_0x328339(0x702)](_0x21d10b*0x2,'inbounce')*0.5;else var _0x46ed7d=VisuMZ[_0x328339(0x702)](_0x21d10b*0x2-0x1,'outbounce')*0.5+0.5;return _0x46ed7d;default:return _0x21d10b;}},VisuMZ[_0x100070(0x2bd)]=function(_0x3af4e){const _0x500255=_0x100070;_0x3af4e=String(_0x3af4e)[_0x500255(0x4f4)]();const _0x489619=VisuMZ[_0x500255(0x785)][_0x500255(0x598)]['Param'];if(_0x3af4e===_0x500255(0xbd))return _0x489619['IconParam0'];if(_0x3af4e===_0x500255(0xe1))return _0x489619[_0x500255(0x31e)];if(_0x3af4e===_0x500255(0x431))return _0x489619[_0x500255(0x14c)];if(_0x3af4e===_0x500255(0x6fd))return _0x489619[_0x500255(0x793)];if(_0x3af4e===_0x500255(0x84a))return _0x489619[_0x500255(0x3e4)];if(_0x3af4e===_0x500255(0x187))return _0x489619[_0x500255(0x671)];if(_0x3af4e===_0x500255(0x587))return _0x489619['IconParam6'];if(_0x3af4e===_0x500255(0x50b))return _0x489619[_0x500255(0x327)];if(_0x3af4e===_0x500255(0x5cd))return _0x489619[_0x500255(0x1d7)];if(_0x3af4e===_0x500255(0x22c))return _0x489619['IconXParam1'];if(_0x3af4e===_0x500255(0x5f0))return _0x489619[_0x500255(0x641)];if(_0x3af4e===_0x500255(0x6e4))return _0x489619[_0x500255(0x1e6)];if(_0x3af4e==='MEV')return _0x489619[_0x500255(0x52e)];if(_0x3af4e===_0x500255(0x535))return _0x489619[_0x500255(0x56b)];if(_0x3af4e==='CNT')return _0x489619[_0x500255(0x141)];if(_0x3af4e===_0x500255(0x7cc))return _0x489619[_0x500255(0x606)];if(_0x3af4e===_0x500255(0x55d))return _0x489619[_0x500255(0x4dc)];if(_0x3af4e===_0x500255(0x455))return _0x489619['IconXParam9'];if(_0x3af4e==='TGR')return _0x489619[_0x500255(0x34e)];if(_0x3af4e==='GRD')return _0x489619[_0x500255(0x57e)];if(_0x3af4e===_0x500255(0xf8))return _0x489619[_0x500255(0x493)];if(_0x3af4e==='PHA')return _0x489619[_0x500255(0x718)];if(_0x3af4e===_0x500255(0x2ec))return _0x489619[_0x500255(0xe0)];if(_0x3af4e===_0x500255(0x87f))return _0x489619[_0x500255(0x228)];if(_0x3af4e===_0x500255(0x5ba))return _0x489619[_0x500255(0x6dc)];if(_0x3af4e===_0x500255(0x368))return _0x489619['IconSParam7'];if(_0x3af4e===_0x500255(0x81d))return _0x489619[_0x500255(0x675)];if(_0x3af4e===_0x500255(0xb5))return _0x489619[_0x500255(0x131)];if(VisuMZ[_0x500255(0x785)][_0x500255(0x735)][_0x3af4e])return VisuMZ[_0x500255(0x785)][_0x500255(0x735)][_0x3af4e]||0x0;return 0x0;},VisuMZ[_0x100070(0x48d)]=function(_0x540305,_0x39604c,_0x1ed12e){const _0x57dc87=_0x100070;if(_0x1ed12e===undefined&&_0x540305%0x1===0x0)return _0x540305;if(_0x1ed12e!==undefined&&[_0x57dc87(0xbd),'MAXMP',_0x57dc87(0x431),_0x57dc87(0x6fd),_0x57dc87(0x84a),_0x57dc87(0x187),_0x57dc87(0x587),_0x57dc87(0x50b)][_0x57dc87(0x4c7)](String(_0x1ed12e)[_0x57dc87(0x4f4)]()['trim']()))return _0x540305;_0x39604c=_0x39604c||0x0;if(VisuMZ['CoreEngine'][_0x57dc87(0x6fb)][_0x1ed12e])return VisuMZ[_0x57dc87(0x785)][_0x57dc87(0x5a7)][_0x1ed12e]===_0x57dc87(0x4b5)?_0x540305:String((_0x540305*0x64)[_0x57dc87(0x254)](_0x39604c))+'%';return String((_0x540305*0x64)[_0x57dc87(0x254)](_0x39604c))+'%';},VisuMZ[_0x100070(0x89c)]=function(_0x11a787){const _0x4d01aa=_0x100070;_0x11a787=String(_0x11a787);if(!_0x11a787)return _0x11a787;if(typeof _0x11a787!==_0x4d01aa(0xdc))return _0x11a787;const _0x32bd38=VisuMZ[_0x4d01aa(0x785)][_0x4d01aa(0x598)][_0x4d01aa(0x1f9)]['DigitGroupingLocale']||_0x4d01aa(0x611),_0x28c97f={'maximumFractionDigits':0x6};_0x11a787=_0x11a787[_0x4d01aa(0x617)](/\[(.*?)\]/g,(_0x47d484,_0x59136a)=>{const _0x356261=_0x4d01aa;return VisuMZ[_0x356261(0x281)](_0x59136a,'[',']');}),_0x11a787=_0x11a787[_0x4d01aa(0x617)](/<(.*?)>/g,(_0x5c5681,_0x36a74d)=>{const _0x329643=_0x4d01aa;return VisuMZ[_0x329643(0x281)](_0x36a74d,'<','>');}),_0x11a787=_0x11a787[_0x4d01aa(0x617)](/\{\{(.*?)\}\}/g,(_0x2ac55a,_0x9a97fe)=>{return VisuMZ['PreserveNumbers'](_0x9a97fe,'','');}),_0x11a787=_0x11a787[_0x4d01aa(0x617)](/(\d+\.?\d*)/g,(_0x5f09ed,_0x4345c7)=>{const _0x1ba02e=_0x4d01aa;let _0x56ad18=_0x4345c7;if(_0x56ad18[0x0]==='0')return _0x56ad18;if(_0x56ad18[_0x56ad18[_0x1ba02e(0x1ba)]-0x1]==='.')return Number(_0x56ad18)[_0x1ba02e(0x15d)](_0x32bd38,_0x28c97f)+'.';else return _0x56ad18[_0x56ad18[_0x1ba02e(0x1ba)]-0x1]===','?Number(_0x56ad18)[_0x1ba02e(0x15d)](_0x32bd38,_0x28c97f)+',':Number(_0x56ad18)['toLocaleString'](_0x32bd38,_0x28c97f);});let _0x3e9000=0x3;while(_0x3e9000--){_0x11a787=VisuMZ[_0x4d01aa(0x326)](_0x11a787);}return _0x11a787;},VisuMZ[_0x100070(0x281)]=function(_0x5427b2,_0x3a61b5,_0x802d71){const _0x1c61c3=_0x100070;return _0x5427b2=_0x5427b2[_0x1c61c3(0x617)](/(\d)/gi,(_0x36cf2d,_0x4ad705)=>_0x1c61c3(0x65e)['format'](Number(_0x4ad705))),_0x1c61c3(0x402)[_0x1c61c3(0x4fd)](_0x5427b2,_0x3a61b5,_0x802d71);},VisuMZ[_0x100070(0x326)]=function(_0x5cebab){const _0x309aed=_0x100070;return _0x5cebab=_0x5cebab[_0x309aed(0x617)](/PRESERVCONVERSION\((\d+)\)/gi,(_0x1715c0,_0x3d6364)=>Number(parseInt(_0x3d6364))),_0x5cebab;},VisuMZ[_0x100070(0x584)]=function(_0x33d20b){const _0x5d4446=_0x100070;SoundManager[_0x5d4446(0x123)]();if(!Utils[_0x5d4446(0x4e4)]()){const _0x29d0bf=window[_0x5d4446(0x4d6)](_0x33d20b,'_blank');}else{const _0x46deb7=process[_0x5d4446(0x6f4)]==_0x5d4446(0x235)?'open':process[_0x5d4446(0x6f4)]==_0x5d4446(0x15c)?'start':'xdg-open';require(_0x5d4446(0xf5))[_0x5d4446(0x43a)](_0x46deb7+'\x20'+_0x33d20b);}},VisuMZ[_0x100070(0x4e9)]=function(_0x40ddfa,_0x36bbef){const _0x56dc81=_0x100070;if(!_0x40ddfa)return'';const _0xb299ae=_0x40ddfa[_0x56dc81(0x432)]||_0x40ddfa['id'];let _0x44c092='';return _0x40ddfa[_0x56dc81(0x6a5)]!==undefined&&_0x40ddfa[_0x56dc81(0x49f)]!==undefined&&(_0x44c092='Actor-%1-%2'['format'](_0xb299ae,_0x36bbef)),_0x40ddfa[_0x56dc81(0x5dc)]!==undefined&&_0x40ddfa[_0x56dc81(0x1df)]!==undefined&&(_0x44c092=_0x56dc81(0x3ca)['format'](_0xb299ae,_0x36bbef)),_0x40ddfa[_0x56dc81(0x287)]!==undefined&&_0x40ddfa[_0x56dc81(0x6fe)]!==undefined&&(_0x44c092=_0x56dc81(0x2d5)['format'](_0xb299ae,_0x36bbef)),_0x40ddfa[_0x56dc81(0x25b)]!==undefined&&_0x40ddfa[_0x56dc81(0x225)]!==undefined&&(_0x44c092=_0x56dc81(0xfe)[_0x56dc81(0x4fd)](_0xb299ae,_0x36bbef)),_0x40ddfa['wtypeId']!==undefined&&_0x40ddfa[_0x56dc81(0x771)]===0x1&&(_0x44c092=_0x56dc81(0x2be)[_0x56dc81(0x4fd)](_0xb299ae,_0x36bbef)),_0x40ddfa[_0x56dc81(0x3ab)]!==undefined&&_0x40ddfa[_0x56dc81(0x771)]>0x1&&(_0x44c092=_0x56dc81(0x739)[_0x56dc81(0x4fd)](_0xb299ae,_0x36bbef)),_0x40ddfa['dropItems']!==undefined&&_0x40ddfa[_0x56dc81(0x80d)]!==undefined&&(_0x44c092=_0x56dc81(0x29b)[_0x56dc81(0x4fd)](_0xb299ae,_0x36bbef)),_0x40ddfa[_0x56dc81(0xd2)]!==undefined&&_0x40ddfa[_0x56dc81(0x833)]!==undefined&&(_0x44c092=_0x56dc81(0x74a)['format'](_0xb299ae,_0x36bbef)),_0x44c092;},Window_Base[_0x100070(0x7ae)][_0x100070(0x41c)]=function(_0x22963e,_0x2f093d){const _0x4dcfd0=_0x100070,_0x5b9c08=ImageManager[_0x4dcfd0(0x2b3)]||0x20,_0x4357e8=ImageManager[_0x4dcfd0(0x446)]||0x20;if(_0x2f093d[_0x4dcfd0(0x4c2)]){const _0x59bb92=_0x5b9c08-ImageManager[_0x4dcfd0(0x288)],_0x687059=_0x4357e8-ImageManager[_0x4dcfd0(0x1bc)];let _0x3c658a=0x2,_0x2d86b3=0x2;this[_0x4dcfd0(0x113)]()!==0x24&&(_0x2d86b3=Math[_0x4dcfd0(0x279)]((this[_0x4dcfd0(0x113)]()-_0x4357e8)/0x2));const _0xd3522=_0x2f093d['x']+Math[_0x4dcfd0(0x279)](_0x59bb92/0x2)+_0x3c658a,_0xaa445e=_0x2f093d['y']+Math[_0x4dcfd0(0x279)](_0x687059/0x2)+_0x2d86b3;this[_0x4dcfd0(0x82c)](_0x22963e,_0xd3522,_0xaa445e);}_0x2f093d['x']+=_0x5b9c08+0x4;},Window_StatusBase[_0x100070(0x7ae)][_0x100070(0x3dd)]=function(_0x36e8bd,_0xf2e2c8,_0x31ecbd,_0x60dfaf){const _0x44fbce=_0x100070;_0x60dfaf=_0x60dfaf||0x90;const _0x299a78=ImageManager[_0x44fbce(0x2b3)]||0x20,_0x1e9ebf=ImageManager[_0x44fbce(0x446)]||0x20,_0x3799a6=_0x299a78-ImageManager[_0x44fbce(0x288)],_0x5a632c=_0x1e9ebf-ImageManager[_0x44fbce(0x1bc)],_0x2a649a=_0x299a78,_0x5b90f0=_0x36e8bd[_0x44fbce(0x3b2)]()['slice'](0x0,Math[_0x44fbce(0x279)](_0x60dfaf/_0x2a649a));let _0xa4e242=_0xf2e2c8+Math['ceil'](_0x3799a6/0x2),_0x401979=_0x31ecbd+Math[_0x44fbce(0x5fd)](_0x5a632c/0x2);for(const _0x2d5523 of _0x5b90f0){this['drawIcon'](_0x2d5523,_0xa4e242,_0x401979),_0xa4e242+=_0x2a649a;}},Game_Picture[_0x100070(0x7ae)][_0x100070(0x844)]=function(){const _0x4a989b=_0x100070;return this[_0x4a989b(0x603)];},VisuMZ[_0x100070(0x785)][_0x100070(0x2ba)]=Game_Picture[_0x100070(0x7ae)]['initBasic'],Game_Picture[_0x100070(0x7ae)][_0x100070(0x1da)]=function(){const _0x578ce1=_0x100070;VisuMZ[_0x578ce1(0x785)][_0x578ce1(0x2ba)][_0x578ce1(0x703)](this),this[_0x578ce1(0x603)]={'x':0x0,'y':0x0},this[_0x578ce1(0x4e7)]={'x':0x0,'y':0x0};},VisuMZ[_0x100070(0x785)][_0x100070(0x25c)]=Game_Picture[_0x100070(0x7ae)][_0x100070(0x5d2)],Game_Picture[_0x100070(0x7ae)][_0x100070(0x5d2)]=function(){const _0x448b1e=_0x100070;this[_0x448b1e(0x7d1)]();const _0x4ad37a=this[_0x448b1e(0x334)];VisuMZ['CoreEngine'][_0x448b1e(0x25c)][_0x448b1e(0x703)](this),_0x4ad37a>0x0&&this[_0x448b1e(0x334)]<=0x0&&(this['_x']=this['_targetX'],this['_y']=this[_0x448b1e(0x784)],this[_0x448b1e(0x7d2)]=this[_0x448b1e(0x2e7)],this[_0x448b1e(0x52d)]=this[_0x448b1e(0x1bd)],this['_opacity']=this['_targetOpacity'],this[_0x448b1e(0x603)]&&(this[_0x448b1e(0x603)]['x']=this[_0x448b1e(0x4e7)]['x'],this[_0x448b1e(0x603)]['y']=this['_targetAnchor']['y']));},VisuMZ[_0x100070(0x785)][_0x100070(0x6f0)]=Game_Picture['prototype'][_0x100070(0x7de)],Game_Picture['prototype'][_0x100070(0x7de)]=function(_0x2c650e,_0x1967cd,_0x4295d3,_0x5c97c1,_0x3ae19d,_0x5aa1e3,_0xdeb6d9,_0xe971b7){const _0x488f65=_0x100070;VisuMZ[_0x488f65(0x785)][_0x488f65(0x6f0)][_0x488f65(0x703)](this,_0x2c650e,_0x1967cd,_0x4295d3,_0x5c97c1,_0x3ae19d,_0x5aa1e3,_0xdeb6d9,_0xe971b7),this[_0x488f65(0x711)]([{'x':0x0,'y':0x0},{'x':0.5,'y':0.5}][_0x1967cd]||{'x':0x0,'y':0x0});},VisuMZ[_0x100070(0x785)][_0x100070(0x717)]=Game_Picture[_0x100070(0x7ae)]['move'],Game_Picture[_0x100070(0x7ae)][_0x100070(0x5c5)]=function(_0x41a648,_0x561b14,_0x2d8a2e,_0x577fbe,_0x35ac38,_0x53c7da,_0x342b14,_0x1965bd,_0x1086f5){const _0x59df50=_0x100070;VisuMZ['CoreEngine'][_0x59df50(0x717)]['call'](this,_0x41a648,_0x561b14,_0x2d8a2e,_0x577fbe,_0x35ac38,_0x53c7da,_0x342b14,_0x1965bd,_0x1086f5),this['setTargetAnchor']([{'x':0x0,'y':0x0},{'x':0.5,'y':0.5}][_0x41a648]||{'x':0x0,'y':0x0});},Game_Picture[_0x100070(0x7ae)][_0x100070(0x7d1)]=function(){const _0x1a909b=_0x100070;this[_0x1a909b(0x334)]>0x0&&(this[_0x1a909b(0x603)]['x']=this[_0x1a909b(0x248)](this[_0x1a909b(0x603)]['x'],this['_targetAnchor']['x']),this[_0x1a909b(0x603)]['y']=this[_0x1a909b(0x248)](this['_anchor']['y'],this[_0x1a909b(0x4e7)]['y']));},Game_Picture[_0x100070(0x7ae)][_0x100070(0x711)]=function(_0x5d0f35){const _0x16c7ee=_0x100070;this[_0x16c7ee(0x603)]=_0x5d0f35,this[_0x16c7ee(0x4e7)]=JsonEx[_0x16c7ee(0x35b)](this[_0x16c7ee(0x603)]);},Game_Picture[_0x100070(0x7ae)]['setTargetAnchor']=function(_0x1b6427){const _0x13ab9e=_0x100070;this[_0x13ab9e(0x4e7)]=_0x1b6427;},VisuMZ['CoreEngine']['Sprite_Picture_updateOrigin']=Sprite_Picture['prototype'][_0x100070(0x3a5)],Sprite_Picture[_0x100070(0x7ae)]['updateOrigin']=function(){const _0xd37124=_0x100070,_0x52e361=this[_0xd37124(0x46d)]();!_0x52e361[_0xd37124(0x844)]()?VisuMZ[_0xd37124(0x785)][_0xd37124(0x7f1)][_0xd37124(0x703)](this):(this[_0xd37124(0x844)]['x']=_0x52e361[_0xd37124(0x844)]()['x'],this[_0xd37124(0x844)]['y']=_0x52e361[_0xd37124(0x844)]()['y']);},Game_Action[_0x100070(0x7ae)][_0x100070(0x1c3)]=function(_0x5efa47){const _0x1e9ce4=_0x100070;if(_0x5efa47){const _0x4c8c6e=_0x5efa47[_0x1e9ce4(0x2c6)];if(_0x4c8c6e===0x1&&this[_0x1e9ce4(0x4df)]()[_0x1e9ce4(0x597)]()!==0x1)this[_0x1e9ce4(0x828)]();else _0x4c8c6e===0x2&&this[_0x1e9ce4(0x4df)]()[_0x1e9ce4(0x26b)]()!==0x2?this[_0x1e9ce4(0xd6)]():this[_0x1e9ce4(0x4b2)](_0x4c8c6e);}else this['clear']();},Game_Actor['prototype']['usableSkills']=function(){const _0x314e53=_0x100070;return this[_0x314e53(0x864)]()[_0x314e53(0x247)](_0x2b1b74=>this[_0x314e53(0x270)](_0x2b1b74)&&this[_0x314e53(0x2f0)]()[_0x314e53(0x4c7)](_0x2b1b74[_0x314e53(0x287)]));},Window_Base[_0x100070(0x7ae)][_0x100070(0x573)]=function(){const _0x4bb4fe=_0x100070;this[_0x4bb4fe(0x6d9)]=new Sprite(),this[_0x4bb4fe(0x6d9)][_0x4bb4fe(0x6ed)]=new Bitmap(0x0,0x0),this[_0x4bb4fe(0x6d9)]['x']=0x0,this[_0x4bb4fe(0x88d)](this[_0x4bb4fe(0x6d9)]);},Window_Base[_0x100070(0x7ae)]['refreshDimmerBitmap']=function(){const _0x415948=_0x100070;if(this[_0x415948(0x6d9)]){const _0x57938a=this[_0x415948(0x6d9)]['bitmap'],_0x126ec0=this['width'],_0x4ae25e=this[_0x415948(0x6c5)],_0x2182ed=this[_0x415948(0x47c)],_0xd9c688=ColorManager[_0x415948(0x524)](),_0x5c8c54=ColorManager[_0x415948(0x4fa)]();_0x57938a[_0x415948(0x836)](_0x126ec0,_0x4ae25e),_0x57938a[_0x415948(0x3a4)](0x0,0x0,_0x126ec0,_0x2182ed,_0x5c8c54,_0xd9c688,!![]),_0x57938a['fillRect'](0x0,_0x2182ed,_0x126ec0,_0x4ae25e-_0x2182ed*0x2,_0xd9c688),_0x57938a['gradientFillRect'](0x0,_0x4ae25e-_0x2182ed,_0x126ec0,_0x2182ed,_0xd9c688,_0x5c8c54,!![]),this[_0x415948(0x6d9)][_0x415948(0x2de)](0x0,0x0,_0x126ec0,_0x4ae25e);}},Game_Actor['prototype'][_0x100070(0x348)]=function(){const _0x1bd7df=_0x100070;for(let _0x5258f9=0x0;_0x5258f9<this[_0x1bd7df(0x746)]();_0x5258f9++){const _0x1af823=this[_0x1bd7df(0x176)]();let _0x23f2ba=Number[_0x1bd7df(0x812)];this['setAction'](_0x5258f9,_0x1af823[0x0]);for(const _0x2a3062 of _0x1af823){const _0xb44ba5=_0x2a3062[_0x1bd7df(0x74b)]();_0xb44ba5>_0x23f2ba&&(_0x23f2ba=_0xb44ba5,this['setAction'](_0x5258f9,_0x2a3062));}}this[_0x1bd7df(0x3cb)](_0x1bd7df(0xb9));},Window_BattleItem['prototype'][_0x100070(0x1b5)]=function(_0x33eb2e){const _0x1ccdba=_0x100070;return BattleManager['actor']()?BattleManager[_0x1ccdba(0x787)]()[_0x1ccdba(0x270)](_0x33eb2e):Window_ItemList[_0x1ccdba(0x7ae)]['isEnabled'][_0x1ccdba(0x703)](this,_0x33eb2e);},VisuMZ[_0x100070(0x785)]['Scene_Map_createSpritesetFix']=Scene_Map[_0x100070(0x7ae)][_0x100070(0x7ad)],Scene_Map['prototype'][_0x100070(0x7ad)]=function(){const _0x15d4b2=_0x100070;VisuMZ[_0x15d4b2(0x785)][_0x15d4b2(0x360)]['call'](this);const _0x169374=this[_0x15d4b2(0x3a3)][_0x15d4b2(0x2e8)];if(_0x169374)this[_0x15d4b2(0x4c1)](_0x169374);},VisuMZ[_0x100070(0x785)][_0x100070(0x526)]=Scene_Battle[_0x100070(0x7ae)]['createSpriteset'],Scene_Battle[_0x100070(0x7ae)][_0x100070(0x7ad)]=function(){const _0x4625e8=_0x100070;VisuMZ[_0x4625e8(0x785)][_0x4625e8(0x526)][_0x4625e8(0x703)](this);const _0x59762c=this[_0x4625e8(0x3a3)][_0x4625e8(0x2e8)];if(_0x59762c)this['addChild'](_0x59762c);},Sprite_Actor[_0x100070(0x7ae)][_0x100070(0x723)]=function(){const _0x4f7cc2=_0x100070;Sprite_Battler[_0x4f7cc2(0x7ae)][_0x4f7cc2(0x723)][_0x4f7cc2(0x703)](this),this[_0x4f7cc2(0x497)]();if(this[_0x4f7cc2(0x32e)])this[_0x4f7cc2(0x316)]();else this['_battlerName']!==''&&(this[_0x4f7cc2(0x6a8)]='');},Window['prototype'][_0x100070(0x786)]=function(){const _0x481b2f=_0x100070,_0x6e2814=this[_0x481b2f(0x2ce)],_0x4fa550=this[_0x481b2f(0x618)],_0x4b9b22=0x18,_0x3ba3f5=_0x4b9b22/0x2,_0x4b1b4c=0x60+_0x4b9b22,_0x1c67e0=0x0+_0x4b9b22;this['_downArrowSprite'][_0x481b2f(0x6ed)]=this['_windowskin'],this[_0x481b2f(0x714)][_0x481b2f(0x844)]['x']=0.5,this[_0x481b2f(0x714)][_0x481b2f(0x844)]['y']=0.5,this[_0x481b2f(0x714)]['setFrame'](_0x4b1b4c+_0x3ba3f5,_0x1c67e0+_0x3ba3f5+_0x4b9b22,_0x4b9b22,_0x3ba3f5),this[_0x481b2f(0x714)]['move'](Math[_0x481b2f(0x884)](_0x6e2814/0x2),Math[_0x481b2f(0x884)](_0x4fa550-_0x3ba3f5)),this[_0x481b2f(0x3c1)][_0x481b2f(0x6ed)]=this[_0x481b2f(0x239)],this['_upArrowSprite'][_0x481b2f(0x844)]['x']=0.5,this[_0x481b2f(0x3c1)][_0x481b2f(0x844)]['y']=0.5,this[_0x481b2f(0x3c1)][_0x481b2f(0x2de)](_0x4b1b4c+_0x3ba3f5,_0x1c67e0,_0x4b9b22,_0x3ba3f5),this[_0x481b2f(0x3c1)][_0x481b2f(0x5c5)](Math[_0x481b2f(0x884)](_0x6e2814/0x2),Math[_0x481b2f(0x884)](_0x3ba3f5));},Window[_0x100070(0x7ae)][_0x100070(0x5ac)]=function(){const _0x47b86b=_0x100070,_0xeae0fc=0x90,_0x15005b=0x60,_0x12ec59=0x18;this[_0x47b86b(0x2cc)][_0x47b86b(0x6ed)]=this['_windowskin'],this[_0x47b86b(0x2cc)]['anchor']['x']=0.5,this[_0x47b86b(0x2cc)][_0x47b86b(0x844)]['y']=0x1,this[_0x47b86b(0x2cc)][_0x47b86b(0x5c5)](Math['round'](this['_width']/0x2),this[_0x47b86b(0x618)]),this[_0x47b86b(0x2cc)][_0x47b86b(0x2de)](_0xeae0fc,_0x15005b,_0x12ec59,_0x12ec59),this['_pauseSignSprite'][_0x47b86b(0x38e)]=0xff;},Window[_0x100070(0x7ae)][_0x100070(0x893)]=function(){const _0x16c774=_0x100070,_0x5efd47=this[_0x16c774(0x4d3)][_0x16c774(0x509)][_0x16c774(0x222)](new Point(0x0,0x0)),_0x33aeb1=this[_0x16c774(0x4d3)][_0x16c774(0x381)];_0x33aeb1['x']=_0x5efd47['x']+this[_0x16c774(0x6e8)]['x'],_0x33aeb1['y']=_0x5efd47['y']+this[_0x16c774(0x6e8)]['y'],_0x33aeb1[_0x16c774(0x1ed)]=Math[_0x16c774(0x5fd)](this['innerWidth']*this[_0x16c774(0x2e5)]['x']),_0x33aeb1['height']=Math['ceil'](this[_0x16c774(0x3f2)]*this[_0x16c774(0x2e5)]['y']);},VisuMZ[_0x100070(0x785)]['Window_refreshBack']=Window['prototype'][_0x100070(0x770)],Window[_0x100070(0x7ae)][_0x100070(0x770)]=function(){const _0x5a3cd3=_0x100070,_0x4d66b8=VisuMZ[_0x5a3cd3(0x785)][_0x5a3cd3(0x598)][_0x5a3cd3(0x775)][_0x5a3cd3(0x45c)]??!![];if(!_0x4d66b8)return VisuMZ[_0x5a3cd3(0x785)]['Window_refreshBack'][_0x5a3cd3(0x703)](this);const _0x5194ec=this['_margin'],_0x12ce80=Math[_0x5a3cd3(0x23f)](0x0,this[_0x5a3cd3(0x2ce)]-_0x5194ec*0x2),_0x268767=Math[_0x5a3cd3(0x23f)](0x0,this[_0x5a3cd3(0x618)]-_0x5194ec*0x2),_0x249176=this[_0x5a3cd3(0x81e)],_0x29d3cb=_0x249176[_0x5a3cd3(0x149)][0x0];_0x249176[_0x5a3cd3(0x6ed)]=this[_0x5a3cd3(0x239)],_0x249176[_0x5a3cd3(0x2de)](0x0,0x0,0x60,0x60),_0x249176['move'](_0x5194ec,_0x5194ec),_0x249176[_0x5a3cd3(0x2e5)]['x']=_0x12ce80/0x60,_0x249176[_0x5a3cd3(0x2e5)]['y']=_0x268767/0x60,_0x29d3cb['bitmap']=this['_windowskin'],_0x29d3cb[_0x5a3cd3(0x2de)](0x0,0x60,0x60,0x60),_0x29d3cb[_0x5a3cd3(0x5c5)](0x0,0x0,_0x12ce80,_0x268767),_0x29d3cb[_0x5a3cd3(0x2e5)]['x']=0x1/_0x249176[_0x5a3cd3(0x2e5)]['x'],_0x29d3cb['scale']['y']=0x1/_0x249176['scale']['y'],_0x249176[_0x5a3cd3(0x757)](this['_colorTone']);},Game_Temp[_0x100070(0x7ae)]['sceneTerminationClearEffects']=function(){const _0x2d9044=_0x100070;this[_0x2d9044(0x562)]=[],this[_0x2d9044(0x4a7)]=[],this[_0x2d9044(0x4d8)]=[],this[_0x2d9044(0x19f)]=[];},VisuMZ[_0x100070(0x785)][_0x100070(0x23a)]=Scene_Base[_0x100070(0x7ae)][_0x100070(0x697)],Scene_Base['prototype']['terminate']=function(){const _0x3d16ce=_0x100070;if($gameTemp)$gameTemp[_0x3d16ce(0x2f8)]();VisuMZ[_0x3d16ce(0x785)][_0x3d16ce(0x23a)][_0x3d16ce(0x703)](this);},Bitmap[_0x100070(0x7ae)][_0x100070(0x765)]=function(_0x1b380f){const _0x4a3164=_0x100070,_0x46ec8d=this[_0x4a3164(0x3de)];_0x46ec8d['save'](),_0x46ec8d['font']=this[_0x4a3164(0x84b)]();const _0x2d359d=_0x46ec8d['measureText'](_0x1b380f)[_0x4a3164(0x1ed)];return _0x46ec8d['restore'](),_0x2d359d;},Window_Message[_0x100070(0x7ae)][_0x100070(0x21b)]=function(_0x12f73f){const _0x1c3e5e=_0x100070;return this['useFontWidthFix']()?this[_0x1c3e5e(0x41b)][_0x1c3e5e(0x765)](_0x12f73f):Window_Base[_0x1c3e5e(0x7ae)][_0x1c3e5e(0x21b)]['call'](this,_0x12f73f);},Window_Message['prototype'][_0x100070(0x1de)]=function(){const _0x5650f9=_0x100070;return VisuMZ['CoreEngine'][_0x5650f9(0x598)]['QoL']['FontWidthFix']??!![];},VisuMZ['CoreEngine'][_0x100070(0x57d)]=Game_Action[_0x100070(0x7ae)][_0x100070(0x2e3)],Game_Action[_0x100070(0x7ae)]['numRepeats']=function(){const _0x36c233=_0x100070;return this[_0x36c233(0x6e2)]()?VisuMZ['CoreEngine'][_0x36c233(0x57d)]['call'](this):0x0;},VisuMZ[_0x100070(0x785)]['Game_Action_setAttack']=Game_Action[_0x100070(0x7ae)][_0x100070(0x828)],Game_Action[_0x100070(0x7ae)]['setAttack']=function(){const _0x55e217=_0x100070;if(this[_0x55e217(0x4df)]()&&this[_0x55e217(0x4df)]()[_0x55e217(0x10b)]())VisuMZ[_0x55e217(0x785)][_0x55e217(0x140)]['call'](this);else BattleManager[_0x55e217(0x169)]?VisuMZ[_0x55e217(0x785)][_0x55e217(0x140)][_0x55e217(0x703)](this):this['clear']();},VisuMZ[_0x100070(0x785)]['BattleManager_invokeCounterAttack']=BattleManager[_0x100070(0x22b)],BattleManager[_0x100070(0x22b)]=function(_0x1774cd,_0x362293){const _0x5cfe47=_0x100070;this['_bypassCanCounterCheck']=!![],VisuMZ['CoreEngine'][_0x5cfe47(0x10e)]['call'](this,_0x1774cd,_0x362293),this[_0x5cfe47(0x169)]=undefined;},Sprite_Name['prototype'][_0x100070(0x5d9)]=function(){return 0x24;},Sprite_Name['prototype'][_0x100070(0x296)]=function(){const _0x4d12f4=_0x100070,_0x9e571=this[_0x4d12f4(0x554)](),_0x3a8957=this[_0x4d12f4(0x798)](),_0x29947f=this['bitmapHeight']();this[_0x4d12f4(0x1a1)](),this[_0x4d12f4(0x6ed)][_0x4d12f4(0x85d)](),this['bitmap'][_0x4d12f4(0x4db)](_0x9e571,0x4,0x0,_0x3a8957-0xa,_0x29947f,_0x4d12f4(0xbf));},Bitmap[_0x100070(0x7ae)][_0x100070(0x4db)]=function(_0x5e58a6,_0x8a3341,_0x1042b8,_0x3ac557,_0x280cc1,_0x2db78d){const _0x5d336b=_0x100070,_0x13e8db=this[_0x5d336b(0x3de)],_0x259008=_0x13e8db['globalAlpha'];_0x3ac557=_0x3ac557||0xffffffff;let _0x1df5b7=_0x8a3341,_0x172139=Math[_0x5d336b(0x884)](_0x1042b8+0x18/0x2+this[_0x5d336b(0xb8)]*0.35);_0x2db78d==='center'&&(_0x1df5b7+=_0x3ac557/0x2),_0x2db78d===_0x5d336b(0x12e)&&(_0x1df5b7+=_0x3ac557),_0x13e8db['save'](),_0x13e8db[_0x5d336b(0x658)]=this['_makeFontNameText'](),_0x13e8db[_0x5d336b(0x358)]=_0x2db78d,_0x13e8db['textBaseline']=_0x5d336b(0x624),_0x13e8db['globalAlpha']=0x1,this[_0x5d336b(0x7ee)](_0x5e58a6,_0x1df5b7,_0x172139,_0x3ac557),_0x13e8db[_0x5d336b(0x67b)]=_0x259008,this[_0x5d336b(0x490)](_0x5e58a6,_0x1df5b7,_0x172139,_0x3ac557),_0x13e8db[_0x5d336b(0x5be)](),this[_0x5d336b(0x78c)]['update']();},VisuMZ[_0x100070(0x785)]['BattleManager_checkSubstitute']=BattleManager['checkSubstitute'],BattleManager[_0x100070(0x570)]=function(_0x59b2ce){const _0x1c4b56=_0x100070;if(this[_0x1c4b56(0x357)]&&this[_0x1c4b56(0x357)][_0x1c4b56(0x51e)]()===_0x59b2ce[_0x1c4b56(0x51e)]())return![];return VisuMZ[_0x1c4b56(0x785)]['BattleManager_checkSubstitute']['call'](this,_0x59b2ce);},BattleManager[_0x100070(0x575)]=function(){const _0x27c3ef=_0x100070;if(this[_0x27c3ef(0x357)])this[_0x27c3ef(0x121)][_0x27c3ef(0x575)](this[_0x27c3ef(0x357)]);this['_phase']=_0x27c3ef(0x7d0),this[_0x27c3ef(0x357)]&&this[_0x27c3ef(0x357)][_0x27c3ef(0x746)]()===0x0&&(this[_0x27c3ef(0x69b)](this[_0x27c3ef(0x357)]),this['_subject']=null);},Bitmap[_0x100070(0x7ae)][_0x100070(0xc3)]=function(){const _0x4cb48a=_0x100070;this[_0x4cb48a(0x4dd)]=new Image(),this[_0x4cb48a(0x4dd)]['onload']=this['_onLoad'][_0x4cb48a(0x4b0)](this),this[_0x4cb48a(0x4dd)][_0x4cb48a(0x565)]=this[_0x4cb48a(0x238)][_0x4cb48a(0x4b0)](this),this[_0x4cb48a(0x4a2)](),this[_0x4cb48a(0x39c)]='loading',Utils[_0x4cb48a(0x7bc)]()?this[_0x4cb48a(0x84e)]():(this[_0x4cb48a(0x4dd)][_0x4cb48a(0x895)]=this['_url'],![]&&this[_0x4cb48a(0x4dd)]['width']>0x0&&(this[_0x4cb48a(0x4dd)][_0x4cb48a(0x435)]=null,this[_0x4cb48a(0x349)]()));},Scene_Skill[_0x100070(0x7ae)][_0x100070(0x769)]=function(){const _0x2fb376=_0x100070;Scene_MenuBase[_0x2fb376(0x7ae)][_0x2fb376(0x769)][_0x2fb376(0x703)](this),this[_0x2fb376(0x64f)](),this['_itemWindow']['deactivate'](),this[_0x2fb376(0x695)][_0x2fb376(0x87b)](),this[_0x2fb376(0x647)][_0x2fb376(0x384)]();},Scene_Skill['prototype']['arePageButtonsEnabled']=function(){const _0x13740a=_0x100070;return this[_0x13740a(0x647)]&&this[_0x13740a(0x647)][_0x13740a(0x66d)];},Game_Map[_0x100070(0x7ae)][_0x100070(0x2c4)]=function(_0x4d248f,_0x1df6d7,_0x35601e){const _0x10fbb9=_0x100070,_0x541291=this[_0x10fbb9(0x6a4)](),_0x3ca704=this[_0x10fbb9(0x5bd)](_0x4d248f,_0x1df6d7);for(const _0x2ce9f3 of _0x3ca704){const _0x52f2a1=_0x541291[_0x2ce9f3];if(_0x52f2a1===undefined||_0x52f2a1===null){if($gameTemp[_0x10fbb9(0x16d)]()&&!DataManager[_0x10fbb9(0x49c)]()){let _0x4fa6c4=_0x10fbb9(0x71b)+'\x0a';_0x4fa6c4+=_0x10fbb9(0x71c)+'\x0a',_0x4fa6c4+=_0x10fbb9(0x694);if(this[_0x10fbb9(0x2bf)]())alert(_0x4fa6c4),SceneManager[_0x10fbb9(0x2f9)]();else{if(!this[_0x10fbb9(0x478)])console[_0x10fbb9(0x4ce)](_0x4fa6c4);this[_0x10fbb9(0x478)]=!![];}}}if((_0x52f2a1&0x10)!==0x0)continue;if((_0x52f2a1&_0x35601e)===0x0)return!![];if((_0x52f2a1&_0x35601e)===_0x35601e)return![];}return![];},Game_Map[_0x100070(0x7ae)]['showIncompleteTilesetError']=function(){const _0x3214c8=_0x100070;if(Imported['VisuMZ_3_EventChainReact'])return!![];if(Imported[_0x3214c8(0x2aa)])return!![];return![];},Sprite_Animation[_0x100070(0x7ae)][_0x100070(0x5c9)]=function(_0x3477c0){const _0x2df3a5=_0x100070;!this['_originalViewport']&&(this[_0x2df3a5(0x1ea)]=_0x3477c0['gl']['getParameter'](_0x3477c0['gl'][_0x2df3a5(0x1b0)]));},VisuMZ[_0x100070(0x785)]['Scene_Map_shouldAutosave']=Scene_Map[_0x100070(0x7ae)][_0x100070(0x608)],Scene_Map['prototype']['shouldAutosave']=function(){const _0x166def=_0x100070,_0x15bd83=SceneManager[_0x166def(0x673)]['name'];if(['Scene_Title',_0x166def(0x204),'Scene_TitleTransition',_0x166def(0x63f)][_0x166def(0x4c7)](_0x15bd83))return![];return VisuMZ[_0x166def(0x785)][_0x166def(0x738)][_0x166def(0x703)](this);},VisuMZ[_0x100070(0x785)][_0x100070(0x623)]=Window_SkillList[_0x100070(0x7ae)]['includes'],Window_SkillList[_0x100070(0x7ae)]['includes']=function(_0x3d6631){const _0x21274d=_0x100070;if(this[_0x21274d(0x7aa)]<=0x0)return![];return VisuMZ[_0x21274d(0x785)][_0x21274d(0x623)]['call'](this,_0x3d6631);},VisuMZ[_0x100070(0x785)][_0x100070(0x2ea)]=Game_Battler[_0x100070(0x7ae)]['initTpbChargeTime'],Game_Battler[_0x100070(0x7ae)]['initTpbChargeTime']=function(_0x1221fb){const _0x164ba8=_0x100070;VisuMZ[_0x164ba8(0x785)][_0x164ba8(0x2ea)]['call'](this,_0x1221fb),isNaN(this['_tpbChargeTime'])&&(VisuMZ['CoreEngine'][_0x164ba8(0x2ea)][_0x164ba8(0x703)](this,_0x1221fb),isNaN(this['_tpbChargeTime'])&&(this['_tpbChargeTime']=0x0));},Game_Battler[_0x100070(0x7ae)]['updateTpbChargeTime']=function(){const _0x4084fe=_0x100070;this[_0x4084fe(0x704)]===_0x4084fe(0x396)&&(this[_0x4084fe(0x7dd)]+=this[_0x4084fe(0x183)](),isNaN(this[_0x4084fe(0x7dd)])&&(this['_tpbChargeTime']=this[_0x4084fe(0x183)](),isNaN(this[_0x4084fe(0x7dd)])&&(this[_0x4084fe(0x7dd)]=0x0)),this[_0x4084fe(0x7dd)]>=0x1&&(this[_0x4084fe(0x7dd)]=0x1,this[_0x4084fe(0x28f)]()));};