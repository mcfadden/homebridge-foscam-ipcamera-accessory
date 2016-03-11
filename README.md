# Foscam IPCamera Homebridge Accessory

Accessory support for the [Foscam](http://foscam.us/) IP Cameras within [Homebridge](https://github.com/nfarina/homebridge) so that you can use Siri to control your cameras.

This project is not affiliated with, supported by, or endorsed by Foscam.


# Notes

Since HomeKit doesn't really have the concept of a camera, or an arbitrary position of an object, this is "hacked" onto the Window Covering Service Type so we can set the position.

I'm yet to find any Siri commands that work.



# Installation

At this time, this package is not in NPM and must be installed manually.

To do this copy the files to `/usr/local/lib/node_modules/homebridge-foscam-ipcamera-accessory/`

Or clone the repo:

    cd /usr/local/lib/node_modules/
    sudo git clone https://github.com/mcfadden/homebridge-foscam-ipcamera-accessory.git

Once the files are in place: run:

    cd /usr/local/lib/node_modules/homebridge-foscam-ipcamera-accessory
    sudo npm install

# Configuration

Add your cameras to your homebridge config:

    "accessories": [
        {
            "accessory": "FoscamIPCamera",
            "name": "Driveway Camera",
            "ip_address": "192.168.1.30",
            "username": "boss",
            "password": "boss",
            "hd_api": false
        },
    ]
    
If your model number starts with **FI9** set `hd_api` to `true`. If your model number starts with **FI8** set `hd_api` to `false`

# Usage
  
Because this is using the Window Covering controls, the values for the position is between 0 and 100 (percent). I'm converting that percentage directly to the preset position.

_Example: To put your camera into Preset 4 set the position to 4%._

For newer cameras that allow you to name your presets, they must be named numerically (ex: "1", "2", "3") in order for this to work.

## Scenes

Because most HomeKit interfaces use sliders for Window Coverings it's rather difficult to get your devices to go into a specific position. To get around this, I have been using HomeKit scenes that set the Characteristic to the specific value.

## Siri

If you find any siri commands that work, let me know