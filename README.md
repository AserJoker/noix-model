# @noix/model

A library for state manager with model.

## what is model ?

Model is a set for logic and data.in codes,it is contains two part named "effect" and "state". state means current data,effect is use for change "state".
a example model likes:

```javascript
const demo = {
  state: {
    count: 0,
  },
  effect: {
    addCount(payload) {
      this.setState("count", this.state.count + 1);
    },
  },
  name: "demo",
};
```

## what is container?

Container is a set for models.but container not keep the current state for any model.for container,two action is export for coder "dispatch" and "effect".
create a container likes:

```javascript
// init demo model
const { dispatch, effect } = useContainer([demo]);
```

### dispatch

Dispatch means call a effect with model name and effect name and effect payload.
likes:

```javascript
dispatch("demo", "addCount", {});
```

only dispatch can change state.

### effect

Effect means watching the change between a state.when state changed effect.handle will be call.

```javascript
effect({
  modelName: "demo",
  token: "count",
  handle: (newState) => {
    // Do something
  },
});
```

### token

All of the token in this library is support string addressing.
likes:

```javascript
const model = {
  state: {
    data: {
      count: 0,
    },
  },
  effect: {
    addCount(payload) {
      this.setState("data.count", this.state.data.count + 1);
    },
  },
};
```

## Some performance processing

This library will automatically collect changes to the dispatch.
likes:

```javascript
const model = {
  state: {
    count: 0,
  },
  effect: {
    addCount(payload) {
      this.setState("count", this.state.count + 1);
      this.setState("count", this.state.count + 1);
    },
  },
};
```

It just trigger once effect.and the effect newState is the last state.
However,if your effect function is a async function,scene is different.
If function using async/await to bind all async task to self
like

```javascript
async addCount(payload){
    await fetch(...)
}
```

This will be consistent with the synchronized scenario.

Another scene:

```javascript
const model = {
  state: {
    count: 0,
  },
  effect: {
    addCount(payload) {
      setTimeout(() => {
        this.setState("count", this.state.count + 1);
      }, 3000);
      setTimeout(() => {
        this.setState("count", this.state.count + 1);
      }, 3000);
    },
  },
};
```

it will trigger twice effect when addCount called.
