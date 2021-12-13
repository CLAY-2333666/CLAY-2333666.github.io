// Custom game settings (lobby settings + workshop script) can only be imported 
// if their language matches the text language of the game.
// Only the English settings are needed, as OverPy can translate them to all other languages.
const BASE_SETTINGS = `settings
{




}`;

// Used in case the user chooses to not generate the full gamemode settings.
const CONVERTED_MIDI_VARS = `variables
{

}`;


// Coordinates of player and bot spawns, 
// as well as directions for all 64 keys on the two pianos in Paris (point A and point B)
const PIANO_POSITION_SCRIPTS = {
}

// Various scripts corresponding to the options on the converter webpage
const SCRIPTS = {
    restrictAbilities: "Disallow Button(Event Player, Button(Melee));Set Ability 1 Enabled(Event Player, False);Set Ability 2 Enabled(Event Player, False);Set Ultimate Ability Enabled(Event Player, False);If(Compare(Event Player, !=, Host Player));Set Primary Fire Enabled(Event Player, False);Set Secondary Fire Enabled(Event Player, False);End;If(Compare(Hero Of(Event Player), ==, Hero(Wrecking Ball)));Disallow Button(Event Player, Button(Crouch));End;",
    invisibleBots: "Set Invisible(Event Player, All);",
    restrictSlots: "Max Team 1 Players: 12",
    includeBanSystem: 'rule("Bans for host player"){event{Ongoing - Global;}conditions{Is Button Held(Host Player, Button(Reload)) == True;Is Button Held(Host Player, Button(Crouch)) == True;}actions{Host Player.playerToRemove = Ray Cast Hit Player(Eye Position(Host Player), Eye Position(Host Player) + Facing Direction Of(Host Player) * 30, Filtered Array(All Players(All Teams), !Is Dummy Bot(Current Array Element)), Host Player, True);Teleport(Host Player.playerToRemove, Global.banTpLocation);Set Status(Host Player.playerToRemove, Null, Frozen, 30);Host Player.playerToRemove = Null;}}'
}
