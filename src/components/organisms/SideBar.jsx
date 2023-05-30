import { useDispatch } from "react-redux";
import styles from "../../styles/organisms/SideBar.module.scss";
import { setCurrentTool } from "../../store/toolSlice";

const SideBar = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__inner}>
        <button onClick={() => dispatch(setCurrentTool("code-editor"))}>
          new CodeEditor
        </button>
      </div>
    </div>
  );
};

export default SideBar;
