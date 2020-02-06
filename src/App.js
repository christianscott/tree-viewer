// @ts-check
import * as im from "immutable";
import React from "react";
import "./App.css";
import { TreeViewer } from "./tree_viewer";

function ListItem({ value, onClick, selected }) {
  return (
    <li
      onClick={onClick}
      className={classNames("ListItem", selected && "ListItem--active")}
    >
      {value}
    </li>
  );
}

function ListContainer({ children, addNode }) {
  return (
    <ul className="List">
      {children}
      <ListItem
        onClick={() => addNode(node("I'm new!"))}
        value="+"
        selected={false}
      />
    </ul>
  );
}

function App() {
  const tree = im.List.of(
    node("One"),
    node("Two", node("Five", node("Seven")), node("Six")),
    node("Three"),
    node("Four")
  );
  return (
    <div className="App Lists">
      <TreeViewer tree={tree} Node={ListItem} NodeContainer={ListContainer} />
    </div>
  );
}

function classNames(...cs) {
  return cs.filter(Boolean).join(" ");
}

const NodeRecord = im.Record({ value: "zero", children: im.List() });
function node(value, ...children) {
  return NodeRecord({ value, children: im.List(children) });
}

export default App;
