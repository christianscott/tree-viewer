import * as im from "immutable";
import React from "react";

export function TreeViewer({ tree: initialTree, Node, NodeContainer }) {
  const [tree, setTree] = React.useState(initialTree);
  const [selectionPath, setSelectionPath] = React.useState(im.List());

  const getPathForDepth = depth => {
    const pathAtDepth = selectionPath.slice(0, depth + 1);
    const nRemainingPathElements = depth + 1 - pathAtDepth.size;
    return pathAtDepth
      .concat(im.Repeat(undefined, nRemainingPathElements))
      .interpose("children");
  };

  const getSelectedNodeAtDepth = depth => {
    const path = getPathForDepth(depth);
    return path.size > 0 ? tree.getIn(path) : undefined;
  };

  const selectNode = (depth, childIndex) => {
    const nextSelectionPath = selectionPath
      .slice(0, depth + 1)
      .set(depth, childIndex);
    setSelectionPath(nextSelectionPath);
  };

  const addNode = (depth, child) => {
    const pathForParent = getPathForDepth(depth - 1);
    if (pathForParent == null || pathForParent.size === 0) {
      const nextTree = tree.push(child);
      setTree(nextTree);
      return;
    }

    const pathForSiblings = [...pathForParent, "children"];
    const nextTree = tree.setIn(
      pathForSiblings,
      tree.getIn(pathForSiblings).push(child)
    );
    setTree(nextTree);
  };

  return (
    <TreeViewerImpl
      depth={0}
      tree={tree}
      selectNode={selectNode}
      getSelectedNodeAtDepth={getSelectedNodeAtDepth}
      addNode={addNode}
      Node={Node}
      NodeContainer={NodeContainer}
    />
  );
}

function TreeViewerImpl({
  depth,
  tree,
  selectNode,
  getSelectedNodeAtDepth,
  addNode,
  Node,
  NodeContainer
}) {
  const selectedNode = getSelectedNodeAtDepth(depth);
  return (
    <>
      <NodeContainer addNode={node => addNode(depth, node)}>
        {tree.map((node, index) => {
          const onClick = () => selectNode(depth, index);
          return (
            <Node
              key={index}
              value={node.value}
              selected={node === selectedNode}
              onClick={onClick}
            >
              {node.value}
            </Node>
          );
        })}
      </NodeContainer>
      {selectedNode && (
        <TreeViewerImpl
          depth={depth + 1}
          tree={selectedNode.children}
          addNode={addNode}
          selectNode={selectNode}
          getSelectedNodeAtDepth={getSelectedNodeAtDepth}
          Node={Node}
          NodeContainer={NodeContainer}
        />
      )}
    </>
  );
}
