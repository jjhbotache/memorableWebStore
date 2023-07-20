export default function LoginForm({ changeForm, submitedFormFunction }) {
  return (
    <div
      id="container"
      className="d-flex flex-column justify-content-center align-items-center"
    >
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

        <div className="col-12 mt-3">
          <input
            className="form-control"
            type="number"
            name="phone"
            placeholder="Phone number"
          />
        </div>
        <div className="col-12 d-flex justify-content-center mt-4">
          <button className="btn p-1 px-4" type="submit">
            Enter
          </button>
        </div>
      </form>
      <div id="container-animation" className="col-12 d-flex justify-content-center mt-auto shadow" onClick={changeForm}>
        <div>
          <a role="button" className="icon-link icon-link-hover text-dark text-decoration-none py-0">
            Not registered yet?
          </a>
        </div>
      </div>
    </div>
  );
}
