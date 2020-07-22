# Audio File Placement
Place audio tracks in the /audio/ folder. Tracks should be in a folder named according to their placement on the album array in the JSON document (/0/ for first array, /1/ for second, etc...).<br />
the only file required in your audio adventure folder is a "casette.jpg".

# JSON Formatting

## Albums
The follow code is the template for albums:
```
{
    "name":"ALBUM NAME",
    "img":"ALBUM_IMAGE.jpg",
    "notFoundTrack":"404TrackName.mp3",
    "inventoryItems": [],
    "tracks":[{}]
},
```

## Tracks
To ensure indexes sync up with track numbers, the first item in the track array should always be a black object ({}).<br />
The following code is the template for track objects within the track array within the album object:
```
{
    "source": "TrackFile.mp3",
    "name": "TRACK NAME",
    "endTime": INT WERE TRACK ENDS AND INSTRUCTION BEGINS,
    "f": INDEX OF F TRACK,
    "j": INDEX OF J TRACK,
    "key": null,
    "door": null,
    "doorDestination": null,
    "altTrack": null,
    "altEnd": null
},
```

## Inventory
Within the album object is an array called 'inventoryItems'. Fill this array with strings representing each variable you want the user's inventory to contain.<br /><br />Example:
```
inventoryItems: ["rabbit", "potato", "gem"]
```
These variables can now be referenced within tracks through the key and door traits.

## Keys
The key trait requires an int that references the inventoryItems array.<br /><br />Using the inventoryItems example above, the below example would make it so hitting the action button on the specific track increases the gem counter in the user's inventory (gem having the index of 2 in the inventoryItems array):
```
"key":2
```
Only one key can be applied to a track, and each key can only be applied to a user's inventory once per track. If you don't want a track to have a key, the key trait should be given the value of null.

## Alt Tracks
If you want the track to play a different audio file after returning having already claimed the track's key, use the 'altTrack' and 'altEnd' traits to define the audio file and its end time.

## Doors
The purpose of key variables is to unlock doors. To set a track to require a key to advance to a hidden track, set the door trait to an array. The first value of the array defines what variable you're looking for (in reference to the inventoryItems array), and the second value should be how many of that key are required to unlock the door. The 'doorDestination' trait defines what track unlocking the door would take you to.<br /><br />The following example requires 3 gems, and would take the user to track 7 upon hitting the action door with the necessary gems in inventory:
```
"door": [2,3],
"doorDestination": 7
```