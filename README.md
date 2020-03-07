# Overwatch MIDI converter
A tool for converting MIDI files into Overwatch workshop arrays, allowing you to play them ingame [with this gamemode.](https://workshop.elohell.gg/UyppVEAxuslMuna/Overwatch+MIDI+Pianist/)  
All Overwatch text languages are supported. (See [Known issues](#known-issues) for a note about Japanese and Chinese)  

If you have any feedback, bug reports, or if you just want to say hello, you can contact me on Discord: ScroogeD#5147

# MIDI converter webpage
[Click here!](https://scrooged2.github.io/owmidiconverter/converter)

# Features

- Play up to a few minutes of any MIDI file
- Simultaneously play up to 11 pitches
- Percussion instruments are automatically ignored
- Notes outside the range of the Overwatch piano are automatically transposed up or down
- [Loops (experimental)](#loops-experimental)

# How to use
- Open the [MIDI converter webpage.](https://scrooged2.github.io/owmidiconverter/converter)
- Upload a MIDI (.mid) file to the webpage, choose your settings (hover over the texts and read the tooltips for more information), and click Convert MIDI.
  - Make sure to select a language that matches the text language of your Overwatch. If you don't, the generated script can't be pasted into the game.
  - If you get a warning about a type 0 file, keep in mind that percussion may still exist in the converted data, causing the bots to play wrong notes. See [#1](https://github.com/ScroogeD2/owmidiconverter/issues/1) for more information.

If all goes well, you will get some info about the conversion, and a long string containing the custom game settings of the mode. Copy the string by pressing Copy to Clipboard, then open the Overwatch custom game settings screen.![gameSettingsImage](https://i.imgur.com/OqkaGqe.png)  

- Click on *Import Settings* to paste in the copied overwatch custom game settings. In case of an error, check what type it is:
  - **Error popup with "Error: Custom game settings too large":** A workshop rule is too large. This can be fixed by setting a lower value to Max Array Elements.
  - **Error in chat with "Error: Script too large":** Total element count is too large. To fix this, you must select a smaller time range with Start At and Stop At. 
  - **Other:** Make sure that the text language of Overwatch and the language selected in the MIDI converter match. If your text language is Japanese (日本語) or Chinese (简体中文), [read this.](#known-issues)
- Start the custom game.


# Ingame controls

- Interact (F): start and stop playing the song

You can control the speed at which the song is played:
- Crouch + Primary Fire: Speed up by 5 %-points
- Crouch + Secondary Fire: Slow down by 5 %-points  

Note: the minimum time between two notes/chords is 0.064 seconds. If there are delays smaller than that, they are increased to 0.064s. Additionally, a negative speed value will make delays between *all* chords 0.064s.

You can easily remove all game sounds except the piano:
- **Host player only:** Open the custom game lobby with L, then enter the custom game settings screen. (Optional: if you also want to see the bots playing, you can hide your HUD with Alt+Z)
- **Any player:** Open the custom game lobby with L. Right click your player icon on the top right corner of the screen, and press Career Profile. (Optional: hide HUD with Alt+Z. Note that Esc -> Career profile also works, but doesn't allow you to hide your HUD.)


# Known issues

### Import issues with Japanese (日本語) and Chinese (简体中文)
(Note: Taiwanese Mandarin (繁體中文) works as intended.)  

Due to certain localization bugs, the full gamemode settings generated by the converter can't be imported to Japanese or Chinese Overwatch. As a workaround:
  - Import one of these codes:
    - Live: 9T3BT
    - PTR: 1ENTD
  - In the MIDI converter, uncheck "Generate Full Gamemode Settings"
  - Choose the language that matches the text language of your Overwatch, then click Convert MIDI and then copy + paste the generated script to the workshop screen: https://i.imgur.com/Dfkc0gk.png
  - Start the game.

### Other issues
See [issues on Github.](https://github.com/ScroogeD2/owmidiconverter/issues)  


# Workshop array structure

The data read by the Overwatch workshop contains pitches and timings of notes in multiple arrays. One chord in an array can have between 1 and 11 pitches, and consists of the following elements:

```
array[i] = Vector(Time, Pitches, Z)
array[i+1] = pitch1
array[i+2] = pitch2
array[i+3] = pitch3
array[i+4] = pitch4
...
array[i+N] = pitchN
```

In the vector element of each chord, Time is the time interval between the current chord and the previous chord, and Pitches is the amount of voices in the current chord.

The Z component of the vector is used for loop information: see [Loops](#loops-experimental)

The elements following the vector are the pitches in the chord. Similar to the pitches of MIDI files, one integer is one semitone. The scale starts at 0 (C1) and ends at 63 (E6). For example, C4 (262hz) has a pitch of 36.

Each array has its own rule. At the end of each rule, the array is saved in its own index of the SongData array: SongData = [array0, array1, array2, ...]. The maximum amount of voices needed in any chord is saved in the first element of the first array.

### EXAMPLE
The following array contains a song that plays the note G4 at time 0, followed by a C minor chord (C5, Eb5, G5) at time 0.5, followed by another G4 note at time 2.0. The maximum amount of voices needed is 3, which is saved as the first element of the whole array:

```
tempArray = []
tempArray.append(3)
tempArray.append(Vector(0, 1, 0))
tempArray.append(43)
tempArray.append(Vector(0.5, 3, 0))
tempArray.append(48)
tempArray.append(51)
tempArray.append(55)
tempArray.append(Vector(1.5, 1, 0))
tempArray.append(43)
SongData[0] = tempArray
```

The array above as a workshop script would be:

```
rule("Song Data")
{
	event
	{
		Ongoing - Global;
	}

	actions
	{
		Set Global Variable(tempArray, Empty Array);
		Modify Global Variable(tempArray, Append To Array, 3);
		Modify Global Variable(tempArray, Append To Array, Vector(0, 1, 3));
		Modify Global Variable(tempArray, Append To Array, 43);
		Modify Global Variable(tempArray, Append To Array, Vector(0.5, 3, 0));
		Modify Global Variable(tempArray, Append To Array, 48);
		Modify Global Variable(tempArray, Append To Array, 51);
		Modify Global Variable(tempArray, Append To Array, 55);
		Modify Global Variable(tempArray, Append To Array, Vector(1.5, 1, 0));
		Modify Global Variable(tempArray, Append To Array, 43);
		Set Global Variable At Index(songData, 0, Global Variable(tempArray));
	}
}
```

# Loops (experimental)
Loops are an experimental feature and not currently supported by the converter webpage. They must be added *manually*.

To add a loop, first convert your MIDI file with the converter page, paste it into Overwatch and copy it from Overwatch. This gives you the workshop rules in a more readable format.

Loop information is saved in the Z component of each chord vector (see array structure above). It is read when the song is being played, and can have the following values:
```
Z = 2:  
    Set a loop point.  
Z = 3:  
    Go back to the set loop point. Continue the song normally when this chord is passed again, i.e. loop only once.  
Z = 4:  
    Enter an infinite loop between this chord and the set loop point.  
```
Edit the arrays in the locations where you want to set loops, and paste the song arrays back into Overwatch when you're done.


# Special thanks
(In no particular order)
- Mark Benis, for [the best transcriptions of Pokemon Red/Blue music I've seen](https://youtu.be/2WG9V6C1Aew), which allowed me to test the limits of the workshop script
- LazyLion and Zezombye, for help with optimizing and debugging
- Zezombye's OverPy, for its comprehensive language docs
- The workshop team at Blizzard, for being awesome in general
