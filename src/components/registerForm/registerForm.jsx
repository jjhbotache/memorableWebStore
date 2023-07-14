export default function RegisterForm({ submitedFormFunction, changeForm }) {
  return (
    <>
      <h1 className="title text-center">Register</h1>
      <form onSubmit={submitedFormFunction}>
        <div className="col-12 mt-4">
          <input
            className="form-control"
            type="number"
            name="id"
            placeholder="Id"
          />
        </div>
        <div className="col-12 mt-2">
          <input
            className="form-control"
            type="number"
            name="phone"
            placeholder="Phone number"
          />
        </div>
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" />
        <label htmlFor="lastName">Last name:</label>
        <input type="text" name="lastName" />
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" />
        <button className="btn" type="submit">
          register
        </button>
      </form>
      <button onClick={changeForm}>Already registered?</button>
    </>
  );
}
