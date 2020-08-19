# Where To Put Files

Albums go in their own folder within the /audio/ folder.

# Editing playlist.json

Once the album folder is created, it needs to be added in playlist.json for the engine to find it.<br>
Add another object to the albums array in playlist.json with the following properties:
```json
{
    "name":"ALBUM_NAME",
    "img":"cover.jpg",
    "folder":"foldername",
    "blurb":"short description of adventure for homepage.",
    "credits":{
        "writer":["WRITER_NAME", null],
        "art": ["COVER_ARTIST_NAME", "http://www.google2.com/"],
        "va": [
            ["VOICE_ACTOR_NAME",null],
            ["ANOTHER_VOICE_ACTOR","http://www.google.com/"]
        ]
    }
}
```
## Cover Image

The album's cover image should be in the album's folder.

## Credits Format

Each credit is formatted as an array with two index. The first index should be the name of the person, the second should be their website. If the artist doesn't have a website, the index for websites should be null.

# Configuring album's info.json

Within every album's folder should be a file named info.json. This file has two main parts: inventory and tracks. It should adhere to the follow structure:
```json
{
    "inventoryItems": [],
    "tracks":[]
}
```

## Configuring Items

Items are a useful tool in creating adventures. Each item should have the following structrue:

```json
    "inventoryItems": [
        {
            "itemName":"ITEM_NAME",
            "maxAmt": 2,
            "autoDoor":{
                "keysNeededForAutoDoor":2,
                "autoDoorLocation":9
            }
        }
    ],
```
**itemName** is the name of the item.<br>
**maxAmt** is the max amount of the item the player can get. If there is no maxAmt, set this to null.<br>
**autoDoor** is when you want the user to be automatically transported to a track after collecting a certain amount of this item. If you don't want this effect to occur, set autoDoor to null.

## Configuring Tracks

The tracks array should always have an empty object as index 0, so the track numbers line up with their placement in the array. After index 0, each object within the track array should have the following properties:
```json
"tracks":[{},
        {
            "source": "AUDIO_FILE_NAME.mp3",
            "name": "TRACK NAME",
            "endTime": 9,
            "f": 2,
            "j": 3,
            "key": null,
            "door": null,
            "invCheck": null,
            "altTrack": null,
            "randomJump": null
        }
]
```
**source** is the location of the audio file associated with track within the album's folder.<br>
**name** is the track name.<br>
**endTime** is the timecode within the audio file when the audio portion ends, and the option voice over begins.<br>
**f** and **j** are the indexes of the tapes presented by their respective options.

## key property
If not null, the key property should contain an object like the following:
```json
"key": {
    "keyIndex":0,
    "overlaySound":null
}
```
**keyIndex** defines what key is associated with this track. it's an int that points to the index of the key within the inventoryItems array.<br>
**overlaySound** is an optional property that allows the user to play a sound over the track already playing when a key is on the track and not yet claimed. The overlaySound turns off after the action button is pressed. If not null, this property should be a string that names the sound's file within the album's folder. (ie: "track2overlay.mp3")

## door property

Doors are for when you want the user to be able to go to a new track upon hitting the action button, typically with the condition that they have a required key. Doors follow the following format:
```json
"door": {
    "objectRequired":0,
    "numberRequired":1,
    "doorDestination": 4
}
```
**objectRequired** references the index of the required key within the inventoryItems array.<br>
**numberRequired** is the amount of that key is required to open the door.<br>
**doorDestination** is the tape index that opening the door while take you to.

## invCheck property

invCheck is a property that when set to something besides null, checks certain conditions within your inventory. if the conditions are met, this track plays it's altTrack (see next section) instead of the main audio file. invCheck should following this format:

```json
"invCheck": {
    "itemRequired":0,
    "numberRequired":1
},
```
**itemRequired** references the index of the required key within the inventoryItems array.<br>
**numberRequired** is the amount of that key is required to trigger the altTrack.


## altTrack property
altTrack is a track alternative to the main track indicated by the source property. This track is played under certain conditions, such as when returning to the track after a key has been claimed, or the invCheck condition has been met. This property should have the following:
```json
"altTrack": {
    "source":"track4alt.mp3",
    "endTime": 5
}
```
**source** is the location of the audio file in the album's folder.<br>
**endTime** is the timecode within the audio file when the audio portion ends, and the option voice over begins.

## randomJump property
randomJump is a property that allows the tape to randomly jump to a portion of the track. If not null, this should be that int of whatever time you want the tape to jump to when trigged.<br>
randomJump can only be triggered after 3 seconds of the beginning of the track and before the timestamp indicated by the randomJump property.