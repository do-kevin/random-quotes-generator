export const Counter = (props: { count: number }) => {
  return (
    <span
      style={{
        position: "absolute",
        marginLeft: "0.05rem",
        bottom: "1.25rem",
        background: "#618be4",
        color: "white",
        padding: "0.2rem 0.5rem",
        borderRadius: "25px",
        textAlign: "center",
        cursor: "default",
      }}
    >
      {props.count}
    </span>
  );
};
