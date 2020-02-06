// @ts-check
import * as im from "immutable";
import React from "react";

export function TreeViewer({ tree: initialTree, Node, NodeContainer }) {
  const [tree] = React.useState(initialTree);
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

  return (
    <TreeViewerImpl
      depth={0}
      tree={tree}
      selectNode={selectNode}
      getSelectedNodeAtDepth={getSelectedNodeAtDepth}
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
  Node,
  NodeContainer
}) {
  const selectedNode = getSelectedNodeAtDepth(depth);
  return (
    <>
      <NodeContainer>
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
      {selectedNode && selectedNode.children.size > 0 && (
        <TreeViewerImpl
          depth={depth + 1}
          tree={selectedNode.children}
          selectNode={selectNode}
          getSelectedNodeAtDepth={getSelectedNodeAtDepth}
          Node={Node}
          NodeContainer={NodeContainer}
        />
      )}
    </>
  );
}
