export default function Layout({ children }) {
  return (
    <>
      <div>This is header</div>
      <main>{children}</main>
    </>
  )
}