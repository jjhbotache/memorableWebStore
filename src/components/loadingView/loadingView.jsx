import Spinner from "../spinner/spinner";

export default function LoadingView() {
  return(
    <div className="d-flex justify-content-center align-content-center" style={{height: "90vh"}}>
      <Spinner />
    </div>
  )

};
