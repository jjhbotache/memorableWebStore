export default function LoginForm({changeForm,submitedFormFunction}) {
  return(
    <div className="container mt-2">
    <h1>Login</h1>
    <form className="my-2" onSubmit={submitedFormFunction}>
      <div className="mb-3">
        <label htmlFor="id" className="form-label">Id: </label>
        <input type="number" className="form-control " name="id"placeholder="1102335218"/>
      </div>
      <div className="mb-3">
        <label htmlFor="phone" className="form-label">Phone: </label>
        <input type="number" className="form-control " name="phone"placeholder="3012167584"/>
      </div>
      <button type="submit" className="btn">Submit</button>
    </form>
    <button className="btn btn-dark" onClick={changeForm}>Not registered yet?</button>

  </div>
  )
  
};
