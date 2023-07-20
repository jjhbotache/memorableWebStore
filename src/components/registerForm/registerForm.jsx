export default function RegisterForm({ submitedFormFunction, changeForm }) {
  return (
    <div className="col-12 d-flex justify-content-center">
      <div className="col-8 col-md-5 filter rounded-4 mt-4" id="container">
      <h1 className="title text-center">Register</h1>
      <form onSubmit={submitedFormFunction}>
        <div className="col-12 mt-3 ">
          <label htmlFor="id" className="">
            ID :
          </label>
          <input
            id="id"
            className="form-control"
            type="number"
            name="id"
            placeholder="1106226257"
          />
        </div>

        <div className="col-12 mt-1">
          <label htmlFor="phone" className="">
            Phone Number :
          </label>
          <input
            id="phone"
            className="form-control"
            type="number"
            name="phone"
            placeholder="3185247059"
          />
        </div>
        <div className="col-12 mt-2">
          <label htmlFor="name">Name :</label>
          <input
            id="name"
            className="form-control"
            type="text"
            name="name"
            placeholder="Name"
          />
        </div>

        <div className="col-12 mt-2">
          <label htmlFor="lastName">Last Name :</label>
          <input
            id="lastName"
            className="form-control"
            type="text"
            name="lastName"
            placeholder="Last name"
          />
        </div>

        <div className="col-12 mt-2">
          <label htmlFor="email">Email :</label>
          <input
            id="email"
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
        <div className="text-center mb-0">
          <a
            role="button"
            className="icon-link icon-link-hover text-dark text-decoration-none py-0"
          >
            Are you already registered?
          </a>
        </div>
      </div>
      </div>
    </div>
  );
}
