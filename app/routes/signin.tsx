export default function Login() {
  return (
    <form>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}