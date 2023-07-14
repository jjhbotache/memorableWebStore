export default function LoginForm({ changeForm, submitedFormFunction }) {
  return (
    <>
      <h1 className="title text-center">Login</h1>
      <form onSubmit={submitedFormFunction}>
        <div className="col-12 mt-4">
          <input
            className="form-control"
            type="number"
            name="id"
            placeholder="Id"
          />
        </div>

        <div className="col-12 mt-4">
          <input
            className="form-control"
            type="number"
            name="phone"
            placeholder="Phone number"
          />
        </div>
          <button className="btn" type="submit">
            login
          </button>
      </form>
      <div className="col-12 d-flex justify-align-content-between">
        <button className="" onClick={changeForm}>
          Not registered yet?
        </button>
      </div>
    </>
  );
}
