export default function RegisterForm({submitedFormFunction,changeForm}) {
  return(
    <>
    <form onSubmit={submitedFormFunction}>
      <label htmlFor="id">Id:</label>
      <input type="number" name="id"/>
      <label htmlFor="phone">Phone number:</label>
      <input type="number" name="phone"/>
      <label htmlFor="name">Name:</label>
      <input type="text" name="name"/>
      <label htmlFor="lastName">Last name:</label>
      <input type="text" name="lastName"/>
      <label htmlFor="email">Email:</label>
      <input type="email" name="email"/>
      <button type="submit">register</button>
    </form>
    <button onClick={changeForm}>Already registered?</button>
    </>
  )
};
