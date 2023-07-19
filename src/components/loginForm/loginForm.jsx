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

        <div className="col-12 mt-3">
          <input
            className="form-control"
            type="number"
            name="phone"
            placeholder="Phone number"
          />
        </div>
        <div className="col-12 d-flex justify-content-center mt-4">
          <button className="btn py-0" type="submit">
            Enter
          </button>
        </div>
      </form>
      <div className="col-12 d-flex justify-content-center mt-2"> 
        <button className="btn py-0" onClick={changeForm}>
          Not registered yet?
        </button>
      </div>
    </>
  );
}
