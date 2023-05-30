const MODIFY_TREEDATA = "treeData/MODIFY_TREEDATA";
const INIT_TREEDATA = "treeData/INIT_TREEDATA";

// 액션 생성함수를 만든다.
export const modifyTreeData = (data) => ({ data: data, type: MODIFY_TREEDATA });
export const initTreeData = () => ({ type: INIT_TREEDATA });

// 초기값 제작
const initialState = [];

/* 리듀서 선언 */
export default function treeData(state = initialState, action) {
  switch (action.type) {
    case MODIFY_TREEDATA:
      return action.data;
    case INIT_TREEDATA:
      return initialState;
    default:
      return state;
  }
}
