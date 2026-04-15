export default function Toast({ msg, visible }) {
  return (
    <div className={`toast${visible ? ' show' : ''}`}>
      <div className="toast-dot" />
      <span>{msg}</span>
    </div>
  );
}
