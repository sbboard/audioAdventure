# Audio Placement
Place audio tracks in the /audio/ folder. Tracks should be in a folder named according to their placement in the album array in the JSON document (/0/ for first array, /1/ for second, etc...).

# JSON Formatting

## Albums
The follow code is the template for albums:
```
{
            "name":"ALBUM NAME",
            "img":"ALBUM IMAGE LOCATION",
            "notFoundTrack":"404 TRACK NAME (include filetype)",
            "inventoryItems": [],
            "tracks":[{}]
        },
```

## Tracks
To make indexes sync up with track numbers, the first item in the track array should always be a black object ({}). 
The following code is the template for objects in the track array within the album object:
```
                {
                    "source": "TRACK FILE",
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
Within the album object is an array called 'inventoryItems'. Fill this array with strings representing each variable you want the user's inventory to contain. Example:
```
inventoryItems: ["rabbit", "potato", "gem"]
```
These variables can now be referenced within tracks through the key and door traits.

### key
The key trait requires just an int that references the inventoryItems array. Using the inventoryItems above, the below example would make it so hitting the action button on the track adds a gem to the user's inventory:
```
"key":2
```
Only one key can be applied to a track, and each key can only be applied to a user's inventory once per track. If you don't want a track to have a key, the key trait should be given the value of null.
if you want the track to play a different audio file after returning while already have claimed the track's key, use the 'altTrack' and 'altEnd' traits to define the audio file and its end time.

### door
The purpose of keys is to unlock doors. To set the track to require a key to advance to a hidden track, set the door trait to an array. The first value of the array defines what object you're looking for (in reference to the inventoryItems array), the second should be how many of that key are required to unlock the door. The 'doorDestination' trait defines what track unlocking the door would take you to. The following example requires 3 gems, and would take the user to track 7 upon hitting the action door with the required gems in inventory:
```
"door": [2,3],
"doorDestination": 7
```

A door
Door: [0, 3]
In this example, the door requires the user to have 3 rabbits to unlock. 0 referencing the inventory items array, 3 referencing the required amount of that item.