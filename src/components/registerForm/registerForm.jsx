export default function RegisterForm({submitedFormFunction,changeForm}) {
  return(
    <div className="container">
    <h1>Register</h1>
    <form className="my-2" onSubmit={submitedFormFunction}>
      <div className="mb-3">
        <label htmlFor="id" className="form-label">Id: </label>
        <input type="number" className="form-control " name="id" placeholder="1102335218"/>
      </div>
      <div className="mb-3">
        <label htmlFor="phone" className="form-label">Phone number: </label>
        <input type="number" className="form-control " name="phone" placeholder="3012458725"/>
      </div>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">First name: </label>
        <input type="text" className="form-control " name="name" placeholder="Julian"/>
      </div>
      <div className="mb-3">
        <label htmlFor="lastName" className="form-label">Last name: </label>
        <input type="text" className="form-control " name="lastName" placeholder="Reyes"/>
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email: </label>
        <input type="text" className="form-control " name="email" placeholder="example@gmail.com"/>
      </div>
      <button className="btn" type="submit">register</button>
    </form>
    <button className="btn btn-dark" onClick={changeForm}>Already registered?</button>
    </div>
  )
};
