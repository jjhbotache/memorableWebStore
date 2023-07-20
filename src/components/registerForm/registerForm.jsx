export default function RegisterForm({ submitedFormFunction, changeForm }) {
  return (
    <div id="container" className="container">
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
        <div className="col-12 mt-2">
          <input
            className="form-control"
            type="text"
            name="name"
            placeholder="Name"
          />
        </div>

        <div className="col-12 mt-2">
          <input
            className="form-control"
            type="text"
            name="lastName"
            placeholder="Last name"
          />
        </div>

        <div className="col-12 mt-2">
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Email"
          />
        </div>
        <div className="col-12 d-flex justify-content-center my-4">
          <button className="btn p-2 px-4" type="submit">
            Register
          </button>
        </div>
      </form>
      <div
        id="container-animation"
        className="col-12 d-flex justify-content-center mt-auto shadow"
        onClick={changeForm}
      >
        <div>
          <a
            role="button"
            className="icon-link icon-link-hover text-dark text-decoration-none py-0"
          >
            Are you already registered? 
          </a>
        </div>
      </div>
    </div>
  );
}
