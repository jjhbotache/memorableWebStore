export default function LoginForm({changeForm,submitedFormFunction}) {
  return(
    <>
    <form onSubmit={submitedFormFunction}>
      <label htmlFor="id">Id:</label>
      <input type="number" name="id"/>
      <label htmlFor="phone">Phone number:</label>
      <input type="number" name="phone"/>
      <button className="btn" type="submit">login</button>
    </form>
    <button className="" onClick={changeForm}>Not registered yet?</button>
  </>
  )
  
};
