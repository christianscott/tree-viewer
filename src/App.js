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

function ListContainer({ children }) {
  return <ul className="List">{children}</ul>;
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

function node(value, ...children) {
  return { value, children: im.List(children) };
}

export default App;
