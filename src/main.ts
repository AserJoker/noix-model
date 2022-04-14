import { useContainer, defineModel } from "./index";
const demo = defineModel({
  state: {
    count: 0,
  },
  effect: {
    addCount() {
      this.setField("count", this.state.count + 1);
    },
  },
  name: "demo",
});
const { effect, dispatch } = useContainer([demo]);
const app = document.getElementById("app");
const button = document.createElement("button");
app?.append(button);
button.onclick = () => {
  dispatch("demo", "addCount", {});
};
effect({
  model: "demo",
  token: "count",
  handle: (val: number) => {
    button.innerHTML = `${val}`;
  },
});
