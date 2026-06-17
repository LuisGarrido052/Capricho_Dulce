export default function NoticeBar({ message }) {
  if (!message) {
    return null
  }

  return <div className="notice-bar">{message}</div>
}
