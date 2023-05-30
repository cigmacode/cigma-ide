function computeSelectionBox(editors, selectedIdx) {
  const result = {
    top: Number.MAX_SAFE_INTEGER,
    left: Number.MAX_SAFE_INTEGER,
    height: Number.MIN_SAFE_INTEGER,
    width: Number.MIN_SAFE_INTEGER,
  };
  result.top = editors[selectedIdx].top;
  result.left = editors[selectedIdx].left;
  result.height = editors[selectedIdx].height;
  result.width = editors[selectedIdx].width;

  return result;
}

export default computeSelectionBox;
