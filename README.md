# IDLENESS

Vanilla JS class to monitor the user's state of idleness.

##### [Check out the DEMO](https://wstaeblein.github.io/idleness/)


## Features

- No dependencies
- Can have it's configurations changed on the fly.
- Can be stopped and started at will.
- Provides the time elapsed (in ms) since the last activity.


Use this class if you need to monitor user activity. It will let your code know if the user goes idle after some time has passed. It can fire an event or call a function you provide when instatiating or resetting the configurations.


## Usage & Code Examples

Add the following files to your project:
- idleness.js


```javascript
const configs = { timeout: 6000, throttle: 300, idleFn: handleIdle, useEvent: true };
const idle = new idleness(configs, true);

// Event
document.addEventListener('idle', (event) => {
    console.log(event.detail.idle ? 'IDLE' : 'ACTIVE');
});

// Return function
function handleIdle(isidle) {
    console.log(isidle ? 'IDLE' : 'ACTIVE');
}
```

Should you need to change one or more of the settings passed on instatiation

```javascript
idle.setConfigs( { timeout: 12000, throttle: 250 });
```

When it falls out of scope, you only need to call the stop method if the start method (either on its own or during initialization by means of the autoStart flag) was called before. The stop method will remove all bindings and clear all timers.

```javascript
idle.stop();
```


## About

Although there are many such solutions around, I was looking for one that, despite simple and small, would allow the settings to change on the fly, would give me back the elapsed time and did not need a full package install. 

This class was tested on Brave 1.51, Chrome 113 and Firefox 111.



## Licence

This project is licensed under the [MIT Licence](https://github.com/wstaeblein/texthighlighter/blob/main/LICENSE)